import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import Loader from '../../../../components/common/Loader';

const SubjectsList = ({
  subjects,
  loadingSubjects,
  expandedDomains,
  selectedSubjects,
  selectedSubjectId,
  selectedSubtopics,
  allTopics,
  onSubjectToggle,
  onSubjectCheckboxChange,
  onSubjectExpand
}) => {
  const { t } = useLanguage();

  return (
    <div>
      <h3 className="font-archivo font-semibold text-[16px] leading-[24px] tracking-[0%] text-oxford-blue mb-3">
        {t('dashboard.practice.questionPool.subjects')}
      </h3>
      <div className={loadingSubjects ? "min-h-[200px] flex flex-col" : "space-y-2"}>
        {loadingSubjects ? (
          <div className="flex-1 flex items-center justify-center py-4">
            <Loader size="lg" />
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-4 text-oxford-blue">No subjects available</div>
        ) : (
          subjects.map((subject) => {
            const subjectId = subject.id || subject._id;
            const isExpanded = expandedDomains[subjectId];
            const isSelected = selectedSubjects[subjectId] || false;
            
            // Check if any subtopics of this subject are selected
            const subjectIdStr = String(subjectId);
            
            // Get all topics for this subject
            const subjectTopics = allTopics.filter(topic => {
              let topicSubjectId = null;
              if (topic.parentSubject) {
                if (typeof topic.parentSubject === 'object' && topic.parentSubject.id) {
                  topicSubjectId = topic.parentSubject.id;
                } else {
                  topicSubjectId = topic.parentSubject;
                }
              } else {
                topicSubjectId = topic.subjectId || topic.subject?.id || topic.subject?._id || topic.subject;
              }
              return topicSubjectId ? String(topicSubjectId) === subjectIdStr : false;
            });
            
            // Count selected topics for this subject
            const selectedCount = subjectTopics.filter(topic => {
              const topicId = topic.id || topic._id;
              return topicId && selectedSubtopics[topicId];
            }).length;
            
            const totalCount = subjectTopics.length;
            
            const hasSelectedSubtopics = selectedCount > 0;
            
            // Highlight border if subject is selected OR any of its subtopics are selected
            const shouldHighlight = isSelected || hasSelectedSubtopics;
            
            return (
              <button
                key={subjectId}
                onClick={(e) => {
                  // Only toggle expansion on button click, not checkbox
                  if (e.target.type === 'checkbox') {
                    return; // Let checkbox handle its own click
                  }
                  onSubjectExpand(subjectId);
                }}
                className="w-full flex items-center justify-between rounded-lg transition-colors h-[44px] px-4 py-3 bg-white border border-[#E5E7EB]"
              >
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation(); // Prevent button click
                      onSubjectCheckboxChange(subjectId, isSelected);
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent button click
                    className="w-4 h-4 rounded border-2 border-[#D1D5DC] accent-cinnebar-red focus:ring-cinnebar-red flex-shrink-0"
                  />
                  <span className="font-archivo font-normal text-[16px] leading-[24px] tracking-[0%] text-oxford-blue">
                    {subject.name}
                  </span>
                  <span className="font-roboto font-normal text-[14px] leading-[20px] tracking-[0%] text-[#6697B7] ml-auto">
                    {selectedCount}/{totalCount}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SubjectsList;
