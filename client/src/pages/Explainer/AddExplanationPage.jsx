import React, { useState } from "react";
import RichTextEditor from "../../components/common/RichTextEditor";
import { OutlineButton, PrimaryButton } from "../../components/common/Button";
import { useNavigate } from "react-router-dom";

// QuestionDetails Component
const QuestionDetails = ({
  question,
  correctAnswer,
  subject,
  difficulty,
  variant,
}) => {
  return (
    <div className="border border-[#03274633] bg-white pt-[24px] pb-[42px] px-[28px] rounded-[12px] mb-[30px]">
      <div className=" space-y-[30px]">
        <p className="text-[16px] leading-[100%] font-medium font-roboto text-blue-dark">
          <span className="font-medium">Original Question:</span> "{question}"
        </p>
        <p className="text-[16px] leading-[100%] font-normal font-roboto text-blue-dark">
          <span className="text-[#6B7280]">Correct Answer:</span>{" "}
          {correctAnswer}
        </p>
        <div className="flex gap-6 text-[16px] leading-[100%] font-normal font-roboto text-[#6B7280]">
          <span>
            Subject: <span className="text-blue-dark">{subject}</span>
          </span>
          <span>
            Difficulty: <span className="text-blue-dark">{difficulty}</span>
          </span>
          <span>
            Variant: <span className="text-blue-dark">{variant}</span>
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

// TeachingNotes Component
const TeachingNotes = ({ value, onChange }) => {
  return (
    <div className="border border-[#03274633] bg-white pt-[18px] pb-[53px] px-[30px] rounded-[14px] mb-[60px]">
      <h2 className="text-[20px] leading-[32px] font-bold text-blue-dark font-archivo mb-[18px]">
        Optional Teaching Notes
      </h2>
      <div className="mb-5">
        <label className="text-[16px] leading-[100%] font-medium font-roboto text-blue-dark">
          Teacher Notes
        </label>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter Hints, or additional notes for other teachers..."
        className="w-full p-4 border border-[#03274633] rounded-[12px] min-h-[150px] outline-none text-blue-dark placeholder:text-blue-dark placeholder:text-[16px] leading-[100%] font-normal font-roboto"
      />
    </div>
  );
};

// Main App Component
export default function AddExplanationPage() {
  const [explanation, setExplanation] = useState("");
  const [teachingNotes, setTeachingNotes] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const questionData = {
    id: "QB-1442",
    question: "What is the function of chlorophyll?",
    correctAnswer: "Mars",
    subject: "Science",
    difficulty: "Easy",
    variant: "3",
  };

  const handleFileChange = (newFile) => {
    setFile(newFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleCancel = () => {
    navigate("/explainer/question-bank");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8">
          <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[40px] text-oxford-blue mb-1.5">
            Add Explanation
          </h1>
          <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
            Questions ID: {questionData.id}
          </p>
        </div>

        <div className="border border-[#03274633] shadow-[0px_2px_20px_0px_#0327460D] bg-white pt-[18px] pb-[53px] px-[30px] rounded-[14px] mb-[30px]">
          <div>
            <h2 className="text-[20px] leading-[32px] font-bold text-blue-dark font-archivo mb-[18px]">
              Final Approve Question
            </h2>
            <QuestionDetails
              question={questionData.question}
              correctAnswer={questionData.correctAnswer}
              subject={questionData.subject}
              difficulty={questionData.difficulty}
              variant={questionData.variant}
            />
          </div>

          <div>
            <h2 className="text-[20px] leading-[32px] font-bold text-blue-dark font-archivo mb-[18px]">
              Explanation Editor
            </h2>
            <p className="text-[16px] leading-[100%] font-medium font-roboto text-blue-dark mb-5">
              Explanation
            </p>
            <RichTextEditor
              value={explanation}
              onChange={setExplanation}
              placeholder="Enter the  detailed explanation for question here..."
              minHeight="150px"
            />
          </div>
        </div>

        <SupportingMaterial
          file={file}
          onFileChange={handleFileChange}
          onRemove={handleRemoveFile}
        />

        {/* <TeachingNotes value={teachingNotes} onChange={setTeachingNotes} /> */}

        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 px-5 pb-6 pt-2">
          <OutlineButton text="Cancel" className="py-[10px] px-7 text-nowrap" onClick={handleCancel}/>
          <OutlineButton
            text="Save Draft"
            className="py-[10px] px-7 text-nowrap"
          />
          <PrimaryButton
            text="Submit explanation"
            className="py-[10px] px-7 text-nowrap"
          />
        </div>
      </div>
    </div>
  );
}
