import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { tick, cross, analytics, watch, setting, flag } from '../../assets/svg/dashboard';
import { useLanguage } from '../../context/LanguageContext';
import studentQuestionsAPI from '../../api/studentQuestions';
import { showErrorToast } from '../../utils/toastConfig';

const ReviewIncorrectPage = () => {
  const { t } = useLanguage();
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

  return (
    <div className="min-h-screen bg-white">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-[#E5E7EB] px-4 md:px-6 py-3 md:py-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Top Row - Mobile: Item Info and Menu */}
          <div className="flex items-center justify-between gap-4 w-full lg:w-auto">
            <div className="text-[20px] font-bold text-oxford-blue font-archivo leading-[28px] tracking-[0%]">
              {t('dashboard.reviewIncorrect.item').replace('{{current}}', (currentQuestionIndex + 1).toString()).replace('{{total}}', totalQuestions.toString())}
            </div>
            <div className="hidden lg:block text-[14px] md:text-[16px] font-normal text-dark-gray font-roboto">
              {t('dashboard.reviewIncorrect.questionId')} {currentQuestion.id || currentQuestionIndex + 1}
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
              {t('dashboard.reviewIncorrect.formulaSheet')}
            </button> */}
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-normal text-oxford-blue font-roboto">
                {t('dashboard.reviewIncorrect.timeRemaining')} <span className="font-bold">12:45</span>
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
                {t('dashboard.reviewIncorrect.actions.previous')}
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
                {t('dashboard.reviewIncorrect.actions.next')}
              </button>
            </div>
          </div>

          {/* Right: Formula Sheet and Time */}
          <div className="hidden lg:flex items-center gap-2 md:gap-4 w-full lg:w-auto justify-between lg:justify-end">
            {/* <button className="hidden lg:block px-2 md:px-3 py-1.5 bg-[#F3F4F6] text-oxford-blue rounded text-[12px] md:text-[14px] font-normal font-roboto hover:opacity-70">
              <span className="hidden sm:inline">{t('dashboard.reviewIncorrect.formulaSheet')}</span>
              <span className="sm:hidden">{t('dashboard.reviewIncorrect.formulaSheet')}</span>
            </button> */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-[12px] md:text-[14px] font-normal text-oxford-blue font-roboto">
                <span className="hidden sm:inline">{t('dashboard.reviewIncorrect.timeRemaining')} </span>12:45
              </span>
              <button className="text-oxford-blue hover:opacity-70">
                <img src={setting} alt="Settings" className="w-4 h-4 md:w-5 md:h-5" />
              </button>
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
                <h3 className="text-[18px] font-bold text-oxford-blue font-archivo">{t('dashboard.reviewIncorrect.questions')}</h3>
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
            {/* Title */}
            <h2 className="text-[24px] md:text-[32px] lg:text-[36px] font-bold text-oxford-blue mb-6 md:mb-10 font-archivo leading-tight tracking-[0%]">
              {t('dashboard.reviewIncorrect.title')}
            </h2>

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

            {/* Answer Options (Initial Attempt View) */}
            <div className="mb-4 md:mb-6">
              <div className="space-y-3 mb-6 md:mb-10 w-full min-h-[300px] md:min-h-[400px] flex flex-col items-start justify-center p-4 md:pl-8 bg-white shadow-content rounded-lg">
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.id}
                    className={`w-full min-h-[50px] rounded-lg border-2 flex items-center px-3 md:px-4 py-2 ${
                      option.id === currentQuestion.selectedAnswer
                        ? 'border-[#ED4122] bg-white'
                        : 'border-[#E5E7EB] bg-white'
                    }`}
                  >
                    <label className="flex items-center gap-2 md:gap-3 cursor-pointer w-full">
                      <input
                        type="radio"
                        name="answer"
                        value={option.id}
                        checked={option.id === currentQuestion.selectedAnswer}
                        readOnly
                        className="w-4 h-4 md:w-5 md:h-5 text-[#EF4444] border-[#EF4444] focus:ring-[#EF4444] flex-shrink-0"
                      />
                      <span className="text-[14px] md:text-[16px] font-normal text-oxford-blue font-roboto flex-1">
                        <span className="font-medium">{option.id}.</span> {option.text}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
              
              {/* Feedback Tags - Centered */}
              <button className="w-full md:w-[316px] mb-6 md:mb-10 h-[50px] md:h-[60px] bg-[#ED4122] text-white rounded-[8px] text-[16px] md:text-[20px] font-bold font-archivo leading-[28px] tracking-[0%] flex items-center justify-center hover:opacity-90 transition-opacity">
                {t('dashboard.reviewIncorrect.incorrectAnswer')}
              </button>
            </div>

            {/* Feedback Section */}
            <div className="mb-4 md:mb-6 w-full min-h-[110px] bg-[#FDF0D5] rounded-[14px] shadow-small flex flex-col md:flex-row items-start md:items-center border-l-4 border-[#ED4122] p-4 md:p-0">
              {/* Left Section - Incorrect Status */}
              <div className="flex-1 flex flex-col justify-center items-start pl-0 md:pl-6 mb-4 md:mb-0">
                <div className="text-[14px] md:text-[16px] font-bold text-[#ED4122] font-roboto mb-1">
                  {t('dashboard.reviewIncorrect.feedback.incorrect')}
                </div>
                <div className="text-[12px] md:text-[14px] font-normal text-dark-gray font-roboto">
                  {t('dashboard.reviewIncorrect.feedback.correctAnswer')} {currentQuestion.correctAnswer}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 md:mb-6">
              {/* Incorrect Tag */}
              <div className="bg-[#FDF0D5] rounded-lg px-3 md:px-4 py-2 flex items-center gap-2">
                <div className="w-4 h-4 md:w-5 md:h-5 bg-[#ED4122] rounded-full flex items-center justify-center flex-shrink-0">
                  <img src={cross} alt="Incorrect" className="w-3 h-3 md:w-4 md:h-4" />
                </div>
                <span className="text-[12px] md:text-[14px] font-normal text-[#ED4122] font-roboto">
                  {t('dashboard.reviewIncorrect.feedback.incorrect')}
                </span>
              </div>
              
              {/* Correct Answer Tag */}
              <div>
                <span className="text-[12px] md:text-[14px] font-normal text-oxford-blue font-roboto">
                  {t('dashboard.reviewIncorrect.feedback.correctAnswer')} {currentQuestion.correctAnswer}
                </span>
              </div>
            </div>

            {/* Answer Options (Review Mode) */}
            <div className="mb-4 md:mb-6">
              <div className="space-y-3 mb-4 w-full min-h-[300px] md:min-h-[400px] flex flex-col items-start justify-center p-4 md:pl-8 bg-white shadow-content rounded-lg">
                {currentQuestion.options.map((option) => {
                  const isCorrect = option.id === currentQuestion.correctAnswer;
                  const isUserAnswer = option.id === currentQuestion.selectedAnswer;
                  
                  return (
                    <div
                      key={option.id}
                      className={`w-full min-h-[50px] rounded-lg flex items-center px-3 md:px-4 py-2 ${
                        isCorrect
                          ? 'border-2 border-[#10B981] bg-[#ECFDF5]'
                          : isUserAnswer
                          ? 'border-2 border-[#EF4444] bg-[#FEF2F2]'
                          : 'border-2 border-[#E5E7EB] bg-white'
                      }`}
                    >
                      <label className="flex items-center gap-2 md:gap-3 cursor-pointer w-full">
                        <input
                          type="radio"
                          name="answer-review"
                          value={option.id}
                          checked={isCorrect || isUserAnswer}
                          readOnly
                          className={`w-4 h-4 md:w-5 md:h-5 flex-shrink-0 ${
                            isCorrect
                              ? 'text-[#10B981] border-[#10B981] focus:ring-[#10B981]'
                              : isUserAnswer
                              ? 'text-[#EF4444] border-[#EF4444] focus:ring-[#EF4444]'
                              : 'text-[#E5E7EB] border-[#E5E7EB] focus:ring-[#E5E7EB]'
                          }`}
                        />
                        <span className="text-[14px] md:text-[16px] font-normal text-oxford-blue font-roboto flex-1">
                          <span className="font-medium">{option.id}.</span> {option.text}
                        </span>
                        {isCorrect ? (
                          <img src={tick} alt="Correct" className="text-white bg-cinnebar-red rounded-full p-1" />
                        ) : isUserAnswer ? (
                          <img src={cross} alt="Incorrect" className="text-white bg-cinnebar-red rounded-full p-1" />
                        ) : null}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Explanation Button */}
            <button
              onClick={() => setShowExplanationPanel(!showExplanationPanel)}
              className="lg:hidden w-full mb-4 px-4 py-3 bg-[#F3F4F6] text-oxford-blue rounded-lg text-[14px] font-normal font-roboto hover:opacity-90 transition-opacity flex items-center justify-between"
            >
              <span className="font-bold">{t('dashboard.reviewIncorrect.explanation.title')}</span>
              <svg
                className={`w-5 h-5 transition-transform ${showExplanationPanel ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Mobile Explanation Panel */}
            {showExplanationPanel && (
              <div className="lg:hidden mb-4 p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                <div className="space-y-6">
                  {/* Correct Answer Explanation */}
                  <div>
                    <h4 className="text-[14px] md:text-[16px] font-medium text-oxford-blue font-archivo leading-[24px] tracking-[0%] mb-3">
                      {t('dashboard.reviewIncorrect.explanation.correctAnswerExplanation')}
                    </h4>
                    <p className="text-[12px] md:text-[14px] font-normal text-dark-gray font-roboto leading-[24px] tracking-[0%] mb-2">
                      {t('dashboard.reviewIncorrect.explanation.answer')} {currentQuestion.correctAnswer}. {currentQuestion.options.find(o => o.id === currentQuestion.correctAnswer)?.text}
                    </p>
                    <h5 className="text-[14px] md:text-[16px] font-medium text-oxford-blue font-archivo leading-[24px] tracking-[0%] mb-2">
                      {t('dashboard.reviewIncorrect.explanation.explanationLabel')}
                    </h5>
                    <p className="text-[12px] md:text-[14px] font-normal text-dark-gray font-roboto leading-[24px] tracking-[0%]">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Explanation Panel - Desktop */}
        <div className="hidden lg:flex w-[256px] h-full bg-[#F9FAFB] border-l border-[#E5E7EB] overflow-y-auto">
          <div className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] md:text-[20px] font-bold text-oxford-blue font-archivo">
                {t('dashboard.reviewIncorrect.explanation.title')}
              </h3>
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-[14px] font-normal text-oxford-blue font-roboto hover:opacity-70"
              >
                {showExplanation ? t('dashboard.reviewIncorrect.explanation.hide') : t('dashboard.reviewIncorrect.explanation.show')}
              </button>
            </div>

            {showExplanation && (
              <div className="space-y-6">
                {/* Correct Answer Explanation */}
                <div>
                  <h4 className="text-[16px] font-medium text-oxford-blue font-archivo leading-[24px] tracking-[0%] mb-3">
                    {t('dashboard.reviewIncorrect.explanation.correctAnswerExplanation')}
                  </h4>
                  <p className="text-[14px] font-normal text-dark-gray font-roboto leading-[24px] tracking-[0%] mb-2">
                    {t('dashboard.reviewIncorrect.explanation.answer')} {currentQuestion.correctAnswer}. {currentQuestion.options.find(o => o.id === currentQuestion.correctAnswer)?.text}
                  </p>
                  <h5 className="text-[16px] font-medium text-oxford-blue font-archivo leading-[24px] tracking-[0%] mb-2">
                    {t('dashboard.reviewIncorrect.explanation.explanationLabel')}
                  </h5>
                  <p className="text-[14px] font-normal text-dark-gray font-roboto leading-[24px] tracking-[0%]">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            )}
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
            {t('dashboard.reviewIncorrect.actions.previous')}
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
            {t('dashboard.reviewIncorrect.actions.next')}
          </button>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 md:gap-10">
          <button className="w-full sm:w-auto px-4 py-2 bg-white border border-[#E5E7EB] text-oxford-blue rounded-lg text-[14px] md:text-[16px] font-normal font-roboto hover:opacity-90 transition-opacity">
            {t('dashboard.reviewIncorrect.actions.studyMode')}
          </button>
          {sessionId && (
            <button 
              onClick={() => navigate(`/dashboard/review-all?sessionId=${sessionId}`)}
              className="w-full sm:w-auto px-4 py-2 bg-[#EF4444] text-white rounded-lg text-[14px] md:text-[16px] font-normal font-roboto hover:opacity-90 transition-opacity"
            >
              {t('dashboard.reviewIncorrect.actions.reviewAll')}
            </button>
          )}
          <button
            onClick={() => navigate('/dashboard/review')}
            className="w-full sm:w-auto px-4 py-2 bg-white border border-[#E5E7EB] text-oxford-blue rounded-lg text-[14px] md:text-[16px] font-normal font-roboto hover:opacity-90 transition-opacity"
          >
            {t('dashboard.reviewIncorrect.actions.exitSession')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewIncorrectPage;

