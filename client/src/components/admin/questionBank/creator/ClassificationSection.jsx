import React from 'react';
import Dropdown from '../../../common/Dropdown';

const ClassificationSection = ({
  examName,
  handleExamChange,
  subjectName,
  handleSubjectChange,
  topicName,
  handleTopicChange,
  source,
  setSource,
  loadingExams,
  loadingSubjects,
  loadingTopics,
  exams,
  subjects,
  topics,
  examId,
  subjectId,
  t
}) => {
  return (
    <div className="bg-white rounded-[14px] border border-[#03274633] px-[30px] pt-[50px] pb-10 h-[725px]">
      <h2 className="text-[20px] leading-[100%] font-bold font-archivo text-blue-dark mb-6">
        {t("creator.createVariants.classification.title")}
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
            Reference
          </label>
          <Dropdown
            value={source}
            onChange={setSource}
            placeholder="Select Reference"
            options={[
              t("creator.createVariants.sources.textbook"),
              t("creator.createVariants.sources.pastExam"),
              t("creator.createVariants.sources.custom"),
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default ClassificationSection;
