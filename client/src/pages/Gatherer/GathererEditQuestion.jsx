import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import questionsAPI from "../../api/questions";
import examsAPI from "../../api/exams";
import subjectsAPI from "../../api/subjects";
import topicsAPI from "../../api/topics";
import usersAPI from "../../api/users";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig";
import RichTextEditor from "../../components/common/RichTextEditor";

const Dropdown = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Automatically show default if value is empty
  const displayValue = value && value.trim() !== "" ? value : (options && options.length > 0 ? options[0] : "Select...");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full" ref={dropdownRef}>
      {/* Label only on small screens */}
      <p className="text-[16px] leading-[100%] font-semibold text-oxford-blue mb-3 block lg:hidden">{label}</p>

      {/* Dropdown Box */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-[50px] cursor-pointer items-center justify-between rounded-lg bg-white px-4 text-[16px] leading-[100%] font-normal text-oxford-blue border border-[#03274633]"
      >
        <span>{displayValue}</span>
        <svg
          width="15"
          height="9"
          viewBox="0 0 15 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            d="M0.6875 0.726562L7.00848 6.71211L13.3295 0.726562"
            stroke="#032746"
            strokeWidth="2"
          />
        </svg>

        {/* Dropdown Menu */}
        {isOpen && (
          <ul className="absolute left-0 top-full z-10 mt-1 w-full rounded-lg border border-gray-100 bg-white shadow-lg">
            {options.map((option) => (
              <li
                key={option}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                  displayValue === option ? "font-semibold text-oxford-blue" : "text-gray-700"
                }`}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const GathererEditQuestionPage = () => {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const location = useLocation();
  const { t } = useLanguage();
  
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("Multiple Choice (MCQ)");
  const [options, setOptions] = useState({ A: "", B: "", C: "", D: "" });
  const [correctAnswer, setCorrectAnswer] = useState("Option A");
  const [source, setSource] = useState("");
  const [explanation, setExplanation] = useState("");

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
      try {
        setLoadingQuestion(true);
        const response = await questionsAPI.getGathererQuestionById(questionId);
        
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
            setOptions({
              A: question.options.A || "",
              B: question.options.B || "",
              C: question.options.C || "",
              D: question.options.D || "",
            });
          }
          if (question.correctAnswer) {
            setCorrectAnswer(`Option ${question.correctAnswer}`);
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
        navigate("/gatherer/question-bank");
      } finally {
        setLoadingQuestion(false);
      }
    };

    if (questionId) {
      fetchQuestion();
    } else if (location.state?.questionData) {
      // Use data from navigation state if available
      const question = location.state.questionData;
      setQuestionText(question.questionText || "");
      setExplanation(question.explanation || "");
      // ... set other fields similarly
    }
  }, [questionId, location.state, navigate]);

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
          setSubjects(response.data.subjects);
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
    if (selectedExamName === "Select exam") {
      setExamId("");
      setExamName("");
      setSubjectId("");
      setSubjectName("");
      setTopicId("");
      setTopicName("");
      return;
    }
    
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
      setSubjectName(selectedSubjectName);
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
      setTopicName(selectedTopicName);
    }
  };

  // Handle processor selection
  const handleProcessorChange = (selectedProcessorName) => {
    if (selectedProcessorName === "Select processor") {
      setProcessorId("");
      setProcessorName("");
      return;
    }
    
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

      // Call the API to update question
      // Use gatherer update endpoint for flagged questions or rejected questions
      let response;
      const isRejected = questionStatus === 'rejected';
      if ((isFlagged && questionStatus === 'pending_gatherer') || isRejected) {
        // Use special endpoint for updating flagged questions or rejected questions
        response = await questionsAPI.updateGathererFlaggedQuestion(questionId, questionData);
      } else {
        // For now, we'll need to create a general gatherer update endpoint
        // Using updateQuestion as fallback - this might need adjustment
        showErrorToast("Update endpoint for gatherer not yet implemented. Please contact support.", { title: "Error" });
        setSubmitting(false);
        return;
      }

      if (response.success) {
        showSuccessToast(
          response.message || "Question updated successfully",
          { title: "Success" }
        );
        setTimeout(() => {
          navigate("/gatherer/question-bank");
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
          navigate("/gatherer/question-bank");
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

  const handleCancel = () => {
    navigate("/gatherer/question-bank");
  };

  if (loadingQuestion) {
    return (
      <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-center">
        <p className="text-[16px] text-gray-600">Loading question...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .rich-text-editor .ql-container {
          font-family: 'Roboto', sans-serif;
          font-size: 16px;
          line-height: 100%;
          color: #032746;
          min-height: 200px;
        }
        .rich-text-editor .ql-editor {
          min-height: 200px;
          padding: 16px;
          font-family: 'Roboto', sans-serif;
          font-size: 16px;
          line-height: 100%;
          color: #032746;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9CA3AF;
          font-style: normal;
        }
        .rich-text-editor .ql-toolbar {
          background-color: #F6F7F8;
          border-bottom: 1px solid #CDD4DA;
          padding: 8px;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        .rich-text-editor .ql-toolbar .ql-formats {
          margin-right: 8px;
        }
        .rich-text-editor .ql-toolbar button {
          width: 32px;
          height: 32px;
          padding: 4px;
          border-radius: 4px;
        }
        .rich-text-editor .ql-toolbar button:hover {
          background-color: #E5E7EB;
        }
        .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: #374151;
        }
        .rich-text-editor .ql-toolbar .ql-fill {
          fill: #374151;
        }
        .rich-text-editor .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        .rich-text-editor .ql-snow {
          border: none;
        }
        .rich-text-editor .ql-snow .ql-toolbar {
          border: none;
        }
        .rich-text-editor .ql-snow .ql-container {
          border: none;
        }
        .rich-text-editor-explanation .ql-container {
          min-height: 150px;
        }
        .rich-text-editor-explanation .ql-editor {
          min-height: 150px;
        }
      `}</style>
      <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center mb-10">
            <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[40px] text-oxford-blue">
              {t('gatherer.addNewQuestion.title')} - {t('gatherer.addNewQuestion.update') || 'Edit'}
            </h1>
            <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
              {isFlagged && (
                <button
                  type="button"
                  onClick={() => setShowRejectFlagModal(true)}
                  className="flex h-[36px] items-center justify-center rounded-[8px] border border-[#E5E7EB] bg-white px-3 md:px-5 text-[14px] md:text-[16px] font-roboto font-medium leading-[16px] text-[#374151] transition hover:bg-[#F9FAFB]"
                >
                  {t('gatherer.addNewQuestion.rejectFlag.button')}
                </button>
              )}
              <button
                type="button"
                onClick={handleCancel}
                className="flex h-[36px] items-center justify-center rounded-[8px] border border-[#E5E7EB] bg-white px-3 md:px-5 text-[14px] md:text-[16px] font-roboto font-medium leading-[16px] text-[#374151] transition hover:bg-[#F9FAFB]"
              >
                {t('gatherer.addNewQuestion.cancel')}
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={submitting}
                className={`flex h-[36px] items-center justify-center rounded-[8px] bg-[#ED4122] px-4 md:px-6 text-[14px] md:text-[16px] font-archivo font-medium leading-[16px] text-white transition hover:bg-[#d43a1f] ${
                  submitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? t('gatherer.addNewQuestion.updating') : t('gatherer.addNewQuestion.update')}
              </button>
            </div>
          </header>

          {/* Flag Info Banner */}
          {isFlagged && flagReason && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-yellow-800 mb-1">Question Flagged</h3>
                  <p className="text-sm text-yellow-700">Flag Reason: {flagReason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Content - Two Columns */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Question Details (2/3 width on xl screens) */}
            <div className="xl:col-span-2 bg-white rounded-[14px] border border-[#03274633] px-[30px] pt-[50px] pb-10">
              <h2 className="text-[20px] font-archivo leading-[32px] font-bold text-blue-dark mb-[30px]">
                {t('gatherer.addNewQuestion.questionText')}
              </h2>

              <div className="space-y-6">
                {/* Question Text */}
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-5">
                    {t('gatherer.addNewQuestion.questionText')}
                  </label>
                  <RichTextEditor
                    value={questionText}
                    onChange={setQuestionText}
                    placeholder={t('gatherer.addNewQuestion.placeholders.questionText')}
                    minHeight="200px"
                  />
                </div>

                {/* Question Type */}
                <div>
                  <label className="block  text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t('gatherer.addNewQuestion.questionType')}
                  </label>
                  <Dropdown
                    value={questionType}
                    onChange={setQuestionType}
                    options={[
                      t('admin.addNewQuestion.questionTypes.multipleChoice'),
                      t('admin.addNewQuestion.questionTypes.trueFalse'),
                      t('admin.addNewQuestion.questionTypes.shortAnswer'),
                      t('admin.addNewQuestion.questionTypes.essay')
                    ]}
                  />
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                        {t('gatherer.addNewQuestion.options.optionA')}
                      </label>
                      <input
                        type="text"
                        value={options.A}
                        onChange={(e) => handleOptionChange("A", e.target.value)}
                        className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                        {t('gatherer.addNewQuestion.options.optionC')}
                      </label>
                      <input
                        type="text"
                        value={options.C}
                        onChange={(e) => handleOptionChange("C", e.target.value)}
                        className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                        {t('gatherer.addNewQuestion.options.optionB')}
                      </label>
                      <input
                        type="text"
                        value={options.B}
                        onChange={(e) => handleOptionChange("B", e.target.value)}
                        className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                        {t('gatherer.addNewQuestion.options.optionD')}
                      </label>
                      <input
                        type="text"
                        value={options.D}
                        onChange={(e) => handleOptionChange("D", e.target.value)}
                        className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Correct Answer */}
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t('gatherer.addNewQuestion.correctAnswer')}
                  </label>
                  <Dropdown
                    value={correctAnswer}
                    onChange={setCorrectAnswer}
                    options={[
                      t('admin.addNewQuestion.correctAnswerOptions.optionA'),
                      t('admin.addNewQuestion.correctAnswerOptions.optionB'),
                      t('admin.addNewQuestion.correctAnswerOptions.optionC'),
                      t('admin.addNewQuestion.correctAnswerOptions.optionD')
                    ]}
                  />
                </div>

                {/* Explanation (Optional) */}
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t('gatherer.addNewQuestion.explanation')} <span className="text-gray-500 text-sm">({t('gatherer.addNewQuestion.optional')})</span>
                  </label>
                  <RichTextEditor
                    value={explanation}
                    onChange={setExplanation}
                    placeholder={t('gatherer.addNewQuestion.placeholders.explanation')}
                    minHeight="150px"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Classification (1/3 width on xl screens) */}
            <div className="bg-white rounded-[14px] border border-[#03274633] px-[30px] pt-[50px] pb-10 h-[725px]">
              <h2 className="text-[20px] leading-[100%] font-bold font-archivo text-blue-dark mb-6">
                {t('gatherer.addNewQuestion.classification.title')}
              </h2>

              <div className="space-y-6">
                {/* Exam */}
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t('gatherer.addNewQuestion.classification.exam')}
                  </label>
                  <Dropdown
                    value={examName}
                    onChange={handleExamChange}
                    options={
                      loadingExams
                        ? [t('gatherer.addNewQuestion.messages.loading')]
                        : exams.length > 0
                        ? [
                            "Select exam",
                            ...exams.map((exam) => exam.name || "Unnamed Exam").filter(Boolean)
                          ]
                        : [t('gatherer.addNewQuestion.messages.noExamsAvailable')]
                    }
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t('gatherer.addNewQuestion.classification.subject')}
                  </label>
                  <Dropdown
                    value={subjectName}
                    onChange={handleSubjectChange}
                    options={
                      !examId
                        ? [t('gatherer.addNewQuestion.messages.selectExamFirst')]
                        : loadingSubjects
                        ? [t('gatherer.addNewQuestion.messages.loading')]
                        : subjects.length > 0
                        ? subjects.map((subject) => subject.name || "Unnamed Subject").filter(Boolean)
                        : [t('gatherer.addNewQuestion.messages.noSubjectsAvailable')]
                    }
                  />
                </div>

                {/* Topic */}
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t('gatherer.addNewQuestion.classification.topic')}
                  </label>
                  <Dropdown
                    value={topicName}
                    onChange={handleTopicChange}
                    options={
                      !subjectId
                        ? [t('gatherer.addNewQuestion.messages.selectSubjectFirst')]
                        : loadingTopics
                        ? [t('gatherer.addNewQuestion.messages.loading')]
                        : topics.length > 0
                        ? topics.map((topic) => topic.name || "Unnamed Topic").filter(Boolean)
                        : [t('gatherer.addNewQuestion.messages.noTopicsAvailable')]
                    }
                  />
                </div>

                {/* Reference */}
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t('gatherer.addNewQuestion.classification.reference')}
                  </label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                    placeholder={t('gatherer.addNewQuestion.placeholders.reference')}
                  />
                </div>

                {/* Processor Assignment */}
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t('gatherer.addNewQuestion.classification.processor')} <span className="text-red-500 text-sm">*</span>
                  </label>
                  <Dropdown
                    value={processorId ? processorName : ""}
                    onChange={handleProcessorChange}
                    options={
                      loadingProcessors
                        ? [t('gatherer.addNewQuestion.messages.loading')]
                        : processors.length > 0
                        ? [
                            "Select processor",
                            ...processors.map((processor) => {
                              const displayName = processor.name || processor.fullName || processor.username || "Unnamed Processor";
                              return displayName;
                            }).filter(Boolean)
                          ]
                        : [t('gatherer.addNewQuestion.messages.noProcessorsAvailable')]
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Flag Modal */}
      {showRejectFlagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-oxford-blue mb-4">
              {t('gatherer.addNewQuestion.rejectFlag.title')}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {t('gatherer.addNewQuestion.rejectFlag.description')}
            </p>
            <textarea
              value={flagRejectionReason}
              onChange={(e) => setFlagRejectionReason(e.target.value)}
              placeholder={t('gatherer.addNewQuestion.rejectFlag.placeholder')}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowRejectFlagModal(false);
                  setFlagRejectionReason("");
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                {t('gatherer.addNewQuestion.rejectFlag.cancel')}
              </button>
              <button
                type="button"
                onClick={handleRejectFlag}
                disabled={rejectingFlag || !flagRejectionReason.trim()}
                className={`px-4 py-2 text-white rounded-lg transition ${
                  rejectingFlag || !flagRejectionReason.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#ED4122] hover:bg-[#d43a1f]"
                }`}
              >
                {rejectingFlag ? t('gatherer.addNewQuestion.rejectFlag.submitting') : t('gatherer.addNewQuestion.rejectFlag.submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GathererEditQuestionPage;

