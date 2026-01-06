import React from 'react';
import TestModeHeader from './test/TestModeHeader';
import TestQuestionNavigator from './test/TestModeNavigator';
import TestQuestionContent from './test/TestQuestionContent';
import TestModeFooter from './test/TestModeFooter';

const TestModeLayout = ({
  questions,
  currentIndex,
  currentState,
  questionState,
  visitedIndices,
  showQuestionNav,
  sessionStartTime,
  timeRemaining,
  onToggleQuestionNav,
  onCloseQuestionNav,
  onGoToIndex,
  onNavigate,
  onOptionChange,
  onSubmit,
  onExit,
  onPause,
  isPauseDisabled = false,
}) => {
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const hasSelectedOption = Boolean(currentState?.selectedOption);

  return (
    <div className="min-h-screen bg-white">
      <TestModeHeader
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        currentQuestion={currentQuestion}
        sessionStartTime={sessionStartTime}
        timeRemaining={timeRemaining}
        onToggleQuestionNav={onToggleQuestionNav}
        onNavigate={onNavigate}
      />

      <div className="flex h-[calc(100vh-120px)] md:h-[calc(100vh-180px)] pb-[180px] md:pb-0">
        <TestQuestionNavigator
          questions={questions}
          currentIndex={currentIndex}
          questionState={questionState}
          showQuestionNav={showQuestionNav}
          visitedIndices={visitedIndices}
          onGoToIndex={onGoToIndex}
          onCloseQuestionNav={onCloseQuestionNav}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <TestQuestionContent
            currentQuestion={currentQuestion}
            currentState={currentState}
            hasSelectedOption={hasSelectedOption}
            onOptionChange={onOptionChange}
            onSubmit={onSubmit}
          />
        </div>
      </div>

      <TestModeFooter
        onExit={onExit}
        onPause={onPause}
        isPauseDisabled={isPauseDisabled}
      />
    </div>
  );
};

export default TestModeLayout;