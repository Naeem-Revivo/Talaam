import React from "react";
import Dropdown from "../common/Dropdown";

const ClassificationSection = ({
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
        {t('gatherer.addNewQuestion.classification.title')}
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
            {t('gatherer.addNewQuestion.classification.reference')}
          </label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
            placeholder={t('gatherer.addNewQuestion.placeholders.reference')}
          />
        </div>

        {/* Processor Assignment */}
        <div>
          <Dropdown
            label={
              <>
                {t('gatherer.addNewQuestion.classification.processor')} <span className="text-red-500 text-sm">*</span>
              </>
            }
            value={processorName}
            onChange={handleProcessorChange}
            placeholder="Select processor"
            options={
              loadingProcessors
                ? [t('gatherer.addNewQuestion.messages.loading')]
                : processors.length > 0
                ? processors.map((processor) => {
                    const displayName = processor.name || processor.fullName || processor.username || "Unnamed Processor";
                    return displayName;
                  }).filter(Boolean)
                : [t('gatherer.addNewQuestion.messages.noProcessorsAvailable')]
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ClassificationSection;
