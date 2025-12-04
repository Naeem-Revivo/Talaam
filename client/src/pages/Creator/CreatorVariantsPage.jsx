import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton, PrimaryButton } from "../../components/common/Button";
import questionsAPI from "../../api/questions";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig";

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
    <div className="w-full" ref={dropdownRef}>
      {/* Label only on small screens */}
      <p className="text-[16px] leading-[100%] font-semibold text-oxford-blue mb-3 block lg:hidden">
        {label}
      </p>

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
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
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
                  displayValue === option
                    ? "font-semibold text-oxford-blue"
                    : "text-gray-700"
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

const CreatorVariantsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  // Get question data from location state or fetch it
  const questionId = location.state?.questionId;
  const [originalQuestion, setOriginalQuestion] = useState(location.state?.question || null);
  const [loading, setLoading] = useState(!originalQuestion && !questionId);
  const [questionIdDisplay, setQuestionIdDisplay] = useState(
    originalQuestion?.id || questionId || "QB-1442"
  );
  
  // Original question state - initialize from passed data or API
  const [questionText, setQuestionText] = useState(originalQuestion?.questionText || "");
  const [questionType, setQuestionType] = useState(
    originalQuestion?.questionType === "MCQ" 
      ? "Multiple Choice (MCQ)" 
      : originalQuestion?.questionType || "Multiple Choice (MCQ)"
  );
  const [options, setOptions] = useState(
    originalQuestion?.options || { A: "", B: "", C: "", D: "" }
  );
  const [correctAnswer, setCorrectAnswer] = useState(
    originalQuestion?.correctAnswer 
      ? `Option ${originalQuestion.correctAnswer}` 
      : "Option A"
  );
  
  // Classification state (shared)
  const [exam, setExam] = useState(originalQuestion?.exam?.name || "");
  const [subject, setSubject] = useState(originalQuestion?.subject?.name || "");
  const [topic, setTopic] = useState(originalQuestion?.topic?.name || "");
  const [cognitiveLevel, setCognitiveLevel] = useState("");
  const [source, setSource] = useState("");
  const [explanation, setExplanation] = useState(originalQuestion?.explanation || "");
  
  // Flag modal state
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [isFlagging, setIsFlagging] = useState(false);

  // Variants state - array of variant objects
  const [variants, setVariants] = useState([
    {
      id: 1,
      questionText: "",
      questionType: "Multiple Choice (MCQ)",
      options: { A: "", B: "", C: "", D: "" },
      correctAnswer: "Option A",
    },
  ]);

  const handleOptionChange = (option, value) => {
    setOptions((prev) => ({ ...prev, [option]: value }));
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

  const handleVariantQuestionTextChange = (variantId, value) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId ? { ...variant, questionText: value } : variant
      )
    );
  };

  const handleVariantQuestionTypeChange = (variantId, value) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId ? { ...variant, questionType: value } : variant
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
      },
    ]);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveDraft = () => {
    // TODO: Implement save draft functionality
    console.log("Save draft");
  };

  const handleSubmit = async () => {
    if (!questionId && !originalQuestion?.id) {
      showErrorToast("Question ID is missing. Cannot submit variant.");
      return;
    }

    try {
      setIsSubmitting(true);
      const idToUse = questionId || originalQuestion?.id;

      // Filter out empty variants (variants with no question text)
      const validVariants = variants.filter(
        (variant) => variant.questionText && variant.questionText.trim() !== ""
      );

      // If there are valid variants, create them
      if (validVariants.length > 0) {
        // Create all variants
        const variantPromises = validVariants.map((variant) => {
          // Extract correct answer letter from "Option A" format
          const correctAnswerLetter = variant.correctAnswer.replace("Option ", "").trim();
          
          // Convert question type from display format to API format
          const questionTypeMap = {
            "Multiple Choice (MCQ)": "MCQ",
            "True/False": "TrueFalse",
            "Short Answer": "ShortAnswer",
            "Essay": "Essay",
          };
          const apiQuestionType = questionTypeMap[variant.questionType] || "MCQ";

          // Get IDs from original question
          const examId = originalQuestion?.exam?.id || originalQuestion?.exam;
          const subjectId = originalQuestion?.subject?.id || originalQuestion?.subject;
          const topicId = originalQuestion?.topic?.id || originalQuestion?.topic;

          const variantData = {
            questionText: variant.questionText.trim(),
            questionType: apiQuestionType,
            options: {
              A: variant.options.A?.trim() || "",
              B: variant.options.B?.trim() || "",
              C: variant.options.C?.trim() || "",
              D: variant.options.D?.trim() || "",
            },
            correctAnswer: correctAnswerLetter,
            exam: examId,
            subject: subjectId,
            topic: topicId,
          };

          return questionsAPI.createQuestionVariant(idToUse, variantData);
        });

        await Promise.all(variantPromises);
        showSuccessToast(`Successfully created ${validVariants.length} variant(s)!`);
        // Note: Server-side automatically updates original question status to 'completed' when variants are created
      } else {
        // No variants created - creator is submitting the question as-is without creating variants
        // Update the original question status to 'completed' (approved) manually
        try {
          await questionsAPI.submitQuestionByCreator(idToUse);
        } catch (updateError) {
          // If status update fails, log but don't fail the whole submission
          console.warn("Could not update question status:", updateError);
          // Try alternative: use updateQuestion if submitQuestionByCreator doesn't work
          try {
            await questionsAPI.updateQuestion(idToUse, { status: 'completed' });
          } catch (altError) {
            console.warn("Alternative status update also failed:", altError);
          }
        }
        showSuccessToast("Question submitted successfully (no variants created).");
      }

      // Navigate back to assigned questions page
      setTimeout(() => {
        navigate("/creator/question-bank/assigned-question");
      }, 1500);
    } catch (error) {
      console.error("Error submitting variant:", error);
      showErrorToast(error.message || "Failed to submit variant. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch question data if not provided in location state
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!originalQuestion && questionId) {
        try {
          setLoading(true);
          const response = await questionsAPI.getCreatorQuestionById(questionId);
          if (response.success && response.data?.question) {
            const question = response.data.question;
            setOriginalQuestion(question);
            setQuestionText(question.questionText || "");
            setQuestionType(
              question.questionType === "MCQ" 
                ? "Multiple Choice (MCQ)" 
                : question.questionType || "Multiple Choice (MCQ)"
            );
            setOptions(question.options || { A: "", B: "", C: "", D: "" });
            setCorrectAnswer(
              question.correctAnswer 
                ? `Option ${question.correctAnswer}` 
                : "Option A"
            );
            setExam(question.exam?.name || "");
            setSubject(question.subject?.name || "");
            setTopic(question.topic?.name || "");
            setExplanation(question.explanation || "");
            setQuestionIdDisplay(question.id || questionId);
          }
        } catch (error) {
          console.error("Error fetching question:", error);
        } finally {
          setLoading(false);
        }
      } else if (originalQuestion) {
        // If question data was passed, use it to set question ID display
        setQuestionIdDisplay(originalQuestion.id || questionId || "QB-1442");
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId, originalQuestion]);

  const handleCancel = () => {
    navigate("/creator/question-bank");
  };

  const handleSaveQuestion = () => {
    // TODO: Implement save question functionality
    console.log("Save question");
    // Navigate to question details page after saving
    navigate("/admin/question-details");
  };

  const handleFlagClick = () => {
    setIsFlagModalOpen(true);
  };

  const handleFlagClose = () => {
    setIsFlagModalOpen(false);
    setFlagReason("");
  };

  const handleFlagSubmit = async () => {
    if (!flagReason.trim()) {
      showErrorToast("Please enter a reason for flagging the question.");
      return;
    }

    if (!questionId && !originalQuestion?.id) {
      showErrorToast("Question ID is missing. Cannot flag question.");
      return;
    }

    // Check if question is in the correct status for flagging
    const questionStatus = originalQuestion?.status;
    if (questionStatus !== 'pending_creator') {
      showErrorToast("This question cannot be flagged. Only questions in 'Pending' status can be flagged.");
      handleFlagClose();
      return;
    }

    try {
      setIsFlagging(true);
      const idToUse = questionId || originalQuestion?.id;
      await questionsAPI.flagQuestion(idToUse, flagReason);
      
      // Show success message
      showSuccessToast("Question flagged successfully and sent to processor for review!");
      
      // Close modal and reset
      handleFlagClose();
      
      // Refresh the question data to reflect the status change
      if (questionId) {
        const response = await questionsAPI.getCreatorQuestionById(questionId);
        if (response.success && response.data?.question) {
          const question = response.data.question;
          setOriginalQuestion(question);
        }
      }
      
      // Optionally navigate back or refresh
      // navigate("/creator/question-bank");
    } catch (error) {
      console.error("Error flagging question:", error);
      showErrorToast(error.message || "Failed to flag question. Please try again.");
    } finally {
      setIsFlagging(false);
    }
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

    useEffect(() => {
      if (editorRef.current && editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }, [value]);

    const handleInput = (e) => {
      const html = e.target.innerHTML;
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
          className={`w-full p-4 font-roboto text-[16px] leading-[100%] text-oxford-blue focus:outline-none ${
            !value && !isFocused ? "text-[#9CA3AF]" : ""
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
      <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 lg:px-8 pb-24 relative">
        <div className="mx-auto max-w-[1200px]">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center mb-10">
            <div>
              <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
                {t("creator.createVariants.title")}
              </h1>
              <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
                {loading ? "Loading question..." : `Questions ID: ${questionIdDisplay}`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
              <button
                type="button"
                onClick={handleAddVariant}
                className="flex h-[36px] items-center justify-center rounded-[8px] bg-[#ED4122] px-4 md:px-6 text-[14px] md:text-[16px] font-archivo font-medium leading-[16px] text-white transition hover:bg-[#d43a1f]"
              >
                + Add New Variant
              </button>
            </div>
          </header>

          {/* Main Content - Two Columns */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-oxford-blue text-lg font-roboto">Loading question data...</div>
            </div>
          ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Question Details (2/3 width on xl screens) */}
            <div className="xl:col-span-2 space-y-[30px]">
              <div className=" bg-white rounded-[14px] border border-[#03274633] px-[30px] pt-[50px] pb-10">
                <h2 className="text-[20px] font-archivo leading-[32px] font-bold text-blue-dark mb-[30px]">
                  Original Question
                </h2>

                <div className="space-y-6">
                  {/* Question Text */}
                  <div>
                    <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-5">
                      {t("creator.createVariants.fields.questionText")}
                    </label>
                    <RichTextEditor
                      value={questionText}
                      onChange={setQuestionText}
                      placeholder={t(
                        "creator.createVariants.placeholders.questionText"
                      )}
                      minHeight="200px"
                    />
                  </div>

                  {/* Question Type */}
                  <div>
                    <label className="block  text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                      {t("creator.createVariants.fields.questionType")}
                    </label>
                    <Dropdown
                      value={questionType}
                      onChange={setQuestionType}
                      options={[
                        t("creator.createVariants.questionTypes.multipleChoice"),
                        t("creator.createVariants.questionTypes.trueFalse"),
                        t("creator.createVariants.questionTypes.shortAnswer"),
                        t("creator.createVariants.questionTypes.essay"),
                      ]}
                    />
                  </div>

                  {/* Options Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                          {t("creator.createVariants.fields.optionA")}
                        </label>
                        <input
                          type="text"
                          value={options.A}
                          onChange={(e) =>
                            handleOptionChange("A", e.target.value)
                          }
                          className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                          {t("creator.createVariants.fields.optionC")}
                        </label>
                        <input
                          type="text"
                          value={options.C}
                          onChange={(e) =>
                            handleOptionChange("C", e.target.value)
                          }
                          className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                          {t("creator.createVariants.fields.optionB")}
                        </label>
                        <input
                          type="text"
                          value={options.B}
                          onChange={(e) =>
                            handleOptionChange("B", e.target.value)
                          }
                          className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                          {t("creator.createVariants.fields.optionD")}
                        </label>
                        <input
                          type="text"
                          value={options.D}
                          onChange={(e) =>
                            handleOptionChange("D", e.target.value)
                          }
                          className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Correct Answer */}
                  <div>
                    <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                      {t("creator.createVariants.fields.correctAnswer")}
                    </label>
                    <Dropdown
                      value={correctAnswer}
                      onChange={setCorrectAnswer}
                      options={[
                        t("creator.createVariants.correctAnswerOptions.optionA"),
                        t("creator.createVariants.correctAnswerOptions.optionB"),
                        t("creator.createVariants.correctAnswerOptions.optionC"),
                        t("creator.createVariants.correctAnswerOptions.optionD"),
                      ]}
                    />
                  </div>
                </div>
              </div>
              
              {/* Variants - Dynamically rendered */}
              {variants.map((variant, index) => (
                <div key={variant.id} className=" bg-white rounded-[14px] border border-[#03274633] px-[30px] pt-[50px] pb-10">
                  <h2 className="text-[20px] font-archivo leading-[32px] font-bold text-blue-dark mb-[30px]">
                    Variant # {index + 1}
                  </h2>

                  <div className="space-y-6">
                    {/* Question Text */}
                    <div>
                      <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-5">
                        {t("creator.createVariants.fields.questionText")}
                      </label>
                      <RichTextEditor
                        value={variant.questionText}
                        onChange={(value) => handleVariantQuestionTextChange(variant.id, value)}
                        placeholder={t(
                          "creator.createVariants.placeholders.questionText"
                        )}
                        minHeight="200px"
                      />
                    </div>

                    {/* Question Type */}
                    <div>
                      <label className="block  text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                        {t("creator.createVariants.fields.questionType")}
                      </label>
                      <Dropdown
                        value={variant.questionType}
                        onChange={(value) => handleVariantQuestionTypeChange(variant.id, value)}
                        options={[
                          t("creator.createVariants.questionTypes.multipleChoice"),
                          t("creator.createVariants.questionTypes.trueFalse"),
                          t("creator.createVariants.questionTypes.shortAnswer"),
                          t("creator.createVariants.questionTypes.essay"),
                        ]}
                      />
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                            {t("creator.createVariants.fields.optionA")}
                          </label>
                          <input
                            type="text"
                            value={variant.options.A}
                            onChange={(e) =>
                              handleVariantOptionChange(variant.id, "A", e.target.value)
                            }
                            className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                            {t("creator.createVariants.fields.optionC")}
                          </label>
                          <input
                            type="text"
                            value={variant.options.C}
                            onChange={(e) =>
                              handleVariantOptionChange(variant.id, "C", e.target.value)
                            }
                            className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                            {t("creator.createVariants.fields.optionB")}
                          </label>
                          <input
                            type="text"
                            value={variant.options.B}
                            onChange={(e) =>
                              handleVariantOptionChange(variant.id, "B", e.target.value)
                            }
                            className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                            {t("creator.createVariants.fields.optionD")}
                          </label>
                          <input
                            type="text"
                            value={variant.options.D}
                            onChange={(e) =>
                              handleVariantOptionChange(variant.id, "D", e.target.value)
                            }
                            className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Correct Answer */}
                    <div>
                      <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                        {t("creator.createVariants.fields.correctAnswer")}
                      </label>
                      <Dropdown
                        value={variant.correctAnswer}
                        onChange={(value) => handleVariantCorrectAnswerChange(variant.id, value)}
                        options={[
                          t("creator.createVariants.correctAnswerOptions.optionA"),
                          t("creator.createVariants.correctAnswerOptions.optionB"),
                          t("creator.createVariants.correctAnswerOptions.optionC"),
                          t("creator.createVariants.correctAnswerOptions.optionD"),
                        ]}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Classification (1/3 width on xl screens) */}
            <div className="bg-white rounded-[14px] border border-[#03274633] px-[30px] pt-[50px] pb-10 h-[725px]">
              <h2 className="text-[20px] leading-[100%] font-bold font-archivo text-blue-dark mb-6">
                {t("creator.createVariants.classification.title")}
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    Exam
                  </label>
                  <Dropdown
                    value={exam}
                    onChange={setExam}
                    options={[
                      "Select Exam",
                      originalQuestion?.exam?.name || "",
                      "Math",
                      "Science",
                      "History",
                      "Geography",
                    ].filter(Boolean)}
                  />
                </div>
                {/* Subject */}
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t("creator.createVariants.fields.subject")}
                  </label>
                  <Dropdown
                    value={subject}
                    onChange={setSubject}
                    options={[
                      t("creator.createVariants.placeholders.selectSubject"),
                      "Math",
                      "Science",
                      "History",
                      "Geography",
                    ]}
                  />
                </div>

                {/* Topic */}
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t("creator.createVariants.fields.topic")}
                  </label>
                  <Dropdown
                    value={topic}
                    onChange={setTopic}
                    options={[
                      t("creator.createVariants.placeholders.selectTopic"),
                      "Algebra",
                      "Geometry",
                      "Calculus",
                    ]}
                  />
                </div>

                {/* Cognitive Level */}
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t("creator.createVariants.fields.cognitiveLevel")}
                  </label>
                  <Dropdown
                    value={cognitiveLevel}
                    onChange={setCognitiveLevel}
                    options={[
                      t("creator.createVariants.placeholders.selectLevel"),
                      t("creator.createVariants.cognitiveLevels.remember"),
                      t("creator.createVariants.cognitiveLevels.understand"),
                      t("creator.createVariants.cognitiveLevels.apply"),
                      t("creator.createVariants.cognitiveLevels.analyze"),
                      t("creator.createVariants.cognitiveLevels.evaluate"),
                      t("creator.createVariants.cognitiveLevels.create"),
                    ]}
                  />
                </div>

                {/* Source */}
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t("creator.createVariants.fields.source")}
                  </label>
                  <Dropdown
                    value={source}
                    onChange={setSource}
                    options={[
                      t("creator.createVariants.placeholders.selectSource"),
                      t("creator.createVariants.sources.textbook"),
                      t("creator.createVariants.sources.pastExam"),
                      t("creator.createVariants.sources.custom"),
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
      
      {/* Sticky Footer Buttons - Only within page content */}
      <div className="sticky bottom-0 bg-white border-t border-[#E5E7EB] shadow-lg z-40 mt-6 overflow-x-hidden">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 py-4">
            <OutlineButton text={t("creator.createVariants.cancel")} className="py-[10px] px-7 text-nowrap" onClick={handleCancel}/>
            <OutlineButton text={t("creator.createVariants.saveDraft")} className="py-[10px] px-7 text-nowrap" onClick={handleSaveDraft}/>
            <button
              type="button"
              onClick={handleFlagClick}
              className="flex h-[36px] items-center justify-center rounded-[8px] border border-[#ED4122] bg-white px-4 md:px-7 text-[14px] md:text-[16px] font-archivo font-semibold leading-[16px] text-[#ED4122] transition hover:bg-[#FDF0D5] text-nowrap py-[10px]"
            >
              Flag Question
            </button>
            <PrimaryButton 
              text={isSubmitting ? "Submitting..." : t("creator.createVariants.submitVariant")} 
              className="py-[10px] px-7 text-nowrap"
              onClick={handleSubmit}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Flag Question Modal */}
      {isFlagModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-[600px] w-full p-8">
            <h2 className="text-[24px] leading-[100%] font-bold text-oxford-blue mb-2">
              Flag Question
            </h2>
            <p className="text-[16px] leading-[100%] font-normal text-dark-gray mb-6">
              Please provide a reason for flagging this question. This will send the question back to the processor for review.
            </p>
            
            <div className="mb-6">
              <label className="block text-[16px] leading-[100%] font-roboto font-normal text-oxford-blue mb-2">
                Reason for Flagging
              </label>
              <textarea
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                placeholder="Enter the reason for flagging this question..."
                className="w-full h-[120px] rounded-[8px] border border-[#03274633] bg-white px-4 py-3 font-roboto text-[16px] leading-[20px] text-oxford-blue outline-none placeholder:text-[#9CA3AF] resize-none focus:border-oxford-blue"
                disabled={isFlagging}
              />
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleFlagClose}
                disabled={isFlagging}
                className="flex-1 font-roboto px-4 py-3 border-[0.5px] text-base font-normal border-[#032746] rounded-lg text-blue-dark hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              
              <button
                onClick={handleFlagSubmit}
                disabled={isFlagging || !flagReason.trim()}
                className="flex-1 font-roboto px-4 py-3 bg-[#ED4122] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d43a1f]"
              >
                {isFlagging ? "Flagging..." : "Submit Flag"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatorVariantsPage;
