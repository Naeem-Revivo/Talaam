import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import QuestionBankTabs from "../../components/admin/questionBank/QuestionBankTabs";
import QuestionBankFilters from "../../components/admin/questionBank/QuestionBankFilters";
import QuestionBankSummaryCards from "../../components/admin/questionBank/QuestionBankSummaryCards";
import QuestionBankTable from "../../components/admin/questionBank/QuestionBankTable";
import { users } from "../../assets/svg/dashboard/admin";

const pageSize = 5;

const getTabs = (t) => [
  { label: t('admin.questionBank.tabs.all'), value: "all" },
  { label: t('admin.questionBank.tabs.rawPending'), value: "rawPending" },
  { label: t('admin.questionBank.tabs.variantPending'), value: "variantPending" },
  { label: t('admin.questionBank.tabs.rejected'), value: "rejected" },
];

const mockQuestions = [
  {
    id: "q-1",
    prompt: "Which of the following is NOT a characteristic of a mammal?",
    type: "Multiple Choice",
    subject: "Biology",
    topic: "Animal Kingdom",
    level: "Analyze",
    createdBy: "Admin",
    status: "Active",
    stage: "rawPending",
    exam: "Exam",
  },
  {
    id: "q-2",
    prompt: "Explain the process of photosynthesis.",
    type: "Essay",
    subject: "Biology",
    topic: "Plant Biology",
    level: "Remember",
    createdBy: "Admin",
    status: "Active",
    stage: "rawPending",
    exam: "Exam",
  },
  {
    id: "q-3",
    prompt: "What is the capital of Japan?",
    type: "Short Answer",
    subject: "Geography",
    topic: "World Capitals",
    level: "Understand",
    createdBy: "Admin",
    status: "Pending",
    stage: "rawPending",
    exam: "Exam",
  },
  {
    id: "q-4",
    prompt: "Analyze the main causes of World War I.",
    type: "Essay",
    subject: "History",
    topic: "Animal Kingdom",
    level: "Remember",
    createdBy: "Admin",
    status: "Inactive",
    stage: "variantPending",
    exam: "Exam",
  },
  {
    id: "q-5",
    prompt: "Explain the process of photosynthesis.",
    type: "Essay",
    subject: "Biology",
    topic: "Plant Biology",
    level: "Analyze",
    createdBy: "Admin",
    status: "Active",
    stage: "all",
    exam: "Exam",
  },
  {
    id: "q-6",
    prompt: "What is the capital of Japan?",
    type: "Short Answer",
    subject: "Geography",
    topic: "World Capitals",
    level: "Remember",
    createdBy: "Admin",
    status: "Active",
    stage: "all",
    exam: "Exam",
  },
  {
    id: "q-7",
    prompt: "Analyze the main causes of World War I.",
    type: "Essay",
    subject: "History",
    topic: "Animal Kingdom",
    level: "Understand",
    createdBy: "Admin",
    status: "Active",
    stage: "rawPending",
    exam: "Exam",
  },
  {
    id: "q-8",
    prompt: "Explain the greenhouse effect and its impact on climate.",
    type: "Essay",
    subject: "Environmental Science",
    topic: "Climate Change",
    level: "Analyze",
    createdBy: "Admin",
    status: "Rejected",
    stage: "rejected",
    exam: "Exam",
  },
];

const getTabCounts = (questions, t) => {
  const tabs = getTabs(t);
  const baseCounts = {
    all: questions.length,
    rawPending: questions.filter((item) => item.stage === "rawPending").length,
    variantPending: questions.filter((item) => item.stage === "variantPending").length,
    rejected: questions.filter((item) => item.stage === "rejected").length,
  };

  return tabs.map((tab) => ({
    ...tab,
    count: baseCounts[tab.value] ?? 0,
  }));
};

const QuestionBankPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    exam: "",
    subject: "",
    topic: "",
    level: "",
    status: "",
  });
  const [page, setPage] = useState(1);

  const tabbedQuestions = useMemo(() => {
    if (activeTab === "all") {
      return mockQuestions;
    }
    return mockQuestions.filter((question) => question.stage === activeTab);
  }, [activeTab]);

  const filteredQuestions = useMemo(() => {
    return tabbedQuestions.filter((question) => {
      const matchesSearch = search
        ? question.prompt.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesExam = filters.exam ? question.exam === filters.exam : true;
      const matchesSubject = filters.subject ? question.subject === filters.subject : true;
      const matchesTopic = filters.topic ? question.topic === filters.topic : true;
      const matchesLevel = filters.level ? question.level === filters.level : true;
      const matchesStatus = filters.status ? question.status === filters.status : true;

      return (
        matchesSearch &&
        matchesExam &&
        matchesSubject &&
        matchesTopic &&
        matchesLevel &&
        matchesStatus
      );
    });
  }, [filters, search, tabbedQuestions]);

  const paginatedQuestions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, page]);

  const examOptions = useMemo(() => Array.from(new Set(mockQuestions.map((item) => item.exam))).filter(Boolean), []);
  const subjectOptions = useMemo(
    () => Array.from(new Set(mockQuestions.map((item) => item.subject))).filter(Boolean),
    []
  );
  const topicOptions = useMemo(
    () => Array.from(new Set(mockQuestions.map((item) => item.topic))).filter(Boolean),
    []
  );
  const levelOptions = useMemo(
    () => Array.from(new Set(mockQuestions.map((item) => item.level))).filter(Boolean),
    []
  );
  const statusOptions = useMemo(
    () => Array.from(new Set(mockQuestions.map((item) => item.status))).filter(Boolean),
    []
  );

  const stats = useMemo(
    () => [
      {
        label: t('admin.questionBank.stats.totalQuestions'),
        value: 8,
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
      {
        label: t('admin.questionBank.stats.pending'),
        value: 4,
        iconBg: "#E8F3FF",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="6" fill="#ED4122" />
          <path
            d="M25.49 16.8601L20.02 20L14.52 16.8601C13.58 16.3301 13 16 13 14.26V12.5C13 11.67 13.67 11 14.5 11H25.5C26.33 11 27 11.67 27 12.5V14.26C27 16 26.42 16.3301 25.49 16.8601ZM13 25.74V27.5C13 28.33 13.67 29 14.5 29H25.5C26.33 29 27 28.33 27 27.5V25.74C27 24 26.42 23.6699 25.49 23.1399L20.02 20L14.52 23.1399C13.58 23.6699 13 24 13 25.74Z"
            fill="white"
          />
        </svg>
      ),
      },
      {
        label: t('admin.questionBank.stats.approved'),
        value: 0,
        iconBg: "#E8F7F0",
      labelClassName: "text-[#ED4122]",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="6" fill="#ED4122" />
          <path
            d="M20 10C14.48 10 10 14.48 10 20C10 25.52 14.48 30 20 30C25.52 30 30 25.52 30 20C30 14.48 25.52 10 20 10ZM24.03 18.2L19.36 22.86C19.22 23.01 19.03 23.08 18.83 23.08C18.64 23.08 18.45 23.01 18.3 22.86L15.97 20.53C15.68 20.24 15.68 19.76 15.97 19.47C16.26 19.18 16.74 19.18 17.03 19.47L18.83 21.27L22.97 17.14C23.26 16.84 23.74 16.84 24.03 17.14C24.32 17.43 24.32 17.9 24.03 18.2Z"
            fill="white"
          />
        </svg>
      ),
      },
    ],
    [t]
  );

  const tabDefinitions = useMemo(() => getTabCounts(mockQuestions, t), [t]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      exam: "",
      subject: "",
      topic: "",
      level: "",
      status: "",
    });
    setSearch("");
    setPage(1);
  };

  const handleImport = () => {
    // TODO: integrate import flow
  };

  const handleExport = () => {
    // TODO: integrate export flow
  };

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 xl:px-6 2xl:px-[66px]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <h1 className="font-archivo text-[36px] font-bold leading-[40px] text-oxford-blue">
              {t('admin.questionBank.hero.title')}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-[#6B7280]">
              {t('admin.questionBank.hero.subtitle')}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/question-management")}
              className="flex h-[36px] w-[195px] items-center justify-center rounded-[8px] bg-[#ED4122] text-[16px] font-archivo font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f]"
            >
              {t('admin.questionBank.actions.questionManagement')}
            </button>
            <button
              type="button"
              className="flex gap-3 h-[36px] w-[124px] items-center justify-center rounded-[8px] bg-[#ED4122] text-[16px] font-archivo font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f]"
            >
              <img src={users} alt="Mark" />
              {t('admin.questionBank.actions.users')}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/add-question")}
              className="flex h-[36px] items-center justify-center rounded-[10px] bg-[#ED4122] px-4 text-[16px] font-archivo font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f]"
            >
              {t('admin.questionBank.actions.addNewQuestion')}
            </button>
          </div>
        </header>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <QuestionBankTabs tabs={tabDefinitions} activeTab={activeTab} onChange={handleTabChange} />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleImport}
              className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#E5E7EB] bg-white px-4 text-[16px] font-roboto font-medium leading-[16px] text-oxford-blue transition hover:bg-[#F3F4F6]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5.10357 9.25541C4.86316 9.015 4.86316 8.62523 5.10357 8.38482C5.34398 8.14441 5.73375 8.14441 5.97416 8.38482L7.38542 9.79612V0.615385C7.38542 0.275692 7.66111 0 8.0008 0C8.34049 0 8.61619 0.275692 8.61619 0.615385V9.79612L10.0274 8.38482C10.2679 8.14441 10.6576 8.14441 10.898 8.38482C11.1384 8.62523 11.1384 9.015 10.898 9.25541L8.4365 11.7169C8.37988 11.7736 8.31187 11.8187 8.23638 11.8499C8.16089 11.881 8.08121 11.8974 8.0008 11.8974C7.92039 11.8974 7.84091 11.881 7.76542 11.8499C7.68994 11.8187 7.62172 11.7736 7.5651 11.7169L5.10357 9.25541ZM12.9231 5.74359C12.5834 5.74359 12.3077 6.01928 12.3077 6.35897C12.3077 6.69867 12.5834 6.97436 12.9231 6.97436C14.217 6.97436 14.7692 7.52656 14.7692 8.82051V12.9231C14.7692 14.217 14.217 14.7692 12.9231 14.7692H3.07692C1.78297 14.7692 1.23077 14.217 1.23077 12.9231V8.82051C1.23077 7.52656 1.78297 6.97436 3.07692 6.97436C3.41662 6.97436 3.69231 6.69867 3.69231 6.35897C3.69231 6.01928 3.41662 5.74359 3.07692 5.74359C1.09292 5.74359 0 6.83651 0 8.82051V12.9231C0 14.9071 1.09292 16 3.07692 16H12.9231C14.9071 16 16 14.9071 16 12.9231V8.82051C16 6.83651 14.9071 5.74359 12.9231 5.74359Z"
                  fill="#032746"
                />
              </svg>
              {t('admin.questionBank.actions.import')}
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="flex h-[36px] items-center gap-2 rounded-[8px] border border-[#E5E7EB] bg-white px-4 text-[16px] font-roboto font-medium leading-[16px] text-oxford-blue transition hover:bg-[#F3F4F6]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5.10357 3.51181C4.86316 3.2714 4.86316 2.88163 5.10357 2.64122L7.5651 0.179682C7.62172 0.123067 7.68994 0.0779487 7.76542 0.0467692C7.91558 -0.0155898 8.08542 -0.0155898 8.23558 0.0467692C8.31106 0.0779487 8.37908 0.123067 8.4357 0.179682L10.8972 2.64122C11.1376 2.88163 11.1376 3.2714 10.8972 3.51181C10.7774 3.63161 10.6199 3.6923 10.4623 3.6923C10.3048 3.6923 10.1472 3.63243 10.0274 3.51181L8.61619 2.10051V11.2821C8.61619 11.6217 8.34049 11.8974 8.0008 11.8974C7.66111 11.8974 7.38542 11.6217 7.38542 11.2821V2.10131L5.97416 3.51262C5.73293 3.75221 5.34398 3.75223 5.10357 3.51181ZM12.9231 5.74359C12.5834 5.74359 12.3077 6.01928 12.3077 6.35897C12.3077 6.69866 12.5834 6.97436 12.9231 6.97436C14.217 6.97436 14.7692 7.52656 14.7692 8.82051V12.9231C14.7692 14.217 14.217 14.7692 12.9231 14.7692H3.07692C1.78297 14.7692 1.23077 14.217 1.23077 12.9231V8.82051C1.23077 7.52656 1.78297 6.97436 3.07692 6.97436C3.41662 6.97436 3.69231 6.69866 3.69231 6.35897C3.69231 6.01928 3.41662 5.74359 3.07692 5.74359C1.09292 5.74359 0 6.83651 0 8.82051V12.9231C0 14.9071 1.09292 16 3.07692 16H12.9231C14.9071 16 16 14.9071 16 12.9231V8.82051C16 6.83651 14.9071 5.74359 12.9231 5.74359Z"
                  fill="#032746"
                />
              </svg>
              {t('admin.questionBank.actions.export')}
            </button>
          </div>
        </div>

        <QuestionBankFilters
          searchValue={search}
          filters={filters}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          examOptions={examOptions}
          subjectOptions={subjectOptions}
          topicOptions={topicOptions}
          levelOptions={levelOptions}
          statusOptions={statusOptions}
        >
          <QuestionBankSummaryCards stats={stats} />
        </QuestionBankFilters>

        <QuestionBankTable
          questions={paginatedQuestions}
          page={page}
          pageSize={pageSize}
          total={filteredQuestions.length}
          onPageChange={setPage}
          onView={(question) => navigate(`/admin/question-details?id=${question.id}`)}
        />
      </div>
    </div>
  );
};

export default QuestionBankPage;


