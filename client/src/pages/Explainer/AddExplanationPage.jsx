import React, { useState } from "react";
import RichTextEditor from "../../components/common/RichTextEditor";
import { OutlineButton, PrimaryButton } from "../../components/common/Button";
import { useNavigate, useLocation } from "react-router-dom";
import questionsAPI from "../../api/questions";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig.jsx";

// QuestionDetails Component - displays full question
const QuestionDetails = ({
  question,
  isVariant = false,
  variantNumber,
  onFlag,
  isFlagged,
}) => {
  const correctAnswer = question.correctAnswer 
    ? (question.correctAnswer.length === 1 
        ? `Option ${question.correctAnswer}` 
        : question.correctAnswer)
    : "—";
  
  const subject = question.subject?.name || question.subject || "—";
  const difficulty = question.difficulty || question.metadata?.difficulty || "—";
  const questionText = question.questionText || "—";
  const options = question.options || {};

  return (
    <div className="border border-[#03274633] bg-white pt-[24px] pb-[42px] px-[28px] rounded-[12px] mb-[30px]">
      <div className="space-y-[30px]">
        <div className="flex items-center justify-between">
          <p className="text-[16px] leading-[100%] font-medium font-roboto text-blue-dark">
            <span className="font-medium">
              {isVariant ? `Variant ${variantNumber}:` : "Original Question:"}
            </span> "{questionText}"
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
        
        {question.questionType === "MCQ" && (
          <div className="space-y-2">
            <p className="text-[16px] leading-[100%] font-normal font-roboto text-blue-dark">
              <span className="text-[#6B7280]">Options:</span>
            </p>
            <div className="grid grid-cols-2 gap-2 ml-4">
              {Object.entries(options).map(([key, value]) => (
                <p key={key} className="text-[14px] text-blue-dark">
                  <span className="font-medium">{key}:</span> {value || "—"}
                </p>
              ))}
            </div>
          </div>
        )}
        
        <p className="text-[16px] leading-[100%] font-normal font-roboto text-blue-dark">
          <span className="text-[#6B7280]">Correct Answer:</span> {correctAnswer}
        </p>
        
        <div className="flex gap-6 text-[16px] leading-[100%] font-normal font-roboto text-[#6B7280]">
          <span>
            Subject: <span className="text-blue-dark">{subject}</span>
          </span>
          {difficulty !== "—" && (
            <span>
              Difficulty: <span className="text-blue-dark">{difficulty}</span>
            </span>
          )}
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
const FlagModal = ({ isOpen, onClose, onConfirm, questionTitle, isVariant }) => {
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
export default function AddExplanationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [explanation, setExplanation] = useState("");
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  
  // Flag modal state
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [selectedQuestionForFlag, setSelectedQuestionForFlag] = useState(null);
  const [flagReason, setFlagReason] = useState("");
  const [isFlagging, setIsFlagging] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

  // Get question ID from location state or URL
  const questionId = location.state?.question?.id || location.state?.questionId;

  // Fetch question and variants
  useEffect(() => {
    const fetchQuestionData = async () => {
      if (!questionId) {
        setError("Question ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch the main question
        const questionResponse = await questionsAPI.getExplainerQuestionById(questionId);
        
        if (questionResponse.success && questionResponse.data?.question) {
          const fetchedQuestion = questionResponse.data.question;
          setQuestion(fetchedQuestion);

          // Check if this question has variants by looking for questions with originalQuestionId
          // We'll fetch all explainer questions and filter for variants
          try {
            const allQuestionsResponse = await questionsAPI.getExplainerQuestions({ status: 'pending_explainer' });
            if (allQuestionsResponse.success && allQuestionsResponse.data?.questions) {
              const questionIdStr = fetchedQuestion.id || fetchedQuestion._id;
              const relatedVariants = allQuestionsResponse.data.questions.filter(
                (q) => {
                  const originalId = q.originalQuestionId || q.parentQuestionId;
                  return originalId && (originalId.toString() === questionIdStr.toString() || originalId === questionIdStr);
                }
              );
              setVariants(relatedVariants);
            }
          } catch (variantError) {
            console.warn("Could not fetch variants:", variantError);
            // Continue without variants
          }
        } else {
          setError("Question not found");
        }
      } catch (err) {
        console.error("Error fetching question:", err);
        setError(err.message || "Failed to fetch question");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionData();
  }, [questionId]);

  const handleFileChange = (newFile) => {
    setFile(newFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleCancel = () => {
    navigate("/explainer/question-bank");
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
      setIsFlagging(true);
      const idToFlag = selectedQuestionForFlag.id || selectedQuestionForFlag._id;
      
      await questionsAPI.flagQuestionByExplainer(idToFlag, reason);
      
      // Add to flagged set
      setFlaggedQuestions((prev) => new Set([...prev, idToFlag]));
      
      showSuccessToast(
        `${selectedQuestionForFlag.isVariant ? "Variant" : "Question"} flagged successfully and sent to processor for review`
      );
      
      setIsFlagModalOpen(false);
      setSelectedQuestionForFlag(null);
      
      // Optionally refresh the question data
      // Or navigate back to question bank
      setTimeout(() => {
        navigate("/explainer/question-bank");
      }, 1500);
    } catch (err) {
      console.error("Error flagging question:", err);
      showErrorToast(err.message || "Failed to flag question. Please try again.");
    } finally {
      setIsFlagging(false);
    }
  };

  // Handle save draft
  const handleSaveDraft = async () => {
    if (!questionId || !explanation.trim()) {
      showErrorToast("Please enter an explanation before saving draft");
      return;
    }

    try {
      setIsSavingDraft(true);
      // Note: The API might not have a draft endpoint, so we might need to store locally
      // or use a different approach. For now, we'll just show a message.
      showSuccessToast("Draft saved locally (feature to be implemented)");
    } catch (err) {
      console.error("Error saving draft:", err);
      showErrorToast("Failed to save draft");
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Handle submit explanation
  const handleSubmitExplanation = async () => {
    if (!questionId) {
      showErrorToast("Question ID is missing");
      return;
    }

    if (!explanation.trim()) {
      showErrorToast("Please enter an explanation before submitting");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Update explanation - this automatically sets status to pending_processor
      await questionsAPI.updateExplanation(questionId, explanation);
      
      showSuccessToast("Explanation submitted successfully! Question sent to processor for review.");
      
      // Navigate back to question bank
      setTimeout(() => {
        navigate("/explainer/question-bank");
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
        <p className="text-dark-gray">Loading question...</p>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8">
          <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[40px] text-oxford-blue mb-1.5">
            Add Explanation
          </h1>
          <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
            Question ID: {questionIdDisplay}
          </p>
        </div>

        {/* Display Original Question */}
        <div className="border border-[#03274633] shadow-[0px_2px_20px_0px_#0327460D] bg-white pt-[18px] pb-[53px] px-[30px] rounded-[14px] mb-[30px]">
          <h2 className="text-[20px] leading-[32px] font-bold text-blue-dark font-archivo mb-[18px]">
            Question Details
          </h2>
          <QuestionDetails
            question={question}
            isVariant={false}
            onFlag={handleFlagClick}
            isFlagged={flaggedQuestions.has(question.id || question._id)}
          />
        </div>

        {/* Display Variants if any */}
        {variants.length > 0 && (
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

        {/* Explanation Editor */}
        <div className="border border-[#03274633] shadow-[0px_2px_20px_0px_#0327460D] bg-white pt-[18px] pb-[53px] px-[30px] rounded-[14px] mb-[30px]">
          <h2 className="text-[20px] leading-[32px] font-bold text-blue-dark font-archivo mb-[18px]">
            Explanation Editor
          </h2>
          <p className="text-[16px] leading-[100%] font-medium font-roboto text-blue-dark mb-5">
            Explanation
          </p>
          <RichTextEditor
            value={explanation}
            onChange={setExplanation}
            placeholder="Enter the detailed explanation for question here..."
            minHeight="150px"
          />
        </div>

        <SupportingMaterial
          file={file}
          onFileChange={handleFileChange}
          onRemove={handleRemoveFile}
        />

        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 px-5 pb-6 pt-2">
          <OutlineButton
            text="Cancel"
            className="py-[10px] px-7 text-nowrap"
            onClick={handleCancel}
          />
          <OutlineButton
            text="Save Draft"
            className="py-[10px] px-7 text-nowrap"
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
          />
          <PrimaryButton
            text="Submit explanation"
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
        questionTitle={
          selectedQuestionForFlag?.questionText || "Question"
        }
        isVariant={selectedQuestionForFlag?.isVariant || false}
      />
    </div>
  );
}
