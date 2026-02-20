import { useState, useEffect } from "react";
import studentQuestionsAPI from "../api/studentQuestions";
import { getDaysFromRange } from "../utils/analytics";

/**
 * Custom hook to fetch and manage accuracy trend data
 */
const useAccuracyTrend = (selectedRange = "all") => {
  const [accuracyTrendData, setAccuracyTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccuracyTrend = async () => {
      try {
        setLoading(true);
        setError(null);
        const days = getDaysFromRange(selectedRange);
        const response = await studentQuestionsAPI.getTestModeAccuracyTrend(days);
        
        if (response.success && response.data) {
          setAccuracyTrendData(response.data);
        } else {
          setAccuracyTrendData([]);
        }
      } catch (err) {
        console.error("Error fetching accuracy trend:", err);
        setError(err);
        setAccuracyTrendData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAccuracyTrend();
  }, [selectedRange]);

  return { accuracyTrendData, loading, error };
};

export default useAccuracyTrend;
