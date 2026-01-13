import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import subjectsAPI from '../../api/subjects';
import topicsAPI from '../../api/topics';
import studentQuestionsAPI from '../../api/studentQuestions';
import subscriptionAPI from '../../api/subscription';
import { showErrorToast } from '../../utils/toastConfig';
import Loader from '../../components/common/Loader';
import Dropdown from '../../components/shared/Dropdown';

const PracticePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [sessionMode, setSessionMode] = useState('study'); // 'test' or 'study'
  const [questionStatus, setQuestionStatus] = useState('solved'); 
  const [selectedStatuses, setSelectedStatuses] = useState({
    incorrect: false,
    flagged: false,
    correct: false,
  });
  const [selectedAllQuestions, setSelectedAllQuestions] = useState(false);
  const [expandedDomains, setExpandedDomains] = useState({});
  const [selectedSubtopics, setSelectedSubtopics] = useState({});
  const [allTopics, setAllTopics] = useState([]); // Store all topics for "select all" functionality
  const [sessionSize, setSessionSize] = useState('20');
  const [timeLimit, setTimeLimit] = useState('30'); // Time limit in minutes for test mode
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState({}); // Track selected subjects
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [testSummary, setTestSummary] = useState(null);
  const [studySummary, setStudySummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const selectedSubtopicCount = Object.values(selectedSubtopics).filter(Boolean).length;
  const selectedSubjectCount = Object.values(selectedSubjects).filter(Boolean).length;
  const parsedSessionSize = Number(sessionSize);
  const isSessionSizeValid =
    Number.isInteger(parsedSessionSize) && parsedSessionSize >= 1 && parsedSessionSize <= 50;
  // Enable session if subject OR topic is selected
  const canStartTestSession =
    sessionMode === 'test' && (selectedSubtopicCount > 0 || selectedSubjectCount > 0) && isSessionSizeValid;
  const canStartStudySession =
    sessionMode === 'study' && (selectedSubtopicCount > 0 || selectedSubjectCount > 0);
  const canStartSession = canStartTestSession || canStartStudySession;

  // Calculate total available questions from selected topics
  // If only subjects are selected (no topics), return null to indicate we can't calculate
  const totalAvailableQuestions = useMemo(() => {
    if (selectedSubtopicCount === 0) {
      // If only subjects are selected, we can't calculate without API call
      return selectedSubjectCount > 0 ? null : 0;
    }
    
    const selectedTopicIds = Object.keys(selectedSubtopics).filter(
      (topicId) => selectedSubtopics[topicId]
    );
    
    // Combine allTopics and topics to get all available topic data
    const allAvailableTopics = [...allTopics];
    topics.forEach(topic => {
      const topicId = topic.id || topic._id;
      if (!allAvailableTopics.find(t => (t.id || t._id) === topicId)) {
        allAvailableTopics.push(topic);
      }
    });
    
    // Calculate total from selected topics using their counts
    let total = 0;
    selectedTopicIds.forEach(topicId => {
      const topic = allAvailableTopics.find(t => (t.id || t._id) === topicId);
      if (topic && topic.count !== undefined) {
        total += topic.count || 0;
      }
    });
    
    return total;
  }, [selectedSubtopics, allTopics, topics, selectedSubtopicCount, selectedSubjectCount]);
  const handleStartSession = () => {
    if (!canStartSession) return;
    
    // Check subscription before starting session
    if (!hasActiveSubscription) {
      showErrorToast('Please subscribe to access study mode and test mode');
      navigate('/dashboard/subscription-billings');
      return;
    }
    
    const mode = sessionMode === 'test' ? 'test' : 'study';
    
    // Get selected topic IDs
    const selectedTopicIds = Object.keys(selectedSubtopics).filter(
      (topicId) => selectedSubtopics[topicId]
    );
    
    // Get selected subject IDs
    const selectedSubjectIds = Object.keys(selectedSubjects).filter(
      (subjectId) => selectedSubjects[subjectId]
    );
    
    // Build filters object to pass via navigation state
    const filters = {};
    
    // If topics are selected, use topics (they take precedence)
    if (selectedTopicIds.length > 0) {
      filters.topics = selectedTopicIds;
    }
    // If only subjects are selected (no topics), use subjects
    else if (selectedSubjectIds.length > 0) {
      // If multiple subjects selected, use first one (or we could support multiple)
      // For now, use the first selected subject
      filters.subject = selectedSubjectIds[0];
    }
    
    // Add session size for both modes
    if (sessionSize) {
      filters.size = sessionSize;
    }
    
    // Add time limit only for test mode
    if (sessionMode === 'test' && timeLimit) {
      filters.timeLimit = timeLimit; // Time limit in minutes
    }
    
    // Navigate with filters in state instead of URL params
    navigate(`/dashboard/session?mode=${mode}`, { 
      state: { filters } 
    });
  };


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
        } else {
          setHasActiveSubscription(false);
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        setHasActiveSubscription(false);
      } finally {
        setCheckingSubscription(false);
      }
    };
    checkSubscription();
  }, []);

  // Fetch summary based on current session mode
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoadingSummary(true);
        if (sessionMode === 'test') {
          const response = await studentQuestionsAPI.getTestSummary();
          if (response.success && response.data) {
            setTestSummary(response.data);
          } else {
            setTestSummary(null);
          }
        } else {
          const response = await studentQuestionsAPI.getStudySummary();
          if (response.success && response.data) {
            setStudySummary(response.data);
          } else {
            setStudySummary(null);
          }
        }
      } catch (error) {
        console.error(`Error fetching ${sessionMode} summary:`, error);
        if (sessionMode === 'test') {
          setTestSummary(null);
        } else {
          setStudySummary(null);
        }
      } finally {
        setLoadingSummary(false);
      }
    };
    fetchSummary();
  }, [sessionMode]);

  // Fetch subjects on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);
        const response = await subjectsAPI.getAllSubjects();
        if (response.success && response.data) {
          setSubjects(response.data.subjects || response.data);
        } else {
          setSubjects([]);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
        // Handle permission errors gracefully
        if (error.response?.status === 403 || error.response?.status === 401) {
          showErrorToast('You do not have permission to access subjects. Please contact support.');
        } else {
          showErrorToast(error.message || 'Failed to load subjects. Please try again.');
        }
        setSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch all topics on mount (for "select all" functionality)
  useEffect(() => {
    const fetchAllTopics = async () => {
      try {
        const response = await topicsAPI.getAllTopics(); // Fetch all topics without subject filter
        if (response.success && response.data) {
          const topicsList = response.data.topics || response.data;
          // Use question counts from API response
          const topicsWithCounts = topicsList.map((topic) => ({
            ...topic,
            count: topic.count || 0, // Use count from API response
          }));
          setAllTopics(topicsWithCounts);
        }
      } catch (error) {
        console.error('Error fetching all topics:', error);
        // Don't show error toast for this - it's a background fetch
        setAllTopics([]);
      }
    };
    fetchAllTopics();
  }, []);

  // Fetch topics when a subject is expanded
  useEffect(() => {
    if (selectedSubjectId) {
      const fetchTopics = async () => {
        try {
          setLoadingTopics(true);
          const response = await topicsAPI.getAllTopics({ parentSubject: selectedSubjectId });
          if (response.success && response.data) {
            const topicsList = response.data.topics || response.data;
            // Use question counts from API response
            const topicsWithCounts = topicsList.map((topic) => ({
              ...topic,
              count: topic.count || 0, // Use count from API response
            }));
            setTopics(topicsWithCounts);
          } else {
            setTopics([]);
          }
        } catch (error) {
          console.error('Error fetching topics:', error);
          // Handle permission errors gracefully
          if (error.response?.status === 403 || error.response?.status === 401) {
            showErrorToast('You do not have permission to access topics. Please contact support.');
          } else {
            showErrorToast(error.message || 'Failed to load topics. Please try again.');
          }
          setTopics([]);
        } finally {
          setLoadingTopics(false);
        }
      };
      fetchTopics();
    } else {
      setTopics([]);
    }
  }, [selectedSubjectId]);

  const toggleSubject = (subjectId) => {
    const isCurrentlyExpanded = expandedDomains[subjectId];
    const isCurrentlySelected = selectedSubjects[subjectId];
    
    if (isCurrentlyExpanded) {
      // Collapsing - clear topics for this subject
      if (selectedSubjectId === subjectId) {
      setSelectedSubjectId(null);
      setTopics([]);
      }
    } else {
      // Expanding - fetch topics for this subject
      setSelectedSubjectId(subjectId);
    }
    
    // Toggle expansion
    setExpandedDomains(prev => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }));
    
    // Toggle selection (independent of expansion)
    setSelectedSubjects(prev => {
      const newState = {
        ...prev,
        [subjectId]: !prev[subjectId],
      };
      
      // If unselecting subject, clear its topics from selectedSubtopics
      if (isCurrentlySelected) {
        // Find topics that belong to this subject from both topics and allTopics
        // Topics use parentSubject field to link to subject
        const allAvailableTopics = [...topics, ...allTopics];
        const subjectIdStr = String(subjectId);
        
        // Build a map of topic ID to topic for quick lookup
        const topicMap = new Map();
        allAvailableTopics.forEach(t => {
          const topicId = t.id || t._id;
          if (topicId) {
            topicMap.set(String(topicId), t);
            topicMap.set(topicId, t); // Also store with original type
          }
        });
        
        setSelectedSubtopics(prevSubtopics => {
          const updated = { ...prevSubtopics };
          
          // Iterate through all selected topic IDs and check if they belong to this subject
          Object.keys(prevSubtopics).forEach(topicKey => {
            const topic = topicMap.get(topicKey) || topicMap.get(String(topicKey));
            if (topic) {
              // parentSubject can be a string ID or an object with { id, name }
              let topicSubjectId = null;
              if (topic.parentSubject) {
                if (typeof topic.parentSubject === 'object' && topic.parentSubject.id) {
                  topicSubjectId = topic.parentSubject.id;
                } else {
                  topicSubjectId = topic.parentSubject;
                }
              } else {
                // Fallback to other possible fields
                topicSubjectId = topic.subjectId || topic.subject?.id || topic.subject?._id || topic.subject;
              }
              
              const topicSubjectIdStr = topicSubjectId ? String(topicSubjectId) : '';
              if (topicSubjectIdStr === subjectIdStr) {
                // This topic belongs to the unselected subject, remove it
                delete updated[topicKey];
              }
            }
          });
          
          return updated;
        });
      }
      
      // Update "All Questions" checkbox
      if (allTopics.length > 0) {
        const allTopicIds = allTopics.map(t => t.id || t._id).filter(Boolean);
        const allSelected = allTopicIds.length > 0 && allTopicIds.every(id => selectedSubtopics[id] === true);
        setSelectedAllQuestions(allSelected);
      }
      
      return newState;
    });
  };

  const toggleTopic = (topicId) => {
    setSelectedSubtopics(prev => {
      const newState = {
      ...prev,
      [topicId]: !prev[topicId],
      };
      
      // If selecting a topic, ensure its subject is also selected
      if (newState[topicId]) {
        // Find the topic to get its subject
        const topic = topics.find(t => (t.id || t._id) === topicId) || 
                     allTopics.find(t => (t.id || t._id) === topicId);
        if (topic) {
          // Topics use parentSubject field to link to subject
          // parentSubject can be a string ID or an object with { id, name }
          let topicSubjectId = null;
          if (topic.parentSubject) {
            if (typeof topic.parentSubject === 'object' && topic.parentSubject.id) {
              topicSubjectId = topic.parentSubject.id;
            } else {
              topicSubjectId = topic.parentSubject;
            }
          } else {
            // Fallback to other possible fields
            topicSubjectId = topic.subjectId || topic.subject?.id || topic.subject?._id || topic.subject;
          }
          
          if (topicSubjectId) {
            setSelectedSubjects(prevSubjects => ({
              ...prevSubjects,
              [topicSubjectId]: true,
            }));
          }
        }
      }
      
      // Turn off "All Questions" when manually selecting/unselecting topics
        setSelectedAllQuestions(false);
      
      return newState;
    });
  };

  const handleStatusChange = (status) => {
    setSelectedStatuses(prev => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  // Handle session mode selection - automatically set question status based on mode
  const handleSessionModeChange = (mode) => {
    // Check subscription before allowing mode change
    if (!hasActiveSubscription) {
      showErrorToast('Please subscribe to access study mode and test mode');
      navigate('/dashboard/subscription-billings');
      return;
    }
    
    setSessionMode(mode);
    // Both modes use 'solved' status now
    setQuestionStatus('solved');
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 2xl:px-6 max-w-[1200px] mx-auto min-h-screen">
      {/* Title and Subtitle */}
      <div className="mb-8">
        <h1 className="font-archivo font-bold text-[32px] md:text-[36px] leading-[36px] md:leading-[40px] text-oxford-blue mb-1 md:mb-2">
          {t('dashboard.practice.hero.title')}
        </h1>
        <p className="font-roboto font-normal text-[18px] leading-[28px] tracking-[0%] text-dark-gray">
          {t('dashboard.practice.hero.subtitle')}
        </p>
      </div>

      {/* Session Mode and Question Status Cards - Flexed */}
      <div className="flex flex-col xl:flex-row justify-start gap-2 mb-6">
        {/* Session Mode Card */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-dashboard p-4 md:p-6 w-full lg:h-full">
        <h2 className="font-archivo font-bold text-lg md:text-[20px] leading-[28px] tracking-[0%] text-oxford-blue mb-4">
          {t('dashboard.practice.sessionMode.title')}
        </h2>
          {!hasActiveSubscription && !checkingSubscription && (
            <div className="mb-4 flex items-center gap-2 rounded-lg w-full bg-yellow-50 border border-yellow-200 p-3">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="font-roboto font-normal text-[14px] leading-[20px] tracking-[0%] text-yellow-800">
                Subscription required to access study mode and test mode. 
                <button 
                  onClick={() => navigate('/dashboard/subscription-billings')}
                  className="ml-1 underline font-semibold hover:text-yellow-900"
                >
                  Subscribe now
                </button>
              </p>
            </div>
          )}
          <div className="flex flex-row gap-2 md:gap-4 mb-4">
            <button
              onClick={() => handleSessionModeChange('test')}
              disabled={!hasActiveSubscription || checkingSubscription}
              className={`rounded-lg transition-all duration-200 text-left w-full h-[82px] md:h-[81.6px] p-2 md:p-4 ${
                sessionMode === 'test'
                  ? 'bg-cinnebar-red border border-cinnebar-red shadow-input'
                  : hasActiveSubscription
                  ? 'bg-white border border-[#E5E7EB]'
                  : 'bg-gray-100 border border-gray-300 opacity-60 cursor-not-allowed'
              }`}
            >
              <p className={`font-archivo font-bold text-[16px] leading-[24px] tracking-[0%] mb-1 md:mb-2 text-center ${
                sessionMode === 'test' ? 'text-white' : hasActiveSubscription ? 'text-black' : 'text-gray-500'
              }`}>
                {t('dashboard.practice.sessionMode.testMode')}
              </p>
              <p className={`font-roboto font-normal text-[14px] leading-[20px] tracking-[0%] text-center ${
                sessionMode === 'test' ? 'text-white' : hasActiveSubscription ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {t('dashboard.practice.sessionMode.testModeDescription')}
              </p>
            </button>
            <button
              onClick={() => handleSessionModeChange('study')}
              disabled={!hasActiveSubscription || checkingSubscription}
              className={`rounded-lg transition-all duration-200 text-left w-full h-[82px] md:h-[81.6px] p-2 md:p-4 ${
                sessionMode === 'study'
                  ? 'bg-cinnebar-red border border-cinnebar-red shadow-input'
                  : hasActiveSubscription
                  ? 'bg-white border border-[#E5E7EB]'
                  : 'bg-gray-100 border border-gray-300 opacity-60 cursor-not-allowed'
              }`}
            >
              <p className={`font-archivo font-bold text-[16px] leading-[24px] tracking-[0%] mb-1 md:mb-2 text-center ${
                sessionMode === 'study' ? 'text-white' : hasActiveSubscription ? 'text-black' : 'text-gray-500'
              }`}>
                {t('dashboard.practice.sessionMode.studyMode')}
              </p>
              <p className={`font-roboto font-normal text-[14px] leading-[20px] tracking-[0%] text-center ${
                sessionMode === 'study' ? 'text-white' : hasActiveSubscription ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {t('dashboard.practice.sessionMode.studyModeDescription')}
              </p>
            </button>
          </div>
          <div className="flex items-center gap-2 rounded-lg w-full lg:w-[544px] h-auto lg:h-[45px] bg-papaya-whip border border-[#FFE5B0] p-3 mt-6 lg:mt-10">
            <svg className="w-5 h-5 text-oxford-blue flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <p className="font-roboto font-normal text-[14px] leading-[20px] tracking-[0%] text-oxford-blue">
              {t('dashboard.practice.sessionMode.timeLimitNote')}
            </p>
          </div>
        </div>

        {/* Question Status Card */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-dashboard p-4 md:p-6 w-full lg:h-auto">
        <h2 className="font-archivo font-bold text-[18px] md:text-[20px] leading-[28px] tracking-[0%] text-oxford-blue mb-4">
          {t('dashboard.practice.questionStatus.title')}
        </h2>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setQuestionStatus('solved')}
            className={`px-4 py-2 rounded-full font-roboto font-normal text-[16px] leading-[24px] text-center transition-all duration-200 ${
              questionStatus === 'solved'
                ? 'bg-cinnebar-red text-white'
                : 'bg-white text-oxford-blue border border-[#E5E7EB]'
            }`}
          >
            {t('dashboard.practice.questionStatus.solved')}
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="font-roboto font-normal text-[16px] leading-[24px] tracking-[0%] text-oxford-blue">
              {t('dashboard.practice.questionStatus.incorrect')}
            </span>
            <span className="font-roboto font-normal text-[16px] leading-[24px] tracking-[0%] text-moonstone-blue ml-auto">
              {loadingSummary ? (
                <Loader size="sm" color="moonstone-blue" className="inline-block" />
              ) : sessionMode === 'test' ? (
                testSummary?.totalIncorrectAnswers || 0
              ) : (
                studySummary?.totalIncorrectAnswers || 0
              )}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-roboto font-normal text-[16px] leading-[24px] tracking-[0%] text-oxford-blue">
              {t('dashboard.practice.questionStatus.correct')}
            </span>
            <span className="font-roboto font-normal text-[16px] leading-[24px] tracking-[0%] text-moonstone-blue ml-auto">
              {loadingSummary ? (
                <Loader size="sm" color="moonstone-blue" className="inline-block" />
              ) : sessionMode === 'test' ? (
                testSummary?.totalCorrectAnswers || 0
              ) : (
                studySummary?.totalCorrectAnswers || 0
              )}
            </span>
          </div>
        </div>
        </div>
      </div>

      {/* Question Pool Section */}
      <div className="mb-6 bg-white rounded-xl border border-[#E5E7EB] shadow-dashboard p-4 md:p-6 w-full">
        <h2 className="font-archivo font-bold text-[18px] md:text-[20px] leading-[28px] tracking-[0%] text-oxford-blue mb-4">
          {t('dashboard.practice.questionPool.title')}
        </h2>
        
        <div className="mb-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedAllQuestions}
              onChange={async (e) => {
                e.stopPropagation();
                const newValue = !selectedAllQuestions;
                setSelectedAllQuestions(newValue);
                
                if (newValue) {
                  // Select all topics from all subjects
                  if (allTopics.length > 0) {
                    const allTopicIds = {};
                    allTopics.forEach(topic => {
                      const topicId = topic.id || topic._id;
                      if (topicId) {
                        allTopicIds[topicId] = true;
                      }
                    });
                    setSelectedSubtopics(allTopicIds);
                    
                    // Select all subjects
                    const allSubjectIds = {};
                    subjects.forEach(subject => {
                      const subjectId = subject.id || subject._id;
                      if (subjectId) {
                        allSubjectIds[subjectId] = true;
                      }
                    });
                    setSelectedSubjects(allSubjectIds);
                    
                    // Expand all subjects in the UI
                    const allExpanded = {};
                    subjects.forEach(subject => {
                      const subjectId = subject.id || subject._id;
                      if (subjectId) {
                        allExpanded[subjectId] = true;
                      }
                    });
                    setExpandedDomains(allExpanded);
                  } else {
                    // If allTopics not loaded yet, fetch them
                    try {
                      setLoadingTopics(true);
                      const response = await topicsAPI.getAllTopics();
                      if (response.success && response.data) {
                        const topicsList = response.data.topics || response.data;
                        // Use question counts from API response
                        const topicsWithCounts = topicsList.map((topic) => ({
                          ...topic,
                          count: topic.count || 0, // Use count from API response
                        }));
                        setAllTopics(topicsWithCounts);
                        
                        const allTopicIds = {};
                        topicsWithCounts.forEach(topic => {
                          const topicId = topic.id || topic._id;
                          if (topicId) {
                            allTopicIds[topicId] = true;
                          }
                  });
                        setSelectedSubtopics(allTopicIds);
                        
                        // Select all subjects
                        const allSubjectIds = {};
                        subjects.forEach(subject => {
                          const subjectId = subject.id || subject._id;
                          if (subjectId) {
                            allSubjectIds[subjectId] = true;
                          }
                        });
                        setSelectedSubjects(allSubjectIds);
                        
                        // Expand all subjects
                        const allExpanded = {};
                        subjects.forEach(subject => {
                          const subjectId = subject.id || subject._id;
                          if (subjectId) {
                            allExpanded[subjectId] = true;
                          }
                        });
                        setExpandedDomains(allExpanded);
                      }
                    } catch (error) {
                      console.error('Error fetching all topics:', error);
                      showErrorToast('Failed to load all topics. Please try again.');
                      setSelectedAllQuestions(false);
                    } finally {
                      setLoadingTopics(false);
                    }
                  }
                } else {
                  // Unselect all topics and subjects when "All Questions" is unchecked
                  setSelectedSubtopics({});
                  setSelectedSubjects({});
                }
              }}
              className="w-5 h-5 rounded border-gray-300 accent-cinnebar-red focus:ring-cinnebar-red"
            />
            <span className="font-archivo font-bold text-[16px] leading-[24px] tracking-[0%] text-oxford-blue">
              {t('dashboard.practice.questionPool.allQuestions')}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subjects (previously Domains) */}
          <div>
            <h3 className="font-archivo font-semibold text-[16px] leading-[24px] tracking-[0%] text-oxford-blue mb-3">
              {t('dashboard.practice.questionPool.subjects')}
            </h3>
            <div className={loadingSubjects ? "min-h-[200px] flex flex-col" : "space-y-2"}>
              {loadingSubjects ? (
                <div className="flex-1 flex items-center justify-center py-4">
                  <Loader size="lg" />
                </div>
              ) : subjects.length === 0 ? (
                <div className="text-center py-4 text-oxford-blue">No subjects available</div>
              ) : (
                subjects.map((subject) => {
                  const subjectId = subject.id || subject._id;
                  const isExpanded = expandedDomains[subjectId];
                  const isSelected = selectedSubjects[subjectId] || false;
                  
                  // Check if any subtopics of this subject are selected
                  const subjectIdStr = String(subjectId);
                  const hasSelectedSubtopics = allTopics.some(topic => {
                    const topicId = topic.id || topic._id;
                    if (!topicId || !selectedSubtopics[topicId]) return false;
                    
                    // Check if this topic belongs to the current subject
                    let topicSubjectId = null;
                    if (topic.parentSubject) {
                      if (typeof topic.parentSubject === 'object' && topic.parentSubject.id) {
                        topicSubjectId = topic.parentSubject.id;
                      } else {
                        topicSubjectId = topic.parentSubject;
                      }
                    } else {
                      topicSubjectId = topic.subjectId || topic.subject?.id || topic.subject?._id || topic.subject;
                    }
                    
                    return topicSubjectId ? String(topicSubjectId) === subjectIdStr : false;
                  });
                  
                  // Highlight border if subject is selected OR any of its subtopics are selected
                  const shouldHighlight = isSelected || hasSelectedSubtopics;
                  
                  return (
                <button
                    key={subjectId}
                    onClick={(e) => {
                      // Only toggle expansion on button click, not checkbox
                      if (e.target.type === 'checkbox') {
                        return; // Let checkbox handle its own click
                      }
                      // Toggle expansion only
                      if (selectedSubjectId === subjectId) {
                        // Closing this subject's subtopics
                        setSelectedSubjectId(null);
                        setTopics([]);
                        setExpandedDomains(prev => ({
                          ...prev,
                          [subjectId]: false,
                        }));
                      } else {
                        // Opening this subject's subtopics - close all others first
                        setSelectedSubjectId(subjectId);
                        setExpandedDomains(prev => {
                          // Close all other subjects and open this one
                          const newState = {};
                          Object.keys(prev).forEach(id => {
                            newState[id] = false;
                          });
                          newState[subjectId] = true;
                          return newState;
                        });
                      }
                    }}
                  className={`w-full flex items-center justify-between rounded-lg transition-colors h-[44px] px-4 py-3 bg-white border ${
                    shouldHighlight ? 'border-cinnebar-red border-2' : 'border-[#E5E7EB]'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation(); // Prevent button click
                        // Toggle selection without expanding
                        setSelectedSubjects(prev => {
                          const newState = {
                            ...prev,
                            [subjectId]: !prev[subjectId],
                          };
                          
                          // If unselecting subject, clear its topics from selectedSubtopics
                          if (isSelected) {
                            // Find topics that belong to this subject from both topics and allTopics
                            // Topics use parentSubject field to link to subject
                            const allAvailableTopics = [...topics, ...allTopics];
                            const subjectIdStr = String(subjectId);
                            
                            // Build a map of topic ID to topic for quick lookup
                            const topicMap = new Map();
                            allAvailableTopics.forEach(t => {
                              const topicId = t.id || t._id;
                              if (topicId) {
                                topicMap.set(String(topicId), t);
                                topicMap.set(topicId, t); // Also store with original type
                              }
                            });
                            
                            setSelectedSubtopics(prevSubtopics => {
                              const updated = { ...prevSubtopics };
                              
                              // Iterate through all selected topic IDs and check if they belong to this subject
                              Object.keys(prevSubtopics).forEach(topicKey => {
                                const topic = topicMap.get(topicKey) || topicMap.get(String(topicKey));
                                if (topic) {
                                  // parentSubject can be a string ID or an object with { id, name }
                                  let topicSubjectId = null;
                                  if (topic.parentSubject) {
                                    if (typeof topic.parentSubject === 'object' && topic.parentSubject.id) {
                                      topicSubjectId = topic.parentSubject.id;
                                    } else {
                                      topicSubjectId = topic.parentSubject;
                                    }
                                  } else {
                                    // Fallback to other possible fields
                                    topicSubjectId = topic.subjectId || topic.subject?.id || topic.subject?._id || topic.subject;
                                  }
                                  
                                  const topicSubjectIdStr = topicSubjectId ? String(topicSubjectId) : '';
                                  if (topicSubjectIdStr === subjectIdStr) {
                                    // This topic belongs to the unselected subject, remove it
                                    delete updated[topicKey];
                                  }
                                }
                              });
                              
                              return updated;
                            });
                          }
                          
                          // Turn off "All Questions" when manually selecting/unselecting
                          setSelectedAllQuestions(false);
                          
                          return newState;
                        });
                      }}
                      onClick={(e) => e.stopPropagation()} // Prevent button click
                      className="w-5 h-5 rounded border-gray-300 accent-cinnebar-red focus:ring-cinnebar-red flex-shrink-0"
                    />
                  <span className="font-archivo font-normal text-[16px] leading-[24px] tracking-[0%] text-oxford-blue">
                      {subject.name} {isSelected && <span className="text-cinnebar-red font-semibold">(Selected)</span>}
                  </span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-oxford-blue transition-transform flex-shrink-0 ${
                      selectedSubjectId === subjectId ? 'rotate-90' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                );
                })
              )}
            </div>
          </div>

          {/* Topics (previously Subtopics) */}
          <div>
            <h3 className="font-archivo font-semibold text-[16px] leading-[24px] tracking-[0%] text-oxford-blue mb-3">
              {t('dashboard.practice.questionPool.topic')}
            </h3>
            <div className={loadingTopics ? "min-h-[200px] flex flex-col" : "space-y-2"}>
              {loadingTopics ? (
                <div className="flex-1 flex items-center justify-center py-4">
                  <Loader size="sm" text="Loading topics..." />
                </div>
              ) : topics.length === 0 ? (
                <div className="text-center py-4 text-oxford-blue">
                  {selectedSubjectId ? 'No topics available for this subject' : 'Select a subject to view topics'}
                </div>
              ) : (
                topics.map((topic) => (
                <label 
                    key={topic.id || topic._id} 
                  className="w-full flex items-center gap-3 cursor-pointer rounded-lg transition-colors h-[44px] px-4 py-3 bg-white border border-[#E5E7EB]"
                >
                  <input
                    type="checkbox"
                      checked={selectedSubtopics[topic.id || topic._id] || false}
                      onChange={() => toggleTopic(topic.id || topic._id)}
                    className="w-5 h-5 rounded border-gray-300 accent-cinnebar-red focus:ring-cinnebar-red"
                  />
                  <span className="font-archivo font-normal text-[16px] leading-[24px] tracking-[0%] text-oxford-blue">
                      {topic.name}
                  </span>
                  <span className="font-roboto font-normal text-[16px] leading-[24px] tracking-[0%] text-moonstone-blue ml-auto">
                      {topic.count || 0}
                  </span>
                </label>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Session Size Section */}
      <div className="mb-8 bg-white rounded-xl border border-[#E5E7EB] shadow-dashboard p-4 md:p-6">
        <h2 className="font-archivo font-bold text-[18px] md:text-[20px] leading-[28px] tracking-[0%] text-oxford-blue mb-4">
          {t('dashboard.practice.sessionSize.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Number of Questions - For both modes */}
          <div className="w-full max-w-[200px]">
            <label className="block font-archivo font-bold text-[16px] leading-[24px] text-oxford-blue mb-2">
              {t('dashboard.practice.sessionSize.numberOfQuestions')}
            </label>
            <input
              type="number"
              value={sessionSize}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (Number(value) >= 1 && Number(value) <= 50)) {
                  setSessionSize(value);
                }
              }}
              min="1"
              max="50"
              className="w-full h-[48px] px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-cinnebar-red focus:border-transparent font-roboto font-medium text-[16px] leading-[24px] text-black placeholder:text-[16px] placeholder:text-black"
            />
          </div>
          {/* Time Limit - Only for test mode, positioned on the right */}
          {sessionMode === 'test' && (
            <div className="w-full">
              <label className="block font-archivo font-bold text-[16px] leading-[24px] text-oxford-blue mb-2">
                {t('dashboard.practice.sessionSize.timeLimit')}
              </label>
              <Dropdown
                value={timeLimit}
                onChange={(value) => setTimeLimit(value)}
                options={[
                  { value: '15', label: `15 ${t('dashboard.practice.sessionSize.minutes')}` },
                  { value: '30', label: `30 ${t('dashboard.practice.sessionSize.minutes')}` },
                  { value: '45', label: `45 ${t('dashboard.practice.sessionSize.minutes')}` },
                  { value: '60', label: `60 ${t('dashboard.practice.sessionSize.minutes')}` },
                ]}
                className="w-full"
                height="h-[48px]"
                textClassName="font-roboto font-medium text-[16px] leading-[24px]"
              />
            </div>
          )}
        </div>
        <p className="font-roboto font-normal text-[14px] leading-[20px] tracking-[0%] text-gray-500 mb-4">
          {t('dashboard.practice.sessionSize.enterRange')}
        </p>
        {/* Warning Message - Only show when topics are selected and total is 0 */}
        {selectedSubtopicCount > 0 && totalAvailableQuestions === 0 && (
          <div className="rounded-lg flex items-center gap-2 w-full h-auto lg:h-[47px] bg-papaya-whip border border-cinnebar-red px-4 py-3 mb-4">
              <svg className="w-5 h-5 text-cinnebar-red flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="font-roboto font-normal text-[14px] leading-[20px] tracking-[0%] text-cinnebar-red">
              {t('dashboard.practice.sessionSize.onlyQuestionsAvailable')}
              </p>
            </div>
        )}
      </div>

      {/* Begin Session Button */}
      <div className="flex justify-center">
        <button
          disabled={!canStartSession || !hasActiveSubscription || checkingSubscription}
          onClick={handleStartSession}
          className={`font-archivo font-bold text-[20px] leading-[28px] tracking-[0%] text-oxford-blue text-center rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 w-full lg:w-[1120px] h-[50px] md:h-[60px] ${
            canStartSession && hasActiveSubscription ? 'bg-cinnebar-red text-white' : 'bg-ash-gray text-oxford-blue cursor-not-allowed'
          }`}
        >
          {!hasActiveSubscription && !checkingSubscription 
            ? 'Subscribe to Start Session' 
            : t('dashboard.practice.beginSession')}
        </button>
      </div>
    </div>
  );
};

export default PracticePage;

