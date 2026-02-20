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
  onTopicToggle,
  totalAvailableQuestions,
  selectedSubtopicCount,
  onSelectAllTopics,
  onClearTopics
}) => {
  const { t } = useLanguage();

  // Calculate total available questions
  const displayTotalQuestions = totalAvailableQuestions !== null && totalAvailableQuestions !== undefined
    ? totalAvailableQuestions
    : allTopics.reduce((sum, topic) => sum + (topic.count || 0), 0);

  // Check if no questions match filters
  const hasNoMatchingQuestions = selectedSubtopicCount > 0 && totalAvailableQuestions === 0;

  return (
    <div className="bg-white rounded-[15px] border border-[#E6EEF3] shadow-sm shadow-[#0000001A] p-4 md:p-6 w-full">
      <div className="flex items-center justify-between">
      <h2 className="font-archivo font-bold text-[18px] md:text-[20px] leading-[28px] tracking-[0%] text-oxford-blue mb-4">
        {t('dashboard.practice.questionPool.title')}
      </h2>
      {/* Warning message */}
      {hasNoMatchingQuestions && (
        <div className="mb-4 flex items-center gap-2 max-w-[202px]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.1083 14.9999L11.4416 3.33319C11.2962 3.0767 11.0854 2.86335 10.8307 2.71492C10.576 2.56649 10.2864 2.48828 9.99161 2.48828C9.69678 2.48828 9.40724 2.56649 9.1525 2.71492C8.89777 2.86335 8.68697 3.0767 8.54161 3.33319L1.87494 14.9999C1.72801 15.2543 1.65096 15.5431 1.65162 15.837C1.65227 16.1308 1.73059 16.4192 1.87865 16.673C2.0267 16.9269 2.23923 17.137 2.49469 17.2822C2.75014 17.4274 3.03945 17.5025 3.33327 17.4999H16.6666C16.959 17.4996 17.2462 17.4223 17.4993 17.2759C17.7525 17.1295 17.9626 16.9191 18.1087 16.6658C18.2548 16.4125 18.3316 16.1252 18.3316 15.8328C18.3315 15.5404 18.2545 15.2531 18.1083 14.9999Z" stroke="#ED4122" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10 7.5V10.8333" stroke="#ED4122" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10 14.168H10.0083" stroke="#ED4122" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          <p className="font-roboto font-normal text-[12px] leading-[16px] text-orange-dark">
            No questions match your filters. Clear filters to continue.
          </p>
        </div>
      )}
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-3 px-2 py-3 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedAllQuestions}
            onChange={onAllQuestionsChange}
            className="w-4 h-4 rounded border-dashboard-gray accent-cinnebar-red focus:ring-cinnebar-red"
          />
          <span className="font-archivo font-bold text-[16px] leading-[24px] tracking-[0%] text-oxford-blue">
            {t('dashboard.practice.questionPool.allQuestions')} <span className="font-roboto font-normal text-[14px] leading-[20px] text-[#33749F]">({displayTotalQuestions} available)</span>
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
          onSelectAll={onSelectAllTopics}
          onClear={onClearTopics}
        />
      </div>
    </div>
  );
};

export default QuestionPoolSection;
