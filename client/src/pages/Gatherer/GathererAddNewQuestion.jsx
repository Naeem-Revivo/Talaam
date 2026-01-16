import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import questionsAPI from "../../api/questions";
import examsAPI from "../../api/exams";
import subjectsAPI from "../../api/subjects";
import usersAPI from "../../api/users";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig";
import RichTextEditor from "../../components/common/RichTextEditor";
import Loader from "../../components/common/Loader";
import Dropdown from "../../components/common/Dropdown";


const GathererAddNewQuestionPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("Multiple Choice (MCQ)");
  const [options, setOptions] = useState({ A: "", B: "", C: "", D: "" });
  const [correctAnswer, setCorrectAnswer] = useState("Option A");
  
  // Handle question type change - reset options and correct answer for True/False
  const handleQuestionTypeChange = (newType) => {
    setQuestionType(newType);
    if (newType === "True/False") {
      // Set True/False options
      setOptions({ A: "True", B: "False", C: "", D: "" });
      setCorrectAnswer("True");
    } else {
      // Reset to empty for other types
      setOptions({ A: "", B: "", C: "", D: "" });
      setCorrectAnswer("Option A");
    }
  };
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
    const selectedSubject = subjects.find((s) => s.name === selectedSubjectName);
    if (selectedSubject) {
      setSubjectId(selectedSubject.id);
      setSubjectName(selectedSubjectName);
    } else {
      setSubjectId("");
      setSubjectName("");
    }
    // Reset topic
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
        // Map correct answer from "Option A" to "A"
        const correctAnswerLetter = correctAnswer.replace("Option ", "");
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
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t('gatherer.addNewQuestion.questionType')}
                  </label>
                  <Dropdown
                    value={questionType}
                    onChange={handleQuestionTypeChange}
                    placeholder="Select question type"
                    options={[
                      t('admin.addNewQuestion.questionTypes.multipleChoice'),
                      t('admin.addNewQuestion.questionTypes.trueFalse')
                    ]}
                  />
                </div>

                {/* Options Grid - Show 4 options for MCQ, 2 options for True/False */}
                {questionType === "True/False" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                        True
                      </label>
                      <input
                        type="text"
                        value={options.A}
                        disabled
                        className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-gray-100 px-4 py-3 text-blue-dark cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                        False
                      </label>
                      <input
                        type="text"
                        value={options.B}
                        disabled
                        className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-gray-100 px-4 py-3 text-blue-dark cursor-not-allowed"
                      />
                    </div>
                  </div>
                ) : (
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
                )}

                {/* Correct Answer */}
                <div>
                  <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                    {t('gatherer.addNewQuestion.correctAnswer')}
                  </label>
                  {questionType === "True/False" ? (
                    <Dropdown
                      value={correctAnswer}
                      onChange={setCorrectAnswer}
                      placeholder="Select correct answer"
                      options={["True", "False"]}
                    />
                  ) : (
                    <Dropdown
                      value={correctAnswer}
                      onChange={setCorrectAnswer}
                      placeholder="Select correct answer"
                      options={[
                        t('admin.addNewQuestion.correctAnswerOptions.optionA'),
                        t('admin.addNewQuestion.correctAnswerOptions.optionB'),
                        t('admin.addNewQuestion.correctAnswerOptions.optionC'),
                        t('admin.addNewQuestion.correctAnswerOptions.optionD')
                      ]}
                    />
                  )}
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
                  <Dropdown
                    label={t('gatherer.addNewQuestion.classification.exam')}
                    value={examName}
                    onChange={handleExamChange}
                    placeholder="Select exam"
                    options={
                      loadingExams
                        ? [t('gatherer.addNewQuestion.messages.loading')]
                        : exams.length > 0
                        ? exams.map((exam) => exam.name || "Unnamed Exam").filter(Boolean)
                        : [t('gatherer.addNewQuestion.messages.noExamsAvailable')]
                    }
                  />
                </div>

                {/* Subject */}
                <div>
                  <Dropdown
                    label={t('gatherer.addNewQuestion.classification.subject')}
                    value={subjectName}
                    onChange={handleSubjectChange}
                    placeholder="Select subject"
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
                  <Dropdown
                    label={t('gatherer.addNewQuestion.classification.topic')}
                    value={topicName}
                    onChange={handleTopicChange}
                    placeholder="Select topic"
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
                  <Dropdown
                    label={
                      <>
                        {t('gatherer.addNewQuestion.classification.processor')} <span className="text-red-500 text-sm">*</span>
                      </>
                    }
                    value={processorName}
                    onChange={handleProcessorChange}
                    placeholder="Select processor"
                    options={
                      loadingProcessors
                        ? [t('gatherer.addNewQuestion.messages.loading')]
                        : processors.length > 0
                        ? processors.map((processor) => {
                            const displayName = processor.name || processor.fullName || processor.username || "Unnamed Processor";
                            return displayName;
                          }).filter(Boolean)
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

export default GathererAddNewQuestionPage