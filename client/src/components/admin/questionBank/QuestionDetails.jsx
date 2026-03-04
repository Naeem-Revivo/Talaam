import React from 'react';
import { getOptionText, getCorrectAnswerLetter } from './utils/questionHelpers';
import { cleanQuestionText, cleanHtmlForDisplay } from '../../../utils/textUtils';

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
  // For display: use clean text (for truncation/tooltips)
  const questionText = cleanQuestionText(question.questionText);
  // For rendering: use clean HTML (preserves formatting)
  const questionTextHtml = cleanHtmlForDisplay(question.questionText);
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

export default QuestionDetails;
