import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import questionsAPI from "../../api/questions";
import { toast } from "react-toastify";

const ContentDetailsPage = () => {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const { t } = useLanguage();
  
  const [contentData, setContentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moderatorComments, setModeratorComments] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchQuestionDetails();
  }, [questionId]);

  const fetchQuestionDetails = async () => {
    setLoading(true);
    try {
      const response = await questionsAPI.getFlaggedQuestionsForModeration();
      const questions = response.data?.questions || [];
      const question = questions.find((q) => q.id === questionId);
      
      if (question) {
        setContentData(question);
      } else {
        toast.error("Question not found");
        navigate("/admin/moderation");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch question details");
      navigate("/admin/moderation");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const handleApprove = async () => {
    if (!contentData) return;
    
    if (!window.confirm("Are you sure you want to approve this flag? The question will be sent to processor.")) {
      return;
    }

    setIsProcessing(true);
    try {
      await questionsAPI.approveStudentFlag(contentData.id);
      toast.success("Flag approved. Question sent to processor.");
      navigate("/admin/moderation");
    } catch (error) {
      toast.error(error.message || "Failed to approve flag");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = () => {
    setShowRejectModal(true);
    setRejectReason("");
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    if (!contentData) return;

    setIsProcessing(true);
    try {
      await questionsAPI.rejectStudentFlag(contentData.id, rejectReason);
      toast.success("Flag rejected. Student will be notified.");
      setShowRejectModal(false);
      setRejectReason("");
      navigate("/admin/moderation");
    } catch (error) {
      toast.error(error.message || "Failed to reject flag");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRequestChange = () => {
    // This functionality can be implemented later if needed
    toast.info("Request change functionality coming soon");
  };

  const handleRevisionHistory = () => {
    // This functionality can be implemented later if needed
    toast.info("Revision history functionality coming soon");
  };

  // Convert options object to array for display
  const getOptionsArray = (options) => {
    if (!options) return [];
    if (Array.isArray(options)) return options;
    if (typeof options === 'object') {
      return Object.entries(options)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, value]) => value);
    }
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 flex items-center justify-center">
        <div className="text-oxford-blue text-[18px] font-roboto">Loading...</div>
      </div>
    );
  }

  if (!contentData) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 flex items-center justify-center">
        <div className="text-oxford-blue text-[18px] font-roboto">Question not found</div>
      </div>
    );
  }

  const optionsArray = getOptionsArray(contentData.options);
  const status = contentData.status || contentData.flagStatus || 'pending';

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 lg:px-12">
        {/* Header Section */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => navigate("/admin/moderation")}
              className="text-oxford-blue hover:text-[#ED4122] transition"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="font-archivo text-[24px] sm:text-[28px] md:text-[36px] font-bold leading-[28px] sm:leading-[32px] md:leading-[40px] text-oxford-blue">
              {t('admin.contentDetails.hero.title')}
            </h1>
          </div>
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
                      {contentData.contentType || "Question"}
                    </p>
                  </div>
                  <div>
                    <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[18px] sm:leading-[20px] text-dark-gray mb-1">
                      {t('admin.contentDetails.fields.dateReported')}
                    </p>
                    <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] sm:leading-[24px] text-oxford-blue">
                      {formatDate(contentData.dateReported || contentData.createdAt)}
                    </p>
                  </div>
                  {contentData.exam && (
                    <div>
                      <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[18px] sm:leading-[20px] text-dark-gray mb-1">
                        Exam
                      </p>
                      <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] sm:leading-[24px] text-oxford-blue">
                        {contentData.exam?.name || "N/A"}
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[18px] sm:leading-[20px] text-dark-gray mb-1">
                      {t('admin.contentDetails.fields.reportedBy')}
                    </p>
                    <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] sm:leading-[24px] text-oxford-blue">
                      {contentData.submittedBy || contentData.flaggedBy?.name || contentData.flaggedBy?.fullName || contentData.flaggedBy?.email || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[18px] sm:leading-[20px] text-dark-gray mb-1">
                      {t('admin.contentDetails.fields.flagReason')}
                    </p>
                    <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] sm:leading-[24px] text-oxford-blue">
                      {contentData.flagReason || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[18px] sm:leading-[20px] text-dark-gray mb-1">
                      Status
                    </p>
                    <span
                      className={`inline-flex items-center justify-center font-roboto font-normal leading-[100%] text-center px-3 py-1 rounded-[6px] border-[0.5px] text-[12px] ${
                        status === "approved"
                          ? "border-[#10B981] bg-[#ECFDF5] text-[#047857]"
                          : status === "rejected"
                          ? "border-[#6B7280] bg-[#F3F4F6] text-[#6B7280]"
                          : "border-[#ED4122] bg-[#FEF2F2] text-[#ED4122]"
                      }`}
                    >
                      {status === "pending" ? "Flagged" : status}
                    </span>
                  </div>
                  {contentData.subject && (
                    <div>
                      <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[18px] sm:leading-[20px] text-dark-gray mb-1">
                        Subject
                      </p>
                      <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] sm:leading-[24px] text-oxford-blue">
                        {contentData.subject?.name || "N/A"}
                      </p>
                    </div>
                  )}
                  {contentData.topic && (
                    <div>
                      <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[18px] sm:leading-[20px] text-dark-gray mb-1">
                        Topic
                      </p>
                      <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] sm:leading-[24px] text-oxford-blue">
                        {contentData.topic?.name || "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {contentData.flagRejectionReason && (
                <div className="mt-4 p-3 rounded-lg bg-[#FDF0D5] border border-[#ED4122]">
                  <p className="font-roboto text-[14px] font-bold text-[#ED4122] mb-1">
                    Admin Rejection Reason:
                  </p>
                  <p className="font-roboto text-[14px] text-[#ED4122]">
                    {contentData.flagRejectionReason}
                  </p>
                </div>
              )}
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
                  className="flex items-center gap-2 text-[#ED4122] font-roboto text-[12px] sm:text-[16px] font-normal sm:leading-[100%] hover:text-[#d43a1f] transition self-start sm:self-auto"
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
                    {t('admin.contentDetails.fields.question')} {contentData.question || contentData.questionText}
                  </p>
                  {optionsArray.length > 0 && (
                    <div className="space-y-2 sm:space-y-3 py-2 sm:py-3 ml-2 sm:ml-4">
                      {optionsArray.map((option, index) => (
                        <p
                          key={index}
                          className="font-roboto text-[14px] sm:text-[16px] leading-[20px] sm:leading-[100%] text-oxford-blue"
                        >
                          <span className="font-medium">{String.fromCharCode(65 + index)}.</span>{" "}
                          <span className="font-normal">{option}</span>
                          {contentData.correctAnswer && 
                           (contentData.correctAnswer === String.fromCharCode(65 + index) || 
                            (typeof contentData.correctAnswer === 'string' && contentData.correctAnswer.toUpperCase() === String.fromCharCode(65 + index))) && (
                            <span className="ml-2 text-[#10B981] font-medium">✓ Correct</span>
                          )}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                {contentData.explanation && (
                  <div>
                    <p className="font-roboto text-[16px] sm:text-[18px] font-medium leading-[20px] text-oxford-blue mb-2">
                      {t('admin.contentDetails.fields.explanation')}
                    </p>
                    <p className="font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-oxford-blue">
                      {contentData.explanation}
                    </p>
                  </div>
                )}
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
                    className="block font-roboto text-[16px] font-normal leading-[18px] sm:leading-[100%] text-oxford-blue mb-4"
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
                {status === "pending" && (
                  <div className="space-y-[10px] pt-4 sm:pt-6">
                    <button
                      type="button"
                      onClick={handleApprove}
                      disabled={isProcessing}
                      className="flex items-center justify-center gap-2 rounded-[8px] border font-roboto text-[14px] sm:text-[16px] font-medium leading-[100%] text-center transition w-full disabled:opacity-50"
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
                      {isProcessing ? "Processing..." : t('admin.contentDetails.buttons.approve')}
                    </button>
                    <button
                      type="button"
                      onClick={handleReject}
                      disabled={isProcessing}
                      className="flex items-center justify-center gap-2 rounded-[8px] font-roboto text-[14px] sm:text-[16px] font-medium leading-[100%] text-center transition w-full disabled:opacity-50"
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
                  </div>
                )}
                {status !== "pending" && (
                  <div className="pt-4 sm:pt-6">
                    <p className="font-roboto text-[14px] text-dark-gray text-center">
                      This flag has been {status === "approved" ? "approved" : "rejected"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-[18px] font-archivo font-bold text-oxford-blue mb-4">
              Reject Flag
            </h3>
            <p className="text-[14px] font-roboto text-dark-gray mb-4">
              Please provide a reason for rejecting this flag. This reason will be shown to the student.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full h-32 p-3 border border-[#E5E7EB] rounded-lg text-[14px] font-roboto text-oxford-blue mb-4 resize-none"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 text-[14px] font-roboto text-oxford-blue border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={isProcessing || !rejectReason.trim()}
                className="px-4 py-2 text-[14px] font-roboto text-white bg-[#ED4122] rounded-lg hover:bg-[#d43a1f] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Rejecting..." : "Reject Flag"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentDetailsPage;
