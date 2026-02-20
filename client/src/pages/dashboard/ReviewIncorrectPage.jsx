import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import studentQuestionsAPI from '../../api/studentQuestions';
import { showErrorToast } from '../../utils/toastConfig';
import ReportIssueModal, { FlagReasonModal } from '../../components/common/ReportIssueModal';
import ReviewIncorrectHeader from '../../components/dashboard/ReviewPage/components/ReviewIncorrectHeader';
import ReviewIncorrectMainContent from '../../components/dashboard/ReviewPage/components/ReviewIncorrectMainContent';

const ReviewIncorrectPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  
  // Check for data passed via navigation state
  const stateData = location.state;
  const incorrectQuestionsFromState = stateData?.incorrectQuestions;
  const fromCurrentSession = stateData?.fromCurrentSession;
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(true);
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
  const [showQuestionNav, setShowQuestionNav] = useState(false);
  const [showExplanationPanel, setShowExplanationPanel] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [timeSpent, setTimeSpent] = useState('0:01');
  const [answeredCorrectly, setAnsweredCorrectly] = useState(77);
  const [overallProgress, setOverallProgress] = useState(33);
  const [timeRemaining, setTimeRemaining] = useState('42:50');

  // Fetch incorrect questions
  useEffect(() => {
    const fetchIncorrectQuestions = async () => {
      // If we have data from navigation state, use it
      if (incorrectQuestionsFromState && Array.isArray(incorrectQuestionsFromState)) {
        try {
          setLoading(true);
          const formattedQuestions = incorrectQuestionsFromState.map((item, index) => {
            const optionsObj = item.options || {};
            const options = ['A', 'B', 'C', 'D', 'E'].map((key) => ({
              id: key,
              text: optionsObj[key] || '',
              correct: key === item.correctAnswer,
              userSelected: key === item.selectedAnswer,
            })).filter(opt => opt.text);

            return {
              id: item.questionId || index + 1,
              shortId: item.shortId || null,
              question: item.questionText || '',
              options,
              correctAnswer: item.correctAnswer,
              selectedAnswer: item.selectedAnswer,
              explanation: item.explanation || '',
            };
          });

          setQuestions(formattedQuestions);
          if (formattedQuestions.length > 0) {
            setCurrentQuestionIndex(0);
            setVisitedQuestions(new Set([0]));
          }
          // If no incorrect questions, the component will show the "No incorrect questions" message
        } catch (error) {
          console.error('Error formatting incorrect questions from state:', error);
          // Navigate silently without showing error
          navigate('/dashboard/review');
        } finally {
          setLoading(false);
        }
        return;
      }

      // Otherwise, try to fetch from sessionId
      if (!sessionId) {
        // If no sessionId and no state data, navigate back to review page
        // Don't show error toast - just redirect silently
        setLoading(false);
        navigate('/dashboard/review');
        return;
      }

      try {
        setLoading(true);
        const response = await studentQuestionsAPI.getSessionIncorrect(sessionId);

        if (response.success && response.data) {
          const sessionData = response.data;
          let formattedQuestions = [];

          if (sessionData.incorrect && Array.isArray(sessionData.incorrect)) {
            formattedQuestions = sessionData.incorrect.map((item, index) => {
              const optionsObj = item.options || {};
              const options = ['A', 'B', 'C', 'D', 'E'].map((key) => ({
                id: key,
                text: optionsObj[key] || '',
                correct: key === item.correctAnswer,
                userSelected: key === item.selectedAnswer,
              })).filter(opt => opt.text);

              return {
                id: item.questionId || index + 1,
                shortId: item.shortId || null,
                question: item.questionText || '',
                options,
                correctAnswer: item.correctAnswer,
                selectedAnswer: item.selectedAnswer,
                explanation: item.explanation || '',
              };
            });
          }

          setQuestions(formattedQuestions);
          if (formattedQuestions.length > 0) {
            setCurrentQuestionIndex(0);
            setVisitedQuestions(new Set([0]));
          }
        }
      } catch (error) {
        console.error('Error fetching incorrect questions:', error);
        // Only show error if we have a sessionId (meaning user came from review page with sessionId)
        // If coming from current session without sessionId, navigate silently
        if (sessionId) {
          showErrorToast(error.message || 'Failed to load incorrect questions');
        }
        navigate('/dashboard/review');
      } finally {
        setLoading(false);
      }
    };

    fetchIncorrectQuestions();
  }, [sessionId, navigate, incorrectQuestionsFromState, fromCurrentSession]);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex] || null;

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
    setVisitedQuestions(prev => new Set([...prev, index]));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      setVisitedQuestions(prev => new Set([...prev, newIndex]));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      setVisitedQuestions(prev => new Set([...prev, newIndex]));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-oxford-blue text-lg">Loading incorrect questions...</div>
      </div>
    );
  }

  if (!currentQuestion || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-oxford-blue text-lg">No incorrect questions found in this session</div>
        <button
          onClick={() => navigate('/dashboard/review')}
          className="px-4 py-2 bg-cinnebar-red text-white rounded-lg"
        >
          Back to Review
        </button>
      </div>
    );
  }

  const handleFormulaSheet = () => {
    // TODO: Implement formula sheet functionality
    console.log('Formula Sheet clicked');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Header Bar */}
      <ReviewIncorrectHeader
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        timeRemaining={timeRemaining}
        showMarkForReview={false}
        onHomeClick={() => navigate('/dashboard/review')}
        onFormulaSheet={handleFormulaSheet}
        onSettingsClick={() => navigate('/dashboard/review')}
      />

      <ReviewIncorrectMainContent
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        currentQuestion={currentQuestion}
        questions={questions}
        timeSpent={timeSpent}
        answeredCorrectly={answeredCorrectly}
        sessionId={sessionId}
        onQuestionClick={handleQuestionClick}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onReviewAll={() => navigate(`/dashboard/review-all?sessionId=${sessionId}`)}
        onExitSession={() => navigate('/dashboard/review')}
      />

      {/* Bottom Footer Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4D4D4] px-4 md:px-[89px] py-3 md:py-5 z-30 shadow-footer">
        <div className="flex items-center justify-between">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-8 h-12 py-2 rounded-[14px] flex gap-2 items-center  text-base font-bold tracking-[-0.31px] font-roboto transition-colors shadow-sm shadow-[#0000000D] ${
              currentQuestionIndex === 0
                ? 'text-[#A3A3A3] cursor-not-allowed bg-[#F8FAFC]'
                : 'text-oxford-blue bg-[#F3F4F6] hover:bg-[#E5E7EB]'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Previous Question</span>
          </button>

          {/* Overall Progress */}
          <div className="text-[14px] leading-[21px] font-normal text-[#525252] font-roboto flex flex-col items-center justify-center gap-1">
            Overall Progress 
            <span className="text-[24px] leading-[32px] text-[#171717] font-bold tracking-[0.07px] font-roboto">{overallProgress}%</span>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === totalQuestions - 1}
            className={`px-8 h-12 py-2 rounded-[14px] flex gap-2 items-center  text-base font-bold tracking-[-0.31px] font-roboto transition-colors shadow-sm shadow-[#0000000D] ${
              currentQuestionIndex === totalQuestions - 1
                ? 'text-[#A3A3A3] cursor-not-allowed bg-[#F8FAFC]'
                : 'bg-[#EF4444] text-white hover:opacity-90'
            }`}
          >
            Next Question <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
</svg>

          </button>
        </div>
      </div>

      {/* Report Issue Modal */}
      <ReportIssueModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        questionId={currentQuestion?.id}
        question={currentQuestion}
      />

      {/* Flag Reason Modal */}
      <FlagReasonModal
        isOpen={showReasonModal}
        onClose={() => setShowReasonModal(false)}
        question={currentQuestion}
      />
    </div>
  );
};

export default ReviewIncorrectPage;

