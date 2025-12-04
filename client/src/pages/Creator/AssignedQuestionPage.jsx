
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import { useState, useEffect, useRef } from "react";
import SearchFilter from "../../components/common/SearchFilter";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";
import questionsAPI from "../../api/questions";

const AssignedQuestionPage = () => {
  const { t } = useLanguage();

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsData, setQuestionsData] = useState([]);
  const [allQuestionsData, setAllQuestionsData] = useState([]); // Store all fetched questions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const pollingIntervalRef = useRef(null);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [selectedFlagReason, setSelectedFlagReason] = useState("");

  const QuestionsColumns = [
    { key: 'questionTitle', label: t("creator.assignedQuestionPage.table.question") },
    { key: 'subject', label: t("creator.assignedQuestionPage.table.subject") },
    { key: 'processor', label: t("creator.assignedQuestionPage.table.processor") },
    { key: 'status', label: t("creator.assignedQuestionPage.table.status") },
    { key: 'indicators', label: t("creator.assignedQuestionPage.table.indicators") },
    { key: 'updatedOn', label: t("creator.assignedQuestionPage.table.updatedOn") },
    { key: 'actions', label: t("creator.assignedQuestionPage.table.actions") }
  ];

  // Format date to relative time (Today, Yesterday, or date)
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const questionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (questionDate.getTime() === today.getTime()) {
      return "Today";
    } else if (questionDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      // Format as MM/DD/YYYY or DD/MM/YYYY based on locale
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  // Format status to readable format that works with Table component styling
  const formatStatus = (status) => {
    if (!status) return "—";
    
    // Convert status from snake_case to readable format
    // Use values that match Table component's status checks for proper styling
    const statusMap = {
      'pending_processor': 'Pending',
      'pending_creator': 'Pending',
      'pending_explainer': 'Pending',
      'pending_gatherer': 'Pending',
      'completed': 'Approved',
      'rejected': 'Reject'
    };
    
    // Return mapped status or format it
    if (statusMap[status]) {
      return statusMap[status];
    }
    
    // For other statuses, format them
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Transform API response to table format
  const transformQuestionData = (questions) => {
    return questions.map((question) => {
      // Get processor name from approvedBy (processor who approved and sent to creator)
      const processorName = question.approvedBy?.name || question.assignedProcessor?.name || "—";
      
      // Get subject name
      const subjectName = question.subject?.name || "—";
      
      // Determine indicators
      const isApproved = question.status === 'completed';
      const isFlagged = question.isFlagged === true;
      const isRejected = question.status === 'rejected';
      const isVariant = question.isVariant === true;
      
      // Get status - show actual status, but if flagged, we'll show it in indicators and add reason button
      const status = formatStatus(question.status);
      
      // Extract question title from questionText (first 50 characters)
      const questionTitle = question.questionText 
        ? (question.questionText.length > 50 
            ? question.questionText.substring(0, 50) + "..." 
            : question.questionText)
        : "—";

      return {
        id: question.id,
        questionTitle: questionTitle,
        subject: subjectName,
        processor: processorName,
        status: status,
        indicators: {
          approved: isApproved,
          flag: isFlagged,
          reject: isRejected,
          variant: isVariant
        },
        flagReason: question.flagReason || null,
        updatedOn: formatDate(question.updatedAt),
        actionType: question.isVariant ? 'createVariant' : 'open',
        originalData: question // Store original data for navigation
      };
    });
  };

  // Fetch assigned questions from API - fetch all questions for creator (all statuses)
  const fetchAssignedQuestions = async () => {
    try {
      setError(null);
      // Fetch questions with multiple statuses to get all questions assigned to creator
      // This includes: pending_creator, pending_processor (flagged), completed, rejected, etc.
      const statusesToFetch = ['pending_creator', 'pending_processor', 'completed', 'rejected'];
      const allQuestions = [];
      
      // Fetch questions for each status
      for (const status of statusesToFetch) {
        try {
          const response = await questionsAPI.getCreatorQuestions({ status });
          if (response.success && response.data?.questions) {
            allQuestions.push(...response.data.questions);
          }
        } catch (err) {
          console.warn(`Failed to fetch questions with status ${status}:`, err);
        }
      }
      
      // Remove duplicates based on question ID
      const uniqueQuestions = Array.from(
        new Map(allQuestions.map(q => [q.id || q._id, q])).values()
      );
      
      const transformedData = transformQuestionData(uniqueQuestions);
      setAllQuestionsData(transformedData);
      setTotalQuestions(uniqueQuestions.length);
      // Apply filters to the data
      applyFilters(transformedData);
    } catch (err) {
      console.error("Error fetching assigned questions:", err);
      setError(err.message || "Failed to fetch questions");
      setQuestionsData([]);
      setAllQuestionsData([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply client-side filters
  const applyFilters = (data) => {
    let filtered = [...data];

    // Filter by search term (question text)
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((item) =>
        item.questionTitle.toLowerCase().includes(searchLower) ||
        item.processor.toLowerCase().includes(searchLower) ||
        item.subject.toLowerCase().includes(searchLower) ||
        item.status.toLowerCase().includes(searchLower)
      );
    }

    // Filter by subject (if implemented in API response)
    if (subject && subject !== "Subject") {
      filtered = filtered.filter((item) => {
        const questionSubject = item.originalData?.subject?.name || "";
        return questionSubject.toLowerCase() === subject.toLowerCase();
      });
    }

    // Filter by status (subtopic filter is used for status)
    if (subtopic && subtopic !== "Status") {
      filtered = filtered.filter((item) => {
        if (subtopic.toLowerCase() === "flag") {
          // Filter by flagged status
          return item.indicators?.flag === true || item.originalData?.isFlagged === true;
        } else {
          // Filter by regular status
          const questionStatus = item.originalData?.status || "";
          const displayStatus = item.status || "";
          // Check both the original status and the display status
          return questionStatus.toLowerCase().includes(subtopic.toLowerCase()) ||
                 displayStatus.toLowerCase().includes(subtopic.toLowerCase());
        }
      });
    }

    setQuestionsData(filtered);
    setTotalQuestions(filtered.length);
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  // Apply filters when filter values change
  useEffect(() => {
    if (allQuestionsData.length > 0) {
      applyFilters(allQuestionsData);
    }
  }, [search, subject, subtopic, allQuestionsData]);

  // Set up polling for real-time updates
  useEffect(() => {
    // Fetch immediately on mount
    fetchAssignedQuestions();

    // Set up polling every 5 seconds for real-time updates
    pollingIntervalRef.current = setInterval(() => {
      fetchAssignedQuestions();
    }, 5000);

    // Cleanup interval on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler for view action
  const handleView = (item) => {
    if (item.originalData) {
      navigate(`/creator/question-bank/question/${item.id}`);
    }
  };

  // Handler for edit action
  const handleEdit = (item) => {
    if (item.originalData) {
      navigate(`/creator/question-bank/question/${item.id}/edit`);
    }
  };

  const handleCancel = () => {
    navigate("/creator/question-bank");
  };

  const handleCreateVariant = (item) => {
    if (item.originalData) {
      navigate(`/creator/question-bank/create-variants`, { 
        state: { questionId: item.id, question: item.originalData } 
      });
    } else {
      navigate("/creator/question-bank/create-variants");
    }
  };

  const handleShowFlagReason = (flagReason) => {
    setSelectedFlagReason(flagReason || "");
    setIsFlagModalOpen(true);
  };

  const handleCloseFlagModal = () => {
    setIsFlagModalOpen(false);
    setSelectedFlagReason("");
  };

  const subjectOptions = ["Subject", "Mathematics", "Physics", "Chemistry", "Biology"];
  const subtopicOptions = ["Status", "Approved", "Failed", "Reject", "Flag"];


  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[60px]">
        <header className="flex justify-between gap-4">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue mb-2">
              {t("creator.assignedQuestionPage.title")}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t("creator.assignedQuestionPage.subtitle")}
            </p>
          </div>
            <OutlineButton text={t("creator.assignedQuestionPage.back")} className="py-[10px] px-5" onClick={handleCancel}/>
        </header>

        <SearchFilter
          searchValue={search}
          subjectValue={subject}
          subtopicValue={subtopic}
          onSearchChange={setSearch}
          onSubjectChange={setSubject}
          onSubtopicChange={setSubtopic}
          subjectOptions={subjectOptions}
          subtopicOptions={subtopicOptions}
          searchPlaceholder={t("creator.assignedQuestionPage.searchPlaceholder")}
        />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-oxford-blue text-lg font-roboto">Loading questions...</div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-cinnebar-red text-lg font-roboto mb-4">{error}</div>
          <OutlineButton 
            text="Retry" 
            className="py-[10px] px-5" 
            onClick={fetchAssignedQuestions}
          />
        </div>
      ) : (
        <Table
          items={questionsData.slice((currentPage - 1) * 10, currentPage * 10)}
          columns={QuestionsColumns}
          page={currentPage}
          pageSize={10}
          total={totalQuestions}
          onPageChange={setCurrentPage}
          onView={handleView}
          onEdit={handleEdit}
          onCustomAction={(item) => {
            // Handle different custom actions based on actionType
            if (item.actionType === 'open') {
              handleCreateVariant(item);
            } else if (item.actionType === 'createVariant') {
              handleCreateVariant(item);
            }
          }}
          emptyMessage={t("creator.assignedQuestionPage.emptyMessage")}
          onShowFlagReason={handleShowFlagReason}
        />
      )}

      {/* Flag Reason Modal */}
      {isFlagModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-[600px] w-full p-8">
            <h2 className="text-[24px] leading-[100%] font-bold text-oxford-blue mb-2">
              {t("creator.assignedQuestionPage.flagReasonModal.title")}
            </h2>
            <p className="text-[16px] leading-[100%] font-normal text-dark-gray mb-6">
              {t("creator.assignedQuestionPage.flagReasonModal.subtitle")}
            </p>
            <div className="mb-6">
              <label className="block text-[16px] leading-[100%] font-roboto font-normal text-oxford-blue mb-2">
                {t("creator.assignedQuestionPage.flagReasonModal.reasonLabel")}
              </label>
              <div className="w-full min-h-[120px] rounded-[8px] border border-[#03274633] bg-white px-4 py-3 font-roboto text-[16px] leading-[20px] text-oxford-blue">
                {selectedFlagReason || t("creator.assignedQuestionPage.flagReasonModal.noReason")}
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleCloseFlagModal}
                className="flex-1 font-roboto px-4 py-3 border-[0.5px] text-base font-normal border-[#032746] rounded-lg text-blue-dark hover:bg-gray-50 transition-colors"
              >
                {t("creator.assignedQuestionPage.flagReasonModal.close")}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AssignedQuestionPage;
