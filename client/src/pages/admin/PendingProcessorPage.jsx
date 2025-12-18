import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import QuestionBankFilters from "../../components/admin/questionBank/QuestionBankFilters";
import QuestionBankSummaryCards from "../../components/admin/questionBank/QuestionBankSummaryCards";
import QuestionBankTable from "../../components/admin/questionBank/QuestionBankTable";
import adminAPI from "../../api/admin";
import examsAPI from "../../api/exams";
import subjectsAPI from "../../api/subjects";
import topicsAPI from "../../api/topics";
import { showErrorToast } from "../../utils/toastConfig";

const pageSize = 5;

// Map status to display status
const mapStatusToDisplay = (status) => {
  if (!status) return "Pending";
  
  // Map pending_* statuses to "Pending"
  if (status.startsWith('pending_')) {
    return "Pending";
  }
  
  // Map completed to "Approved"
  if (status === 'completed') {
    return "Approved";
  }
  
  // Map rejected to "Rejected"
  if (status === 'rejected') {
    return "Rejected";
  }
  
  // Check for "sent back" status (usually when status contains "sent_back" or similar)
  if (status.toLowerCase().includes('sent_back') || status.toLowerCase().includes('sentback')) {
    return "Sent Back";
  }
  
  // Default to status as-is if it matches our display statuses
  const displayStatuses = ["Pending", "Approved", "Rejected", "Sent Back"];
  if (displayStatuses.includes(status)) {
    return status;
  }
  
  // Default fallback
  return "Pending";
};

const PendingProcessorPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    exam: "",
    subject: "",
    topic: "",
    status: "",
  });
  const [page, setPage] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [total, setTotal] = useState(0);
  
  // Filter options
  const [examOptions, setExamOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [topicOptions, setTopicOptions] = useState([]);
  const [statusOptions] = useState(["Pending", "Approved", "Rejected", "Sent Back"]);

  // Fetch questions from API
  useEffect(() => {
    fetchQuestions();
  }, [search, filters, page]);

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      // Fetch all exams
      const examsResponse = await examsAPI.getAllExams({ status: "active" });
      if (examsResponse.success && examsResponse.data?.exams) {
        setExamOptions(examsResponse.data.exams.map(e => ({ id: e.id, name: e.name })));
      }
      
      // Fetch all subjects (show all available subjects)
      const subjectsResponse = await subjectsAPI.getAllSubjects();
      if (subjectsResponse.success && subjectsResponse.data?.subjects) {
        setSubjectOptions(subjectsResponse.data.subjects.map(s => ({ id: s.id, name: s.name })));
      }
      
      // Fetch all topics (show all available topics)
      const topicsResponse = await topicsAPI.getAllTopics();
      if (topicsResponse.success && topicsResponse.data?.topics) {
        setTopicOptions(topicsResponse.data.topics.map(t => ({ id: t.id, name: t.name })));
      } else if (Array.isArray(topicsResponse.data)) {
        // Handle case where API returns array directly
        setTopicOptions(topicsResponse.data.map(t => ({ id: t.id || t._id, name: t.name })));
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
      showErrorToast(error.response?.data?.message || "Failed to fetch filter options");
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = {
        status: "pending_processor",
        page,
        limit: pageSize,
      };
      
      if (search && search.trim()) params.search = search.trim();
      if (filters.exam && filters.exam.trim()) params.exam = filters.exam.trim();
      if (filters.subject && filters.subject.trim()) params.subject = filters.subject.trim();
      if (filters.topic && filters.topic.trim()) params.topic = filters.topic.trim();

      const response = await adminAPI.getAllQuestions(params);
      
      if (response.success && response.data) {
        // Transform API data to match table format
        const transformed = response.data.questions?.map((q) => {
          // Get last action from history
          const lastHistory = q.history && q.history.length > 0 ? q.history[0] : null;
          let lastAction = null;
          if (lastHistory) {
            const timestamp = lastHistory.timestamp || lastHistory.createdAt;
            const dateStr = timestamp ? new Date(timestamp).toLocaleDateString('en-GB', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric' 
            }) : "N/A";
            
            // Format action: replace underscores with spaces
            let actionText = lastHistory.action || "N/A";
            if (actionText !== "N/A") {
              // Replace underscores with spaces
              actionText = actionText.replace(/_/g, ' ');
              // Check if it's a student flag action
              if (q.flagType === 'student' && (actionText.toLowerCase().includes('flag') || actionText.toLowerCase().includes('flagged'))) {
                actionText = "Flagged by student";
              }
            }
            
            lastAction = {
              action: actionText,
              by: lastHistory.performedBy?.name || lastHistory.performedBy?.fullName || "N/A",
              when: dateStr,
            };
          } else if (q.flagType === 'student' && q.isFlagged) {
            // If no history but flagged by student, show "Flagged by student"
            lastAction = {
              action: "Flagged by student",
              by: q.flaggedBy?.name || q.flaggedBy?.fullName || "Student",
              when: q.flaggedAt ? new Date(q.flaggedAt).toLocaleDateString('en-GB', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              }) : "N/A",
            };
          }

          return {
            id: q.id,
            prompt: q.question?.text || "N/A",
            type: q.question?.type === "MCQ" ? "Multiple Choice" : q.question?.type === "TRUE_FALSE" ? "True/False" : q.question?.type || "N/A",
            subject: q.subject?.name || "N/A",
            topic: q.topic?.name || "N/A",
            exam: q.stage?.name || "N/A",
            createdBy: q.createdBy?.name || "N/A",
            status: mapStatusToDisplay(q.status),
            isFlagged: q.isFlagged || false,
            flagReason: q.flagReason || null,
            flagType: q.flagType || null,
            lastAction: lastAction,
            _original: q,
          };
        }) || [];
        
        setQuestions(transformed);
        setSummary(response.data.summary || { total: 0, pending: 0, approved: 0, rejected: 0 });
        setTotal(response.data.pagination?.totalItems || 0);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      showErrorToast(error.message || "Failed to fetch questions");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(
    () => [
      {
        label: t('admin.questionBank.stats.totalQuestions'),
        value: total || 0,
        iconBg: "#FFF1E6",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="6" fill="#ED4122" />
          <path
            d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10ZM20.02 25.5C19.468 25.5 19.0149 25.052 19.0149 24.5C19.0149 23.948 19.458 23.5 20.01 23.5H20.02C20.573 23.5 21.02 23.948 21.02 24.5C21.02 25.052 20.572 25.5 20.02 25.5ZM21.603 20.5281C20.872 21.0181 20.7359 21.291 20.7109 21.363C20.6059 21.676 20.314 21.874 20 21.874C19.921 21.874 19.841 21.862 19.762 21.835C19.369 21.703 19.1581 21.278 19.2891 20.885C19.4701 20.345 19.9391 19.836 20.7671 19.281C21.7881 18.597 21.657 17.8471 21.614 17.6011C21.501 16.9471 20.95 16.3899 20.303 16.2759C19.811 16.1859 19.3301 16.3149 18.9541 16.6299C18.5761 16.9469 18.3589 17.4139 18.3589 17.9099C18.3589 18.3239 18.0229 18.6599 17.6089 18.6599C17.1949 18.6599 16.8589 18.3239 16.8589 17.9099C16.8589 16.9689 17.271 16.084 17.99 15.481C18.702 14.885 19.639 14.636 20.564 14.8C21.831 15.024 22.8701 16.071 23.0911 17.345C23.3111 18.607 22.782 19.7381 21.603 20.5281Z"
            fill="white"
          />
        </svg>
      ),
      },
    ],
    [t, total]
  );

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      
      // If value is empty, clear the filter
      if (!value || value.trim() === "") {
        newFilters[key] = "";
        // Reset dependent filters
        if (key === 'exam') {
          newFilters.subject = "";
          newFilters.topic = "";
        } else if (key === 'subject') {
          newFilters.topic = "";
        }
        return newFilters;
      }
      
      // If filtering by exam name, convert to ID
      if (key === 'exam') {
        const exam = examOptions.find(e => e.name === value);
        if (exam) {
          newFilters.exam = exam.id;
          // Reset subject and topic when exam changes
          newFilters.subject = "";
          newFilters.topic = "";
        } else {
          // If exam not found, don't update (keep current or empty)
          newFilters.exam = "";
        }
      }
      
      // If filtering by subject name, convert to ID
      else if (key === 'subject') {
        const subject = subjectOptions.find(s => s.name === value);
        if (subject) {
          newFilters.subject = subject.id;
          // Reset topic when subject changes
          newFilters.topic = "";
        } else {
          newFilters.subject = "";
        }
      }
      
      // If filtering by topic name, convert to ID
      else if (key === 'topic') {
        const topic = topicOptions.find(t => t.name === value);
        if (topic) {
          newFilters.topic = topic.id;
        } else {
          newFilters.topic = "";
        }
      }
      
      // For status, just set the value directly (it's already a display value)
      else {
        newFilters[key] = value;
      }
      
      return newFilters;
    });
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      exam: "",
      subject: "",
      topic: "",
      status: "",
    });
    setSearch("");
    setPage(1);
  };

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 2xl:px-0">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <h1 className="font-archivo text-[36px] font-bold leading-[40px] text-oxford-blue">
              {t('admin.questionBank.pendingProcessor.title')}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-[#6B7280]">
              {t('admin.questionBank.pendingProcessor.subtitle')}
            </p>
          </div>
        </header>

        <QuestionBankFilters
          searchValue={search}
          filters={{
            exam: filters.exam ? (examOptions.find(e => e.id === filters.exam)?.name || "") : "",
            subject: filters.subject ? (subjectOptions.find(s => s.id === filters.subject)?.name || "") : "",
            topic: filters.topic ? (topicOptions.find(t => t.id === filters.topic)?.name || "") : "",
            status: filters.status || "",
          }}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          examOptions={examOptions.map(e => e.name)}
          subjectOptions={subjectOptions.map(s => s.name)}
          topicOptions={topicOptions.map(t => t.name)}
          statusOptions={statusOptions}
        >
          <QuestionBankSummaryCards stats={stats} />
        </QuestionBankFilters>

        {loading ? (
          <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-8 text-center">
            <p className="text-dark-gray">{t('admin.questionBank.loading') || 'Loading questions...'}</p>
          </div>
        ) : (
          <QuestionBankTable
            questions={questions}
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onView={(question) => navigate(`/admin/question-bank/pending-processor/view?questionId=${question.id}`)}
          />
        )}
      </div>
    </div>
  );
};

export default PendingProcessorPage;

