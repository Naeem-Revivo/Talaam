import React, { useState, useEffect } from "react";
import { OutlineButton, PrimaryButton } from "../../components/common/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLanguage } from "../../context/LanguageContext";
import adminAPI from "../../api/admin";
import questionsAPI from "../../api/questions";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig.jsx";
import Loader from "../../components/common/Loader";
import QuestionDetails from "../../components/admin/questionBank/QuestionDetails";
import ParentQuestionReference from "../../components/admin/questionBank/ParentQuestionReference";
import FlagModal from "../../components/admin/questionBank/modals/FlagModal";
import ExplanationEditor from "../../components/admin/questionBank/explainer/ExplanationEditor";
import ExplainerHeader from "../../components/admin/questionBank/explainer/ExplainerHeader";


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
        <ExplainerHeader t={t} />

        {/* Display Original Question Reference if viewing a variant */}
        {isVariant && originalQuestion && (
          <ParentQuestionReference parentQuestion={originalQuestion} t={t} />
        )}

        {/* Display Original Question (if not a variant) or Variant Question (if viewing variant) */}
        <div className="border border-[#03274633] shadow-[0px_2px_20px_0px_#0327460D] bg-white pt-[18px] pb-[53px] px-[30px] rounded-[14px] mb-[30px]">
          <h2 className="text-[20px] leading-[32px] font-bold text-blue-dark font-archivo mb-[18px]">
            {isVariant ? "Variant Question Details" : "Question Details"}
          </h2>
          <QuestionDetails
            question={question}
            isVariant={isVariant}
            variantNumber={isVariant ? 1 : undefined}
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
          <ExplanationEditor
            title="Explanation for Original Question"
            value={explanations[questionId] || ""}
            onChange={(value) => handleExplanationChange(questionId, value)}
            placeholder="Enter the detailed explanation for the original question here..."
            t={t}
          />
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
          .map((variant) => {
            const variantId = variant.id || variant._id;
            // Get the actual variant number from all variants (including those with explanations)
            const allVariants = variants;
            const variantNumber = allVariants.findIndex(v => (v.id || v._id) === variantId) + 1;
            
            return (
              <ExplanationEditor
                key={variantId}
                title={`Explanation for Variant ${variantNumber}`}
                value={explanations[variantId] || ""}
                onChange={(value) => handleExplanationChange(variantId, value)}
                placeholder={`Enter the detailed explanation for variant ${variantNumber} here...`}
                t={t}
              />
            );
          })}

        {/* Explanation Editor for Variant (if viewing a variant) */}
        {isVariant && (
          <ExplanationEditor
            title="Explanation for Variant"
            value={explanations[questionId] || ""}
            onChange={(value) => handleExplanationChange(questionId, value)}
            placeholder="Enter the detailed explanation for this variant here..."
            t={t}
          />
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
        t={t}
      />
    </div>
  );
}
