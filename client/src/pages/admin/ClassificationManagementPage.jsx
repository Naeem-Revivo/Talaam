import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClassificationFilter from "../../components/admin/ClassificationManaement/ClassificationFilter";
import ClassificationTable from "../../components/admin/ClassificationManaement/ClassificationTable";
import Tabs from "../../components/admin/ClassificationManaement/ClassificationTab";
import StatsCards from "../../components/admin/ClassificationManaement/StatsCard";
import { useAdminSubjects } from "../../context/AdminClassificationContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";
import { fetchExams, deleteExam, updateExam, clearError as clearExamError, clearSuccess as clearExamSuccess } from "../../store/slices/examsSlice";
import { fetchSubjects, deleteSubject, clearError as clearSubjectError, clearSuccess as clearSubjectSuccess } from "../../store/slices/subjectsSlice";
import { fetchTopics, deleteTopic, clearError as clearTopicError, clearSuccess as clearTopicSuccess } from "../../store/slices/topicsSlice";
import { showErrorToast, showSuccessToast } from "../../utils/toastConfig";

const getTabConfig = (subjects, topics, subtopics, exams, t) => ({
  Subject: {
    data: subjects,
    columns: [
      {
        label: t("admin.classificationManagement.table.columns.subjectName"),
        key: "name",
      },
      {
        label: t("admin.classificationManagement.table.columns.description"),
        key: "description",
      },
      {
        label: t("admin.classificationManagement.table.columns.date"),
        key: "date",
      },
      {
        label: t("admin.classificationManagement.table.columns.actions"),
        key: "actions",
      },
    ],
    addButtonText: t("admin.classificationManagement.actions.addNewSubject"),
    addRoute: "/admin/classification/add-subject",
    emptyMessage: t("admin.classificationManagement.table.emptyState.subjects"),
    heading: t("admin.classificationManagement.headings.subject"),
    subheading: t("admin.classificationManagement.subheadings.subject"),
  },
  Topics: {
    data: topics,
    columns: [
      {
        label: t("admin.classificationManagement.table.columns.topicName"),
        key: "name",
      },
      {
        label: t("admin.classificationManagement.table.columns.parentSubject"),
        key: "parentSubject",
      },
      {
        label: t("admin.classificationManagement.table.columns.description"),
        key: "description",
      },
      {
        label: t("admin.classificationManagement.table.columns.date"),
        key: "date",
      },
      {
        label: t("admin.classificationManagement.table.columns.actions"),
        key: "actions",
      },
    ],
    addButtonText: t("admin.classificationManagement.actions.addNewTopic"),
    addRoute: "/admin/classification/add-topic",
    emptyMessage: t("admin.classificationManagement.table.emptyState.topics"),
    heading: t("admin.classificationManagement.headings.topics"),
    subheading: t("admin.classificationManagement.subheadings.topics"),
  },
  Subtopics: {
    data: subtopics,
    columns: [
      {
        label: t("admin.classificationManagement.table.columns.subtopicName"),
        key: "name",
      },
      {
        label: t("admin.classificationManagement.table.columns.description"),
        key: "description",
      },
      {
        label: t("admin.classificationManagement.table.columns.date"),
        key: "date",
      },
      {
        label: t("admin.classificationManagement.table.columns.actions"),
        key: "actions",
      },
    ],
    addButtonText: t("admin.classificationManagement.actions.addNewSubtopic"),
    addRoute: "/admin/classification/add-subtopic",
    emptyMessage: t(
      "admin.classificationManagement.table.emptyState.subtopics"
    ),
    heading: t("admin.classificationManagement.headings.subtopics"),
    subheading: t("admin.classificationManagement.subheadings.subtopics"),
  },
  Exams: {
    data: exams,
    columns: [
      {
        label: t("admin.classificationManagement.table.columns.examName"),
        key: "name",
      },
      {
        label:  t("admin.classificationManagement.table.columns.description"),
        key: "description",
      },
      {
        label: t("admin.classificationManagement.table.columns.status") || "Status",
        key: "status",
      },
      {
        label: t("admin.classificationManagement.table.columns.date"),
        key: "date",
      },
      {
        label: t("admin.classificationManagement.table.columns.actions"),
        key: "actions",
      },
    ],
    addButtonText: t('admin.classificationManagement.actions.addNewExam'),
    addRoute: "/admin/classification/add-exam",
    emptyMessage: "No exams found",
    heading: "Exam",
    subheading: "Subject • Topic",
  },
});

// Helper function to format exam data for table display
const formatExamsForTable = (exams) => {
  if (!exams || !Array.isArray(exams)) return [];
  
  return exams.map((exam) => ({
    id: exam.id,
    name: exam.name || "",
    description: exam.description || "",
    status: exam.status || "active",
    date: exam.createdAt 
      ? new Date(exam.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "",
    createdAt: exam.createdAt,
  }));
};

// Helper function to format subject data for table display
const formatSubjectsForTable = (subjects) => {
  if (!subjects || !Array.isArray(subjects)) return [];
  
  return subjects.map((subject) => ({
    id: subject.id,
    name: subject.name || "",
    description: subject.description || "",
    date: subject.createdAt 
      ? new Date(subject.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "",
    createdAt: subject.createdAt,
  }));
};

// Helper function to format topic data for table display
const formatTopicsForTable = (topics) => {
  if (!topics || !Array.isArray(topics)) return [];
  
  return topics.map((topic) => ({
    id: topic.id,
    name: topic.name || "",
    description: topic.description || "",
    parentSubject: topic.parentSubject?.name || (topic.subject?.name || ""),
    date: topic.createdAt 
      ? new Date(topic.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "",
    createdAt: topic.createdAt,
  }));
};

// Main Component
const ClassificationManagement = () => {
  const { subtopics } = useAdminSubjects();
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state for exams, subjects, and topics
  const { exams: examsData, loading: examsLoading, error: examsError, success: examsSuccess } = useSelector((state) => state.exams);
  const { subjects: subjectsData, loading: subjectsLoading, error: subjectsError, success: subjectsSuccess } = useSelector((state) => state.subjects);
  const { topics: topicsData, loading: topicsLoading, error: topicsError, success: topicsSuccess } = useSelector((state) => state.topics);
  
  const [activeTab, setActiveTab] = useState("Exams");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // Format data for table display
  const exams = useMemo(() => formatExamsForTable(examsData), [examsData]);
  const subjects = useMemo(() => formatSubjectsForTable(subjectsData), [subjectsData]);
  const topics = useMemo(() => formatTopicsForTable(topicsData), [topicsData]);
  
  // Determine loading state based on active tab
  const loading = activeTab === "Exams" ? examsLoading : activeTab === "Subject" ? subjectsLoading : topicsLoading;
  
  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === "Exams") {
      dispatch(fetchExams());
    } else if (activeTab === "Subject") {
      dispatch(fetchSubjects());
    } else if (activeTab === "Topics") {
      dispatch(fetchTopics());
    }
  }, [dispatch, activeTab]);
  
  // Handle success messages
  useEffect(() => {
    if (examsSuccess) {
      showSuccessToast("Operation completed successfully");
      dispatch(clearExamSuccess());
      if (activeTab === "Exams") {
        dispatch(fetchExams());
      }
    }
    if (subjectsSuccess) {
      showSuccessToast("Operation completed successfully");
      dispatch(clearSubjectSuccess());
      if (activeTab === "Subject") {
        dispatch(fetchSubjects());
      }
    }
    if (topicsSuccess) {
      showSuccessToast("Operation completed successfully");
      dispatch(clearTopicSuccess());
      if (activeTab === "Topics") {
        dispatch(fetchTopics());
      }
    }
  }, [examsSuccess, subjectsSuccess, topicsSuccess, dispatch, activeTab]);
  
  // Handle error messages
  useEffect(() => {
    if (examsError) {
      showErrorToast(examsError);
      dispatch(clearExamError());
    }
    if (subjectsError) {
      showErrorToast(subjectsError);
      dispatch(clearSubjectError());
    }
    if (topicsError) {
      showErrorToast(topicsError);
      dispatch(clearTopicError());
    }
  }, [examsError, subjectsError, topicsError, dispatch]);

  const tabConfig = getTabConfig(subjects, topics, subtopics, exams, t);
  const currentConfig = tabConfig[activeTab];

  const pageSize = 5;

  // Filter data based on search
  const filteredData = useMemo(() => {
    return currentConfig.data.filter((item) => {
      const searchLower = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        (item.createdby &&
          item.createdby.toLowerCase().includes(searchLower)) ||
        (item.date && item.date.toLowerCase().includes(searchLower))
      );
    });
  }, [currentConfig.data, search]);

  // Paginate filtered data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page]);

  // Reset page when filters or tab change
  useEffect(() => {
    setPage(1);
  }, [search, activeTab]);

  const handleDeleteClick = (item) => {
    // Show delete modal for Exams, Subject, and Topics tabs
    if (activeTab === "Exams" || activeTab === "Subject" || activeTab === "Topics") {
      setItemToDelete(item);
      setIsModalOpen(true);
    } else {
      // For other tabs, handle differently if needed
      console.log("Delete not implemented for this tab");
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      if (activeTab === "Exams") {
        await dispatch(deleteExam(itemToDelete.id)).unwrap();
        showSuccessToast(`Exam "${itemToDelete.name}" deleted successfully`);
        dispatch(fetchExams());
      } else if (activeTab === "Subject") {
        await dispatch(deleteSubject(itemToDelete.id)).unwrap();
        showSuccessToast(`Subject "${itemToDelete.name}" deleted successfully`);
        dispatch(fetchSubjects());
      } else if (activeTab === "Topics") {
        await dispatch(deleteTopic(itemToDelete.id)).unwrap();
        showSuccessToast(`Topic "${itemToDelete.name}" deleted successfully`);
        dispatch(fetchTopics());
      }
      setIsModalOpen(false);
      setItemToDelete(null);
    } catch  {
      // Error is already handled by the error effect, but close modal
      setIsModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setItemToDelete(null);
  };

  const handleEdit = (item) => {
    // Navigate to edit page based on active tab
    if (activeTab === "Exams") {
      navigate(`/admin/classification/edit-exam/${item.id}`);
    } else if (activeTab === "Subject") {
      navigate(`/admin/classification/edit-subject/${item.id}`);
    } else if (activeTab === "Topics") {
      navigate(`/admin/classification/edit-topic/${item.id}`);
    } else {
      console.log("Edit not implemented for this tab");
    }
  };
  
  const handleView = (item) => {
    // For Exams, use view button to navigate to edit page (since we need edit functionality)
    if (activeTab === "Exams") {
      navigate(`/admin/classification/edit-exam/${item.id}`);
    } else if (activeTab === "Subject") {
      navigate(`/admin/classification/edit-subject/${item.id}`);
    } else if (activeTab === "Topics") {
      navigate(`/admin/classification/edit-topic/${item.id}`);
    } else {
      console.log("View not implemented for this tab");
    }
  };

  const handleStatusToggle = async (item) => {
    if (activeTab === "Exams" && item) {
      try {
        const newStatus = item.status === "active" ? "inactive" : "active";
        await dispatch(updateExam({ 
          examId: item.id, 
          examData: { status: newStatus } 
        })).unwrap();
        showSuccessToast(`Exam status updated to ${newStatus}`);
        // Refresh exams list
        dispatch(fetchExams());
      } catch {
        // Error is handled by the error effect
      }
    }
  };

  const handleAddNew = () => {
    navigate(currentConfig.addRoute);
    // In real app: navigate(currentConfig.addRoute);
  };

  const handleExport = () => {
    alert("Export clicked");
  };

  const statsData = [
    {
      label: t("admin.classificationManagement.stats.exam"),
      value: exams.length,
    },
    {
      label: t("admin.classificationManagement.stats.subjects"),
      value: subjects.length,
    },
    {
      label: t("admin.classificationManagement.stats.topics"),
      value: topics.length,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6 2xl:px-[66px]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue" aria-label={t("admin.classificationManagement.hero.title")}>
              {t("admin.classificationManagement.hero.title")}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t("admin.classificationManagement.hero.subtitle")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExport}
              aria-label={t("admin.classificationManagement.actions.export")}
              className="h-[36px] w-[124px] rounded-md border border-[#E5E7EB] bg-white text-[16px] font-roboto font-medium leading-[16px] text-oxford-blue transition hover:bg-[#F3F4F6] flex items-center justify-center gap-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M5.10357 3.51181C4.86316 3.2714 4.86316 2.88163 5.10357 2.64122L7.5651 0.179682C7.62172 0.123067 7.68994 0.0779487 7.76542 0.0467692C7.91558 -0.0155898 8.08542 -0.0155898 8.23558 0.0467692C8.31106 0.0779487 8.37908 0.123067 8.4357 0.179682L10.8972 2.64122C11.1376 2.88163 11.1376 3.2714 10.8972 3.51181C10.7774 3.63161 10.6199 3.6923 10.4623 3.6923C10.3048 3.6923 10.1472 3.63243 10.0274 3.51181L8.61619 2.10051V11.2821C8.61619 11.6217 8.34049 11.8974 8.0008 11.8974C7.66111 11.8974 7.38542 11.6217 7.38542 11.2821V2.10131L5.97416 3.51262C5.73293 3.75221 5.34398 3.75223 5.10357 3.51181ZM12.9231 5.74359C12.5834 5.74359 12.3077 6.01928 12.3077 6.35897C12.3077 6.69866 12.5834 6.97436 12.9231 6.97436C14.217 6.97436 14.7692 7.52656 14.7692 8.82051V12.9231C14.7692 14.217 14.217 14.7692 12.9231 14.7692H3.07692C1.78297 14.7692 1.23077 14.217 1.23077 12.9231V8.82051C1.23077 7.52656 1.78297 6.97436 3.07692 6.97436C3.41662 6.97436 3.69231 6.69866 3.69231 6.35897C3.69231 6.01928 3.41662 5.74359 3.07692 5.74359C1.09292 5.74359 0 6.83651 0 8.82051V12.9231C0 14.9071 1.09292 16 3.07692 16H12.9231C14.9071 16 16 14.9071 16 12.9231V8.82051C16 6.83651 14.9071 5.74359 12.9231 5.74359Z"
                  fill="#032746"
                />
              </svg>
              {t("admin.classificationManagement.actions.export")}
            </button>
            <button
              type="button"
              onClick={handleAddNew}
              aria-label={currentConfig.addButtonText}
              className="h-[36px] w-[180px] rounded-md bg-[#ED4122] text-[16px] font-archivo font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f]"
            >
              {currentConfig.addButtonText}
            </button>
          </div>
        </header>

        <StatsCards stats={statsData} />

        <ClassificationFilter
          searchValue={search}
          onSearchChange={setSearch}
          subjectValue={subject}
          topicValue={topic}
          subtopicValue={subtopic}
          onSubjectChange={setSubject}
          onTopicChange={setTopic}
          onSubtopicChange={setSubtopic}
        />

        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

        {loading ? (
          <div className="flex items-center justify-center py-12" role="status" aria-live="polite">
            <div className="text-oxford-blue">
              {activeTab === "Exams" && "Loading exams..."}
              {activeTab === "Subject" && "Loading subjects..."}
              {activeTab === "Topics" && "Loading topics..."}
            </div>
          </div>
        ) : (
          <ClassificationTable
            items={paginatedData}
            columns={currentConfig.columns}
            page={page}
            pageSize={pageSize}
            total={filteredData.length}
            onPageChange={setPage}
            onEdit={handleDeleteClick}
            onView={activeTab === "Exams" ? handleView : handleEdit}
            onStatusToggle={activeTab === "Exams" ? handleStatusToggle : undefined}
            emptyMessage={currentConfig.emptyMessage}
            activeTab={activeTab}
          />
        )}
      </div>

      {(activeTab === "Exams" || activeTab === "Subject" || activeTab === "Topics") && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Confirmation"
          message={`Are you sure you want to delete "${itemToDelete?.name}"?`}
          subMessage="This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default ClassificationManagement;