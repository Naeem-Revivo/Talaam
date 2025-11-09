import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { flag, analytics, watch, setting, tick, cross } from '../../assets/svg/dashboard';

const buildInitialState = (questions) =>
  questions.map(() => ({
    selectedOption: null,
    isCorrect: null,
    showFeedback: false,
    showHint: false,
  }));

const QuestionSessionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode');
  const mode = modeParam === 'test' ? 'test' : 'study';

  const questions = useMemo(
    () => [
      {
        id: 'Q-102',
        itemNumber: 1,
        prompt:
          'A 25-year-old woman presents with sudden onset fever, chills, and painful urination. Urinalysis shows positive leukocyte esterase and nitrites. A urine culture grows gram-negative rods. Which of the following best describes the mechanism of action for the recommended empiric therapy?',
        options: [
          { id: 'A', text: 'Inhibits peptidoglycan cross-linking by binding PBPs' },
          { id: 'B', text: 'Blocks bacterial 30S ribosomal subunit' },
          { id: 'C', text: 'Inhibits DNA gyrase (topoisomerase II)' },
          {
            id: 'D',
            text: 'Inhibits folate synthesis by blocking dihydropteroate synthase',
            explanation:
              'Sulfonamides inhibit dihydropteroate synthase, preventing the synthesis of dihydropteroate, a precursor of folic acid. Trimethoprim further blocks dihydrofolate reductase, giving a synergistic effect. Humans do not synthesize folate, making this pathway selective for bacteria.',
          },
          { id: 'E', text: 'Inhibits peptidoglycan cross-linking by binding PBPs' },
        ],
        correctAnswer: 'D',
        hints: [
          'Focus on the most common empiric therapy for uncomplicated UTIs caused by gram-negative rods.',
          'Think about the folate synthesis pathway targeted by trimethoprim-sulfamethoxazole.',
        ],
        timeRemaining: '12:45',
        percentageCorrect: 77,
        timeSpent: '0:01',
      },
      {
        id: 'Q-204',
        itemNumber: 2,
        prompt:
          'A 16-year-old student is preparing for a standardized math assessment. She notices that practicing questions spaced over several days improves her recall. Which learning strategy best explains this improvement?',
        options: [
          { id: 'A', text: 'Massed practice' },
          { id: 'B', text: 'Interleaving' },
          { id: 'C', text: 'Spaced repetition', explanation: 'Spaced repetition distributes practice over time, strengthening memory retention by allowing for consolidation between sessions.' },
          { id: 'D', text: 'Elaborative interrogation' },
          { id: 'E', text: 'Dual coding' },
        ],
        correctAnswer: 'C',
        hints: [
          'Consider how timing of practice sessions affects memory consolidation.',
          'The strategy emphasizes repeated exposure with delays between sessions.',
        ],
        timeRemaining: null,
        percentageCorrect: 64,
        timeSpent: '0:45',
      },
    ],
    []
  );

  const [questionState, setQuestionState] = useState(() => buildInitialState(questions));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showQuestionNav, setShowQuestionNav] = useState(false);
  const [visitedIndices, setVisitedIndices] = useState(() => new Set([0]));
  const [showExplanation, setShowExplanation] = useState(true);
  const [showExplanationPanel, setShowExplanationPanel] = useState(false);

  const currentQuestion = questions[currentIndex];
  const currentState = questionState[currentIndex];

  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const hasSelectedOption = Boolean(currentState?.selectedOption);

  const handleOptionChange = (optionId) => {
    setQuestionState((prev) =>
      prev.map((state, index) =>
        index === currentIndex
          ? {
              ...state,
              selectedOption: optionId,
            }
          : state
      )
    );
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
    setShowExplanationPanel(false);
    setShowExplanation(true);
  };

  const moveToNextQuestion = () => {
    if (isLastQuestion) {
      setSessionComplete(true);
      return;
    }
    goToIndex(currentIndex + 1);
  };

  const handleSubmit = () => {
    if (!currentState?.selectedOption) return;

    const isCorrect = currentState.selectedOption === currentQuestion.correctAnswer;

    if (mode === 'test') {
      setQuestionState((prev) =>
        prev.map((state, index) =>
          index === currentIndex
            ? {
                ...state,
                isCorrect,
              }
            : state
        )
      );
      moveToNextQuestion();
    } else {
      setQuestionState((prev) =>
        prev.map((state, index) =>
          index === currentIndex
            ? {
                ...state,
                isCorrect,
                showFeedback: true,
              }
            : state
        )
      );
    }
  };

  const handleNavigate = (direction) => {
    const nextIndex = currentIndex + direction;
    goToIndex(nextIndex);
  };

  const toggleHint = () => {
    setQuestionState((prev) =>
      prev.map((state, index) =>
        index === currentIndex
          ? {
              ...state,
              showHint: !state.showHint,
            }
          : state
      )
    );
  };

  const handleExit = () => {
    navigate('/dashboard/practice');
  };

  const renderStudyModeLayout = () => {
    const showReview = currentState?.showFeedback;
    const isCorrect = Boolean(currentState?.isCorrect);
    const selectedOption = currentQuestion.options.find((opt) => opt.id === currentState?.selectedOption);
    const correctOption = currentQuestion.options.find((opt) => opt.id === currentQuestion.correctAnswer);

    const statusButtonClass = isCorrect ? 'bg-[#10B981] text-white' : 'bg-[#ED4122] text-white';
    const statusButtonLabel = isCorrect ? 'Correct Answer' : 'Incorrect Answer';

    const infoContainerClass = isCorrect ? 'bg-[#ECFDF5] border-l-4 border-[#10B981]' : 'bg-[#FDF0D5] border-l-4 border-[#ED4122]';
    const infoTitleClass = isCorrect ? 'text-[#047857]' : 'text-[#ED4122]';

    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-[#E5E7EB] px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center justify-between gap-4 w-full lg:w-auto">
              <div className="text-[20px] font-bold text-[#032746] font-archivo leading-[28px] tracking-[0%]">
                Item {currentIndex + 1} of {totalQuestions}
              </div>
              <div className="hidden lg:block text-[14px] md:text-[16px] font-normal text-[#6B7280] font-roboto">
                Question Id: {currentQuestion.id}
              </div>
              <button className="hidden lg:block text-[#032746] hover:opacity-70">
                <img src={flag} alt="Flag" />
              </button>
              <button
                onClick={() => setShowQuestionNav(!showQuestionNav)}
                className="lg:hidden text-[#032746] hover:opacity-70"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            <div className="lg:hidden flex items-center gap-2 w-full justify-between">
              <button className="px-3 py-1.5 bg-[#F3F4F6] text-[#032746] rounded text-[14px] font-normal font-roboto hover:opacity-70 flex items-center gap-2">
                <img src={flag} alt="Mark" />
              </button>
              <button className="px-3 py-1.5 bg-[#F3F4F6] text-[#032746] rounded text-[14px] font-normal font-roboto hover:opacity-70">
                Formula Sheet
              </button>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-normal text-[#032746] font-roboto">
                  Time Remaining <span className="font-bold">{currentQuestion.timeRemaining || '--:--'}</span>
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4 flex-wrap flex-1 justify-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavigate(-1)}
                  disabled={currentIndex === 0}
                  className={`px-3 py-1 rounded text-[14px] font-normal font-roboto transition-colors ${
                    currentIndex === 0 ? 'text-[#9CA3AF] cursor-not-allowed' : 'text-[#032746] hover:bg-[#F3F4F6]'
                  }`}
                >
                  &lt; Previous
                </button>
                <button
                  onClick={() => handleNavigate(1)}
                  disabled={currentIndex === totalQuestions - 1}
                  className={`px-3 py-1 rounded text-[14px] font-normal font-roboto transition-colors ${
                    currentIndex === totalQuestions - 1 ? 'text-[#9CA3AF] cursor-not-allowed' : 'text-[#032746] hover:bg-[#F3F4F6]'
                  }`}
                >
                  Next &gt;
                </button>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2 md:gap-4 w-full lg:w-auto justify-between lg:justify-end">
              <button className="hidden lg:block px-2 md:px-3 py-1.5 bg-[#F3F4F6] text-[#032746] rounded text-[12px] md:text-[14px] font-normal font-roboto hover:opacity-70">
                <span className="hidden sm:inline">Formula Sheet</span>
                <span className="sm:hidden">Formula</span>
              </button>
              <div className="hidden lg:flex items-center gap-2">
                <span className="text-[12px] md:text-[14px] font-normal text-[#032746] font-roboto">
                  <span className="hidden sm:inline">Time Remaining </span>
                  {currentQuestion.timeRemaining || '--:--'}
                </span>
                <button className="text-[#032746] hover:opacity-70">
                  <img src={setting} alt="Settings" className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {showQuestionNav && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setShowQuestionNav(false)}
            />
            <div className="fixed left-0 top-0 bottom-0 w-[280px] bg-white overflow-y-auto z-50 lg:hidden shadow-lg">
              <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
                <h3 className="text-[18px] font-bold text-[#032746] font-archivo">Questions</h3>
                <button
                  onClick={() => setShowQuestionNav(false)}
                  className="text-[#032746] hover:opacity-70"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-2">
                <div className="grid grid-cols-3 gap-2">
                  {questions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToIndex(i)}
                      className={`py-2 px-3 text-[14px] font-medium font-roboto transition-colors text-center border border-[#B9C9C5] rounded ${
                        i === currentIndex
                          ? 'bg-[#EF4444] text-white border-[#EF4444]'
                          : visitedIndices.has(i)
                          ? 'bg-[#C6D8D3] text-[#032746] hover:opacity-80'
                          : 'bg-white text-[#032746] hover:opacity-80'
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

        <div className="flex h-[calc(100vh-120px)] md:h-[calc(100vh-120px)] pb-[180px] md:pb-0">
          <div className="hidden lg:flex w-[110px] h-full bg-white overflow-y-auto flex-col border-r border-[#E5E7EB]">
            <div className="flex-1 py-2">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToIndex(idx)}
                  className={`w-full py-2 text-[14px] font-medium font-roboto transition-colors text-center border border-[#B9C9C5] ${
                    idx === currentIndex
                      ? 'bg-[#EF4444] text-white border-[#EF4444]'
                      : visitedIndices.has(idx)
                      ? 'bg-[#C6D8D3] text-[#032746] hover:opacity-80'
                      : 'bg-white text-[#032746] hover:opacity-80'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto lg:ml-5">
              <h2 className="text-[24px] md:text-[32px] lg:text-[36px] font-bold text-[#032746] mb-6 md:mb-10 font-archivo leading-tight tracking-[0%]">
                Question Solving Page
              </h2>

              <div className="mb-4 md:mb-6">
                <p className="text-[16px] md:text-[18px] font-normal text-[#032746] font-roboto leading-[24px] tracking-[0%]">
                  {currentQuestion.prompt}
                </p>
              </div>

              <div className="mb-4 md:mb-6">
                <div className="space-y-3 mb-6 md:mb-10 w-full min-h-[300px] md:min-h-[400px] flex flex-col items-start justify-center p-4 md:pl-8 bg-white shadow-[2px_2px_10px_0px_#0000000D] rounded-lg">
                  {currentQuestion.options.map((option) => {
                    const isSelected = option.id === currentState?.selectedOption;
                    const selectedForReview = showReview && option.id === selectedOption?.id;

                    const containerClass = showReview
                      ? selectedForReview
                        ? 'border-2 border-[#ED4122] bg-white'
                        : 'border-2 border-[#E5E7EB] bg-white'
                      : isSelected
                      ? 'border-2 border-[#ED4122] bg-white'
                      : 'border-2 border-[#E5E7EB] bg-white';

                    return (
                      <div
                        key={option.id}
                        className={`w-full min-h-[50px] rounded-lg flex items-center px-3 md:px-4 py-2 ${containerClass}`}
                      >
                        <label className="flex items-center gap-2 md:gap-3 cursor-pointer w-full">
                          <input
                            type="radio"
                            name={`answer-${currentQuestion.id}`}
                            value={option.id}
                            checked={isSelected}
                            onChange={() => handleOptionChange(option.id)}
                            className="w-4 h-4 md:w-5 md:h-5 text-[#EF4444] border-[#EF4444] focus:ring-[#EF4444] flex-shrink-0"
                            disabled={showReview}
                          />
                          <span className="text-[14px] md:text-[16px] font-normal text-[#032746] font-roboto flex-1">
                            <span className="font-medium">{option.id}.</span> {option.text}
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {!showReview && (
                <div className="flex justify-center md:justify-start mb-10">
                  <button
                    onClick={handleSubmit}
                    disabled={!hasSelectedOption}
                    className={`w-full md:w-[316px] h-[50px] md:h-[60px] rounded-[8px] text-[16px] md:text-[20px] font-bold font-archivo leading-[28px] tracking-[0%] transition ${
                      hasSelectedOption ? 'bg-[#ED4122] text-white hover:opacity-90' : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
                    }`}
                  >
                    Submit Answer
                  </button>
                </div>
              )}

              {showReview && (
                <>
                  <div className="w-full md:w-[316px] mb-6 md:mb-10 h-[50px] md:h-[60px] rounded-[8px] text-[16px] md:text-[20px] font-bold font-archivo leading-[28px] tracking-[0%] flex items-center justify-center px-4 text-center transition-colors shadow-[0px_6px_20px_rgba(3,39,70,0.08)]">
                    <span className={`w-full h-full flex items-center justify-center gap-2 rounded-[8px] ${statusButtonClass}`}>
                      {isCorrect ? (
                        <img src={tick} alt="Correct" className="h-4 w-4 md:h-[22px] md:w-[22px]" />
                      ) : (
                        <img src={cross} alt="Incorrect" className="h-4 w-4 md:h-[22px] md:w-[22px]" />
                      )}
                      {statusButtonLabel}
                    </span>
                  </div>

                  <div className={`mb-4 md:mb-6 w-full min-h-[110px] rounded-[14px] shadow-[0px_0px_5px_0px_#0000001A] flex flex-col md:flex-row items-start md:items-center ${infoContainerClass} p-4 md:p-0`}>
                    <div className="flex-1 flex flex-col justify-center items-start pl-0 md:pl-6 mb-4 md:mb-0">
                      <div className={`text-[14px] md:text-[16px] font-bold font-roboto mb-1 ${infoTitleClass}`}>
                        {statusButtonLabel}
                      </div>
                      <div className="text-[12px] md:text-[14px] font-normal text-[#6B7280] font-roboto">
                        Correct answer: {currentQuestion.correctAnswer}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-start md:items-center mb-4 md:mb-0">
                      <div className="flex items-center gap-2">
                        <img src={analytics} alt="Analytics" className="w-4 h-4 md:w-5 md:h-5" />
                        <div className="text-[14px] md:text-[16px] font-bold text-[#032746] font-roboto">
                          {currentQuestion.percentageCorrect ?? '--'}%
                        </div>
                      </div>
                      <div className="text-[12px] md:text-[14px] font-normal text-[#6B7280] font-roboto">
                        Answered correctly
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-start md:items-center">
                      <div className="flex items-center gap-2">
                        <img src={watch} alt="Time" className="w-4 h-4 md:w-5 md:h-5" />
                        <div className="text-[14px] md:text-[16px] font-bold text-[#032746] font-roboto">
                          {currentQuestion.timeSpent || '--:--'}
                        </div>
                      </div>
                      <div className="text-[12px] md:text-[14px] font-normal text-[#6B7280] font-roboto">
                        Time spent
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 md:mb-6">
                    <div className={`${isCorrect ? 'bg-[#ECFDF5]' : 'bg-[#FDF0D5]'} rounded-lg px-3 md:px-4 py-2 flex items-center gap-2`}>
                      <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isCorrect ? 'bg-[#10B981]' : 'bg-[#ED4122]'}`}>
                        <img src={isCorrect ? tick : cross} alt={isCorrect ? 'Correct' : 'Incorrect'} className="w-3 h-3 md:w-4 md:h-4" />
                      </div>
                      <span className={`text-[12px] md:text-[14px] font-normal font-roboto ${isCorrect ? 'text-[#047857]' : 'text-[#ED4122]'}`}>
                        {statusButtonLabel}
                      </span>
                    </div>
                    <div>
                      <span className="text-[12px] md:text-[14px] font-normal text-[#032746] font-roboto">
                        Correct Answer {currentQuestion.correctAnswer}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <div className="space-y-3 mb-4 w-full min-h-[300px] md:min-h-[400px] flex flex-col items-start justify-center p-4 md:pl-8 bg-white shadow-[2px_2px_10px_0px_#0000000D] rounded-lg">
                      {currentQuestion.options.map((option) => {
                        const optionIsCorrect = option.id === currentQuestion.correctAnswer;
                        const optionIsUserAnswer = option.id === selectedOption?.id;

                        const cardClass = optionIsCorrect
                          ? 'border-2 border-[#10B981] bg-[#ECFDF5]'
                          : optionIsUserAnswer
                          ? 'border-2 border-[#EF4444] bg-[#FEF2F2]'
                          : 'border-2 border-[#E5E7EB] bg-white';

                        return (
                          <div
                            key={option.id}
                            className={`w-full min-h-[50px] rounded-lg flex items-center px-3 md:px-4 py-2 ${cardClass}`}
                          >
                            <label className="flex items-center gap-2 md:gap-3 cursor-pointer w-full">
                              <input
                                type="radio"
                                name={`answer-review-${currentQuestion.id}`}
                                value={option.id}
                                checked={optionIsCorrect || optionIsUserAnswer}
                                readOnly
                                className={`w-4 h-4 md:w-5 md:h-5 flex-shrink-0 ${
                                  optionIsCorrect
                                    ? 'text-[#10B981] border-[#10B981] focus:ring-[#10B981]'
                                    : optionIsUserAnswer
                                    ? 'text-[#EF4444] border-[#EF4444] focus:ring-[#EF4444]'
                                    : 'text-[#E5E7EB] border-[#E5E7EB] focus:ring-[#E5E7EB]'
                                }`}
                              />
                              <span className="text-[14px] md:text-[16px] font-normal text-[#032746] font-roboto flex-1">
                                <span className="font-medium">{option.id}.</span> {option.text}
                              </span>
                              {optionIsCorrect ? (
                                <img src={tick} alt="Correct" className="text-white bg-cinnebar-red rounded-full p-1" />
                              ) : optionIsUserAnswer ? (
                                <img src={cross} alt="Incorrect" className="text-white bg-cinnebar-red rounded-full p-1" />
                              ) : null}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mb-6" />
                </>
              )}

              <button
                onClick={() => setShowExplanationPanel(!showExplanationPanel)}
                className="lg:hidden w-full mb-4 px-4 py-3 bg-[#F3F4F6] text-[#032746] rounded-lg text-[14px] font-normal font-roboto hover:opacity-90 transition-opacity flex items-center justify-between"
              >
                <span className="font-bold">Explanation</span>
                <svg
                  className={`w-5 h-5 transition-transform ${showExplanationPanel ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showExplanationPanel && (
                <div className="lg:hidden mb-4 p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                  {showReview ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-[14px] md:text-[16px] font-medium text-[#032746] font-archivo leading-[24px] tracking-[0%] mb-3">
                          Correct Answer Explanation
                        </h4>
                        <p className="text-[12px] md:text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%] mb-2">
                          Answer: {correctOption?.id}. {correctOption?.text}
                        </p>
                        <h5 className="text-[14px] md:text-[16px] font-medium text-[#032746] font-archivo leading-[24px] tracking-[0%] mb-2">
                          Explanation:
                        </h5>
                        <p className="text-[12px] md:text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%]">
                          {correctOption?.explanation || 'This answer choice aligns with the underlying concept tested in the question.'}
                        </p>
                      </div>

                      {selectedOption && selectedOption.id !== correctOption?.id && (
                        <div>
                          <h4 className="text-[14px] md:text-[16px] font-medium text-[#032746] font-archivo leading-[24px] tracking-[0%] mb-3">
                            Your Answer Explanation
                          </h4>
                          <p className="text-[12px] md:text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%] mb-2">
                            Answer: {selectedOption.id}. {selectedOption.text}
                          </p>
                          <h5 className="text-[14px] md:text-[16px] font-medium text-[#032746] font-archivo leading-[24px] tracking-[0%] mb-2">
                            Consider:
                          </h5>
                          <p className="text-[12px] md:text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%]">
                            Review why this option may not address the scenario described. Focus on differentiating the mechanisms.
                          </p>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-[14px] md:text-[16px] font-medium text-[#032746] font-archivo leading-[24px] tracking-[0%]">
                            Hints
                          </h4>
                          <button
                            onClick={toggleHint}
                            className="text-[14px] font-roboto text-[#0369A1] hover:underline"
                          >
                            {currentState.showHint ? 'Hide hints' : 'Show hints'}
                          </button>
                        </div>
                        {currentState.showHint ? (
                          <ul className="space-y-3">
                            {currentQuestion.hints.map((hint, index) => (
                              <li key={index} className="rounded-md bg-white p-3 text-[14px] text-[#4B5563] font-roboto border border-[#E5E7EB]">
                                {hint}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-[12px] md:text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%]">
                            Reveal hints to get strategic nudges before reattempting the question.
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[12px] md:text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%]">
                      Submit your answer to view the full explanation and hints.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:flex w-[256px] h-full bg-[#F9FAFB] border-l border-[#E5E7EB] overflow-y-auto">
            <div className="p-4 md:p-6 w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[18px] md:text-[20px] font-bold text-[#032746] font-archivo">
                  Explanation
                </h3>
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="text-[14px] font-normal text-[#032746] font-roboto hover:opacity-70"
                >
                  {showExplanation ? 'Hide' : 'Show'}
                </button>
              </div>

              {showExplanation ? (
                showReview ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[16px] font-medium text-[#032746] font-archivo leading-[24px] tracking-[0%] mb-3">
                        Correct Answer Explanation
                      </h4>
                      <p className="text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%] mb-2">
                        Answer: {correctOption?.id}. {correctOption?.text}
                      </p>
                      <h5 className="text-[16px] font-medium text-[#032746] font-archivo leading-[24px] tracking-[0%] mb-2">
                        Explanation:
                      </h5>
                      <p className="text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%]">
                        {correctOption?.explanation || 'This answer choice aligns with the underlying concept tested in the question.'}
                      </p>
                    </div>

                    {selectedOption && selectedOption.id !== correctOption?.id && (
                      <div>
                        <h4 className="text-[16px] font-medium text-[#032746] font-archivo leading-[24px] tracking-[0%] mb-3">
                          Your Answer
                        </h4>
                        <p className="text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%] mb-2">
                          Answer: {selectedOption.id}. {selectedOption.text}
                        </p>
                        <h5 className="text-[16px] font-medium text-[#032746] font-archivo leading-[24px] tracking-[0%] mb-2">
                          Consider:
                        </h5>
                        <p className="text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%]">
                          Review why this option may not address the scenario described. Focus on differentiating the mechanisms.
                        </p>
                      </div>
                    )}

                    <div>
                      <h4 className="text-[16px] font-medium text-[#032746] font-archivo leading-[24px] tracking-[0%] mb-3">
                        Hints
                      </h4>
                      <button
                        onClick={toggleHint}
                        className="text-[14px] font-roboto text-[#0369A1] hover:underline mb-2"
                      >
                        {currentState.showHint ? 'Hide hints' : 'Show hints'}
                      </button>
                      {currentState.showHint ? (
                        <ul className="space-y-3">
                          {currentQuestion.hints.map((hint, index) => (
                            <li key={index} className="rounded-md bg-white p-3 text-[14px] text-[#4B5563] font-roboto border border-[#E5E7EB]">
                              {hint}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%]">
                          Reveal hints to get strategic nudges before reattempting the question.
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%]">
                    Submit your answer to see explanations and hints.
                  </p>
                )
              ) : null}
            </div>
          </div>
        </div>

        <div className="fixed md:relative bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 md:px-6 py-3 md:py-4 z-30 shadow-[0_-2px_10px_0px_rgba(0,0,0,0.05)] md:shadow-none">
          <div className="md:hidden flex items-center justify-between gap-2 mb-4">
            <button
              onClick={() => handleNavigate(-1)}
              disabled={currentIndex === 0}
              className={`flex-1 px-3 py-2 rounded text-[14px] font-normal font-roboto transition-colors ${
                currentIndex === 0 ? 'text-[#9CA3AF] cursor-not-allowed bg-[#F3F4F6]' : 'text-[#032746] bg-[#F3F4F6] hover:bg-[#E5E7EB]'
              }`}
            >
              &lt; Previous
            </button>
            <button
              onClick={() => handleNavigate(1)}
              disabled={currentIndex === totalQuestions - 1}
              className={`flex-1 px-3 py-2 rounded text-[14px] font-normal font-roboto transition-colors ${
                currentIndex === totalQuestions - 1 ? 'text-[#9CA3AF] cursor-not-allowed bg-[#F3F4F6]' : 'text-[#032746] bg-[#F3F4F6] hover:bg-[#E5E7EB]'
              }`}
            >
              Next &gt;
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 md:gap-10">
            <button
              onClick={handleExit}
              className="w-full sm:w-auto px-4 py-2 bg-white border border-[#E5E7EB] text-[#032746] rounded-lg text-[14px] md:text-[16px] font-normal font-roboto hover:opacity-90 transition-opacity"
            >
              Exit Session
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCompletionState = () => (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-[#E5E7EB] bg-white p-8 text-center shadow-[0px_10px_40px_rgba(3,39,70,0.08)]">
      <h2 className="font-archivo text-[24px] font-bold text-[#032746]">Session Complete</h2>
      <p className="max-w-lg text-[16px] text-[#4B5563] font-roboto">
        You have reached the end of this {mode === 'test' ? 'test' : 'study'} session. Review your performance or head back to the practice dashboard to start another set.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => navigate('/dashboard/session-summary')}
          className="rounded-lg border border-[#E5E7EB] px-6 py-3 text-[16px] font-roboto font-medium text-[#032746] transition hover:bg-[#F3F4F6]"
        >
          View Summary
        </button>
        <button
          onClick={() => navigate('/dashboard/review-incorrect')}
          className="rounded-lg bg-[#EF4444] px-6 py-3 text-[16px] font-roboto font-medium text-white shadow-sm transition hover:opacity-90"
        >
          Review Answers
        </button>
        <button
          onClick={handleExit}
          className="rounded-lg border border-[#E5E7EB] px-6 py-3 text-[16px] font-roboto font-medium text-[#032746] transition hover:bg-[#F3F4F6]"
        >
          Exit Session
        </button>
      </div>
    </div>
  );

  const renderTestModeLayout = () => (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-[#E5E7EB] px-4 md:px-6 py-3 md:py-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center justify-between gap-4 w-full lg:w-auto">
            <div className="text-[20px] font-bold text-[#032746] font-archivo leading-[28px] tracking-[0%]">
              Item {currentIndex + 1} of {totalQuestions}
            </div>
            <div className="hidden lg:block text-[14px] md:text-[16px] font-normal text-[#6B7280] font-roboto">
              Question Id: {currentQuestion.id}
            </div>
            <button className="hidden lg:block text-[#032746] hover:opacity-70">
              <img src={flag} alt="Flag" />
            </button>
            <button
              onClick={() => setShowQuestionNav(!showQuestionNav)}
              className="lg:hidden text-[#032746] hover:opacity-70"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="lg:hidden flex items-center gap-2 w-full justify-between">
            <button className="px-3 py-1.5 bg-[#F3F4F6] text-[#032746] rounded text-[14px] font-normal font-roboto hover:opacity-70 flex items-center gap-2">
              <img src={flag} alt="Mark" />
            </button>
            <button className="px-3 py-1.5 bg-[#F3F4F6] text-[#032746] rounded text-[14px] font-normal font-roboto hover:opacity-70">
              Formula Sheet
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-normal text-[#032746] font-roboto">
                Time Remaining <span className="font-bold">{currentQuestion.timeRemaining || '--:--'}</span>
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 flex-wrap flex-1 justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavigate(-1)}
                disabled={currentIndex === 0}
                className={`px-3 py-1 rounded text-[14px] font-normal font-roboto transition-colors ${
                  currentIndex === 0 ? 'text-[#9CA3AF] cursor-not-allowed' : 'text-[#032746] hover:bg-[#F3F4F6]'
                }`}
              >
                &lt; Previous
              </button>
              <button
                onClick={() => handleNavigate(1)}
                disabled={currentIndex === totalQuestions - 1}
                className={`px-3 py-1 rounded text-[14px] font-normal font-roboto transition-colors ${
                  currentIndex === totalQuestions - 1 ? 'text-[#9CA3AF] cursor-not-allowed' : 'text-[#032746] hover:bg-[#F3F4F6]'
                }`}
              >
                Next &gt;
              </button>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 md:gap-4 w-full lg:w-auto justify-between lg:justify-end">
            <button className="hidden lg:block px-2 md:px-3 py-1.5 bg-[#F3F4F6] text-[#032746] rounded text-[12px] md:text-[14px] font-normal font-roboto hover:opacity-70">
              <span className="hidden sm:inline">Formula Sheet</span>
              <span className="sm:hidden">Formula</span>
            </button>
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-[12px] md:text-[14px] font-normal text-[#032746] font-roboto">
                <span className="hidden sm:inline">Time Remaining </span>
                {currentQuestion.timeRemaining || '--:--'}
              </span>
              <button className="text-[#032746] hover:opacity-70">
                <img src={setting} alt="Settings" className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {showQuestionNav && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setShowQuestionNav(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-[280px] bg-white overflow-y-auto z-50 lg:hidden shadow-lg">
            <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-[#032746] font-archivo">Questions</h3>
              <button
                onClick={() => setShowQuestionNav(false)}
                className="text-[#032746] hover:opacity-70"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-2">
              <div className="grid grid-cols-3 gap-2">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      goToIndex(i);
                      setShowQuestionNav(false);
                    }}
                    className={`py-2 px-3 text-[14px] font-medium font-roboto transition-colors text-center border border-[#B9C9C5] rounded ${
                      i === currentIndex
                        ? 'bg-[#EF4444] text-white border-[#EF4444]'
                        : visitedIndices.has(i)
                        ? 'bg-[#C6D8D3] text-[#032746] hover:opacity-80'
                        : 'bg-white text-[#032746] hover:opacity-80'
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

      <div className="flex min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-120px)] pb-[180px] md:pb-0">
        <div className="hidden lg:flex w-[110px] h-full bg-white overflow-y-auto flex-col border-r border-[#E5E7EB]">
          <div className="flex-1 py-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToIndex(idx)}
                className={`w-full py-2 text-[14px] font-medium font-roboto transition-colors text-center border border-[#B9C9C5] ${
                  idx === currentIndex
                    ? 'bg-[#EF4444] text-white border-[#EF4444]'
                    : visitedIndices.has(idx)
                    ? 'bg-[#C6D8D3] text-[#032746] hover:opacity-80'
                    : 'bg-white text-[#032746] hover:opacity-80'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto lg:ml-5">
            <h2 className="text-[24px] md:text-[32px] lg:text-[36px] font-bold text-[#032746] mb-6 md:mb-10 font-archivo leading-tight tracking-[0%]">
              Question Solving Page
            </h2>

            <div className="mb-4 md:mb-6">
              <p className="text-[16px] md:text-[18px] font-normal text-[#032746] font-roboto leading-[24px] tracking-[0%]">
                {currentQuestion.prompt}
              </p>
            </div>

            <div className="mb-4 md:mb-6">
              <div className="space-y-3 mb-6 md:mb-10 w-full min-h-[300px] md:min-h-[400px] flex flex-col items-start justify-center p-4 md:pl-8 bg-white shadow-[2px_2px_10px_0px_#0000000D] rounded-lg">
                {currentQuestion.options.map((option) => {
                  const isSelected = option.id === currentState?.selectedOption;
                  return (
                    <div
                      key={option.id}
                      className={`w-full min-h-[50px] rounded-lg border-2 flex items-center px-3 md:px-4 py-2 ${
                        isSelected ? 'border-[#ED4122] bg-white' : 'border-[#E5E7EB] bg-white'
                      }`}
                    >
                      <label className="flex items-center gap-2 md:gap-3 cursor-pointer w-full">
                        <input
                          type="radio"
                          name={`answer-${currentQuestion.id}`}
                          value={option.id}
                          checked={isSelected}
                          onChange={() => handleOptionChange(option.id)}
                          className="w-4 h-4 md:w-5 md:h-5 text-[#EF4444] border-[#EF4444] focus:ring-[#EF4444] flex-shrink-0"
                        />
                        <span className="text-[14px] md:text-[16px] font-normal text-[#032746] font-roboto flex-1">
                          <span className="font-medium">{option.id}.</span> {option.text}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center md:justify-start mb-10">
              <button
                onClick={handleSubmit}
                disabled={!hasSelectedOption}
                className={`w-full md:w-[316px] h-[50px] md:h-[60px] rounded-[8px] text-[16px] md:text-[20px] font-bold font-archivo leading-[28px] tracking-[0%] transition ${
                  hasSelectedOption ? 'bg-[#ED4122] text-white hover:opacity-90' : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
                }`}
              >
                Submit Answer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed md:relative bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 md:px-6 py-3 md:py-4 z-30 shadow-[0_-2px_10px_0px_rgba(0,0,0,0.05)] md:shadow-none">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 md:gap-10">
          <button
            onClick={handleExit}
            className="w-full sm:w-auto px-4 py-2 bg-white border border-[#E5E7EB] text-[#032746] rounded-lg text-[14px] md:text-[16px] font-normal font-roboto hover:opacity-90 transition-opacity"
          >
            Exit Session
          </button>
        </div>
      </div>

      {sessionComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          {renderCompletionState()}
        </div>
      )}
    </div>
  );

  return mode === 'test' ? (
    renderTestModeLayout()
  ) : (
    renderStudyModeLayout()
  );
};

export default QuestionSessionPage;
