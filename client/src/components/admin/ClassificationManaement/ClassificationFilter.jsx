import { useLanguage } from "../../../context/LanguageContext";
import Dropdown from "../../shared/Dropdown";

const getSubjectOptions = (t) => [t('admin.classificationManagement.filters.allSubjects'), "Math", "Science", "History"];
const getTopicOptions = (t) => [t('admin.classificationManagement.filters.allTopics'), "Algebra", "Geometry", "Biology", "Physics"];
const getSubtopicOptions = (t) => [t('admin.classificationManagement.filters.allSubtopics'), "Equations", "Triangles", "Cells", "Motion"];

const ClassificationFilter = ({
  searchValue,
  subjectValue,
  topicValue,
  subtopicValue,
  examValue,
  onSearchChange,
  onSubjectChange,
  onTopicChange,
  onSubtopicChange,
  onExamChange,
  activeTab,
  exams = [],
  searchPlaceholder,
}) => {
  const { t } = useLanguage();
  const placeholder = searchPlaceholder || t('admin.classificationManagement.filters.searchPlaceholder');
  const subjectOptions = getSubjectOptions(t);
  const topicOptions = getTopicOptions(t);
  const subtopicOptions = getSubtopicOptions(t);
  
  // Build exam options: "ALL" + available exams
  const examOptions = [
    { value: "ALL", label: t('admin.classificationManagement.filters.allExams') || "All Exams" },
    ...exams.map((exam) => ({
      value: exam.id,
      label: exam.name || "",
    })),
  ];

  return (
    <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
      <div className="flex flex-col lg:flex-row items-center gap-7 w-full">
        {/* Exam Dropdown - Only show for Subject tab */}
        {activeTab === "Subject" && (
          <Dropdown
            label={t('admin.classificationManagement.filters.selectExam') || "Select Exam"}
            value={examValue}
            options={examOptions}
            onChange={onExamChange}
            className="w-[180px]"
          />
        )}

        {/* Subject Dropdown */}
        {/* <Dropdown
          label={t('admin.classificationManagement.filters.selectSubject')}
          value={subjectValue}
          options={subjectOptions}
          onChange={onSubjectChange}
          className="w-[180px]"
        />

        <Dropdown
          label={t('admin.classificationManagement.filters.selectTopic')}
          value={topicValue}
          options={topicOptions}
          onChange={onTopicChange}
          className="w-[180px]"
        /> */}

        {/* Search Input */}
        <div className="w-full lg:max-w-[713px]">
          <p className="text-sm font-medium text-oxford-blue mb-1 block lg:hidden">
            {placeholder}
          </p>

          <div className="relative flex items-center h-[48px] rounded-lg bg-white shadow-filter focus-within:border-[#032746] focus-within:ring-2 focus-within:ring-[#D6E3F0] border border-transparent transition-all duration-150">
            <span className="pl-3 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.42969 0.25C14.4866 0.25024 18.6084 4.28232 18.6084 9.25C18.6084 11.3724 17.8507 13.3211 16.5938 14.8604L20.3496 18.541C20.7482 18.9316 20.7483 19.5667 20.3496 19.957C20.1511 20.1529 19.8915 20.25 19.6338 20.25C19.3755 20.2499 19.1156 20.1526 18.918 19.959L15.1562 16.2715C13.5849 17.5066 11.5952 18.2499 9.42969 18.25C4.37258 18.25 0.25 14.2178 0.25 9.25C0.25 4.28217 4.37258 0.25 9.42969 0.25ZM9.42969 2.25C5.48306 2.25 2.28027 5.39483 2.28027 9.25C2.28027 13.1052 5.48306 16.25 9.42969 16.25C13.3761 16.2498 16.5781 13.105 16.5781 9.25C16.5781 5.39497 13.3761 2.25024 9.42969 2.25Z"
                  fill="#032746"
                  stroke="#032746"
                  strokeWidth="0.5"
                />
              </svg>
            </span>

            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
              placeholder={placeholder}
              className="flex-1 h-full rounded-lg bg-transparent px-3 text-sm font-roboto text-oxford-blue placeholder:text-[#9CA3AF] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassificationFilter;