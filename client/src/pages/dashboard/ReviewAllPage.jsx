import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { flag, setting, watch, analytics } from '../../assets/svg/dashboard';
import { useLanguage } from '../../context/LanguageContext';
import studentQuestionsAPI from '../../api/studentQuestions';
import { showErrorToast } from '../../utils/toastConfig';
import ReportIssueModal, { FlagReasonModal } from '../../components/common/ReportIssueModal';

// SVG Icons
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const OptionStatusIcon = ({ type }) => {
  if (type === 'correct') {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#15803D] text-[#15803D]">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }

  if (type === 'wrong') {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#EF4444] text-[#EF4444]">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 6l12 12M18 6L6 18" />
        </svg>
      </span>
    );
  }

  return null;
};

const ReviewAllPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const initialQuestionIndex = parseInt(searchParams.get('questionIndex') || '0', 10);
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialQuestionIndex);
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
  const [showQuestionNav, setShowQuestionNav] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [timeSpent, setTimeSpent] = useState('0:01');
  const [answeredCorrectly, setAnsweredCorrectly] = useState(77);
  const [overallProgress, setOverallProgress] = useState(33);

  // Fetch session data
  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId) {
        showErrorToast('Session ID is required');
        navigate('/dashboard/review');
        return;
      }

      try {
        setLoading(true);
        const response = await studentQuestionsAPI.getSessionDetail(sessionId);

        if (response.success && response.data) {
          const sessionData = response.data;
          let formattedQuestions = [];

          // Check if results array exists (works for both test and study modes)
          // This is the primary way to get questions for both test and study modes
          if (sessionData.results && Array.isArray(sessionData.results) && sessionData.results.length > 0) {
            // Process results array - works for both test and study modes
            formattedQuestions = sessionData.results
              .filter(result => result && result.questionText) // Filter out any null/invalid results
              .map((result, index) => {
                const optionsObj = result.options || {};
                const options = ['A', 'B', 'C', 'D', 'E'].map((key) => ({
                  id: key,
                  text: optionsObj[key] || '',
                  correct: key === result.correctAnswer,
                  userSelected: key === result.selectedAnswer,
                })).filter(opt => opt.text);

                return {
                  id: result.questionId || `q-${index + 1}`,
                  shortId: result.shortId || null,
                  question: result.questionText || '',
                  options,
                  correctAnswer: result.correctAnswer,
                  selectedAnswer: result.selectedAnswer || '',
                  isCorrect: result.isCorrect,
                  explanation: result.explanation || '',
                  isMarked: result.isMarked || false,
                };
              });
          } else if (sessionData.mode === 'study' && sessionData.question) {
            // Old format: single question for study mode
            const optionsObj = sessionData.question.options || {};
            const options = ['A', 'B', 'C', 'D', 'E'].map((key) => ({
              id: key,
              text: optionsObj[key] || '',
              correct: key === sessionData.question.correctAnswer,
              userSelected: key === sessionData.selectedAnswer,
            })).filter(opt => opt.text);

            formattedQuestions = [{
              id: sessionData.question.id || 1,
              shortId: sessionData.question.shortId || null,
              question: sessionData.question.questionText || '',
              options,
              correctAnswer: sessionData.question.correctAnswer,
              selectedAnswer: sessionData.selectedAnswer || '',
              isCorrect: sessionData.isCorrect,
              explanation: sessionData.question.explanation || '',
            }];
          }

          setQuestions(formattedQuestions);
          if (formattedQuestions.length > 0) {
            // Use initialQuestionIndex if valid, otherwise default to 0
            const validIndex = initialQuestionIndex >= 0 && initialQuestionIndex < formattedQuestions.length 
              ? initialQuestionIndex 
              : 0;
            setCurrentQuestionIndex(validIndex);
            setVisitedQuestions(new Set([validIndex]));
          }
        }
      } catch (error) {
        console.error('Error fetching session data:', error);
        showErrorToast(error.message || 'Failed to load session data');
        navigate('/dashboard/review');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId, navigate, initialQuestionIndex]);

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

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      handleNext();
    }
  };

  // Check if question is answered based on API response
  const isQuestionAnswered = (question) => {
    return question && question.selectedAnswer && question.selectedAnswer.trim() !== '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-oxford-blue text-lg">Loading session data...</div>
      </div>
    );
  }

  if (!currentQuestion || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-oxford-blue text-lg">No questions found in this session</div>
        <button
          onClick={() => navigate('/dashboard/review')}
          className="px-4 py-2 bg-cinnebar-red text-white rounded-lg"
        >
          Back to Review
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#D4D4D4] px-4 md:px-[89px] py-3 md:py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Home + Divider + Text */}
          <div className="flex items-center min-w-0">
            <button
              onClick={() => navigate('/dashboard/review')}
              className="text-oxford-blue hover:opacity-70 transition-opacity pr-6 border-r border-[#D4D4D4]"
              aria-label="Home"
            >
              <HomeIcon />
            </button>
            <div className="min-w-0 pl-6">
              <div className="text-[20px] font-bold text-[#171717] font-archivo leading-[28px] tracking-[-0.45%]">
                {t('dashboard.reviewAll.title') || 'Review All'}
              </div>
              <div className="text-[14px] leading-[20px] font-normal text-[#525252] font-roboto tracking-[-0.15%]">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </div>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard/review')}
              className="text-oxford-blue hover:opacity-70 transition-opacity"
              aria-label="Settings"
            >
              <img src={setting} alt="Settings" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 md:px-[89px] pt-6 pb-32">
      <div className="flex items-start gap-4">
        {/* Left: Question Content */}
        <div className="flex-1 min-w-0">
          <div className="">
            <div className="mb-5 border border-[#E6EEF3] shadow-sm shadow-[#0000000D] bg-white rounded-[16px] p-8">
              {/* Question Number and Title */}
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[11px] bg-gradient-to-r from-[#032746] to-[#173B50] flex items-center justify-center text-white font-medium text-[14px] leading-[21px] font-roboto">
                    {currentQuestionIndex + 1}
                  </div>
                  <span className="text-[14px] font-normal text-[#525252] font-roboto">Question {currentQuestionIndex + 1}</span>
                </div>
                {currentQuestion?.isMarked && (
                  <div className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] bg-[#FEF3C7] text-[#D97706]">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M7.44434 0.5L6.86719 1.29395L5.59863 3.03613L6.86719 4.7793L7.44434 5.57422H2.05566V7.65137C2.05566 8.07935 1.70533 8.42969 1.27734 8.42969C0.849549 8.42946 0.5 8.07921 0.5 7.65137V2.11133C0.5 1.6639 0.611812 1.23584 0.923828 0.923828C1.23584 0.611812 1.6639 0.5 2.11133 0.5H7.44434Z"
                        stroke="currentColor"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="text-[14px] leading-[21px] font-medium font-roboto">Marked for Review</span>
                  </div>
                )}
              </div>

              {/* Question Text */}
              <div>
                <div
                  className="text-[18px] font-normal text-[#0A0A0A] font-archivo leading-[27px]"
                  dangerouslySetInnerHTML={{
                    __html: currentQuestion.question
                      ? currentQuestion.question.replace(/<code[^>]*data-start[^>]*>(.*?)<\/code>/gi, '$1')
                      : ''
                  }}
                />
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option) => {
                const isCorrect = option.id === currentQuestion.correctAnswer;
                const isUserAnswer = option.id === currentQuestion.selectedAnswer;
                const isWrongUserAnswer = isUserAnswer && !isCorrect;
                const statusType = isCorrect ? 'correct' : isWrongUserAnswer ? 'wrong' : null;
                const optionClass = isCorrect
                  ? 'border-[#16A34A] bg-[#F0FDF4]'
                  : isWrongUserAnswer
                    ? 'border-[#EF4444] bg-[#FEF2F2]'
                    : 'border-[#D4D4D4] bg-white border-[1px]';
                
                return (
                  <div
                    key={option.id}
                    className={`w-full min-h-[62px] rounded-[12px] border-[1.5px] flex items-center px-6 py-3 ${optionClass}`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white border border-[#E6EEF3] text-[12px] leading-[28px] font-medium text-[#737373] font-roboto">
                        {option.id}
                      </span>
                      <span className="text-base font-normal text-dashboard-dark font-roboto flex-1">
                        {option.text}
                      </span>
                      <OptionStatusIcon type={statusType} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="w-[320px] shrink-0 self-start">
          {/* Performance Metrics */}
          <div className="mb-4 border border-[#D4D4D4] rounded-[14px] bg-white p-4">
            <div className="mb-3">
              <div className="flex items-center justify-between text-[14px] font-normal text-oxford-blue font-roboto">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-oxford-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Time spent
                </span>
                <span className="font-semibold">{timeSpent}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-[14px] font-normal text-oxford-blue font-roboto">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-oxford-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20V10m5 10V4m5 16v-6M4 20h16" />
                  </svg>
                  Answered correctly
                </span>
                <span className="font-semibold">{answeredCorrectly}%</span>
              </div>
            </div>
          </div>

          {/* All Questions Navigation */}
          <div className="mb-4 border border-[#D4D4D4] shadow-sm shadow-[#0000000D] rounded-[14px] bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[18px] leading-[27px] font-medium text-[#171717] font-roboto tracking-[-0.44px]">All Questions</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="text-[#7A9EB5] hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 15L7.5 10L12.5 5" stroke="#6697B7" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentQuestionIndex === totalQuestions - 1}
                  className="text-[#7A9EB5] hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="#6697B7" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-2 mb-3">
              {Array.from({ length: totalQuestions }, (_, i) => {
                const question = questions[i];
                const isAnswered = isQuestionAnswered(question);
                const isCurrent = i === currentQuestionIndex;
                const isMarkedForReview = Boolean(
                  question?.isMarked ||
                  question?.markedForReview ||
                  question?.isFlagged ||
                  question?.flagged
                );
                const isCorrect = question?.isCorrect === true;
                
                // Determine styling based on priority: Current > Marked > Correct/Incorrect > Unanswered
                let buttonClass = '';
                if (isCurrent) {
                  // Currently Selected/Active: Light blue background, blue border, dark blue text
                  buttonClass = 'bg-[#E0F2F7] text-[#1F4E79] border-[#007BFF]';
                } else if (isMarkedForReview) {
                  // Marked for Review: Light yellow background, yellow border, amber text
                  buttonClass = 'bg-[#FEFCE8] text-[#B45309] border-[#EAB308]';
                } else if (isAnswered) {
                  // Correct/Incorrect styling matching option colors
                  if (isCorrect) {
                    buttonClass = 'bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]';
                  } else {
                    buttonClass = 'bg-[#FEF2F2] text-[#EF4444] border-[#EF4444]';
                  }
                } else {
                  // Unanswered: White background, light gray border, dark gray text
                  buttonClass = 'bg-[#E6EEF3] text-[#6697B7] border-[#6697B7]';
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => handleQuestionClick(i)}
                    className={`h-10 min-w-[40px] px-0 text-[14px] font-medium font-roboto transition-colors text-center border rounded-[8px] ${buttonClass} hover:opacity-80`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            {/* Legend */}
            <div className="border-t border-[#E5E7EB] pt-3 space-y-1 text-[12px] font-normal text-[#525252] font-roboto">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#F0FDF4] border border-[#16A34A] rounded"></div>
                <span>Correct</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#FEF2F2] border border-[#EF4444] rounded"></div>
                <span>Incorrect</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#FEFCE8] border border-[#EAB308] rounded"></div>
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#F8FAFC] border border-[#D4D4D4] rounded"></div>
                <span>Unanswered</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {sessionId && (
              <button
                onClick={() => navigate(`/dashboard/review-incorrect?sessionId=${sessionId}`)}
                className="w-full px-4 py-3 bg-gradient-to-r from-[#032746] to-[#173B50] text-white rounded-[14px] text-base font-medium font-roboto hover:opacity-90 transition-opacity"
              >
                Review Incorrect
              </button>
            )}
            <button
              onClick={() => navigate('/dashboard/review')}
              className="w-full px-4 py-2 bg-transparent text-[#A3A3A3] rounded-[12px] text-base font-medium font-roboto hover:text-[#737373] transition-colors"
            >
              Exit Session
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 md:px-[89px] py-3 md:py-6 z-30 shadow-footer">
        <div className="flex items-center justify-between">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-8 h-12 py-2 rounded-[14px] flex gap-2 items-center text-base font-bold tracking-[-0.31px] font-roboto transition-colors shadow-sm shadow-[#0000000D] ${
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

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === totalQuestions - 1}
            className={`px-8 h-12 py-2 rounded-[14px] flex gap-2 items-center text-base font-bold tracking-[-0.31px] font-roboto transition-colors shadow-sm shadow-[#0000000D] ${
              currentQuestionIndex === totalQuestions - 1
                ? 'text-[#A3A3A3] cursor-not-allowed bg-[#F8FAFC]'
                : 'bg-[#EF4444] text-white hover:opacity-90'
            }`}
          >
            Next Question
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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

export default ReviewAllPage;

