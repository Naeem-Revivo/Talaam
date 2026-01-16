import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import questionsAPI from "../../api/questions";
import examsAPI from "../../api/exams";
import subjectsAPI from "../../api/subjects";
import usersAPI from "../../api/users";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig";
import Loader from "../../components/common/Loader";
import AddQuestionHeader from "../../components/admin/question/AddQuestionHeader";
import AddQuestionDetailsSection from "../../components/admin/question/AddQuestionDetailsSection";
import AddQuestionClassificationSection from "../../components/admin/question/AddQuestionClassificationSection";
import AddQuestionExplanationSection from "../../components/admin/question/AddQuestionExplanationSection";
import AddQuestionVariantsSection from "../../components/admin/question/AddQuestionVariantsSection";


const AddNewQuestionPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
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
      // Reset to empty for other types
      setOptions({ A: "", B: "", C: "", D: "" });
      setCorrectAnswer("Option A");
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
  const [isAssignedToMe, setIsAssignedToMe] = useState(false);

  // Variants state - only shown when "assigned to me" is selected
  const [variants, setVariants] = useState([]);

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
    if (selectedProcessorName === "Assigned to me") {
      setIsAssignedToMe(true);
      setProcessorId("assigned_to_me");
      setProcessorName("Assigned to me");
    } else {
      setIsAssignedToMe(false);
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
    }
  };

  // Variant handlers
  const handleAddVariant = () => {
    const newVariantId = variants.length > 0 ? Math.max(...variants.map((v) => v.id)) + 1 : 1;
    setVariants((prev) => [
      ...prev,
      {
        id: newVariantId,
        questionText: "",
        questionType: "Multiple Choice (MCQ)",
        options: { A: "", B: "", C: "", D: "" },
        correctAnswer: "Option A",
        explanation: "",
      },
    ]);
  };

  const handleDeleteVariant = (variantId) => {
    setVariants((prev) => prev.filter((v) => v.id !== variantId));
  };

  const handleVariantQuestionTextChange = (variantId, value) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId ? { ...variant, questionText: value } : variant
      )
    );
  };

  const handleVariantQuestionTypeChange = (variantId, value) => {
    setVariants((prev) =>
      prev.map((variant) => {
        if (variant.id === variantId) {
          if (value === "True/False") {
            return {
              ...variant,
              questionType: value,
              options: { A: "True", B: "False", C: "", D: "" },
              correctAnswer: "True"
            };
          }
          return { ...variant, questionType: value };
        }
        return variant;
      })
    );
  };

  const handleVariantOptionChange = (variantId, option, value) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId
          ? { ...variant, options: { ...variant.options, [option]: value } }
          : variant
      )
    );
  };

  const handleVariantCorrectAnswerChange = (variantId, value) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId ? { ...variant, correctAnswer: value } : variant
      )
    );
  };

  const handleVariantExplanationChange = (variantId, value) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId ? { ...variant, explanation: value } : variant
      )
    );
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

    // If assigned to me, validate explanation and variants
    if (isAssignedToMe) {
      if (!explanation.trim()) {
        showErrorToast("Explanation is required when assigned to me", { title: "Validation Error" });
        return;
      }

      // Validate variants if any exist
      if (variants.length > 0) {
        const incompleteVariants = variants.filter((variant) => {
          const hasQuestionText = variant.questionText && variant.questionText.trim() !== "";
          if (!hasQuestionText) return true;
          
          const isTrueFalse = variant.questionType === "True/False";
          if (isTrueFalse) {
            return !variant.correctAnswer || (variant.correctAnswer !== "True" && variant.correctAnswer !== "False");
          } else {
            const hasAllOptions = variant.options.A?.trim() && 
                                 variant.options.B?.trim() && 
                                 variant.options.C?.trim() && 
                                 variant.options.D?.trim();
            const hasCorrectAnswer = variant.correctAnswer && variant.correctAnswer.startsWith("Option ");
            return !hasAllOptions || !hasCorrectAnswer;
          }
        });

        if (incompleteVariants.length > 0) {
          showErrorToast("Please complete all variant fields before submitting.", { title: "Validation Error" });
          return;
        }
      }
    }

    // Validate MCQ fields
    if (questionType === "Multiple Choice (MCQ)") {
      if (!options.A.trim() || !options.B.trim() || !options.C.trim() || !options.D.trim()) {
        showErrorToast("All options are required", { title: "Validation Error" });
        return;
      }
      
      // Check for duplicate options
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
        source: source?.trim() || "",
      };

      // If assigned to me, use special endpoint
      if (isAssignedToMe) {
        // Prepare variants data
        const variantsData = variants.map((variant) => {
          const questionTypeMap = {
            "Multiple Choice (MCQ)": "MCQ",
            "True/False": "TRUE_FALSE",
          };
          const apiQuestionType = questionTypeMap[variant.questionType] || "MCQ";
          
          let correctAnswerLetter;
          if (apiQuestionType === "TRUE_FALSE") {
            correctAnswerLetter = variant.correctAnswer === "True" ? "A" : "B";
          } else {
            correctAnswerLetter = variant.correctAnswer.replace("Option ", "").trim();
          }

          return {
            questionText: variant.questionText.trim(),
            questionType: apiQuestionType,
            options: {
              A: variant.options.A?.trim() || (apiQuestionType === "TRUE_FALSE" ? "True" : ""),
              B: variant.options.B?.trim() || (apiQuestionType === "TRUE_FALSE" ? "False" : ""),
              C: variant.options.C?.trim() || "",
              D: variant.options.D?.trim() || "",
            },
            correctAnswer: correctAnswerLetter,
            explanation: variant.explanation?.trim() || "",
          };
        });

        // Add MCQ-specific fields for original question
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
        
        // Add True/False-specific fields for original question
        if (apiQuestionType === "TRUE_FALSE") {
          questionData.options = {
            A: "True",
            B: "False",
          };
          // Map "True" to "A" and "False" to "B"
          questionData.correctAnswer = correctAnswer === "True" ? "A" : "B";
        }

        const completedQuestionData = {
          ...questionData,
          explanation: explanation.trim(),
          variants: variantsData,
        };

        const response = await questionsAPI.createQuestionWithCompletedStatus(completedQuestionData);
        
        if (response.success) {
          showSuccessToast(
            response.message || "Question created successfully with completed status",
            { title: "Success" }
          );
          setTimeout(() => {
            navigate("/admin/question-bank");
          }, 1500);
        } else {
          showErrorToast(
            response.message || "Failed to create question",
            { title: "Error" }
          );
        }
        setSubmitting(false);
        return;
      }

      // Add processor assignment (required for normal flow)
      if (!processorId || processorId.trim() === "") {
        showErrorToast("Please select a processor", { title: "Validation Error" });
        setSubmitting(false);
        return;
      }
      questionData.assignedProcessor = processorId;

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
          navigate("/admin/question-bank");
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
    navigate("/admin/question-bank");
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
          <AddQuestionHeader
            t={t}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            submitting={submitting}
          />

          {/* Main Content - Two Columns */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Question Details (2/3 width on xl screens) */}
            <AddQuestionDetailsSection
              questionText={questionText}
              setQuestionText={setQuestionText}
              questionType={questionType}
              handleQuestionTypeChange={handleQuestionTypeChange}
              options={options}
              handleOptionChange={handleOptionChange}
              correctAnswer={correctAnswer}
              setCorrectAnswer={setCorrectAnswer}
              t={t}
            />

            {/* Right Column - Classification (1/3 width on xl screens) */}
            <AddQuestionClassificationSection
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

          {/* Bottom Section - Explanation and Variants (only shown when assigned to me) */}
          {isAssignedToMe && (
            <>
              {/* Explanation Section */}
              <AddQuestionExplanationSection
                explanation={explanation}
                setExplanation={setExplanation}
                t={t}
              />

              {/* Variants Section */}
              <AddQuestionVariantsSection
                variants={variants}
                onAddVariant={handleAddVariant}
                onDeleteVariant={handleDeleteVariant}
                onVariantQuestionTextChange={handleVariantQuestionTextChange}
                onVariantQuestionTypeChange={handleVariantQuestionTypeChange}
                onVariantOptionChange={handleVariantOptionChange}
                onVariantCorrectAnswerChange={handleVariantCorrectAnswerChange}
                onVariantExplanationChange={handleVariantExplanationChange}
                t={t}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AddNewQuestionPage;
