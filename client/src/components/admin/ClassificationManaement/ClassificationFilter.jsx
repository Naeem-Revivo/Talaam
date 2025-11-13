import { useEffect, useRef, useState } from "react";

const subjectOptions = ["All Subjects", "Math", "Science", "History"];
const topicOptions = ["All Topics", "Algebra", "Geometry", "Biology", "Physics"];
const subtopicOptions = ["All Subtopics", "Equations", "Triangles", "Cells", "Motion"];

const Dropdown = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Automatically show default if value is empty
  const displayValue = value && value.trim() !== "" ? value : options[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full lg:w-[180px]" ref={dropdownRef}>
      {/* Label only on small screens */}
      <p className="text-sm font-medium text-[#032746] mb-3 block lg:hidden">{label}</p>

      {/* Dropdown Box */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-[48px] cursor-pointer items-center justify-between rounded-lg border border-transparent bg-white px-4 text-sm font-semibold text-[#032746] shadow-[0_8px_20px_rgba(3,39,70,0.08)]"
      >
        <span>{displayValue}</span>
        <svg
          width="15"
          height="9"
          viewBox="0 0 15 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            d="M0.6875 0.726562L7.00848 6.71211L13.3295 0.726562"
            stroke="#032746"
            strokeWidth="2"
          />
        </svg>

        {/* Dropdown Menu */}
        {isOpen && (
          <ul className="absolute left-0 top-full z-10 mt-1 w-full rounded-lg border border-gray-100 bg-white shadow-lg">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                  displayValue === option ? "font-semibold text-[#032746]" : "text-gray-700"
                }`}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const ClassificationFilter = ({
  searchValue,
  subjectValue,
  topicValue,
  subtopicValue,
  onSearchChange,
  onSubjectChange,
  onTopicChange,
  onSubtopicChange,
  searchPlaceholder = "Search...",
}) => {
  return (
    <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-5 w-full">
        {/* Subject Dropdown */}
        <Dropdown
          label="Select Subject"
          value={subjectValue}
          options={subjectOptions}
          onChange={onSubjectChange}
        />

        {/* Topic Dropdown */}
        <Dropdown
          label="Select Topic"
          value={topicValue}
          options={topicOptions}
          onChange={onTopicChange}
        />

        {/* Subtopic Dropdown */}
        <Dropdown
          label="Select Subtopic"
          value={subtopicValue}
          options={subtopicOptions}
          onChange={onSubtopicChange}
        />

        {/* Search Input */}
        <div className="w-full lg:w-[580px]">
          <p className="text-sm font-medium text-[#032746] mb-1 block lg:hidden">
            {searchPlaceholder}
          </p>

          <div className="relative flex items-center h-[48px] rounded-lg bg-white shadow-[0_8px_20px_rgba(3,39,70,0.05)] focus-within:border-[#032746] focus-within:ring-2 focus-within:ring-[#D6E3F0] border border-transparent transition-all duration-150">
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
              placeholder={searchPlaceholder}
              className="flex-1 h-full rounded-lg bg-transparent px-3 text-sm font-roboto text-[#032746] placeholder:text-[#9CA3AF] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassificationFilter;