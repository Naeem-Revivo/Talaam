import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton, PrimaryButton } from "../../components/common/Button";
import adminAPI from "../../api/admin";
import questionsAPI from "../../api/questions";
import examsAPI from "../../api/exams";
import subjectsAPI from "../../api/subjects";
import topicsAPI from "../../api/topics";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig";
import { getCorrectAnswerLetter } from "../../components/admin/questionBank/utils/questionHelpers";
import CreatorHeader from "../../components/admin/questionBank/creator/CreatorHeader";
import FlaggedVariantBanner from "../../components/admin/questionBank/creator/FlaggedVariantBanner";
import OriginalQuestionForm from "../../components/admin/questionBank/creator/OriginalQuestionForm";
import VariantForm from "../../components/admin/questionBank/creator/VariantForm";
import ClassificationSection from "../../components/admin/questionBank/creator/ClassificationSection";
import CreatorFlagModal from "../../components/admin/questionBank/creator/modals/CreatorFlagModal";
import CreatorRejectFlagModal from "../../components/admin/questionBank/creator/modals/CreatorRejectFlagModal";

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
  const [isFlagging, setIsFlagging] = useState(false);
  
  // Reject flag modal state
  const [isRejectFlagModalOpen, setIsRejectFlagModalOpen] = useState(false);
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
  };

  const handleFlagSubmit = async (flagReason) => {
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
  };

  const handleRejectFlagSubmit = async (flagRejectionReason) => {
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
      <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 lg:px-8 pb-24 relative" dir={dir}>
        <div className="mx-auto max-w-[1200px]">
          {/* Header */}
          <CreatorHeader
            questionIdDisplay={questionIdDisplay}
            loading={loading}
            isEditMode={isEditMode}
            isFlagged={isFlagged}
            onAddVariant={handleAddVariant}
            t={t}
          />

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
              <FlaggedVariantBanner
                originalQuestion={originalQuestion}
                flagType={flagType}
                onRejectFlagClick={handleRejectFlagClick}
                t={t}
              />
              
              {!isEditMode && (
                <OriginalQuestionForm
                  questionText={questionText}
                  setQuestionText={setQuestionText}
                  questionType={questionType}
                  handleQuestionTypeChange={handleQuestionTypeChange}
                  options={options}
                  handleOptionChange={handleOptionChange}
                  correctAnswer={correctAnswer}
                  setCorrectAnswer={setCorrectAnswer}
                  t={t}
                />
              )}

              {/* Variants */}
              {variants.length > 0 && variants.map((variant, index) => (
                <VariantForm
                  key={variant.id}
                  variant={variant}
                  index={index + 1}
                  onDelete={handleDeleteVariant}
                  onQuestionTextChange={handleVariantQuestionTextChange}
                  onQuestionTypeChange={handleVariantQuestionTypeChange}
                  onOptionChange={handleVariantOptionChange}
                  onCorrectAnswerChange={handleVariantCorrectAnswerChange}
                  t={t}
                />
              ))}
            </div>

            {/* Right Column - Classification (1/3 width on xl screens) */}
            <ClassificationSection
              examName={examName}
              handleExamChange={handleExamChange}
              subjectName={subjectName}
              handleSubjectChange={handleSubjectChange}
              topicName={topicName}
              handleTopicChange={handleTopicChange}
              source={source}
              setSource={setSource}
              loadingExams={loadingExams}
              loadingSubjects={loadingSubjects}
              loadingTopics={loadingTopics}
              exams={exams}
              subjects={subjects}
              topics={topics}
              examId={examId}
              subjectId={subjectId}
              t={t}
            />
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
      <CreatorFlagModal
        isOpen={isFlagModalOpen}
        onClose={handleFlagClose}
        onConfirm={handleFlagSubmit}
        isFlagging={isFlagging}
        t={t}
      />

      {/* Reject Flag Modal */}
      <CreatorRejectFlagModal
        isOpen={isRejectFlagModalOpen}
        onClose={handleRejectFlagClose}
        onConfirm={handleRejectFlagSubmit}
        isRejectingFlag={isRejectingFlag}
        t={t}
      />
    </>
  );
};

export default AdminPendingCreatorViewQuestion;
