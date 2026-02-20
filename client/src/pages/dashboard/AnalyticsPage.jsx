import React, { useState } from "react";
import { questionmark, target, timericon } from "../../assets/svg";
import { useLanguage } from "../../context/LanguageContext";
import useTestSummary from "../../hooks/useTestSummary";
import useAccuracyTrend from "../../hooks/useAccuracyTrend";
import {
  filterTopicsByCategory,
  calculateFocusAreas,
  calculatePercentileRank,
  formatQuestionsCompleted,
  calculateProgressPercentage,
} from "../../utils/analytics";
import {
  MetricCard,
  ProgressBar,
  AccuracyTrendChart,
  PercentileVisualization,
  TopicAccuracyList,
  FocusAreasList,
} from "../../components/dashboard/analytics";

const AnalyticsPage = () => {
  const { t } = useLanguage();
  const [selectedRange, setSelectedRange] = useState("all");
  const [selectedTopicTab, setSelectedTopicTab] = useState("quantitative");

  // Custom hooks for data fetching
  const { testSummary, loading } = useTestSummary();
  const { accuracyTrendData, loading: trendLoading } = useAccuracyTrend(selectedRange);

  // Process data using utility functions
  const topicAccuracyData = testSummary?.topicAccuracy || [];
  const { quantitative: quantitativeTopics, language: languageTopics } =
    filterTopicsByCategory(topicAccuracyData);

  const percentileRank = calculatePercentileRank(testSummary?.accuracy);
  const focusAreas = calculateFocusAreas(topicAccuracyData, 4);

  // Format data for display
  const accuracyData = accuracyTrendData.length > 0 ? accuracyTrendData : [];
  const questionsCompleted = formatQuestionsCompleted(testSummary);
  const progressPercentage = calculateProgressPercentage(testSummary);

  const handleFocusAreaClick = (area) => {
    // Navigate to practice page with the focus area topic
    // This can be implemented when navigation is needed
    console.log("Focus area clicked:", area);
  };

  return (
    <div className="bg-white px-[32px] pt-6 pb-[60px] min-h-screen space-y-8">
      {/* Page Title and Subtitle */}
      <div className="">
        <p className="text-base font-normal text-dashboard-gray font-roboto">
          {t("dashboard.analytics.hero.subtitle")}
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          icon={target}
          iconAlt="Accuracy"
          label={t("dashboard.analytics.metrics.overallAccuracy")}
          value={
            testSummary?.accuracy
              ? `${testSummary.accuracy.toFixed(0)}%`
              : "0%"
          }
          trend="↑ 5% vs last month"
          trendColor="text-[#00A63E]"
          loading={loading}
        />

        <MetricCard
          icon={timericon}
          iconAlt="Time"
          label={t("dashboard.analytics.metrics.avgTimePerQuestion")}
          value={
            testSummary?.averageTimePerQuestion
              ? `${testSummary.averageTimePerQuestion}s`
              : "0s"
          }
          trend="↓ 8s improvement"
          trendColor="text-[#6697B7]"
          loading={loading}
        />

        <MetricCard
          icon={questionmark}
          iconAlt="Target"
          label={t("dashboard.analytics.metrics.questionsCompleted")}
          value={questionsCompleted}
          loading={loading}
        >
          <ProgressBar
            value={progressPercentage}
            max={100}
            className="mt-2"
          />
        </MetricCard>
      </div>

      {/* Accuracy Trend Chart */}
      <AccuracyTrendChart
        data={accuracyData}
        loading={trendLoading}
        selectedRange={selectedRange}
        onRangeChange={setSelectedRange}
        title={`${t("dashboard.analytics.accuracyTrend.title")} (All Sessions)`}
        tooltip="Each point = one session; retakes count as new session."
      />

      {/* Two Column Layout: Percentile and Accuracy by Topic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <PercentileVisualization
          percentileRank={percentileRank}
          loading={loading}
          title={t("dashboard.analytics.yourPercentile.title")}
          description="Based on all users in this QBank"
        />

        <TopicAccuracyList
          quantitativeTopics={quantitativeTopics}
          languageTopics={languageTopics}
          loading={loading}
          activeTab={selectedTopicTab}
          onTabChange={setSelectedTopicTab}
        />
      </div>

      {/* Focus Areas Section */}
      <FocusAreasList
        focusAreas={focusAreas}
        loading={loading}
        onAreaClick={handleFocusAreaClick}
      />
    </div>
  );
};

export default AnalyticsPage;
