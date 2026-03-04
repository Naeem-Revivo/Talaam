import { useState, useEffect } from "react";
import studentQuestionsAPI from "../api/studentQuestions";

/**
 * Custom hook to fetch and manage test summary data
 */
const useTestSummary = () => {
  const [testSummary, setTestSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await studentQuestionsAPI.getTestSummary();
        if (response.success) {
          setTestSummary(response.data);
        } else {
          setError(new Error("Failed to fetch test summary"));
        }
      } catch (err) {
        console.error("Error fetching test summary:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestSummary();
  }, []);

  return { testSummary, loading, error };
};

export default useTestSummary;
