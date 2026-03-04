import React from 'react';

const ExplainerHeader = ({ t }) => {
  return (
    <div className="mb-8">
      <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[40px] text-oxford-blue mb-1.5">
        {t("admin.questionBank.pendingExplainer.viewQuestion.title") || "Add Explanation"}
      </h1>
    </div>
  );
};

export default ExplainerHeader;
