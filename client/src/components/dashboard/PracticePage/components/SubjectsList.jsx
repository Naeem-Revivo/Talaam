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
            const hasSelectedSubtopics = allTopics.some(topic => {
              const topicId = topic.id || topic._id;
              if (!topicId || !selectedSubtopics[topicId]) return false;
              
              // Check if this topic belongs to the current subject
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
                className={`w-full flex items-center justify-between rounded-lg transition-colors h-[44px] px-4 py-3 bg-white border ${
                  shouldHighlight ? 'border-cinnebar-red border-2' : 'border-[#E5E7EB]'
                }`}
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
                    className="w-5 h-5 rounded border-gray-300 accent-cinnebar-red focus:ring-cinnebar-red flex-shrink-0"
                  />
                  <span className="font-archivo font-normal text-[16px] leading-[24px] tracking-[0%] text-oxford-blue">
                    {subject.name} {isSelected && <span className="text-cinnebar-red font-semibold">(Selected)</span>}
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-oxford-blue transition-transform flex-shrink-0 ${
                    selectedSubjectId === subjectId ? 'rotate-90' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SubjectsList;
