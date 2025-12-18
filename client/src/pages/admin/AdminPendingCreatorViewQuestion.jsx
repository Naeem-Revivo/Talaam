import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton, PrimaryButton } from "../../components/common/Button";
import RichTextEditor from "../../components/common/RichTextEditor";
import adminAPI from "../../api/admin";
import questionsAPI from "../../api/questions";
import examsAPI from "../../api/exams";
import subjectsAPI from "../../api/subjects";
import topicsAPI from "../../api/topics";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig";

// Helper function to extract correct answer letter (handles both string and object formats)
const getCorrectAnswerLetter = (correctAnswerValue) => {
  if (!correctAnswerValue) return null;
  if (typeof correctAnswerValue === 'string') return correctAnswerValue;
  if (typeof correctAnswerValue === 'object') {
    // Handle object format like {option: 'A', text: 'Some text'}
    return correctAnswerValue.option || correctAnswerValue.text || null;
  }
  return String(correctAnswerValue);
};

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
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""
          }`}
        >
          <path
            d="M0.6875 0.726562L7.00848 6.71211L13.3295 0.726562"
            stroke="#032746"
            strokeWidth="2"
          />
        </svg>

        {/* Dropdown Menu */}
        {isOpen && options && options.length > 0 && (
          <ul 
            className="absolute left-0 top-full z-10 mt-1 w-full rounded-lg border border-gray-100 bg-white shadow-lg max-h-60 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {options.map((option, index) => (
              <li
                key={`${option}-${index}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${value === option ? "font-semibold text-oxford-blue bg-gray-50" : "text-gray-700"
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

const AdminPendingCreatorViewQuestion = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  
  // Get current user from Redux
  const { user } = useSelector((state) => state.auth || {});
  const isSuperAdmin = user?.role === 'superadmin';
  
  // Get question data from search params
  const questionId = searchParams.get("questionId");
  const variantToEdit = null; // Not used in admin view, but keeping for consistency
  const isEditMode = false; // Admin view doesn't have edit mode for variants
  
  const [originalQuestion, setOriginalQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questionIdDisplay, setQuestionIdDisplay] = useState(questionId || "QB-1442");
  
  // Original question state - initialize from passed data or API
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("Multiple Choice (MCQ)");
  const [options, setOptions] = useState({ A: "", B: "", C: "", D: "" });
  const [correctAnswer, setCorrectAnswer] = useState("Option A");
  
  // Classification state - storing IDs and names
  const [examId, setExamId] = useState("");
  const [examName, setExamName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [topicId, setTopicId] = useState("");
  const [topicName, setTopicName] = useState("");
  const [source, setSource] = useState("");
  const [explanation, setExplanation] = useState("");

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
  
  // Reject flag modal state
  const [isRejectFlagModalOpen, setIsRejectFlagModalOpen] = useState(false);
  const [flagRejectionReason, setFlagRejectionReason] = useState("");
  const [isRejectingFlag, setIsRejectingFlag] = useState(false);
  
  // Check if question/variant is flagged
  const isFlagged = originalQuestion?.isFlagged === true && originalQuestion?.flagStatus === 'approved';
  const flagType = originalQuestion?.flagType || null;

  // Variants state - array of variant objects
  const [variants, setVariants] = useState([]);

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
        options: { 
          A: "",
          B: "", 
          C: "", 
          D: "" 
        },
        correctAnswer: "Option A",
        explanation: "",
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

  const handleSubjectChange = (selectedSubjectName) => {
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

  const handleSubmit = async () => {
    if (!questionId && !originalQuestion?.id) {
      showErrorToast("Question ID is missing. Cannot submit question.");
      return;
    }

      let shouldRedirect = false;
      let redirectPath = "/admin/question-bank/pending-creator";
      try {
        setIsSubmitting(true);
        const idToUse = questionId || originalQuestion?.id;
        
        // If this is a flagged variant, use updateFlaggedVariant API
        if (isFlagged && originalQuestion?.isVariant) {
          // Use first variant or original question data
          const variantToUpdate = variants.length > 0 ? variants[0] : {
            questionText,
            questionType,
            options,
            correctAnswer,
            explanation
          };
          
          const questionTypeMap = {
            "Multiple Choice (MCQ)": "MCQ",
            "True/False": "TRUE_FALSE",
          };
          const apiQuestionType = questionTypeMap[variantToUpdate.questionType] || "MCQ";
          
          let correctAnswerLetter;
          if (apiQuestionType === "TRUE_FALSE") {
            correctAnswerLetter = variantToUpdate.correctAnswer === "True" ? "A" : "B";
          } else {
            correctAnswerLetter = variantToUpdate.correctAnswer.replace("Option ", "").trim();
          }
          
          const updateData = {
            questionText: variantToUpdate.questionText.trim(),
            questionType: apiQuestionType,
            options: {
              A: variantToUpdate.options.A?.trim() || (apiQuestionType === "TRUE_FALSE" ? "True" : ""),
              B: variantToUpdate.options.B?.trim() || (apiQuestionType === "TRUE_FALSE" ? "False" : ""),
              C: variantToUpdate.options.C?.trim() || "",
              D: variantToUpdate.options.D?.trim() || "",
            },
            correctAnswer: correctAnswerLetter,
            explanation: variantToUpdate.explanation?.trim() || explanation?.trim() || "",
          };
          
          await questionsAPI.updateFlaggedVariant(idToUse, updateData);
          showSuccessToast("Variant updated successfully and sent to processor for review!");
          shouldRedirect = true;
          redirectPath = "/admin/question-bank/pending-creator";
          setIsSubmitting(false);
          if (shouldRedirect) {
            navigate(redirectPath);
          }
          return;
        }

      // Validate variants - check if any variant is incomplete
      if (variants.length > 0) {
        const incompleteVariants = variants.filter((variant) => {
          const hasQuestionText = variant.questionText && variant.questionText.trim() !== "";
          if (!hasQuestionText) {
            return true;
          }
          
          const questionType = variant.questionType;
          const isTrueFalse = questionType === "True/False";
          
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
          showErrorToast("Please complete all variant fields before submitting. All variants must have question text, options, and correct answer.");
          setIsSubmitting(false);
          return;
        }
      }

      // Filter out empty variants
      const validVariants = variants.filter(
        (variant) => variant.questionText && variant.questionText.trim() !== ""
      );

      // If there are valid variants, create them first
      if (validVariants.length > 0) {
        const variantPromises = validVariants.map((variant) => {
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
          };

          return questionsAPI.createQuestionVariant(idToUse, variantData).catch((error) => {
            const errorMsg = error?.message || error?.response?.data?.message || "Failed to create variant";
            throw new Error(`Failed to create variant: ${errorMsg}`);
          });
        });

        await Promise.all(variantPromises);
        showSuccessToast(`Successfully created ${validVariants.length} variant(s)!`);
        shouldRedirect = true;
        redirectPath = "/admin/question-bank/pending-creator";
      } else {
        // No variants created - submit the question explicitly
        try {
          await questionsAPI.submitQuestionByCreator(idToUse);
          showSuccessToast("Question submitted successfully (no variants created).");
          shouldRedirect = true;
        } catch (submitError) {
          console.warn("Primary submit method failed, trying alternative:", submitError);
          try {
            await questionsAPI.updateQuestion(idToUse, { status: 'pending_processor' });
            showSuccessToast("Question submitted successfully (no variants created).");
            shouldRedirect = true;
          } catch (altError) {
            throw new Error(altError.message || "Failed to submit question. Please try again.");
          }
        }
      }
    } catch (error) {
      console.error("Error submitting question:", error);
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

  // Fetch question data
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!questionId) {
        showErrorToast("Question ID is missing");
        navigate("/admin/question-bank/pending-creator");
        return;
      }

      try {
        setLoading(true);
        let response;
        
        if (isSuperAdmin) {
          // SuperAdmin uses admin API
          response = await adminAPI.getQuestionDetails(questionId);
          if (response.success && response.data?.question) {
            const question = response.data.question;
            const transformedQuestion = {
              ...question,
              questionText: question.questionText || question.question?.text,
              questionType: question.questionType || question.question?.type,
              options: question.options || question.question?.options,
              correctAnswer: question.correctAnswer || question.question?.correctAnswer,
              explanation: question.explanation,
              exam: question.exam || question.classification?.exam,
              subject: question.subject || question.classification?.subject,
              topic: question.topic || question.classification?.topic,
            };
            setOriginalQuestion(transformedQuestion);
            
            // Set state from transformed question
            setQuestionText(transformedQuestion.questionText || "");
            let displayQuestionType = "Multiple Choice (MCQ)";
            if (transformedQuestion.questionType === "MCQ") {
              displayQuestionType = "Multiple Choice (MCQ)";
            } else if (transformedQuestion.questionType === "TRUE_FALSE") {
              displayQuestionType = "True/False";
            }
            setQuestionType(displayQuestionType);
            setOptions(transformedQuestion.options || { A: "", B: "", C: "", D: "" });
            
            let displayCorrectAnswer = "Option A";
            if (transformedQuestion.correctAnswer) {
              const correctAnswerLetter = getCorrectAnswerLetter(transformedQuestion.correctAnswer);
              if (transformedQuestion.questionType === "TRUE_FALSE") {
                displayCorrectAnswer = correctAnswerLetter === "A" ? "True" : "False";
              } else {
                displayCorrectAnswer = correctAnswerLetter ? `Option ${correctAnswerLetter}` : "Option A";
              }
            }
            setCorrectAnswer(displayCorrectAnswer);
            
            // Set classification
            if (transformedQuestion.exam) {
              const examIdValue = typeof transformedQuestion.exam === 'string' ? transformedQuestion.exam : (transformedQuestion.exam?.id || transformedQuestion.examId);
              const examNameValue = typeof transformedQuestion.exam === 'string' ? "" : (transformedQuestion.exam?.name || "");
              setExamId(examIdValue || "");
              setExamName(examNameValue || "");
            }
            if (transformedQuestion.subject) {
              const subjectIdValue = typeof transformedQuestion.subject === 'string' ? transformedQuestion.subject : (transformedQuestion.subject?.id || transformedQuestion.subjectId);
              const subjectNameValue = typeof transformedQuestion.subject === 'string' ? "" : (transformedQuestion.subject?.name || "");
              setSubjectId(subjectIdValue || "");
              setSubjectName(subjectNameValue || "");
            }
            if (transformedQuestion.topic) {
              const topicIdValue = typeof transformedQuestion.topic === 'string' ? transformedQuestion.topic : (transformedQuestion.topic?.id || transformedQuestion.topicId);
              const topicNameValue = typeof transformedQuestion.topic === 'string' ? "" : (transformedQuestion.topic?.name || "");
              setTopicId(topicIdValue || "");
              setTopicName(topicNameValue || "");
            }
            setExplanation(transformedQuestion.explanation || "");
            setQuestionIdDisplay(transformedQuestion.id || questionId);
            
            // Fetch existing variants
            if (transformedQuestion.variants && transformedQuestion.variants.length > 0) {
              setVariants(transformedQuestion.variants.map((v, idx) => {
                const variantCorrectAnswerLetter = getCorrectAnswerLetter(v.correctAnswer);
                let variantDisplayCorrectAnswer = "Option A";
                if (variantCorrectAnswerLetter) {
                  if (v.questionType === "TRUE_FALSE") {
                    variantDisplayCorrectAnswer = variantCorrectAnswerLetter === "A" ? "True" : "False";
                  } else {
                    variantDisplayCorrectAnswer = `Option ${variantCorrectAnswerLetter}`;
                  }
                }
                return {
                  id: v.id || idx + 1,
                  questionText: v.questionText || "",
                  questionType: v.questionType === "MCQ" ? "Multiple Choice (MCQ)" : v.questionType === "TRUE_FALSE" ? "True/False" : "Multiple Choice (MCQ)",
                  options: v.options || { A: "", B: "", C: "", D: "" },
                  correctAnswer: variantDisplayCorrectAnswer,
                  explanation: v.explanation || "",
                };
              }));
            } else {
              // Try to fetch variants separately
              try {
                const statusesToFetch = ['pending_creator', 'pending_processor', 'completed', 'rejected'];
                const allQuestions = [];
                
                for (const status of statusesToFetch) {
                  try {
                    const variantResponse = await questionsAPI.getCreatorQuestions({ status });
                    if (variantResponse.success && variantResponse.data?.questions) {
                      allQuestions.push(...variantResponse.data.questions);
                    }
                  } catch (err) {
                    // Ignore errors
                  }
                }
                
                const questionIdStr = String(questionId);
                const relatedVariants = allQuestions.filter(
                  (q) => {
                    const isVariant = q.isVariant === true || q.isVariant === 'true';
                    const originalId = q.originalQuestionId || q.originalQuestion;
                    return isVariant && originalId && String(originalId) === questionIdStr;
                  }
                );
                
                if (relatedVariants.length > 0) {
                  setVariants(relatedVariants.map((v, idx) => {
                    const variantCorrectAnswerLetter = getCorrectAnswerLetter(v.correctAnswer);
                    let variantDisplayCorrectAnswer = "Option A";
                    if (variantCorrectAnswerLetter) {
                      if (v.questionType === "TRUE_FALSE") {
                        variantDisplayCorrectAnswer = variantCorrectAnswerLetter === "A" ? "True" : "False";
                      } else {
                        variantDisplayCorrectAnswer = `Option ${variantCorrectAnswerLetter}`;
                      }
                    }
                    return {
                      id: v.id || idx + 1,
                      questionText: v.questionText || "",
                      questionType: v.questionType === "MCQ" ? "Multiple Choice (MCQ)" : v.questionType === "TRUE_FALSE" ? "True/False" : "Multiple Choice (MCQ)",
                      options: v.options || { A: "", B: "", C: "", D: "" },
                      correctAnswer: variantDisplayCorrectAnswer,
                      explanation: v.explanation || "",
                    };
                  }));
                }
              } catch (variantError) {
                console.warn("Could not fetch variants:", variantError);
              }
            }
          } else {
            showErrorToast("Failed to load question");
            navigate("/admin/question-bank/pending-creator");
          }
        } else {
          // Regular admin uses creator API
          response = await questionsAPI.getCreatorQuestionById(questionId);
          
          if (response.success && response.data?.question) {
            const question = response.data.question;
            setOriginalQuestion(question);
            setQuestionText(question.questionText || "");
            let displayQuestionType = "Multiple Choice (MCQ)";
            if (question.questionType === "MCQ") {
              displayQuestionType = "Multiple Choice (MCQ)";
            } else if (question.questionType === "TRUE_FALSE") {
              displayQuestionType = "True/False";
            }
            setQuestionType(displayQuestionType);
            setOptions(question.options || { A: "", B: "", C: "", D: "" });
            
            let displayCorrectAnswer = "Option A";
            if (question.correctAnswer) {
              const correctAnswerLetter = getCorrectAnswerLetter(question.correctAnswer);
              if (question.questionType === "TRUE_FALSE") {
                displayCorrectAnswer = correctAnswerLetter === "A" ? "True" : "False";
              } else {
                displayCorrectAnswer = correctAnswerLetter ? `Option ${correctAnswerLetter}` : "Option A";
              }
            }
            setCorrectAnswer(displayCorrectAnswer);
            
            // Set classification
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
            
            // Fetch variants
            try {
              const statusesToFetch = ['pending_creator', 'pending_processor', 'completed', 'rejected'];
              const allQuestions = [];
              
              for (const status of statusesToFetch) {
                try {
                  const variantResponse = await questionsAPI.getCreatorQuestions({ status });
                  if (variantResponse.success && variantResponse.data?.questions) {
                    allQuestions.push(...variantResponse.data.questions);
                  }
                } catch (err) {
                  // Ignore errors
                }
              }
              
              const questionIdStr = String(questionId);
              const relatedVariants = allQuestions.filter(
                (q) => {
                  const isVariant = q.isVariant === true || q.isVariant === 'true';
                  const originalId = q.originalQuestionId || q.originalQuestion;
                  return isVariant && originalId && String(originalId) === questionIdStr;
                }
              );
              
              if (relatedVariants.length > 0) {
                setVariants(relatedVariants.map((v, idx) => {
                  const variantCorrectAnswerLetter = getCorrectAnswerLetter(v.correctAnswer);
                  let variantDisplayCorrectAnswer = "Option A";
                  if (variantCorrectAnswerLetter) {
                    if (v.questionType === "TRUE_FALSE") {
                      variantDisplayCorrectAnswer = variantCorrectAnswerLetter === "A" ? "True" : "False";
                    } else {
                      variantDisplayCorrectAnswer = `Option ${variantCorrectAnswerLetter}`;
                    }
                  }
                  return {
                    id: v.id || idx + 1,
                    questionText: v.questionText || "",
                    questionType: v.questionType === "MCQ" ? "Multiple Choice (MCQ)" : v.questionType === "TRUE_FALSE" ? "True/False" : "Multiple Choice (MCQ)",
                    options: v.options || { A: "", B: "", C: "", D: "" },
                    correctAnswer: variantDisplayCorrectAnswer,
                    explanation: v.explanation || "",
                  };
                }));
              }
            } catch (variantError) {
              console.warn("Could not fetch variants:", variantError);
            }
          } else {
            showErrorToast("Failed to load question");
            navigate("/admin/question-bank/pending-creator");
          }
        }
      } catch (error) {
        console.error("Error fetching question:", error);
        showErrorToast(error.response?.data?.message || "Failed to load question");
        navigate("/admin/question-bank/pending-creator");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId, navigate, isSuperAdmin]);

  const handleCancel = () => {
    navigate("/admin/question-bank/pending-creator");
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
      
      showSuccessToast("Question flagged successfully and sent to processor for review!");
      handleFlagClose();
      navigate("/admin/question-bank/pending-creator");
    } catch (error) {
      console.error("Error flagging question:", error);
      showErrorToast(error.message || "Failed to flag question. Please try again.");
    } finally {
      setIsFlagging(false);
    }
  };

  const handleRejectFlagClick = () => {
    setIsRejectFlagModalOpen(true);
  };

  const handleRejectFlagClose = () => {
    setIsRejectFlagModalOpen(false);
    setFlagRejectionReason("");
  };

  const handleRejectFlagSubmit = async () => {
    if (!flagRejectionReason.trim()) {
      showErrorToast("Please enter a reason for rejecting the flag.");
      return;
    }

    if (!questionId && !originalQuestion?.id) {
      showErrorToast("Question ID is missing. Cannot reject flag.");
      return;
    }

    if (!isFlagged) {
      showErrorToast("This question is not flagged.");
      handleRejectFlagClose();
      return;
    }

    try {
      setIsRejectingFlag(true);
      const idToUse = questionId || originalQuestion?.id;
      await questionsAPI.rejectFlagByCreator(idToUse, flagRejectionReason);
      
      showSuccessToast("Flag rejected successfully. Question sent back to processor for review!");
      handleRejectFlagClose();
      navigate("/admin/question-bank/pending-creator");
    } catch (error) {
      console.error("Error rejecting flag:", error);
      showErrorToast(error.message || "Failed to reject flag. Please try again.");
    } finally {
      setIsRejectingFlag(false);
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
      <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 lg:px-8 pb-24 relative" dir={dir}>
        <div className="mx-auto max-w-[1200px]">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center mb-10">
            <div>
              <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
                {t("admin.questionBank.pendingCreator.viewQuestion.title") || "Create Variants"}
              </h1>
              <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
                {loading ? "Loading question..." : `Question ID: ${questionIdDisplay}`}
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
              {/* Flag Alert Banner - Show when variant is flagged */}
              {isFlagged && (
                <div className="rounded-[12px] border-2 border-orange-500 bg-orange-50 pt-[20px] px-[30px] pb-[30px] w-full">
                  <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[32px] text-orange-700">
                    {t("creator.flaggedVariant.title") || "Flagged Variant"}
                  </h2>
                  <div className="mb-4">
                    <p className="font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280] mb-2">
                      {flagType === 'student'
                        ? (t("creator.flaggedVariant.descriptionStudent") || "This variant has been flagged by a student with the following reason:")
                        : flagType === 'explainer'
                        ? (t("creator.flaggedVariant.descriptionExplainer") || "This variant has been flagged by an explainer with the following reason:")
                        : (t("creator.flaggedVariant.description") || "This variant has been flagged with the following reason:")}
                    </p>
                  </div>
                  <div
                    className="font-roboto text-[16px] font-normal leading-[24px] text-oxford-blue whitespace-pre-wrap bg-white p-4 rounded-lg border border-orange-200 mb-4"
                    dir="ltr"
                  >
                    {originalQuestion?.flagReason || "No reason provided"}
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleRejectFlagClick}
                      className="flex h-[36px] items-center justify-center rounded-[8px] border border-orange-600 bg-white px-4 text-[14px] font-archivo font-semibold leading-[16px] text-orange-600 transition hover:bg-orange-50"
                    >
                      {t("creator.flaggedVariant.rejectFlag") || "Reject Flag"}
                    </button>
                    <p className="font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280] flex items-center">
                      {t("creator.flaggedVariant.updateHint") || "Update the variant below and click 'Update Variant' to fix the issue."}
                    </p>
                  </div>
                </div>
              )}
              {!isEditMode && (
              <div className="bg-white rounded-[14px] border border-[#03274633] px-[30px] pt-[50px] pb-10">
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
                      placeholder={t("creator.createVariants.placeholders.questionText")}
                      minHeight="200px"
                    />
                  </div>

                  {/* Question Type */}
                  <div>
                    <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
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

                  {/* Options Grid */}
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
                          onChange={(e) => handleOptionChange("A", e.target.value)}
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
                          onChange={(e) => handleOptionChange("C", e.target.value)}
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
                          onChange={(e) => handleOptionChange("B", e.target.value)}
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

              {/* Variants */}
              {variants.length > 0 && variants.map((variant, index) => (
                <div key={variant.id} className="bg-white rounded-[14px] border border-[#03274633] px-[30px] pt-[50px] pb-10">
                  <div className="flex items-center justify-between mb-[30px]">
                    <h2 className="text-[20px] font-archivo leading-[32px] font-bold text-blue-dark">
                      Variant #{index + 1}
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
                        placeholder={t("creator.createVariants.placeholders.questionText")}
                        minHeight="200px"
                      />
                    </div>

                    {/* Question Type */}
                    <div>
                      <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
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

                    {/* Options Grid */}
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
                            onChange={(e) => handleVariantOptionChange(variant.id, "A", e.target.value)}
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
                            onChange={(e) => handleVariantOptionChange(variant.id, "C", e.target.value)}
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
                            onChange={(e) => handleVariantOptionChange(variant.id, "B", e.target.value)}
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
                            onChange={(e) => handleVariantOptionChange(variant.id, "D", e.target.value)}
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
                  <Dropdown
                    label={t('gatherer.addNewQuestion.classification.exam')}
                    value={examName}
                    onChange={handleExamChange}
                    placeholder="Select exam"
                    options={
                      loadingExams
                        ? [t('gatherer.addNewQuestion.messages.loading')]
                        : exams.length > 0
                            ? exams.map((exam) => exam.name || "Unnamed Exam").filter(Boolean)
                        : [t('gatherer.addNewQuestion.messages.noExamsAvailable')]
                    }
                  />
                </div>

                {/* Subject */}
                <div>
                  <Dropdown
                    label={t('gatherer.addNewQuestion.classification.subject')}
                    value={subjectName}
                    onChange={handleSubjectChange}
                    placeholder="Select subject"
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
                  <Dropdown
                    label={t('gatherer.addNewQuestion.classification.topic')}
                    value={topicName}
                    onChange={handleTopicChange}
                    placeholder="Select topic"
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
                    Reference
                  </label>
                  <Dropdown
                    value={source}
                    onChange={setSource}
                    placeholder="Select Reference"
                    options={[
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
      
      {/* Sticky Footer Buttons */}
      <div className="sticky bottom-0 bg-white border-t border-[#E5E7EB] shadow-lg z-40 mt-6 overflow-x-hidden">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 py-4">
            <OutlineButton 
              text={t("creator.createVariants.cancel") || "Cancel"} 
              className="py-[10px] px-7 text-nowrap" 
              onClick={handleCancel} 
            />
            {!isEditMode && !isFlagged && (
              <>
                <button
                  type="button"
                  onClick={handleFlagClick}
                  className="flex h-[36px] items-center justify-center rounded-[8px] border border-[#ED4122] bg-white px-4 md:px-7 text-[14px] md:text-[16px] font-archivo font-semibold leading-[16px] text-[#ED4122] transition hover:bg-[#FDF0D5] text-nowrap py-[10px]"
                >
                  Flag Question
                </button>
              </>
            )}
            {isFlagged && (
              <button
                type="button"
                onClick={handleRejectFlagClick}
                className="flex h-[36px] items-center justify-center rounded-[8px] border border-orange-600 bg-white px-4 md:px-7 text-[14px] md:text-[16px] font-archivo font-semibold leading-[16px] text-orange-600 transition hover:bg-orange-50 text-nowrap py-[10px]"
              >
                {t("creator.flaggedVariant.rejectFlag") || "Reject Flag"}
              </button>
            )}
            <PrimaryButton 
              text={isSubmitting ? "Submitting..." : (isFlagged ? (t("creator.createVariants.updateVariant") || "Update Variant") : (t("creator.createVariants.submitVariant") || "Submit Variant"))} 
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

      {/* Reject Flag Modal */}
      {isRejectFlagModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-[600px] w-full p-8">
            <h2 className="text-[24px] leading-[100%] font-bold text-oxford-blue mb-2">
              {t("creator.flaggedVariant.rejectFlagTitle") || "Reject Flag"}
            </h2>
            <p className="text-[16px] leading-[100%] font-normal text-dark-gray mb-6">
              {t("creator.flaggedVariant.rejectFlagDescription") || "Please provide a reason for rejecting this flag. The question will be sent back to the processor for review."}
            </p>
            
            <div className="mb-6">
              <label className="block text-[16px] leading-[100%] font-roboto font-normal text-oxford-blue mb-2">
                {t("creator.flaggedVariant.rejectionReason") || "Reason for Rejecting Flag"}
              </label>
              <textarea
                value={flagRejectionReason}
                onChange={(e) => setFlagRejectionReason(e.target.value)}
                placeholder={t("creator.flaggedVariant.rejectionReasonPlaceholder") || "Enter the reason for rejecting this flag..."}
                className="w-full h-[120px] rounded-[8px] border border-[#03274633] bg-white px-4 py-3 font-roboto text-[16px] leading-[20px] text-oxford-blue outline-none placeholder:text-[#9CA3AF] resize-none focus:border-oxford-blue"
                disabled={isRejectingFlag}
              />
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleRejectFlagClose}
                disabled={isRejectingFlag}
                className="flex-1 font-roboto px-4 py-3 border-[0.5px] text-base font-normal border-[#032746] rounded-lg text-blue-dark hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("creator.flaggedVariant.cancel") || "Cancel"}
              </button>
              
              <button
                onClick={handleRejectFlagSubmit}
                disabled={isRejectingFlag || !flagRejectionReason.trim()}
                className="flex-1 font-roboto px-4 py-3 bg-[#ED4122] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d43a1f]"
              >
                {isRejectingFlag ? (t("creator.flaggedVariant.rejecting") || "Rejecting...") : (t("creator.flaggedVariant.submitRejection") || "Submit Rejection")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPendingCreatorViewQuestion;
