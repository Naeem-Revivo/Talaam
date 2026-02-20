import React from "react";
import Dropdown from "../Dropdown";

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
  showAssignedToMe = true,
  translationPrefix = "admin",
  t,
}) => {
  const getTranslationKey = (key) => {
    if (translationPrefix === "gatherer") {
      const keyMap = {
        "sections.classification": "classification.title",
        "fields.exam": "classification.exam",
        "fields.subject": "classification.subject",
        "fields.topic": "classification.topic",
        "fields.reference": "classification.reference",
        "fields.processor": "classification.processor",
        "placeholders.addReference": "placeholders.reference",
        "messages.loading": "messages.loading",
        "messages.noExamsAvailable": "messages.noExamsAvailable",
        "messages.noSubjectsAvailable": "messages.noSubjectsAvailable",
        "messages.noTopicsAvailable": "messages.noTopicsAvailable",
        "messages.noProcessorsAvailable": "messages.noProcessorsAvailable",
        "messages.selectExamFirst": "messages.selectExamFirst",
        "messages.selectSubjectFirst": "messages.selectSubjectFirst",
      };
      const mappedKey = keyMap[key] || key;
      return `gatherer.addNewQuestion.${mappedKey}`;
    }
    return `${translationPrefix}.addNewQuestion.${key}`;
  };

  return (
    <div className="bg-white rounded-[14px] border border-[#03274633] px-[30px] pt-[50px] pb-10 h-[725px]">
      <h2 className="text-[20px] leading-[100%] font-bold font-archivo text-blue-dark mb-6">
        {t(getTranslationKey("sections.classification"))}
      </h2>

      <div className="space-y-6">
        {/* Exam */}
        <div>
          <Dropdown
            label={t(getTranslationKey("fields.exam"))}
            value={examName}
            onChange={handleExamChange}
            placeholder="Select exam"
            options={
              loadingExams
                ? [t(getTranslationKey("messages.loading"))]
                : exams.length > 0
                ? exams.map((exam) => exam.name || "Unnamed Exam").filter(Boolean)
                : [t(getTranslationKey("messages.noExamsAvailable"))]
            }
          />
        </div>

        {/* Subject */}
        <div>
          <Dropdown
            label={t(getTranslationKey("fields.subject"))}
            value={subjectName}
            onChange={handleSubjectChange}
            placeholder="Select subject"
            options={
              !examId
                ? [t(getTranslationKey("messages.selectExamFirst"))]
                : loadingSubjects
                ? [t(getTranslationKey("messages.loading"))]
                : subjects.length > 0
                ? subjects.map((subject) => subject.name || "Unnamed Subject").filter(Boolean)
                : [t(getTranslationKey("messages.noSubjectsAvailable"))]
            }
          />
        </div>

        {/* Topic */}
        <div>
          <Dropdown
            label={t(getTranslationKey("fields.topic"))}
            value={topicName}
            onChange={handleTopicChange}
            placeholder="Select topic"
            options={
              !subjectId
                ? [t(getTranslationKey("messages.selectSubjectFirst"))]
                : loadingTopics
                ? [t(getTranslationKey("messages.loading"))]
                : topics.length > 0
                ? topics.map((topic) => topic.name || "Unnamed Topic").filter(Boolean)
                : [t(getTranslationKey("messages.noTopicsAvailable"))]
            }
          />
        </div>

        {/* Reference */}
        <div>
          <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
            {t(getTranslationKey("fields.reference"))}
          </label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
            placeholder={t(getTranslationKey("placeholders.addReference"))}
          />
        </div>

        {/* Processor Assignment */}
        <div>
          <Dropdown
            label={
              <>
                {t(getTranslationKey("fields.processor"))} {translationPrefix === "gatherer" && (
                  <span className="text-red-500 text-sm">*</span>
                )}
              </>
            }
            value={processorName}
            onChange={handleProcessorChange}
            placeholder="Select processor"
            options={
              loadingProcessors
                ? [t(getTranslationKey("messages.loading"))]
                : (() => {
                    const processorOptions = processors.length > 0
                      ? processors.map((p) => p.name || p.fullName || p.username || "Unnamed Processor").filter(Boolean)
                      : [];
                    const allOptions = showAssignedToMe 
                      ? ["Assigned to me", ...processorOptions]
                      : processorOptions;
                    return allOptions.length > 0 
                      ? allOptions 
                      : [t(getTranslationKey("messages.noProcessorsAvailable"))];
                  })()
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AddQuestionClassificationSection;
