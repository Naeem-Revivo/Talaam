import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import StudyModeLayout from '../../components/dashboard/questionSession/StudyModeLayout';
import TestModeLayout from '../../components/dashboard/questionSession/TestModeLayout';
import SessionCompletionModal from '../../components/dashboard/questionSession/SessionCompletionModal';
import studentQuestionsAPI from '../../api/studentQuestions';
import subscriptionAPI from '../../api/subscription';
import { showErrorToast } from '../../utils/toastConfig';
import {
  generateSessionId,
  findExistingSession,
  saveSessionState,
  loadSessionState,
  clearSession,
  clearExpiredSessions,
} from '../../utils/sessionStorage';

const buildInitialState = (questions) =>
  questions.map(() => ({
    selectedOption: null,
    isCorrect: null,
    showFeedback: false,
    showHint: false,
  }));

const QuestionSessionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode');
  const mode = modeParam === 'test' ? 'test' : 'study';

  // Get filters from navigation state (preferred) or URL params (fallback)
  const stateFilters = location.state?.filters || {};

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const sessionInfoRef = useRef({ examId: null, subjectId: null, topicId: null });

  // Transform API question format to component format
  const transformQuestion = (apiQuestion, index) => {
    const optionsObj = apiQuestion.options || {};
    const options = ['A', 'B', 'C', 'D'].map((key) => ({
      id: key,
      text: optionsObj[key] || '',
    })).filter(opt => opt.text); // Remove empty options

    return {
      id: apiQuestion._id || apiQuestion.id || `Q-${index + 1}`,
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

        // Get filters from navigation state (preferred) or URL params (fallback)
        const params = {};
        const filters = {};
        
        // Use state filters first (from navigation state)
        if (stateFilters.topics && stateFilters.topics.length > 0) {
          // Multiple topics from state - join as comma-separated string
          params.topics = stateFilters.topics.join(',');
          filters.topics = stateFilters.topics;
        }
        if (stateFilters.subject) {
          params.subject = stateFilters.subject;
          filters.subject = stateFilters.subject;
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

        // Check for existing session
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
              setQuestionState(restoredState.questionState);
              setCurrentIndex(restoredState.currentIndex || 0);
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
  }, [mode, searchParams, navigate, location.state, checkingSubscription, hasActiveSubscription]);

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
      setQuestionState(buildInitialState(questions));
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
      
      // Initialize timer for test mode (1 minute per question)
      if (mode === 'test' && questions.length > 0) {
        const totalTimeMs = questions.length * 60 * 1000; // 1 minute per question in milliseconds
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
    
    // Submit all answers (including unanswered ones as empty string)
    try {
      const totalTime = sessionStartTime.current ? Date.now() - sessionStartTime.current : 0;
      const timeTakenMs = totalTime;
      
      if (sessionInfoRef.current.examId) {
        // Prepare answers - include all questions, even unanswered ones (empty string for 0 points)
        const answers = questions.map((q, idx) => ({
          questionId: q.id,
          selectedAnswer: questionState[idx]?.selectedOption || '', // Empty string for unanswered (0 points)
        }));

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
  }, [sessionComplete, mode, questions, questionState]);
  
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
  }, [mode, sessionComplete, handleAutoSubmit]);

  // Save session state whenever it changes
  useEffect(() => {
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
  }, [questionState, currentIndex, visitedIndices, sessionStats, mode, stateFilters, questions]);

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
        const totalTime = sessionStartTime.current ? Date.now() - sessionStartTime.current : 0;
        const timeTakenMs = totalTime;

        if (mode === 'study') {
          // Save study mode session results
          if (sessionInfoRef.current.examId) {
            const questionsData = questions.map((q, idx) => ({
              questionId: q.id,
              selectedAnswer: questionState[idx]?.selectedOption || '',
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
              selectedAnswer: questionState[idx]?.selectedOption || '',
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
      } catch (error) {
        console.error('Error auto-saving session results:', error);
        // Don't show error toast here to avoid interrupting user flow
        // The session can still be saved when viewing summary
      }
    };

    saveSessionOnComplete();
  }, [sessionComplete, mode, questions, questionState]);

  // Check if all questions are completed (only for study mode)
  // For test mode, completion is triggered when user submits the last question
  useEffect(() => {
    if (questionState.length > 0 && questions.length > 0 && questionState.length === questions.length && !sessionComplete) {
      if (mode === 'study') {
        // Study mode: all questions must have feedback
      const allAnswered = questionState.every((state) => state.showFeedback);
        if (allAnswered) {
        setSessionComplete(true);
        }
      }
      // Test mode completion is handled in moveToNextQuestion when submitting the last question
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-oxford-blue text-lg">Checking subscription...</div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-oxford-blue text-lg">Loading questions...</div>
      </div>
    );
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

  const handleOptionChange = (optionId) => {
    updateQuestionState((state) => ({
      ...state,
      selectedOption: optionId,
    }));
  };

  const goToIndex = (index) => {
    if (index < 0 || index >= totalQuestions) return;

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

  const moveToNextQuestion = () => {
    if (isLastQuestion) {
      setSessionComplete(true);
      return;
    }
    goToIndex(currentIndex + 1);
  };

  const handleSubmit = async () => {
    if (!currentState?.selectedOption || !currentQuestion) return;

    if (mode === 'test') {
      // In test mode, just save the answer and move to next question
      // Correctness will be checked when the entire test is submitted
      updateQuestionState((state) => ({
        ...state,
        selectedOption: currentState.selectedOption,
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
    const nextIndex = currentIndex + direction;
    goToIndex(nextIndex);
  };

  const toggleHint = () => {
    updateQuestionState((state) => ({
      ...state,
      showHint: !state.showHint,
    }));
  };

  const handleExit = () => {
    // Clear session in test mode when exiting after completion
    if (mode === 'test' && sessionComplete && sessionIdRef.current) {
      clearSession(sessionIdRef.current);
      sessionIdRef.current = null;
    }
    navigate('/dashboard/practice');
  };

  const handleViewSummary = async () => {
    // Calculate session statistics
    const totalTime = sessionStartTime.current ? Date.now() - sessionStartTime.current : 0;
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
              selectedAnswer: questionState[idx]?.selectedOption || '',
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
            selectedAnswer: questionState[idx]?.selectedOption || '',
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
          const totalTime = sessionStartTime.current ? Date.now() - sessionStartTime.current : 0;
          const timeTakenMs = totalTime;
          
          const answers = questions.map((q, idx) => ({
            questionId: q.id,
            selectedAnswer: questionState[idx]?.selectedOption || '',
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
          selectedAnswer: state?.selectedOption || '',
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

  return (
    <>
      {mode === 'test' ? (
        <TestModeLayout
          questions={questions}
          currentIndex={currentIndex}
          currentState={currentState}
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
          onToggleExplanation={toggleExplanation}
          onToggleExplanationPanel={toggleExplanationPanel}
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


