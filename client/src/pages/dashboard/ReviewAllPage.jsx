import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { flag } from '../../assets/svg/dashboard';
import { useLanguage } from '../../context/LanguageContext';
import studentQuestionsAPI from '../../api/studentQuestions';
import { showErrorToast } from '../../utils/toastConfig';

const ReviewAllPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
  const [showQuestionNav, setShowQuestionNav] = useState(false);

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
                };
              });
          } else if (sessionData.mode === 'study' && sessionData.question) {
            // Old format: single question for study mode
            const optionsObj = sessionData.question.options || {};
            const options = ['A', 'B', 'C', 'D', 'E'].map((key) => ({
              id: key,
              text: optionsObj[key] || '',
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
            setCurrentQuestionIndex(0);
            setVisitedQuestions(new Set([0]));
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
  }, [sessionId, navigate]);

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
    <div className="min-h-screen bg-white">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-[#E5E7EB] px-4 md:px-6 py-3 md:py-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Top Row - Mobile: Item Info and Menu */}
          <div className="flex items-center justify-between gap-4 w-full lg:w-auto">
            <div className="text-[20px] font-bold text-oxford-blue font-archivo leading-[28px] tracking-[0%]">
              {t('dashboard.reviewAll.item').replace('{{current}}', (currentQuestionIndex + 1).toString()).replace('{{total}}', totalQuestions.toString())}
            </div>
            <div className="hidden lg:block text-[14px] md:text-[16px] leading-[100%] font-normal text-blue-dark font-roboto">
              {t('dashboard.reviewAll.questionId')} {currentQuestion.shortId || currentQuestion.id || currentQuestionIndex + 1}
            </div>
            <button className="hidden lg:block text-oxford-blue hover:opacity-70">
              <img src={flag} alt="Flag" className="" />
            </button>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowQuestionNav(!showQuestionNav)}
              className="lg:hidden text-oxford-blue hover:opacity-70"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile: Mark, Formula Sheet, and Time Remaining */}
          <div className="lg:hidden flex items-center gap-2 w-full justify-between">
            <button className="px-3 py-1.5 bg-[#F3F4F6] text-oxford-blue rounded text-[14px] font-normal font-roboto hover:opacity-70 flex items-center gap-2">
              <img src={flag} alt="Mark" className="" />
            </button>
            {/* <button className="px-3 py-1.5 bg-[#F3F4F6] text-oxford-blue rounded text-[14px] font-normal font-roboto hover:opacity-70 flex items-center gap-2">
              {t('dashboard.reviewAll.formulaSheet')}
            </button> */}
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-normal text-oxford-blue font-roboto">
                {t('dashboard.reviewAll.timeRemaining')} <span className="font-bold">12:45</span>
              </span>
            </div>
          </div>

          {/* Center: Navigation Info - Hidden on mobile, shown on larger screens */}
          <div className="hidden md:flex items-center gap-4 flex-wrap flex-1 justify-center">
            {/* Navigation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`px-3 py-1 rounded text-[14px] font-normal font-roboto transition-colors ${
                  currentQuestionIndex === 0
                    ? 'text-[#9CA3AF] cursor-not-allowed'
                    : 'text-oxford-blue hover:bg-[#F3F4F6]'
                }`}
              >
                {t('dashboard.reviewAll.actions.previous')}
              </button>
              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === totalQuestions - 1}
                className={`px-3 py-1 rounded text-[14px] font-normal font-roboto transition-colors ${
                  currentQuestionIndex === totalQuestions - 1
                    ? 'text-[#9CA3AF] cursor-not-allowed'
                    : 'text-oxford-blue hover:bg-[#F3F4F6]'
                }`}
              >
                {t('dashboard.reviewAll.actions.next')}
              </button>
            </div>
          </div>

          {/* Right: Formula Sheet and Time */}
          <div className="hidden lg:flex items-center gap-2 md:gap-4 w-full lg:w-auto justify-between lg:justify-end">
            {/* <button className="hidden lg:block px-2 md:px-3 py-1.5 bg-[#F3F4F6] text-oxford-blue rounded text-[12px] md:text-[14px] font-normal font-roboto hover:opacity-70">
              <span className="hidden sm:inline">{t('dashboard.reviewAll.formulaSheet')}</span>
              <span className="sm:hidden">{t('dashboard.reviewAll.formulaSheet')}</span>
            </button> */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-[12px] md:text-[14px] font-normal text-oxford-blue font-roboto">
                <span className="hidden sm:inline">{t('dashboard.reviewAll.timeRemaining')} </span>12:45
              </span>
              {/* <button className="text-oxford-blue hover:opacity-70">
                <img src={setting} alt="Settings" className="w-4 h-4 md:w-5 md:h-5" />
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-120px)] md:h-[calc(100vh-120px)] pb-[180px] md:pb-0">
        {/* Mobile Question Navigation Overlay */}
        {showQuestionNav && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setShowQuestionNav(false)}
            />
            <div className="fixed left-0 top-0 bottom-0 w-[280px] bg-white overflow-y-auto z-50 lg:hidden shadow-lg">
              <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
                <h3 className="text-[18px] font-bold text-oxford-blue font-archivo">{t('dashboard.reviewAll.questions')}</h3>
                <button
                  onClick={() => setShowQuestionNav(false)}
                  className="text-oxford-blue hover:opacity-70"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-2">
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: totalQuestions }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        handleQuestionClick(i);
                        setShowQuestionNav(false);
                      }}
                      className={`py-2 px-3 text-[14px] font-medium font-roboto transition-colors text-center border border-[#B9C9C5] rounded ${
                        i === currentQuestionIndex
                          ? 'bg-[#EF4444] text-white border-[#EF4444]'
                          : visitedQuestions.has(i)
                          ? 'bg-[#C6D8D3] text-oxford-blue hover:opacity-80'
                          : 'bg-white text-oxford-blue hover:opacity-80'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Left Question Navigation Pane - Desktop */}
        <div className="hidden lg:flex w-[110px] h-full bg-white overflow-y-auto flex-col border-r border-[#E5E7EB]">
          {/* Question Numbers */}
          <div className="flex-1 py-2">
            {Array.from({ length: totalQuestions }, (_, i) => (
              <button
                key={i}
                onClick={() => handleQuestionClick(i)}
                className={`w-full py-2 text-[14px] font-medium font-roboto transition-colors text-center border border-[#B9C9C5] ${
                  i === currentQuestionIndex
                    ? 'bg-[#EF4444] text-white border-[#EF4444]'
                    : visitedQuestions.has(i)
                    ? 'bg-[#C6D8D3] text-oxford-blue hover:opacity-80'
                    : 'bg-white text-oxford-blue hover:opacity-80'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Central Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto lg:ml-5">
            {/* Question Id - Mobile */}
            <div className="lg:hidden text-[14px] font-normal text-dark-gray font-roboto mb-2">
              {t('dashboard.reviewAll.questionId')} {currentQuestion.shortId || currentQuestion.id || currentQuestionIndex + 1}
            </div>

            {/* Title */}
            <h2 className="text-[24px] md:text-[32px] lg:text-[36px] font-bold text-oxford-blue mb-2 md:mb-4 font-archivo leading-tight tracking-[0%]">
              {t('dashboard.reviewAll.title')}
            </h2>

            {/* Subtitle */}
            <p className="text-[14px] md:text-[16px] font-normal text-dark-gray font-roboto mb-6 md:mb-10 leading-[24px] tracking-[0%]">
              {t('dashboard.reviewAll.subtitle')}
            </p>

            {/* Question Prompt */}
            <div className="mb-4 md:mb-6">
              <div 
                className="text-[16px] md:text-[18px] font-normal text-oxford-blue font-roboto leading-[24px] tracking-[0%]"
                dangerouslySetInnerHTML={{ 
                  __html: currentQuestion.question 
                    ? currentQuestion.question.replace(/<code[^>]*data-start[^>]*>(.*?)<\/code>/gi, '$1')
                    : '' 
                }}
              />
            </div>

            {/* Answer Options */}
            <div className="mb-4 md:mb-6">
              <div className="space-y-3 mb-6 md:mb-10 w-full min-h-[300px] md:min-h-[400px] flex flex-col items-start justify-center p-4 md:pl-8 bg-white shadow-content rounded-lg">
                {currentQuestion.options.map((option) => {
                  const isSelected = option.id === currentQuestion.selectedAnswer;
                  const isCorrect = option.id === currentQuestion.correctAnswer;
                  
                  return (
                    <div
                      key={option.id}
                      className={`w-full min-h-[50px] rounded-lg border-2 flex items-center px-3 md:px-4 py-2 ${
                        isSelected
                          ? 'border-[#ED4122] bg-white'
                          : 'border-[#E5E7EB] bg-white'
                      }`}
                    >
                      <label className="flex items-center gap-2 md:gap-3 cursor-pointer w-full">
                        <input
                          type="radio"
                          name="answer"
                          value={option.id}
                          checked={isSelected}
                          readOnly
                          className="w-4 h-4 md:w-5 md:h-5 text-[#EF4444] border-[#EF4444] focus:ring-[#EF4444] flex-shrink-0"
                        />
                        <span className="text-[14px] md:text-[16px] font-normal text-oxford-blue font-roboto flex-1">
                          <span className="font-medium">{option.id}.</span> {option.text}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
              
              {/* Next Question Button */}
              {currentQuestionIndex < totalQuestions - 1 && (
                <button 
                  onClick={handleNextQuestion}
                  className="w-full md:w-[316px] mb-6 md:mb-10 h-[50px] md:h-[60px] bg-[#ED4122] text-white rounded-[8px] text-[16px] md:text-[20px] font-bold font-archivo leading-[28px] tracking-[0%] flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <span className="hidden md:inline">{t('dashboard.reviewAll.nextQuestion')}</span>
                  <span className="md:hidden">{t('dashboard.reviewAll.newQuestion')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="fixed md:relative bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 md:px-6 py-3 md:py-4 z-30 shadow-footer md:shadow-none">
        {/* Mobile: Previous and Next Buttons */}
        <div className="md:hidden flex items-center justify-between gap-2 mb-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`flex-1 px-3 py-2 rounded text-[14px] font-normal font-roboto transition-colors ${
              currentQuestionIndex === 0
                ? 'text-[#9CA3AF] cursor-not-allowed bg-[#F3F4F6]'
                : 'text-oxford-blue bg-[#F3F4F6] hover:bg-[#E5E7EB]'
            }`}
          >
            {t('dashboard.reviewAll.actions.previous')}
          </button>
          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === totalQuestions - 1}
            className={`flex-1 px-3 py-2 rounded text-[14px] font-normal font-roboto transition-colors ${
              currentQuestionIndex === totalQuestions - 1
                ? 'text-[#9CA3AF] cursor-not-allowed bg-[#F3F4F6]'
                : 'text-oxford-blue bg-[#F3F4F6] hover:bg-[#E5E7EB]'
            }`}
          >
            {t('dashboard.reviewAll.actions.next')}
          </button>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 md:gap-10">
          <button className="w-full sm:w-auto px-4 py-2 bg-white border border-[#E5E7EB] text-oxford-blue rounded-lg text-[14px] md:text-[16px] font-normal font-roboto hover:opacity-90 transition-opacity">
            {t('dashboard.reviewAll.actions.studyMode')}
          </button>
          {sessionId && (
            <button 
              onClick={() => navigate(`/dashboard/review-incorrect?sessionId=${sessionId}`)}
              className="w-full sm:w-auto px-4 py-2 bg-[#C6D8D3] text-oxford-blue rounded-lg text-[14px] md:text-[16px] font-normal font-roboto hover:opacity-90 transition-opacity"
            >
              {t('dashboard.reviewAll.actions.reviewIncorrect')}
            </button>
          )}
          <button
            onClick={() => navigate('/dashboard/review')}
            className="w-full sm:w-auto px-4 py-2 bg-white border border-[#E5E7EB] text-oxford-blue rounded-lg text-[14px] md:text-[16px] font-normal font-roboto hover:opacity-90 transition-opacity"
          >
            {t('dashboard.reviewAll.actions.exitSession')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewAllPage;

