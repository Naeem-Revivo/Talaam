import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

const BookIcon = ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
    </svg>
);

const SmallClockIcon = () => (
    <svg className="w-5 h-5 text-oxford-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SmallChartIcon = () => (
    <svg className="w-5 h-5 text-oxford-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20V10m5 10V4m5 16v-6M4 20h16" />
    </svg>
);

const TinyFlagIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M7.44434 0.5L6.86719 1.29395L5.59863 3.03613L6.86719 4.7793L7.44434 5.57422H2.05566V7.65137C2.05566 8.07935 1.70533 8.42969 1.27734 8.42969C0.849549 8.42946 0.5 8.07921 0.5 7.65137V2.11133C0.5 1.6639 0.611812 1.23584 0.923828 0.923828C1.23584 0.611812 1.6639 0.5 2.11133 0.5H7.44434Z"
            stroke="currentColor"
            fill="currentColor"
        />
    </svg>
);

const TinyCrossIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 6l12 12M18 6L6 18" />
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

const ReviewIncorrectMainContent = ({
    currentQuestionIndex,
    totalQuestions,
    currentQuestion,
    questions,
    timeSpent,
    answeredCorrectly,
    sessionId,
    onQuestionClick,
    onPrevious,
    onNext,
    onReviewAll,
    onExitSession,
}) => {
    const { t } = useLanguage();

    const isQuestionAnswered = (question) => {
        return question && question.selectedAnswer && question.selectedAnswer.trim() !== '';
    };

    const maxVisibleQuestions = 5;
    const windowStart = Math.max(
        0,
        Math.min(
            currentQuestionIndex - Math.floor(maxVisibleQuestions / 2),
            Math.max(0, totalQuestions - maxVisibleQuestions)
        )
    );
    const visibleQuestionIndices = Array.from(
        { length: Math.min(maxVisibleQuestions, totalQuestions) },
        (_, idx) => windowStart + idx
    );

    return (
        <div className="px-4 md:px-[89px] w-full pt-6 pb-24">
            <div className="flex items-start gap-6">
                {/* Left: Question Content */}
                <div className="flex-1 min-w-0">
                    <div className="">
                        {/* Question Info Box */}
                        <div className="mb-6 border bg-white border-[#E6EEF3] rounded-[16px] p-8">
                            <div className="flex flex-wrap items-start justify-between gap-3 mb-[30px]">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-[11px] bg-gradient-to-r from-[#032746] to-[#173B50] flex items-center justify-center text-white font-medium text-[14px] leading-[21px] font-roboto">
                                        {currentQuestionIndex + 1}
                                    </div>
                                    <span className="text-[14px] font-normal text-[#525252] font-roboto">
                                        Question {currentQuestionIndex + 1}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] bg-[#FEF3C7] text-[#D97706]">
                                        <TinyFlagIcon />
                                        <span className="text-[14px] leading-[21px] font-medium font-roboto">Marked for Review</span>
                                    </div>
                                    <div className="flex flex-col items-start gap-1 px-4 py-3 rounded-[14px] bg-[#F8EEEE] border-l-[6px] border-[#F04B2A] text-[#DC2626] max-w-[390px]">
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 rounded-full bg-[#F04B2A] text-white flex items-center justify-center ">
                                                <TinyCrossIcon />
                                            </div>
                                            <div className="text-[12px] leading-[18px] font-bold text-[#171717] font-roboto tracking-[-0.45px]">
                                                Incorrect Answer
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div className="text-[12px] leading-[16px] font-normal text-[#525252] font-roboto">
                                                The correct answer is: <span className="font-bold">{currentQuestion.correctAnswer}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="text-[18px] font-normal text-[#0A0A0A] font-archivo leading-[27px]"
                                dangerouslySetInnerHTML={{
                                    __html: currentQuestion.question
                                        ? currentQuestion.question.replace(/<code[^>]*data-start[^>]*>(.*?)<\/code>/gi, '$1')
                                        : '',
                                }}
                            />
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

                        {/* Explanation Section */}
                        <div className="mb-8 border border-[#D4D4D4] rounded-[16px] bg-[#FAFAFA] shadow-md shadow-[#0000000D] p-4 md:p-6">
                            <div className={`grid ${currentQuestion.selectedAnswer && currentQuestion.selectedAnswer !== currentQuestion.correctAnswer ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4 md:gap-5`}>
                                <div className="min-w-0">
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 rounded-[14px] bg-[#DCFCE7] text-[#02203A] flex items-center justify-center">
                                                <BookIcon className="w-4 h-4" />
                                            </div>
                                            <h4 className="text-base font-bold text-[#171717] font-roboto">
                                                {t('dashboard.reviewIncorrect.explanation.correctAnswerExplanation') || 'Correct Answer Explanation'}
                                            </h4>
                                        </div>
                                        <span className="text-[12px] leading-[18px] font-bold text-[#16A34A] font-roboto whitespace-nowrap">
                                            Answer: {currentQuestion.correctAnswer}
                                        </span>
                                    </div>
                                    <p className="text-base font-normal text-[#525252] font-roboto">
                                        {currentQuestion.explanation}
                                    </p>
                                </div>

                                {currentQuestion.selectedAnswer && currentQuestion.selectedAnswer !== currentQuestion.correctAnswer && (
                                    <div className="min-w-0 md:border-l md:border-[#D4D4D4] md:pl-5">
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-10 h-10 rounded-[14px] bg-[#FDE5E0] text-oxford-blue flex items-center justify-center">
                                                    <BookIcon className="w-4 h-4" />
                                                </div>
                                                <h4 className="text-base font-bold text-[#171717] font-roboto">
                                                    Wrong Answer Explanation
                                                </h4>
                                            </div>
                                            <span className="text-[12px] leading-[18px] font-bold text-[#DC2626] font-roboto whitespace-nowrap">
                                                Answer: {currentQuestion.selectedAnswer}
                                            </span>
                                        </div>
                                        <p className="text-base font-normal text-[#525252] font-roboto">
                                            This was your selected answer, but it is incorrect. Please review the correct answer explanation above.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Sidebar */}
                <div className="w-[320px] shrink-0 self-start">
                    <div className="mb-4 border border-[#F5F5F5] shadow-sm shadow-[#0000000D] rounded-[14px] bg-white p-5">
                        <div className="mb-3">
                            <div className="flex items-center justify-between text-base font-normal text-oxford-blue font-roboto">
                                <span className="flex items-center gap-2">
                                    <SmallClockIcon />
                                    Time spent
                                </span>
                                <span className="font-normal">{timeSpent}</span>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between text-base font-normal text-oxford-blue font-roboto">
                                <span className="flex items-center gap-2">
                                    <SmallChartIcon />
                                    Answered correctly
                                </span>
                                <span className="font-normal">{answeredCorrectly}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 border border-[#D4D4D4] shadow-sm shadow-[#0000000D] rounded-[14px] bg-white p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[18px] leading-[27px] font-medium text-[#171717] font-roboto tracking-[-0.44px]">All Questions</h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={onPrevious}
                                    disabled={currentQuestionIndex === 0}
                                    className="text-[#7A9EB5] hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.5 15L7.5 10L12.5 5" stroke="#6697B7" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>

                                </button>
                                <button
                                    onClick={onNext}
                                    disabled={currentQuestionIndex === totalQuestions - 1}
                                    className="text-[#7A9EB5] hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.5 15L12.5 10L7.5 5" stroke="#6697B7" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>

                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-5 gap-4 mb-3">
                            {visibleQuestionIndices.map((i) => {
                                const question = questions[i];
                                const isAnswered = isQuestionAnswered(question);
                                const isCurrent = i === currentQuestionIndex;

                                let buttonClass = '';
                                if (isCurrent) {
                                    buttonClass = 'bg-[#E0F2F7] text-[#1F4E79] border-[#007BFF]';
                                } else if (isAnswered) {
                                    buttonClass = 'bg-gradient-to-r from-[#032746] to-[#0A4B6E] text-white border-[#1F4E79]';
                                } else {
                                    buttonClass = 'bg-[#E6EEF3] text-[#6697B7] border-[#6697B7]';
                                }

                                return (
                                    <button
                                        key={i}
                                        onClick={() => onQuestionClick(i)}
                                        className={`py-3 px-4 text-[14px] font-medium font-roboto transition-colors text-center border rounded-[8px] ${buttonClass} hover:opacity-80`}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="border-t border-[#E5E7EB] pt-3 space-y-1 text-[12px] font-normal text-[#525252] font-roboto">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gradient-to-r from-[#032746] to-[#0A4B6E] border border-[#1F4E79] rounded" />
                                <span>Answered</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-[#FEFCE8] border border-[#EAB308] rounded" />
                                <span>Marked for Review</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-[#F8FAFC] border border-[#D4D4D4] rounded" />
                                <span>Unanswered</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {sessionId && (
                            <button
                                onClick={onReviewAll}
                                className="w-full p-3 h-12 bg-white border-2 border-[#ED4122] text-[#ED4122] rounded-[12px] text-base font-medium font-roboto hover:bg-[#FFF6F5] transition-colors"
                            >
                                Review All
                            </button>
                        )}
                        <button
                            onClick={onExitSession}
                            className="w-full p-3 h-12 bg-transparent text-[#A3A3A3] text-base font-bold font-roboto hover:text-[#737373] transition-colors"
                        >
                            Exit Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewIncorrectMainContent;
