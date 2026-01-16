import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

const MarkedQuestionCard = ({ question, onReviewClick }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-dashboard p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[14px] font-normal text-oxford-blue font-roboto">
          {question.shortId}
        </div>
        <div className="text-[14px] font-normal text-oxford-blue font-archivo">
          {question.markedDate}
        </div>
      </div>
      <div className="mb-3">
        <div className="text-[14px] font-normal text-oxford-blue font-roboto line-clamp-2">
          {question.questionText}
        </div>
      </div>
      <div className="flex items-center gap-2 mb-3 text-[12px] font-normal text-dark-gray font-roboto">
        <span>{question.exam}</span>
        <span>•</span>
        <span>{question.subject}</span>
        <span>•</span>
        <span>{question.topic}</span>
      </div>
      <button
        type="button"
        className="w-full px-[10px] py-[5px] bg-[#ED4122] text-[#FFFFFF] rounded-[6px] text-[14px] font-normal font-roboto leading-[100%] tracking-[0%] text-center hover:opacity-90 transition-opacity"
        onClick={(e) => onReviewClick(question.id, e)}
      >
        {t('dashboard.review.markedQuestions.review')}
      </button>
    </div>
  );
};

export default MarkedQuestionCard;
