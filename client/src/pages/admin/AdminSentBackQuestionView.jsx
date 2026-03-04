import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import adminAPI from "../../api/admin";
import questionsAPI from "../../api/questions";
import examsAPI from "../../api/exams";
import subjectsAPI from "../../api/subjects";
import usersAPI from "../../api/users";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig";
import QuestionDetailsSection from "../../components/Processor/QuestionDetailsSection";
import ClassificationSection from "../../components/Processor/ClassificationSection";
import FlagInfoBanner from "../../components/Processor/FlagInfoBanner";
import AdminSentBackHeader from "../../components/Processor/AdminSentBackHeader";
import AdminRejectFlagModal from "../../components/Processor/modals/AdminRejectFlagModal";

// Helper function to extract option text (handles both string and object formats)
const getOptionText = (optionValue) => {
  if (!optionValue) return "";
  if (typeof optionValue === 'string') return optionValue;
  if (typeof optionValue === 'object') {
    // Handle object format like {option: 'A', text: 'Some text'}
    return optionValue.text || optionValue.option || String(optionValue);
  }
  return String(optionValue);
};

const AdminSentBackQuestionView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get('id');
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("Multiple Choice (MCQ)");
  const [options, setOptions] = useState({ A: "", B: "", C: "", D: "" });
  const [correctAnswer, setCorrectAnswer] = useState("Option A");
  const [source, setSource] = useState("");
  const [explanation, setExplanation] = useState("");

  // Handle question type change - reset options and correct answer for True/False
  const handleQuestionTypeChange = (newType) => {
    setQuestionType(newType);
    if (newType === "True/False") {
      // Set True/False options
      setOptions({ A: "True", B: "False", C: "", D: "" });
      setCorrectAnswer("True");
    } else {
      // Reset to empty for MCQ (but keep existing values if editing)
      if (options.A === "True" && options.B === "False") {
        setOptions({ A: "", B: "", C: "", D: "" });
        setCorrectAnswer("Option A");
      }
    }
  };

  // Classification state - storing IDs and names
  const [examId, setExamId] = useState("");
  const [examName, setExamName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [topicId, setTopicId] = useState("");
  const [topicName, setTopicName] = useState("");

  // Processor assignment
  const [processorId, setProcessorId] = useState("");
  const [processorName, setProcessorName] = useState("");
  const [processors, setProcessors] = useState([]);
  const [loadingProcessors, setLoadingProcessors] = useState(false);

  // Classification data lists
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);

  // Loading states
  const [loadingExams, setLoadingExams] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState(true);

  // Flag rejection modal
  const [showRejectFlagModal, setShowRejectFlagModal] = useState(false);
  const [flagRejectionReason, setFlagRejectionReason] = useState("");
  const [rejectingFlag, setRejectingFlag] = useState(false);

  // Flag info
  const [flagReason, setFlagReason] = useState("");
  const [isFlagged, setIsFlagged] = useState(false);
  const [questionStatus, setQuestionStatus] = useState("");

  const handleOptionChange = (option, value) => {
    setOptions((prev) => ({ ...prev, [option]: value }));
  };

  // Fetch question data on mount
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!questionId) {
        showErrorToast("Question ID is missing", { title: "Error" });
        navigate("/admin/question-bank/sent-back-questions");
        return;
      }

      try {
        setLoadingQuestion(true);
        const response = await adminAPI.getQuestionDetails(questionId);
        
        if (response.success && response.data?.question) {
          const question = response.data.question;
          
          // Set question fields
          setQuestionText(question.questionText || "");
          setExplanation(question.explanation || "");
          
          // Map question type
          const questionTypeMap = {
            "MCQ": "Multiple Choice (MCQ)",
            "TRUE_FALSE": "True/False",
            "SHORT_ANSWER": "Short Answer",
            "ESSAY": "Essay",
          };
          setQuestionType(questionTypeMap[question.questionType] || "Multiple Choice (MCQ)");
          
          // Set options and correct answer
          if (question.options) {
            // Check if it's True/False question
            if (question.questionType === "TRUE_FALSE") {
              setOptions({
                A: getOptionText(question.options.A) || "True",
                B: getOptionText(question.options.B) || "False",
                C: "",
                D: "",
              });
              // Map correct answer: "A" -> "True", "B" -> "False"
              const correctAnswerLetter = typeof question.correctAnswer === 'object' 
                ? (question.correctAnswer.option || question.correctAnswer.text || question.correctAnswer)
                : question.correctAnswer;
              if (correctAnswerLetter === "A") {
                setCorrectAnswer("True");
              } else if (correctAnswerLetter === "B") {
                setCorrectAnswer("False");
              } else {
                setCorrectAnswer("True");
              }
            } else {
              setOptions({
                A: getOptionText(question.options.A) || "",
                B: getOptionText(question.options.B) || "",
                C: getOptionText(question.options.C) || "",
                D: getOptionText(question.options.D) || "",
              });
              if (question.correctAnswer) {
                const correctAnswerLetter = typeof question.correctAnswer === 'object' 
                  ? (question.correctAnswer.option || question.correctAnswer.text || question.correctAnswer)
                  : question.correctAnswer;
                setCorrectAnswer(`Option ${correctAnswerLetter}`);
              }
            }
          }
          
          // Set classification
          if (question.exam) {
            setExamId(question.exam.id || question.exam);
            setExamName(question.exam.name || "");
          }
          if (question.subject) {
            setSubjectId(question.subject.id || question.subject);
            setSubjectName(question.subject.name || "");
          }
          if (question.topic) {
            setTopicId(question.topic.id || question.topic);
            setTopicName(question.topic.name || "");
          }
          
          // Set processor
          if (question.assignedProcessor) {
            setProcessorId(question.assignedProcessor.id || question.assignedProcessor);
            const procName = question.assignedProcessor.name || 
                           question.assignedProcessor.fullName || 
                           question.assignedProcessor.username || "";
            setProcessorName(procName);
          }
          
          // Set flag info
          setIsFlagged(question.isFlagged || false);
          setFlagReason(question.flagReason || "");
          setQuestionStatus(question.status || "");
        }
      } catch (error) {
        showErrorToast(
          error.response?.data?.message || "Failed to load question",
          { title: "Error" }
        );
        navigate("/admin/question-bank/sent-back-questions");
      } finally {
        setLoadingQuestion(false);
      }
    };

    if (questionId) {
      fetchQuestion();
    }
  }, [questionId, navigate]);

  // Fetch exams on component mount
  useEffect(() => {
    const fetchExams = async () => {
      setLoadingExams(true);
      try {
        const response = await examsAPI.getAllExams({ status: "active" });
        if (response.success && response.data?.exams) {
          setExams(response.data.exams);
        }
      } catch (error) {
        showErrorToast(
          error.message || "Failed to load exams",
          { title: "Error" }
        );
      } finally {
        setLoadingExams(false);
      }
    };
    fetchExams();
  }, []);

  // Fetch subjects when exam changes
  useEffect(() => {
    if (!examId) {
      setSubjects([]);
      setSubjectId("");
      setSubjectName("");
      setTopics([]);
      setTopicId("");
      setTopicName("");
      return;
    }

    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      try {
        const response = await subjectsAPI.getAllSubjects();
        if (response.success && response.data?.subjects) {
          // Filter subjects by the selected exam
          const filteredSubjects = response.data.subjects.filter(
            (subject) => subject.examId === examId
          );
          setSubjects(filteredSubjects);
          
          // Reset subject selection if current subject doesn't belong to selected exam
          if (subjectId && !filteredSubjects.find(s => s.id === subjectId)) {
            setSubjectId("");
            setSubjectName("");
            setTopics([]);
            setTopicId("");
            setTopicName("");
          }
        }
      } catch (error) {
        showErrorToast(
          error.message || "Failed to load subjects",
          { title: "Error" }
        );
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, [examId]);

  // Fetch topics when subject changes
  useEffect(() => {
    if (!subjectId) {
      setTopics([]);
      setTopicId("");
      setTopicName("");
      return;
    }

    const fetchTopics = async () => {
      setLoadingTopics(true);
      try {
        const response = await questionsAPI.getTopicsBySubject(subjectId);
        if (response.success && response.data?.topics) {
          setTopics(response.data.topics);
        }
      } catch (error) {
        showErrorToast(
          error.message || "Failed to load topics",
          { title: "Error" }
        );
      } finally {
        setLoadingTopics(false);
      }
    };
    fetchTopics();
  }, [subjectId]);

  // Fetch processors on component mount
  useEffect(() => {
    const fetchProcessors = async () => {
      setLoadingProcessors(true);
      try {
        const response = await usersAPI.getAllUsers({ 
          adminRole: 'processor',
          status: 'active',
          limit: 100 
        });
        if (response.success && response.data?.users) {
          const loadedProcessors = response.data.users;
          setProcessors(loadedProcessors);
        } else if (response.success && response.data?.admins) {
          const loadedProcessors = response.data.admins;
          setProcessors(loadedProcessors);
        }
      } catch (error) {
        showErrorToast(
          error.message || "Failed to load processors",
          { title: "Error" }
        );
      } finally {
        setLoadingProcessors(false);
      }
    };
    fetchProcessors();
  }, []);

  // Handle exam selection
  const handleExamChange = (selectedExamName) => {
    const selectedExam = exams.find((e) => e.name === selectedExamName);
    if (selectedExam) {
      setExamId(selectedExam.id);
      setExamName(selectedExamName);
    } else {
      setExamId("");
      setExamName("");
    }
    setSubjectId("");
    setSubjectName("");
    setTopicId("");
    setTopicName("");
  };

  // Handle subject selection
  const handleSubjectChange = (selectedSubjectName) => {
    const selectedSubject = subjects.find((s) => s.name === selectedSubjectName);
    if (selectedSubject) {
      setSubjectId(selectedSubject.id);
      setSubjectName(selectedSubjectName);
    } else {
      setSubjectId("");
      setSubjectName("");
    }
    setTopicId("");
    setTopicName("");
  };

  // Handle topic selection
  const handleTopicChange = (selectedTopicName) => {
    const selectedTopic = topics.find((t) => t.name === selectedTopicName);
    if (selectedTopic) {
      setTopicId(selectedTopic.id);
      setTopicName(selectedTopicName);
    } else {
      setTopicId("");
      setTopicName("");
    }
  };

  // Handle processor selection
  const handleProcessorChange = (selectedProcessorName) => {
    const selectedProcessor = processors.find((p) => {
      const pName = p.name || p.fullName || p.username || "";
      const normalizedSelected = selectedProcessorName.trim();
      const normalizedPName = pName.trim();
      return normalizedPName === normalizedSelected;
    });
    
    if (selectedProcessor && selectedProcessor.id) {
      setProcessorId(selectedProcessor.id);
      setProcessorName(selectedProcessorName);
    } else {
      setProcessorId("");
      setProcessorName("");
    }
  };

  const handleUpdate = async () => {
    // Validation
    if (!questionText.trim()) {
      showErrorToast("Question text is required", { title: "Validation Error" });
      return;
    }

    if (!examId) {
      showErrorToast("Please select an exam", { title: "Validation Error" });
      return;
    }

    if (!subjectId) {
      showErrorToast("Please select a subject", { title: "Validation Error" });
      return;
    }

    if (!topicId) {
      showErrorToast("Please select a topic", { title: "Validation Error" });
      return;
    }

    if (!processorId) {
      showErrorToast("Please select a processor", { title: "Validation Error" });
      return;
    }

    // Validate MCQ fields
    if (questionType === "Multiple Choice (MCQ)") {
      if (!options.A.trim() || !options.B.trim() || !options.C.trim() || !options.D.trim()) {
        showErrorToast("All options are required", { title: "Validation Error" });
        return;
      }
      
      // Check for duplicate options (case-insensitive, trimmed)
      const optionValues = [
        options.A.trim().toLowerCase(),
        options.B.trim().toLowerCase(),
        options.C.trim().toLowerCase(),
        options.D.trim().toLowerCase()
      ];
      
      const uniqueOptions = new Set(optionValues);
      if (uniqueOptions.size < 4) {
        showErrorToast("Options cannot be the same. Please provide unique options for each choice.", { title: "Validation Error" });
        return;
      }
      
      if (!correctAnswer) {
        showErrorToast("Please select a correct answer", { title: "Validation Error" });
        return;
      }
    }
    
    // Validate True/False fields
    if (questionType === "True/False") {
      if (!correctAnswer || (correctAnswer !== "True" && correctAnswer !== "False")) {
        showErrorToast("Please select True or False as the correct answer", { title: "Validation Error" });
        return;
      }
    }

    setSubmitting(true);
    try {
      // Map question type from display name to API value
      const questionTypeMap = {
        "Multiple Choice (MCQ)": "MCQ",
        "True/False": "TRUE_FALSE",
        "Short Answer": "SHORT_ANSWER",
        "Essay": "ESSAY",
      };
      const apiQuestionType = questionTypeMap[questionType] || "MCQ";

      // Map correct answer from "Option A" to "A"
      const correctAnswerLetter = correctAnswer.replace("Option ", "");

      // Prepare question data
      const questionData = {
        exam: examId,
        subject: subjectId,
        topic: topicId,
        questionText: questionText.trim(),
        questionType: apiQuestionType,
        explanation: explanation?.trim() || "",
      };

      questionData.assignedProcessor = processorId;

      // Add MCQ-specific fields
      if (apiQuestionType === "MCQ") {
        questionData.options = {
          A: options.A.trim(),
          B: options.B.trim(),
          C: options.C.trim(),
          D: options.D.trim(),
        };
        questionData.correctAnswer = correctAnswerLetter;
      }
      
      // Add True/False-specific fields
      if (apiQuestionType === "TRUE_FALSE") {
        questionData.options = {
          A: "True",
          B: "False",
        };
        // Map "True" to "A" and "False" to "B"
        questionData.correctAnswer = correctAnswer === "True" ? "A" : "B";
      }

      // Call the API to update question
      // Use gatherer update endpoint for flagged questions or rejected questions
      let response;
      const isRejected = questionStatus === 'rejected';
      if ((isFlagged && questionStatus === 'pending_gatherer') || isRejected) {
        // Use special endpoint for updating flagged questions or rejected questions
        response = await questionsAPI.updateGathererFlaggedQuestion(questionId, questionData);
      } else {
        // For admin-created questions, we might need a different endpoint
        // For now, try the gatherer endpoint
        response = await questionsAPI.updateGathererFlaggedQuestion(questionId, questionData);
      }

      if (response.success) {
        showSuccessToast(
          response.message || "Question updated successfully",
          { title: "Success" }
        );
        setTimeout(() => {
          navigate("/admin/question-bank/sent-back-questions");
        }, 1500);
      } else {
        showErrorToast(
          response.message || "Failed to update question",
          { title: "Error" }
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update question";
      showErrorToast(errorMessage, { title: "Error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectFlag = async () => {
    if (!flagRejectionReason.trim()) {
      showErrorToast("Please provide a reason for rejecting the flag", { title: "Validation Error" });
      return;
    }

    setRejectingFlag(true);
    try {
      const response = await questionsAPI.rejectFlagByGatherer(questionId, flagRejectionReason);
      
      if (response.success) {
        showSuccessToast("Flag rejected successfully", { title: "Success" });
        setTimeout(() => {
          navigate("/admin/question-bank/sent-back-questions");
        }, 1500);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to reject flag";
      showErrorToast(errorMessage, { title: "Error" });
    } finally {
      setRejectingFlag(false);
      setShowRejectFlagModal(false);
      setFlagRejectionReason("");
    }
  };

  const handleCloseRejectFlagModal = () => {
    setShowRejectFlagModal(false);
    setFlagRejectionReason("");
  };

  const handleCancel = () => {
    navigate("/admin/question-bank/sent-back-questions");
  };

  if (loadingQuestion) {
    return (
      <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-center" dir={dir}>
        <p className="text-[16px] text-gray-600">Loading question...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 lg:px-8" dir={dir}>
        <div className="mx-auto max-w-[1200px]">
          {/* Header */}
          <AdminSentBackHeader
            t={t}
            isFlagged={isFlagged}
            onRejectFlag={() => setShowRejectFlagModal(true)}
            onCancel={handleCancel}
            onUpdate={handleUpdate}
            submitting={submitting}
          />

          {/* Flag Info Banner */}
          <FlagInfoBanner isFlagged={isFlagged} flagReason={flagReason} />

          {/* Main Content - Two Columns */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Question Details (2/3 width on xl screens) */}
            <QuestionDetailsSection
              questionText={questionText}
              setQuestionText={setQuestionText}
              questionType={questionType}
              handleQuestionTypeChange={handleQuestionTypeChange}
              options={options}
              handleOptionChange={handleOptionChange}
              correctAnswer={correctAnswer}
              setCorrectAnswer={setCorrectAnswer}
              explanation={explanation}
              setExplanation={setExplanation}
              t={t}
            />

            {/* Right Column - Classification (1/3 width on xl screens) */}
            <ClassificationSection
              examName={examName}
              handleExamChange={handleExamChange}
              subjectName={subjectName}
              handleSubjectChange={handleSubjectChange}
              topicName={topicName}
              handleTopicChange={handleTopicChange}
              source={source}
              setSource={setSource}
              processorName={processorName}
              handleProcessorChange={handleProcessorChange}
              exams={exams}
              subjects={subjects}
              topics={topics}
              processors={processors}
              examId={examId}
              subjectId={subjectId}
              loadingExams={loadingExams}
              loadingSubjects={loadingSubjects}
              loadingTopics={loadingTopics}
              loadingProcessors={loadingProcessors}
              t={t}
            />
          </div>
        </div>
      </div>

      {/* Reject Flag Modal */}
      <AdminRejectFlagModal
        isOpen={showRejectFlagModal}
        flagRejectionReason={flagRejectionReason}
        setFlagRejectionReason={setFlagRejectionReason}
        onClose={handleCloseRejectFlagModal}
        onConfirm={handleRejectFlag}
        processing={rejectingFlag}
        t={t}
      />
    </>
  );
};

export default AdminSentBackQuestionView;

