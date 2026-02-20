import React, { useState } from "react";
import { Loader } from "../../common/Loader";
import TabButtons from "./TabButtons";
import ProgressBar from "./ProgressBar";

// Static data matching the image
const STATIC_QUANTITATIVE_TOPICS = [
  { topicId: "1", topicName: "Algebra", accuracy: 85 },
  { topicId: "2", topicName: "Geometry", accuracy: 78 },
  { topicId: "3", topicName: "Arithmetic", accuracy: 92 },
  { topicId: "4", topicName: "Statistics", accuracy: 71 },
  { topicId: "5", topicName: "Probability", accuracy: 66 },
];

const STATIC_LANGUAGE_TOPICS = [
  { topicId: "6", topicName: "Reading Comprehension", accuracy: 88 },
  { topicId: "7", topicName: "Grammar", accuracy: 75 },
  { topicId: "8", topicName: "Vocabulary", accuracy: 82 },
  { topicId: "9", topicName: "Writing", accuracy: 70 },
];

const TopicAccuracyList = ({
  quantitativeTopics,
  languageTopics,
  loading = false,
  activeTab: externalActiveTab,
  onTabChange: externalOnTabChange,
  title = "Accuracy by Topic",
}) => {
  // Use internal state if external props not provided, otherwise use external
  const [internalActiveTab, setInternalActiveTab] = useState("quantitative");
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  const onTabChange = externalOnTabChange || setInternalActiveTab;

  const tabs = [
    { value: "quantitative", label: "Quantitative" },
    { value: "language", label: "Language" },
  ];

  // Use static data if no props provided, otherwise use props
  const quantitativeData = quantitativeTopics && quantitativeTopics.length > 0 
    ? quantitativeTopics 
    : STATIC_QUANTITATIVE_TOPICS;
  const languageData = languageTopics && languageTopics.length > 0 
    ? languageTopics 
    : STATIC_LANGUAGE_TOPICS;

  const displayedTopics =
    activeTab === "quantitative" ? quantitativeData : languageData;

  return (
    <div
      className="bg-white border border-[#E5E7EB] rounded-[8px] p-4 md:p-6 w-full min-h-[250px] md:min-h-[300px]"
      style={{ borderWidth: "1px" }}
    >
      <h2 className="text-[18px] md:text-[20px] font-bold text-oxford-blue font-archivo leading-[26px] md:leading-[28px] tracking-[0%] mb-4 md:mb-6">
        {title}
      </h2>

      <TabButtons tabs={tabs} activeTab={activeTab} onChange={onTabChange} />

      {loading ? (
        <div className="flex items-center justify-center h-[200px]">
          <Loader size="lg" />
        </div>
      ) : displayedTopics.length > 0 ? (
        <div className="space-y-3 md:space-y-4">
          {displayedTopics.map((topic, index) => (
            <div
              key={topic.topicId || index}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-3"
            >
              <span className="text-[14px] font-medium text-oxford-blue font-archivo leading-[20px] tracking-[0%]">
                {topic.topicName || `Topic ${index + 1}`}
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex-1 sm:w-[200px]">
                  <ProgressBar
                    value={topic.accuracy || 0}
                    max={100}
                    height="h-2"
                    barClassName="bg-[#6CA6C1]"
                    bgClassName="bg-[#F3F4F6]"
                  />
                </div>
                <span className="text-[14px] md:text-[16px] font-bold text-[#111827] font-archivo leading-[20px] md:leading-[24px] tracking-[0%] text-right min-w-[40px]">
                  {Math.round(topic.accuracy || 0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-dark-gray font-roboto">No topic data available</p>
        </div>
      )}
    </div>
  );
};

export default TopicAccuracyList;
