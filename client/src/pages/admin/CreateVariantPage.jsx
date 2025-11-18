import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const CreateVariantPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState({ A: "", B: "", C: "", D: "" });
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [cognitiveLevel, setCognitiveLevel] = useState("");
  const [explanation, setExplanation] = useState("");

  const handleOptionChange = (option, value) => {
    setOptions((prev) => ({ ...prev, [option]: value }));
  };

  const handleCancel = () => {
    navigate("/admin/question-details");
  };

  const handleSaveVariant = () => {
    // TODO: Implement save variant functionality
    console.log("Save variant");
    navigate("/admin/variant-question-review");
  };

  const handleCreateVariant = () => {
    // TODO: Implement create variant functionality
    console.log("Create variant");
    navigate("/admin/question-details");
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
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="4" fill="#E5E7EB"/>
              <path d="M12 9H15.5C16.1962 9 16.8639 9.27656 17.3562 9.76884C17.8484 10.2611 18.125 10.9288 18.125 11.625C18.125 12.3212 17.8484 12.9889 17.3562 13.4812C16.8639 13.9734 16.1962 14.25 15.5 14.25H12V9Z" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 14.25H16.375C17.0712 14.25 17.7389 14.5266 18.2312 15.0188C18.7234 15.5111 19 16.1788 19 16.875C19 17.5712 18.7234 18.2389 18.2312 18.7312C17.7389 19.2234 17.0712 19.5 16.375 19.5H12V14.25Z" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("italic")}
            className="p-0 hover:opacity-80 transition"
            title="Italic"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="4" fill="#E5E7EB"/>
              <path d="M15.1663 9.33203L12.833 18.6654" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("underline")}
            className="p-0 hover:opacity-80 transition"
            title="Underline"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="4" fill="#E5E7EB"/>
              <path d="M11 8.66797V13.3346C11 14.2187 11.3512 15.0665 11.9763 15.6917C12.6014 16.3168 13.4493 16.668 14.3333 16.668C15.2174 16.668 16.0652 16.3168 16.6904 15.6917C17.3155 15.0665 17.6667 14.2187 17.6667 13.3346V8.66797" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 19.332H19.6667" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("strikeThrough")}
            className="p-0 hover:opacity-80 transition"
            title="Strikethrough"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="4" fill="#E5E7EB"/>
              <path d="M12.833 10H14.833C15.2308 10 15.6124 10.2107 15.8937 10.5858C16.175 10.9609 16.333 11.4696 16.333 12C16.333 12.5304 16.175 13.0391 15.8937 13.4142C15.6124 13.7893 15.2308 14 14.833 14H12.833C12.4352 14 12.0537 14.2107 11.7723 14.5858C11.491 14.9609 11.333 15.4696 11.333 16C11.333 16.5304 11.491 17.0391 11.7723 17.4142C12.0537 17.7893 12.4352 18 12.833 18H15.833" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 14H19.6667" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="w-px h-6 bg-[#E5E7EB]"></div>
          <button
            type="button"
            onClick={() => handleCommand("formatBlock", "<h1>")}
            className="p-0 hover:opacity-80 transition"
            title="Heading"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z" fill="#E5E7EB"/>
              <path d="M10.25 9.25H13.25V13.75H10.25V9.25Z" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.75 9.25H18.75V13.75H15.75V9.25Z" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 19L19 19" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
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
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z" fill="#E5E7EB"/>
              <path d="M11 9.5H20" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 14H20" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 18.5H20" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.62461 10.4016C8.12167 10.4016 8.52461 9.99862 8.52461 9.50156C8.52461 9.00451 8.12167 8.60156 7.62461 8.60156C7.12755 8.60156 6.72461 9.00451 6.72461 9.50156C6.72461 9.99862 7.12755 10.4016 7.62461 10.4016Z" stroke="#6B7280" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.62461 14.9016C8.12167 14.9016 8.52461 14.4986 8.52461 14.0016C8.52461 13.5045 8.12167 13.1016 7.62461 13.1016C7.12755 13.1016 6.72461 13.5045 6.72461 14.0016C6.72461 14.4986 7.12755 14.9016 7.62461 14.9016Z" stroke="#6B7280" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.62461 19.4016C8.12167 19.4016 8.52461 18.9986 8.52461 18.5016C8.52461 18.0045 8.12167 17.6016 7.62461 17.6016C7.12755 17.6016 6.72461 18.0045 6.72461 18.5016C6.72461 18.9986 7.12755 19.4016 7.62461 19.4016Z" stroke="#6B7280" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("insertOrderedList")}
            className="p-0 hover:opacity-80 transition"
            title="Numbered List"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z" fill="#E5E7EB"/>
              <path d="M8.66699 10H16.667" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.66699 12.668H20.667" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.66699 15.332H16.667" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.66699 18H20.667" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
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
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z" fill="#E5E7EB"/>
              <path d="M10.333 10H18.333" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12.668H19.6667" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.333 15.332H18.333" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 18H19.6667" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("justifyCenter")}
            className="p-0 hover:opacity-80 transition"
            title="Align Center"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z" fill="#E5E7EB"/>
              <path d="M19.333 10H11.333" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.333 12.668H7.33301" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.333 15.332H11.333" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.333 18H7.33301" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("justifyRight")}
            className="p-0 hover:opacity-80 transition"
            title="Align Right"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 4C0 1.79086 1.79086 0 4 0H24C26.2091 0 28 1.79086 28 4V24C28 26.2091 26.2091 28 24 28H4C1.79086 28 0 26.2091 0 24V4Z" fill="#E5E7EB"/>
              <path d="M19.333 10H11.333" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.333 12.668H7.33301" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.333 15.332H11.333" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.333 18H7.33301" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("formatBlock", "<blockquote>")}
            className="p-0 hover:opacity-80 transition"
            title="Blockquote"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z" fill="#E5E7EB"/>
              <path d="M7 8H14M7 12H14M7 16H14M21 8V16H17L21 20" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("formatBlock", "<code>")}
            className="p-0 hover:opacity-80 transition"
            title="Code"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z" fill="#E5E7EB"/>
              <path d="M10.667 10V18" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.333 10V18" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.333 14H17.333" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
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
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z" fill="#E5E7EB"/>
              <path d="M12.6667 15.3346C12.056 14.7115 11.7139 13.8738 11.7139 13.0013C11.7139 12.1288 12.056 11.2911 12.6667 10.668L14.0001 9.33464C14.642 8.85321 15.436 8.61948 16.2364 8.67636C17.0367 8.73324 17.7897 9.07691 18.3571 9.64428C18.9245 10.2117 19.2681 10.9646 19.325 11.765C19.3819 12.5654 19.1482 13.3594 18.6667 14.0013L18.0001 14.668" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.3337 12.668C15.9444 13.2911 16.2865 14.1288 16.2865 15.0013C16.2865 15.8738 15.9444 16.7115 15.3337 17.3346L14.0003 18.668C13.3584 19.1494 12.5644 19.3831 11.764 19.3262C10.9637 19.2694 10.2107 18.9257 9.64331 18.3583C9.07594 17.791 8.73226 17.038 8.67538 16.2376C8.6185 15.4372 8.85223 14.6432 9.33366 14.0013L10.0003 13.3346" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={handleImage}
            className="p-0 hover:opacity-80 transition"
            title="Image"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28 4C28 1.79086 26.2091 0 24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4Z" fill="#E5E7EB"/>
              <path d="M18.6667 9.33203H9.33333C8.59695 9.33203 8 9.92898 8 10.6654V17.332C8 18.0684 8.59695 18.6654 9.33333 18.6654H18.6667C19.403 18.6654 20 18.0684 20 17.332V10.6654C20 9.92898 19.403 9.33203 18.6667 9.33203Z" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.333 14.6667L12.6663 16L14.6663 14L17.9997 17.3333" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.9997 12.3333C11.3679 12.3333 11.6663 12.0349 11.6663 11.6667C11.6663 11.2985 11.3679 11 10.9997 11C10.6315 11 10.333 11.2985 10.333 11.6667C10.333 12.0349 10.6315 12.3333 10.9997 12.3333Z" stroke="#6B7280" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => {
              const rows = prompt("Enter number of rows:");
              const cols = prompt("Enter number of columns:");
              if (rows && cols) {
                let tableHTML = "<table border='1' style='border-collapse: collapse;'>";
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
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="4" fill="#E5E7EB"/>
              <path d="M18.1485 9.25781H9.85218C9.19762 9.25781 8.66699 9.78844 8.66699 10.443V17.5541C8.66699 18.2087 9.19762 18.7393 9.85218 18.7393H18.1485C18.803 18.7393 19.3337 18.2087 19.3337 17.5541V10.443C19.3337 9.78844 18.803 9.25781 18.1485 9.25781Z" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.66699 12.668H19.3337" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 9V18" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 9V18" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
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
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="4" fill="#E5E7EB"/>
              <path d="M12.0003 15.3346L8.66699 12.0013L12.0003 8.66797" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.3333 19.3331C19.6014 18.3183 19.5985 17.2509 19.3251 16.2376C19.0516 15.2242 18.5171 14.3003 17.7749 13.5581C17.0328 12.816 16.1089 12.2815 15.0955 12.008C14.0822 11.7345 13.0148 11.7317 12 11.9997" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleCommand("redo")}
            className="p-0 hover:opacity-80 transition"
            title="Redo"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="4" transform="matrix(-1 0 0 1 28 0)" fill="#E5E7EB"/>
              <path d="M15.9997 15.3346L19.333 12.0013L15.9997 8.66797" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.66667 19.3331C8.39862 18.3183 8.40147 17.2509 8.67492 16.2376C8.94838 15.2242 9.48289 14.3003 10.2251 13.5581C10.9672 12.816 11.8911 12.2815 12.9045 12.008C13.9178 11.7345 14.9852 11.7317 16 11.9997" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
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

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 xl:px-6 2xl:px-[66px]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[40px] text-oxford-blue">
              {t('admin.createVariant.hero.title')}
            </h1>
            <p className="mt-2 font-roboto text-[14px] md:text-[18px] font-normal leading-[18px] md:leading-[20px] text-dark-gray">
              {t('admin.createVariant.hero.subtitle')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
            <button
              type="button"
              onClick={handleCancel}
              className="flex h-[36px] items-center justify-center rounded-[8px] border border-[#03274633] bg-white px-4 text-[16px] font-archivo font-semibold leading-[16px] text-[#374151] transition hover:bg-[#F9FAFB]"
            >
              {t('admin.createVariant.buttons.cancel')}
            </button>
            <button
              type="button"
              onClick={handleSaveVariant}
              className="flex h-[36px] items-center justify-center rounded-[8px] bg-[#ED4122] px-4 text-[16px] font-archivo font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f]"
            >
              {t('admin.createVariant.buttons.saveVariant')}
            </button>
          </div>
        </header>

        {/* Tip Box */}
        <div
          className="rounded-[14px] border border-[#ED4122] p-3 md:p-4 flex items-center gap-2 md:gap-3 w-full lg:w-[1116px] h-auto lg:h-[61px]"
          style={{
            backgroundColor: "#FDF0D5",
          }}
        >
          <svg width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            <path d="M9.2643 0.00461342C6.79519 -0.0729218 4.48514 0.829341 2.72734 2.52404C0.968305 4.21874 0 6.49181 0 8.92371C0 11.0836 0.922343 13.2028 2.81918 15.4009C3.74028 16.4692 4.34484 17.2655 4.34484 18.5504V19.3848C4.34484 22.1453 6.21682 24 9.00124 24C11.7857 24 13.6564 22.1453 13.6564 19.3848V18.5441C13.6564 17.242 14.266 16.4421 15.1275 15.4514C16.5737 13.7875 18.0473 11.7013 17.9988 8.83868C17.9206 4.10288 14.0014 0.138762 9.2643 0.00461342ZM9.00003 22.1539C7.25092 22.1539 6.20691 21.1189 6.20691 19.3848V19.0771H11.7943V19.3848C11.7943 21.1189 10.7491 22.1539 9.00003 22.1539ZM13.7161 14.2465C12.9552 15.1215 12.2536 16.02 11.9507 17.2311H9.93106V13.614L12.1408 11.4233C12.5045 11.0627 12.5045 10.4781 12.1408 10.1175C11.777 9.75687 11.1873 9.75687 10.8236 10.1175L8.99881 11.9266L7.17402 10.1175C6.81029 9.75687 6.22059 9.75687 5.85687 10.1175C5.49314 10.4781 5.49314 11.0627 5.85687 11.4233L8.06656 13.614V17.2311H6.04416C5.74127 16.0385 5.03991 15.1365 4.23301 14.2011C2.63535 12.3514 1.85965 10.6246 1.85965 8.92371C1.85965 6.99518 2.62797 5.19215 4.02328 3.8482C5.3677 2.55349 7.12562 1.84708 8.99639 1.84708C9.06715 1.84708 9.13778 1.84826 9.20854 1.84949C12.9637 1.95656 16.071 5.10489 16.1343 8.86842C16.1741 11.112 14.9339 12.8459 13.7161 14.2465Z" fill="#ED4122"/>
          </svg>
          <p className="font-roboto text-[14px] md:text-[18px] font-normal leading-[18px] md:leading-[26px] text-[#ED4122]">
            <span className="font-medium">Tip:</span> {t('admin.createVariant.tip')}
          </p>
        </div>

        {/* Main Content - Two Columns */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Question Details Section */}
            <div
              className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 shadow-card"
            >
              <h2 className="mb-4 md:mb-6 font-archivo text-[18px] md:text-[20px] font-bold leading-[28px] text-oxford-blue">
                {t('admin.createVariant.sections.questionDetails')}
              </h2>

              <div className="space-y-6">
                {/* Question Field */}
                <div>
                  <label className="my-5 block font-archivo text-[20px] font-bold leading-[20px] text-[#374151]">
                    {t('admin.createVariant.fields.question')}
                  </label>
                  <RichTextEditor
                    value={questionText}
                    onChange={setQuestionText}
                    placeholder={t('admin.createVariant.placeholders.questionText')}
                    minHeight="150px"
                  />
                </div>

                {/* Options */}
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                        {t('admin.createVariant.fields.optionA')}
                      </label>
                      <input
                        type="text"
                        value={options.A}
                        onChange={(e) => handleOptionChange("A", e.target.value)}
                        className="w-full rounded-[12px] border border-[#03274633] bg-white py-3 px-4 font-roboto text-[16px] leading-[100%] text-oxford-blue outline-none placeholder:text-[#9CA3AF] lg:w-[319px] lg:h-[50px] h-[45px] md:h-[50px]"
                        style={{
                          lineHeight: "100%",
                        }}
                        placeholder={t('admin.createVariant.placeholders.enterOptionA')}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                        {t('admin.createVariant.fields.optionB')}
                      </label>
                      <input
                        type="text"
                        value={options.B}
                        onChange={(e) => handleOptionChange("B", e.target.value)}
                        className="w-full rounded-[12px] border border-[#03274633] bg-white py-3 px-4 font-roboto text-[16px] leading-[100%] text-oxford-blue outline-none placeholder:text-[#9CA3AF] lg:w-[319px] lg:h-[50px] h-[45px] md:h-[50px]"
                        style={{
                          lineHeight: "100%",
                        }}
                        placeholder={t('admin.createVariant.placeholders.enterOptionB')}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                        {t('admin.createVariant.fields.optionC')}
                      </label>
                      <input
                        type="text"
                        value={options.C}
                        onChange={(e) => handleOptionChange("C", e.target.value)}
                        className="w-full rounded-[12px] border border-[#03274633] bg-white py-3 px-4 font-roboto text-[16px] leading-[100%] text-oxford-blue outline-none placeholder:text-[#9CA3AF] lg:w-[319px] lg:h-[50px] h-[45px] md:h-[50px]"
                        style={{
                          lineHeight: "100%",
                        }}
                        placeholder={t('admin.createVariant.placeholders.enterOptionC')}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                        {t('admin.createVariant.fields.optionD')}
                      </label>
                      <input
                        type="text"
                        value={options.D}
                        onChange={(e) => handleOptionChange("D", e.target.value)}
                        className="w-full rounded-[12px] border border-[#03274633] bg-white py-3 px-4 font-roboto text-[16px] leading-[100%] text-oxford-blue outline-none placeholder:text-[#9CA3AF] lg:w-[319px] lg:h-[50px] h-[45px] md:h-[50px]"
                        style={{
                          lineHeight: "100%",
                        }}
                        placeholder={t('admin.createVariant.placeholders.enterOptionD')}
                      />
                    </div>
                  </div>
                </div>

                {/* Correct Answer */}
                <div>
                  <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-[#374151]">
                    {t('admin.createVariant.fields.correctAnswer')}
                  </label>
                  <div className="relative">
                    <select
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                      className="w-full appearance-none rounded-[8px] border border-[#03274633] bg-white py-3 pl-4 pr-10 font-roboto text-[16px] leading-[20px] text-oxford-blue outline-none lg:w-[660px] lg:h-[50px] h-[45px] md:h-[50px]"
                    >
                      <option value="">{t('admin.createVariant.placeholders.selectCorrectAnswer')}</option>
                      <option value="A">{t('admin.createVariant.correctAnswerOptions.optionA')}</option>
                      <option value="B">{t('admin.createVariant.correctAnswerOptions.optionB')}</option>
                      <option value="C">{t('admin.createVariant.correctAnswerOptions.optionC')}</option>
                      <option value="D">{t('admin.createVariant.correctAnswerOptions.optionD')}</option>
                    </select>
                    <svg
                      className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2"
                      width="15"
                      height="9"
                      viewBox="0 0 15 9"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.6875 0.726562L7.00848 6.71211L13.3295 0.726562"
                        stroke="#032746"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation Section */}
            <div
              className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full lg:w-[720px]"
              style={{
              }}
            >
              <h2 className="mb-6 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                {t('admin.createVariant.sections.explanation')}
              </h2>
              <RichTextEditor
                value={explanation}
                onChange={setExplanation}
                placeholder={t('admin.createVariant.placeholders.explanation')}
                minHeight="150px"
              />
            </div>

            {/* Classification Section */}
            <div
              className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 shadow-card"
            >
              <h2 className="mb-4 md:mb-6 pt-4 font-archivo text-[18px] md:text-[20px] font-bold leading-[28px] text-oxford-blue">
                {t('admin.createVariant.sections.classification')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-5">
                {/* Subject */}
                <div >
                  <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-[#374151]">
                    {t('admin.createVariant.fields.subject')}
                  </label>
                  <div className="relative">
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full appearance-none rounded-[8px] border border-[#03274633] bg-white py-3 pl-4 pr-10 font-roboto text-[16px] leading-[20px] text-oxford-blue outline-none"
                      style={{ height: "50px" }}
                    >
                      <option value="">{t('admin.createVariant.placeholders.selectSubject')}</option>
                    </select>
                    <svg
                      className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-gray"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Topic */}
                <div>
                  <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-[#374151]">
                    {t('admin.createVariant.fields.topic')}
                  </label>
                  <div className="relative">
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full appearance-none rounded-[8px] border border-[#03274633] bg-white py-3 pl-4 pr-10 font-roboto text-[16px] leading-[20px] text-oxford-blue outline-none"
                      style={{ height: "50px" }}
                    >
                      <option value="">{t('admin.createVariant.placeholders.selectTopic')}</option>
                    </select>
                    <svg
                      className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-gray"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Subtopic */}
                <div>
                  <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-[#374151]">
                    {t('admin.createVariant.fields.subtopic')}
                  </label>
                  <div className="relative">
                    <select
                      value={subtopic}
                      onChange={(e) => setSubtopic(e.target.value)}
                      className="w-full appearance-none rounded-[8px] border border-[#03274633] bg-white py-3 pl-4 pr-10 font-roboto text-[16px] leading-[20px] text-oxford-blue outline-none"
                      style={{ height: "50px" }}
                    >
                      <option value="">{t('admin.createVariant.placeholders.selectSubtopic')}</option>
                    </select>
                    <svg
                      className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-gray"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Cognitive Level */}
                <div>
                  <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-[#374151]">
                    {t('admin.createVariant.fields.cognitiveLevel')}
                  </label>
                  <div className="relative">
                    <select
                      value={cognitiveLevel}
                      onChange={(e) => setCognitiveLevel(e.target.value)}
                      className="w-full appearance-none rounded-[8px] border border-[#03274633] bg-white py-3 pl-4 pr-10 font-roboto text-[16px] leading-[20px] text-oxford-blue outline-none"
                      style={{ height: "50px" }}
                    >
                      <option value="">{t('admin.createVariant.placeholders.selectCognitiveLevel')}</option>
                    </select>
                    <svg
                      className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-gray"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Source Question Overview */}
          <div className="flex flex-col gap-6 w-full lg:w-[376px]">
            <div
              className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full lg:w-[376px] h-auto lg:h-[651px]"
              style={{
              }}
            >
              <h2 className="mb-4 py-2 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                {t('admin.createVariant.sections.sourceQuestionOverview')}
              </h2>

              <div className="border-t border-[#E5E7EB] pt-4"></div>

              <div className="space-y-4 mt-4">
                {/* Question Text */}
                <div>
                  <p className="font-roboto text-[16px] py-2 font-normal leading-[20px] text-oxford-blue">
                    What is the primary function of a router in a computer network?
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="sourceOption"
                      value="A"
                      checked
                      className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                      disabled
                    />
                    <span className="font-roboto text-[16px] font-normal leading-[100%] text-[#ED4122]">
                      <span className="font-medium">A.</span> Directing data packets between networks
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="sourceOption"
                      value="B"
                      className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                      disabled
                    />
                    <span className="font-roboto text-[16px] font-normal leading-[100%] text-oxford-blue">
                      <span className="font-medium">B.</span> Managing network security protocols
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="sourceOption"
                      value="C"
                      className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                      disabled
                    />
                    <span className="font-roboto text-[16px] font-normal leading-[100%] text-oxford-blue">
                      <span className="font-medium">C.</span> Providing wireless access points
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="sourceOption"
                      value="D"
                      className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                      disabled
                    />
                    <span className="font-roboto text-[16px] font-normal leading-[100%] text-oxford-blue">
                      <span className="font-medium">D.</span> Assigning IP address to devices
                    </span>
                  </label>
                </div>

                {/* Correct Answer */}
                <div>
                  <p className="font-roboto py-2 pt-3 text-[16px] font-medium leading-[20px] text-oxford-blue">
                    <span className="font-medium text-[#ED4122]">{t('admin.createVariant.sourceQuestion.correctAnswer')}</span>{" "}
                    <span className="text-[#ED4122]">A</span>
                  </p>
                </div>

                {/* Metadata */}
                <div className="pt-10 border-t border-[#E5E7EB] space-y-4 mt-4">
                  <div className="flex gap-[80px] px-1">
                    <label className="block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray mb-1">
                      {t('admin.createVariant.sourceQuestion.source')}
                    </label>
                    <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                      Network Fundamentals
                    </p>
                  </div>
                  <div className="flex gap-[80px] px-1">
                    <label className="block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray mb-1">
                      {t('admin.createVariant.sourceQuestion.creator')}
                    </label>
                    <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                      Alex Turner
                    </p>
                  </div>
                  <div className="flex gap-[54px] px-1">
                    <label className="block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray mb-1">
                      {t('admin.createVariant.sourceQuestion.createdOn')}
                    </label>
                    <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                      15-01-2024
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-wrap justify-end gap-3 md:gap-4 pb-4 md:pb-6">
          <button
            type="button"
            onClick={handleCancel}
            className="flex h-[36px] items-center justify-center rounded-[8px] border border-[#03274633] bg-white px-4 md:px-7 text-[14px] md:text-[16px] font-archivo font-semibold leading-[16px] text-[#374151] transition hover:bg-[#F9FAFB]"
          >
            {t('admin.createVariant.buttons.cancel')}
          </button>
          <button
            type="button"
            onClick={handleCreateVariant}
            className="flex h-[36px] items-center justify-center rounded-[8px] bg-[#ED4122] px-4 md:px-7 text-[14px] md:text-[16px] font-archivo font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f]"
          >
            {t('admin.createVariant.buttons.createVariant')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateVariantPage;

