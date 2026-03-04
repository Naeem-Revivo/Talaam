import React from 'react';

const QuestionHistory = ({ historyItems, t }) => {
  return (
    <div className="bg-white border border-[#BCBCBD] rounded-lg p-5">
      <h3 className="text-blue-dark font-bold text-[20px] leading-[32px] font-archivo mb-5">
        {t("processor.viewQuestion.questionHistory")}
      </h3>
      <div className="space-y-3">
        {historyItems.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
            <div>
              <p className="text-blue-dark text-[16px] leading-5 font-normal font-roboto">
                {item.text}
              </p>
              <p className="text-[#6B7280] text-[12px] leading-5 font-normal font-roboto mt-0.5">
                {item.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionHistory;
