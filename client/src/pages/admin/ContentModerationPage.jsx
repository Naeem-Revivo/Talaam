import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import Dropdown from "../../components/shared/Dropdown";
import questionsAPI from "../../api/questions";
import { toast } from "react-toastify";

const ContentModerationPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("flagged");
  const [status, setStatus] = useState("");
  const [contentType, setContentType] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [flaggedContent, setFlaggedContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch flagged questions
  useEffect(() => {
    fetchFlaggedQuestions();
  }, [status]);

  const fetchFlaggedQuestions = async () => {
    setLoading(true);
    try {
      const response = await questionsAPI.getFlaggedQuestionsForModeration({ status: status || undefined });
      setFlaggedContent(response.data.questions || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch flagged questions");
    } finally {
      setLoading(false);
    }
  };

  // Mock data for flagged content (fallback)
  const mockFlaggedContent = [
    {
      id: "0001",
      contentType: "Question",
      submittedBy: "Sarah Khan",
      flagReason: "Inappropriate Content",
      dateReported: "15-01-2024",
      status: "Flagged",
      question: "What is the capital of France?",
      options: ["Berlin", "Paris", "Rome", "Madrid"],
      correctAnswer: "Paris",
      explanation: "Paris is the capital of France and also its largest city. Situated on the River Seine, in northern France, at the heart of the Île-de-France region, Paris has the reputation of being the most beautiful and romantic of all cities, brimming with historic associations and remaining vastly influential in the realms of culture, art, fashion, food and design.",
      approvedCount: 120,
      rejectedCount: 30,
    },
    {
      id: "0002",
      contentType: "Question",
      submittedBy: "Ali Raza",
      flagReason: "Copyright Violation",
      dateReported: "16-01-2024",
      status: "Flagged",
      question: "What is the capital of Germany?",
      options: ["Berlin", "Munich", "Hamburg", "Frankfurt"],
      correctAnswer: "Berlin",
      explanation: "Berlin is the capital and largest city of Germany. It is located in northeastern Germany on the banks of the rivers Spree and Havel.",
      approvedCount: 95,
      rejectedCount: 25,
    },
    {
      id: "0003",
      contentType: "Question",
      submittedBy: "Sarah khan",
      flagReason: "Spam",
      dateReported: "17-01-2024",
      status: "Flagged",
      question: "What is the capital of Italy?",
      options: ["Milan", "Rome", "Naples", "Turin"],
      correctAnswer: "Rome",
      explanation: "Rome is the capital city of Italy and the seat of the Roman Catholic Church. It is located in the central-western portion of the Italian Peninsula.",
      approvedCount: 110,
      rejectedCount: 20,
    },
    {
      id: "0004",
      contentType: "Question",
      submittedBy: "Sofia Clark",
      flagReason: "Harassment",
      dateReported: "17-01-2024",
      status: "Flagged",
      question: "What is the capital of Spain?",
      options: ["Barcelona", "Madrid", "Valencia", "Seville"],
      correctAnswer: "Madrid",
      explanation: "Madrid is the capital and largest city of Spain. It is located in the center of the Iberian Peninsula.",
      approvedCount: 105,
      rejectedCount: 15,
    },
    {
      id: "0005",
      contentType: "Question",
      submittedBy: "Laim Harper",
      flagReason: "Misinformation",
      dateReported: "18-01-2024",
      status: "Flagged",
      question: "What is the capital of Portugal?",
      options: ["Porto", "Lisbon", "Coimbra", "Braga"],
      correctAnswer: "Lisbon",
      explanation: "Lisbon is the capital and largest city of Portugal. It is located on the Atlantic coast of the Iberian Peninsula.",
      approvedCount: 98,
      rejectedCount: 22,
    },
    {
      id: "0006",
      contentType: "Question",
      submittedBy: "Ava Foster",
      flagReason: "Hate Speech",
      dateReported: "19-01-2024",
      status: "Flagged",
      question: "What is the capital of Greece?",
      options: ["Thessaloniki", "Athens", "Patras", "Heraklion"],
      correctAnswer: "Athens",
      explanation: "Athens is the capital and largest city of Greece. It is one of the world's oldest cities, with a recorded history spanning over 3,400 years.",
      approvedCount: 115,
      rejectedCount: 18,
    },
    {
      id: "0007",
      contentType: "Question",
      submittedBy: "Liam Harper",
      flagReason: "Violence",
      dateReported: "20-01-2024",
      status: "Flagged",
      question: "What is the capital of Netherlands?",
      options: ["Rotterdam", "Amsterdam", "Utrecht", "The Hague"],
      correctAnswer: "Amsterdam",
      explanation: "Amsterdam is the capital and most populous city of the Netherlands. It is located in the province of North Holland.",
      approvedCount: 100,
      rejectedCount: 28,
    },
  ];

  const handleView = (id) => {
    navigate(`/admin/moderation/details/${id}`);
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to approve this flag? The question will be sent to processor.")) {
      return;
    }
    setIsProcessing(true);
    try {
      await questionsAPI.approveStudentFlag(id);
      toast.success("Flag approved. Question sent to processor.");
      fetchFlaggedQuestions();
    } catch (error) {
      toast.error(error.message || "Failed to approve flag");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = (id) => {
    const content = flaggedContent.find((item) => item.id === id);
    if (content) {
      setSelectedQuestion(content);
      setRejectReason("");
      setShowRejectModal(true);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    if (!selectedQuestion) return;

    setIsProcessing(true);
    try {
      await questionsAPI.rejectStudentFlag(selectedQuestion.id, rejectReason);
      toast.success("Flag rejected. Student will be notified.");
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedQuestion(null);
      fetchFlaggedQuestions();
    } catch (error) {
      toast.error(error.message || "Failed to reject flag");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <h1 className="font-archivo text-[24px] sm:text-[28px] md:text-[36px] font-bold leading-[28px] sm:leading-[32px] md:leading-[40px] text-oxford-blue mb-2">
                {t('admin.contentModeration.hero.title')}
              </h1>
              <p className="font-roboto text-[14px] sm:text-[16px] md:text-[18px] font-normal leading-[20px] sm:leading-[22px] md:leading-[24px] text-dark-gray">
                {t('admin.contentModeration.hero.subtitle')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={fetchFlaggedQuestions}
                disabled={loading}
                className="flex flex-1 sm:flex-initial h-[36px] items-center justify-center gap-2 rounded-[8px] border border-[#03274633] bg-white px-3 md:px-5 text-[12px] sm:text-[14px] md:text-[16px] font-roboto font-semibold leading-[16px] text-[#374151] transition hover:bg-[#F9FAFB] disabled:opacity-50"
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
                    fill="#25314C"
                  />
                </svg>
                <span className="hidden sm:inline">{t('admin.contentModeration.actions.refresh')}</span>
              </button>
              <button
                type="button"
                className="flex flex-1 sm:flex-initial h-[36px] items-center justify-center gap-2 rounded-[8px] bg-[#ED4122] px-3 md:px-5 text-[12px] sm:text-[14px] md:text-[16px] font-roboto font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f]"
              >
                <svg
                  width="14"
                  height="14"
                  className="sm:w-3.5 sm:h-4"
                  viewBox="0 0 14 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.6 16C8.4728 16 8.34644 15.9582 8.24004 15.8769L5.04004 13.4154C4.88964 13.2989 4.8 13.1167 4.8 12.9231V9.64103C4.8 9.47692 4.73762 9.32184 4.62402 9.20533L0.527246 5.00348C0.187246 4.65394 0 4.19117 0 3.69804V1.84615C0 0.827897 0.808 0 1.8 0H12.2C13.192 0 14 0.827897 14 1.84615V3.69804C14 4.19117 13.8128 4.65476 13.4728 5.00348L9.37598 9.20533C9.26238 9.32184 9.2 9.4761 9.2 9.64103V15.3846C9.2 15.6176 9.07197 15.831 8.86797 15.9352C8.78317 15.9787 8.6912 16 8.6 16ZM6 12.6154L8 14.1538V9.64103C8 9.1479 8.18725 8.68431 8.52725 8.33559L12.624 4.13374C12.7376 4.01723 12.8 3.86297 12.8 3.69804V1.84615C12.8 1.50646 12.5304 1.23077 12.2 1.23077H1.8C1.4696 1.23077 1.2 1.50646 1.2 1.84615V3.69804C1.2 3.86214 1.26238 4.01723 1.37598 4.13374L5.47275 8.33559C5.81275 8.68513 6 9.1479 6 9.64103V12.6154Z"
                    fill="white"
                  />
                </svg>
                <span className="hidden sm:inline">{t('admin.contentModeration.actions.filter')}</span>
              </button>
              <button
                type="button"
                className="flex flex-1 sm:flex-initial h-[36px] items-center justify-center gap-2 rounded-[8px] border border-[#03274633] bg-[#ED4122] px-3 md:px-5 text-[12px] sm:text-[14px] md:text-[16px] font-roboto font-semibold leading-[16px] text-white transition hover:bg-[#F9FAFB]"
              >
                <svg
                  width="14"
                  height="12"
                  className="sm:w-3.5 sm:h-3"
                  viewBox="0 0 14 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.1498 7.57819V9.02679C11.1498 9.6613 10.9262 10.212 10.479 10.6609C10.0378 11.1219 9.49645 11.3493 8.87277 11.3493H2.28291C1.65923 11.3493 1.11792 11.1219 0.664869 10.6609C0.223584 10.212 0 9.6613 0 9.02679V2.32254C0 1.68803 0.223584 1.13733 0.664869 0.688382C1.11792 0.227466 1.65923 0 2.28291 0H7.86076C7.99608 0 8.10788 0.107747 8.10788 0.257395V0.772185C8.10788 0.92782 7.99608 1.02958 7.86076 1.02958H2.28291C1.93577 1.02958 1.62981 1.16127 1.38858 1.40669C1.14146 1.6581 1.0179 1.96339 1.0179 2.31656V9.02679C1.0179 9.37996 1.14734 9.69123 1.38858 9.93665C1.6357 10.1881 1.93577 10.3138 2.28291 10.3138H8.86689C9.21403 10.3138 9.51999 10.1821 9.76122 9.93665C10.0025 9.69123 10.1319 9.37996 10.1319 9.02679V7.58418C10.1319 7.42854 10.2378 7.33277 10.3849 7.33277H10.8909C11.0498 7.33277 11.1498 7.42854 11.1498 7.57819ZM13.7916 3.51973L11.2028 6.14755C10.9968 6.37502 10.6614 6.19544 10.6614 5.92009V4.60318H9.51999C9.18461 4.60318 8.74921 4.62114 8.20202 4.64509C7.65482 4.66903 7.1194 4.7648 6.57809 4.92642C6.04855 5.08804 5.61903 5.27361 5.29542 5.48312C4.97769 5.69262 4.75411 5.90213 4.62467 6.11164C4.49522 6.31516 4.38932 6.58453 4.28341 6.92573C4.1775 7.26692 4.13043 7.60214 4.13043 7.94932C4.13043 8.13488 4.13631 8.35038 4.15396 8.58383C4.15396 8.62573 4.1775 8.77538 4.1775 8.84122C4.1775 8.937 4.11278 9.0208 4.01864 9.0208C3.95391 9.0208 3.90684 8.99087 3.87742 8.93101C3.82447 8.85918 3.73621 8.63172 3.68914 8.54193C3.25963 7.56622 3.1243 6.56657 3.29493 5.54896C3.38319 4.84861 3.73621 4.1722 4.37166 3.52572C5.40133 2.48416 7.1194 1.96339 9.51999 1.96339H10.6614V0.646481C10.6614 0.365142 10.9968 0.203522 11.2028 0.413029L13.7916 3.04684C13.9152 3.18452 13.9152 3.38804 13.7916 3.51973Z"
                    fill="white"
                  />
                </svg>
                <span className="hidden sm:inline">{t('admin.contentModeration.actions.export')}</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 my-4 md:my-8 overflow-x-auto pb-2 scrollbar-hide">
            <button
              type="button"
              onClick={() => setActiveTab("flagged")}
              className={`px-4 sm:px-6 py-2 rounded-[8px] font-roboto text-[14px] sm:text-[16px] font-medium leading-[20px] transition border border-[#E5E7EB] whitespace-nowrap ${
                activeTab === "flagged"
                  ? "bg-[#ED4122] text-white"
                  : "bg-[#FFFFFF] text-oxford-blue hover:bg-[#E5E7EB]"
              }`}
            >
              {t('admin.contentModeration.tabs.flaggedContent')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className={`px-4 sm:px-6 py-2 rounded-[8px] font-roboto text-[14px] sm:text-[16px] font-medium leading-[20px] transition border border-[#E5E7EB] whitespace-nowrap ${
                activeTab === "pending"
                  ? "bg-[#ED4122] text-white"
                  : "bg-[#FFFFFF] text-oxford-blue hover:bg-[#E5E7EB]"
              }`}
            >
              {t('admin.contentModeration.tabs.pendingApproval')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reports")}
              className={`px-4 sm:px-6 py-2 rounded-[8px] font-roboto text-[14px] sm:text-[16px] font-medium leading-[20px] transition border border-[#E5E7EB] whitespace-nowrap ${
                activeTab === "reports"
                  ? "bg-[#ED4122] text-white"
                  : "bg-[#FFFFFF] text-oxford-blue hover:bg-[#E5E7EB]"
              }`}
            >
              {t('admin.contentModeration.tabs.userReports')}
            </button>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4 md:mb-6">
            <div className="w-full sm:w-[184px]">
              <Dropdown
                value={status || ""}
                options={[
                  { value: "flagged", label: t('admin.contentModeration.filters.flagged') },
                  { value: "approved", label: t('admin.contentModeration.filters.approved') },
                  { value: "rejected", label: t('admin.contentModeration.filters.rejected') },
                ]}
                onChange={(value) => setStatus(value)}
                placeholder={t('admin.contentModeration.filters.status')}
                showDefaultOnEmpty={false}
                className="w-full"
                height="h-[50px]"
              />
            </div>
            <div className="w-full sm:w-[184px]">
              <Dropdown
                value={contentType || ""}
                options={[
                  { value: "video", label: t('admin.contentModeration.filters.video') },
                  { value: "image", label: t('admin.contentModeration.filters.image') },
                  { value: "text", label: t('admin.contentModeration.filters.text') },
                ]}
                onChange={(value) => setContentType(value)}
                placeholder={t('admin.contentModeration.filters.contentType')}
                showDefaultOnEmpty={false}
                className="w-full"
                height="h-[50px]"
              />
            </div>
            <div className="w-full sm:w-[184px]">
              <Dropdown
                value={dateRange || ""}
                options={[
                  { value: "today", label: t('admin.contentModeration.filters.today') },
                  { value: "week", label: t('admin.contentModeration.filters.thisWeek') },
                  { value: "month", label: t('admin.contentModeration.filters.thisMonth') },
                ]}
                onChange={(value) => setDateRange(value)}
                placeholder={t('admin.contentModeration.filters.dateRange')}
                showDefaultOnEmpty={false}
                className="w-full"
                height="h-[50px]"
              />
            </div>
          </div>
        </div>

        {/* Content Table - Desktop View */}
        <div className="rounded-[12px] border border-[#03274633] bg-white shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] overflow-hidden hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-oxford-blue text-center">
                  <th className="px-3 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                    {t('admin.contentModeration.table.columns.number')}
                  </th>
                  <th className="px-4 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                    {t('admin.contentModeration.table.columns.contentType')}
                  </th>
                  <th className="px-6 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                    {t('admin.contentModeration.table.columns.submittedBy')}
                  </th>
                  <th className="px-6 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                    {t('admin.contentModeration.table.columns.flagReason')}
                  </th>
                  <th className="px-6 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                    {t('admin.contentModeration.table.columns.dateReported')}
                  </th>
                  <th className="px-6 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                    {t('admin.contentModeration.table.columns.status')}
                  </th>
                  <th className="px-6 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                    {t('admin.contentModeration.table.columns.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-oxford-blue">
                      Loading...
                    </td>
                  </tr>
                ) : flaggedContent.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-oxford-blue">
                      No flagged questions found
                    </td>
                  </tr>
                ) : (
                  flaggedContent.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition"
                  >
                    <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-center text-oxford-blue">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-center text-oxford-blue">
                      {item.contentType}
                    </td>
                    <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-center text-oxford-blue">
                      {item.submittedBy}
                    </td>
                    <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-center text-oxford-blue">
                      {item.flagReason}
                    </td>
                    <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-center text-oxford-blue">
                      {formatDate(item.dateReported || item.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center font-roboto font-normal leading-[100%] text-center w-[70px] h-5 rounded-[6px] border-[0.5px] text-[10px] ${
                          item.status === "approved"
                            ? "border-[#10B981] bg-[#ECFDF5] text-[#047857]"
                            : item.status === "rejected"
                            ? "border-[#6B7280] bg-[#F3F4F6] text-[#6B7280]"
                            : "border-[#ED4122] bg-[#FEF2F2] text-[#ED4122]"
                        }`}
                      >
                        {item.status === "pending" ? "Flagged" : item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-[10px]">
                        <button
                          type="button"
                          onClick={() => handleView(item.id)}
                          className="inline-flex items-center justify-center font-roboto font-normal text-[12px] leading-[100%] text-center rounded-[6px] transition py-1 px-[10px] bg-[#C6D8D3] text-[#032746] h-[22px]"
                        >
                          {t('admin.contentModeration.table.actions.view')}
                        </button>
                        {item.status === "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(item.id)}
                              disabled={isProcessing}
                              className="inline-flex items-center justify-center font-roboto font-normal text-[12px] leading-[100%] text-center rounded-[6px] transition py-1 px-[10px] bg-[#FDF0D5] text-[#ED4122] h-[22px] disabled:opacity-50"
                            >
                              {t('admin.contentModeration.table.actions.approve')}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(item.id)}
                              disabled={isProcessing}
                              className="inline-flex items-center justify-center font-roboto font-normal text-[12px] leading-[100%] text-center rounded-[6px] transition py-1 px-[10px] bg-[#ED4122] text-white h-[22px] disabled:opacity-50"
                            >
                              {t('admin.contentModeration.table.actions.reject')}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content Cards - Mobile/Tablet View */}
        <div className="lg:hidden space-y-4">
          {loading ? (
            <div className="text-center py-8 text-oxford-blue">Loading...</div>
          ) : flaggedContent.length === 0 ? (
            <div className="text-center py-8 text-oxford-blue">No flagged questions found</div>
          ) : (
            flaggedContent.map((item) => (
            <div
              key={item.id}
              className="rounded-[12px] border border-[#03274633] bg-white shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-archivo text-[14px] font-medium leading-[16px] text-oxford-blue mb-1">
                    #{item.id}
                  </p>
                  <p className="font-roboto text-[12px] font-normal leading-[16px] text-dark-gray">
                    {item.contentType}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center justify-center font-roboto font-normal leading-[100%] text-center w-[70px] h-5 rounded-[6px] border-[0.5px] text-[10px] ${
                    item.status === "approved"
                      ? "border-[#10B981] bg-[#ECFDF5] text-[#047857]"
                      : item.status === "rejected"
                      ? "border-[#6B7280] bg-[#F3F4F6] text-[#6B7280]"
                      : "border-[#ED4122] bg-[#FEF2F2] text-[#ED4122]"
                  }`}
                >
                  {item.status === "pending" ? "Flagged" : item.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2">
                  <p className="font-roboto text-[12px] font-medium leading-[16px] text-dark-gray w-24">
                    {t('admin.contentModeration.mobile.submittedBy')}
                  </p>
                  <p className="font-roboto text-[12px] font-normal leading-[16px] text-oxford-blue flex-1">
                    {item.submittedBy}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <p className="font-roboto text-[12px] font-medium leading-[16px] text-dark-gray w-24">
                    {t('admin.contentModeration.mobile.flagReason')}
                  </p>
                  <p className="font-roboto text-[12px] font-normal leading-[16px] text-oxford-blue flex-1">
                    {item.flagReason}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <p className="font-roboto text-[12px] font-medium leading-[16px] text-dark-gray w-24">
                    {t('admin.contentModeration.mobile.dateReported')}
                  </p>
                  <p className="font-roboto text-[12px] font-normal leading-[16px] text-oxford-blue flex-1">
                    {formatDate(item.dateReported || item.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-3 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => handleView(item.id)}
                  className="inline-flex flex-1 sm:flex-initial items-center justify-center font-roboto font-normal text-[12px] leading-[100%] text-center rounded-[6px] transition px-3 py-2 bg-[#C6D8D3] text-[#032746] min-h-[32px]"
                >
                  {t('admin.contentModeration.table.actions.view')}
                </button>
                {item.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleApprove(item.id)}
                      disabled={isProcessing}
                      className="inline-flex flex-1 sm:flex-initial items-center justify-center font-roboto font-normal text-[12px] leading-[100%] text-center rounded-[6px] transition px-3 py-2 bg-[#FDF0D5] text-[#ED4122] min-h-[32px] disabled:opacity-50"
                    >
                      {t('admin.contentModeration.table.actions.approve')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(item.id)}
                      disabled={isProcessing}
                      className="inline-flex flex-1 sm:flex-initial items-center justify-center font-roboto font-normal text-[12px] leading-[100%] text-center rounded-[6px] transition px-3 py-2 bg-[#ED4122] text-white min-h-[32px] disabled:opacity-50"
                    >
                      {t('admin.contentModeration.table.actions.reject')}
                    </button>
                  </>
                )}
              </div>
            </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="rounded-[12px] border border-[#03274633] bg-white shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] mt-4 lg:mt-0 lg:border-t-0 lg:rounded-t-none">
          <div className="flex flex-col gap-4 border-t border-[#E5E7EB] bg-white px-3 sm:px-4 py-4 text-oxford-blue lg:flex-row lg:items-center lg:justify-between lg:bg-oxford-blue lg:px-6 lg:text-white">
            <p className="text-[11px] sm:text-[12px] font-roboto font-medium leading-[18px] tracking-[3%] text-center lg:text-left">
              {t('admin.contentModeration.pagination.showing').replace('{{from}}', '1').replace('{{to}}', '3').replace('{{total}}', '25')}
            </p>
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <button
                type="button"
                className="flex h-[27px] w-[70px] sm:w-[78px] items-center justify-center rounded border text-[12px] sm:text-[14px] font-archivo font-semibold leading-[16px] transition-colors border-[#032746] bg-white text-oxford-blue hover:bg-[#F3F4F6] lg:border-white"
              >
                {t('admin.contentModeration.pagination.previous')}
              </button>
              <button
                type="button"
                className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded border border-[#ED4122] bg-[#ED4122] text-[12px] sm:text-[14px] font-archivo font-semibold leading-[16px] text-white transition-colors"
              >
                1
              </button>
              <button
                type="button"
                className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded border border-[#E5E7EB] bg-white text-[12px] sm:text-[14px] font-archivo font-semibold leading-[16px] text-oxford-blue transition-colors hover:bg-[#F3F4F6] lg:border-[#032746]"
              >
                2
              </button>
              <button
                type="button"
                className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded border border-[#E5E7EB] bg-white text-[12px] sm:text-[14px] font-archivo font-semibold leading-[16px] text-oxford-blue transition-colors hover:bg-[#F3F4F6] lg:border-[#032746]"
              >
                3
              </button>
              <button
                type="button"
                className="flex h-[27px] w-[70px] sm:w-[78px] items-center justify-center rounded border text-[12px] sm:text-[14px] font-archivo font-semibold leading-[16px] transition-colors border-[#032746] bg-white text-oxford-blue hover:bg-[#F3F4F6] lg:border-white"
              >
                {t('admin.contentModeration.pagination.next')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Question Modal */}
      {showViewModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[20px] font-archivo font-bold text-oxford-blue">
                Question Details
              </h3>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedQuestion(null);
                }}
                className="text-oxford-blue hover:text-[#ED4122] text-[24px]"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[14px] font-roboto font-medium text-dark-gray mb-1">Question:</p>
                <p className="text-[16px] font-roboto text-oxford-blue">{selectedQuestion.question}</p>
              </div>
              {selectedQuestion.options && (
                <div>
                  <p className="text-[14px] font-roboto font-medium text-dark-gray mb-2">Options:</p>
                  <div className="space-y-2">
                    {Object.entries(selectedQuestion.options).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="font-medium text-oxford-blue w-6">{key}:</span>
                        <span className="text-[14px] font-roboto text-oxford-blue">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedQuestion.explanation && (
                <div>
                  <p className="text-[14px] font-roboto font-medium text-dark-gray mb-1">Explanation:</p>
                  <p className="text-[14px] font-roboto text-oxford-blue">{selectedQuestion.explanation}</p>
                </div>
              )}
              <div>
                <p className="text-[14px] font-roboto font-medium text-dark-gray mb-1">Flag Reason:</p>
                <p className="text-[14px] font-roboto text-[#ED4122]">{selectedQuestion.flagReason}</p>
              </div>
              <div>
                <p className="text-[14px] font-roboto font-medium text-dark-gray mb-1">Flagged By:</p>
                <p className="text-[14px] font-roboto text-oxford-blue">
                  {selectedQuestion.submittedBy || selectedQuestion.flaggedBy?.name || "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedQuestion && (
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
                  setSelectedQuestion(null);
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

export default ContentModerationPage;

