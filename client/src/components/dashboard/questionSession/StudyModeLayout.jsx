import React from 'react';
import StudyModeHeader from './study/StudyModeHeader';
import StudyQuestionNavigator from './study/StudyQuestionNavigator';
import StudyQuestionContent from './study/StudyQuestionContent';
import StudyExplanationSidebar from './study/StudyExplanationSidebar';
import StudyModeFooter from './study/StudyModeFooter';

const StudyModeLayout = ({
  questions,
  currentIndex,
  currentState,
  visitedIndices,
  showQuestionNav,
  showExplanation,
  showExplanationPanel,
  sessionStartTime,
  onToggleQuestionNav,
  onCloseQuestionNav,
  onGoToIndex,
  onNavigate,
  onOptionChange,
  onSubmit,
  onToggleHint,
  onExit,
  onPause,
  isPauseDisabled = false,
  onToggleExplanation,
  onToggleExplanationPanel,
}) => {
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const hasSelectedOption = Boolean(currentState?.selectedOption);

  const showReview = currentState?.showFeedback;
  const isCorrect = Boolean(currentState?.isCorrect);
  const selectedOption = currentQuestion.options.find((option) => option.id === currentState?.selectedOption);
  const correctOption = currentQuestion.options.find((option) => option.id === currentQuestion.correctAnswer);

  return (
    <div className="min-h-screen bg-white">
      <StudyModeHeader
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        currentQuestion={currentQuestion}
        sessionStartTime={sessionStartTime}
        onToggleQuestionNav={onToggleQuestionNav}
        onNavigate={onNavigate}
      />

      <div className="flex h-[calc(100vh-120px)] md:h-[calc(100vh-170px)] pb-[180px] md:pb-0">
        <StudyQuestionNavigator
          questions={questions}
          currentIndex={currentIndex}
          showQuestionNav={showQuestionNav}
          visitedIndices={visitedIndices}
          onGoToIndex={onGoToIndex}
          onCloseQuestionNav={onCloseQuestionNav}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <StudyQuestionContent
            currentQuestion={currentQuestion}
            currentState={currentState}
            showReview={showReview}
            isCorrect={isCorrect}
            selectedOption={selectedOption}
            correctOption={correctOption}
            hasSelectedOption={hasSelectedOption}
            onOptionChange={onOptionChange}
            onSubmit={onSubmit}
            onToggleHint={onToggleHint}
            showExplanationPanel={showExplanationPanel}
            onToggleExplanationPanel={onToggleExplanationPanel}
          />
        </div>

        {showReview && (
        <StudyExplanationSidebar
          showExplanation={showExplanation}
          showReview={showReview}
          correctOption={correctOption}
          selectedOption={selectedOption}
          currentQuestion={currentQuestion}
          currentState={currentState}
          onToggleExplanation={onToggleExplanation}
          onToggleHint={onToggleHint}
        />
        )}
      </div>

      <StudyModeFooter
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        onNavigate={onNavigate}
        onExit={onExit}
        onPause={onPause}
        isPauseDisabled={isPauseDisabled}
      />
    </div>
  );
};

export default StudyModeLayout;


