import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StudyModeLayout from './components/questionSession/StudyModeLayout';
import TestModeLayout from './components/questionSession/TestModeLayout';
import SessionCompletionModal from './components/questionSession/SessionCompletionModal';

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
          {
            id: 'C',
            text: 'Spaced repetition',
            explanation:
              'Spaced repetition distributes practice over time, strengthening memory retention by allowing for consolidation between sessions.',
          },
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
      updateQuestionState((state) => ({
        ...state,
        isCorrect,
      }));
      moveToNextQuestion();
    } else {
      updateQuestionState((state) => ({
        ...state,
        isCorrect,
        showFeedback: true,
      }));
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
    navigate('/dashboard/practice');
  };

  const handleViewSummary = () => {
    navigate('/dashboard/session-summary');
  };

  const handleReviewAnswers = () => {
    navigate('/dashboard/review-incorrect');
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

      {sessionComplete && mode === 'test' && (
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


