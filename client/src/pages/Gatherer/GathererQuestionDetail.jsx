import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import questionsAPI from "../../api/questions";

const GathererQuestionDetailsPage = () => {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  const [comments, setComments] = useState("");
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch question data
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!questionId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await questionsAPI.getGathererQuestionById(questionId);
        
        if (response.success && response.data?.question) {
          setQuestion(response.data.question);
        } else {
          setError("Question not found");
        }
      } catch (err) {
        console.error("Error fetching question:", err);
        setError(err.response?.data?.message || "Failed to load question");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  const handleCancel = () => {
    navigate("/gatherer/question-bank");
  };

  // Rich Text Editor Component using contentEditable (React 19 compatible)
  const RichTextEditor = ({
    value,
    onChange,
    placeholder,
    minHeight = "200px",
  }) => {
    const editorRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
      if (editorRef.current && editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }, [value]);

    const handleInput = (e) => {
      const html = e.target.innerHTML;
      onChange(html);
    };

    const handleCommand = (command, value = null) => {
      document.execCommand(command, false, value);
      editorRef.current?.focus();
    };

    const handleInsertHTML = (html) => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const div = document.createElement("div");
        div.innerHTML = html;
        const fragment = document.createDocumentFragment();
        while (div.firstChild) {
          fragment.appendChild(div.firstChild);
        }
        range.insertNode(fragment);
      }
      editorRef.current?.focus();
    };

    const handleLink = () => {
      const url = prompt("Enter URL:");
      if (url) {
        handleCommand("createLink", url);
      }
    };

    const handleImage = () => {
      const url = prompt("Enter image URL:");
      if (url) {
        handleCommand("insertImage", url);
      }
    };

    return (
      <div className="rounded-[8px] w-full lg:w-[660px] h-auto lg:h-[208px] min-h-[150px] border border-[#CDD4DA] bg-white overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 border-b border-[#CDD4DA] bg-[#F6F7F8] p-2 rounded-t-[8px]">
          {/* Text Formatting */}
          <button
            type="button"
            onClick={() => handleCommand("bold")}
            className="p-0 hover:opacity-80 transition"
            title="Bold"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="28" height="28" rx="4" fill="#E5E7EB" />
              <path
                d="M12 9H15.5C16.1962 9 16.8639 9.27656 17.3562 9.76884C17.8484 10.2611 18.125 10.9288 18.125 11.625C18.125 12.3212 17.8484 12.9889 17.3562 13.4812C16.8639 13.9734 16.1962 14.25 15.5 14.25H12V9Z"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 14.25H16.375C17.0712 14.25 17.7389 14.5266 18.2312 15.0188C18.7234 15.5111 19 16.1788 19 16.875C19 17.5712 18.7234 18.2389 18.2312 18.7312C17.7389 19.2234 17.0712 19.5 16.375 19.5H12V14.25Z"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("italic")}
            className="p-0 hover:opacity-80 transition"
            title="Italic"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="28" height="28" rx="4" fill="#E5E7EB" />
              <path
                d="M15.1663 9.33203L12.833 18.6654"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("underline")}
            className="p-0 hover:opacity-80 transition"
            title="Underline"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="28" height="28" rx="4" fill="#E5E7EB" />
              <path
                d="M11 8.66797V13.3346C11 14.2187 11.3512 15.0665 11.9763 15.6917C12.6014 16.3168 13.4493 16.668 14.3333 16.668C15.2174 16.668 16.0652 16.3168 16.6904 15.6917C17.3155 15.0665 17.6667 14.2187 17.6667 13.3346V8.66797"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 19.332H19.6667"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("strikeThrough")}
            className="p-0 hover:opacity-80 transition"
            title="Strikethrough"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="28" height="28" rx="4" fill="#E5E7EB" />
              <path
                d="M12.833 10H14.833C15.2308 10 15.6124 10.2107 15.8937 10.5858C16.175 10.9609 16.333 11.4696 16.333 12C16.333 12.5304 16.175 13.0391 15.8937 13.4142C15.6124 13.7893 15.2308 14 14.833 14H12.833C12.4352 14 12.0537 14.2107 11.7723 14.5858C11.491 14.9609 11.333 15.4696 11.333 16C11.333 16.5304 11.491 17.0391 11.7723 17.4142C12.0537 17.7893 12.4352 18 12.833 18H15.833"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 14H19.6667"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="w-px h-6 bg-[#E5E7EB]"></div>
          <button
            type="button"
            onClick={() => handleCommand("formatBlock", "<code>")}
            className="p-0 hover:opacity-80 transition"
            title="Code"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z"
                fill="#E5E7EB"
              />
              <path
                d="M10.667 10V18"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.333 10V18"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.333 14H17.333"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("formatBlock", "<h1>")}
            className="p-0 hover:opacity-80 transition"
            title="Heading"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z"
                fill="#E5E7EB"
              />
              <path
                d="M10.25 9.25H13.25V13.75H10.25V9.25Z"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.75 9.25H18.75V13.75H15.75V9.25Z"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 19L19 19"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="w-px h-6 bg-[#E5E7EB]"></div>
          {/* Lists */}
          <button
            type="button"
            onClick={() => handleCommand("insertUnorderedList")}
            className="p-0 hover:opacity-80 transition"
            title="Bullet List"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z"
                fill="#E5E7EB"
              />
              <path
                d="M11 9.5H20"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11 14H20"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11 18.5H20"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.62461 10.4016C8.12167 10.4016 8.52461 9.99862 8.52461 9.50156C8.52461 9.00451 8.12167 8.60156 7.62461 8.60156C7.12755 8.60156 6.72461 9.00451 6.72461 9.50156C6.72461 9.99862 7.12755 10.4016 7.62461 10.4016Z"
                stroke="#6B7280"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.62461 14.9016C8.12167 14.9016 8.52461 14.4986 8.52461 14.0016C8.52461 13.5045 8.12167 13.1016 7.62461 13.1016C7.12755 13.1016 6.72461 13.5045 6.72461 14.0016C6.72461 14.4986 7.12755 14.9016 7.62461 14.9016Z"
                stroke="#6B7280"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.62461 19.4016C8.12167 19.4016 8.52461 18.9986 8.52461 18.5016C8.52461 18.0045 8.12167 17.6016 7.62461 17.6016C7.12755 17.6016 6.72461 18.0045 6.72461 18.5016C6.72461 18.9986 7.12755 19.4016 7.62461 19.4016Z"
                stroke="#6B7280"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("insertOrderedList")}
            className="p-0 hover:opacity-80 transition"
            title="Numbered List"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z"
                fill="#E5E7EB"
              />
              <path
                d="M8.66699 10H16.667"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.66699 12.668H20.667"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.66699 15.332H16.667"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.66699 18H20.667"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="w-px h-6 bg-[#E5E7EB]"></div>
          {/* Alignment */}
          <button
            type="button"
            onClick={() => handleCommand("justifyLeft")}
            className="p-0 hover:opacity-80 transition"
            title="Align Left"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z"
                fill="#E5E7EB"
              />
              <path
                d="M10.333 10H18.333"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 12.668H19.6667"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.333 15.332H18.333"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 18H19.6667"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("justifyCenter")}
            className="p-0 hover:opacity-80 transition"
            title="Align Center"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z"
                fill="#E5E7EB"
              />
              <path
                d="M19.333 10H11.333"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.333 12.668H7.33301"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.333 15.332H11.333"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.333 18H7.33301"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("justifyRight")}
            className="p-0 hover:opacity-80 transition"
            title="Align Right"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 4C0 1.79086 1.79086 0 4 0H24C26.2091 0 28 1.79086 28 4V24C28 26.2091 26.2091 28 24 28H4C1.79086 28 0 26.2091 0 24V4Z"
                fill="#E5E7EB"
              />
              <path
                d="M19.333 10H11.333"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.333 12.668H7.33301"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.333 15.332H11.333"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.333 18H7.33301"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="w-px h-6 bg-[#E5E7EB]"></div>
          {/* Media/Links */}
          <button
            type="button"
            onClick={handleLink}
            className="p-0 hover:opacity-80 transition"
            title="Link"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z"
                fill="#E5E7EB"
              />
              <path
                d="M12.6667 15.3346C12.056 14.7115 11.7139 13.8738 11.7139 13.0013C11.7139 12.1288 12.056 11.2911 12.6667 10.668L14.0001 9.33464C14.642 8.85321 15.436 8.61948 16.2364 8.67636C17.0367 8.73324 17.7897 9.07691 18.3571 9.64428C18.9245 10.2117 19.2681 10.9646 19.325 11.765C19.3819 12.5654 19.1482 13.3594 18.6667 14.0013L18.0001 14.668"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.3337 12.668C15.9444 13.2911 16.2865 14.1288 16.2865 15.0013C16.2865 15.8738 15.9444 16.7115 15.3337 17.3346L14.0003 18.668C13.3584 19.1494 12.5644 19.3831 11.764 19.3262C10.9637 19.2694 10.2107 18.9257 9.64331 18.3583C9.07594 17.791 8.73226 17.038 8.67538 16.2376C8.6185 15.4372 8.85223 14.6432 9.33366 14.0013L10.0003 13.3346"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleImage}
            className="p-0 hover:opacity-80 transition"
            title="Image"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z"
                fill="#E5E7EB"
              />
              <path
                d="M18.6667 9.33203H9.33333C8.59695 9.33203 8 9.92898 8 10.6654V17.332C8 18.0684 8.59695 18.6654 9.33333 18.6654H18.6667C19.403 18.6654 20 18.0684 20 17.332V10.6654C20 9.92898 19.403 9.33203 18.6667 9.33203Z"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.333 14.6667L12.6663 16L14.6663 14L17.9997 17.3333"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.9997 12.3333C11.3679 12.3333 11.6663 12.0349 11.6663 11.6667C11.6663 11.2985 11.3679 11 10.9997 11C10.6315 11 10.333 11.2985 10.333 11.6667C10.333 12.0349 10.6315 12.3333 10.9997 12.3333Z"
                stroke="#6B7280"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => {
              const rows = prompt("Enter number of rows:");
              const cols = prompt("Enter number of columns:");
              if (rows && cols) {
                let tableHTML =
                  "<table border='1' style='border-collapse: collapse;'>";
                for (let i = 0; i < parseInt(rows); i++) {
                  tableHTML += "<tr>";
                  for (let j = 0; j < parseInt(cols); j++) {
                    tableHTML += "<td style='padding: 4px;'>&nbsp;</td>";
                  }
                  tableHTML += "</tr>";
                }
                tableHTML += "</table>";
                handleInsertHTML(tableHTML);
              }
            }}
            className="p-0 hover:opacity-80 transition"
            title="Table"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="28" height="28" rx="4" fill="#E5E7EB" />
              <path
                d="M18.1485 9.25781H9.85218C9.19762 9.25781 8.66699 9.78844 8.66699 10.443V17.5541C8.66699 18.2087 9.19762 18.7393 9.85218 18.7393H18.1485C18.803 18.7393 19.3337 18.2087 19.3337 17.5541V10.443C19.3337 9.78844 18.803 9.25781 18.1485 9.25781Z"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.66699 12.668H19.3337"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 9V18"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 9V18"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("formatBlock", "<pre>")}
            className="p-0 hover:opacity-80 transition"
            title="Code"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="28" height="28" rx="4" fill="#E5E7EB" />
              <path
                d="M13.6667 18.0294L12.6569 19.0392C12.2551 19.441 11.7103 19.6667 11.1421 19.6667C10.574 19.6667 10.0291 19.441 9.62742 19.0392C9.22569 18.6375 9 18.0927 9 17.5245C9 16.9564 9.22569 16.4115 9.62742 16.0098L10.6372 15"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.667 10.6372L15.6768 9.62742C16.0785 9.22569 16.6234 9 17.1915 9C17.7597 9 18.3045 9.22569 18.7062 9.62742C19.108 10.0291 19.3337 10.574 19.3337 11.1421C19.3337 11.7103 19.108 12.2551 18.7062 12.6569L17.6964 13.6667"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.667 16.832L15.667 12.832"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="w-px h-6 bg-[#E5E7EB]"></div>
          {/* Undo/Redo */}
          <button
            type="button"
            onClick={() => handleCommand("undo")}
            className="p-0 hover:opacity-80 transition"
            title="Undo"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="28" height="28" rx="4" fill="#E5E7EB" />
              <path
                d="M12.0003 15.3346L8.66699 12.0013L12.0003 8.66797"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.3333 19.3331C19.6014 18.3183 19.5985 17.2509 19.3251 16.2376C19.0516 15.2242 18.5171 14.3003 17.7749 13.5581C17.0328 12.816 16.1089 12.2815 15.0955 12.008C14.0822 11.7345 13.0148 11.7317 12 11.9997"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("redo")}
            className="p-0 hover:opacity-80 transition"
            title="Redo"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="28"
                height="28"
                rx="4"
                transform="matrix(-1 0 0 1 28 0)"
                fill="#E5E7EB"
              />
              <path
                d="M15.9997 15.3346L19.333 12.0013L15.9997 8.66797"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.66667 19.3331C8.39862 18.3183 8.40147 17.2509 8.67492 16.2376C8.94838 15.2242 9.48289 14.3003 10.2251 13.5581C10.9672 12.816 11.8911 12.2815 12.9045 12.008C13.9178 11.7345 14.9852 11.7317 16 11.9997"
                stroke="#6B7280"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full p-4 font-roboto text-[16px] leading-[100%] text-oxford-blue focus:outline-none ${
            !value && !isFocused ? "text-[#9CA3AF]" : ""
          }`}
          style={{
            minHeight: minHeight,
            lineHeight: "100%",
          }}
          data-placeholder={placeholder}
          suppressContentEditableWarning
        />
        <style>{`
          [contenteditable][data-placeholder]:empty:before {
            content: attr(data-placeholder);
            color: #9CA3AF;
            pointer-events: none;
          }
        `}</style>
      </div>
    );
  };

  const _handleDelete = () => {
    // TODO: Implement delete functionality
    console.log("Delete question");
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    navigate("/gatherer/question-bank/Gatherer-addQuestion");
  };

  const handleCreateVariant = () => {
    navigate("/admin/create-variant");
  };

  const handleAddComment = () => {
    // TODO: Implement add comment functionality
    console.log("Add comment", comments);
    setComments("");
  };

  return (
    <div
      className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 xl:px-6 2xl:px-[66px]"
      dir={dir}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[40px] text-oxford-blue">
            {t("gatherer.questionDetail.title")}
          </h1>
          <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
            <OutlineButton text={t("explainer.completedExplanation.back")} className="py-[10px] px-5" onClick={handleCancel}/>
          </div>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-10">
            <p className="text-[16px] text-gray-600">Loading question...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-10">
            <p className="text-[16px] text-red-600">{error}</p>
            <OutlineButton 
              text="Go Back" 
              className="mt-4 py-[10px] px-5" 
              onClick={handleCancel}
            />
          </div>
        )}

        {/* Main Content - Two Columns */}
        {!loading && !error && question && (
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Question Info Card */}
              <div
                className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full h-auto lg:h-[472px]"
                style={{}}
              >
                <h2 className="mb-2 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                  {t("gatherer.questionDetail.questionInfo")}
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                      ID: {question.id?.substring(0, 8) || "N/A"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-roboto text-[18px] font-normal leading-[20px] text-oxford-blue">
                        {t("admin.questionDetails.fields.status")}:
                      </span>
                      <span className="font-roboto text-[18px] font-normal leading-[20px] text-[#ED4122]">
                        {question.status || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-[#E5E7EB] pt-4"></div>

                  <div>
                    <p
                      className="pb-7 font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue"
                      dir="ltr"
                      dangerouslySetInnerHTML={{ __html: question.questionText || "" }}
                    />

                    {/* Options - Only show for MCQ */}
                    {question.questionType === "MCQ" && question.options && (
                      <div className="space-y-5" dir="ltr">
                        {['A', 'B', 'C', 'D'].map((option) => (
                          <label key={option} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="option"
                              value={option}
                              checked={question.correctAnswer === option}
                              className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                              disabled
                            />
                            <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                              {option}. {question.options[option] || ""}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* True/False Options */}
                    {question.questionType === "TRUE_FALSE" && (
                      <div className="space-y-5" dir="ltr">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="option"
                            value="TRUE"
                            checked={question.correctAnswer === "TRUE"}
                            className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                            disabled
                          />
                          <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                            True
                          </span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="option"
                            value="FALSE"
                            checked={question.correctAnswer === "FALSE"}
                            className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                            disabled
                          />
                          <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                            False
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Two Columns */}
        {!loading && !error && question && (
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Comments Card */}
              <div
                className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 relative w-full h-auto lg:h-[271px]"
                style={{}}
              >
                <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                  {t("gatherer.questionDetail.comments.title")}
                </h2>
                <div className="flex flex-col gap-3 items-end ">
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder={t(
                      "gatherer.questionDetail.comments.placeholder"
                    )}
                    className="rounded-[8px] border border-[#03274633] bg-white py-3 px-4 font-roboto text-[16px] leading-[20px] text-oxford-blue placeholder:text-[#9CA3AF] outline-none w-full lg:h-[143px] min-h-[100px]"
                  />
                  <button
                    type="button"
                    onClick={handleAddComment}
                    className="flex h-[36px] items-center justify-center rounded-[8px] bg-[#ED4122] px-4 text-[16px] font-roboto font-medium leading-[16px] text-white transition hover:bg-[#d43a1f]"
                  >
                    {t("gatherer.questionDetail.comments.addComment")}
                  </button>
                </div>
              </div>

              {/* Activity Log Card */}
              <div
                className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full h-auto"
              >
                <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                  {t("admin.questionDetails.sections.activityLog")}
                </h2>
                <div className="space-y-4 overflow-y-auto">
                  {question.history && question.history.length > 0 ? (
                    question.history.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-[8px] border border-[#E5E7EB] bg-white p-4 w-full max-w-full h-auto"
                        dir="ltr"
                      >
                        <div className="flex-shrink-0">
                          <svg
                            width="30"
                            height="30"
                            viewBox="0 0 30 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="15" cy="15" r="15" fill="#ED4122" />
                            <path
                              d="M21.125 14.125H15.875V8.875C15.875 8.392 15.483 8 15 8C14.517 8 14.125 8.392 14.125 8.875V14.125H8.875C8.392 14.125 8 14.517 8 15C8 15.483 8.392 15.875 8.875 15.875H14.125V21.125C14.125 21.608 14.517 22 15 22C15.483 22 15.875 21.608 15.875 21.125V15.875H21.125C21.608 15.875 22 15.483 22 15C22 14.517 21.608 14.125 21.125 14.125Z"
                              fill="white"
                              stroke="white"
                              strokeWidth="0.5"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                            {activity.notes || activity.action || "Activity"}
                          </p>
                          <p className="font-roboto text-[12px] font-normal leading-[20px] text-dark-gray">
                            {activity.performedBy?.name || "Unknown"} - {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="font-roboto text-[14px] text-gray-500">
                      No activity log available
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6 lg:w-[376px]">
              {/* Classification Card */}
              <div
                className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full lg:w-[376px] h-auto lg:h-[338px]"
                style={{}}
              >
                <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                  {t("admin.questionDetails.sections.classification")}
                </h2>

                <div className="border-t border-[#E5E7EB] pt-4"></div>

                <div className="space-y-6 mt-4">
                  <div>
                    <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                      Exam
                    </label>
                    <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                      {question.exam?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                      {t("admin.questionDetails.fields.subject")}
                    </label>
                    <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                      {question.subject?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                      {t("admin.questionDetails.fields.topic")}
                    </label>
                    <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                      {question.topic?.name || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Workflow Information Card */}
              <div
                className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full lg:w-[376px] h-auto lg:h-[338px]"
                style={{}}
              >
                <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                  {t("admin.questionDetails.sections.workflowInformation")}
                </h2>

                <div className="border-t border-[#E5E7EB] pt-4"></div>

                <div className="space-y-6 mt-4">
                  <div>
                    <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                      {t("admin.questionDetails.fields.createdBy")}
                    </label>
                    <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                      {question.createdBy?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                      {t("admin.questionDetails.fields.submittedOn")}
                    </label>
                    <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                      {question.createdAt ? new Date(question.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                      {t("admin.questionDetails.fields.lastUpdate")}
                    </label>
                    <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                      {question.updatedAt ? new Date(question.updatedAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GathererQuestionDetailsPage;

