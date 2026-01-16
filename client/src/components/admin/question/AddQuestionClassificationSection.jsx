import React from "react";
import Dropdown from "../../common/Dropdown";

const AddQuestionClassificationSection = ({
  examName,
  handleExamChange,
  subjectName,
  handleSubjectChange,
  topicName,
  handleTopicChange,
  source,
  setSource,
  processorName,
  handleProcessorChange,
  exams,
  subjects,
  topics,
  processors,
  examId,
  subjectId,
  loadingExams,
  loadingSubjects,
  loadingTopics,
  loadingProcessors,
  t,
}) => {
  return (
    <div className="bg-white rounded-[14px] border border-[#03274633] px-[30px] pt-[50px] pb-10 h-[725px]">
      <h2 className="text-[20px] leading-[100%] font-bold font-archivo text-blue-dark mb-6">
        {t("admin.addNewQuestion.sections.classification")}
      </h2>

      <div className="space-y-6">
        {/* Exam */}
        <div>
          <Dropdown
            label={t("admin.addNewQuestion.fields.exam")}
            value={examName}
            onChange={handleExamChange}
            placeholder="Select exam"
            options={
              loadingExams
                ? ["Loading..."]
                : exams.length > 0
                ? exams.map((exam) => exam.name || "Unnamed Exam").filter(Boolean)
                : ["No exams available"]
            }
          />
        </div>

        {/* Subject */}
        <div>
          <Dropdown
            label={t("admin.addNewQuestion.fields.subject")}
            value={subjectName}
            onChange={handleSubjectChange}
            placeholder="Select subject"
            options={
              !examId
                ? ["Select exam first"]
                : loadingSubjects
                ? ["Loading..."]
                : subjects.length > 0
                ? subjects.map((subject) => subject.name || "Unnamed Subject").filter(Boolean)
                : ["No subjects available"]
            }
          />
        </div>

        {/* Topic */}
        <div>
          <Dropdown
            label={t("admin.addNewQuestion.fields.topic")}
            value={topicName}
            onChange={handleTopicChange}
            placeholder="Select topic"
            options={
              !subjectId
                ? ["Select subject first"]
                : loadingTopics
                ? ["Loading..."]
                : topics.length > 0
                ? topics.map((topic) => topic.name || "Unnamed Topic").filter(Boolean)
                : ["No topics available"]
            }
          />
        </div>

        {/* Reference */}
        <div>
          <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
            {t("admin.addNewQuestion.fields.reference")}
          </label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
            placeholder={t("admin.addNewQuestion.placeholders.addReference")}
          />
        </div>

        {/* Processor Assignment */}
        <div>
          <Dropdown
            label={t("admin.addNewQuestion.fields.processor") || "Processor"}
            value={processorName}
            onChange={handleProcessorChange}
            placeholder="Select processor"
            options={
              loadingProcessors
                ? ["Loading..."]
                : ["Assigned to me", ...(processors.length > 0
                  ? processors.map((p) => p.name || p.fullName || p.username || "Unnamed Processor").filter(Boolean)
                  : [])]
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AddQuestionClassificationSection;
