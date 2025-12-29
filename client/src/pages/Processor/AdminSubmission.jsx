
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import { useState, useEffect, useMemo, useCallback } from "react";
import SearchFilter from "../../components/common/SearchFilter";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";
import questionsAPI from "../../api/questions";
import subjectsAPI from "../../api/subjects";
import Loader from "../../components/common/Loader";


const AdminSubmission = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [selectedFlagReason, setSelectedFlagReason] = useState("");

  // Memoize columns to prevent rerenders
  const adminColumns = useMemo(() => [
    { key: 'questionTitle', label: t("processor.adminSubmission.table.question") },
    { key: 'student', label: t("processor.adminSubmission.table.role") || "Role" },
    { key: 'processorStatus', label: t("processor.adminSubmission.table.processorStatus") || "PROCESSOR STATUS" },
    { key: 'adminStatus', label: t("processor.adminSubmission.table.adminStatus") || "ADMIN STATUS" },
    { key: 'submittedOn', label: t("processor.adminSubmission.table.submittedOn") },
    { key: 'actions', label: t("processor.adminSubmission.table.actions") }
  ], [t]);

  // Format date to "Today", "Yesterday", or formatted date
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return "Today";
    } else if (date.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  };

  // Map display status to API status
  const mapStatusToAPI = useCallback((displayStatus) => {
    if (!displayStatus || displayStatus === t("filter.status")) return null;
    const statusMap = {
      "Pending Review": "pending_processor",
      "Approved": "approved", // Use "approved" as base, will filter for all approved statuses client-side
      "Rejected": "rejected",
    };
    return statusMap[displayStatus] || null;
  }, [t]);

  // Check if a status is considered "Approved"
  const isApprovedStatus = useCallback((status) => {
    const approvedStatuses = ['pending_creator', 'pending_explainer', 'completed', 'approved', 'accepted'];
    return approvedStatuses.includes(status?.toLowerCase());
  }, []);

  // Map API status to processor status
  const mapProcessorStatus = useCallback((status) => {
    const statusMap = {
      'pending_processor': 'Pending Review',
      'pending_creator': 'Approved',
      'pending_explainer': 'Approved',
      'completed': 'Approved',
      'approved': 'Approved',
      'accepted': 'Approved',
      'rejected': 'Rejected',
      'reject': 'Rejected',
      'flagged': 'Pending Review',
      'flag': 'Pending Review'
    };
    return statusMap[status?.toLowerCase()] || 'Pending Review';
  }, []);

  // Map API status to admin status
  const mapAdminStatus = (status, isFlagged) => {
    // Priority: Flag > Other statuses
    if (isFlagged) {
      return 'Flag';
    }

    const statusMap = {
      'pending_processor': 'Pending',
      'pending_creator': 'Pending',
      'pending_explainer': 'Pending',
      'completed': 'Approved',
      'approved': 'Approved',
      'accepted': 'Approved',
      'rejected': 'Rejected',
      'reject': 'Rejected',
      'flagged': 'Flag',
      'flag': 'Flag'
    };
    return statusMap[status?.toLowerCase()] || 'Pending';
  };

  // Fetch admin submissions from API with backend pagination
  // This fetches both student-flagged questions AND superadmin-created questions
  const fetchAdminSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      
      // Map status filter to API status
      const apiStatus = mapStatusToAPI(subtopic);
      const isApprovedFilter = subtopic === "Approved";
      
      // Build base params
      const baseParams = {
        limit: 10,
      };
      
      // Add search and subject filters if provided
      if (search && search.trim()) {
        baseParams.search = search.trim();
      }
      if (subject && subject !== "All Subject" && subject !== t("filter.subject")) {
        baseParams.subject = subject;
      }
      
      let allQuestions = [];
      let totalCount = 0;
      
      // If "Approved" filter is selected, fetch ALL pages to get all approved questions
      // Then filter and paginate client-side
      if (isApprovedFilter) {
        // Fetch all pages for student-flagged questions
        const fetchLimit = 100;
        let studentPage = 1;
        let hasMoreStudentPages = true;
        
        while (hasMoreStudentPages) {
          const studentFlagParams = {
            ...baseParams,
            page: studentPage,
            limit: fetchLimit,
            flagType: 'student',
          };
          
          const studentFlagResponse = await questionsAPI.getProcessorQuestions(studentFlagParams);
          if (studentFlagResponse.success && studentFlagResponse.data) {
            const questions = studentFlagResponse.data.questions || [];
            const pagination = studentFlagResponse.data.pagination || {};
            
            // Filter for approved statuses
            const approvedQuestions = questions.filter(q => isApprovedStatus(q.status));
            allQuestions.push(...approvedQuestions);
            
            hasMoreStudentPages = pagination.hasNextPage === true && questions.length > 0;
            studentPage++;
            
            if (studentPage > 100) hasMoreStudentPages = false;
          } else {
            hasMoreStudentPages = false;
          }
        }
        
        // Fetch all pages for superadmin-created questions
        let adminPage = 1;
        let hasMoreAdminPages = true;
        
        while (hasMoreAdminPages) {
          const adminParams = {
            ...baseParams,
            page: adminPage,
            limit: fetchLimit,
            submittedBy: 'admin',
          };
          
          const adminResponse = await questionsAPI.getProcessorQuestions(adminParams);
          if (adminResponse.success && adminResponse.data) {
            const questions = adminResponse.data.questions || [];
            const pagination = adminResponse.data.pagination || {};
            
            // Filter to only include superadmin-created
            let superadminQuestions = questions.filter(q => {
              const isSuperadminCreated = q.createdBy?.role === 'superadmin' ||
                                          q.createdBy?.adminRole === 'superadmin' ||
                                          (q.history?.find(h => h.action === 'created')?.performedBy?.role === 'superadmin') ||
                                          (q.history?.find(h => h.action === 'created')?.performedBy?.adminRole === 'superadmin');
              return isSuperadminCreated;
            });
            
            // Filter for approved statuses
            superadminQuestions = superadminQuestions.filter(q => isApprovedStatus(q.status));
            allQuestions.push(...superadminQuestions);
            
            hasMoreAdminPages = pagination.hasNextPage === true && questions.length > 0;
            adminPage++;
            
            if (adminPage > 100) hasMoreAdminPages = false;
          } else {
            hasMoreAdminPages = false;
          }
        }
        
        totalCount = allQuestions.length;
      } else {
        // For other statuses, use normal backend pagination
        const params = {
          ...baseParams,
          page: currentPage,
          limit: 10,
        };
        
        if (apiStatus) {
          params.status = apiStatus;
        }
        
        // Fetch student-flagged questions
        const studentFlagParams = {
          ...params,
          flagType: 'student',
        };
        const studentFlagResponse = await questionsAPI.getProcessorQuestions(studentFlagParams);
        if (studentFlagResponse.success && studentFlagResponse.data) {
          const studentQuestions = studentFlagResponse.data.questions || [];
          allQuestions = [...allQuestions, ...studentQuestions];
          totalCount += studentFlagResponse.data.pagination?.totalItems || 0;
        }
        
        // Fetch superadmin-created questions
        const adminParams = {
          ...params,
          submittedBy: 'admin',
        };
        const adminResponse = await questionsAPI.getProcessorQuestions(adminParams);
        if (adminResponse.success && adminResponse.data) {
          const adminQuestions = adminResponse.data.questions || [];
          // Filter to only include superadmin-created (not regular admin)
          const superadminQuestions = adminQuestions.filter(q => {
            const isSuperadminCreated = q.createdBy?.role === 'superadmin' ||
                                        q.createdBy?.adminRole === 'superadmin' ||
                                        (q.history?.find(h => h.action === 'created')?.performedBy?.role === 'superadmin') ||
                                        (q.history?.find(h => h.action === 'created')?.performedBy?.adminRole === 'superadmin');
            return isSuperadminCreated;
          });
          allQuestions = [...allQuestions, ...superadminQuestions];
          totalCount += adminResponse.data.pagination?.totalItems || 0;
        }
      }
      
      // Remove duplicates based on question ID
      const uniqueQuestions = [];
      const seenIds = new Set();
      allQuestions.forEach(q => {
        if (!seenIds.has(q.id)) {
          seenIds.add(q.id);
          uniqueQuestions.push(q);
        }
      });
      allQuestions = uniqueQuestions;
          
        // Fetch individual question details to get full information (flag reason, etc.)
        const questionsWithDetails = await Promise.all(
          allQuestions.map(async (question) => {
            try {
              const detailResponse = await questionsAPI.getProcessorQuestionById(question.id);
              if (detailResponse.success && detailResponse.data) {
                const detailedQuestion = detailResponse.data.question;
                return {
                  ...question,
                  ...detailedQuestion, // Merge detailed question data
                  flagReason: detailedQuestion?.flagReason || question.flagReason || null,
                  flagStatus: detailedQuestion?.flagStatus || question.flagStatus || null,
                  flagType: detailedQuestion?.flagType || question.flagType || null,
                  // For admin submission page, show ALL student-flagged questions regardless of flagStatus
                  // This allows viewing all student flags (pending, approved, rejected)
                  isFlagged: (detailedQuestion?.isFlagged === true || detailedQuestion?.isFlagged === 'true') &&
                            (detailedQuestion?.flagType === 'student'),
                  history: detailedQuestion?.history || question.history || []
                };
              }
              return question;
            } catch (error) {
              console.error(`Error fetching details for question ${question.id}:`, error);
              return question;
            }
          })
        );

        // Filter to show ONLY:
        // 1. Questions flagged by students AND approved by admin (flagStatus === 'approved')
        // 2. Questions created by superadmin ONLY (not regular admin)
        const filteredQuestions = questionsWithDetails.filter((question) => {
          // Check if student-flagged AND approved by admin
          const isStudentFlaggedAndApproved = question.flagType === 'student' && 
                                              question.flagStatus === 'approved';
          
          // Check if created by superadmin ONLY (not regular admin)
          const isSuperadminCreated = question.createdBy?.role === 'superadmin' ||
                                      question.createdBy?.adminRole === 'superadmin' ||
                                      (question.history?.find(h => h.action === 'created')?.performedBy?.role === 'superadmin') ||
                                      (question.history?.find(h => h.action === 'created')?.performedBy?.adminRole === 'superadmin');
          
          return isStudentFlaggedAndApproved || isSuperadminCreated;
        });

        // Transform API data to match table structure
        const transformedData = filteredQuestions.map((question) => {
          // Check if question is created by superadmin ONLY (not regular admin)
          const isSuperadminCreated = question.createdBy?.role === 'superadmin' ||
                                      question.createdBy?.adminRole === 'superadmin' ||
                                      (question.history?.find(h => h.action === 'created')?.performedBy?.role === 'superadmin') ||
                                      (question.history?.find(h => h.action === 'created')?.performedBy?.adminRole === 'superadmin');
          
          // Get name: superadmin name for superadmin-created questions, student name for student-flagged questions
          const studentName = isSuperadminCreated
            ? (question.createdBy?.name || question.createdBy?.fullName || 'Superadmin')
            : (question.flaggedBy?.name || 
                             question.flaggedBy?.fullName ||
                             question.lastModifiedBy?.name || 
                             question.lastModifiedBy?.fullName ||
               'Unknown');

          // Check if question is flagged by student
          // For admin submission page, show ALL student-flagged questions regardless of flagStatus
          // This allows viewing all student flags (pending, approved, rejected)
          const isFlagged = (question.isFlagged === true || question.isFlagged === 'true') &&
                           (question.flagType === 'student');

          // Get processor status
          const processorStatus = mapProcessorStatus(question.status);

          // Get admin status with proper mapping
          // For admin submission page, always show "Flagged" for student-flagged questions
          // For admin-created questions, show the actual status
          const adminStatus = isFlagged ? 'Flagged' : mapAdminStatus(question.status, false);

          // Get flag reason (only for student-flagged questions)
          const flagReason = question.flagReason || null;

          return {
            id: question.id,
            questionTitle: question.questionText || 'Untitled Question',
            student: studentName,
            processorStatus: processorStatus,
            adminStatus: adminStatus,
            submittedOn: formatDate(question.updatedAt || question.createdAt),
            flagReason: flagReason,
            isSuperadminCreated: isSuperadminCreated, // Track if this is superadmin-created
            indicators: {
              approved: adminStatus === 'Approved' || question.status === 'completed',
              flag: isFlagged,
              reject: question.status === 'rejected'
            },
            actionType: 'review',
            originalData: question // Store original data for navigation
          };
        });

        // Sort: pending_processor questions first (newest first), then others (newest first)
        transformedData.sort((a, b) => {
          const isAPendingProcessor = a.originalData?.status === 'pending_processor';
          const isBPendingProcessor = b.originalData?.status === 'pending_processor';
          
          // If one is pending_processor and the other isn't, pending_processor comes first
          if (isAPendingProcessor && !isBPendingProcessor) return -1;
          if (!isAPendingProcessor && isBPendingProcessor) return 1;
          
          // Both have same priority, sort by date (most recent first)
          const dateA = new Date(a.originalData?.updatedAt || a.originalData?.createdAt);
          const dateB = new Date(b.originalData?.updatedAt || b.originalData?.createdAt);
          return dateB - dateA;
        });

        // For "Approved" filter, filter by approved statuses
        // Use isApprovedStatus to check the actual question status, not just adminStatus mapping
        let finalTransformedData = transformedData;
        if (isApprovedFilter) {
          finalTransformedData = transformedData.filter(item => {
            const questionStatus = item.originalData?.status;
            // Check if the question has an approved status (including pending_creator, pending_explainer, etc.)
            return isApprovedStatus(questionStatus);
          });
        }
        
        // For "Approved" filter, apply client-side pagination
        let paginatedData = finalTransformedData;
        if (isApprovedFilter) {
          const startIndex = (currentPage - 1) * 10;
          const endIndex = startIndex + 10;
          paginatedData = finalTransformedData.slice(startIndex, endIndex);
          // Use the filtered count for total
          totalCount = finalTransformedData.length;
        }
        
        setSubmissions(paginatedData);
        setTotalQuestions(totalCount);
      } catch (error) {
        console.error('Error fetching admin submissions:', error);
        setSubmissions([]);
        setTotalQuestions(0);
      } finally {
        setLoading(false);
      }
  }, [currentPage, subtopic, search, subject, mapStatusToAPI, mapProcessorStatus, isApprovedStatus, t]);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchAdminSubmissions();
  }, [fetchAdminSubmissions]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, subject, subtopic]);

  // Fetch subjects for filter
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await subjectsAPI.getAllSubjects();
        let subjectsList = [];
        
        if (response.success) {
          if (response.data?.subjects && Array.isArray(response.data.subjects)) {
            subjectsList = response.data.subjects;
          } else if (Array.isArray(response.data)) {
            subjectsList = response.data;
          }
        }
        
        setSubjects(subjectsList);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, []);

  // Memoize status options
  const subtopicOptions = useMemo(() => ["All Status", "Pending Review", "Approved", "Rejected"], []);

  // Get subject options from API
  const subjectOptions = useMemo(() => {
    return ["All Subject", ...subjects.map(s => s.name || s)];
  }, [subjects]);

  // Memoize loading component for table
  const tableLoadingComponent = useMemo(() => (
    <Loader 
      size="lg" 
      color="oxford-blue" 
      text="Loading..."
      className="py-10"
    />
  ), []);

  // Handler for review action
  const handleReview = useCallback((item) => {
    if (item.originalData?.id) {
      navigate(`/processor/Processed-ViewQuestion?questionId=${item.originalData.id}&source=admin-submission`);
    }
  }, [navigate]);

  // Handler for view action
  const handleView = useCallback((item) => {
    if (item.originalData?.id) {
      navigate(`/processor/Processed-ViewQuestion?questionId=${item.originalData.id}&source=admin-submission`);
    }
  }, [navigate]);

  // Handler for edit action
  const handleEdit = useCallback((item) => {
    console.log('Edit item:', item);
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
              {t("processor.adminSubmission.title")}
            </h1>
          </div>
            <OutlineButton text={t("processor.adminSubmission.back")} className="py-[10px] px-5" onClick={handleCancel}/>
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
          subjectLabel="All Subject"
          subtopicLabel="All Status"
          searchPlaceholder={t("processor.adminSubmission.searchPlaceholder")}
        />

        <Table
          items={submissions}
          columns={adminColumns}
          page={currentPage}
          pageSize={10}
          total={totalQuestions}
          onPageChange={setCurrentPage}
          onView={handleView}
          onEdit={handleEdit}
          onCustomAction={handleReview}
          onShowFlagReason={handleShowFlagReason}
          emptyMessage={t("processor.adminSubmission.emptyMessage")}
          loading={loading}
          loadingComponent={tableLoadingComponent}
        />

      {/* Flag Reason Modal */}
      {isFlagModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-oxford-blue mb-2">
              {t("processor.adminSubmission.flagReasonModal.title") || "Flag Reason"}
            </h2>
            <p className="text-gray-600 mb-4">
              {t("processor.adminSubmission.flagReasonModal.subtitle") || "The reason why this question was flagged by the student."}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-oxford-blue mb-2">
                {t("processor.adminSubmission.flagReasonModal.reasonLabel") || "Reason for Flagging"}
              </label>
              <div className="p-3 bg-gray-50 rounded border border-gray-200 min-h-[100px]">
                <p className="text-gray-700 text-sm">
                  {selectedFlagReason || t("processor.adminSubmission.flagReasonModal.noReason") || "No reason provided"}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <OutlineButton
                text={t("processor.adminSubmission.flagReasonModal.close") || "Close"}
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

export default AdminSubmission;

