import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton, PrimaryButton } from "../../components/common/Button";

const Attachments = ({ files, t }) => {
  return (
    <div className="bg-white border border-[#BCBCBD] rounded-lg p-5">
      <h3 className="text-blue-dark font-bold text-[20px] leading-[32px] font-archivo mb-5">
        {t("processor.viewQuestion.attachments")}
      </h3>
      <div className="flex flex-wrap gap-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#F6F7F8] border border-[#BCBCBD] rounded-lg font-normal text-[16px] leading-[100%] font-roboto text-blue-dark"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{file.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Question History Component
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

const ProcessorViewQuestion = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  const [comments, setComments] = useState("");

  const attachments = [{ name: "Image-1.png" }, { name: "Diagram.jpg" }];

  const history = [
    {
      text: "Creator submitted 2 new variant",
      date: "Jan 15, 2024",
    },
    {
      text: "Creator submitted this question",
      date: "Jan 15, 2024",
    },
  ];

  // Rich Text Editor Component using contentEditable (React 19 compatible)

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log("Delete question");
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    navigate("/admin/add-question");
  };

  const handleCreateVariant = () => {
    navigate("/admin/create-variant");
  };

  const handleAddComment = () => {
    // TODO: Implement add comment functionality
    console.log("Add comment", comments);
    setComments("");
  };

  return (
    <div
      className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 xl:px-6 2xl:px-[66px]"
      dir={dir}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[40px] text-oxford-blue">
            {t("processor.viewQuestion.title")}
          </h1>
          <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
            <OutlineButton
              text={t("processor.viewQuestion.close")}
              //   onClick={() => setIsModalOpen(true)}
              className="py-[10px], px-[14px]"
            />
            <OutlineButton
              text={t("processor.viewQuestion.reject")}
              //   onClick={() => setIsModalOpen(true)}
              className="py-[10px], px-[14px]"
            />

            <PrimaryButton
              text={t("processor.viewQuestion.acceptAndSend")}
              className="py-[10px] px-5"
              //   onClick={handleAddQuestion}
            />
          </div>
        </header>

        {/* Main Content - Two Columns */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Question Info Card */}
            <div
              className="rounded-[12px] border border-[#03274633] bg-white pt-[20px] px-[30px] pb-[67px] w-full"
              style={{}}
            >
              <h2 className="mb-2 font-archivo text-[20px] font-bold leading-[32px] text-oxford-blue">
                {t("processor.viewQuestion.questionInfo")}
              </h2>
              <div className="flex items-center justify-between">
                <span className="font-roboto text-[16px] font-normal leading-[100%] text-[#6B7280]">
                  ID:Q-GEO-0012
                </span>
              </div>
              <p
                className="font-roboto text-[16px] font-normal leading-[100%] text-oxford-blue pt-[30px]"
                dir="ltr"
              >
                What is the function of chlorophyll in plants?
              </p>
            </div>
            <div
              className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full"
              style={{}}
            >
              <div>
                <div className="text-[16px] leading-[100%] font-normal font-roboto mb-[30px]">
                  {t("processor.viewQuestion.options")}
                </div>
                {/* Options */}
                <div className="space-y-5" dir="ltr">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="option"
                      value="A"
                      className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                      disabled
                    />
                    <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                      A. It absorbs sunlight
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="option"
                      value="B"
                      className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                      disabled
                    />
                    <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                      B. It produces oxygen
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="option"
                      value="C"
                      checked
                      className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                      disabled
                    />
                    <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                      C. It transfers water
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="option"
                      value="D"
                      className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                      disabled
                    />
                    <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                      D. It controls leaf temp
                    </span>
                  </label>
                </div>

                <div className="border-t border-[#E5E7EB] mt-10 pt-4">
                  <p className="font-archivo text-[20px] font-bold leading-[20px] text-oxford-blue mb-2">
                    {t("admin.questionDetails.fields.correctAnswer")}
                  </p>
                  <label
                    className="flex items-center gap-3 pt-2 cursor-pointer"
                    dir="ltr"
                  >
                    <input
                      type="radio"
                      name="correctAnswer"
                      value="C"
                      checked
                      className="w-4 h-4 text-[#ED4122] border-[#03274633]"
                      disabled
                    />
                    <span className="font-roboto text-[16px] font-normal leading-[20px] text-[#ED4122]">
                      A. It absorbs sunlight
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <Attachments files={attachments} t={t} />
            <QuestionHistory historyItems={history} t={t} />
          </div>

          <div className="flex flex-col gap-4 lg:w-[376px]">
            {/* Classification Card */}
            <div className="rounded-lg border border-[#CDD4DA] bg-white">
              <div className="pt-10 px-6 pb-6 border-b border-[#CDD4DA]">
              <h2 className="text-[20px] leading-[100%] font-bold font-archivo text-blue-dark">
                {t("processor.viewQuestion.classification")}
              </h2>
              </div>
              <div className="space-y-5 text-[18px] leading-[100%] font-normal text-blue-dark pt-10 px-6 pb-6">
                <div>
                  <span className="">Difficulty: </span>
                  <span className="">Medium</span>
                </div>
                <div>
                  <span className="">Subject: </span>
                  <span className="">Biology</span>
                </div>
                <div>
                  <span className="">Topic: </span>
                  <span className="">Photosynthesis</span>
                </div>
                <div>
                  <span className="">Subtopic: </span>
                  <span className="">Chloroplast</span>
                </div>
                <div>
                  <span className="">variant: </span>
                  <span className="">3</span>
                </div>
                <div>
                  <span className="">Status: </span>
                  <span className="text-orange-dark">Submitted by gatherer</span>
                </div>
              </div>
            </div>

            {/* Creator / Gatherer Notes Card */}
            <div className="rounded-lg border border-[#CDD4DA] bg-white">
              <div className="border-b border-[#CDD4DA] pt-10 px-6 pb-6 ">
              <h2 className="text-[20px] leading-[100%] font-bold font-archivo text-blue-dark">
                {t("processor.viewQuestion.creatorGathererNotes")}
              </h2>
              </div>
              <p className="text-[16px] leading-[100%] font-normal font-roboto text-[#6B7280] pb-[60px] pt-[30px] px-6">
                Basic-level question from chapter 4
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessorViewQuestion;
