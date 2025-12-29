import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import Dropdown from "../../components/shared/Dropdown";
import questionsAPI from "../../api/questions";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig";
import Loader from "../../components/common/Loader";
import { cleanHtmlForDisplay } from "../../utils/textUtils";

const ContentModerationPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [status, setStatus] = useState("");
  const [contentType, setContentType] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [flaggedContent, setFlaggedContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Fetch flagged questions
  useEffect(() => {
    fetchFlaggedQuestions();
  }, [status]);

  const fetchFlaggedQuestions = async () => {
    setLoading(true);
    try {
      const response = await questionsAPI.getFlaggedQuestionsForModeration({ status: status || undefined });
      setFlaggedContent(response.data.questions || []);
      setCurrentPage(1); // Reset to first page on new filter
    } catch (error) {
      showErrorToast(error.message || "Failed to fetch flagged questions");
    } finally {
      setLoading(false);
    }
  };

  // Filter and paginate data
  const filteredAndPaginatedData = useMemo(() => {
    let filtered = [...flaggedContent];

    // Filter by contentType (question type)
    if (contentType) {
      if (contentType === "mcq") {
        filtered = filtered.filter(item => item.questionType === "MCQ" || item.questionType === "MULTIPLE_CHOICE");
      } else if (contentType === "truefalse") {
        filtered = filtered.filter(item => item.questionType === "TRUE_FALSE" || item.questionType === "True/False");
      }
    }

    // Filter by date range
    if (dateRange) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.dateReported || item.createdAt);
        const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
        
        if (dateRange === "today") {
          return itemDateOnly.getTime() === today.getTime();
        } else if (dateRange === "week") {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return itemDateOnly >= weekAgo;
        } else if (dateRange === "month") {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return itemDateOnly >= monthAgo;
        }
        return true;
      });
    }

    // Paginate
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = filtered.slice(startIndex, endIndex);

    return {
      data: paginated,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize),
    };
  }, [flaggedContent, contentType, dateRange, currentPage, pageSize]);

  // Get question type display text
  const getQuestionTypeDisplay = (questionType) => {
    if (!questionType) return "N/A";
    if (questionType === "MCQ" || questionType === "MULTIPLE_CHOICE") return "MCQ";
    if (questionType === "TRUE_FALSE" || questionType === "True/False") return "True/False";
    return questionType;
  };

  const handleView = (id) => {
    const item = flaggedContent.find(q => q.id === id);
    if (item) {
      setSelectedQuestion(item);
      setShowViewModal(true);
    }
  };

  const handleApprove = (id) => {
    const content = flaggedContent.find((item) => item.id === id);
    if (content) {
      setSelectedQuestion(content);
      setShowApproveModal(true);
    }
  };

  const handleApproveSubmit = async () => {
    if (!selectedQuestion) return;
    
    setIsProcessing(true);
    try {
      await questionsAPI.approveStudentFlag(selectedQuestion.id);
      showSuccessToast("Flag approved. Question sent to processor.");
      setShowApproveModal(false);
      setSelectedQuestion(null);
      fetchFlaggedQuestions();
    } catch (error) {
      showErrorToast(error.message || "Failed to approve flag");
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
      showErrorToast("Please provide a rejection reason");
      return;
    }
    if (!selectedQuestion) return;

    setIsProcessing(true);
    try {
      await questionsAPI.rejectStudentFlag(selectedQuestion.id, rejectReason);
      showSuccessToast("Flag rejected. Student will be notified.");
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedQuestion(null);
      fetchFlaggedQuestions();
    } catch (error) {
      showErrorToast(error.message || "Failed to reject flag");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const handleExport = () => {
    try {
      // Get all filtered data (not just paginated)
      let allFilteredData = [...flaggedContent];

      // Filter by contentType (question type)
      if (contentType) {
        if (contentType === "mcq") {
          allFilteredData = allFilteredData.filter(item => item.questionType === "MCQ" || item.questionType === "MULTIPLE_CHOICE");
        } else if (contentType === "truefalse") {
          allFilteredData = allFilteredData.filter(item => item.questionType === "TRUE_FALSE" || item.questionType === "True/False");
        }
      }

      // Filter by date range
      if (dateRange) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        allFilteredData = allFilteredData.filter(item => {
          const itemDate = new Date(item.dateReported || item.createdAt);
          const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
          
          if (dateRange === "today") {
            return itemDateOnly.getTime() === today.getTime();
          } else if (dateRange === "week") {
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return itemDateOnly >= weekAgo;
          } else if (dateRange === "month") {
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return itemDateOnly >= monthAgo;
          }
          return true;
        });
      }

      if (!allFilteredData || allFilteredData.length === 0) {
        showErrorToast("No data to export");
        return;
      }

      // Define CSV headers
      const headers = [
        "Question Title",
        "Content Type",
        "Submitted By",
        "Flag Reason",
        "Date Reported",
        "Status"
      ];

      // Helper function to escape CSV values
      const escapeCSV = (value) => {
        if (value === null || value === undefined) return "";
        const stringValue = String(value);
        // If value contains comma, quote, or newline, wrap in quotes and escape quotes
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      };

      // Create CSV rows
      const csvRows = [
        headers.join(","),
        ...allFilteredData.map((item) => {
          return [
            escapeCSV(item.question || item.questionText || "N/A"),
            escapeCSV(getQuestionTypeDisplay(item.questionType)),
            escapeCSV(item.submittedBy || "Unknown"),
            escapeCSV(item.flagReason || ""),
            escapeCSV(formatDate(item.dateReported || item.createdAt)),
            escapeCSV(item.status === "pending" ? "Flagged" : item.status || "N/A")
          ].join(",");
        }),
      ];

      // Create blob and download
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // Generate filename
      const timestamp = new Date().toISOString().split("T")[0];
      link.download = `content_moderation_${timestamp}.csv`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showSuccessToast(`Exported ${allFilteredData.length} flagged questions successfully`);
    } catch (error) {
      console.error("Error exporting content moderation data:", error);
      showErrorToast("Failed to export data. Please try again.");
    }
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
                onClick={handleExport}
                className="flex flex-1 sm:flex-initial h-[36px] items-center justify-center gap-2 rounded-[8px] border border-[#03274633] bg-[#ED4122] px-3 md:px-5 text-[12px] sm:text-[14px] md:text-[16px] font-roboto font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f]"
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

          {/* Filter Dropdowns */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4 md:mb-6">
            <div className="w-full sm:w-[184px]">
              <Dropdown
                value={status || ""}
                options={[
                  { value: "pending", label: t('admin.contentModeration.filters.flagged') },
                  { value: "approved", label: t('admin.contentModeration.filters.approved') },
                  { value: "rejected", label: t('admin.contentModeration.filters.rejected') },
                ]}
                onChange={(value) => {
                  setStatus(value);
                  setCurrentPage(1);
                }}
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
                  { value: "mcq", label: "MCQ" },
                  { value: "truefalse", label: "True/False" },
                ]}
                onChange={(value) => {
                  setContentType(value);
                  setCurrentPage(1);
                }}
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
                onChange={(value) => {
                  setDateRange(value);
                  setCurrentPage(1);
                }}
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
                  <th className="px-4 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white w-[200px]">
                    {t('admin.contentModeration.table.columns.questionTitle') || "Question"}
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
                    <td colSpan="7" className="px-6 py-4 text-center">
                      <Loader size="md" color="oxford-blue" />
                    </td>
                  </tr>
                ) : filteredAndPaginatedData.data.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-oxford-blue">
                      No flagged questions found
                    </td>
                  </tr>
                ) : (
                  filteredAndPaginatedData.data.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition"
                  >
                    <td className="px-4 py-4 text-[14px] font-roboto font-normal leading-[100%] text-center text-oxford-blue w-[200px]">
                      <div 
                        className="line-clamp-2"
                        dangerouslySetInnerHTML={{ 
                          __html: cleanHtmlForDisplay(item.question || item.questionText || "N/A") 
                        }}
                      />
                    </td>
                    <td className="px-4 py-4 text-[14px] font-roboto font-normal leading-[100%] text-center text-oxford-blue">
                      {getQuestionTypeDisplay(item.questionType)}
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
          {/* Pagination */}
          {filteredAndPaginatedData.totalPages > 0 && (
            <div className="flex flex-col gap-4 border-t border-[#E5E7EB] bg-white px-3 sm:px-4 py-4 text-oxford-blue lg:flex-row lg:items-center lg:justify-between lg:bg-oxford-blue lg:px-6 lg:text-white">
              <p className="text-[11px] sm:text-[12px] font-roboto font-medium leading-[18px] tracking-[3%] text-center lg:text-left">
                {t('admin.contentModeration.pagination.showing')
                  .replace('{{from}}', filteredAndPaginatedData.total > 0 ? ((currentPage - 1) * pageSize + 1).toString() : '0')
                  .replace('{{to}}', Math.min(currentPage * pageSize, filteredAndPaginatedData.total).toString())
                  .replace('{{total}}', filteredAndPaginatedData.total.toString())}
              </p>
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`flex h-[27px] w-[70px] sm:w-[78px] items-center justify-center rounded border text-[12px] sm:text-[14px] font-archivo font-semibold leading-[16px] transition-colors ${
                    currentPage === 1
                      ? "cursor-not-allowed border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] lg:border-transparent lg:bg-white/20 lg:text-white/70"
                      : "border-[#032746] bg-white text-oxford-blue hover:bg-[#F3F4F6] lg:border-white"
                  }`}
                >
                  {t('admin.contentModeration.pagination.previous')}
                </button>
                {Array.from({ length: Math.min(filteredAndPaginatedData.totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (filteredAndPaginatedData.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= filteredAndPaginatedData.totalPages - 2) {
                    pageNum = filteredAndPaginatedData.totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded border text-[12px] sm:text-[14px] font-archivo font-semibold leading-[16px] transition-colors ${
                        pageNum === currentPage
                          ? "border-[#ED4122] bg-[#ED4122] text-white"
                          : "border-[#E5E7EB] bg-white text-oxford-blue hover:bg-[#F3F4F6] lg:border-[#032746]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.min(filteredAndPaginatedData.totalPages, prev + 1))}
                  disabled={currentPage === filteredAndPaginatedData.totalPages}
                  className={`flex h-[27px] w-[70px] sm:w-[78px] items-center justify-center rounded border text-[12px] sm:text-[14px] font-archivo font-semibold leading-[16px] transition-colors ${
                    currentPage === filteredAndPaginatedData.totalPages
                      ? "cursor-not-allowed border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] lg:border-transparent lg:bg-white/20 lg:text-white/70"
                      : "border-[#032746] bg-white text-oxford-blue hover:bg-[#F3F4F6] lg:border-white"
                  }`}
                >
                  {t('admin.contentModeration.pagination.next')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content Cards - Mobile/Tablet View */}
        <div className="lg:hidden space-y-4">
          {loading ? (
            <Loader size="lg" color="oxford-blue" className="py-8" />
          ) : filteredAndPaginatedData.data.length === 0 ? (
            <div className="text-center py-8 text-oxford-blue">No flagged questions found</div>
          ) : (
            filteredAndPaginatedData.data.map((item) => (
            <div
              key={item.id}
              className="rounded-[12px] border border-[#03274633] bg-white shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-roboto text-[12px] font-medium leading-[16px] text-dark-gray mb-1">
                    {t('admin.contentModeration.table.columns.questionTitle') || "Question Title"}
                  </p>
                  <p 
                    className="font-roboto text-[12px] font-normal leading-[16px] text-oxford-blue mb-2 line-clamp-2"
                    dangerouslySetInnerHTML={{ 
                      __html: cleanHtmlForDisplay(item.question || item.questionText || "N/A") 
                    }}
                  />
                  <p className="font-roboto text-[12px] font-normal leading-[16px] text-dark-gray">
                    {getQuestionTypeDisplay(item.questionType)}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center justify-center font-roboto font-normal leading-[100%] text-center w-[70px] h-5 rounded-[6px] border-[0.5px] text-[10px] ml-2 ${
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
          {/* Mobile Pagination */}
          {filteredAndPaginatedData.totalPages > 0 && (
            <div className="flex flex-col gap-4 border-t border-[#E5E7EB] bg-white px-3 sm:px-4 py-4 text-oxford-blue rounded-[12px] border border-[#03274633] bg-white shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
              <p className="text-[11px] sm:text-[12px] font-roboto font-medium leading-[18px] tracking-[3%] text-center">
                {t('admin.contentModeration.pagination.showing')
                  .replace('{{from}}', filteredAndPaginatedData.total > 0 ? ((currentPage - 1) * pageSize + 1).toString() : '0')
                  .replace('{{to}}', Math.min(currentPage * pageSize, filteredAndPaginatedData.total).toString())
                  .replace('{{total}}', filteredAndPaginatedData.total.toString())}
              </p>
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`flex h-[27px] w-[70px] sm:w-[78px] items-center justify-center rounded border text-[12px] sm:text-[14px] font-archivo font-semibold leading-[16px] transition-colors ${
                    currentPage === 1
                      ? "cursor-not-allowed border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF]"
                      : "border-[#032746] bg-white text-oxford-blue hover:bg-[#F3F4F6]"
                  }`}
                >
                  {t('admin.contentModeration.pagination.previous')}
                </button>
                {Array.from({ length: Math.min(filteredAndPaginatedData.totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (filteredAndPaginatedData.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= filteredAndPaginatedData.totalPages - 2) {
                    pageNum = filteredAndPaginatedData.totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded border text-[12px] sm:text-[14px] font-archivo font-semibold leading-[16px] transition-colors ${
                        pageNum === currentPage
                          ? "border-[#ED4122] bg-[#ED4122] text-white"
                          : "border-[#E5E7EB] bg-white text-oxford-blue hover:bg-[#F3F4F6]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.min(filteredAndPaginatedData.totalPages, prev + 1))}
                  disabled={currentPage === filteredAndPaginatedData.totalPages}
                  className={`flex h-[27px] w-[70px] sm:w-[78px] items-center justify-center rounded border text-[12px] sm:text-[14px] font-archivo font-semibold leading-[16px] transition-colors ${
                    currentPage === filteredAndPaginatedData.totalPages
                      ? "cursor-not-allowed border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF]"
                      : "border-[#032746] bg-white text-oxford-blue hover:bg-[#F3F4F6]"
                  }`}
                >
                  {t('admin.contentModeration.pagination.next')}
                </button>
              </div>
            </div>
          )}
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
                <div 
                  className="text-[16px] font-roboto text-oxford-blue"
                  dangerouslySetInnerHTML={{ 
                    __html: cleanHtmlForDisplay(selectedQuestion.question || selectedQuestion.questionText || "N/A") 
                  }}
                />
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

      {/* Approve Confirmation Modal */}
      {showApproveModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-[18px] font-archivo font-bold text-oxford-blue mb-4">
              Approve Flag
            </h3>
            <p className="text-[14px] font-roboto text-dark-gray mb-4">
              Are you sure you want to approve this flag? The question will be sent to processor for review.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedQuestion(null);
                }}
                className="px-4 py-2 text-[14px] font-roboto text-oxford-blue border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleApproveSubmit}
                disabled={isProcessing}
                className="px-4 py-2 text-[14px] font-roboto text-white bg-[#10B981] rounded-lg hover:bg-[#059669] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Approving..." : "Approve"}
              </button>
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

