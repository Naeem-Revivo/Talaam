import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import StudyModeHeader from './study/StudyModeHeader';
import StudyQuestionNavigator from './study/StudyQuestionNavigator';
import StudyQuestionContent from './study/StudyQuestionContent';
import StudyExplanationSidebar from './study/StudyExplanationSidebar';
import StudyModeFooter from './study/StudyModeFooter';

const StudyModeLayout = ({
  questions,
  currentIndex,
  currentState,
  questionState,
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
  onToggleMark,
}) => {
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const hasSelectedOption = Boolean(currentState?.selectedOption);
  const isMarked = currentState?.isMarked || false;

  const showReview = currentState?.showFeedback;
  const isCorrect = Boolean(currentState?.isCorrect);
  const selectedOption = currentQuestion.options.find((option) => option.id === currentState?.selectedOption);
  const correctOption = currentQuestion.options.find((option) => option.id === currentQuestion.correctAnswer);

  const { language } = useLanguage();
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  // Sidebar resize state
  const [sidebarWidth, setSidebarWidth] = useState(390);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef(null);
  const sidebarRef = useRef(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(390);

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      // Calculate the difference in mouse position
      let deltaX = e.clientX - startXRef.current;
      
      // For LTR: sidebar is on right side
      // Dragging handle RIGHT (positive deltaX) should INCREASE sidebar width
      // Dragging handle LEFT (negative deltaX) should DECREASE sidebar width
      // So we ADD deltaX to the width
      // But user reports it's wrong direction, so let's try INVERTING: subtract deltaX
      let newWidth;
      if (dir === 'rtl') {
        // RTL: sidebar on left, dragging left (negative deltaX) increases width
        // So we subtract deltaX (negative - negative = positive addition)
        newWidth = startWidthRef.current - deltaX;
      } else {
        // LTR: Invert the calculation - if adding was wrong, try subtracting
        // This means dragging right (positive deltaX) will decrease width
        // and dragging left (negative deltaX) will increase width
        newWidth = startWidthRef.current - deltaX;
      }

      // Constrain width between min and max
      const minWidth = 300;
      const maxWidth = 800;
      const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

      setSidebarWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Set cursor on entire document during resize
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      // Keep cursor on resize handle
      if (resizeRef.current) {
        resizeRef.current.style.cursor = 'col-resize';
      }
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      if (resizeRef.current) {
        resizeRef.current.style.cursor = '';
      }
    };
  }, [isResizing, dir]);

  const handleResizeStart = (e) => {
    e.preventDefault();
    startXRef.current = e.clientX;
    startWidthRef.current = sidebarWidth;
    setIsResizing(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <StudyModeHeader
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        currentQuestion={currentQuestion}
        sessionStartTime={sessionStartTime}
        onToggleQuestionNav={onToggleQuestionNav}
        onNavigate={onNavigate}
        onToggleMark={onToggleMark}
        isMarked={isMarked}
        onExit={onExit}
      />

      <div className="flex h-[calc(100vh-120px)] md:h-[calc(100vh-170px)] pb-[180px] md:pb-0">
        <StudyQuestionNavigator
          questions={questions}
          currentIndex={currentIndex}
          questionState={questionState}
          showQuestionNav={showQuestionNav}
          visitedIndices={visitedIndices}
          onGoToIndex={onGoToIndex}
          onCloseQuestionNav={onCloseQuestionNav}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:pl-6 lg:pr-[89px] lg:py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
          <>
            <div
              ref={resizeRef}
              onMouseDown={handleResizeStart}
              className={`hidden lg:flex w-[4px] bg-[#E5E7EB] hover:bg-[#9CA3AF] cursor-col-resize transition-colors items-center justify-center ${
                isResizing ? 'bg-[#6B7280]' : ''
              }`}
              style={{ 
                cursor: 'col-resize',
                userSelect: 'none',
                position: 'relative',
                zIndex: 10,
                touchAction: 'none'
              }}
              title="Drag to resize"
            >
              {isResizing && (
                <div className="absolute inset-0 bg-[#6B7280] opacity-50" />
              )}
            </div>
            <div ref={sidebarRef}>
              <StudyExplanationSidebar
                showExplanation={showExplanation}
                showReview={showReview}
                correctOption={correctOption}
                selectedOption={selectedOption}
                currentQuestion={currentQuestion}
                currentState={currentState}
                onToggleExplanation={onToggleExplanation}
                onToggleHint={onToggleHint}
                width={sidebarWidth}
              />
            </div>
          </>
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


