import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton, PrimaryButton } from "../../components/common/Button";
import questionsAPI from "../../api/questions";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig.jsx";

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
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get("questionId");
  
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Fetch question data
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!questionId) {
        showErrorToast("Question ID is missing");
        navigate("/processor/question-bank/gatherer-submission");
        return;
      }

      try {
        setLoading(true);
        const response = await questionsAPI.getProcessorQuestionById(questionId);
        
        if (response.success && response.data?.question) {
          setQuestion(response.data.question);
        } else {
          showErrorToast("Failed to load question");
          navigate("/processor/question-bank/gatherer-submission");
        }
      } catch (error) {
        console.error("Error fetching question:", error);
        showErrorToast("Failed to load question");
        navigate("/processor/question-bank/gatherer-submission");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId, navigate]);

  const handleClose = () => {
    navigate("/processor/question-bank/gatherer-submission");
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      showErrorToast("Please provide a rejection reason");
      return;
    }

    try {
      setProcessing(true);
      await questionsAPI.rejectQuestion(questionId, rejectionReason);
      showSuccessToast("Question rejected successfully");
      // Add a small delay to ensure backend has processed the update
      setTimeout(() => {
        navigate("/processor/question-bank/gatherer-submission");
      }, 500);
    } catch (error) {
      console.error("Error rejecting question:", error);
      showErrorToast(error.response?.data?.message || "Failed to reject question");
    } finally {
      setProcessing(false);
      setShowRejectModal(false);
      setRejectionReason("");
    }
  };

  const handleAccept = async () => {
    try {
      setProcessing(true);
      await questionsAPI.approveQuestion(questionId, { status: "approve" });
      showSuccessToast("Question approved and sent to creator");
      // Add a small delay to ensure backend has processed the update
      setTimeout(() => {
        navigate("/processor/question-bank/gatherer-submission");
      }, 500);
    } catch (error) {
      console.error("Error approving question:", error);
      showErrorToast(error.response?.data?.message || "Failed to approve question");
    } finally {
      setProcessing(false);
    }
  };

  // Format date for history
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Build history from question data
  const getHistory = () => {
    if (!question) return [];
    const history = [];
    
    if (question.createdAt) {
      history.push({
        text: `Submitted by ${question.createdBy?.name || "Gatherer"}`,
        date: formatDate(question.createdAt)
      });
    }
    
    if (question.history && Array.isArray(question.history)) {
      question.history.forEach(item => {
        history.push({
          text: item.action || item.description || "Status updated",
          date: formatDate(item.timestamp || item.createdAt)
        });
      });
    }
    
    return history;
  };

  if (loading) {
    return (
      <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 xl:px-6 2xl:px-[66px] flex items-center justify-center">
        <div className="text-oxford-blue text-lg font-roboto">
          {t("processor.viewQuestion.loading") || "Loading question..."}
        </div>
      </div>
    );
  }

  if (!question) {
    return null;
  }

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
              onClick={handleClose}
              className="py-[10px] px-[14px]"
              disabled={processing}
            />
            <OutlineButton
              text={t("processor.viewQuestion.reject")}
              onClick={() => setShowRejectModal(true)}
              className="py-[10px] px-[14px]"
              disabled={processing}
            />

            <PrimaryButton
              text={t("processor.viewQuestion.acceptAndSend")}
              className="py-[10px] px-5"
              onClick={handleAccept}
              disabled={processing}
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
                  ID: {question.id || "N/A"}
                </span>
              </div>
              <p
                className="font-roboto text-[16px] font-normal leading-[100%] text-oxford-blue pt-[30px]"
                dir="ltr"
              >
                {question.questionText || "—"}
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
                {question.questionType === "MCQ" && question.options ? (
                  <>
                    <div className="space-y-5" dir="ltr">
                      {Object.entries(question.options).map(([key, value]) => (
                        <label key={key} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="option"
                            value={key}
                            checked={key === question.correctAnswer}
                            className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                            disabled
                          />
                          <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                            {key}. {value}
                          </span>
                        </label>
                      ))}
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
                          value={question.correctAnswer}
                          checked
                          className="w-4 h-4 text-[#ED4122] border-[#03274633]"
                          disabled
                        />
                        <span className="font-roboto text-[16px] font-normal leading-[20px] text-[#ED4122]">
                          {question.correctAnswer}. {question.options[question.correctAnswer]}
                        </span>
                      </label>
                    </div>
                  </>
                ) : (
                  <p className="text-dark-gray font-roboto text-[16px]">
                    {t("processor.viewQuestion.noOptions") || "No options available for this question type."}
                  </p>
                )}
              </div>
            </div>

            {question.attachments && question.attachments.length > 0 && (
              <Attachments files={question.attachments} t={t} />
            )}
            {getHistory().length > 0 && (
              <QuestionHistory historyItems={getHistory()} t={t} />
            )}
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
                {question.difficulty && (
                  <div>
                    <span className="">Difficulty: </span>
                    <span className="">{question.difficulty}</span>
                  </div>
                )}
                <div>
                  <span className="">Subject: </span>
                  <span className="">{question.subject?.name || "—"}</span>
                </div>
                <div>
                  <span className="">Topic: </span>
                  <span className="">{question.topic?.name || "—"}</span>
                </div>
                {question.subtopic && (
                  <div>
                    <span className="">Subtopic: </span>
                    <span className="">{question.subtopic.name || question.subtopic || "—"}</span>
                  </div>
                )}
                {question.isVariant && (
                  <div>
                    <span className="">Variant: </span>
                    <span className="">{question.variantNumber || "Yes"}</span>
                  </div>
                )}
                <div>
                  <span className="">Status: </span>
                  <span className="text-orange-dark">
                    {question.status === "pending_processor" 
                      ? "Submitted by gatherer" 
                      : question.status || "—"}
                  </span>
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
                {question.notes || question.gathererNotes || question.creatorNotes || "No notes available"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-oxford-blue mb-4">
              {t("processor.viewQuestion.rejectQuestion")}
            </h3>
            <p className="text-dark-gray mb-4">
              {t("processor.viewQuestion.rejectReason")}
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full border border-[#E5E7EB] rounded-lg p-3 min-h-[100px] font-roboto text-[16px]"
              placeholder={t("processor.viewQuestion.rejectReasonPlaceholder")}
            />
            <div className="flex gap-4 mt-6">
              <OutlineButton
                text={t("processor.viewQuestion.cancel")}
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
                className="flex-1"
                disabled={processing}
              />
              <PrimaryButton
                text={t("processor.viewQuestion.confirmReject")}
                onClick={handleReject}
                className="flex-1"
                disabled={processing || !rejectionReason.trim()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessorViewQuestion;
