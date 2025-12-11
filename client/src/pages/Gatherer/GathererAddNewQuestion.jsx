import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import questionsAPI from "../../api/questions";
import examsAPI from "../../api/exams";
import subjectsAPI from "../../api/subjects";
import topicsAPI from "../../api/topics";
import usersAPI from "../../api/users";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig";
import RichTextEditor from "../../components/common/RichTextEditor";
import Loader from "../../components/common/Loader";

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


const GathererAddNewQuestionPage = () => {
  const navigate = useNavigate();
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

  const handleOptionChange = (option, value) => {
    setOptions((prev) => ({ ...prev, [option]: value }));
  };

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
          console.log('Processors loaded:', loadedProcessors);
        } else if (response.success && response.data?.admins) {
          // Fallback to admins if users is not available
          const loadedProcessors = response.data.admins;
          setProcessors(loadedProcessors);
          console.log('Processors loaded (from admins):', loadedProcessors);
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
    // If "Select exam" is selected, clear the selection
    if (selectedExamName === "Select exam") {
      setExamId("");
      setExamName("");
      // Reset subject and topic
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
    // Reset subject and topic
    setSubjectId("");
    setSubjectName("");
    setTopicId("");
    setTopicName("");
  };

  // Handle subject selection
  const handleSubjectChange = (selectedSubjectName) => {
    // If "Select the subject" is selected, clear the selection
    if (selectedSubjectName === "Select the subject") {
      setSubjectId("");
      setSubjectName("");
      // Reset topic
      setTopicId("");
      setTopicName("");
      return;
    }
    
    const selectedSubject = subjects.find((s) => s.name === selectedSubjectName);
    if (selectedSubject) {
      setSubjectId(selectedSubject.id);
      setSubjectName(selectedSubjectName);
    } else {
      setSubjectId("");
      setSubjectName(selectedSubjectName);
    }
    // Reset topic
    setTopicId("");
    setTopicName("");
  };

  // Handle topic selection
  const handleTopicChange = (selectedTopicName) => {
    // If "Select the topic" is selected, clear the selection
    if (selectedTopicName === "Select the topic") {
      setTopicId("");
      setTopicName("");
      return;
    }
    
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
    // If "Select processor" is selected, clear the selection
    if (selectedProcessorName === "Select processor") {
      setProcessorId("");
      setProcessorName("");
      return;
    }
    
    // Find processor by matching name, fullName, or username
    const selectedProcessor = processors.find((p) => {
      const pName = p.name || p.fullName || p.username || "";
      const normalizedSelected = selectedProcessorName.trim();
      const normalizedPName = pName.trim();
      return normalizedPName === normalizedSelected;
    });
    
    if (selectedProcessor && selectedProcessor.id) {
      setProcessorId(selectedProcessor.id);
      setProcessorName(selectedProcessorName);
      console.log('Processor selected:', { 
        id: selectedProcessor.id, 
        name: selectedProcessorName,
        processor: selectedProcessor 
      });
    } else {
      console.warn('Processor not found for:', selectedProcessorName);
      console.warn('Available processors:', processors.map(p => ({
        id: p.id,
        name: p.name,
        fullName: p.fullName,
        username: p.username
      })));
      setProcessorId("");
      setProcessorName("");
    }
  };

  const _handleSaveDraft = () => {
    // TODO: Implement save draft functionality
    console.log("Save draft");
  };

  const handleSubmit = async () => {
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

      // Add processor assignment (required)
      console.log('Before submission - processorId:', processorId, 'processorName:', processorName);
      if (!processorId || processorId.trim() === "") {
        showErrorToast("Please select a processor", { title: "Validation Error" });
        setSubmitting(false);
        return;
      }
      questionData.assignedProcessor = processorId;
      console.log('Question data with processor:', questionData);

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

      // Call the API
      const response = await questionsAPI.createQuestion(questionData);

      if (response.success) {
        showSuccessToast(
          response.message || "Question created successfully",
          { title: "Success" }
        );
        // Navigate to question bank after successful creation
        setTimeout(() => {
          navigate("/gatherer/question-bank");
        }, 1500);
      } else {
        showErrorToast(
          response.message || "Failed to create question",
          { title: "Error" }
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create question";
      showErrorToast(errorMessage, { title: "Error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/gatherer/question-bank");
  };

  const _handleSaveQuestion = () => {
    // TODO: Implement save question functionality
    console.log("Save question");
    // Navigate to question details page after saving
    navigate("/admin/question-details");
  };

  return (
    <>
      {submitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-xl">
            <Loader 
              size="lg" 
              color="oxford-blue" 
              text="Creating question..."
              className="py-4"
            />
          </div>
        </div>
      )}
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
              {t('gatherer.addNewQuestion.title')}
            </h1>
            <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
              <button
                type="button"
                onClick={handleCancel}
                className="flex h-[36px] items-center justify-center rounded-[8px] border border-[#E5E7EB] bg-white px-3 md:px-5 text-[14px] md:text-[16px] font-roboto font-medium leading-[16px] text-[#374151] transition hover:bg-[#F9FAFB]"
              >
                {t('gatherer.addNewQuestion.cancel')}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className={`flex h-[36px] items-center justify-center rounded-[8px] bg-[#ED4122] px-4 md:px-6 text-[14px] md:text-[16px] font-archivo font-medium leading-[16px] text-white transition hover:bg-[#d43a1f] ${
                  submitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? "Submitting..." : t('gatherer.addNewQuestion.submit')}
              </button>
            </div>
          </header>

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
                {/* Subject */}

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
                        ? [
                            "Select the subject",
                            ...subjects.map((subject) => subject.name || "Unnamed Subject").filter(Boolean)
                          ]
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
                        ? [
                            "Select the topic",
                            ...topics.map((topic) => topic.name || "Unnamed Topic").filter(Boolean)
                          ]
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
    </>
  );
};

export default GathererAddNewQuestionPage;