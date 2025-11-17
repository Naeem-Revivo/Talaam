import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const ContentDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  // Get content data from navigation state or use mock data
  const contentData = location.state?.content || {
    id: "0001",
    contentType: "Question",
    submittedBy: "Sarah Khan",
    dateReported: "15-01-2024",
    flagReason: "Inappropriate Content",
    question: "What is the capital of France?",
    options: ["Berlin", "Paris", "Rome", "Madrid"],
    correctAnswer: "Paris",
    explanation: "Paris is the capital of France and also its largest city. Situated on the River Seine, in northern France, at the heart of the Île-de-France region, Paris has the reputation of being the most beautiful and romantic of all cities, brimming with historic associations and remaining vastly influential in the realms of culture, art, fashion, food and design.",
    approvedCount: 120,
    rejectedCount: 30,
  };

  const [moderatorComments, setModeratorComments] = useState("");

  const handleApprove = () => {
    console.log("Approve content:", contentData.id);
    // Navigate back or show success message
    navigate("/admin/moderation");
  };

  const handleReject = () => {
    console.log("Reject content:", contentData.id);
    // Navigate back or show success message
    navigate("/admin/moderation");
  };

  const handleRequestChange = () => {
    console.log("Request change for content:", contentData.id);
    // Navigate back or show success message
    navigate("/admin/moderation");
  };

  const handleRevisionHistory = () => {
    console.log("View revision history");
    // Navigate to revision history page
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 lg:px-12">
        {/* Header Section */}
        <div className="mb-4 md:mb-6">
          <h1 className="font-archivo text-[24px] sm:text-[28px] md:text-[36px] font-bold leading-[28px] sm:leading-[32px] md:leading-[40px] text-oxford-blue mb-2">
            {t('admin.contentDetails.hero.title')}
          </h1>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column */}
          <div className="flex-1 space-y-6">
            {/* Report Information Card */}
            <div
              className="rounded-[12px] border bg-white shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] p-4 sm:p-6 w-full"
              style={{
                borderColor: "#E5E7EB",
                minHeight: "auto",
              }}
            >
              <h2 className="font-archivo text-[18px] sm:text-[20px] font-bold leading-[24px] sm:leading-[28px] text-oxford-blue mb-3 sm:mb-4">
                {t('admin.contentDetails.sections.reportInformation')}
              </h2>
              <div className="border-t border-[#E5E7EB] mb-3 sm:mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-16">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[18px] sm:leading-[20px] text-dark-gray mb-1">
                      {t('admin.contentDetails.fields.contentType')}
                    </p>
                    <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] sm:leading-[24px] text-oxford-blue">
                      {contentData.contentType}
                    </p>
                  </div>
                  <div>
                    <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[18px] sm:leading-[20px] text-dark-gray mb-1">
                      {t('admin.contentDetails.fields.dateReported')}
                    </p>
                    <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] sm:leading-[24px] text-oxford-blue">
                      {contentData.dateReported}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[18px] sm:leading-[20px] text-dark-gray mb-1">
                      {t('admin.contentDetails.fields.reportedBy')}
                    </p>
                    <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] sm:leading-[24px] text-oxford-blue">
                      {contentData.submittedBy || contentData.reportedBy}
                    </p>
                  </div>
                  <div>
                    <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[18px] sm:leading-[20px] text-dark-gray mb-1">
                      {t('admin.contentDetails.fields.flagReason')}
                    </p>
                    <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] sm:leading-[24px] text-oxford-blue">
                      {contentData.flagReason}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Card */}
            <div
              className="rounded-[12px] border bg-white shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] p-4 sm:p-6 w-full"
              style={{
                borderColor: "#E5E7EB",
                minHeight: "auto",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <h2 className="font-archivo text-[18px] sm:text-[20px] font-bold leading-[24px] sm:leading-[28px] text-oxford-blue">
                  {t('admin.contentDetails.sections.content')}
                </h2>
                <button
                  type="button"
                  onClick={handleRevisionHistory}
                  className="flex items-center gap-2 text-[#ED4122] font-roboto text-[12px] sm:text-[14px] font-normal leading-[18px] sm:leading-[20px] hover:text-[#d43a1f] transition self-start sm:self-auto"
                >
                  <svg
                    width="14"
                    height="14"
                    className="sm:w-4 sm:h-4"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.2381 1.52455V5.33408C15.2381 5.75465 14.8975 6.09598 14.4762 6.09598H10.6667C10.2453 6.09598 9.90476 5.75465 9.90476 5.33408C9.90476 4.91351 10.2453 4.57217 10.6667 4.57217H12.8837C11.8117 2.71693 9.81867 1.52455 7.61905 1.52455C4.25829 1.52455 1.52381 4.25903 1.52381 7.61979C1.52381 10.9806 4.25829 13.715 7.61905 13.715C9.94895 13.715 12.0404 12.4175 13.0774 10.3283C13.264 9.95193 13.7226 9.79656 14.0982 9.98475C14.4754 10.1722 14.6294 10.6294 14.442 11.0058C13.146 13.6168 10.531 15.2381 7.61905 15.2381C3.4179 15.2381 0 11.8202 0 7.61905C0 3.4179 3.4179 0 7.61905 0C10.0594 0 12.3025 1.16957 13.7143 3.05376V1.52455C13.7143 1.10398 14.0549 0.762649 14.4762 0.762649C14.8975 0.762649 15.2381 1.10398 15.2381 1.52455Z"
                      fill="#ED4122"
                    />
                  </svg>
                  {t('admin.contentDetails.buttons.revisionHistory')}
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="font-roboto text-[16px] sm:text-[18px] font-medium leading-[22px] sm:leading-[24px] text-oxford-blue mb-2 sm:mb-3">
                    {t('admin.contentDetails.fields.question')} {contentData.question}
                  </p>
                  <div className="space-y-2 sm:space-y-3 py-2 sm:py-3 ml-2 sm:ml-4">
                    {contentData.options.map((option, index) => (
                      <p
                        key={index}
                        className="font-roboto text-[14px] sm:text-[16px] leading-[20px] sm:leading-[100%] text-oxford-blue"
                      >
                        <span className="font-medium">{String.fromCharCode(65 + index)}.</span>{" "}
                        <span className="font-normal">{option}</span>
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-roboto text-[16px] sm:text-[18px] font-medium leading-[20px] text-oxford-blue mb-2">
                    {t('admin.contentDetails.fields.explanation')}
                  </p>
                  <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-oxford-blue">
                    {contentData.explanation}
                  </p>
                </div>
              </div>
            </div>

            {/* User's Moderation Record Card */}
            <div>
              <h2 className="font-archivo pt-1 text-[18px] sm:text-[20px] font-semibold leading-[24px] sm:leading-[28px] text-oxford-blue mb-3 sm:mb-4">
                {t('admin.contentDetails.sections.usersModerationRecord')}
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <div className="rounded-[8px] border w-full border-[#E5E7EB] bg-white p-3 sm:p-4 text-center shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
                  <p className="font-archivo text-[24px] sm:text-[30px] font-semibold leading-[32px] sm:leading-[40px] text-oxford-blue mb-1">
                    {contentData.approvedCount || 120}
                  </p>
                  <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[18px] sm:leading-[20px] text-dark-gray">
                    {t('admin.contentDetails.labels.approved')}
                  </p>
                </div>
                <div className="rounded-[8px] border border-[#E5E7EB] bg-white p-3 sm:p-4 text-center shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
                  <p className="font-archivo text-[24px] sm:text-[32px] font-semibold leading-[32px] sm:leading-[40px] text-oxford-blue mb-1">
                    {contentData.rejectedCount || 30}
                  </p>
                  <p className="font-roboto text-[14px] font-normal leading-[18px] sm:leading-[20px] text-dark-gray">
                    {t('admin.contentDetails.labels.rejected')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-[400px]">
            {/* Moderation Actions Card */}
            <div className="rounded-[12px] border border-[#E5E7EB] bg-white shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] p-4 sm:p-6">
              <h2 className="font-archivo text-[18px] sm:text-[20px] font-bold leading-[24px] sm:leading-[28px] text-oxford-blue mb-3 sm:mb-4">
                {t('admin.contentDetails.sections.moderationActions')}
              </h2>
              <div className="border-t border-[#E5E7EB] mb-3 sm:mb-4"></div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label
                    htmlFor="moderator-comments"
                    className="block font-roboto text-[16px] font-normal leading-[18px] sm:leading-[20px] text-oxford-blue mb-2"
                  >
                    {t('admin.contentDetails.fields.moderatorComments')}
                  </label>
                  <textarea
                    id="moderator-comments"
                    value={moderatorComments}
                    onChange={(e) => setModeratorComments(e.target.value)}
                    placeholder={t('admin.contentDetails.placeholders.moderatorComments')}
                    className="rounded-[8px] outline-none border px-3 sm:px-4 py-2 sm:py-3 font-roboto text-[14px] font-normal leading-[20px] text-oxford-blue placeholder:text-[#9CA3AF] bg-[#E5E7EB] w-full resize-none"
                    style={{
                      height: "150px",
                      minHeight: "150px",
                      borderColor: "#E5E7EB",
                    }}
                  />
                </div>
                <div className="space-y-[10px] pt-4 sm:pt-6 xl:pt-[340px]">
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="flex items-center justify-center gap-2 rounded-[8px] border font-roboto text-[14px] sm:text-[16px] font-medium leading-[100%] text-center transition w-full"
                    style={{
                      height: "42px",
                      backgroundColor: "#FDF0D5",
                      color: "#ED4122",
                      borderWidth: "0.5px",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      className="sm:w-4 sm:h-4"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="8" cy="8" r="7" stroke="#ED4122" strokeWidth="1.5" fill="none" />
                      <path
                        d="M5 8L7 10L11 6"
                        stroke="#ED4122"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {t('admin.contentDetails.buttons.approve')}
                  </button>
                  <button
                    type="button"
                    onClick={handleReject}
                    className="flex items-center justify-center gap-2 rounded-[8px] font-roboto text-[14px] sm:text-[16px] font-medium leading-[100%] text-center transition w-full"
                    style={{
                      height: "42px",
                      backgroundColor: "#ED4122",
                      color: "#FFFFFF",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      className="sm:w-4 sm:h-4"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="8" cy="8" r="7" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
                      <path
                        d="M5 5L11 11M11 5L5 11"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {t('admin.contentDetails.buttons.reject')}
                  </button>
                  <button
                    type="button"
                    onClick={handleRequestChange}
                    className="flex items-center justify-center gap-2 rounded-[8px] font-roboto text-[14px] sm:text-[16px] font-medium leading-[100%] text-center transition w-full"
                    style={{
                      height: "42px",
                      backgroundColor: "#6CA6C1",
                      color: "#032746",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      className="sm:w-4 sm:h-4"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.3333 2.00001C11.5084 1.82491 11.7163 1.686 11.9452 1.59129C12.174 1.49659 12.4188 1.44775 12.6667 1.44775C12.9146 1.44775 13.1594 1.49659 13.3882 1.59129C13.6171 1.686 13.825 1.82491 14 2.00001C14.1751 2.1751 14.314 2.38304 14.4087 2.61189C14.5034 2.84074 14.5522 3.08558 14.5522 3.33334C14.5522 3.58111 14.5034 3.82595 14.4087 4.0548C14.314 4.28365 14.1751 4.49159 14 4.66668L5.00001 13.6667L1.33334 14.6667L2.33334 11L11.3333 2.00001Z"
                        stroke="#032746"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {t('admin.contentDetails.buttons.requestChange')}
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

export default ContentDetailsPage;

