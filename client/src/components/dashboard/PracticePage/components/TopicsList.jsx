import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import Loader from '../../../../components/common/Loader';

const TopicsList = ({
  topics,
  loadingTopics,
  selectedSubjectId,
  selectedSubtopics,
  onTopicToggle,
  onSelectAll,
  onClear
}) => {
  const { t } = useLanguage();

  return (
    <div>
      <div className="flex flex-col w-full mb-3">
        <h3 className="font-archivo font-semibold text-[16px] leading-[24px] tracking-[0%] text-oxford-blue mb-4">
          {t('dashboard.practice.questionPool.topic')}
        </h3>
        {topics.length > 0 && (
          <div className="flex items-center justify-between gap-4 w-full">
            <button
              onClick={onSelectAll}
              className="font-roboto font-normal text-base text-cinnebar-red hover:underline"
            >
              Select All
            </button>
            <button
              onClick={onClear}
              className="font-roboto font-normal text-base text-oxford-blue hover:underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>
      <div className={loadingTopics ? "min-h-[200px] flex flex-col" : "space-y-2"}>
        {loadingTopics ? (
          <div className="flex-1 flex items-center justify-center py-4">
            <Loader size="sm" text="Loading topics..." />
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-4 text-oxford-blue">
            {selectedSubjectId ? 'No topics available for this subject' : 'Select a subject to view topics'}
          </div>
        ) : (
          topics.map((topic) => (
            <label 
              key={topic.id || topic._id} 
              className="w-full flex items-center gap-3 cursor-pointer rounded-lg transition-colors h-[44px] px-4 py-3 bg-white border border-[#E5E7EB]"
            >
              <input
                type="checkbox"
                checked={selectedSubtopics[topic.id || topic._id] || false}
                onChange={() => onTopicToggle(topic.id || topic._id)}
                className="w-4 h-4 rounded-[14px] border-2 border-[#E5E7EB] accent-cinnebar-red focus:ring-cinnebar-red"
              />
              <span className="font-archivo font-normal text-base tracking-[0%] text-oxford-blue">
                {topic.name}
              </span>
              <span className="font-roboto font-normal text-[14px] leading-[20px] tracking-[0%] text-[#6697B7] ml-auto">
                {topic.count || 0}
              </span>
            </label>
          ))
        )}
      </div>
    </div>
  );
};

export default TopicsList;
