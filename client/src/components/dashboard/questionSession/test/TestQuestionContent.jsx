import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { cleanHtmlForDisplay } from '../../../../utils/textUtils';

const TestQuestionContent = ({
  currentQuestion,
  currentState,
  hasSelectedOption,
  onOptionChange,
  onSubmit,
}) => {
  const { t, language } = useLanguage();
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const promptHtml = cleanHtmlForDisplay(currentQuestion.prompt || '');
  const firstInlineImageMatch = promptHtml.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  const inlineImageSrc = firstInlineImageMatch?.[1] || '';
  const questionImageSrc = (
    currentQuestion?.image ||
    currentQuestion?.imageUrl ||
    currentQuestion?.questionImage ||
    inlineImageSrc ||
    ''
  ).trim();
  const promptWithoutInlineImages = promptHtml.replace(/<img[^>]*>/gi, '').trim();

  return (
    <div dir={dir}>
      <div className="mb-6 border bg-white border-[#E6EEF3] rounded-[16px] p-8">
        <div className="flex items-start justify-between gap-3 mb-[30px]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[11px] bg-gradient-to-r from-[#032746] to-[#173B50] flex items-center justify-center text-white font-medium text-[14px] leading-[21px] font-roboto">
              {currentQuestion.itemNumber}
            </div>
            <span className="text-[14px] font-normal text-[#525252] font-roboto">
              Question {currentQuestion.itemNumber}
            </span>
          </div>
        </div>

        <div className={`grid gap-4 ${questionImageSrc ? 'grid-cols-1 md:grid-cols-[1fr_230px]' : 'grid-cols-1'}`}>
          <div
            dir="ltr"
            className="text-[18px] font-normal text-[#0A0A0A] font-archivo leading-[27px] text-left"
            dangerouslySetInnerHTML={{ __html: promptWithoutInlineImages || promptHtml }}
          />
          {questionImageSrc && (
            <img
              src={questionImageSrc}
              alt="Question visual"
              className="w-full h-[155px] object-cover rounded-[10px] border border-[#D4D4D4]"
            />
          )}
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((option) => {
          const isSelected = option.id === currentState?.selectedOption;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onOptionChange(option.id)}
              className={`w-full min-h-[62px] rounded-[12px] border-[1.5px] flex items-center px-6 py-3 text-left transition-colors ${
                isSelected ? 'border-[#75A9CC] bg-[#ECF4FA]' : 'border-[#D4D4D4] bg-white hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center gap-3 w-full" dir="ltr">
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[12px] leading-[28px] font-medium font-roboto ${
                  isSelected ? 'bg-[#0B4A73] text-white border border-[#0B4A73]' : 'bg-white border border-[#E6EEF3] text-[#737373]'
                }`}>
                  {option.id}
                </span>
                <span className={`text-base font-normal font-roboto flex-1 ${isSelected ? 'text-[#1F4E79]' : 'text-dashboard-dark'}`}>
                  {option.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center md:justify-start mb-4">
        <button
          onClick={onSubmit}
          disabled={!hasSelectedOption}
          className={`w-full h-[48px] md:h-[60px] rounded-[10px] text-[16px] md:text-[20px] font-bold font-archivo leading-[28px] tracking-[0%] transition ${
            hasSelectedOption
              ? 'bg-gradient-to-r from-[#032746] to-[#0B4A73] text-white hover:opacity-90'
              : 'bg-[#E5E7EB] text-[#A3A3A3] cursor-not-allowed'
          }`}
        >
          {t('dashboard.questionSession.submitAnswer')}
        </button>
      </div>
    </div>
  );
};

export default TestQuestionContent;