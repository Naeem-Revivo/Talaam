/**
 * Utility functions for analytics calculations and data processing
 */

/**
 * Filter topics by category (Quantitative vs Language)
 */
export const filterTopicsByCategory = (topics) => {
  const quantitative = topics.filter((topic) => {
    const topicName = (topic.topicName || "").toLowerCase();
    return (
      topicName.includes("algebra") ||
      topicName.includes("geometry") ||
      topicName.includes("arithmetic") ||
      topicName.includes("statistics") ||
      topicName.includes("probability") ||
      topicName.includes("math")
    );
  });

  const language = topics.filter((topic) => {
    const topicName = (topic.topicName || "").toLowerCase();
    return (
      topicName.includes("sentence") ||
      topicName.includes("reading") ||
      topicName.includes("grammar") ||
      topicName.includes("comprehension") ||
      topicName.includes("language")
    );
  });

  return { quantitative, language };
};

/**
 * Calculate focus areas (topics with lowest accuracy)
 */
export const calculateFocusAreas = (topics, limit = 4) => {
  return [...topics]
    .sort((a, b) => (a.accuracy || 0) - (b.accuracy || 0))
    .slice(0, limit)
    .map((topic) => ({
      name: topic.topicName || "Unknown Topic",
      accuracy: Math.round(topic.accuracy || 0),
    }));
};

/**
 * Calculate percentile rank from accuracy
 * TODO: Replace with actual API call when available
 */
export const calculatePercentileRank = (accuracy) => {
  if (!accuracy || accuracy === 0) {
    return 0;
  }
  // Mock calculation: map accuracy to percentile
  // This should be replaced with actual percentile calculation from backend
  return Math.min(Math.round(accuracy * 0.82 + 20), 99);
};

/**
 * Get days from range selection
 */
export const getDaysFromRange = (range) => {
  switch (range) {
    case "7":
      return 7;
    case "30":
      return 30;
    case "all":
    default:
      return 90; // For "all", get last 90 days
  }
};

/**
 * Format questions completed display
 */
export const formatQuestionsCompleted = (testSummary) => {
  if (!testSummary) {
    return "0/1000";
  }
  const completed = testSummary.totalCorrectAnswers || 0;
  const total =
    testSummary.totalQuestionsInBank ||
    testSummary.totalQuestionsAttempted ||
    1000;
  return `${completed}/${total}`;
};

/**
 * Calculate progress percentage
 */
export const calculateProgressPercentage = (testSummary) => {
  if (!testSummary) {
    return 0;
  }
  const completed = testSummary.totalCorrectAnswers || 0;
  const total =
    testSummary.totalQuestionsInBank ||
    testSummary.totalQuestionsAttempted ||
    1000;
  return Math.min((completed / total) * 100, 100);
};
