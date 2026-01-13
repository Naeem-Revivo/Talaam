import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import StudyModeLayout from '../../components/dashboard/questionSession/StudyModeLayout';
import TestModeLayout from '../../components/dashboard/questionSession/TestModeLayout';
import SessionCompletionModal from '../../components/dashboard/questionSession/SessionCompletionModal';
import Loader from '../../components/common/Loader';
import studentQuestionsAPI from '../../api/studentQuestions';
import subscriptionAPI from '../../api/subscription';
import { showErrorToast, showSuccessToast } from '../../utils/toastConfig';
import {
  generateSessionId,
  findExistingSession,
  saveSessionState,
  loadSessionState,
  clearSession,
  clearExpiredSessions,
} from '../../utils/sessionStorage';

const buildInitialState = (questions, mode = 'study') =>
  questions.map((_, index) => ({
    selectedOption: null,
    isCorrect: null,
    showFeedback: false,
    showHint: false,
    isSubmitted: false, // Track if question has been submitted
    isMarked: false, // Track if question is marked for review
    status: mode === 'test' && index === 0 ? 'current' : null, // First question is current in test mode
  }));

const QuestionSessionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode');
  const mode = modeParam === 'test' ? 'test' : 'study';

  // Get filters from navigation state (preferred) or URL params (fallback)
  const stateFilters = location.state?.filters || {};
  // Check if resuming from a paused session
  const pausedSessionId = location.state?.pausedSessionId || searchParams.get('resume');

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const sessionInfoRef = useRef({ examId: null, subjectId: null, topicId: null });
  const pausedSessionIdRef = useRef(null); // Store paused session ID for updating on completion
  const pausedTimeTakenRef = useRef(0); // Store original paused time for calculating total time
  const resumeStartTimeRef = useRef(null); // Store when the session was resumed (for calculating resumed time)
  const hasInteractedAfterResumeRef = useRef(false); // Track if user has interacted after resuming paused session
  const timeLimitRef = useRef(null); // Store time limit in minutes from API response

  // Transform API question format to component format
  const transformQuestion = (apiQuestion, index) => {
    const optionsObj = apiQuestion.options || {};
    const options = ['A', 'B', 'C', 'D'].map((key) => ({
      id: key,
      text: optionsObj[key] || '',
    })).filter(opt => opt.text); // Remove empty options

    return {
      id: apiQuestion._id || apiQuestion.id || `Q-${index + 1}`,
      shortId: apiQuestion.shortId || null,
      itemNumber: index + 1,
      prompt: apiQuestion.questionText || '',
      options,
      correctAnswer: apiQuestion.correctAnswer || null, // Will be null initially, set after submission
      explanation: apiQuestion.explanation || '',
      questionType: apiQuestion.questionType || 'MCQ',
      exam: apiQuestion.exam,
      subject: apiQuestion.subject,
      topic: apiQuestion.topic,
    };
  };

  // Clear expired sessions on mount
  useEffect(() => {
    clearExpiredSessions();
  }, []);

  // Check subscription status on component mount
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        setCheckingSubscription(true);
        const response = await subscriptionAPI.getMySubscription();
        if (response.success && response.data?.subscription) {
          const subscription = response.data.subscription;
          // Check if subscription is active and not expired
          const isActive = subscription.isActive === true && 
                          subscription.paymentStatus === 'Paid' &&
                          new Date(subscription.expiryDate) > new Date();
          setHasActiveSubscription(isActive);
          
          // If no active subscription, redirect to practice page
          if (!isActive) {
            showErrorToast('Please subscribe to access study mode and test mode');
            setTimeout(() => {
              navigate('/dashboard/practice');
            }, 1500);
          }
        } else {
          setHasActiveSubscription(false);
          showErrorToast('Please subscribe to access study mode and test mode');
          setTimeout(() => {
            navigate('/dashboard/practice');
          }, 1500);
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        setHasActiveSubscription(false);
        showErrorToast('Please subscribe to access study mode and test mode');
        setTimeout(() => {
          navigate('/dashboard/practice');
        }, 1500);
      } finally {
        setCheckingSubscription(false);
      }
    };
    checkSubscription();
  }, [navigate]);

  // Fetch questions based on mode
  useEffect(() => {
    // Don't fetch questions if subscription check is still in progress or user doesn't have subscription
    if (checkingSubscription || !hasActiveSubscription) {
      return;
    }

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        // If resuming from a paused session, fetch from DB
        if (pausedSessionId) {
          try {
            const pausedResponse = await studentQuestionsAPI.getPausedSession(pausedSessionId);
            if (pausedResponse.success && pausedResponse.data) {
              const pausedData = pausedResponse.data;
              
              // Store the paused session ID and time for later use when completing
              pausedSessionIdRef.current = pausedSessionId;
              pausedTimeTakenRef.current = pausedData.timeTaken || 0;
              
              // Store timeLimit if available
              if (pausedData.timeLimit) {
                timeLimitRef.current = pausedData.timeLimit;
              }
              
              // Set session info
              sessionInfoRef.current = {
                examId: pausedData.examId,
                subjectId: pausedData.subjectId,
                topicId: pausedData.topicId,
              };

              // Set questions and state from paused session
              setQuestions(pausedData.questions || []);
              const restoredState = pausedData.questionState || [];
              // Ensure status is set correctly for restored state
              const restoredWithStatus = restoredState.map((state) => {
                // If status is already set, use it; otherwise infer from isSubmitted
                const baseState = state.status ? state : {
                  ...state,
                  status: state.isSubmitted ? 'submit' : null,
                };
                // Ensure isMarked is preserved
                return {
                  ...baseState,
                  isMarked: baseState.isMarked || false,
                };
              });
              setQuestionState(restoredWithStatus);
              const restoredIndex = pausedData.currentIndex || 0;
              setCurrentIndex(restoredIndex);
              
              // Build visited indices from questions that have been answered, skipped, or submitted
              const visited = new Set();
              restoredWithStatus.forEach((state, idx) => {
                if (state?.selectedOption || state?.status === 'skipped' || state?.status === 'submit') {
                  visited.add(idx);
                }
              });
              if (visited.size === 0) {
                visited.add(restoredIndex);
              }
              setVisitedIndices(visited);
              
              // Set current status for restored index if not submitted (for test mode)
              // For study mode, we don't use status field, but we ensure the current question is properly set
              if (pausedData.mode === 'test' && restoredWithStatus[restoredIndex] && !restoredWithStatus[restoredIndex].isSubmitted && restoredWithStatus[restoredIndex].status !== 'submit') {
                setQuestionState((prev) =>
                  prev.map((state, idx) => 
                    idx === restoredIndex ? { ...state, status: 'current' } : state
                  )
                );
              }
              
              // Restore session start time: set it so that elapsed time calculation shows paused time initially
              // We set it to (current time - paused time) so that Date.now() - sessionStartTime.current = pausedTime
              // This way, when we resume, the timer shows the paused time and continues counting from there
              const pausedTime = pausedData.timeTaken || 0;
              sessionStartTime.current = Date.now() - pausedTime;
              // Store the resume start time for calculating total time later
              resumeStartTimeRef.current = Date.now();
              
              // Restore timer for test mode (use stored remaining time from pause)
              if (pausedData.mode === 'test' && pausedData.questions?.length > 0) {
                // Try to get remaining time from sessionStorage first (most accurate, stored when pausing)
                let remaining = null;
                const pauseDataKey = `pause_data_${pausedSessionId}`;
                try {
                  const storedPauseData = sessionStorage.getItem(pauseDataKey);
                  if (storedPauseData) {
                    const pauseData = JSON.parse(storedPauseData);
                    remaining = pauseData.remainingTime;
                    // Also restore timeLimit if available
                    if (pauseData.timeLimit) {
                      timeLimitRef.current = pauseData.timeLimit;
                    }
                  }
                } catch (e) {
                  // Ignore parse errors
                }
                
                // Fallback: use remainingTime from API response or recalculate
                if (remaining === null || remaining === undefined) {
                  if (pausedData.remainingTime !== null && pausedData.remainingTime !== undefined) {
                    remaining = pausedData.remainingTime;
                  } else {
                    // Last resort: recalculate (less accurate if timeLimit wasn't stored)
                    const elapsedTime = pausedData.timeTaken || 0;
                    const timeLimitMinutes = pausedData.timeLimit || pausedData.questions.length;
                    const totalTimeMs = timeLimitMinutes * 60 * 1000;
                    remaining = Math.max(0, totalTimeMs - elapsedTime);
                  }
                }
                
                if (remaining > 0) {
                  // Set timer end time to current time + remaining time
                  // This ensures the timer continues from where it was paused
                  timerEndTimeRef.current = Date.now() + remaining;
                  setTimeRemaining(remaining);
                } else {
                  timerEndTimeRef.current = null;
                  setTimeRemaining(0);
                }
              }
              
              // Set session stats (only count correct/incorrect for study mode)
              const correctCount = pausedData.mode === 'study' 
                ? (pausedData.questionState?.filter(q => q.isCorrect === true).length || 0)
                : 0;
              const incorrectCount = pausedData.mode === 'study'
                ? (pausedData.questionState?.filter(q => q.isCorrect === false).length || 0)
                : 0;
              setSessionStats({
                correctCount,
                incorrectCount,
                totalQuestions: pausedData.questions?.length || 0,
              });
              
              // Generate a new session ID for the resumed session (don't use paused session ID)
              const filters = {
                exam: pausedData.examId,
                subject: pausedData.subjectId,
                topic: pausedData.topicId,
              };
              sessionIdRef.current = generateSessionId(pausedData.mode, filters);
              
              // Don't save resumed sessions to session storage
              // Ensure session is not marked as complete when resuming (even if all questions have feedback)
              setSessionComplete(false);
              isInitialLoad.current = false;
              setLoading(false);
              return; // Exit early, don't fetch new questions
            }
          } catch (error) {
            console.error('Error resuming paused session:', error);
            showErrorToast('Failed to resume paused session. Starting fresh session.');
            // Continue to fetch new questions
          }
        }

        // Get filters from navigation state (preferred) or URL params (fallback)
        const params = {};
        const filters = {};
        
        // Use state filters first (from navigation state)
        // If topics are provided, use only topics (they take precedence)
        if (stateFilters.topics && stateFilters.topics.length > 0) {
          // Multiple topics from state - join as comma-separated string
          params.topics = stateFilters.topics.join(',');
          filters.topics = stateFilters.topics;
        } else if (stateFilters.subject) {
          // Only use subject if no topics are selected
          params.subject = stateFilters.subject;
          filters.subject = stateFilters.subject;
        }
        
        // Add size for both modes
        if (stateFilters.size) {
          params.size = stateFilters.size;
        }
        
        // Add timeLimit only for test mode
        if (mode === 'test' && stateFilters.timeLimit) {
          params.timeLimit = stateFilters.timeLimit;
        }
        
        // If no state filters, fallback to URL params for backward compatibility
        if (!stateFilters.topics && !stateFilters.subject) {
          const exam = searchParams.get('exam');
          const subject = searchParams.get('subject');
          const topic = searchParams.get('topic');
          const topics = searchParams.get('topics');
          
          if (exam) {
            params.exam = exam;
            filters.exam = exam;
          }
          if (subject) {
            params.subject = subject;
            filters.subject = subject;
          }
          if (topic) {
            params.topic = topic;
            filters.topic = topic;
          }
          if (topics) {
            params.topics = topics;
            filters.topics = topics.split(',');
          }
        }

        // Check for existing session (only if not resuming from paused session)
        const existingSession = findExistingSession(mode, filters);
        let sessionId;
        let restoredState = null;

        if (existingSession) {
          sessionId = existingSession.sessionId;
          restoredState = existingSession.state;
        } else {
          sessionId = generateSessionId(mode, filters);
        }

        sessionIdRef.current = sessionId;

        let response;
        if (mode === 'test') {
          response = await studentQuestionsAPI.startTest(params);
        } else {
          response = await studentQuestionsAPI.getAvailableQuestions(params);
        }

        if (response.success && response.data?.questions) {
          const rawQuestions = response.data.questions;
          const transformedQuestions = rawQuestions.map((q, index) =>
            transformQuestion(q, index)
          );
          setQuestions(transformedQuestions);
          
          // Store timeLimit from API response for test mode
          if (mode === 'test' && response.data?.timeLimit) {
            timeLimitRef.current = response.data.timeLimit;
          }
          
          // Store session info from first question for saving results later
          if (transformedQuestions.length > 0 && rawQuestions.length > 0) {
            const firstQ = transformedQuestions[0];
            // Extract IDs properly - handle both object and string formats
            // Also check the raw API question data for examId, subjectId, topicId fields
            const rawQuestion = rawQuestions[0];
            
            const getExamId = () => {
              // First try direct examId field from API response
              if (rawQuestion?.examId) return rawQuestion.examId;
              // Then try from transformed question
              if (typeof firstQ.exam === 'string') return firstQ.exam;
              if (firstQ.exam?.id) return firstQ.exam.id;
              // Fallback to filters
              if (filters.exam) return filters.exam;
              return null;
            };
            const getSubjectId = () => {
              // First try direct subjectId field from API response
              if (rawQuestion?.subjectId) return rawQuestion.subjectId;
              // Then try from transformed question
              if (typeof firstQ.subject === 'string') return firstQ.subject;
              if (firstQ.subject?.id) return firstQ.subject.id;
              // Fallback to filters
              if (filters.subject) return filters.subject;
              return null;
            };
            const getTopicId = () => {
              // First try direct topicId field from API response
              if (rawQuestion?.topicId) return rawQuestion.topicId;
              // Then try from transformed question
              if (typeof firstQ.topic === 'string') return firstQ.topic;
              if (firstQ.topic?.id) return firstQ.topic.id;
              // Fallback to filters
              if (filters.topic) return filters.topic;
              return null;
            };
            
            sessionInfoRef.current = {
              examId: getExamId(),
              subjectId: getSubjectId(),
              topicId: getTopicId(),
            };
          }
          
          // Restore state from session if available
          if (restoredState && restoredState.questions) {
            // Verify question IDs match (questions might have changed)
            const questionIdsMatch = restoredState.questions.every(
              (q, idx) => idx < transformedQuestions.length && q.id === transformedQuestions[idx].id
            );
            
            if (questionIdsMatch && restoredState.questionState) {
              // Merge restored question data (explanations, correct answers) with fresh questions
              const mergedQuestions = transformedQuestions.map((q, idx) => {
                const restoredQ = restoredState.fullQuestions?.[idx];
                if (restoredQ) {
                  return {
                    ...q,
                    explanation: restoredQ.explanation || q.explanation,
                    correctAnswer: restoredQ.correctAnswer || q.correctAnswer,
                  };
                }
                return q;
              });
              setQuestions(mergedQuestions);
              
              // Restore all state
              const restoredStateData = restoredState.questionState || [];
              // Ensure status field exists for restored state
              const restoredWithStatus = restoredStateData.map((state) => ({
                ...state,
                status: state.status || (state.isSubmitted ? 'submit' : null),
                isMarked: state.isMarked || false, // Preserve marked state
              }));
              setQuestionState(restoredWithStatus);
              const restoredIndex = restoredState.currentIndex || 0;
              setCurrentIndex(restoredIndex);
              // Set current status for restored index if not submitted
              if (mode === 'test' && restoredWithStatus[restoredIndex] && !restoredWithStatus[restoredIndex].isSubmitted && restoredWithStatus[restoredIndex].status !== 'submit') {
                setQuestionState((prev) =>
                  prev.map((state, idx) => 
                    idx === restoredIndex ? { ...state, status: 'current' } : state
                  )
                );
              }
              setVisitedIndices(new Set(restoredState.visitedIndices || [0]));
              setSessionStats(restoredState.sessionStats || {
                correctCount: 0,
                incorrectCount: 0,
                totalQuestions: transformedQuestions.length,
              });
              if (restoredState.sessionStartTime) {
                sessionStartTime.current = restoredState.sessionStartTime;
              }
              
              // Restore timer for test mode
              if (mode === 'test' && restoredState.timerEndTime) {
                const now = Date.now();
                const remaining = restoredState.timerEndTime - now;
                if (remaining > 0) {
                  timerEndTimeRef.current = restoredState.timerEndTime;
                  setTimeRemaining(remaining);
                } else {
                  // Timer already expired, auto-submit
                  timerEndTimeRef.current = null;
                  setTimeRemaining(0);
                  // Will trigger auto-submit in timer effect
                }
              }
              
              // Restore explanation visibility for current question
              const currentState = restoredState.questionState[restoredState.currentIndex || 0];
              if (currentState?.showFeedback) {
                setShowExplanation(true);
                setShowExplanationPanel(true);
              }
              
              isInitialLoad.current = false;
            } else {
              // Questions don't match, start fresh
              isInitialLoad.current = true;
            }
          } else {
            // No existing session, start fresh
            isInitialLoad.current = true;
          }
        } else {
          throw new Error('No questions available');
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError(error.message || 'Failed to load questions');
        showErrorToast(error.message || 'Failed to load questions');
        // Navigate back to practice page on error
        setTimeout(() => {
          navigate('/dashboard/practice');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [mode, searchParams, navigate, location.state, checkingSubscription, hasActiveSubscription, pausedSessionId]);

  const [questionState, setQuestionState] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showQuestionNav, setShowQuestionNav] = useState(false);
  const [visitedIndices, setVisitedIndices] = useState(new Set([0]));
  const [showExplanation, setShowExplanation] = useState(false);
  const [showExplanationPanel, setShowExplanationPanel] = useState(false);
  const isInitialLoad = useRef(true);
  const sessionStartTime = useRef(null);
  const sessionIdRef = useRef(null);
  const [sessionStats, setSessionStats] = useState({
    correctCount: 0,
    incorrectCount: 0,
    totalQuestions: 0,
  });
  
  // Timer state for test mode
  const [timeRemaining, setTimeRemaining] = useState(null); // in milliseconds
  const timerEndTimeRef = useRef(null); // when the timer should end
  const timerIntervalRef = useRef(null);


  // Initialize question state when questions are first loaded
  useEffect(() => {
    if (questions.length > 0 && isInitialLoad.current) {
      const initialState = buildInitialState(questions, mode);
      // Set first question as current in test mode
      if (mode === 'test' && initialState.length > 0) {
        initialState[0].status = 'current';
      }
      setQuestionState(initialState);
      setVisitedIndices(new Set([0]));
      // Hide explanation initially
      setShowExplanation(false);
      setShowExplanationPanel(false);
      // Initialize session start time
      if (!sessionStartTime.current) {
        sessionStartTime.current = Date.now();
      }
      setSessionStats((prev) => ({
        ...prev,
        totalQuestions: questions.length,
      }));
      
      // Initialize timer for test mode
      if (mode === 'test' && questions.length > 0) {
        // Use timeLimit from API response if available, otherwise default to 1 minute per question
        const timeLimitMinutes = timeLimitRef.current || questions.length;
        const totalTimeMs = timeLimitMinutes * 60 * 1000; // Convert minutes to milliseconds
        timerEndTimeRef.current = Date.now() + totalTimeMs;
        setTimeRemaining(totalTimeMs);
      }
      
      isInitialLoad.current = false;
    }
  }, [questions, mode]);

  const handleAutoSubmit = useCallback(async () => {
    if (sessionComplete || mode !== 'test') return;
    
    // Mark session as complete
    setSessionComplete(true);
    
    // Clear timer interval
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    // Mark all unanswered questions as skipped, then submit
    setQuestionState((prevState) => {
      const updatedState = prevState.map((state) => {
        if (!state.isSubmitted && state.status !== 'submit' && state.status !== 'skipped') {
          return { ...state, status: 'skipped' };
        }
        return state;
      });
      
      // Submit answers after state update
      (async () => {
    try {
      // If resuming from paused session, add paused time + resumed time
      let totalTime;
      if (pausedSessionIdRef.current) {
        const resumedTime = resumeStartTimeRef.current ? Date.now() - resumeStartTimeRef.current : 0;
        totalTime = pausedTimeTakenRef.current + resumedTime;
      } else {
        totalTime = sessionStartTime.current ? Date.now() - sessionStartTime.current : 0;
      }
      const timeTakenMs = totalTime;
      
      if (sessionInfoRef.current.examId) {
            // Prepare answers - include all questions
            // Skipped questions should have empty string (counts as incorrect)
            const answers = questions.map((q, idx) => {
              const state = updatedState[idx];
              return {
          questionId: q.id,
                selectedAnswer: state?.status === 'skipped' ? '' : (state?.selectedOption || ''),
              };
            });

        const response = await studentQuestionsAPI.submitTestAnswers(
          sessionInfoRef.current.examId,
          answers,
          timeTakenMs
        );

        // Store results
        if (response.success && response.data) {
          const resultsKey = `test_results_${sessionIdRef.current}`;
          sessionStorage.setItem(resultsKey, JSON.stringify(response.data));
        }
        
        const sessionKey = `session_saved_${sessionIdRef.current}`;
        sessionStorage.setItem(sessionKey, 'true');
      }
    } catch (error) {
      console.error('Error auto-submitting test:', error);
      showErrorToast('Test time expired. Answers have been submitted.');
    }
      })();
      
      return updatedState;
    });
  }, [sessionComplete, mode, questions]);
  
  // Timer countdown for test mode
  useEffect(() => {
    if (mode !== 'test' || !timerEndTimeRef.current || sessionComplete) {
      return;
    }
    
    const updateTimer = () => {
      const now = Date.now();
      const remaining = timerEndTimeRef.current - now;
      
      if (remaining <= 0) {
        // Timer expired - auto-submit
        setTimeRemaining(0);
        handleAutoSubmit();
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
      } else {
        setTimeRemaining(remaining);
      }
    };
    
    // Update immediately
    updateTimer();
    
    // Update every second
    timerIntervalRef.current = setInterval(updateTimer, 1000);
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [mode, sessionComplete, questions, questionState]);

  // Save session state whenever it changes (but not for resumed paused sessions)
  useEffect(() => {
    // Don't save to session storage if resuming from a paused session
    if (pausedSessionId) {
      return;
    }
    
    if (sessionIdRef.current && questions.length > 0 && questionState.length > 0) {
      const stateToSave = {
        mode,
        filters: stateFilters,
        questions: questions.map((q) => ({ id: q.id })),
        // Save full question data for restoration (explanations, correct answers)
        fullQuestions: questions.map((q) => ({
          id: q.id,
          explanation: q.explanation,
          correctAnswer: q.correctAnswer,
        })),
        questionState,
        currentIndex,
        visitedIndices: Array.from(visitedIndices),
        sessionStats,
        sessionStartTime: sessionStartTime.current,
        // Save timer end time for test mode
        timerEndTime: mode === 'test' ? timerEndTimeRef.current : null,
      };
      saveSessionState(sessionIdRef.current, stateToSave);
    }
  }, [questionState, currentIndex, visitedIndices, sessionStats, mode, stateFilters, questions, pausedSessionId]);

  // Save session when it completes (for both test and study modes)
  useEffect(() => {
    const saveSessionOnComplete = async () => {
      if (!sessionComplete || questions.length === 0 || questionState.length === 0) {
        return;
      }

      // Check if we've already saved this session (prevent duplicate saves)
      const sessionKey = `session_saved_${sessionIdRef.current}`;
      if (sessionStorage.getItem(sessionKey)) {
        return;
      }

      try {
        // Calculate total time: if resuming from paused session, add paused time + resumed time
        // Otherwise, calculate from session start time
        let totalTimeTakenMs;
        if (pausedSessionIdRef.current) {
          // For resumed sessions: total time = paused time + resumed time
          const resumedTime = resumeStartTimeRef.current ? Date.now() - resumeStartTimeRef.current : 0;
          totalTimeTakenMs = pausedTimeTakenRef.current + resumedTime;
        } else {
          // For normal sessions: total time = current time - session start time
          totalTimeTakenMs = sessionStartTime.current ? Date.now() - sessionStartTime.current : 0;
        }

        // Check if we're completing a paused session
        if (pausedSessionIdRef.current) {
          // Update the paused session to completed
          const questionsData = questions.map((q, idx) => {
            const state = questionState[idx];
            const hasAnswer = state?.selectedOption !== null && state?.selectedOption !== undefined && state?.selectedOption !== '';
            // For study mode: only set isCorrect if question was answered, otherwise null
            // For test mode: isCorrect will be calculated when test is submitted
            const isCorrect = mode === 'study' 
              ? (hasAnswer ? (state?.isCorrect ?? null) : null)
              : (hasAnswer ? (state?.isCorrect ?? false) : false);
            
            return {
              questionId: q.id,
              selectedAnswer: getSelectedAnswer(state), // Handles skipped questions
              isCorrect: isCorrect,
            };
          });

          const response = await studentQuestionsAPI.completePausedSession(
            pausedSessionIdRef.current,
            {
              mode,
              questions: questionsData,
              timeTaken: totalTimeTakenMs,
            }
          );

          // Mark as saved
          sessionStorage.setItem(sessionKey, 'true');
          
          // Store test results for later use when viewing summary (test mode only)
          if (mode === 'test' && response.success && response.data) {
            const resultsKey = `test_results_${sessionIdRef.current}`;
            sessionStorage.setItem(resultsKey, JSON.stringify(response.data));
          }
        } else {
          // Normal flow: create new session
        if (mode === 'study') {
          // Save study mode session results
          if (sessionInfoRef.current.examId) {
            const questionsData = questions.map((q, idx) => ({
              questionId: q.id,
                selectedAnswer: getSelectedAnswer(questionState[idx]), // Handles skipped questions
              isCorrect: questionState[idx]?.isCorrect || false,
            }));

            await studentQuestionsAPI.saveStudySessionResults({
              examId: sessionInfoRef.current.examId,
              subjectId: sessionInfoRef.current.subjectId,
              topicId: sessionInfoRef.current.topicId,
              questions: questionsData,
              timeTaken: timeTakenMs,
            });

            // Mark as saved
            sessionStorage.setItem(sessionKey, 'true');
          }
        } else if (mode === 'test') {
          // Save test mode session results
          if (sessionInfoRef.current.examId) {
            const answers = questions.map((q, idx) => ({
              questionId: q.id,
                selectedAnswer: getSelectedAnswer(questionState[idx]), // Handles skipped questions
            }));

            const response = await studentQuestionsAPI.submitTestAnswers(
              sessionInfoRef.current.examId,
              answers,
              timeTakenMs
            );

            // Mark as saved
            sessionStorage.setItem(sessionKey, 'true');
            
            // Store test results for later use when viewing summary
            if (response.success && response.data) {
              const resultsKey = `test_results_${sessionIdRef.current}`;
              sessionStorage.setItem(resultsKey, JSON.stringify(response.data));
              }
            }
          }
        }
      } catch (error) {
        console.error('Error auto-saving session results:', error);
        // Don't show error toast here to avoid interrupting user flow
        // The session can still be saved when viewing summary
      }
    };

    saveSessionOnComplete();
  }, [sessionComplete, mode, questions, questionState]);

  // Check if all questions are completed
  // For test mode: all questions must be attempted (either submitted or skipped)
  // For study mode: all questions must have feedback
  // Skip this check if we're resuming from a paused session and user hasn't interacted yet (to avoid auto-completing)
  useEffect(() => {
    // Don't auto-complete if we're resuming from a paused session and user hasn't interacted yet
    if (pausedSessionIdRef.current && !hasInteractedAfterResumeRef.current) {
      return;
    }
    
    if (questionState.length > 0 && questions.length > 0 && questionState.length === questions.length && !sessionComplete) {
      if (mode === 'study') {
        // Study mode: all questions must have feedback
      const allAnswered = questionState.every((state) => state.showFeedback);
        if (allAnswered) {
        setSessionComplete(true);
        }
      } else if (mode === 'test') {
        // Test mode: all questions must be attempted (either submitted or skipped)
        const allAttempted = questionState.every((state) => 
          state.status === 'submit' || state.status === 'skipped' || state.isSubmitted
        );
        if (allAttempted) {
          setSessionComplete(true);
        }
      }
    }
  }, [questionState, mode, questions.length, sessionComplete]);

  // Clear session storage when session is completed (only for study mode)
  // For test mode, session is cleared when user takes action (view summary, exit, or review)
  useEffect(() => {
    if (sessionComplete && mode === 'study' && sessionIdRef.current) {
      clearSession(sessionIdRef.current);
      sessionIdRef.current = null;
    }
  }, [sessionComplete, mode]);

  const currentQuestion = questions[currentIndex];
  const currentState = questionState[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Show loading state while checking subscription
  if (checkingSubscription) {
    return <Loader fullScreen={true} text="Checking subscription..." size="lg" />;
  }

  // Show loading state
  if (loading) {
    return <Loader fullScreen={true} text="Loading questions..." size="lg" />;
  }

  // If no active subscription, show message (will redirect)
  if (!hasActiveSubscription) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-oxford-blue text-lg">Subscription required to access study mode and test mode</div>
        <button
          onClick={() => navigate('/dashboard/subscription-billings')}
          className="px-4 py-2 bg-cinnebar-red text-white rounded-lg"
        >
          Go to Subscription
        </button>
      </div>
    );
  }

  // Show error state
  if (error || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-oxford-blue text-lg">{error || 'No questions available'}</div>
        <button
          onClick={() => navigate('/dashboard/practice')}
          className="px-4 py-2 bg-cinnebar-red text-white rounded-lg"
        >
          Back to Practice
        </button>
      </div>
    );
  }

  const updateQuestionState = (updater) => {
    setQuestionState((prev) =>
      prev.map((state, index) => (index === currentIndex ? updater(state) : state))
    );
  };

  // Helper function to get selected answer for a question (handles skipped questions)
  const getSelectedAnswer = (state) => {
    if (state?.status === 'skipped') {
      return ''; // Skipped questions count as empty/incorrect
    }
    return state?.selectedOption || '';
  };

  const handleOptionChange = (optionId) => {
    // In test mode, don't allow changing answer if question is already submitted
    if (mode === 'test' && (currentState?.isSubmitted || currentState?.status === 'submit')) {
      return; // Lock the answer once submitted
    }
    
    updateQuestionState((state) => ({
      ...state,
      selectedOption: optionId,
      // If question was skipped, clear the skipped status when user selects an option
      status: mode === 'test' && state.status === 'skipped' ? 'current' : state.status,
    }));
  };

  const goToIndex = (index) => {
    if (index < 0 || index >= totalQuestions) return;

    // In test mode, prevent navigation to submitted questions (anywhere, not just before current)
    if (mode === 'test') {
      const targetState = questionState[index];
      if (targetState?.status === 'submit' || targetState?.isSubmitted) {
        // Don't allow navigation to submitted questions in test mode
        return;
      }
    }

    // Update status: clear current from previous question, set current for new question
    if (mode === 'test') {
      setQuestionState((prev) =>
        prev.map((state, idx) => {
          if (idx === currentIndex && state.status === 'current') {
            // Keep previous status if it was submit or skipped, otherwise clear
            return { ...state, status: state.status === 'submit' ? 'submit' : (state.status === 'skipped' ? 'skipped' : null) };
          }
          if (idx === index && state.status !== 'submit') {
            return { ...state, status: 'current' };
          }
          return state;
        })
      );
    }

    setCurrentIndex(index);
    setVisitedIndices((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
    setShowQuestionNav(false);
    
    // Show explanation only if question has feedback, otherwise hide it completely
    const targetQuestionState = questionState[index];
    if (targetQuestionState?.showFeedback) {
      setShowExplanation(true);
      setShowExplanationPanel(true);
    } else {
      setShowExplanation(false);
    setShowExplanationPanel(false);
    }
  };

  // Find next non-submitted question (for test mode)
  // This does a circular search: first from current index forward, then from start
  const findNextUnsubmittedQuestion = (startIndex) => {
    // Forward from the current index
    for (let i = startIndex + 1; i < totalQuestions; i++) {
      const state = questionState[i];
      if (state?.status !== 'submit' && !state?.isSubmitted) {
        return i;
      }
    }

    // Wrap around to the beginning
    for (let i = 0; i < startIndex; i++) {
      const state = questionState[i];
      if (state?.status !== 'submit' && !state?.isSubmitted) {
        return i;
      }
    }

    return null; // No unsubmitted questions found
  };

  // Find previous skipped question (for test mode navigation)
  const findPreviousSkippedQuestion = (startIndex) => {
    for (let i = startIndex - 1; i >= 0; i--) {
      const state = questionState[i];
      if (state?.status === 'skipped') {
        return i;
      }
    }
    return null; // No skipped questions found
  };

  const moveToNextQuestion = () => {
    if (mode === 'test') {
      // In test mode, find next non-submitted question
      const nextIndex = findNextUnsubmittedQuestion(currentIndex);
      if (nextIndex !== null) {
        goToIndex(nextIndex);
      } else {
        // All questions attempted, check if all are submitted or skipped
        const allAttempted = questionState.every((state) => 
          state.status === 'submit' || state.status === 'skipped' || state.isSubmitted
        );
        if (allAttempted) {
          setSessionComplete(true);
        }
      }
    } else {
      // Study mode: normal navigation
    if (isLastQuestion) {
      setSessionComplete(true);
      return;
    }
    goToIndex(currentIndex + 1);
    }
  };

  const handleSubmit = async () => {
    if (!currentState?.selectedOption || !currentQuestion) return;

    // Mark that user has interacted after resuming paused session
    if (pausedSessionIdRef.current) {
      hasInteractedAfterResumeRef.current = true;
    }

    if (mode === 'test') {
      // In test mode, mark question as submitted and lock the answer
      // Correctness will be checked when the entire test is submitted
      updateQuestionState((state) => ({
        ...state,
        selectedOption: currentState.selectedOption,
        isSubmitted: true, // Mark as submitted - cannot go back to this question
        status: 'submit', // Mark status as submit
      }));
      moveToNextQuestion();
    } else {
      // Study mode: Hide explanation initially when submitting
      setShowExplanation(false);
      setShowExplanationPanel(false);
      
      // Submit answer to API and get feedback
      try {
        const response = await studentQuestionsAPI.submitStudyAnswer(
          currentQuestion.id,
          currentState.selectedOption
        );

        if (response.success && response.data) {
          const isCorrect = response.data.isCorrect;
          const explanation = response.data.explanation || '';
          
          // Update question state with feedback
      updateQuestionState((state) => ({
        ...state,
        isCorrect,
        showFeedback: true,
            correctAnswer: response.data.correctAnswer,
            explanation: explanation,
          }));
          
          // Update the question object with the explanation
          setQuestions((prevQuestions) =>
            prevQuestions.map((q, idx) =>
              idx === currentIndex
                ? { ...q, explanation: explanation, correctAnswer: response.data.correctAnswer }
                : q
            )
          );
          
          // Update session statistics
          setSessionStats((prev) => ({
            ...prev,
            correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
            incorrectCount: !isCorrect ? prev.incorrectCount + 1 : prev.incorrectCount,
          }));
          
          // Show explanation after getting feedback
          setShowExplanation(true);
          setShowExplanationPanel(true);
        }
      } catch (error) {
        console.error('Error submitting answer:', error);
        showErrorToast(error.message || 'Failed to submit answer');
        // Show explanation even on error
        setShowExplanation(true);
        setShowExplanationPanel(true);
      }
    }
  };

  const handleNavigate = (direction) => {
    // Mark that user has interacted after resuming paused session
    if (pausedSessionIdRef.current && direction !== 0) {
      hasInteractedAfterResumeRef.current = true;
    }

    if (mode === 'test') {
      if (direction === -1) {
        // Previous: Check if there's a skipped question first
        const skippedIndex = findPreviousSkippedQuestion(currentIndex);
        if (skippedIndex !== null) {
          goToIndex(skippedIndex);
          return;
        }
        // Otherwise, go to previous non-submitted question
        for (let i = currentIndex - 1; i >= 0; i--) {
          const state = questionState[i];
          if (state?.status !== 'submit' && !state?.isSubmitted) {
            goToIndex(i);
            return;
          }
        }
        // If no non-submitted question found, don't navigate
        return;
      } else {
        // Next: If current question has selection but not submitted, mark as skipped
        if (currentState?.selectedOption && !currentState?.isSubmitted && currentState?.status !== 'submit') {
          updateQuestionState((state) => ({
            ...state,
            status: 'skipped',
          }));
        }
        // Find next non-submitted question
        const nextIndex = findNextUnsubmittedQuestion(currentIndex);
        if (nextIndex !== null) {
          goToIndex(nextIndex);
        } else {
          // Check if all questions are attempted
          const allAttempted = questionState.every((state) => 
            state.status === 'submit' || state.status === 'skipped' || state.isSubmitted
          );
          if (allAttempted) {
            setSessionComplete(true);
          }
        }
      }
    } else {
      // Study mode: normal navigation
    const nextIndex = currentIndex + direction;
    goToIndex(nextIndex);
    }
  };

  const toggleHint = () => {
    updateQuestionState((state) => ({
      ...state,
      showHint: !state.showHint,
    }));
  };

  const handlePauseSession = async () => {
    if (questions.length === 0 || questionState.length === 0) {
      showErrorToast('No session to pause');
      return;
    }

    // Check if any question has been submitted
    // In test mode, check for isSubmitted or status === 'submit' or 'skipped'; in study mode, check for showFeedback
    const hasSubmittedQuestions = mode === 'test' 
      ? questionState.some((state) => state.isSubmitted || state.status === 'submit' || state.status === 'skipped')
      : questionState.some((state) => state.showFeedback);
    if (!hasSubmittedQuestions) {
      showErrorToast('Please submit at least one question before pausing');
      return;
    }

    try {
      // If resuming from paused session, add paused time + resumed time
      let totalTime;
      if (pausedSessionIdRef.current) {
        const resumedTime = resumeStartTimeRef.current ? Date.now() - resumeStartTimeRef.current : 0;
        totalTime = pausedTimeTakenRef.current + resumedTime;
      } else {
        totalTime = sessionStartTime.current ? Date.now() - sessionStartTime.current : 0;
      }
      const timeTakenMs = totalTime;

      // Prepare questions data for pausing
      const questionsData = questions.map((q, idx) => {
        const state = questionState[idx];
        const hasAnswer = state?.selectedOption !== null && state?.selectedOption !== undefined && state?.selectedOption !== '';
        // For study mode: only set isCorrect if question was answered, otherwise null
        // For test mode: isCorrect will be calculated when test is submitted
        const isCorrect = mode === 'study' 
          ? (hasAnswer ? (state?.isCorrect ?? null) : null)
          : null;
        
        return {
          questionId: q.id,
          selectedAnswer: getSelectedAnswer(state), // Handles skipped questions
          isCorrect: isCorrect,
        };
      });

      // Pause the session
      const response = await studentQuestionsAPI.pauseSession({
        mode,
        examId: sessionInfoRef.current.examId,
        subjectId: sessionInfoRef.current.subjectId,
        topicId: sessionInfoRef.current.topicId,
        questions: questionsData,
        currentIndex,
        timeTaken: timeTakenMs,
        timerEndTime: mode === 'test' ? timerEndTimeRef.current : null,
        timeLimit: mode === 'test' ? timeLimitRef.current : null,
      });

      if (response.success) {
        // Store remaining time and timeLimit for test mode (to restore timer correctly on resume)
        if (mode === 'test' && response.data?.remainingTime !== null && response.data?.remainingTime !== undefined) {
          const pauseDataKey = `pause_data_${response.data.sessionId}`;
          sessionStorage.setItem(pauseDataKey, JSON.stringify({
            remainingTime: response.data.remainingTime,
            timeLimit: response.data.timeLimit,
          }));
        }
        
        // Clear session storage (don't save paused sessions in session storage)
        if (sessionIdRef.current) {
      clearSession(sessionIdRef.current);
        }
        
        // Show success message and navigate to review page
        showSuccessToast('Session paused successfully');
        setTimeout(() => {
          navigate('/dashboard/review');
        }, 1000);
      }
    } catch (error) {
      console.error('Error pausing session:', error);
      showErrorToast(error.message || 'Failed to pause session');
    }
  };

  const handleExit = () => {
    // Store session ID before clearing
    const currentSessionId = sessionIdRef.current;
    
    // Clear session from local storage for both study and test mode
    if (currentSessionId) {
      clearSession(currentSessionId);
      
      // Clear any session-related data from sessionStorage
      const sessionKey = `session_saved_${currentSessionId}`;
      const resultsKey = `test_results_${currentSessionId}`;
      sessionStorage.removeItem(sessionKey);
      sessionStorage.removeItem(resultsKey);
      
      sessionIdRef.current = null;
    }
    
    // Redirect to practice page
    navigate('/dashboard/practice');
  };

  const handleViewSummary = async () => {
    // Calculate session statistics
    // If resuming from paused session, add paused time + resumed time
    let totalTime;
    if (pausedSessionIdRef.current) {
      const resumedTime = resumeStartTimeRef.current ? Date.now() - resumeStartTimeRef.current : 0;
      totalTime = pausedTimeTakenRef.current + resumedTime;
    } else {
      totalTime = sessionStartTime.current ? Date.now() - sessionStartTime.current : 0;
    }
    const timeTakenMs = totalTime; // Time in milliseconds for database
    const totalSeconds = Math.floor(totalTime / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const timeTaken = `${totalMinutes}m ${seconds}s`;
    
    const averageSeconds = totalQuestions > 0 ? Math.floor(totalSeconds / totalQuestions) : 0;
    const avgMinutes = Math.floor(averageSeconds / 60);
    const avgSecs = averageSeconds % 60;
    const averagePace = `${avgMinutes}m ${avgSecs}s`;
    
    let correctCount = 0;
    let incorrectCount = 0;
    let accuracyPercent = 0;
    let testResults = null;
    let updatedQuestionState = questionState;
    
    // Check if session was already saved (to avoid duplicate saves)
    const sessionKey = `session_saved_${sessionIdRef.current}`;
    const resultsKey = `test_results_${sessionIdRef.current}`;
    const alreadySaved = sessionStorage.getItem(sessionKey);
    
    // Check if we have stored test results
    let storedResults = null;
    try {
      const stored = sessionStorage.getItem(resultsKey);
      if (stored) {
        storedResults = JSON.parse(stored);
      }
    } catch (e) {
      // Ignore parse errors
    }
    
    // For test mode, always try to get results (either from storage or API)
    if (mode === 'test') {
      if (storedResults && storedResults.summary) {
        // Use stored results
        correctCount = storedResults.summary.correctAnswers || 0;
        incorrectCount = storedResults.summary.incorrectAnswers || 0;
        accuracyPercent = storedResults.summary.percentage || 0;
        testResults = storedResults;
        
        // Update questionState with isCorrect values from stored results
        if (storedResults.results && Array.isArray(storedResults.results)) {
          updatedQuestionState = questionState.map((state, idx) => {
            const result = storedResults.results.find(
              (r) => r.questionId === questions[idx]?.id
            );
            return {
              ...state,
              isCorrect: result ? result.isCorrect : null,
            };
          });
        }
      } else if (!alreadySaved) {
        // Not saved yet, submit and get results
        try {
          if (!sessionInfoRef.current.examId) {
            console.warn('Cannot save test session: Exam ID is missing');
            showErrorToast('Cannot save test results: Exam information is missing');
          } else {
            const answers = questions.map((q, idx) => ({
              questionId: q.id,
              selectedAnswer: getSelectedAnswer(questionState[idx]), // Handles skipped questions
            }));

            const response = await studentQuestionsAPI.submitTestAnswers(
              sessionInfoRef.current.examId,
              answers,
              timeTakenMs
            );

            // Mark as saved
            sessionStorage.setItem(sessionKey, 'true');
            
            // Extract results from API response
            if (response.success && response.data) {
              testResults = response.data;
              // Store results for later use
              sessionStorage.setItem(resultsKey, JSON.stringify(testResults));
              
              const summary = testResults.summary || {};
              correctCount = summary.correctAnswers || 0;
              incorrectCount = summary.incorrectAnswers || 0;
              accuracyPercent = summary.percentage || 0;
              
              // Update questionState with isCorrect values from results
              if (testResults.results && Array.isArray(testResults.results)) {
                updatedQuestionState = questionState.map((state, idx) => {
                  const result = testResults.results.find(
                    (r) => r.questionId === questions[idx]?.id
                  );
                  return {
                    ...state,
                    isCorrect: result ? result.isCorrect : null,
                  };
                });
              }
            }
          }
        } catch (error) {
          console.error('Error saving test results:', error);
          showErrorToast(error.message || 'Failed to save test results, but you can still view the summary');
          correctCount = 0;
          incorrectCount = 0;
          accuracyPercent = 0;
        }
      } else {
        // Already saved but no stored results - this shouldn't happen, but handle gracefully
        console.warn('Test session already saved but no results found');
        correctCount = 0;
        incorrectCount = 0;
        accuracyPercent = 0;
      }
    } else {
      // Study mode
      if (!alreadySaved) {
        try {
        // Save study mode session results
        if (!sessionInfoRef.current.examId) {
          console.warn('Cannot save study session: Exam ID is missing');
          showErrorToast('Cannot save session results: Exam information is missing');
        } else {
          const questionsData = questions.map((q, idx) => ({
            questionId: q.id,
            selectedAnswer: getSelectedAnswer(questionState[idx]), // Handles skipped questions
            isCorrect: questionState[idx]?.isCorrect || false,
          }));

          await studentQuestionsAPI.saveStudySessionResults({
            examId: sessionInfoRef.current.examId,
            subjectId: sessionInfoRef.current.subjectId,
            topicId: sessionInfoRef.current.topicId,
            questions: questionsData,
            timeTaken: timeTakenMs,
          });

            // Mark as saved
            sessionStorage.setItem(sessionKey, 'true');
        }
        } catch (error) {
          console.error('Error saving session results:', error);
          showErrorToast(error.message || 'Failed to save session results, but you can still view the summary');
        }
      }
      
      // For study mode, calculate from current state
      correctCount = questionState.filter((state) => state.isCorrect === true).length;
      incorrectCount = questionState.filter((state) => state.isCorrect === false).length;
      accuracyPercent = totalQuestions > 0 
        ? Math.round((correctCount / totalQuestions) * 100) 
        : 0;
    }
    
    // Clear session in test mode when viewing summary after completion
    if (mode === 'test' && sessionComplete && sessionIdRef.current) {
      clearSession(sessionIdRef.current);
      sessionIdRef.current = null;
    }
    
    const sessionData = {
      mode: mode,
      questionsAnswered: totalQuestions,
      correctCount: correctCount,
      incorrectCount: incorrectCount,
      accuracyPercent,
      timeTaken,
      averagePace,
      questions: questions.map((q, idx) => ({
        id: q.id || idx + 1,
        status: updatedQuestionState[idx]?.isCorrect === true ? 'correct' : 'incorrect',
      })),
    };
    
    navigate('/dashboard/session-summary', { state: { sessionData } });
  };

  const handleReviewAnswers = async () => {
    let updatedQuestionState = questionState;
    
    // For test mode, we need to get results first to know which questions are incorrect
    if (mode === 'test') {
      const sessionKey = `session_saved_${sessionIdRef.current}`;
      const resultsKey = `test_results_${sessionIdRef.current}`;
      const alreadySaved = sessionStorage.getItem(sessionKey);
      
      // Check if we have stored test results
      let storedResults = null;
      try {
        const stored = sessionStorage.getItem(resultsKey);
        if (stored) {
          storedResults = JSON.parse(stored);
        }
      } catch (e) {
        // Ignore parse errors
      }
      
      if (storedResults && storedResults.results && Array.isArray(storedResults.results)) {
        // Use stored results to update questionState with isCorrect values
        updatedQuestionState = questionState.map((state, idx) => {
          const result = storedResults.results.find(
            (r) => r.questionId === questions[idx]?.id
          );
          return {
            ...state,
            isCorrect: result ? result.isCorrect : null,
          };
        });
      } else if (!alreadySaved && sessionInfoRef.current.examId) {
        // Not saved yet, submit and get results
        try {
          // If resuming from paused session, add paused time + resumed time
          let totalTime;
          if (pausedSessionIdRef.current) {
            const resumedTime = resumeStartTimeRef.current ? Date.now() - resumeStartTimeRef.current : 0;
            totalTime = pausedTimeTakenRef.current + resumedTime;
          } else {
            totalTime = sessionStartTime.current ? Date.now() - sessionStartTime.current : 0;
          }
          const timeTakenMs = totalTime;
          
          const answers = questions.map((q, idx) => ({
            questionId: q.id,
            selectedAnswer: getSelectedAnswer(questionState[idx]), // Handles skipped questions
          }));

          const response = await studentQuestionsAPI.submitTestAnswers(
            sessionInfoRef.current.examId,
            answers,
            timeTakenMs
          );

          // Mark as saved
          sessionStorage.setItem(sessionKey, 'true');
          
          // Extract results from API response
          if (response.success && response.data) {
            const testResults = response.data;
            // Store results for later use
            sessionStorage.setItem(resultsKey, JSON.stringify(testResults));
            
            // Update questionState with isCorrect values from results
            if (testResults.results && Array.isArray(testResults.results)) {
              updatedQuestionState = questionState.map((state, idx) => {
                const result = testResults.results.find(
                  (r) => r.questionId === questions[idx]?.id
                );
                return {
                  ...state,
                  isCorrect: result ? result.isCorrect : null,
                };
              });
            }
          }
        } catch (error) {
          console.error('Error getting test results for review:', error);
          // Continue with current state if error occurs
        }
      }
    }
    
    // Prepare incorrect questions data from current session
    const incorrectQuestions = questions
      .map((q, idx) => {
        const state = updatedQuestionState[idx];
        const isIncorrect = state?.isCorrect === false;
        
        if (!isIncorrect) return null;
        
        // Handle options - q.options is an array of {id, text} objects
        let optionsObj = {};
        if (Array.isArray(q.options)) {
          // Convert array format to object format for ReviewIncorrectPage
          q.options.forEach(opt => {
            if (opt.id && opt.text) {
              optionsObj[opt.id] = opt.text;
            }
          });
        } else if (q.options && typeof q.options === 'object') {
          // Already an object
          optionsObj = q.options;
        }
        
        return {
          questionId: q.id || idx + 1,
          questionText: q.prompt || '',
          options: optionsObj, // Pass as object for ReviewIncorrectPage to convert to array
          correctAnswer: q.correctAnswer,
          selectedAnswer: getSelectedAnswer(state),
          explanation: q.explanation || '',
        };
      })
      .filter(Boolean);
    
    // Clear session in test mode when reviewing answers after completion
    if (mode === 'test' && sessionComplete && sessionIdRef.current) {
      clearSession(sessionIdRef.current);
      sessionIdRef.current = null;
    }
    
    // Navigate with incorrect questions data in state
    navigate('/dashboard/review-incorrect', { 
      state: { 
        incorrectQuestions,
        fromCurrentSession: true 
      } 
    });
  };

  const toggleQuestionNav = () => setShowQuestionNav((prev) => !prev);
  const closeQuestionNav = () => setShowQuestionNav(false);
  const toggleExplanation = () => setShowExplanation((prev) => !prev);
  const toggleExplanationPanel = () => setShowExplanationPanel((prev) => !prev);
  
  // Toggle mark status for a question (for later review)
  const toggleMark = async (index) => {
    const question = questions[index];
    if (!question || !question.id) return;

    const currentState = questionState[index];
    const isCurrentlyMarked = currentState?.isMarked || false;

    // Optimistically update UI
    setQuestionState((prev) =>
      prev.map((state, idx) =>
        idx === index ? { ...state, isMarked: !state.isMarked } : state
      )
    );

    try {
      if (isCurrentlyMarked) {
        // Unmark question
        await studentQuestionsAPI.unmarkQuestion(question.id);
      } else {
        // Mark question
        await studentQuestionsAPI.markQuestion(question.id);
      }
    } catch (error) {
      // Revert on error
      setQuestionState((prev) =>
        prev.map((state, idx) =>
          idx === index ? { ...state, isMarked: isCurrentlyMarked } : state
        )
      );
      showErrorToast(error.response?.data?.message || error.message || 'Failed to update mark status');
    }
  };

  // Check if any question has been submitted (for disabling pause button)
  // In test mode, check for isSubmitted or status === 'submit' or 'skipped'; in study mode, check for showFeedback
  const hasSubmittedQuestions = mode === 'test' 
    ? questionState.some((state) => state.isSubmitted || state.status === 'submit' || state.status === 'skipped')
    : questionState.some((state) => state.showFeedback);
  const isPauseDisabled = !hasSubmittedQuestions || questions.length === 0 || questionState.length === 0;

  return (
    <>
      {mode === 'test' ? (
        <TestModeLayout
          questions={questions}
          currentIndex={currentIndex}
          currentState={currentState}
          questionState={questionState}
          visitedIndices={visitedIndices}
          showQuestionNav={showQuestionNav}
          sessionStartTime={sessionStartTime.current}
          timeRemaining={timeRemaining}
          onToggleQuestionNav={toggleQuestionNav}
          onCloseQuestionNav={closeQuestionNav}
          onGoToIndex={goToIndex}
          onNavigate={handleNavigate}
          onOptionChange={handleOptionChange}
          onSubmit={handleSubmit}
          onExit={handleExit}
          onPause={handlePauseSession}
          isPauseDisabled={isPauseDisabled}
          onToggleMark={toggleMark}
        />
      ) : (
        <StudyModeLayout
          questions={questions}
          currentIndex={currentIndex}
          currentState={currentState}
          visitedIndices={visitedIndices}
          showQuestionNav={showQuestionNav}
          showExplanation={showExplanation}
          showExplanationPanel={showExplanationPanel}
          sessionStartTime={sessionStartTime.current}
          onToggleQuestionNav={toggleQuestionNav}
          onCloseQuestionNav={closeQuestionNav}
          onGoToIndex={goToIndex}
          onNavigate={handleNavigate}
          onOptionChange={handleOptionChange}
          onSubmit={handleSubmit}
          onToggleHint={toggleHint}
          onExit={handleExit}
          onPause={handlePauseSession}
          isPauseDisabled={isPauseDisabled}
          onToggleExplanation={toggleExplanation}
          onToggleExplanationPanel={toggleExplanationPanel}
          onToggleMark={toggleMark}
        />
      )}

      {sessionComplete && (
        <SessionCompletionModal
          mode={mode}
          onViewSummary={handleViewSummary}
          onReviewAnswers={handleReviewAnswers}
          onExit={handleExit}
        />
      )}
    </>
  );
};

export default QuestionSessionPage;


