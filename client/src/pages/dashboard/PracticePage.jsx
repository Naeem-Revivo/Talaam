import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import subjectsAPI from '../../api/subjects';
import topicsAPI from '../../api/topics';
import studentQuestionsAPI from '../../api/studentQuestions';
import subscriptionAPI from '../../api/subscription';
import { showErrorToast } from '../../utils/toastConfig';
import PracticePageHeader from '../../components/dashboard/PracticePage/components/PracticePageHeader';
import SessionModeCard from '../../components/dashboard/PracticePage/components/SessionModeCard';
import QuestionStatusCard from '../../components/dashboard/PracticePage/components/QuestionStatusCard';
import QuestionPoolSection from '../../components/dashboard/PracticePage/components/QuestionPoolSection';
import SessionSizeSection from '../../components/dashboard/PracticePage/components/SessionSizeSection';
import BeginSessionButton from '../../components/dashboard/PracticePage/components/BeginSessionButton';

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

  const handleSubjectExpand = (subjectId) => {
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
  };

  const handleSubjectCheckboxChange = (subjectId, isCurrentlySelected) => {
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
      
      // Turn off "All Questions" when manually selecting/unselecting
      setSelectedAllQuestions(false);
      
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

  const handleAllQuestionsChange = async (e) => {
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
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 2xl:px-6 max-w-[1200px] mx-auto min-h-screen">
      <PracticePageHeader />

      {/* Session Mode and Question Status Cards - Flexed */}
      <div className="flex flex-col xl:flex-row justify-start gap-2 mb-6">
        <SessionModeCard
          sessionMode={sessionMode}
          hasActiveSubscription={hasActiveSubscription}
          checkingSubscription={checkingSubscription}
          onModeChange={handleSessionModeChange}
        />
        <QuestionStatusCard
          questionStatus={questionStatus}
          onStatusChange={handleStatusChange}
          sessionMode={sessionMode}
          testSummary={testSummary}
          studySummary={studySummary}
          loadingSummary={loadingSummary}
        />
      </div>

      <QuestionPoolSection
        selectedAllQuestions={selectedAllQuestions}
        onAllQuestionsChange={handleAllQuestionsChange}
        subjects={subjects}
        topics={topics}
        loadingSubjects={loadingSubjects}
        loadingTopics={loadingTopics}
        expandedDomains={expandedDomains}
        selectedSubjects={selectedSubjects}
        selectedSubjectId={selectedSubjectId}
        selectedSubtopics={selectedSubtopics}
        allTopics={allTopics}
        onSubjectToggle={() => {}}
        onSubjectCheckboxChange={handleSubjectCheckboxChange}
        onSubjectExpand={handleSubjectExpand}
        onTopicToggle={toggleTopic}
      />

      <SessionSizeSection
        sessionMode={sessionMode}
        sessionSize={sessionSize}
        timeLimit={timeLimit}
        onSessionSizeChange={setSessionSize}
        onTimeLimitChange={setTimeLimit}
        selectedSubtopicCount={selectedSubtopicCount}
        totalAvailableQuestions={totalAvailableQuestions}
      />

      <BeginSessionButton
        canStartSession={canStartSession}
        hasActiveSubscription={hasActiveSubscription}
        checkingSubscription={checkingSubscription}
        onClick={handleStartSession}
      />
    </div>
  );
};

export default PracticePage;