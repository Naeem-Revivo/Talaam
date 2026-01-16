import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import Loader from '../../../../components/common/Loader';

const TopicsList = ({
  topics,
  loadingTopics,
  selectedSubjectId,
  selectedSubtopics,
  onTopicToggle
}) => {
  const { t } = useLanguage();

  return (
    <div>
      <h3 className="font-archivo font-semibold text-[16px] leading-[24px] tracking-[0%] text-oxford-blue mb-3">
        {t('dashboard.practice.questionPool.topic')}
      </h3>
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
                className="w-5 h-5 rounded border-gray-300 accent-cinnebar-red focus:ring-cinnebar-red"
              />
              <span className="font-archivo font-normal text-[16px] leading-[24px] tracking-[0%] text-oxford-blue">
                {topic.name}
              </span>
              <span className="font-roboto font-normal text-[16px] leading-[24px] tracking-[0%] text-moonstone-blue ml-auto">
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
