import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

const QuestionManagementPage = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("");

  const draftVariants = [
    { id: 1, name: "Draft Variant 1", sourceQuestion: "Question 123" },
    { id: 2, name: "Draft Variant 2", sourceQuestion: "Question 80" },
    { id: 3, name: "Draft Variant 3", sourceQuestion: "Question 80" },
  ];

  const availableQuestions = [
    { id: 101, subject: "Math" },
    { id: 102, subject: "Science" },
    { id: 101, subject: "History" },
  ];

  const claimedQuestions = [
    { id: 123, name: "Question 123" },
    { id: 80, name: "Question 80" },
  ];

  const handleClaim = (questionId) => {
    // TODO: Implement claim functionality
    console.log("Claim question:", questionId);
  };

  const handleCreateVariant = () => {
    if (selectedQuestion) {
      // TODO: Implement create variant functionality
      console.log("Create variant for:", selectedQuestion);
    }
  };

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 xl:px-6 2xl:px-[66px]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
        <div className="flex flex-col gap-6 md:flex-row lg:flex-row">
          {/* Left Panel: My Tasks */}
          <div 
            className="w-full rounded-[12px] border border-[#E5E7EB] bg-white p-4 md:p-6 lg:w-[400px] shadow-card"
          >
            <h2 className="mb-4 md:mb-6 font-archivo text-[20px] md:text-[24px] font-bold leading-[28px] text-oxford-blue">
              {t('admin.questionManagement.sections.myTasks')}
            </h2>
            <div className="space-y-3 md:space-y-4">
              {draftVariants.map((variant) => (
                <div
                  key={variant.id}
                  className="flex cursor-pointer items-center justify-between rounded-[8px] bg-white p-4 transition hover:bg-[#F9FAFB]"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-roboto text-[16px] font-semibold leading-[20px] text-oxford-blue">
                      {variant.name}
                    </span>
                    <span className="font-roboto text-[14px] leading-[20px] text-dark-gray">
                      {t('admin.questionManagement.variantOf').replace('{{question}}', variant.sourceQuestion)}
                    </span>
                  </div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.5 15L12.5 10L7.5 5"
                      stroke="#6B7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Public Pool */}
          <div 
            className="flex-1 rounded-[12px] border border-[#E5E7EB] bg-white p-4 md:p-6 shadow-card"
          >
            <h2 className="mb-4 md:mb-6 font-archivo text-[20px] md:text-[24px] font-bold leading-[28px] text-oxford-blue">
              {t('admin.questionManagement.sections.publicPool')}
            </h2>

            {/* Search Bar */}
            <div className="mb-4 md:mb-6">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9CA3AF]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder={t('admin.questionManagement.placeholders.searchQuestions')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-[8px] border border-[#E5E7EB] bg-white py-3 pl-12 pr-4 font-roboto text-[16px] leading-[20px] text-oxford-blue placeholder:text-[#9CA3AF] focus:border-[#ED4122] focus:outline-none focus:ring-2 focus:ring-[#ED4122] focus:ring-opacity-20"
                />
              </div>
            </div>

            {/* Available Questions Section */}
            <div className="mb-4 md:mb-6">
              <h3 className="mb-3 md:mb-4 font-roboto text-[16px] md:text-[18px] font-semibold leading-[24px] text-[#374151]">
                {t('admin.questionManagement.sections.availableQuestions')}
              </h3>
              <div className="space-y-2 md:space-y-3">
                {availableQuestions.map((question, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] p-4"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-roboto text-[16px] font-semibold leading-[20px] text-oxford-blue">
                        {t('admin.questionManagement.question').replace('{{id}}', question.id)}
                      </span>
                      <span className="font-roboto text-[14px] leading-[20px] text-dark-gray">
                        {t('admin.questionManagement.subject').replace('{{subject}}', question.subject)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleClaim(question.id)}
                      className="rounded-[6px] bg-[#ED4122] px-4 py-2 font-roboto text-[14px] font-semibold leading-[18px] text-white transition hover:bg-[#d43a1f]"
                    >
                      {t('admin.questionManagement.buttons.claim')}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Create New Variant Section */}
            <div className="h-auto md:h-[221px] w-full max-w-full md:max-w-[720px]">
              <h3 className="mb-3 md:mb-4 font-roboto text-[16px] md:text-[18px] font-semibold leading-[24px] text-[#374151]">
                {t('admin.questionManagement.sections.createNewVariant')}
              </h3>
              <div className="flex h-full flex-col justify-between">
                <div>
                  <label className="mb-2 block font-roboto text-[14px] font-medium leading-[20px] text-[#374151]">
                    {t('admin.questionManagement.fields.sourceQuestion')}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedQuestion}
                      onChange={(e) => setSelectedQuestion(e.target.value)}
                      className="w-full appearance-none rounded-[8px] border border-[#E5E7EB] bg-white py-3 pl-4 pr-10 font-roboto text-[16px] leading-[20px] text-oxford-blue focus:border-[#ED4122] focus:outline-none focus:ring-2 focus:ring-[#ED4122] focus:ring-opacity-20"
                    >
                      <option value="">{t('admin.questionManagement.placeholders.selectClaimedQuestion')}</option>
                      {claimedQuestions.map((question) => (
                        <option key={question.id} value={question.id}>
                          {question.name}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-gray"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleCreateVariant}
                    disabled={!selectedQuestion}
                    className="rounded-[8px] bg-[#ED4122] px-6 py-3 font-roboto text-[16px] font-semibold leading-[20px] text-white transition hover:bg-[#d43a1f] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t('admin.questionManagement.buttons.createVariant')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionManagementPage;

