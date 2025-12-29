import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import { useState, useEffect, useMemo, useCallback } from "react";
import ProcessorFilter from "../../components/Processor/ProcessorFilter";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";
import questionsAPI from "../../api/questions";
import Loader from "../../components/common/Loader";

const CreaterSubmission = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [selectedFlagReason, setSelectedFlagReason] = useState("");

  // Processor status options for the filter
  const processorStatusOptions = useMemo(
    () => [
      t("filter.status") || "All Status",
      "Pending Review",
      "Approved",
      "Rejected",
      "Flag",
    ],
    [t]
  );

  // Memoize columns to prevent rerenders
  const createSubmissionColumns = useMemo(
    () => [
      {
        key: "questionTitle",
        label: t("processor.creatorSubmission.table.question"),
      },
      { key: "creator", label: t("processor.creatorSubmission.table.creator") },
      {
        key: "processorStatus",
        label:
          t("processor.creatorSubmission.table.processorStatus") ||
          "PROCESSOR STATUS",
      },
      {
        key: "creatorStatus",
        label:
          t("processor.creatorSubmission.table.creatorStatus") ||
          "CREATOR STATUS",
      },
      {
        key: "submittedOn",
        label: t("processor.creatorSubmission.table.submittedOn"),
      },
      { key: "actions", label: t("processor.creatorSubmission.table.actions") },
    ],
    [t]
  );

  // Format date to "Today", "Yesterday", or formatted date
  const formatDate = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return "Today";
    } else if (date.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  // Map API status to processor status
  const mapProcessorStatus = useCallback((status) => {
    const statusMap = {
      pending_processor: "Pending Review",
      pending_creator: "Approved",
      pending_explainer: "Approved",
      completed: "Approved",
      approved: "Approved",
      accepted: "Approved",
      rejected: "Rejected",
      reject: "Rejected",
      flagged: "Pending Review",
      flag: "Pending Review",
    };
    return statusMap[status?.toLowerCase()] || "Pending Review";
  }, []);

  // Map API status to creator status
  const mapCreatorStatus = useCallback((
    status,
    isFlagged,
    hasVariants,
    isSubmittedByCreator,
    isCompleted
  ) => {
    // Priority: Flag > Variant Created > Approved > Other statuses
    if (isFlagged) {
      return "Flag";
    }

    if (hasVariants && status === "pending_processor") {
      return "Variant Created";
    }

    // Check if approved/completed or sent to explainer
    if (
      isSubmittedByCreator ||
      isCompleted ||
      status === "completed" ||
      status === "pending_explainer"
    ) {
      return "Approved";
    }

    const statusMap = {
      pending_processor: "Pending",
      pending_creator: "Pending",
      pending_explainer: "Approved",
      completed: "Approved",
      approved: "Approved",
      accepted: "Approved",
      rejected: "Rejected",
      reject: "Rejected",
      flagged: "Flag",
      flag: "Flag",
      variant_created: "Variant Created",
    };
    return statusMap[status?.toLowerCase()] || "Pending";
  }, []);

  // Fetch creator submissions from API
  const fetchCreatorSubmissions = useCallback(async () => {
  try {
    setLoading(true);

    // Build base params
    const baseParams = {
      submittedBy: "creator",
      page: currentPage,
      limit: 10,
    };

    // Add search filter if provided
    if (search && search.trim()) {
      baseParams.search = search.trim();
    }

    let allQuestions = [];
    let totalCount = 0;

    // Handle different filter cases
    if (subtopic === "Flag") {
      // For Flag filter: fetch flagged questions
      const params = {
        ...baseParams,
        flagType: 'flagged', // This is the key parameter
      };

      console.log("Fetching flagged questions with params:", params);

      const response = await questionsAPI.getProcessorQuestions(params);
      console.log("Flag filter API response:", response);

      if (response.success && response.data) {
        allQuestions = response.data.questions || [];
        const pagination = response.data.pagination || {};
        totalCount = pagination.totalItems || allQuestions.length;
      }
    } else if (subtopic === "Approved") {
      // For Approved filter: fetch all and filter approved statuses
      const params = {
        ...baseParams,
      };

      const response = await questionsAPI.getProcessorQuestions(params);
      if (response.success && response.data) {
        const questions = response.data.questions || [];
        
        // Filter for approved statuses on frontend
        const approvedQuestions = questions.filter((q) => {
          const status = q.status?.toLowerCase();
          return [
            "pending_creator",
            "pending_explainer",
            "completed",
            "approved",
            "accepted",
          ].includes(status);
        });
        
        allQuestions = approvedQuestions;
        const pagination = response.data.pagination || {};
        totalCount = approvedQuestions.length;
      }
    } else if (subtopic === "Rejected") {
      // For Rejected filter
      const params = {
        ...baseParams,
        status: "rejected",
      };

      const response = await questionsAPI.getProcessorQuestions(params);
      if (response.success && response.data) {
        allQuestions = response.data.questions || [];
        const pagination = response.data.pagination || {};
        totalCount = pagination.totalItems || allQuestions.length;
      }
    } else if (subtopic === "Pending Review") {
      // For Pending Review filter
      const params = {
        ...baseParams,
        status: "pending_processor",
      };

      const response = await questionsAPI.getProcessorQuestions(params);
      if (response.success && response.data) {
        allQuestions = response.data.questions || [];
        const pagination = response.data.pagination || {};
        totalCount = pagination.totalItems || allQuestions.length;
      }
    } else {
      // For "All Status" or when subtopic is empty
      // Fetch all creator submissions (including flagged)
      const params = {
        ...baseParams,
        // No status or flagType filter - get all creator submissions
      };

      const response = await questionsAPI.getProcessorQuestions(params);
      console.log("All status API response:", response);

      if (response.success && response.data) {
        allQuestions = response.data.questions || [];
        const pagination = response.data.pagination || {};
        totalCount = pagination.totalItems || allQuestions.length;
      }
    }

    // Fetch detailed information for each question
    const questionsWithDetails = await Promise.all(
      allQuestions.map(async (question) => {
        try {
          const detailResponse = await questionsAPI.getProcessorQuestionById(
            question.id
          );
          if (detailResponse.success && detailResponse.data) {
            const detailedQuestion = detailResponse.data.question;
            return {
              ...question,
              ...detailedQuestion,
              rejectionReason: detailedQuestion?.rejectionReason || null,
              flagReason: detailedQuestion?.flagReason || null,
              flagStatus: detailedQuestion?.flagStatus || null,
              // Check if flagged by creator
              isFlagged: (detailedQuestion?.isFlagged === true ||
                         detailedQuestion?.isFlagged === "true") &&
                        detailedQuestion?.flagType === 'creator' &&
                        (detailedQuestion?.flagStatus === 'pending' ||
                         detailedQuestion?.flagStatus === null ||
                         detailedQuestion?.flagStatus === undefined),
              variants: detailedQuestion?.variants || [],
              history: detailedQuestion?.history || [],
              approvedBy: detailedQuestion?.approvedBy || null,
              assignedCreator: detailedQuestion?.assignedCreator || null,
              isVariant: detailedQuestion?.isVariant || false,
            };
          }
          return question;
        } catch (error) {
          console.error(`Error fetching details for question ${question.id}:`, error);
          return question;
        }
      })
    );

    // Transform data for table
    const transformedData = questionsWithDetails.map((question) => {
      // Get creator name
      let creatorName = "Unknown";
      
      if (question.assignedCreator) {
        creatorName =
          question.assignedCreator.name ||
          question.assignedCreator.username ||
          question.assignedCreator.fullName ||
          "Unknown";
      }

      if (!creatorName || creatorName === "Unknown") {
        creatorName =
          question.lastModifiedBy?.name ||
          question.lastModifiedBy?.username ||
          question.createdBy?.name ||
          question.createdBy?.username ||
          "Unknown";
      }

      // Check for variants
      const hasVariants =
        (question.variants && question.variants.length > 0) ||
        (question.history &&
          question.history.some((h) => h.action === "variant_created"));

      // Check if flagged by creator
      const isFlagged = question.isFlagged === true;

      const hasApprovedBy = question.approvedBy;
      const wasInCreatorWorkflow =
        question.history &&
        question.history.some(
          (h) => h.status === 'pending_creator' || h.action === 'approved'
        );

      const isSubmittedByCreator =
        question.status === 'pending_processor' &&
        !isFlagged &&
        (hasApprovedBy || wasInCreatorWorkflow);

      const isCompleted = question.status === 'completed' && !isFlagged;

      // Get statuses
      const processorStatus = mapProcessorStatus(question.status);
      const isVariant = question.isVariant === true || question.isVariant === "true";

      let creatorStatus;
      if (isVariant) {
        creatorStatus = "Variant";
      } else if (hasVariants) {
        creatorStatus = "Variant Created";
      } else {
        creatorStatus = mapCreatorStatus(
          question.status,
          isFlagged,
          false,
          isSubmittedByCreator,
          isCompleted
        );
      }

      return {
        id: question.id,
        questionTitle: question.questionText || "Untitled Question",
        creator: creatorName,
        processorStatus: processorStatus,
        creatorStatus: creatorStatus,
        submittedOn: formatDate(question.updatedAt || question.createdAt),
        flagReason: question.flagReason || null,
        isVariant: isVariant,
        indicators: {
          approved:
            creatorStatus.includes("Approved") ||
            question.status === "completed" ||
            isSubmittedByCreator,
          flag: isFlagged,
          reject: question.status === "rejected",
          variant: hasVariants || isVariant,
        },
        actionType: isFlagged ? "review" : "view",
        originalData: question,
      };
    });

    // Sort: flagged questions first, then pending_processor, then by date
    transformedData.sort((a, b) => {
      // Flagged questions come first
      if (a.indicators.flag && !b.indicators.flag) return -1;
      if (!a.indicators.flag && b.indicators.flag) return 1;
      
      // Then pending_processor status
      const isAPendingProcessor = a.originalData?.status === 'pending_processor';
      const isBPendingProcessor = b.originalData?.status === 'pending_processor';
      if (isAPendingProcessor && !isBPendingProcessor) return -1;
      if (!isAPendingProcessor && isBPendingProcessor) return 1;

      // Then by date (most recent first)
      const dateA = new Date(a.originalData?.updatedAt || a.originalData?.createdAt);
      const dateB = new Date(b.originalData?.updatedAt || b.originalData?.createdAt);
      return dateB - dateA;
    });

    setSubmissions(transformedData);
    setTotalQuestions(totalCount);
  } catch (error) {
    console.error("Error fetching creator submissions:", error);
    setSubmissions([]);
    setTotalQuestions(0);
  } finally {
    setLoading(false);
  }
}, [currentPage, subtopic, search, mapProcessorStatus, mapCreatorStatus, t]);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchCreatorSubmissions();
  }, [fetchCreatorSubmissions]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, subject, subtopic]);

  // Memoize loading component for table
  const tableLoadingComponent = useMemo(
    () => (
      <Loader
        size="lg"
        color="oxford-blue"
        text="Loading..."
        className="py-10"
      />
    ),
    []
  );

  // Handler for review action
  const handleReview = useCallback(
    (item) => {
      if (item.originalData?.id) {
        navigate(
          `/processor/Processed-ViewQuestion?questionId=${item.originalData.id}&source=creator-submission`
        );
      }
    },
    [navigate]
  );

  // Handler for view action
  const handleView = useCallback(
    (item) => {
      if (item.originalData?.id) {
        navigate(
          `/processor/Processed-ViewQuestion?questionId=${item.originalData.id}&source=creator-submission`
        );
      }
    },
    [navigate]
  );

  // Handler for edit action
  const handleEdit = useCallback((item) => {
    console.log("Edit item:", item);
  }, []);

  // Handler for showing flag reason
  const handleShowFlagReason = useCallback((flagReason) => {
    setSelectedFlagReason(flagReason || "");
    setIsFlagModalOpen(true);
  }, []);

  // Handler for closing flag modal
  const handleCloseFlagModal = useCallback(() => {
    setIsFlagModalOpen(false);
    setSelectedFlagReason("");
  }, []);

  const handleCancel = useCallback(() => {
    navigate("/processor/question-bank");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[60px]">
        <header className="flex justify-between gap-4">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
              {t("processor.creatorSubmission.title")}
            </h1>
          </div>
          <OutlineButton
            text={t("processor.creatorSubmission.back")}
            className="py-[10px] px-5"
            onClick={handleCancel}
          />
        </header>

        <ProcessorFilter
          searchValue={search}
          subjectValue={subject}
          topicValue={topic}
          subtopicValue={subtopic}
          onSearchChange={setSearch}
          onSubjectChange={setSubject}
          onTopicChange={setTopic}
          onSubtopicChange={setSubtopic}
          showRole={false}
          showSubject={false}
          statusOptions={processorStatusOptions}
          searchPlaceholder={t("processor.creatorSubmission.searchPlaceholder")}
        />

        <Table
          items={submissions}
          columns={createSubmissionColumns}
          page={currentPage}
          pageSize={10}
          total={totalQuestions}
          onPageChange={setCurrentPage}
          onView={handleView}
          onEdit={handleEdit}
          onCustomAction={handleReview}
          onShowFlagReason={handleShowFlagReason}
          emptyMessage={t("processor.creatorSubmission.emptyMessage")}
          loading={loading}
          loadingComponent={tableLoadingComponent}
        />

        {/* Flag Reason Modal */}
        {isFlagModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-oxford-blue mb-2">
                {t("creator.assignedQuestionPage.flagReasonModal.title") ||
                  "Flag Reason"}
              </h2>
              <p className="text-gray-600 mb-4">
                {t("creator.assignedQuestionPage.flagReasonModal.subtitle") ||
                  "The reason why this question was flagged."}
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-oxford-blue mb-2">
                  {t(
                    "creator.assignedQuestionPage.flagReasonModal.reasonLabel"
                  ) || "Reason for Flagging"}
                </label>
                <div className="p-3 bg-gray-50 rounded border border-gray-200 min-h-[100px]">
                  <p className="text-gray-700 text-sm">
                    {selectedFlagReason ||
                      t(
                        "creator.assignedQuestionPage.flagReasonModal.noReason"
                      ) ||
                      "No reason provided"}
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <OutlineButton
                  text={
                    t("creator.assignedQuestionPage.flagReasonModal.close") ||
                    "Close"
                  }
                  onClick={handleCloseFlagModal}
                  className="py-[10px] px-5"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreaterSubmission;