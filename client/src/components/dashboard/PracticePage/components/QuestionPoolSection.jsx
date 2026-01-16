import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import SubjectsList from './SubjectsList';
import TopicsList from './TopicsList';

const QuestionPoolSection = ({
  selectedAllQuestions,
  onAllQuestionsChange,
  subjects,
  topics,
  loadingSubjects,
  loadingTopics,
  expandedDomains,
  selectedSubjects,
  selectedSubjectId,
  selectedSubtopics,
  allTopics,
  onSubjectToggle,
  onSubjectCheckboxChange,
  onSubjectExpand,
  onTopicToggle
}) => {
  const { t } = useLanguage();

  return (
    <div className="mb-6 bg-white rounded-xl border border-[#E5E7EB] shadow-dashboard p-4 md:p-6 w-full">
      <h2 className="font-archivo font-bold text-[18px] md:text-[20px] leading-[28px] tracking-[0%] text-oxford-blue mb-4">
        {t('dashboard.practice.questionPool.title')}
      </h2>
      
      <div className="mb-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedAllQuestions}
            onChange={onAllQuestionsChange}
            className="w-5 h-5 rounded border-gray-300 accent-cinnebar-red focus:ring-cinnebar-red"
          />
          <span className="font-archivo font-bold text-[16px] leading-[24px] tracking-[0%] text-oxford-blue">
            {t('dashboard.practice.questionPool.allQuestions')}
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SubjectsList
          subjects={subjects}
          loadingSubjects={loadingSubjects}
          expandedDomains={expandedDomains}
          selectedSubjects={selectedSubjects}
          selectedSubjectId={selectedSubjectId}
          selectedSubtopics={selectedSubtopics}
          allTopics={allTopics}
          onSubjectToggle={onSubjectToggle}
          onSubjectCheckboxChange={onSubjectCheckboxChange}
          onSubjectExpand={onSubjectExpand}
        />
        <TopicsList
          topics={topics}
          loadingTopics={loadingTopics}
          selectedSubjectId={selectedSubjectId}
          selectedSubtopics={selectedSubtopics}
          onTopicToggle={onTopicToggle}
        />
      </div>
    </div>
  );
};

export default QuestionPoolSection;
