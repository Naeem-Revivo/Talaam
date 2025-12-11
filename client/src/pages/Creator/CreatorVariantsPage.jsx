import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton, PrimaryButton } from "../../components/common/Button";
import RichTextEditor from "../../components/common/RichTextEditor";
import questionsAPI from "../../api/questions";
import examsAPI from "../../api/exams";
import subjectsAPI from "../../api/subjects";
import topicsAPI from "../../api/topics";
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
          <ul 
            className="absolute left-0 top-full z-10 mt-1 w-full rounded-lg border border-gray-100 bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {options.map((option) => (
              <li
                key={option}
                onClick={(e) => {
                  e.stopPropagation();
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
  const variantToEdit = location.state?.variant || null;
  const isEditMode = location.state?.isFlagged === true && variantToEdit;
  const [originalQuestion, setOriginalQuestion] = useState(location.state?.originalQuestion || location.state?.question || null);
  const [loading, setLoading] = useState(!originalQuestion && !questionId && !isEditMode);
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
  
  // Classification state - storing IDs and names (like gatherer page)
  const [examId, setExamId] = useState("");
  const [examName, setExamName] = useState(originalQuestion?.exam?.name || "");
  const [subjectId, setSubjectId] = useState("");
  const [subjectName, setSubjectName] = useState(originalQuestion?.subject?.name || "");
  const [topicId, setTopicId] = useState("");
  const [topicName, setTopicName] = useState(originalQuestion?.topic?.name || "");
  const [source, setSource] = useState("");
  const [explanation, setExplanation] = useState(originalQuestion?.explanation || "");

  // Classification data lists
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);

  // Loading states
  const [loadingExams, setLoadingExams] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);
  
  // Flag modal state
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [isFlagging, setIsFlagging] = useState(false);

  // Variants state - array of variant objects
  // If in edit mode, initialize with the variant to edit
  const [variants, setVariants] = useState(
    isEditMode && variantToEdit
      ? [
          {
            id: variantToEdit.id || 1,
            questionText: variantToEdit.questionText || "",
            questionType: variantToEdit.questionType === "MCQ" 
              ? "Multiple Choice (MCQ)" 
              : variantToEdit.questionType || "Multiple Choice (MCQ)",
            options: variantToEdit.options || { A: "", B: "", C: "", D: "" },
            correctAnswer: variantToEdit.correctAnswer 
              ? `Option ${variantToEdit.correctAnswer}` 
              : "Option A",
            explanation: variantToEdit.explanation || "",
          },
        ]
      : [
          {
            id: 1,
            questionText: "",
            questionType: "Multiple Choice (MCQ)",
            options: { A: "", B: "", C: "", D: "" },
            correctAnswer: "Option A",
          },
        ]
  );

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
      prev.map((variant) => {
        if (variant.id === variantId) {
          // If True/False is selected, reset options and correct answer
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
  
  // Handle question type change for original question
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
    showSuccessToast("Variant created");
  };

  const handleDeleteVariant = (variantId) => {
    setVariants((prev) => prev.filter((v) => v.id !== variantId));
    showSuccessToast("Variant deleted");
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle exam selection
  const handleExamChange = (selectedExamName) => {
    if (selectedExamName === "Select exam" || selectedExamName === t("gatherer.addNewQuestion.messages.noExamsAvailable")) {
      setExamId("");
      setExamName("");
      setSubjects([]);
      setSubjectId("");
      setSubjectName("");
      setTopics([]);
      setTopicId("");
      setTopicName("");
      return;
    }
    
    const selectedExam = exams.find((e) => e.name === selectedExamName);
    if (selectedExam) {
      setExamId(selectedExam.id);
      setExamName(selectedExamName);
    } else {
      setExamId("");
      setExamName("");
    }
    setSubjectId("");
    setSubjectName("");
    setTopics([]);
    setTopicId("");
    setTopicName("");
  };

  // Handle subject selection
  const handleSubjectChange = (selectedSubjectName) => {
    if (selectedSubjectName === t("gatherer.addNewQuestion.messages.selectExamFirst") || 
        selectedSubjectName === t("gatherer.addNewQuestion.messages.noSubjectsAvailable")) {
      setSubjectId("");
      setSubjectName("");
      setTopics([]);
      setTopicId("");
      setTopicName("");
      return;
    }

    const selectedSubject = subjects.find((s) => s.name === selectedSubjectName);
    if (selectedSubject) {
      setSubjectId(selectedSubject.id);
      setSubjectName(selectedSubjectName);
    } else {
      setSubjectId("");
      setSubjectName("");
    }
    setTopicId("");
    setTopicName("");
  };

  // Handle topic selection
  const handleTopicChange = (selectedTopicName) => {
    if (selectedTopicName === t("gatherer.addNewQuestion.messages.selectSubjectFirst") || 
        selectedTopicName === t("gatherer.addNewQuestion.messages.noTopicsAvailable")) {
      setTopicId("");
      setTopicName("");
      return;
    }

    const selectedTopic = topics.find((t) => t.name === selectedTopicName);
    if (selectedTopic) {
      setTopicId(selectedTopic.id);
      setTopicName(selectedTopicName);
    } else {
      setTopicId("");
      setTopicName("");
    }
  };

  const handleSaveDraft = () => {
    // TODO: Implement save draft functionality
    console.log("Save draft");
  };

  const handleSubmit = async () => {
    // If in edit mode, handle updating flagged variant
    if (isEditMode && variantToEdit) {
      try {
        setIsSubmitting(true);
        const variantId = variantToEdit.id;
        const validVariant = variants.find(
          (variant) => variant.questionText && variant.questionText.trim() !== ""
        );

        if (!validVariant) {
          showErrorToast("Variant question text is required.");
          setIsSubmitting(false);
          return;
        }
        
        // Convert question type from display format to API format
        const questionTypeMap = {
          "Multiple Choice (MCQ)": "MCQ",
          "True/False": "TRUE_FALSE",
        };
        const apiQuestionType = questionTypeMap[validVariant.questionType] || "MCQ";
        
        // Extract correct answer - handle True/False differently
        let correctAnswerLetter;
        if (apiQuestionType === "TRUE_FALSE") {
          // Map "True" to "A" and "False" to "B"
          correctAnswerLetter = validVariant.correctAnswer === "True" ? "A" : "B";
        } else {
          // Extract correct answer letter from "Option A" format
          correctAnswerLetter = validVariant.correctAnswer.replace("Option ", "").trim();
        }

        const variantData = {
          questionText: validVariant.questionText.trim(),
          questionType: apiQuestionType,
          options: {
            A: validVariant.options.A?.trim() || (apiQuestionType === "TRUE_FALSE" ? "True" : ""),
            B: validVariant.options.B?.trim() || (apiQuestionType === "TRUE_FALSE" ? "False" : ""),
            C: validVariant.options.C?.trim() || "",
            D: validVariant.options.D?.trim() || "",
          },
          correctAnswer: correctAnswerLetter,
          explanation: validVariant.explanation?.trim() || "",
        };

        await questionsAPI.updateFlaggedVariant(variantId, variantData);
        showSuccessToast("Variant updated successfully. Sent to processor for review.");
        setTimeout(() => {
          navigate("/creator/question-bank/variants-list");
        }, 1500);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to update variant";
        showErrorToast(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Original create mode logic
    if (!questionId && !originalQuestion?.id) {
      showErrorToast("Question ID is missing. Cannot submit question.");
      return;
    }

    let shouldRedirect = false;
    let redirectPath = "/creator/question-bank";
    try {
      setIsSubmitting(true);
      const idToUse = questionId || originalQuestion?.id;

      // Filter out empty variants (variants with no question text)
      // Creating variants is OPTIONAL - if no variants are created, we still submit the question
      const validVariants = variants.filter(
        (variant) => variant.questionText && variant.questionText.trim() !== ""
      );

      // If there are valid variants, create them first
      if (validVariants.length > 0) {
        // Create all variants
        const variantPromises = validVariants.map((variant) => {
          // Convert question type from display format to API format
          const questionTypeMap = {
            "Multiple Choice (MCQ)": "MCQ",
            "True/False": "TRUE_FALSE",
          };
          const apiQuestionType = questionTypeMap[variant.questionType] || "MCQ";
          
          // Extract correct answer - handle True/False differently
          let correctAnswerLetter;
          if (apiQuestionType === "TRUE_FALSE") {
            // Map "True" to "A" and "False" to "B"
            correctAnswerLetter = variant.correctAnswer === "True" ? "A" : "B";
          } else {
            // Extract correct answer letter from "Option A" format
            correctAnswerLetter = variant.correctAnswer.replace("Option ", "").trim();
          }

          // Use classification IDs from state (or fallback to original question)
          const variantExamId = examId || (typeof originalQuestion?.exam === 'string' 
            ? originalQuestion.exam 
            : (originalQuestion?.exam?.id || originalQuestion?.examId || null));
          const variantSubjectId = subjectId || (typeof originalQuestion?.subject === 'string' 
            ? originalQuestion.subject 
            : (originalQuestion?.subject?.id || originalQuestion?.subjectId || null));
          const variantTopicId = topicId || (typeof originalQuestion?.topic === 'string' 
            ? originalQuestion.topic 
            : (originalQuestion?.topic?.id || originalQuestion?.topicId || null));

          const variantData = {
            questionText: variant.questionText.trim(),
            questionType: apiQuestionType,
            options: {
              A: variant.options.A?.trim() || (apiQuestionType === "TRUE_FALSE" ? "True" : ""),
              B: variant.options.B?.trim() || (apiQuestionType === "TRUE_FALSE" ? "False" : ""),
              C: variant.options.C?.trim() || "",
              D: variant.options.D?.trim() || "",
            },
            correctAnswer: correctAnswerLetter,
            exam: variantExamId,
            subject: variantSubjectId,
            topic: variantTopicId,
            explanation: explanation?.trim() || "",
            // Note: source/reference is not stored in database, so not included in variantData
          };

          return questionsAPI.createQuestionVariant(idToUse, variantData).catch((error) => {
            // Wrap error to include variant context
            const errorMsg = error?.message || error?.response?.data?.message || "Failed to create variant";
            throw new Error(`Failed to create variant: ${errorMsg}`);
          });
        });

        // Wait for all variants to be created
        // If any fail, Promise.all will reject with the first error
        await Promise.all(variantPromises);
        // Note: Server-side automatically updates original question status to 'pending_processor' when variants are created
        // So we should NOT try to submit again - the server already handled it
        
        // Show success message
        showSuccessToast(`Successfully created ${validVariants.length} variant(s)!`);
        shouldRedirect = true;
        // Redirect to question bank page after creating variants
        redirectPath = "/creator/question-bank";
      } else {
        // No variants created - submit the question explicitly
        try {
          await questionsAPI.submitQuestionByCreator(idToUse);
          showSuccessToast("Question submitted successfully (no variants created).");
          shouldRedirect = true;
        } catch (submitError) {
          // If submitQuestionByCreator fails, try alternative method
          console.warn("Primary submit method failed, trying alternative:", submitError);
          try {
            await questionsAPI.updateQuestion(idToUse, { status: 'pending_processor' });
            showSuccessToast("Question submitted successfully (no variants created).");
            shouldRedirect = true;
          } catch (altError) {
            // If both methods fail, throw the error
            throw new Error(altError.message || "Failed to submit question. Please try again.");
          }
        }
      }
    } catch (error) {
      console.error("Error submitting question:", error);
      // Extract error message - handle both string and object errors
      let errorMessage = "Failed to submit question. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showErrorToast(errorMessage);
    } finally {
      setIsSubmitting(false);
      // Redirect only if everything succeeded
      if (shouldRedirect) {
        navigate(redirectPath);
      }
    }
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
            // Set classification with IDs
            if (question.exam) {
              const examIdValue = typeof question.exam === 'string' ? question.exam : (question.exam?.id || question.examId);
              const examNameValue = typeof question.exam === 'string' ? "" : (question.exam?.name || "");
              setExamId(examIdValue || "");
              setExamName(examNameValue || "");
            }
            if (question.subject) {
              const subjectIdValue = typeof question.subject === 'string' ? question.subject : (question.subject?.id || question.subjectId);
              const subjectNameValue = typeof question.subject === 'string' ? "" : (question.subject?.name || "");
              setSubjectId(subjectIdValue || "");
              setSubjectName(subjectNameValue || "");
            }
            if (question.topic) {
              const topicIdValue = typeof question.topic === 'string' ? question.topic : (question.topic?.id || question.topicId);
              const topicNameValue = typeof question.topic === 'string' ? "" : (question.topic?.name || "");
              setTopicId(topicIdValue || "");
              setTopicName(topicNameValue || "");
            }
            setExplanation(question.explanation || "");
            setQuestionIdDisplay(question.id || questionId);
          }
        } catch (error) {
          console.error("Error fetching question:", error);
        } finally {
          setLoading(false);
        }
      } else if (originalQuestion) {
        // If question data was passed, use it to set question ID display and classification
        setQuestionIdDisplay(originalQuestion.id || questionId || "QB-1442");
        // Set classification with IDs from original question
        if (originalQuestion.exam) {
          const examIdValue = typeof originalQuestion.exam === 'string' ? originalQuestion.exam : (originalQuestion.exam?.id || originalQuestion.examId);
          const examNameValue = typeof originalQuestion.exam === 'string' ? "" : (originalQuestion.exam?.name || "");
          setExamId(examIdValue || "");
          setExamName(examNameValue || "");
        }
        if (originalQuestion.subject) {
          const subjectIdValue = typeof originalQuestion.subject === 'string' ? originalQuestion.subject : (originalQuestion.subject?.id || originalQuestion.subjectId);
          const subjectNameValue = typeof originalQuestion.subject === 'string' ? "" : (originalQuestion.subject?.name || "");
          setSubjectId(subjectIdValue || "");
          setSubjectName(subjectNameValue || "");
        }
        if (originalQuestion.topic) {
          const topicIdValue = typeof originalQuestion.topic === 'string' ? originalQuestion.topic : (originalQuestion.topic?.id || originalQuestion.topicId);
          const topicNameValue = typeof originalQuestion.topic === 'string' ? "" : (originalQuestion.topic?.name || "");
          setTopicId(topicIdValue || "");
          setTopicName(topicNameValue || "");
        }
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
      
      // Navigate to question bank page
      navigate("/creator/question-bank");
    } catch (error) {
      console.error("Error flagging question:", error);
      showErrorToast(error.message || "Failed to flag question. Please try again.");
    } finally {
      setIsFlagging(false);
    }
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
            {!isEditMode && (
            <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
              <button
                type="button"
                onClick={handleAddVariant}
                className="flex h-[36px] items-center justify-center rounded-[8px] bg-[#ED4122] px-4 md:px-6 text-[14px] md:text-[16px] font-archivo font-medium leading-[16px] text-white transition hover:bg-[#d43a1f]"
              >
                + Add New Variant
              </button>
            </div>
            )}
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
              {!isEditMode && (
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
                      onChange={handleQuestionTypeChange}
                      options={[
                        t("creator.createVariants.questionTypes.multipleChoice"),
                        t("creator.createVariants.questionTypes.trueFalse"),
                      ]}
                    />
                  </div>

                  {/* Options Grid - Show 2 options for True/False, 4 for MCQ */}
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
                  )}

                  {/* Correct Answer */}
                  <div>
                    <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                      {t("creator.createVariants.fields.correctAnswer")}
                    </label>
                    {questionType === "True/False" ? (
                      <Dropdown
                        value={correctAnswer}
                        onChange={setCorrectAnswer}
                        options={["True", "False"]}
                      />
                    ) : (
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
                    )}
                  </div>
                </div>
              </div>
              )}

              {/* Variants - Dynamically rendered */}
              {variants.map((variant, index) => (
                <div key={variant.id} className=" bg-white rounded-[14px] border border-[#03274633] px-[30px] pt-[50px] pb-10">
                  <div className="flex items-center justify-between mb-[30px]">
                    <h2 className="text-[20px] font-archivo leading-[32px] font-bold text-blue-dark">
                    Variant # {index + 1}
                  </h2>
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
                        ]}
                      />
                    </div>

                    {/* Options Grid - Show 2 options for True/False, 4 for MCQ */}
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
                    )}

                    {/* Correct Answer */}
                    <div>
                      <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                        {t("creator.createVariants.fields.correctAnswer")}
                      </label>
                      {variant.questionType === "True/False" ? (
                        <Dropdown
                          value={variant.correctAnswer}
                          onChange={(value) => handleVariantCorrectAnswerChange(variant.id, value)}
                          options={["True", "False"]}
                        />
                      ) : (
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
                      )}
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
                {/* Exam */}
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
                        ? [
                            "Select exam",
                            ...exams.map((exam) => exam.name || "Unnamed Exam").filter(Boolean)
                          ]
                        : [t('gatherer.addNewQuestion.messages.noExamsAvailable')]
                    }
                  />
                </div>

                {/* Subject */}
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
            {!isEditMode && (
              <>
                <OutlineButton text={t("creator.createVariants.saveDraft")} className="py-[10px] px-7 text-nowrap" onClick={handleSaveDraft}/>
                <button
                  type="button"
                  onClick={handleFlagClick}
                  className="flex h-[36px] items-center justify-center rounded-[8px] border border-[#ED4122] bg-white px-4 md:px-7 text-[14px] md:text-[16px] font-archivo font-semibold leading-[16px] text-[#ED4122] transition hover:bg-[#FDF0D5] text-nowrap py-[10px]"
                >
                  Flag Question
                </button>
              </>
            )}
            <PrimaryButton 
              text={isSubmitting ? (isEditMode ? "Updating..." : "Submitting...") : (isEditMode ? "Update Variant" : t("creator.createVariants.submitVariant"))} 
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


