import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import questionsAPI from "../../api/questions";
import examsAPI from "../../api/exams";
import subjectsAPI from "../../api/subjects";
import topicsAPI from "../../api/topics";
import usersAPI from "../../api/users";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig";

const Dropdown = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Automatically show default if value is empty
  const displayValue = value && value.trim() !== "" ? value : (options && options.length > 0 ? options[0] : "Select...");

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
    <div className="w-full" ref={dropdownRef}>
      {/* Label only on small screens */}
      <p className="text-[16px] leading-[100%] font-semibold text-oxford-blue mb-3 block lg:hidden">{label}</p>

      {/* Dropdown Box */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-[50px] cursor-pointer items-center justify-between rounded-lg bg-white px-4 text-[16px] leading-[100%] font-normal text-oxford-blue border border-[#03274633]"
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
                  displayValue === option ? "font-semibold text-oxford-blue" : "text-gray-700"
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

const GathererAddNewQuestionPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("Multiple Choice (MCQ)");
  const [options, setOptions] = useState({ A: "", B: "", C: "", D: "" });
  const [correctAnswer, setCorrectAnswer] = useState("Option A");
  const [source, setSource] = useState("");
  const [explanation, setExplanation] = useState("");

  // Classification state - storing IDs and names
  const [examId, setExamId] = useState("");
  const [examName, setExamName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [topicId, setTopicId] = useState("");
  const [topicName, setTopicName] = useState("");

  // Processor assignment
  const [processorId, setProcessorId] = useState("");
  const [processorName, setProcessorName] = useState("");
  const [processors, setProcessors] = useState([]);
  const [loadingProcessors, setLoadingProcessors] = useState(false);

  // Classification data lists
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);

  // Loading states
  const [loadingExams, setLoadingExams] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleOptionChange = (option, value) => {
    setOptions((prev) => ({ ...prev, [option]: value }));
  };

  // Fetch exams on component mount
  useEffect(() => {
    const fetchExams = async () => {
      setLoadingExams(true);
      try {
        const response = await examsAPI.getAllExams({ status: "active" });
        if (response.success && response.data?.exams) {
          setExams(response.data.exams);
        }
      } catch (error) {
        showErrorToast(
          error.message || "Failed to load exams",
          { title: "Error" }
        );
      } finally {
        setLoadingExams(false);
      }
    };
    fetchExams();
  }, []);

  // Fetch subjects when exam changes
  useEffect(() => {
    if (!examId) {
      setSubjects([]);
      setSubjectId("");
      setSubjectName("");
      setTopics([]);
      setTopicId("");
      setTopicName("");
      return;
    }

    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      try {
        const response = await subjectsAPI.getAllSubjects();
        if (response.success && response.data?.subjects) {
          // Filter subjects by exam if needed, or use all subjects
          setSubjects(response.data.subjects);
        }
      } catch (error) {
        showErrorToast(
          error.message || "Failed to load subjects",
          { title: "Error" }
        );
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, [examId]);

  // Fetch topics when subject changes
  useEffect(() => {
    if (!subjectId) {
      setTopics([]);
      setTopicId("");
      setTopicName("");
      return;
    }

    const fetchTopics = async () => {
      setLoadingTopics(true);
      try {
        const response = await questionsAPI.getTopicsBySubject(subjectId);
        if (response.success && response.data?.topics) {
          setTopics(response.data.topics);
        }
      } catch (error) {
        showErrorToast(
          error.message || "Failed to load topics",
          { title: "Error" }
        );
      } finally {
        setLoadingTopics(false);
      }
    };
    fetchTopics();
  }, [subjectId]);

  // Fetch processors on component mount
  useEffect(() => {
    const fetchProcessors = async () => {
      setLoadingProcessors(true);
      try {
        const response = await usersAPI.getAllUsers({ 
          adminRole: 'processor',
          status: 'active',
          limit: 100 
        });
        if (response.success && response.data?.users) {
          const loadedProcessors = response.data.users;
          setProcessors(loadedProcessors);
          console.log('Processors loaded:', loadedProcessors);
          
          // Auto-select first processor if available
          if (loadedProcessors.length > 0 && !processorId) {
            const firstProcessor = loadedProcessors[0];
            const displayName = firstProcessor.name || firstProcessor.fullName || firstProcessor.username || "Unnamed Processor";
            setProcessorId(firstProcessor.id);
            setProcessorName(displayName);
            console.log('Auto-selected first processor:', { id: firstProcessor.id, name: displayName });
          }
        } else if (response.success && response.data?.admins) {
          // Fallback to admins if users is not available
          const loadedProcessors = response.data.admins;
          setProcessors(loadedProcessors);
          console.log('Processors loaded (from admins):', loadedProcessors);
          
          // Auto-select first processor if available
          if (loadedProcessors.length > 0 && !processorId) {
            const firstProcessor = loadedProcessors[0];
            const displayName = firstProcessor.username || firstProcessor.name || firstProcessor.fullName || "Unnamed Processor";
            setProcessorId(firstProcessor.id);
            setProcessorName(displayName);
            console.log('Auto-selected first processor:', { id: firstProcessor.id, name: displayName });
          }
        }
      } catch (error) {
        showErrorToast(
          error.message || "Failed to load processors",
          { title: "Error" }
        );
      } finally {
        setLoadingProcessors(false);
      }
    };
    fetchProcessors();
  }, []);

  // Handle exam selection
  const handleExamChange = (selectedExamName) => {
    const selectedExam = exams.find((e) => e.name === selectedExamName);
    if (selectedExam) {
      setExamId(selectedExam.id);
      setExamName(selectedExamName);
    } else {
      setExamId("");
      setExamName(selectedExamName);
    }
    // Reset subject and topic
    setSubjectId("");
    setSubjectName("");
    setTopicId("");
    setTopicName("");
  };

  // Handle subject selection
  const handleSubjectChange = (selectedSubjectName) => {
    const selectedSubject = subjects.find((s) => s.name === selectedSubjectName);
    if (selectedSubject) {
      setSubjectId(selectedSubject.id);
      setSubjectName(selectedSubjectName);
    } else {
      setSubjectId("");
      setSubjectName(selectedSubjectName);
    }
    // Reset topic
    setTopicId("");
    setTopicName("");
  };

  // Handle topic selection
  const handleTopicChange = (selectedTopicName) => {
    const selectedTopic = topics.find((t) => t.name === selectedTopicName);
    if (selectedTopic) {
      setTopicId(selectedTopic.id);
      setTopicName(selectedTopicName);
    } else {
      setTopicId("");
      setTopicName(selectedTopicName);
    }
  };

  // Handle processor selection
  const handleProcessorChange = (selectedProcessorName) => {
    // Find processor by matching name, fullName, or username
    const selectedProcessor = processors.find((p) => {
      const pName = p.name || p.fullName || p.username || "";
      const normalizedSelected = selectedProcessorName.trim();
      const normalizedPName = pName.trim();
      return normalizedPName === normalizedSelected;
    });
    
    if (selectedProcessor && selectedProcessor.id) {
      setProcessorId(selectedProcessor.id);
      setProcessorName(selectedProcessorName);
      console.log('Processor selected:', { 
        id: selectedProcessor.id, 
        name: selectedProcessorName,
        processor: selectedProcessor 
      });
    } else {
      console.warn('Processor not found for:', selectedProcessorName);
      console.warn('Available processors:', processors.map(p => ({
        id: p.id,
        name: p.name,
        fullName: p.fullName,
        username: p.username
      })));
      setProcessorId("");
      setProcessorName(selectedProcessorName);
    }
  };

  const _handleSaveDraft = () => {
    // TODO: Implement save draft functionality
    console.log("Save draft");
  };

  const handleSubmit = async () => {
    // Validation
    if (!questionText.trim()) {
      showErrorToast("Question text is required", { title: "Validation Error" });
      return;
    }

    if (!examId) {
      showErrorToast("Please select an exam", { title: "Validation Error" });
      return;
    }

    if (!subjectId) {
      showErrorToast("Please select a subject", { title: "Validation Error" });
      return;
    }

    if (!topicId) {
      showErrorToast("Please select a topic", { title: "Validation Error" });
      return;
    }

    if (!processorId) {
      showErrorToast("Please select a processor", { title: "Validation Error" });
      return;
    }

    // Validate MCQ fields
    if (questionType === "Multiple Choice (MCQ)") {
      if (!options.A.trim() || !options.B.trim() || !options.C.trim() || !options.D.trim()) {
        showErrorToast("All options are required", { title: "Validation Error" });
        return;
      }
      if (!correctAnswer) {
        showErrorToast("Please select a correct answer", { title: "Validation Error" });
        return;
      }
    }

    setSubmitting(true);
    try {
      // Map question type from display name to API value
      const questionTypeMap = {
        "Multiple Choice (MCQ)": "MCQ",
        "True/False": "TRUE_FALSE",
        "Short Answer": "SHORT_ANSWER",
        "Essay": "ESSAY",
      };
      const apiQuestionType = questionTypeMap[questionType] || "MCQ";

      // Map correct answer from "Option A" to "A"
      const correctAnswerLetter = correctAnswer.replace("Option ", "");

      // Prepare question data
      const questionData = {
        exam: examId,
        subject: subjectId,
        topic: topicId,
        questionText: questionText.trim(),
        questionType: apiQuestionType,
        explanation: explanation?.trim() || "",
      };

      // Add processor assignment (required)
      console.log('Before submission - processorId:', processorId, 'processorName:', processorName);
      if (!processorId || processorId.trim() === "") {
        showErrorToast("Please select a processor", { title: "Validation Error" });
        setSubmitting(false);
        return;
      }
      questionData.assignedProcessor = processorId;
      console.log('Question data with processor:', questionData);

      // Add MCQ-specific fields
      if (apiQuestionType === "MCQ") {
        questionData.options = {
          A: options.A.trim(),
          B: options.B.trim(),
          C: options.C.trim(),
          D: options.D.trim(),
        };
        questionData.correctAnswer = correctAnswerLetter;
      }

      // Call the API
      const response = await questionsAPI.createQuestion(questionData);

      if (response.success) {
        showSuccessToast(
          response.message || "Question created successfully",
          { title: "Success" }
        );
        // Navigate to question bank after successful creation
        setTimeout(() => {
          navigate("/gatherer/question-bank");
        }, 1500);
      } else {
        showErrorToast(
          response.message || "Failed to create question",
          { title: "Error" }
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create question";
      showErrorToast(errorMessage, { title: "Error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/gatherer/question-bank");
  };

  const _handleSaveQuestion = () => {
    // TODO: Implement save question functionality
    console.log("Save question");
    // Navigate to question details page after saving
    navigate("/admin/question-details");
  };

  // Rich Text Editor Component using contentEditable (React 19 compatible)
  const RichTextEditor = ({
    value,
    onChange,
    placeholder,
    minHeight = "200px",
  }) => {
    const editorRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const lastSyncedValueRef = useRef(value);

    // Initialize editor content on mount
    useEffect(() => {
      if (editorRef.current && value && !editorRef.current.innerHTML) {
        editorRef.current.innerHTML = value;
        lastSyncedValueRef.current = value;
      }
    }, []);

    // Only sync when value changes externally AND editor is not focused
    // This prevents interference while user is typing
    useEffect(() => {
      if (editorRef.current && !isFocused) {
        const currentContent = editorRef.current.innerHTML || '';
        const newValue = value || '';
        
        // Only update if the value prop is different from what we last synced
        // This means it changed externally, not from user input
        if (lastSyncedValueRef.current !== newValue && currentContent !== newValue) {
          editorRef.current.innerHTML = newValue;
          lastSyncedValueRef.current = newValue;
        }
      }
    }, [value, isFocused]);

    const handleInput = (e) => {
      const html = e.target.innerHTML;
      // Update the last synced value to match what user typed
      lastSyncedValueRef.current = html;
      // Call onChange to update parent state
      onChange(html);
    };

    const handleCommand = (command, value = null) => {
      document.execCommand(command, false, value);
      editorRef.current?.focus();
    };

    const handleInsertHTML = (html) => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const div = document.createElement("div");
        div.innerHTML = html;
        const fragment = document.createDocumentFragment();
        while (div.firstChild) {
          fragment.appendChild(div.firstChild);
        }
        range.insertNode(fragment);
      }
      editorRef.current?.focus();
    };

    const handleLink = () => {
      const url = prompt("Enter URL:");
      if (url) {
        handleCommand("createLink", url);
      }
    };

    const handleImage = () => {
      const url = prompt("Enter image URL:");
      if (url) {
        handleCommand("insertImage", url);
      }
    };

    return (
      <div className="rounded-[8px] w-full h-auto lg:h-[208px] min-h-[150px] border border-[#CDD4DA] bg-white overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center flex-wrap gap-2 border-b  border-[#CDD4DA] bg-[#F6F7F8] py-3 px-2 rounded-t-[8px]">
          {/* Text Formatting */}
          <button
            type="button"
            onClick={() => handleCommand("bold")}
            className="p-0 hover:opacity-80 transition"
            title="Bold"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="28" height="28" rx="4" fill="#E5E7EB" />
              <path
                d="M12 9H15.5C16.1962 9 16.8639 9.27656 17.3562 9.76884C17.8484 10.2611 18.125 10.9288 18.125 11.625C18.125 12.3212 17.8484 12.9889 17.3562 13.4812C16.8639 13.9734 16.1962 14.25 15.5 14.25H12V9Z"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 14.25H16.375C17.0712 14.25 17.7389 14.5266 18.2312 15.0188C18.7234 15.5111 19 16.1788 19 16.875C19 17.5712 18.7234 18.2389 18.2312 18.7312C17.7389 19.2234 17.0712 19.5 16.375 19.5H12V14.25Z"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("italic")}
            className="p-0 hover:opacity-80 transition"
            title="Italic"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="28" height="28" rx="4" fill="#E5E7EB" />
              <path
                d="M15.1663 9.33203L12.833 18.6654"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("underline")}
            className="p-0 hover:opacity-80 transition"
            title="Underline"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="28" height="28" rx="4" fill="#E5E7EB" />
              <path
                d="M11 8.66797V13.3346C11 14.2187 11.3512 15.0665 11.9763 15.6917C12.6014 16.3168 13.4493 16.668 14.3333 16.668C15.2174 16.668 16.0652 16.3168 16.6904 15.6917C17.3155 15.0665 17.6667 14.2187 17.6667 13.3346V8.66797"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 19.332H19.6667"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("strikeThrough")}
            className="p-0 hover:opacity-80 transition"
            title="Strikethrough"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="28" height="28" rx="4" fill="#E5E7EB" />
              <path
                d="M12.833 10H14.833C15.2308 10 15.6124 10.2107 15.8937 10.5858C16.175 10.9609 16.333 11.4696 16.333 12C16.333 12.5304 16.175 13.0391 15.8937 13.4142C15.6124 13.7893 15.2308 14 14.833 14H12.833C12.4352 14 12.0537 14.2107 11.7723 14.5858C11.491 14.9609 11.333 15.4696 11.333 16C11.333 16.5304 11.491 17.0391 11.7723 17.4142C12.0537 17.7893 12.4352 18 12.833 18H15.833"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 14H19.6667"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="w-px h-6 bg-[#E5E7EB]"></div>
          <button
            type="button"
            onClick={() => handleCommand("formatBlock", "<code>")}
            className="p-0 hover:opacity-80 transition"
            title="Code"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z"
                fill="#E5E7EB"
              />
              <path
                d="M10.667 10V18"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.333 10V18"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.333 14H17.333"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("formatBlock", "<h1>")}
            className="p-0 hover:opacity-80 transition"
            title="Heading"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z"
                fill="#E5E7EB"
              />
              <path
                d="M10.25 9.25H13.25V13.75H10.25V9.25Z"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.75 9.25H18.75V13.75H15.75V9.25Z"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 19L19 19"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="w-px h-6 bg-[#E5E7EB]"></div>
          {/* Lists */}
          <button
            type="button"
            onClick={() => handleCommand("insertUnorderedList")}
            className="p-0 hover:opacity-80 transition"
            title="Bullet List"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z"
                fill="#E5E7EB"
              />
              <path
                d="M11 9.5H20"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11 14H20"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11 18.5H20"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.62461 10.4016C8.12167 10.4016 8.52461 9.99862 8.52461 9.50156C8.52461 9.00451 8.12167 8.60156 7.62461 8.60156C7.12755 8.60156 6.72461 9.00451 6.72461 9.50156C6.72461 9.99862 7.12755 10.4016 7.62461 10.4016Z"
                stroke="#6B7280"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.62461 14.9016C8.12167 14.9016 8.52461 14.4986 8.52461 14.0016C8.52461 13.5045 8.12167 13.1016 7.62461 13.1016C7.12755 13.1016 6.72461 13.5045 6.72461 14.0016C6.72461 14.4986 7.12755 14.9016 7.62461 14.9016Z"
                stroke="#6B7280"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.62461 19.4016C8.12167 19.4016 8.52461 18.9986 8.52461 18.5016C8.52461 18.0045 8.12167 17.6016 7.62461 17.6016C7.12755 17.6016 6.72461 18.0045 6.72461 18.5016C6.72461 18.9986 7.12755 19.4016 7.62461 19.4016Z"
                stroke="#6B7280"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("insertOrderedList")}
            className="p-0 hover:opacity-80 transition"
            title="Numbered List"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z"
                fill="#E5E7EB"
              />
              <path
                d="M8.66699 10H16.667"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.66699 12.668H20.667"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.66699 15.332H16.667"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.66699 18H20.667"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="w-px h-6 bg-[#E5E7EB]"></div>
          {/* Alignment */}
          <button
            type="button"
            onClick={() => handleCommand("justifyLeft")}
            className="p-0 hover:opacity-80 transition"
            title="Align Left"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z"
                fill="#E5E7EB"
              />
              <path
                d="M10.333 10H18.333"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 12.668H19.6667"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.333 15.332H18.333"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 18H19.6667"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("justifyCenter")}
            className="p-0 hover:opacity-80 transition"
            title="Align Center"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z"
                fill="#E5E7EB"
              />
              <path
                d="M19.333 10H11.333"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.333 12.668H7.33301"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.333 15.332H11.333"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.333 18H7.33301"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("justifyRight")}
            className="p-0 hover:opacity-80 transition"
            title="Align Right"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 4C0 1.79086 1.79086 0 4 0H24C26.2091 0 28 1.79086 28 4V24C28 26.2091 26.2091 28 24 28H4C1.79086 28 0 26.2091 0 24V4Z"
                fill="#E5E7EB"
              />
              <path
                d="M19.333 10H11.333"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.333 12.668H7.33301"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.333 15.332H11.333"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.333 18H7.33301"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="w-px h-6 bg-[#E5E7EB]"></div>
          {/* Media/Links */}
          <button
            type="button"
            onClick={handleLink}
            className="p-0 hover:opacity-80 transition"
            title="Link"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z"
                fill="#E5E7EB"
              />
              <path
                d="M12.6667 15.3346C12.056 14.7115 11.7139 13.8738 11.7139 13.0013C11.7139 12.1288 12.056 11.2911 12.6667 10.668L14.0001 9.33464C14.642 8.85321 15.436 8.61948 16.2364 8.67636C17.0367 8.73324 17.7897 9.07691 18.3571 9.64428C18.9245 10.2117 19.2681 10.9646 19.325 11.765C19.3819 12.5654 19.1482 13.3594 18.6667 14.0013L18.0001 14.668"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.3337 12.668C15.9444 13.2911 16.2865 14.1288 16.2865 15.0013C16.2865 15.8738 15.9444 16.7115 15.3337 17.3346L14.0003 18.668C13.3584 19.1494 12.5644 19.3831 11.764 19.3262C10.9637 19.2694 10.2107 18.9257 9.64331 18.3583C9.07594 17.791 8.73226 17.038 8.67538 16.2376C8.6185 15.4372 8.85223 14.6432 9.33366 14.0013L10.0003 13.3346"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleImage}
            className="p-0 hover:opacity-80 transition"
            title="Image"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z"
                fill="#E5E7EB"
              />
              <path
                d="M18.6667 9.33203H9.33333C8.59695 9.33203 8 9.92898 8 10.6654V17.332C8 18.0684 8.59695 18.6654 9.33333 18.6654H18.6667C19.403 18.6654 20 18.0684 20 17.332V10.6654C20 9.92898 19.403 9.33203 18.6667 9.33203Z"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.333 14.6667L12.6663 16L14.6663 14L17.9997 17.3333"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.9997 12.3333C11.3679 12.3333 11.6663 12.0349 11.6663 11.6667C11.6663 11.2985 11.3679 11 10.9997 11C10.6315 11 10.333 11.2985 10.333 11.6667C10.333 12.0349 10.6315 12.3333 10.9997 12.3333Z"
                stroke="#6B7280"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => {
              const rows = prompt("Enter number of rows:");
              const cols = prompt("Enter number of columns:");
              if (rows && cols) {
                let tableHTML =
                  "<table border='1' style='border-collapse: collapse;'>";
                for (let i = 0; i < parseInt(rows); i++) {
                  tableHTML += "<tr>";
                  for (let j = 0; j < parseInt(cols); j++) {
                    tableHTML += "<td style='padding: 4px;'>&nbsp;</td>";
                  }
                  tableHTML += "</tr>";
                }
                tableHTML += "</table>";
                handleInsertHTML(tableHTML);
              }
            }}
            className="p-0 hover:opacity-80 transition"
            title="Table"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="28" height="28" rx="4" fill="#E5E7EB" />
              <path
                d="M18.1485 9.25781H9.85218C9.19762 9.25781 8.66699 9.78844 8.66699 10.443V17.5541C8.66699 18.2087 9.19762 18.7393 9.85218 18.7393H18.1485C18.803 18.7393 19.3337 18.2087 19.3337 17.5541V10.443C19.3337 9.78844 18.803 9.25781 18.1485 9.25781Z"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.66699 12.668H19.3337"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 9V18"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 9V18"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("formatBlock", "<pre>")}
            className="p-0 hover:opacity-80 transition"
            title="Code"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="28" height="28" rx="4" fill="#E5E7EB" />
              <path
                d="M13.6667 18.0294L12.6569 19.0392C12.2551 19.441 11.7103 19.6667 11.1421 19.6667C10.574 19.6667 10.0291 19.441 9.62742 19.0392C9.22569 18.6375 9 18.0927 9 17.5245C9 16.9564 9.22569 16.4115 9.62742 16.0098L10.6372 15"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.667 10.6372L15.6768 9.62742C16.0785 9.22569 16.6234 9 17.1915 9C17.7597 9 18.3045 9.22569 18.7062 9.62742C19.108 10.0291 19.3337 10.574 19.3337 11.1421C19.3337 11.7103 19.108 12.2551 18.7062 12.6569L17.6964 13.6667"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.667 16.832L15.667 12.832"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="w-px h-6 bg-[#E5E7EB]"></div>
          {/* Undo/Redo */}
          <button
            type="button"
            onClick={() => handleCommand("undo")}
            className="p-0 hover:opacity-80 transition"
            title="Undo"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="28" height="28" rx="4" fill="#E5E7EB" />
              <path
                d="M12.0003 15.3346L8.66699 12.0013L12.0003 8.66797"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.3333 19.3331C19.6014 18.3183 19.5985 17.2509 19.3251 16.2376C19.0516 15.2242 18.5171 14.3003 17.7749 13.5581C17.0328 12.816 16.1089 12.2815 15.0955 12.008C14.0822 11.7345 13.0148 11.7317 12 11.9997"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("redo")}
            className="p-0 hover:opacity-80 transition"
            title="Redo"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="28"
                height="28"
                rx="4"
                transform="matrix(-1 0 0 1 28 0)"
                fill="#E5E7EB"
              />
              <path
                d="M15.9997 15.3346L19.333 12.0013L15.9997 8.66797"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.66667 19.3331C8.39862 18.3183 8.40147 17.2509 8.67492 16.2376C8.94838 15.2242 9.48289 14.3003 10.2251 13.5581C10.9672 12.816 11.8911 12.2815 12.9045 12.008C13.9178 11.7345 14.9852 11.7317 16 11.9997"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full p-4 font-roboto text-[16px] leading-[100%] text-oxford-blue focus:outline-none ${!value && !isFocused ? "text-[#9CA3AF]" : ""
            }`}
          style={{
            minHeight: minHeight,
          }}
          data-placeholder={placeholder}
          suppressContentEditableWarning
        />
        <style>{`
          [contenteditable][data-placeholder]:empty:before {
            content: attr(data-placeholder);
            color: #9CA3AF;
            pointer-events: none;
          }
        `}</style>
      </div>
    );
  };

  return (
    <>
      <style>{`
        .rich-text-editor .ql-container {
          font-family: 'Roboto', sans-serif;
          font-size: 16px;
          line-height: 100%;
          color: #032746;
          min-height: 200px;
        }
        .rich-text-editor .ql-editor {
          min-height: 200px;
          padding: 16px;
          font-family: 'Roboto', sans-serif;
          font-size: 16px;
          line-height: 100%;
          color: #032746;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9CA3AF;
          font-style: normal;
        }
        .rich-text-editor .ql-toolbar {
          background-color: #F6F7F8;
          border-bottom: 1px solid #CDD4DA;
          padding: 8px;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        .rich-text-editor .ql-toolbar .ql-formats {
          margin-right: 8px;
        }
        .rich-text-editor .ql-toolbar button {
          width: 32px;
          height: 32px;
          padding: 4px;
          border-radius: 4px;
        }
        .rich-text-editor .ql-toolbar button:hover {
          background-color: #E5E7EB;
        }
        .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: #374151;
        }
        .rich-text-editor .ql-toolbar .ql-fill {
          fill: #374151;
        }
        .rich-text-editor .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        .rich-text-editor .ql-snow {
          border: none;
        }
        .rich-text-editor .ql-snow .ql-toolbar {
          border: none;
        }
        .rich-text-editor .ql-snow .ql-container {
          border: none;
        }
        .rich-text-editor-explanation .ql-container {
          min-height: 150px;
        }
        .rich-text-editor-explanation .ql-editor {
          min-height: 150px;
        }
      `}</style>
      <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center mb-10">
            <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[40px] text-oxford-blue">
              {t('gatherer.addNewQuestion.title')}
            </h1>
            <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
              <button
                type="button"
                onClick={handleCancel}
                className="flex h-[36px] items-center justify-center rounded-[8px] border border-[#E5E7EB] bg-white px-3 md:px-5 text-[14px] md:text-[16px] font-roboto font-medium leading-[16px] text-[#374151] transition hover:bg-[#F9FAFB]"
              >
                {t('gatherer.addNewQuestion.cancel')}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className={`flex h-[36px] items-center justify-center rounded-[8px] bg-[#ED4122] px-4 md:px-6 text-[14px] md:text-[16px] font-archivo font-medium leading-[16px] text-white transition hover:bg-[#d43a1f] ${
                  submitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? "Submitting..." : t('gatherer.addNewQuestion.submit')}
              </button>
            </div>
          </header>

          {/* Main Content - Two Columns */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Question Details (2/3 width on xl screens) */}
            <div className="xl:col-span-2 bg-white rounded-[14px] border border-[#03274633] px-[30px] pt-[50px] pb-10">
              <h2 className="text-[20px] font-archivo leading-[32px] font-bold text-blue-dark mb-[30px]">
                {t('gatherer.addNewQuestion.questionText')}
              </h2>

              <div className="space-y-6">
                {/* Question Text */}
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-5">
                    {t('gatherer.addNewQuestion.questionText')}
                  </label>
                  <RichTextEditor
                    value={questionText}
                    onChange={setQuestionText}
                    placeholder={t('gatherer.addNewQuestion.placeholders.questionText')}
                    minHeight="200px"
                  />
                </div>

                {/* Question Type */}
                <div>
                  <label className="block  text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t('gatherer.addNewQuestion.questionType')}
                  </label>
                  <Dropdown
                    value={questionType}
                    onChange={setQuestionType}
                    options={[
                      t('admin.addNewQuestion.questionTypes.multipleChoice'),
                      t('admin.addNewQuestion.questionTypes.trueFalse'),
                      t('admin.addNewQuestion.questionTypes.shortAnswer'),
                      t('admin.addNewQuestion.questionTypes.essay')
                    ]}
                  />
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                        {t('gatherer.addNewQuestion.options.optionA')}
                      </label>
                      <input
                        type="text"
                        value={options.A}
                        onChange={(e) => handleOptionChange("A", e.target.value)}
                        className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                        {t('gatherer.addNewQuestion.options.optionC')}
                      </label>
                      <input
                        type="text"
                        value={options.C}
                        onChange={(e) => handleOptionChange("C", e.target.value)}
                        className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                        {t('gatherer.addNewQuestion.options.optionB')}
                      </label>
                      <input
                        type="text"
                        value={options.B}
                        onChange={(e) => handleOptionChange("B", e.target.value)}
                        className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                        {t('gatherer.addNewQuestion.options.optionD')}
                      </label>
                      <input
                        type="text"
                        value={options.D}
                        onChange={(e) => handleOptionChange("D", e.target.value)}
                        className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Correct Answer */}
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t('gatherer.addNewQuestion.correctAnswer')}
                  </label>
                  <Dropdown
                    value={correctAnswer}
                    onChange={setCorrectAnswer}
                    options={[
                      t('admin.addNewQuestion.correctAnswerOptions.optionA'),
                      t('admin.addNewQuestion.correctAnswerOptions.optionB'),
                      t('admin.addNewQuestion.correctAnswerOptions.optionC'),
                      t('admin.addNewQuestion.correctAnswerOptions.optionD')
                    ]}
                  />
                </div>

                {/* Explanation (Optional) */}
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t('gatherer.addNewQuestion.explanation')} <span className="text-gray-500 text-sm">({t('gatherer.addNewQuestion.optional')})</span>
                  </label>
                  <RichTextEditor
                    value={explanation}
                    onChange={setExplanation}
                    placeholder={t('gatherer.addNewQuestion.placeholders.explanation')}
                    minHeight="150px"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Classification (1/3 width on xl screens) */}
            <div className="bg-white rounded-[14px] border border-[#03274633] px-[30px] pt-[50px] pb-10 h-[725px]">
              <h2 className="text-[20px] leading-[100%] font-bold font-archivo text-blue-dark mb-6">
                {t('gatherer.addNewQuestion.classification.title')}
              </h2>

              <div className="space-y-6">
                {/* Subject */}

                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t('gatherer.addNewQuestion.classification.exam')}
                  </label>
                  <Dropdown
                    value={examName}
                    onChange={handleExamChange}
                    options={
                      loadingExams
                        ? [t('gatherer.addNewQuestion.messages.loading')]
                        : exams.length > 0
                        ? exams.map((exam) => exam.name || "Unnamed Exam").filter(Boolean)
                        : [t('gatherer.addNewQuestion.messages.noExamsAvailable')]
                    }
                  />
                </div>

                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t('gatherer.addNewQuestion.classification.subject')}
                  </label>
                  <Dropdown
                    value={subjectName}
                    onChange={handleSubjectChange}
                    options={
                      !examId
                        ? [t('gatherer.addNewQuestion.messages.selectExamFirst')]
                        : loadingSubjects
                        ? [t('gatherer.addNewQuestion.messages.loading')]
                        : subjects.length > 0
                        ? subjects.map((subject) => subject.name || "Unnamed Subject").filter(Boolean)
                        : [t('gatherer.addNewQuestion.messages.noSubjectsAvailable')]
                    }
                  />
                </div>

                {/* Topic */}
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t('gatherer.addNewQuestion.classification.topic')}
                  </label>
                  <Dropdown
                    value={topicName}
                    onChange={handleTopicChange}
                    options={
                      !subjectId
                        ? [t('gatherer.addNewQuestion.messages.selectSubjectFirst')]
                        : loadingTopics
                        ? [t('gatherer.addNewQuestion.messages.loading')]
                        : topics.length > 0
                        ? topics.map((topic) => topic.name || "Unnamed Topic").filter(Boolean)
                        : [t('gatherer.addNewQuestion.messages.noTopicsAvailable')]
                    }
                  />
                </div>

                {/* Reference */}
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t('gatherer.addNewQuestion.classification.reference')}
                  </label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                    placeholder={t('gatherer.addNewQuestion.placeholders.reference')}
                  />
                </div>

                {/* Processor Assignment */}
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t('gatherer.addNewQuestion.classification.processor')} <span className="text-red-500 text-sm">*</span>
                  </label>
                  <Dropdown
                    value={processorId ? processorName : ""}
                    onChange={handleProcessorChange}
                    options={
                      loadingProcessors
                        ? [t('gatherer.addNewQuestion.messages.loading')]
                        : processors.length > 0
                        ? processors.map((processor) => {
                            const displayName = processor.name || processor.fullName || processor.username || "Unnamed Processor";
                            return displayName;
                          }).filter(Boolean)
                        : [t('gatherer.addNewQuestion.messages.noProcessorsAvailable')]
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GathererAddNewQuestionPage;
