import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import questionsAPI from "../../api/questions";
import examsAPI from "../../api/exams";
import subjectsAPI from "../../api/subjects";
import usersAPI from "../../api/users";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig";
import RichTextEditor from "../../components/common/RichTextEditor";
import Loader from "../../components/common/Loader";

const Dropdown = ({ label, value, options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Show placeholder if no value, otherwise show the selected value
  const displayValue = value && value.trim() !== "" ? value : (placeholder || "Select...");

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
      {/* Label - always visible */}
      {label && (
        <p className="text-[16px] leading-[100%] font-semibold text-oxford-blue mb-3">
        {label}
      </p>
      )}

      {/* Dropdown Box */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-[50px] cursor-pointer items-center justify-between rounded-lg bg-white px-4 text-[16px] leading-[100%] font-normal border border-[#03274633]"
        style={{ color: value && value.trim() !== "" ? "#032746" : "#9CA3AF" }}
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
        {isOpen && options && options.length > 0 && (
          <ul className="absolute left-0 top-full z-10 mt-1 w-full rounded-lg border border-gray-100 bg-white shadow-lg max-h-60 overflow-y-auto">
            {options.map((option, index) => (
              <li
                key={`${option}-${index}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                  value === option ? "font-semibold text-oxford-blue bg-gray-50" : "text-gray-700"
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


const AddNewQuestionPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("Multiple Choice (MCQ)");
  const [options, setOptions] = useState({ A: "", B: "", C: "", D: "" });
  const [correctAnswer, setCorrectAnswer] = useState("Option A");
  const [source, setSource] = useState("");
  const [explanation, setExplanation] = useState("");

  // Handle question type change - reset options and correct answer for True/False
  const handleQuestionTypeChange = (newType) => {
    setQuestionType(newType);
    if (newType === "True/False") {
      // Set True/False options
      setOptions({ A: "True", B: "False", C: "", D: "" });
      setCorrectAnswer("True");
    } else {
      // Reset to empty for other types
      setOptions({ A: "", B: "", C: "", D: "" });
      setCorrectAnswer("Option A");
    }
  };

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
  const [isAssignedToMe, setIsAssignedToMe] = useState(false);

  // Variants state - only shown when "assigned to me" is selected
  const [variants, setVariants] = useState([]);

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
          // Filter subjects by the selected exam
          const filteredSubjects = response.data.subjects.filter(
            (subject) => subject.examId === examId
          );
          setSubjects(filteredSubjects);
          
          // Reset subject selection if current subject doesn't belong to selected exam
          if (subjectId && !filteredSubjects.find(s => s.id === subjectId)) {
            setSubjectId("");
            setSubjectName("");
            setTopics([]);
            setTopicId("");
            setTopicName("");
          }
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
        } else if (response.success && response.data?.admins) {
          const loadedProcessors = response.data.admins;
          setProcessors(loadedProcessors);
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
      setExamName("");
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
      setSubjectName("");
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
      setTopicName("");
    }
  };

  // Handle processor selection
  const handleProcessorChange = (selectedProcessorName) => {
    if (selectedProcessorName === "Assigned to me") {
      setIsAssignedToMe(true);
      setProcessorId("assigned_to_me");
      setProcessorName("Assigned to me");
    } else {
      setIsAssignedToMe(false);
      const selectedProcessor = processors.find((p) => {
        const pName = p.name || p.fullName || p.username || "";
        const normalizedSelected = selectedProcessorName.trim();
        const normalizedPName = pName.trim();
        return normalizedPName === normalizedSelected;
      });
      
      if (selectedProcessor && selectedProcessor.id) {
        setProcessorId(selectedProcessor.id);
        setProcessorName(selectedProcessorName);
      } else {
        setProcessorId("");
        setProcessorName("");
      }
    }
  };

  // Variant handlers
  const handleAddVariant = () => {
    const newVariantId = variants.length > 0 ? Math.max(...variants.map((v) => v.id)) + 1 : 1;
    setVariants((prev) => [
      ...prev,
      {
        id: newVariantId,
        questionText: "",
        questionType: "Multiple Choice (MCQ)",
        options: { A: "", B: "", C: "", D: "" },
        correctAnswer: "Option A",
        explanation: "",
      },
    ]);
  };

  const handleDeleteVariant = (variantId) => {
    setVariants((prev) => prev.filter((v) => v.id !== variantId));
  };

  const handleVariantQuestionTextChange = (variantId, value) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId ? { ...variant, questionText: value } : variant
      )
    );
  };

  const handleVariantQuestionTypeChange = (variantId, value) => {
    setVariants((prev) =>
      prev.map((variant) => {
        if (variant.id === variantId) {
          if (value === "True/False") {
            return {
              ...variant,
              questionType: value,
              options: { A: "True", B: "False", C: "", D: "" },
              correctAnswer: "True"
            };
          }
          return { ...variant, questionType: value };
        }
        return variant;
      })
    );
  };

  const handleVariantOptionChange = (variantId, option, value) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId
          ? { ...variant, options: { ...variant.options, [option]: value } }
          : variant
      )
    );
  };

  const handleVariantCorrectAnswerChange = (variantId, value) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId ? { ...variant, correctAnswer: value } : variant
      )
    );
  };

  const handleVariantExplanationChange = (variantId, value) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId ? { ...variant, explanation: value } : variant
      )
    );
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

    // If assigned to me, validate explanation and variants
    if (isAssignedToMe) {
      if (!explanation.trim()) {
        showErrorToast("Explanation is required when assigned to me", { title: "Validation Error" });
        return;
      }

      // Validate variants if any exist
      if (variants.length > 0) {
        const incompleteVariants = variants.filter((variant) => {
          const hasQuestionText = variant.questionText && variant.questionText.trim() !== "";
          if (!hasQuestionText) return true;
          
          const isTrueFalse = variant.questionType === "True/False";
          if (isTrueFalse) {
            return !variant.correctAnswer || (variant.correctAnswer !== "True" && variant.correctAnswer !== "False");
          } else {
            const hasAllOptions = variant.options.A?.trim() && 
                                 variant.options.B?.trim() && 
                                 variant.options.C?.trim() && 
                                 variant.options.D?.trim();
            const hasCorrectAnswer = variant.correctAnswer && variant.correctAnswer.startsWith("Option ");
            return !hasAllOptions || !hasCorrectAnswer;
          }
        });

        if (incompleteVariants.length > 0) {
          showErrorToast("Please complete all variant fields before submitting.", { title: "Validation Error" });
          return;
        }
      }
    }

    // Validate MCQ fields
    if (questionType === "Multiple Choice (MCQ)") {
      if (!options.A.trim() || !options.B.trim() || !options.C.trim() || !options.D.trim()) {
        showErrorToast("All options are required", { title: "Validation Error" });
        return;
      }
      
      // Check for duplicate options
      const optionValues = [
        options.A.trim().toLowerCase(),
        options.B.trim().toLowerCase(),
        options.C.trim().toLowerCase(),
        options.D.trim().toLowerCase()
      ];
      
      const uniqueOptions = new Set(optionValues);
      if (uniqueOptions.size < 4) {
        showErrorToast("Options cannot be the same. Please provide unique options for each choice.", { title: "Validation Error" });
        return;
      }
      
      if (!correctAnswer) {
        showErrorToast("Please select a correct answer", { title: "Validation Error" });
        return;
      }
    }
    
    // Validate True/False fields
    if (questionType === "True/False") {
      if (!correctAnswer || (correctAnswer !== "True" && correctAnswer !== "False")) {
        showErrorToast("Please select True or False as the correct answer", { title: "Validation Error" });
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

      // Prepare question data
      const questionData = {
        exam: examId,
        subject: subjectId,
        topic: topicId,
        questionText: questionText.trim(),
        questionType: apiQuestionType,
        explanation: explanation?.trim() || "",
        source: source?.trim() || "",
      };

      // If assigned to me, use special endpoint
      if (isAssignedToMe) {
        // Prepare variants data
        const variantsData = variants.map((variant) => {
          const questionTypeMap = {
            "Multiple Choice (MCQ)": "MCQ",
            "True/False": "TRUE_FALSE",
          };
          const apiQuestionType = questionTypeMap[variant.questionType] || "MCQ";
          
          let correctAnswerLetter;
          if (apiQuestionType === "TRUE_FALSE") {
            correctAnswerLetter = variant.correctAnswer === "True" ? "A" : "B";
          } else {
            correctAnswerLetter = variant.correctAnswer.replace("Option ", "").trim();
          }

          return {
            questionText: variant.questionText.trim(),
            questionType: apiQuestionType,
            options: {
              A: variant.options.A?.trim() || (apiQuestionType === "TRUE_FALSE" ? "True" : ""),
              B: variant.options.B?.trim() || (apiQuestionType === "TRUE_FALSE" ? "False" : ""),
              C: variant.options.C?.trim() || "",
              D: variant.options.D?.trim() || "",
            },
            correctAnswer: correctAnswerLetter,
            explanation: variant.explanation?.trim() || "",
          };
        });

        // Add MCQ-specific fields for original question
        if (apiQuestionType === "MCQ") {
          // Map correct answer from "Option A" to "A"
          const correctAnswerLetter = correctAnswer.replace("Option ", "");
          questionData.options = {
            A: options.A.trim(),
            B: options.B.trim(),
            C: options.C.trim(),
            D: options.D.trim(),
          };
          questionData.correctAnswer = correctAnswerLetter;
        }
        
        // Add True/False-specific fields for original question
        if (apiQuestionType === "TRUE_FALSE") {
          questionData.options = {
            A: "True",
            B: "False",
          };
          // Map "True" to "A" and "False" to "B"
          questionData.correctAnswer = correctAnswer === "True" ? "A" : "B";
        }

        const completedQuestionData = {
          ...questionData,
          explanation: explanation.trim(),
          variants: variantsData,
        };

        const response = await questionsAPI.createQuestionWithCompletedStatus(completedQuestionData);
        
        if (response.success) {
          showSuccessToast(
            response.message || "Question created successfully with completed status",
            { title: "Success" }
          );
          setTimeout(() => {
            navigate("/admin/question-bank");
          }, 1500);
        } else {
          showErrorToast(
            response.message || "Failed to create question",
            { title: "Error" }
          );
        }
        setSubmitting(false);
        return;
      }

      // Add processor assignment (required for normal flow)
      if (!processorId || processorId.trim() === "") {
        showErrorToast("Please select a processor", { title: "Validation Error" });
        setSubmitting(false);
        return;
      }
      questionData.assignedProcessor = processorId;

      // Add MCQ-specific fields
      if (apiQuestionType === "MCQ") {
        // Map correct answer from "Option A" to "A"
        const correctAnswerLetter = correctAnswer.replace("Option ", "");
        questionData.options = {
          A: options.A.trim(),
          B: options.B.trim(),
          C: options.C.trim(),
          D: options.D.trim(),
        };
        questionData.correctAnswer = correctAnswerLetter;
      }
      
      // Add True/False-specific fields
      if (apiQuestionType === "TRUE_FALSE") {
        questionData.options = {
          A: "True",
          B: "False",
        };
        // Map "True" to "A" and "False" to "B"
        questionData.correctAnswer = correctAnswer === "True" ? "A" : "B";
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
          navigate("/admin/question-bank");
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
    navigate("/admin/question-bank");
  };

  return (
    <>
      {submitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-xl">
            <Loader 
              size="lg" 
              color="oxford-blue" 
              text="Creating question..."
              className="py-4"
            />
          </div>
        </div>
      )}
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
              {t("admin.addNewQuestion.hero.title")}
            </h1>
            <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
              <button
                type="button"
                onClick={handleCancel}
                className="flex h-[36px] items-center justify-center rounded-[8px] border border-[#E5E7EB] bg-white px-3 md:px-5 text-[14px] md:text-[16px] font-roboto font-medium leading-[16px] text-[#374151] transition hover:bg-[#F9FAFB]"
              >
                {t("admin.addNewQuestion.buttons.cancel")}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className={`flex h-[36px] items-center justify-center rounded-[8px] bg-[#ED4122] px-4 md:px-6 text-[14px] md:text-[16px] font-archivo font-medium leading-[16px] text-white transition hover:bg-[#d43a1f] ${
                  submitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? "Submitting..." : t("admin.addNewQuestion.buttons.submit")}
              </button>
            </div>
          </header>

          {/* Main Content - Two Columns */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Question Details (2/3 width on xl screens) */}
            <div className="xl:col-span-2 bg-white rounded-[14px] border border-[#03274633] px-[30px] pt-[50px] pb-10">
              <h2 className="text-[20px] font-archivo leading-[32px] font-bold text-blue-dark mb-[30px]">
                {t("admin.addNewQuestion.sections.questionDetails")}
              </h2>

              <div className="space-y-6">
                {/* Question Text */}
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-5">
                    {t("admin.addNewQuestion.fields.questionText")}
                  </label>
                  <RichTextEditor
                    value={questionText}
                    onChange={setQuestionText}
                    placeholder={t("admin.addNewQuestion.placeholders.questionText")}
                    minHeight="200px"
                  />
                </div>

                {/* Question Type */}
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t("admin.addNewQuestion.fields.questionType")}
                  </label>
                  <Dropdown
                    value={questionType}
                    onChange={handleQuestionTypeChange}
                    placeholder="Select question type"
                    options={[
                      t('admin.addNewQuestion.questionTypes.multipleChoice'),
                      t('admin.addNewQuestion.questionTypes.trueFalse')
                    ]}
                  />
                </div>

                {/* Options Grid - Show 4 options for MCQ, 2 options for True/False */}
                {questionType === "True/False" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                        True
                      </label>
                      <input
                        type="text"
                        value={options.A}
                        disabled
                        className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-gray-100 px-4 py-3 text-blue-dark cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                        False
                      </label>
                      <input
                        type="text"
                        value={options.B}
                        disabled
                        className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-gray-100 px-4 py-3 text-blue-dark cursor-not-allowed"
                      />
                    </div>
                  </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                        {t("admin.addNewQuestion.fields.optionA")}
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
                        {t("admin.addNewQuestion.fields.optionC")}
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
                        {t("admin.addNewQuestion.fields.optionB")}
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
                        {t("admin.addNewQuestion.fields.optionD")}
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
                )}

                {/* Correct Answer */}
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t("admin.addNewQuestion.fields.correctAnswer")}
                  </label>
                  {questionType === "True/False" ? (
                  <Dropdown
                    value={correctAnswer}
                    onChange={setCorrectAnswer}
                      placeholder="Select correct answer"
                      options={["True", "False"]}
                    />
                  ) : (
                    <Dropdown
                      value={correctAnswer}
                      onChange={setCorrectAnswer}
                      placeholder="Select correct answer"
                    options={[
                        t('admin.addNewQuestion.correctAnswerOptions.optionA'),
                        t('admin.addNewQuestion.correctAnswerOptions.optionB'),
                        t('admin.addNewQuestion.correctAnswerOptions.optionC'),
                        t('admin.addNewQuestion.correctAnswerOptions.optionD')
                      ]}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Classification (1/3 width on xl screens) */}
            <div className="bg-white rounded-[14px] border border-[#03274633] px-[30px] pt-[50px] pb-10 h-[725px]">
              <h2 className="text-[20px] leading-[100%] font-bold font-archivo text-blue-dark mb-6">
                {t("admin.addNewQuestion.sections.classification")}
              </h2>

              <div className="space-y-6">
                {/* Exam */}
                <div>
                  <Dropdown
                    label={t("admin.addNewQuestion.fields.exam")}
                    value={examName}
                    onChange={handleExamChange}
                    placeholder="Select exam"
                    options={
                      loadingExams
                        ? ["Loading..."]
                        : exams.length > 0
                        ? exams.map((exam) => exam.name || "Unnamed Exam").filter(Boolean)
                        : ["No exams available"]
                    }
                  />
                </div>

                {/* Subject */}
                <div>
                  <Dropdown
                    label={t("admin.addNewQuestion.fields.subject")}
                    value={subjectName}
                    onChange={handleSubjectChange}
                    placeholder="Select subject"
                    options={
                      !examId
                        ? ["Select exam first"]
                        : loadingSubjects
                        ? ["Loading..."]
                        : subjects.length > 0
                        ? subjects.map((subject) => subject.name || "Unnamed Subject").filter(Boolean)
                        : ["No subjects available"]
                    }
                  />
                </div>

                {/* Topic */}
                <div>
                  <Dropdown
                    label={t("admin.addNewQuestion.fields.topic")}
                    value={topicName}
                    onChange={handleTopicChange}
                    placeholder="Select topic"
                    options={
                      !subjectId
                        ? ["Select subject first"]
                        : loadingTopics
                        ? ["Loading..."]
                        : topics.length > 0
                        ? topics.map((topic) => topic.name || "Unnamed Topic").filter(Boolean)
                        : ["No topics available"]
                    }
                  />
                </div>

                {/* Reference */}
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t("admin.addNewQuestion.fields.reference")}
                  </label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                    placeholder={t("admin.addNewQuestion.placeholders.addReference")}
                  />
                </div>

                {/* Processor Assignment */}
                <div>
                  <Dropdown
                    label={t("admin.addNewQuestion.fields.processor") || "Processor"}
                    value={processorName}
                    onChange={handleProcessorChange}
                    placeholder="Select processor"
                    options={
                      loadingProcessors
                        ? ["Loading..."]
                        : ["Assigned to me", ...(processors.length > 0
                          ? processors.map((p) => p.name || p.fullName || p.username || "Unnamed Processor").filter(Boolean)
                          : [])]
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Explanation and Variants (only shown when assigned to me) */}
          {isAssignedToMe && (
            <>
              {/* Explanation Section */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-white rounded-[14px] border border-[#03274633] px-[30px] pt-[50px] pb-10">
                  <h2 className="text-[20px] leading-[100%] font-archivo font-bold text-blue-dark mb-6">
                    {t("admin.addNewQuestion.sections.explanation")}
                  </h2>
                  <RichTextEditor
                    value={explanation}
                    onChange={setExplanation}
                    placeholder={t("admin.addNewQuestion.placeholders.explanation")}
                    minHeight="150px"
                  />
                </div>
              </div>

              {/* Variants Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[20px] leading-[100%] font-archivo font-bold text-blue-dark">
                    Variants
                  </h2>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="flex h-[36px] items-center justify-center rounded-[8px] bg-[#ED4122] px-4 md:px-6 text-[14px] md:text-[16px] font-archivo font-medium leading-[16px] text-white transition hover:bg-[#d43a1f]"
                  >
                    + Add Variant
                  </button>
                </div>

                {/* Variants List */}
                {variants.map((variant, index) => (
                  <div key={variant.id} className="bg-white rounded-[14px] border border-[#03274633] px-[30px] pt-[50px] pb-10 mb-6">
                    <div className="flex items-center justify-between mb-[30px]">
                      <h3 className="text-[20px] font-archivo leading-[32px] font-bold text-blue-dark">
                        Variant #{index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleDeleteVariant(variant.id)}
                        className="flex items-center justify-center text-red-600 hover:text-red-700 transition-colors"
                        title="Delete variant"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.33334 5.83333H16.6667M7.50001 5.83333V4.16667C7.50001 3.50362 8.00362 2.99999 8.66667 2.99999H11.3333C11.9964 2.99999 12.5 3.50362 12.5 4.16667V5.83333M7.50001 5.83333H12.5M7.50001 5.83333H4.16667M12.5 5.83333H15.8333M4.16667 5.83333L4.58334 15.8333C4.58334 16.4964 5.08695 17 5.75 17H14.25C14.9131 17 15.4167 16.4964 15.4167 15.8333L15.8333 5.83333M8.33334 9.16667V13.3333M11.6667 9.16667V13.3333"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Variant Question Text */}
                      <div>
                        <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-5">
                          {t("admin.addNewQuestion.fields.questionText")}
                        </label>
                        <RichTextEditor
                          value={variant.questionText}
                          onChange={(value) => handleVariantQuestionTextChange(variant.id, value)}
                          placeholder={t("admin.addNewQuestion.placeholders.questionText")}
                          minHeight="200px"
                        />
                      </div>

                      {/* Variant Question Type */}
                      <div>
                        <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                          {t("admin.addNewQuestion.fields.questionType")}
                        </label>
                        <Dropdown
                          value={variant.questionType}
                          onChange={(value) => handleVariantQuestionTypeChange(variant.id, value)}
                          placeholder="Select question type"
                          options={[
                            t('admin.addNewQuestion.questionTypes.multipleChoice'),
                            t('admin.addNewQuestion.questionTypes.trueFalse')
                          ]}
                        />
                      </div>

                      {/* Variant Options */}
                      {variant.questionType === "True/False" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                              True
                            </label>
                            <input
                              type="text"
                              value={variant.options.A}
                              disabled
                              className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-gray-100 px-4 py-3 text-blue-dark cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                              False
                            </label>
                            <input
                              type="text"
                              value={variant.options.B}
                              disabled
                              className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-gray-100 px-4 py-3 text-blue-dark cursor-not-allowed"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                                {t("admin.addNewQuestion.fields.optionA")}
                              </label>
                              <input
                                type="text"
                                value={variant.options.A}
                                onChange={(e) => handleVariantOptionChange(variant.id, "A", e.target.value)}
                                className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                                {t("admin.addNewQuestion.fields.optionC")}
                              </label>
                              <input
                                type="text"
                                value={variant.options.C}
                                onChange={(e) => handleVariantOptionChange(variant.id, "C", e.target.value)}
                                className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                              />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                                {t("admin.addNewQuestion.fields.optionB")}
                              </label>
                              <input
                                type="text"
                                value={variant.options.B}
                                onChange={(e) => handleVariantOptionChange(variant.id, "B", e.target.value)}
                                className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                                {t("admin.addNewQuestion.fields.optionD")}
                              </label>
                              <input
                                type="text"
                                value={variant.options.D}
                                onChange={(e) => handleVariantOptionChange(variant.id, "D", e.target.value)}
                                className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Variant Correct Answer */}
                      <div>
                        <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                          {t("admin.addNewQuestion.fields.correctAnswer")}
                        </label>
                        {variant.questionType === "True/False" ? (
                          <Dropdown
                            value={variant.correctAnswer}
                            onChange={(value) => handleVariantCorrectAnswerChange(variant.id, value)}
                            placeholder="Select correct answer"
                            options={["True", "False"]}
                          />
                        ) : (
                          <Dropdown
                            value={variant.correctAnswer}
                            onChange={(value) => handleVariantCorrectAnswerChange(variant.id, value)}
                            placeholder="Select correct answer"
                            options={[
                              t('admin.addNewQuestion.correctAnswerOptions.optionA'),
                              t('admin.addNewQuestion.correctAnswerOptions.optionB'),
                              t('admin.addNewQuestion.correctAnswerOptions.optionC'),
                              t('admin.addNewQuestion.correctAnswerOptions.optionD')
                            ]}
                          />
                        )}
                      </div>

                      {/* Variant Explanation */}
                      <div>
                        <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-5">
                          {t("admin.addNewQuestion.sections.explanation")}
                        </label>
                        <RichTextEditor
                          value={variant.explanation}
                          onChange={(value) => handleVariantExplanationChange(variant.id, value)}
                          placeholder={t("admin.addNewQuestion.placeholders.explanation")}
                          minHeight="150px"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AddNewQuestionPage;
