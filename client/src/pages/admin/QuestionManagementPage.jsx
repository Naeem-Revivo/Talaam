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
            className="w-full rounded-[12px] border border-[#E5E7EB] bg-white py-4 md:py-6 lg:w-[400px] shadow-card"
          >
            <h2 className="mb-4 md:mb-6 font-archivo text-[20px] font-bold leading-[100%] text-oxford-blue px-4 md:px-5 pb-6 border-b">
              {t('admin.questionManagement.sections.myTasks')}
            </h2>
            <div className="space-y-3 md:space-y-10 px-4 md:px-5">
              {draftVariants.map((variant) => (
                <div
                  key={variant.id}
                  className="flex cursor-pointer items-center justify-between"
                >
                  <div className="flex flex-col gap-3">
                    <span className="font-roboto text-[16px] font-normal leading-[100%] text-oxford-blue">
                      {variant.name}
                    </span>
                    <span className="font-roboto text-[16px] leading-[100%] font-normal text-[#6B7280]">
                      {t('admin.questionManagement.variantOf').replace('{{question}}', variant.sourceQuestion)}
                    </span>
                  </div>
                  <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.7658 7.07536L10.1662 12.762C10.0102 12.9204 9.80537 13 9.60055 13C9.39574 13 9.19091 12.9204 9.0349 12.762C8.72208 12.4443 8.72208 11.9307 9.0349 11.6131L13.2695 7.3126H0.800046C0.357621 7.3126 0 6.94861 0 6.50011C0 6.05162 0.357621 5.68763 0.800046 5.68763H13.2695L9.0349 1.38717C8.72208 1.06949 8.72208 0.555943 9.0349 0.238261C9.34771 -0.0794205 9.85339 -0.0794205 10.1662 0.238261L15.7658 5.92487C15.8402 6.00043 15.8986 6.08974 15.9394 6.18968C16.0202 6.38793 16.0202 6.6123 15.9394 6.81055C15.8986 6.91048 15.8402 6.9998 15.7658 7.07536Z" fill="#6B7280" />
                  </svg>

                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Public Pool */}
          <div className="w-full flex flex-col gap-6">
          <div
            className="flex-1 rounded-[12px] border border-[#E5E7EB] bg-white p-4 md:p-6 shadow-card"
          >
            <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-4 md:mb-8 ">
            <h2 className="font-archivo text-[20px] font-bold leading-[100%] text-oxford-blue">
              {t('admin.questionManagement.sections.publicPool')}
            </h2>

            {/* Search Bar */}
            <div className="w-full md:w-[488px]">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-oxford-blue"
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
                  className="w-full rounded-[8px] border border-[#E5E7EB] bg-white py-3 pl-12 pr-4 font-roboto text-[16px] leading-[20px] text-oxford-blue placeholder:text-[#6B7280] placeholder:text-xs focus:border-[#ED4122] focus:outline-none focus:ring-2 focus:ring-[#ED4122] focus:ring-opacity-20"
                />
              </div>
            </div>
            </div>

            {/* Available Questions Section */}
            <div className="mb-4 md:mb-6">
              <h3 className="mb-3 md:mb-5 font-roboto text-[16px] font-medium leading-[100%] text-oxford-blue">
                {t('admin.questionManagement.sections.availableQuestions')}
              </h3>
              <div className="space-y-2 md:space-y-3">
                {availableQuestions.map((question, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-[8px] border border-[#03274633] bg-[#E5E7EB] p-4"
                  >
                    <div className="flex flex-col gap-[6px]">
                      <span className="font-roboto text-[16px] font-normal leading-[100%] text-oxford-blue">
                        {t('admin.questionManagement.question').replace('{{id}}', question.id)}
                      </span>
                      <span className="font-roboto text-[16px] leading-[100%] font-normal text-[#6B7280]">
                        {t('admin.questionManagement.subject').replace('{{subject}}', question.subject)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleClaim(question.id)}
                      className="rounded-full h-[30px] w-[95px]  bg-[#ED4122] flex items-center justify-center font-roboto text-[16px] font-normal leading-[24px] text-white transition hover:bg-[#d43a1f]"
                    >
                      {t('admin.questionManagement.buttons.claim')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            </div>
            <div
            className="flex-1 rounded-[12px] border border-[#E5E7EB] bg-white p-4 md:p-6 shadow-card"
          >
            {/* Create New Variant Section */}
            <div className="h-auto w-full mb-[30px]">
              <h3 className="mb-3 md:mb-6 font-roboto text-[16px] font-medium leading-[100%] text-oxford-blue">
                {t('admin.questionManagement.sections.createNewVariant')}
              </h3>
              <div className="flex h-full flex-col justify-between">
                <div>
                  <label className="mb-3 block font-roboto text-[16px] font-normal leading-[100%] text-oxford-blue">
                    {t('admin.questionManagement.fields.sourceQuestion')}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedQuestion}
                      onChange={(e) => setSelectedQuestion(e.target.value)}
                      className="w-full appearance-none rounded-[8px] border border-[#03274633] bg-[#E5E7EB] py-3 pl-4 pr-10 font-roboto text-[16px] leading-[100%] font-normal text-[#6B7280] focus:border-[#ED4122] focus:outline-none focus:ring-2 focus:ring-[#ED4122] focus:ring-opacity-20"
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
              </div>
            </div>
            <div className="flex justify-end">
                  <button
                    onClick={handleCreateVariant}
                    disabled={!selectedQuestion}
                    className="rounded-[8px] bg-[#ED4122] px-6 py-3 font-archivo text-[16px] font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t('admin.questionManagement.buttons.createVariant')}
                  </button>
                </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionManagementPage;

