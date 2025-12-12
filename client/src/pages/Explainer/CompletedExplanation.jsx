import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import { useState, useEffect, useCallback } from "react";
import SearchFilter from "../../components/common/SearchFilter";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";
import questionsAPI from "../../api/questions";
import subjectsAPI from "../../api/subjects";
import Loader from "../../components/common/Loader";

const CompletedExplanationPage = () => {
  const { t } = useLanguage();

  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [completedExplanationsData, setCompletedExplanationsData] = useState([]);
  const [total, setTotal] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  // Define columns for the completed explanations table
  const completedExplanationsColumns = [
    { key: 'questionTitle', label: t("explainer.completedExplanation.table.question") },
    { key: 'processor', label: t("explainer.completedExplanation.table.processor") },
    { key: 'completedOn', label: t("explainer.completedExplanation.table.completedOn") },
    { key: 'actions', label: t("explainer.completedExplanation.table.action") }
  ];

  // Format date to "Today", "Yesterday", or formatted date
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return "Today";
    } else if (date.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  };

  // Fetch completed explanations from API
  const fetchCompletedExplanations = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch completed explanations using the dedicated API endpoint
      const response = await questionsAPI.getCompletedExplanations();
      
      console.log('Full API Response:', JSON.stringify(response, null, 2));
      
      // Extract questions from response
      let allQuestions = [];
      if (response.success) {
        if (response.data?.questions) {
          allQuestions = response.data.questions;
        } else if (Array.isArray(response.data)) {
          allQuestions = response.data;
        } else if (Array.isArray(response)) {
          allQuestions = response;
        }
      } else {
        console.error('API response not successful:', response);
      }
      
      console.log('Extracted questions count:', allQuestions.length);
      console.log('First question sample:', allQuestions[0]);

      // Transform to table format - show ALL questions returned by API (no filtering)
      const transformedData = allQuestions
        .map((question, index) => {
          console.log(`Processing question ${index}:`, {
            id: question.id,
            _id: question._id,
            questionText: question.questionText,
            hasExplanation: !!question.explanation,
            explanationLength: question.explanation?.length || 0
          });
          
          const processorName = question.assignedProcessor?.name || 
                               question.assignedProcessor?.fullName || 
                               question.approvedBy?.name ||
                               question.approvedBy?.fullName ||
                               question.assignedProcessor?.username ||
                               "—";

          const questionId = question.id || question._id;
          const questionText = question.questionText || question.question || "";

          if (!questionId) {
            console.error(`Question ${index} is missing ID:`, question);
            return null;
          }

          const transformed = {
            id: questionId,
            questionTitle: questionText ? (questionText.substring(0, 60) + (questionText.length > 60 ? "..." : "")) : "—",
            processor: processorName,
            completedOn: formatDate(question.updatedAt || question.createdAt),
            actionType: 'view',
            originalData: question
          };
          
          console.log(`Transformed question ${index}:`, transformed);
          return transformed;
        })
        .filter(item => item !== null); // Remove any null items

      // Sort by date (most recent first)
      transformedData.sort((a, b) => {
        const dateA = new Date(a.originalData?.updatedAt || a.originalData?.createdAt || 0);
        const dateB = new Date(b.originalData?.updatedAt || b.originalData?.createdAt || 0);
        return dateB - dateA;
      });

      console.log('Transformed data:', transformedData.length, transformedData);
      console.log('Transformed data with IDs:', transformedData.map(t => ({ id: t.id, hasId: !!t.id })));

      // Filter out any items without IDs (shouldn't happen, but safety check)
      const validData = transformedData.filter(item => item.id);
      console.log('Valid data after ID filter:', validData.length);

      setCompletedExplanationsData(validData);
      setTotal(validData.length);
    } catch (error) {
      console.error('Error fetching completed explanations:', error);
      setCompletedExplanationsData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch subjects for filter
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await subjectsAPI.getAllSubjects();
        let subjectsList = [];
        
        if (response.success) {
          if (response.data?.subjects && Array.isArray(response.data.subjects)) {
            subjectsList = response.data.subjects;
          } else if (Array.isArray(response.data)) {
            subjectsList = response.data;
          }
        }
        
        setSubjects(subjectsList);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchCompletedExplanations();
  }, [fetchCompletedExplanations]);

  // Apply filters
  const filteredData = completedExplanationsData.filter(item => {
    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesSearch = item.questionTitle?.toLowerCase().includes(searchLower) ||
                           item.processor?.toLowerCase().includes(searchLower);
      if (!matchesSearch) {
        return false;
      }
    }

    // Filter by topic (subject)
    if (topic && topic !== "Processor") {
      const questionSubject = item.originalData?.subject?.name || 
                             item.originalData?.subject || "";
      if (questionSubject !== topic) {
        console.log(`Filtering out item ${item.id}: subject "${questionSubject}" !== topic "${topic}"`);
        return false;
      }
    }

    return true;
  });
  
  console.log(`Filtered data: ${filteredData.length} out of ${completedExplanationsData.length} items`);

  // Handler for view action
  const handleView = (item) => {
    if (item.originalData?.id) {
      navigate(`/explainer/question-bank/question/${item.originalData.id}`);
    }
  };

  // Handler for edit action (if needed)
  const handleEdit = (item) => {
    if (item.originalData?.id) {
      navigate(`/explainer/question-bank/add-explanation?questionId=${item.originalData.id}`);
    }
  };

  const topicOptions = ["Processor", ...subjects.map(s => s.name || s)];
  const subtopicOptions = ["Date", "Medium", "Easy", "Hard"];

  const handleCancel = () => {
    navigate("/explainer/question-bank");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[60px]">
        <header className="flex justify-between gap-4">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue mb-2">
              {t("explainer.completedExplanation.title")}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t("explainer.completedExplanation.subtitle")}
            </p>
          </div>
            <OutlineButton text={t("explainer.completedExplanation.back")} className="py-[10px] px-5" onClick={handleCancel}/>
        </header>

        <SearchFilter
          searchValue={search}
          topicValue={topic}
          subtopicValue={subtopic}
          onSearchChange={setSearch}
          onTopicChange={setTopic}
          onSubtopicChange={setSubtopic}
          topicOptions={topicOptions}
          subtopicOptions={subtopicOptions}
          searchPlaceholder={t("explainer.completedExplanation.searchPlaceholder")}
        />

      {loading ? (
        <Loader 
          size="lg" 
          color="oxford-blue" 
          text={t("explainer.completedExplanation.loading") || "Loading..."}
          className="py-12 min-h-[300px]"
        />
      ) : (
        <>
          {console.log('Rendering table - filteredData length:', filteredData.length, 'items:', filteredData)}
          <Table
            items={filteredData.slice((currentPage - 1) * 10, currentPage * 10)}
            columns={completedExplanationsColumns}
            page={currentPage}
            pageSize={10}
            total={filteredData.length}
            onPageChange={setCurrentPage}
            onView={handleView}
            onEdit={handleEdit}
            emptyMessage={t("explainer.completedExplanation.emptyMessage")}
          />
        </>
      )}
      </div>
    </div>
  );
};

export default CompletedExplanationPage;