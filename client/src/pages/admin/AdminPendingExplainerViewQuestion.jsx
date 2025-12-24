import React, { useState, useEffect } from "react";
import RichTextEditor from "../../components/common/RichTextEditor";
import { OutlineButton, PrimaryButton } from "../../components/common/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLanguage } from "../../context/LanguageContext";
import adminAPI from "../../api/admin";
import questionsAPI from "../../api/questions";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig.jsx";
import Loader from "../../components/common/Loader";

// Strip HTML tags and return plain text
const stripHtmlTags = (html) => {
  if (!html) return "—";
  // Create a temporary div element to parse HTML
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  // Get text content which automatically strips HTML tags
  return tmp.textContent || tmp.innerText || "—";
};

// Helper function to extract option text (handles both string and object formats)
const getOptionText = (optionValue) => {
  if (!optionValue) return "—";
  if (typeof optionValue === 'string') return optionValue;
  if (typeof optionValue === 'object') {
    // Handle object format like {option: 'A', text: 'Some text'}
    return optionValue.text || optionValue.option || String(optionValue);
  }
  return String(optionValue);
};

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

// QuestionDetails Component - displays full question
const QuestionDetails = ({
  question,
  isVariant = false,
  variantNumber,
  onFlag,
  isFlagged,
}) => {
  // Helper to safely extract string value from object or string
  const safeString = (value, fallback = "—") => {
    if (!value) return fallback;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return value.name || value.text || value.option || String(value);
    }
    return String(value);
  };
  
  // Map correct answer based on question type
  const getCorrectAnswerDisplay = () => {
    const correctAns = question.correctAnswer;
    if (!correctAns) return "—";
    
    // Extract letter from object or string format
    const correctAnsLetter = getCorrectAnswerLetter(correctAns);
    if (!correctAnsLetter) return "—";
    
    // Handle TRUE_FALSE questions - map A to "True", B to "False"
    if (question.questionType === "TRUE_FALSE") {
      return correctAnsLetter === "A" || correctAnsLetter === "a" ? "True" : "False";
    }
    
    // Handle MCQ questions - use "Option A" format
    if (question.questionType === "MCQ") {
      return correctAnsLetter.length === 1 
        ? `Option ${correctAnsLetter.toUpperCase()}` 
        : correctAnsLetter;
    }
    
    // Default fallback
    return correctAnsLetter;
  };
  
  const correctAnswer = getCorrectAnswerDisplay();
  
  const subject = safeString(
    question.subject?.name || question.subject || question.classification?.subject?.name || question.classification?.subject,
    "—"
  );
  const topic = safeString(
    question.topic?.name || question.topic || question.classification?.topic?.name || question.classification?.topic,
    "—"
  );
  const difficulty = safeString(
    question.difficulty || question.metadata?.difficulty,
    "—"
  );
  const questionText = stripHtmlTags(question.questionText);
  const options = question.options || {};

  return (
    <div className="border border-[#03274633] bg-white pt-[24px] pb-[42px] px-[28px] rounded-[12px] mb-[30px]">
      <div className="space-y-[30px]">
        <div className="flex items-center justify-between">
          <p className="text-[16px] leading-[100%] font-medium font-roboto text-blue-dark">
            <span className="font-medium">
              {isVariant ? `Variant ${variantNumber}:` : "Original Question:"}
                  </span> <span className="max-w-[400px] truncate inline-block cursor-help" title={questionText}>"{questionText}"</span>
          </p>
          {onFlag && (
            <button
              onClick={() => onFlag(question)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                isFlagged
                  ? "bg-red-100 text-red-700 border border-red-300"
                  : "bg-orange-dark text-white hover:bg-orange-700"
              }`}
            >
              {isFlagged ? "Flagged" : "Flag"}
            </button>
          )}
        </div>
        
        {(question.questionType === "MCQ" || question.questionType === "TRUE_FALSE") && (
          <div className="space-y-2">
            <p className="text-[16px] leading-[100%] font-normal font-roboto text-blue-dark">
              <span className="text-[#6B7280]">Options:</span>
            </p>
            {question.questionType === "TRUE_FALSE" ? (
              <div className="grid grid-cols-2 gap-2 ml-4">
                <p className="text-[14px] text-blue-dark">
                  <span className="font-medium">A:</span> {getOptionText(options.A) || "True"}
                </p>
                <p className="text-[14px] text-blue-dark">
                  <span className="font-medium">B:</span> {getOptionText(options.B) || "False"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 ml-4">
                {Object.entries(options).map(([key, value]) => (
                  <p key={key} className="text-[14px] text-blue-dark">
                    <span className="font-medium">{key}:</span> {getOptionText(value)}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
        
        <p className="text-[16px] leading-[100%] font-normal font-roboto text-blue-dark">
          <span className="text-[#6B7280]">Correct Answer:</span> {correctAnswer}
        </p>
        
        <div className="flex flex-col gap-2 text-[16px] leading-[100%] font-normal font-roboto text-[#6B7280]">
          <div className="flex gap-6">
            <span>
              Subject: <span className="text-blue-dark">{subject}</span>
            </span>
            {difficulty !== "—" && (
              <span>
                Difficulty: <span className="text-blue-dark">{difficulty}</span>
              </span>
            )}
          </div>
          <span>
            Topic: <span className="text-blue-dark">{topic}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

// SupportingMaterial Component
const SupportingMaterial = ({ file, onFileChange, onRemove }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileChange(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  return (
    <div className="border border-[#03274633] bg-white pt-[18px] pb-[53px] px-[30px] rounded-[14px] mb-[30px]">
      <h2 className="text-[20px] leading-[32px] font-bold text-blue-dark font-archivo mb-[30px]">
        Add Supporting Material
      </h2>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-[#BCBCBD] rounded-lg p-12 text-center"
      >
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-[#C6D8D3] rounded-[10px] flex items-center justify-center mb-4">
            <svg
              width="14"
              height="20"
              viewBox="0 0 14 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.28 9.21997C12.573 9.51297 12.573 9.98801 12.28 10.281C12.134 10.427 11.942 10.501 11.75 10.501C11.558 10.501 11.366 10.428 11.22 10.281L7.5 6.56104V18.75C7.5 19.164 7.164 19.5 6.75 19.5C6.336 19.5 6 19.164 6 18.75V6.56104L2.28003 10.281C1.98703 10.574 1.51199 10.574 1.21899 10.281C0.925994 9.98801 0.925994 9.51297 1.21899 9.21997L6.21899 4.21997C6.28799 4.15097 6.37089 4.09611 6.46289 4.05811C6.64589 3.98211 6.85289 3.98211 7.03589 4.05811C7.12789 4.09611 7.21103 4.15097 7.28003 4.21997L12.28 9.21997ZM12.75 0H0.75C0.336 0 0 0.336 0 0.75C0 1.164 0.336 1.5 0.75 1.5H12.75C13.164 1.5 13.5 1.164 13.5 0.75C13.5 0.336 13.164 0 12.75 0Z"
                fill="white"
              />
            </svg>
          </div>
          <p className="text-[#6B7280] text-[18px] leading-[28px] font-normal font-roboto mb-2">
            Drag & Drop a diagram or image, or
          </p>
          <label className="text-[#6B7280] text-[26px] leading-[100%] font-archivo cursor-pointer font-semibold">
            Upload File
            <input
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*"
            />
          </label>
        </div>
      </div>
      {file && (
        <div className="bg-[#F6F7F8] border border-[#BCBCBD] rounded-lg px-5 py-6 flex items-center justify-between mt-5">
          <div className="flex items-center gap-3">
            <svg
              className="w-4 h-4 text-[#6B7280]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-[16px] leading-[100%] font-normal font-roboto text-blue-dark">
              {file.name}
            </span>
          </div>
          <button
            onClick={onRemove}
            className="text-[16px] leading-[100%] text-orange-dark font-roboto font-medium"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

// Flag Modal Component
const FlagModal = ({ isOpen, onClose, onConfirm, isVariant }) => {
  const [flagReason, setFlagReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!flagReason.trim()) {
      showErrorToast("Please provide a reason for flagging");
      return;
    }
    onConfirm(flagReason);
    setFlagReason("");
  };

  const handleClose = () => {
    setFlagReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-[20px] font-bold text-blue-dark font-archivo mb-2">
          Flag {isVariant ? "Variant" : "Question"}
        </h2>
        <p className="text-[14px] text-dark-gray mb-4">
          Please provide a reason for flagging this {isVariant ? "variant" : "question"}.
        </p>
        <div className="mb-4">
          <label className="block text-[14px] font-medium text-blue-dark mb-2">
            Reason for Flagging
          </label>
          <textarea
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            placeholder="Enter the reason for flagging..."
            className="w-full p-3 border border-[#03274633] rounded-[8px] min-h-[100px] outline-none text-blue-dark placeholder:text-gray-400"
            rows={4}
          />
        </div>
        <div className="flex gap-3 justify-end">
          <OutlineButton
            text="Cancel"
            className="py-[10px] px-6"
            onClick={handleClose}
          />
          <PrimaryButton
            text="Flag"
            className="py-[10px] px-6"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function AdminPendingExplainerViewQuestion() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  
  // Get current user from Redux
  const { user } = useSelector((state) => state.auth || {});
  const isSuperAdmin = user?.role === 'superadmin';
  
  const [explanation, setExplanation] = useState("");
  const [explanations, setExplanations] = useState({}); // Store explanations for original and each variant
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState(null);
  const [originalQuestion, setOriginalQuestion] = useState(null); // For variant view
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOriginal, setLoadingOriginal] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  
  // Flag modal state
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [selectedQuestionForFlag, setSelectedQuestionForFlag] = useState(null);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

  // Get question ID from search params
  const questionId = searchParams.get("questionId");

  // Helper function to transform admin API response to match explainer API format
  const transformAdminQuestion = (adminQuestion) => {
    return {
      ...adminQuestion,
      questionText: adminQuestion.questionText || adminQuestion.question?.text,
      questionType: adminQuestion.questionType || adminQuestion.question?.type,
      options: adminQuestion.options || adminQuestion.question?.options,
      correctAnswer: adminQuestion.correctAnswer || adminQuestion.question?.correctAnswer,
      explanation: adminQuestion.explanation,
      subject: adminQuestion.subject || adminQuestion.classification?.subject,
      topic: adminQuestion.topic || adminQuestion.classification?.topic,
      exam: adminQuestion.exam || adminQuestion.classification?.exam,
      isVariant: adminQuestion.isVariant,
      originalQuestionId: adminQuestion.originalQuestionId || adminQuestion.originalQuestion?.id || adminQuestion.originalQuestion,
      status: adminQuestion.status,
    };
  };

  // Fetch question and variants
  useEffect(() => {
    const fetchQuestionData = async () => {
      if (!questionId) {
        setError("Question ID is missing");
        setLoading(false);
        navigate("/admin/question-bank/pending-explainer");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let questionResponse;
        let fetchedQuestion;

        // Use appropriate API based on user role
        if (isSuperAdmin) {
          // SuperAdmin uses admin API
          questionResponse = await adminAPI.getQuestionDetails(questionId);
          if (questionResponse.success && questionResponse.data?.question) {
            fetchedQuestion = transformAdminQuestion(questionResponse.data.question);
          } else {
            setError("Question not found");
            setLoading(false);
            return;
          }
        } else {
          // Regular admin uses explainer API
          questionResponse = await questionsAPI.getExplainerQuestionById(questionId);
        if (questionResponse.success && questionResponse.data?.question) {
            fetchedQuestion = questionResponse.data.question;
          } else {
            setError("Question not found");
            setLoading(false);
            return;
          }
        }
        
          setQuestion(fetchedQuestion);
          
          // Initialize explanation for current question
          // First check if there's a saved draft
          const draftKey = `explainer_draft_${questionId}`;
          const savedDraft = localStorage.getItem(draftKey);
          let initialExplanation = fetchedQuestion.explanation || "";
          
          if (savedDraft) {
            try {
              const draftData = JSON.parse(savedDraft);
              if (draftData.explanations && draftData.explanations[questionId]) {
                initialExplanation = draftData.explanations[questionId];
              }
            } catch (e) {
              console.warn("Could not parse saved draft:", e);
            }
          }
          
          setExplanations(prev => ({
            ...prev,
            [questionId]: initialExplanation
          }));

          // Check if this is a variant - if so, fetch the original question
          const isVariant = fetchedQuestion.isVariant === true || fetchedQuestion.isVariant === 'true';
          const originalQuestionId = fetchedQuestion.originalQuestionId || fetchedQuestion.originalQuestion?.id || fetchedQuestion.originalQuestion;
          
          if (isVariant && originalQuestionId) {
            try {
              setLoadingOriginal(true);
              let originalResponse;
            
              if (isSuperAdmin) {
                originalResponse = await adminAPI.getQuestionDetails(originalQuestionId);
                if (originalResponse.success && originalResponse.data?.question) {
                setOriginalQuestion(transformAdminQuestion(originalResponse.data.question));
                }
              } else {
                originalResponse = await questionsAPI.getExplainerQuestionById(originalQuestionId);
              if (originalResponse.success && originalResponse.data?.question) {
                setOriginalQuestion(originalResponse.data.question);
              }
            }
            
            if (originalResponse && originalResponse.success && originalResponse.data?.question) {
              const originalQ = isSuperAdmin 
                ? transformAdminQuestion(originalResponse.data.question)
                : originalResponse.data.question;
              
                // Initialize explanation for original question if it exists
                // Check for saved draft
                const draftKey = `explainer_draft_${questionId}`;
                const savedDraft = localStorage.getItem(draftKey);
              let originalExplanation = originalQ.explanation || "";
                
                if (savedDraft) {
                  try {
                    const draftData = JSON.parse(savedDraft);
                    if (draftData.explanations && draftData.explanations[originalQuestionId]) {
                      originalExplanation = draftData.explanations[originalQuestionId];
                    }
                  } catch (e) {
                    console.warn("Could not parse saved draft:", e);
                  }
                }
                
                setExplanations(prev => ({
                  ...prev,
                  [originalQuestionId]: originalExplanation
                }));
              }
            } catch (originalError) {
              console.warn("Could not fetch original question:", originalError);
            } finally {
              setLoadingOriginal(false);
            }
          } else {
            // If this is the original question, check if it has variants
            try {
            let allQuestionsResponse;
            
            if (isSuperAdmin) {
              // For superAdmin, fetch all questions and filter variants
              const allResponse = await adminAPI.getAllQuestions({ status: 'pending_explainer' });
              if (allResponse.success && allResponse.data?.questions) {
                const questionIdStr = fetchedQuestion.id || fetchedQuestion._id;
                const relatedVariants = allResponse.data.questions
                  .map(q => transformAdminQuestion(q))
                  .filter((q) => {
                    const isVariantQ = q.isVariant === true || q.isVariant === 'true';
                    const originalId = q.originalQuestionId || q.parentQuestionId;
                    return isVariantQ && originalId && (originalId.toString() === questionIdStr.toString() || originalId === questionIdStr);
                  });
                setVariants(relatedVariants);
                
                // Initialize explanations for variants
                const draftKey = `explainer_draft_${questionId}`;
                const savedDraft = localStorage.getItem(draftKey);
                let draftExplanations = {};
                
                if (savedDraft) {
                  try {
                    const draftData = JSON.parse(savedDraft);
                    if (draftData.explanations) {
                      draftExplanations = draftData.explanations;
                    }
                  } catch (e) {
                    console.warn("Could not parse saved draft:", e);
                  }
                }
                
                const variantExplanations = {};
                relatedVariants.forEach(variant => {
                  const variantId = variant.id || variant._id;
                  variantExplanations[variantId] = draftExplanations[variantId] || variant.explanation || "";
                });
                setExplanations(prev => ({
                  ...prev,
                  ...variantExplanations
                }));
              }
            } else {
              // Regular admin uses explainer API
              allQuestionsResponse = await questionsAPI.getExplainerQuestions({ status: 'pending_explainer' });
              if (allQuestionsResponse.success && allQuestionsResponse.data?.questions) {
                const questionIdStr = fetchedQuestion.id || fetchedQuestion._id;
                // Get all variants (including those with explanations) - we'll filter explanation editors separately
                const relatedVariants = allQuestionsResponse.data.questions.filter(
                  (q) => {
                    const isVariantQ = q.isVariant === true || q.isVariant === 'true';
                    const originalId = q.originalQuestionId || q.parentQuestionId;
                    return isVariantQ && originalId && (originalId.toString() === questionIdStr.toString() || originalId === questionIdStr);
                  }
                );
                setVariants(relatedVariants);
                
                // Initialize explanations for variants
                // Check for saved draft
                const draftKey = `explainer_draft_${questionId}`;
                const savedDraft = localStorage.getItem(draftKey);
                let draftExplanations = {};
                
                if (savedDraft) {
                  try {
                    const draftData = JSON.parse(savedDraft);
                    if (draftData.explanations) {
                      draftExplanations = draftData.explanations;
                    }
                  } catch (e) {
                    console.warn("Could not parse saved draft:", e);
                  }
                }
                
                const variantExplanations = {};
                relatedVariants.forEach(variant => {
                  const variantId = variant.id || variant._id;
                  variantExplanations[variantId] = draftExplanations[variantId] || variant.explanation || "";
                });
                setExplanations(prev => ({
                  ...prev,
                  ...variantExplanations
                }));
              }
              }
            } catch (variantError) {
              console.warn("Could not fetch variants:", variantError);
              // Continue without variants
            }
        }
      } catch (err) {
        console.error("Error fetching question:", err);
        setError(err.message || "Failed to fetch question");
        navigate("/admin/question-bank/pending-explainer");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionData();
  }, [questionId, navigate, isSuperAdmin]);

  const handleFileChange = (newFile) => {
    setFile(newFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleCancel = () => {
    navigate("/admin/question-bank/pending-explainer");
  };

  // Handle flag button click
  const handleFlagClick = (questionToFlag) => {
    setSelectedQuestionForFlag(questionToFlag);
    setIsFlagModalOpen(true);
  };

  // Handle flag confirmation
  const handleFlagConfirm = async (reason) => {
    if (!selectedQuestionForFlag) return;

    try {
      const idToFlag = selectedQuestionForFlag.id || selectedQuestionForFlag._id;
      
      await questionsAPI.flagQuestionByExplainer(idToFlag, reason);
      
      // Add to flagged set
      setFlaggedQuestions((prev) => new Set([...prev, idToFlag]));
      
      showSuccessToast(
        `${selectedQuestionForFlag.isVariant ? "Variant" : "Question"} flagged successfully and sent to processor for review`
      );
      
      setIsFlagModalOpen(false);
      setSelectedQuestionForFlag(null);
      
      // Navigate back to pending explainer page
      setTimeout(() => {
        navigate("/admin/question-bank/pending-explainer");
      }, 1500);
    } catch (err) {
      console.error("Error flagging question:", err);
      showErrorToast(err.message || "Failed to flag question. Please try again.");
    }
  };

  // Handle save draft
  const handleSaveDraft = async () => {
    if (!questionId) {
      showErrorToast("Question ID is missing");
      return;
    }

    const isVariant = question?.isVariant === true || question?.isVariant === 'true';
    const hasVariants = variants.length > 0;

    // Check if at least one explanation has content
    const hasAnyExplanation = Object.values(explanations).some(exp => exp && exp.trim());
    
    if (!hasAnyExplanation) {
      showErrorToast("Please enter at least one explanation before saving draft");
      return;
    }

    try {
      setIsSavingDraft(true);
      
      // Save all explanations as drafts
      const explanationsToSave = [];
      
      // If viewing original question with variants, save original + variants
      if (!isVariant && hasVariants) {
        // Save original question explanation
        if (explanations[questionId]?.trim()) {
          explanationsToSave.push({ questionId, explanation: explanations[questionId] });
        }
        // Save variant explanations
        variants.forEach(variant => {
          const variantId = variant.id || variant._id;
          if (explanations[variantId]?.trim()) {
            explanationsToSave.push({ questionId: variantId, explanation: explanations[variantId] });
          }
        });
      } 
      // If viewing a variant, save variant explanation only
      else if (isVariant) {
        if (explanations[questionId]?.trim()) {
          explanationsToSave.push({ questionId, explanation: explanations[questionId] });
        }
      }
      // If viewing original without variants, save original only
      else {
        if (explanations[questionId]?.trim()) {
          explanationsToSave.push({ questionId, explanation: explanations[questionId] });
        }
      }

      // Save all explanations as drafts
      await Promise.all(
        explanationsToSave.map(({ questionId: id, explanation: exp }) =>
          questionsAPI.saveDraftExplanation(id, exp)
        )
      );
      
      // Clear saved draft from localStorage after successful API save
      const draftKey = `explainer_draft_${questionId}`;
      localStorage.removeItem(draftKey);
      
      showSuccessToast("Draft saved successfully! Question moved to draft explanations.");
      
      // Navigate back to pending explainer page
      setTimeout(() => {
        navigate("/admin/question-bank/pending-explainer");
      }, 1000);
    } catch (err) {
      console.error("Error saving draft:", err);
      showErrorToast(err.message || "Failed to save draft");
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Handle explanation change for a specific question
  const handleExplanationChange = (questionId, value) => {
    setExplanations(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Handle submit explanation(s)
  const handleSubmitExplanation = async () => {
    if (!questionId) {
      showErrorToast("Question ID is missing");
      return;
    }

    const isVariant = question?.isVariant === true || question?.isVariant === 'true';
    const hasOriginal = originalQuestion !== null;
    const hasVariants = variants.length > 0;

    // Determine which explanations to submit
    const explanationsToSubmit = [];
    
    // Helper to check if a variant needs explanation
    const variantNeedsExplanation = (variant) => {
      const variantId = variant.id || variant._id;
      const hasExplanation = variant.explanation && variant.explanation.trim() !== '';
      // Only variants that are pending_explainer and don't have explanations need explanation editors
      const statusNeedsExplanation = variant.status === 'pending_explainer';
      const notSubmitted = variant.status !== 'pending_processor' && variant.status !== 'completed';
      return statusNeedsExplanation && !hasExplanation && notSubmitted;
    };
    
    // If viewing original question with variants, submit original + variants that need explanations
    if (!isVariant && hasVariants) {
      // Submit original question explanation
      if (explanations[questionId]?.trim()) {
        explanationsToSubmit.push({ questionId, explanation: explanations[questionId] });
      }
      // Submit variant explanations only for variants that need them
      variants
        .filter(variantNeedsExplanation)
        .forEach(variant => {
          const variantId = variant.id || variant._id;
          if (explanations[variantId]?.trim()) {
            explanationsToSubmit.push({ questionId: variantId, explanation: explanations[variantId] });
          }
        });
    } 
    // If viewing a variant, submit variant explanation only
    else if (isVariant) {
      if (explanations[questionId]?.trim()) {
        explanationsToSubmit.push({ questionId, explanation: explanations[questionId] });
      }
    }
    // If viewing original without variants, submit original only
    else {
      if (explanations[questionId]?.trim()) {
        explanationsToSubmit.push({ questionId, explanation: explanations[questionId] });
      }
    }

    if (explanationsToSubmit.length === 0) {
      showErrorToast("Please enter at least one explanation before submitting");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Submit all explanations
      await Promise.all(
        explanationsToSubmit.map(({ questionId: id, explanation: exp }) =>
          questionsAPI.updateExplanation(id, exp)
        )
      );
      
      // Clear saved draft after successful submission
      const draftKey = `explainer_draft_${questionId}`;
      localStorage.removeItem(draftKey);
      
      showSuccessToast("Explanation(s) submitted successfully! Question(s) sent to processor for review.");
      
      // Navigate back to pending explainer page
      setTimeout(() => {
        navigate("/admin/question-bank/pending-explainer");
      }, 1500);
    } catch (err) {
      console.error("Error submitting explanation:", err);
      showErrorToast(err.message || "Failed to submit explanation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <Loader size="lg" color="oxford-blue" />
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="min-h-screen bg-gray-50 p-8" dir={dir}>
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-white rounded-lg p-6 border border-red-300">
            <p className="text-red-600 mb-4">{error || "Question not found"}</p>
            <OutlineButton
              text="Back to Question Bank"
              className="py-[10px] px-6"
              onClick={handleCancel}
            />
          </div>
        </div>
      </div>
    );
  }

  const questionIdDisplay = question.id || question._id || questionId;
  const isVariant = question?.isVariant === true || question?.isVariant === 'true';

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir={dir}>
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8">
          <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[40px] text-oxford-blue mb-1.5">
            {t("admin.questionBank.pendingExplainer.viewQuestion.title") || "Add Explanation"}
          </h1>
        </div>

        {/* Display Original Question Reference if viewing a variant */}
        {isVariant && originalQuestion && (
          <div className="rounded-[12px] border border-[#03274633] bg-white pt-[20px] px-[30px] pb-[30px] w-full mb-[30px]">
            <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[32px] text-oxford-blue">
              Original Question Reference
            </h2>
            <p className="font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280] mb-4">
              This variant belongs to the following original question:
            </p>
            <div className="bg-[#F6F7F8] rounded-lg p-4 border border-[#E5E7EB]">
              <div className="mb-3">
                <span className="font-roboto text-[14px] font-semibold text-oxford-blue">Question:</span>
                <p
                  className="font-roboto text-[16px] font-normal leading-[24px] text-oxford-blue mt-2 max-w-[600px] truncate cursor-help"
                  dir="ltr"
                  title={stripHtmlTags(originalQuestion.questionText)}
                >
                  {stripHtmlTags(originalQuestion.questionText)}
                </p>
              </div>
              
              {(originalQuestion.questionType === "MCQ" || originalQuestion.questionType === "TRUE_FALSE") && originalQuestion.options && (
                <>
                  <div className="mt-4 mb-3">
                    <span className="font-roboto text-[14px] font-semibold text-oxford-blue">Options:</span>
                    {originalQuestion.questionType === "TRUE_FALSE" ? (
                      <div className="space-y-2 mt-2" dir="ltr">
                        <div className="flex items-center gap-2">
                          <span className="font-roboto text-[14px] font-normal text-dark-gray min-w-[20px]">
                            A.
                          </span>
                          <span className="font-roboto text-[14px] font-normal text-dark-gray">
                            {getOptionText(originalQuestion.options.A) || "True"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-roboto text-[14px] font-normal text-dark-gray min-w-[20px]">
                            B.
                          </span>
                          <span className="font-roboto text-[14px] font-normal text-dark-gray">
                            {getOptionText(originalQuestion.options.B) || "False"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 mt-2" dir="ltr">
                        {Object.entries(originalQuestion.options).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <span className="font-roboto text-[14px] font-normal text-dark-gray min-w-[20px]">
                              {key}.
                            </span>
                            <span className="font-roboto text-[14px] font-normal text-dark-gray">
                              {getOptionText(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {originalQuestion.correctAnswer && (
                    <div className="mt-4 pt-3 border-t border-[#E5E7EB]">
                      <span className="font-roboto text-[14px] font-semibold text-oxford-blue">Correct Answer: </span>
                      <span className="font-roboto text-[14px] font-normal text-[#ED4122]">
                        {(() => {
                          const correctAnswerLetter = getCorrectAnswerLetter(originalQuestion.correctAnswer);
                          if (originalQuestion.questionType === "TRUE_FALSE") {
                            return correctAnswerLetter === "A" ? "True" : "False";
                          }
                          return correctAnswerLetter 
                            ? `${correctAnswerLetter}. ${getOptionText(originalQuestion.options?.[correctAnswerLetter])}`
                            : "—";
                        })()}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Display Original Question (if not a variant) or Variant Question (if viewing variant) */}
        <div className="border border-[#03274633] shadow-[0px_2px_20px_0px_#0327460D] bg-white pt-[18px] pb-[53px] px-[30px] rounded-[14px] mb-[30px]">
          <h2 className="text-[20px] leading-[32px] font-bold text-blue-dark font-archivo mb-[18px]">
            {isVariant ? "Variant Question Details" : "Question Details"}
          </h2>
          <QuestionDetails
            question={question}
            isVariant={isVariant}
            onFlag={handleFlagClick}
            isFlagged={flaggedQuestions.has(question.id || question._id)}
          />
        </div>

        {/* Display Variants if viewing original question */}
        {!isVariant && variants.length > 0 && (
          <div className="border border-[#03274633] shadow-[0px_2px_20px_0px_#0327460D] bg-white pt-[18px] pb-[53px] px-[30px] rounded-[14px] mb-[30px]">
            <h2 className="text-[20px] leading-[32px] font-bold text-blue-dark font-archivo mb-[18px]">
              Question Variants ({variants.length})
            </h2>
            {variants.map((variant, index) => (
              <QuestionDetails
                key={variant.id || variant._id}
                question={variant}
                isVariant={true}
                variantNumber={index + 1}
                onFlag={handleFlagClick}
                isFlagged={flaggedQuestions.has(variant.id || variant._id)}
              />
            ))}
          </div>
        )}

        {/* Explanation Editor for Original Question (if viewing original with variants) */}
        {!isVariant && (
          <div className="border border-[#03274633] shadow-[0px_2px_20px_0px_#0327460D] bg-white pt-[18px] pb-[53px] px-[30px] rounded-[14px] mb-[30px]">
            <h2 className="text-[20px] leading-[32px] font-bold text-blue-dark font-archivo mb-[18px]">
              Explanation for Original Question
            </h2>
            <p className="text-[16px] leading-[100%] font-medium font-roboto text-blue-dark mb-5">
              Explanation
            </p>
            <RichTextEditor
              value={explanations[questionId] || ""}
              onChange={(value) => handleExplanationChange(questionId, value)}
              placeholder="Enter the detailed explanation for the original question here..."
              minHeight="150px"
            />
          </div>
        )}

        {/* Explanation Editor for Variants (if viewing original with variants) */}
        {/* Only show explanation editors for variants that don't have explanations yet */}
        {!isVariant && variants.length > 0 && variants
          .filter(variant => {
            const variantId = variant.id || variant._id;
            const hasExplanation = variant.explanation && variant.explanation.trim() !== '';
            // Only show editor if variant is still pending explanation (status is pending_explainer and no explanation)
            // Exclude variants that already have explanations or have been submitted (status is pending_processor)
            const statusNeedsExplanation = variant.status === 'pending_explainer';
            const notSubmitted = variant.status !== 'pending_processor' && variant.status !== 'completed';
            return statusNeedsExplanation && !hasExplanation && notSubmitted;
          })
          .map((variant, index) => {
            const variantId = variant.id || variant._id;
            // Get the actual variant number from all variants (including those with explanations)
            const allVariants = variants;
            const variantNumber = allVariants.findIndex(v => (v.id || v._id) === variantId) + 1;
            
            return (
              <div key={variantId} className="border border-[#03274633] shadow-[0px_2px_20px_0px_#0327460D] bg-white pt-[18px] pb-[53px] px-[30px] rounded-[14px] mb-[30px]">
                <h2 className="text-[20px] leading-[32px] font-bold text-blue-dark font-archivo mb-[18px]">
                  Explanation for Variant {variantNumber}
                </h2>
                <p className="text-[16px] leading-[100%] font-medium font-roboto text-blue-dark mb-5">
                  Explanation
                </p>
                <RichTextEditor
                  value={explanations[variantId] || ""}
                  onChange={(value) => handleExplanationChange(variantId, value)}
                  placeholder={`Enter the detailed explanation for variant ${variantNumber} here...`}
                  minHeight="150px"
                />
              </div>
            );
          })}

        {/* Explanation Editor for Variant (if viewing a variant) */}
        {isVariant && (
          <div className="border border-[#03274633] shadow-[0px_2px_20px_0px_#0327460D] bg-white pt-[18px] pb-[53px] px-[30px] rounded-[14px] mb-[30px]">
            <h2 className="text-[20px] leading-[32px] font-bold text-blue-dark font-archivo mb-[18px]">
              Explanation for Variant
            </h2>
            <p className="text-[16px] leading-[100%] font-medium font-roboto text-blue-dark mb-5">
              Explanation
            </p>
            <RichTextEditor
              value={explanations[questionId] || ""}
              onChange={(value) => handleExplanationChange(questionId, value)}
              placeholder="Enter the detailed explanation for this variant here..."
              minHeight="150px"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 px-5 pb-6 pt-2">
          <OutlineButton
            text={t("processor.viewQuestion.close") || "Cancel"}
            className="py-[10px] px-7 text-nowrap"
            onClick={handleCancel}
          />
          <PrimaryButton
            text={isSubmitting ? "Submitting..." : (t("explainer.addExplanation.submit") || "Submit explanation")}
            className="py-[10px] px-7 text-nowrap"
            onClick={handleSubmitExplanation}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Flag Modal */}
      <FlagModal
        isOpen={isFlagModalOpen}
        onClose={() => {
          setIsFlagModalOpen(false);
          setSelectedQuestionForFlag(null);
        }}
        onConfirm={handleFlagConfirm}
        isVariant={selectedQuestionForFlag?.isVariant || false}
      />
    </div>
  );
}
