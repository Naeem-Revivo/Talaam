import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton, PrimaryButton } from "../../components/common/Button";
import questionsAPI from "../../api/questions";
import { showErrorToast, showSuccessToast } from "../../utils/toastConfig";

const CreatorViewVariant = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { variantId } = useParams();
  const { t } = useLanguage();
  const [variant, setVariant] = useState(location.state?.variant || null);
  const [originalQuestion, setOriginalQuestion] = useState(location.state?.originalQuestion || null);
  const [loading, setLoading] = useState(!variant && !variantId);
  const [error, setError] = useState(null);
  const [showRejectFlagModal, setShowRejectFlagModal] = useState(false);
  const [flagRejectionReason, setFlagRejectionReason] = useState("");
  const [rejectingFlag, setRejectingFlag] = useState(false);

  // Fetch variant and original question data if not provided
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // If variantId is in URL, fetch the variant
        if (variantId && !variant) {
          const variantResponse = await questionsAPI.getCreatorQuestionById(variantId);
          if (variantResponse.success && variantResponse.data?.question) {
            const fetchedVariant = variantResponse.data.question;
            setVariant(fetchedVariant);
            
            // Fetch original question
            if (fetchedVariant.originalQuestionId) {
              const originalResponse = await questionsAPI.getCreatorQuestionById(fetchedVariant.originalQuestionId);
              if (originalResponse.success && originalResponse.data?.question) {
                setOriginalQuestion(originalResponse.data.question);
              }
            }
          }
        } else if (variant && originalQuestion) {
          // Data already provided via location state
          setLoading(false);
          return;
        } else if (variant && variant.originalQuestionId && !originalQuestion) {
          // Variant provided but original question not, fetch it
          const response = await questionsAPI.getCreatorQuestionById(variant.originalQuestionId);
          if (response.success && response.data?.question) {
            setOriginalQuestion(response.data.question);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load variant");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [variant, originalQuestion, variantId]);

  const handleCancel = () => {
    navigate("/creator/question-bank/variants-list");
  };


  // Check if variant is flagged and approved (needs creator action)
  const isFlaggedAndApproved = variant && 
                                variant.isFlagged === true && 
                                variant.flagStatus === 'approved' &&
                                variant.status === 'pending_creator';

  // Check if variant is rejected
  const isRejected = variant && variant.status === 'rejected' && variant.rejectionReason;

  const handleUpdateVariant = () => {
    if (variant) {
      // Navigate to edit variant page
      navigate("/creator/question-bank/edit-variant", {
        state: { 
          variantId: variant.id || variantId, 
          variant: variant,
          originalQuestion: originalQuestion,
          isFlagged: true
        }
      });
    }
  };

  const handleRejectFlag = async () => {
    if (!flagRejectionReason.trim()) {
      showErrorToast("Please provide a reason for rejecting the flag");
      return;
    }

    const variantIdToUse = variant?.id || variantId;
    if (!variantIdToUse) {
      showErrorToast("Variant ID is missing");
      return;
    }

    setRejectingFlag(true);
    try {
      const response = await questionsAPI.rejectFlagByCreator(variantIdToUse, flagRejectionReason);
      
      if (response.success) {
        showSuccessToast("Flag rejected successfully. Question sent back to processor for review.");
        setTimeout(() => {
          navigate("/creator/question-bank/variants-list");
        }, 1500);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to reject flag";
      showErrorToast(errorMessage);
    } finally {
      setRejectingFlag(false);
      setShowRejectFlagModal(false);
      setFlagRejectionReason("");
    }
  };

  // Extract question title from questionText
  const getQuestionTitle = (questionText) => {
    if (!questionText) return "—";
    const text = questionText.replace(/<[^>]*>/g, '');
    return text;
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-4 md:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[38px] text-oxford-blue mb-2">
              {t('creator.ViewVariant.heading') || 'View Variant'}
            </h1>
            <p className="font-roboto text-[14px] md:text-[18px] font-normal leading-[20px] md:leading-[24px] text-dark-gray">
              {t('creator.ViewVariant.subheading') || 'View variant details'}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-oxford-blue text-lg font-roboto">Loading variant...</div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-red-600 text-lg font-roboto mb-4">{error}</div>
            <button
              onClick={handleCancel}
              className="flex h-[36px] items-center justify-center rounded-[8px] border border-[#03274633] bg-white px-4 text-[16px] font-roboto font-medium leading-[16px] text-[#374151] transition hover:bg-[#F9FAFB]"
            >
              {t('admin.variantQuestionReview.buttons.cancel') || 'Cancel'}
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && variant && originalQuestion && (
        <div className="flex flex-col gap-6">
          {/* Source Question Reference Card */}
            <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full">
              <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                {t('admin.variantQuestionReview.sections.sourceQuestionReference') || 'Source Question Reference'}
            </h2>
              <div className="space-y-3">
                <p className="font-roboto text-[16px] font-bold leading-[20px] text-oxford-blue">
                  <span className="font-bold">{t('admin.variantQuestionReview.fields.questionId') || 'Question ID:'}</span> {originalQuestion.id || "—"}
                </p>
                <div
                  className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray"
                  dangerouslySetInnerHTML={{ __html: getQuestionTitle(originalQuestion.questionText) }}
                />
                {originalQuestion.options && (
                  <div className="grid pt-1 grid-cols-2 gap-x-8 gap-y-3">
                    {Object.entries(originalQuestion.options).map(([key, value]) => (
                      <p key={key} className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                        {key}. {value || "—"}
                      </p>
                    ))}
                  </div>
                )}
            </div>
          </div>

          {/* Rejection Reason Card - Show if variant is rejected */}
          {isRejected && variant.rejectionReason && (
            <div className="rounded-[12px] border-2 border-[#ED4122] bg-[#FEF2F2] p-4 md:p-6 w-full">
              <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-[#ED4122]">
                {t('creator.assignedQuestionPage.rejectionReasonModal.title') || 'Rejection Reason'}
              </h2>
              <p className="font-roboto text-[14px] font-normal leading-[20px] text-dark-gray mb-3">
                {t('creator.assignedQuestionPage.rejectionReasonModal.subtitle') || 'The variant was rejected by processor with the following reason:'}
              </p>
              <div className="bg-white rounded-lg p-4 border border-[#ED4122]">
                <p className="font-roboto text-[16px] font-normal leading-[24px] text-oxford-blue whitespace-pre-wrap">
                  {variant.rejectionReason}
                </p>
              </div>
            </div>
          )}

          {/* Flag Information Card - Show if variant is flagged */}
          {isFlaggedAndApproved && variant.flagReason && (
            <div className="rounded-[12px] border border-[#ED4122] bg-[#FEF2F2] p-4 md:p-6 w-full">
              <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-[#ED4122]">
                Flag Reason
              </h2>
              <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                {variant.flagReason}
              </p>
              <p className="font-roboto text-[14px] font-normal leading-[20px] text-dark-gray mt-2">
                This variant has been flagged by explainer and approved by processor. Please update the variant or reject the flag.
              </p>
            </div>
          )}

          {/* Variant Question Card */}
            <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full">
              <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                {t('admin.variantQuestionReview.sections.variantQuestion') || 'Variant Question'}
            </h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-roboto text-[16px] font-bold leading-[20px] text-oxford-blue mb-2">
                    {t('admin.variantQuestionReview.fields.question') || 'Question'}
                  </label>
                  <div
                    className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray"
                    dangerouslySetInnerHTML={{ __html: getQuestionTitle(variant.questionText) }}
                  />
                </div>
                {variant.options && (
                <div>
                    <label className="block font-archivo text-[16px] font-bold leading-[20px] text-oxford-blue mb-2">
                      {t('admin.variantQuestionReview.fields.options') || 'Options'}
                  </label>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      {Object.entries(variant.options).map(([key, value]) => (
                        <p key={key} className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                          {key}. {value || "—"}
                        </p>
                      ))}
                    </div>
                </div>
                )}
                {variant.correctAnswer && (
                <div>
                    <label className="block font-archivo text-[16px] font-bold leading-[20px] text-oxford-blue mb-2">
                      {t('admin.variantQuestionReview.fields.correctAnswer') || 'Correct Answer'}
                  </label>
                  <p className="font-roboto text-[16px] font-normal leading-[20px] text-[#ED4122]">
                      {variant.correctAnswer}
                  </p>
                </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-end gap-3 md:gap-4 mt-4 md:mt-6 pb-4 md:pb-6">
              {isFlaggedAndApproved ? (
                <>
                  <OutlineButton
                    text={t('admin.variantQuestionReview.buttons.cancel') || 'Cancel'}
                    className="py-[10px] px-5"
                    onClick={handleCancel}
                    disabled={rejectingFlag}
                  />
                  <OutlineButton
                    text="Reject Flag"
                    className="py-[10px] px-5"
                    onClick={() => setShowRejectFlagModal(true)}
                    disabled={rejectingFlag}
                  />
                  <PrimaryButton
                    text="Update Variant"
                    className="py-[10px] px-5"
                    onClick={handleUpdateVariant}
                    disabled={rejectingFlag}
                  />
                </>
              ) : (
                <OutlineButton
                  text={t('admin.variantQuestionReview.buttons.cancel') || 'Cancel'}
                  className="py-[10px] px-5"
                  onClick={handleCancel}
                />
              )}
            </div>
          </div>
        )}

        {/* Reject Flag Modal */}
        {showRejectFlagModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[12px] shadow-xl p-6 max-w-md w-full">
              <h3 className="text-[24px] font-bold font-archivo text-oxford-blue mb-2">
                Reject Flag
              </h3>
              <p className="text-[16px] font-roboto text-dark-gray mb-6">
                Please provide a reason for rejecting the flag. The question will be sent back to processor for review.
              </p>
              <textarea
                value={flagRejectionReason}
                onChange={(e) => setFlagRejectionReason(e.target.value)}
                className="w-full border border-[#E5E7EB] rounded-lg p-3 min-h-[100px] font-roboto text-[16px] mb-6"
                placeholder="Enter reason for rejecting the flag..."
              />
              <div className="flex gap-4">
                <OutlineButton
                  text={t('admin.variantQuestionReview.buttons.cancel') || 'Cancel'}
                  onClick={() => {
                    setShowRejectFlagModal(false);
                    setFlagRejectionReason("");
                  }}
                  className="flex-1"
                  disabled={rejectingFlag}
                />
                <PrimaryButton
                  text="Reject Flag"
                  onClick={handleRejectFlag}
                  className="flex-1"
                  disabled={rejectingFlag || !flagRejectionReason.trim()}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorViewVariant;
