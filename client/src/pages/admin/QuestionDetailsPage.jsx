import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const QuestionDetailsPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [comments, setComments] = useState("");

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
        const div = document.createElement('div');
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
          <button
            type="button"
            onClick={() => handleCommand("formatBlock", "<pre>")}
            className="p-0 hover:opacity-80 transition"
            title="Code"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="4" fill="#E5E7EB"/>
              <path d="M13.6667 18.0294L12.6569 19.0392C12.2551 19.441 11.7103 19.6667 11.1421 19.6667C10.574 19.6667 10.0291 19.441 9.62742 19.0392C9.22569 18.6375 9 18.0927 9 17.5245C9 16.9564 9.22569 16.4115 9.62742 16.0098L10.6372 15" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14.667 10.6372L15.6768 9.62742C16.0785 9.22569 16.6234 9 17.1915 9C17.7597 9 18.3045 9.22569 18.7062 9.62742C19.108 10.0291 19.3337 10.574 19.3337 11.1421C19.3337 11.7103 19.108 12.2551 18.7062 12.6569L17.6964 13.6667" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.667 16.832L15.667 12.832" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round"/>
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

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log("Delete question");
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    navigate("/admin/add-question");
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
    <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 xl:px-6 2xl:px-[66px]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[40px] text-oxford-blue">
            {t('admin.questionDetails.hero.title')}
          </h1>
          <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
            <button
              type="button"
              onClick={handleDelete}
              className="flex h-[36px] items-center justify-center gap-2 rounded-[8px] border border-[#03274633] bg-white px-3 md:px-4 text-[14px] md:text-[16px] font-archivo font-semibold leading-[16px] text-[#374151] transition hover:bg-[#F9FAFB]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.4615 2.15385H10.9064C10.2595 2.15385 10.2322 2.072 10.0549 1.54072L9.90984 1.10492C9.68943 0.444411 9.07416 0 8.37775 0H5.62225C4.92584 0 4.30984 0.443693 4.09015 1.10492L3.94513 1.54072C3.7678 2.07272 3.74051 2.15385 3.09364 2.15385H0.538462C0.241231 2.15385 0 2.39508 0 2.69231C0 2.98954 0.241231 3.23077 0.538462 3.23077H1.47036L2.02103 11.4865C2.12728 13.0839 3.10657 14 4.70759 14H9.29313C10.8934 14 11.8727 13.0839 11.9797 11.4865L12.5304 3.23077H13.4615C13.7588 3.23077 14 2.98954 14 2.69231C14 2.39508 13.7588 2.15385 13.4615 2.15385ZM5.11179 1.44523C5.18574 1.22482 5.39035 1.07692 5.62225 1.07692H8.37775C8.60965 1.07692 8.81498 1.22482 8.88821 1.44523L9.03323 1.88102C9.06482 1.97507 9.09641 2.06626 9.13087 2.15385H4.86769C4.90215 2.06554 4.93447 1.97436 4.96606 1.88102L5.11179 1.44523ZM10.9042 11.4147C10.836 12.4435 10.3234 12.9231 9.29241 12.9231H4.70687C3.6759 12.9231 3.164 12.4442 3.09507 11.4147L2.54944 3.23077H3.09292C3.18267 3.23077 3.25733 3.22144 3.33775 3.2157C3.36216 3.21929 3.38441 3.23077 3.40954 3.23077H10.589C10.6149 3.23077 10.6364 3.21929 10.6608 3.2157C10.7412 3.22144 10.8159 3.23077 10.9056 3.23077H11.4491L10.9042 11.4147ZM8.97436 6.28205V9.87179C8.97436 10.169 8.73313 10.4103 8.4359 10.4103C8.13867 10.4103 7.89744 10.169 7.89744 9.87179V6.28205C7.89744 5.98482 8.13867 5.74359 8.4359 5.74359C8.73313 5.74359 8.97436 5.98482 8.97436 6.28205ZM6.10256 6.28205V9.87179C6.10256 10.169 5.86133 10.4103 5.5641 10.4103C5.26687 10.4103 5.02564 10.169 5.02564 9.87179V6.28205C5.02564 5.98482 5.26687 5.74359 5.5641 5.74359C5.86133 5.74359 6.10256 5.98482 6.10256 6.28205Z" fill="#032746"/>
              </svg>
              {t('admin.questionDetails.buttons.delete')}
            </button>
            <button
              type="button"
              onClick={handleEdit}
              className="flex h-[36px] items-center justify-center gap-2 rounded-[8px] border border-[#03274633] bg-white px-3 md:px-4 text-[14px] md:text-[16px] font-archivo font-semibold leading-[16px] text-[#374151] transition hover:bg-[#F9FAFB]"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.3967 6.00174C11.2376 6.00174 11.085 6.06493 10.9726 6.17742C10.8601 6.28991 10.7969 6.44248 10.7969 6.60157V10.2005C10.7969 10.3596 10.7337 10.5122 10.6212 10.6247C10.5087 10.7372 10.3561 10.8003 10.197 10.8003H1.79948C1.64039 10.8003 1.48783 10.7372 1.37534 10.6247C1.26285 10.5122 1.19965 10.3596 1.19965 10.2005V1.80296C1.19965 1.64387 1.26285 1.4913 1.37534 1.37882C1.48783 1.26633 1.64039 1.20313 1.79948 1.20313H5.39843C5.55752 1.20313 5.71009 1.13993 5.82258 1.02745C5.93507 0.914956 5.99826 0.762388 5.99826 0.603304C5.99826 0.44422 5.93507 0.291652 5.82258 0.179163C5.71009 0.0666738 5.55752 0.003478 5.39843 0.003478H1.79948C1.32223 0.003478 0.864523 0.193065 0.527055 0.530533C0.189587 0.868001 0 1.3257 0 1.80296V10.2005C0 10.6778 0.189587 11.1355 0.527055 11.4729C0.864523 11.8104 1.32223 12 1.79948 12H10.197C10.6743 12 11.132 11.8104 11.4695 11.4729C11.8069 11.1355 11.9965 10.6778 11.9965 10.2005V6.60157C11.9965 6.44248 11.9333 6.28991 11.8208 6.17742C11.7083 6.06493 11.5558 6.00174 11.3967 6.00174ZM2.3993 6.45761V9.00087C2.3993 9.15995 2.4625 9.31252 2.57499 9.42501C2.68748 9.5375 2.84005 9.6007 2.99913 9.6007H5.54239C5.62133 9.60115 5.69959 9.58602 5.77267 9.55617C5.84575 9.52632 5.91222 9.48234 5.96827 9.42675L10.1191 5.26995L11.8226 3.60243C11.8788 3.54667 11.9234 3.48033 11.9539 3.40724C11.9843 3.33414 12 3.25574 12 3.17656C12 3.09737 11.9843 3.01897 11.9539 2.94588C11.9234 2.87278 11.8788 2.80644 11.8226 2.75068L9.27931 0.177428C9.22355 0.121207 9.15721 0.0765832 9.08411 0.0461308C9.01102 0.0156784 8.93262 0 8.85343 0C8.77425 0 8.69585 0.0156784 8.62275 0.0461308C8.54966 0.0765832 8.48332 0.121207 8.42756 0.177428L6.73605 1.87494L2.57325 6.03173C2.51766 6.08778 2.47368 6.15425 2.44383 6.22733C2.41398 6.30041 2.39885 6.37867 2.3993 6.45761ZM8.85343 1.44906L10.5509 3.14657L9.69919 3.99832L8.00168 2.30081L8.85343 1.44906ZM3.59896 6.70354L7.15593 3.14657L8.85343 4.84407L5.29646 8.40104H3.59896V6.70354Z" fill="#032746"/>
              </svg>
              {t('admin.questionDetails.buttons.edit')}
            </button>
            <button
              type="button"
              onClick={handleCreateVariant}
              className="flex h-[36px] items-center justify-center rounded-[8px] bg-[#ED4122] px-4 md:px-6 text-[14px] md:text-[16px] font-archivo font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f]"
            >
              {t('admin.questionDetails.buttons.createVariant')}
            </button>
          </div>
        </header>

        {/* Main Content - Two Columns */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Question Info Card */}
            <div
              className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full h-auto lg:h-[472px]"
              style={{
              }}
            >
              <h2 className="mb-2 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                {t('admin.questionDetails.sections.questionInfo')}
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                    ID:Q-GEO-0012
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-roboto text-[18px] font-normal leading-[20px] text-oxford-blue">
                      {t('admin.questionDetails.fields.status')}:
                    </span>
                    <span className="font-roboto text-[18px] font-normal leading-[20px] text-[#ED4122]">
                      {t('admin.questionDetails.status.inReview')}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#E5E7EB] pt-4"></div>

                <div>
                  <p className="pb-7 font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                    Which of the following mountain ranges is the longest in the world?
                  </p>

                  {/* Options */}
                  <div className="space-y-5">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="option"
                        value="A"
                        className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                        disabled
                      />
                      <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                        A. The Himalayas
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="option"
                        value="B"
                        className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                        disabled
                      />
                      <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                        B. The Rocky Mountains
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="option"
                        value="C"
                        checked
                        className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                        disabled
                      />
                      <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                        C. The Andes
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="option"
                        value="D"
                        className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                        disabled
                      />
                      <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                        D. The Great Dividing Range
                      </span>
                    </label>
                  </div>

                  <div className="border-t border-[#E5E7EB] mt-10 pt-4">
                    <p className="font-archivo text-[20px] font-bold leading-[20px] text-oxford-blue mb-2">
                      {t('admin.questionDetails.fields.correctAnswer')}
                    </p>
                    <label className="flex items-center gap-3 pt-2 cursor-pointer">
                      <input
                        type="radio"
                        name="correctAnswer"
                        value="C"
                        checked
                        className="w-4 h-4 text-[#ED4122] border-[#03274633]"
                        disabled
                      /> 
                      <span className="font-roboto text-[16px] font-normal leading-[20px] text-[#ED4122]">
                        C. The Andes
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation Card */}
            <div
              className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full h-auto lg:h-[199px]"
              style={{
              }}
            >
            <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
              {t('admin.questionDetails.sections.explanation')}
            </h2>
              <div className="border-t border-[#E5E7EB] pt-4">
                <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                  The Andes Mountains, running along the western coast of south America, are the longest continental mountain range in the world, stretching for approximately 7,000 kilometers (4,300 miles).
                </p>
              </div>
            </div>

            {/* Comments Card */}
            <div
              className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 relative w-full h-auto lg:h-[271px]"
              style={{
              }}
            >
              <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                {t('admin.questionDetails.sections.comments')}
              </h2>
              <div className="flex flex-col gap-3 items-end ">
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder={t('admin.questionDetails.placeholders.addComments')}
                  className="rounded-[8px] border border-[#03274633] bg-white py-3 px-4 font-roboto text-[16px] leading-[20px] text-oxford-blue placeholder:text-[#9CA3AF] outline-none w-full lg:h-[143px] min-h-[100px]"
                />
                <button
                  type="button"
                  onClick={handleAddComment}
                  className="flex h-[36px] items-center justify-center rounded-[8px] bg-[#ED4122] px-4 text-[16px] font-roboto font-medium leading-[16px] text-white transition hover:bg-[#d43a1f]"
                >
                  {t('admin.questionDetails.buttons.addComment')}
                </button>
              </div>
            </div>

            {/* Activity Log Card */}
            <div
              className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full h-auto lg:h-[351px]"
              style={{
              }}
            >
            <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
              {t('admin.questionDetails.sections.activityLog')}
            </h2>
              <div className="space-y-4">
                <div
                  className="flex items-center gap-3 rounded-[8px] border border-[#E5E7EB] bg-white p-4 w-full max-w-[672px] h-auto"
                >
                  <div className="flex-shrink-0">
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M30 15C30 23.2843 23.2843 30 15 30C6.71573 30 0 23.2843 0 15C0 6.71573 6.71573 0 15 0C23.2843 0 30 6.71573 30 15Z" fill="#ED4122"/>
                      <path d="M21.125 14.125H15.875V8.875C15.875 8.392 15.483 8 15 8C14.517 8 14.125 8.392 14.125 8.875V14.125H8.875C8.392 14.125 8 14.517 8 15C8 15.483 8.392 15.875 8.875 15.875H14.125V21.125C14.125 21.608 14.517 22 15 22C15.483 22 15.875 21.608 15.875 21.125V15.875H21.125C21.608 15.875 22 15.483 22 15C22 14.517 21.608 14.125 21.125 14.125Z" fill="white" stroke="white" strokeWidth="0.5"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                      Question Created by Sarah Ahmad
                    </p>
                    <p className="font-roboto text-[12px] font-normal leading-[20px] text-dark-gray">
                      Jan 15, 2024
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-3 rounded-[8px] border border-[#E5E7EB] bg-white p-4 w-full max-w-[672px] h-auto"
                >
                  <div className="flex-shrink-0">
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="15" cy="15" r="15" fill="#6CA6C1"/>
                      <path d="M20.3967 15.0017C20.2376 15.0017 20.085 15.0649 19.9726 15.1774C19.8601 15.2899 19.7969 15.4425 19.7969 15.6016V19.2005C19.7969 19.3596 19.7337 19.5122 19.6212 19.6247C19.5087 19.7372 19.3561 19.8003 19.197 19.8003H10.7995C10.6404 19.8003 10.4878 19.7372 10.3753 19.6247C10.2628 19.5122 10.1997 19.3596 10.1997 19.2005V10.803C10.1997 10.6439 10.2628 10.4913 10.3753 10.3788C10.4878 10.2663 10.6404 10.2031 10.7995 10.2031H14.3984C14.5575 10.2031 14.7101 10.1399 14.8226 10.0274C14.9351 9.91496 14.9983 9.76239 14.9983 9.6033C14.9983 9.44422 14.9351 9.29165 14.8226 9.17916C14.7101 9.06667 14.5575 9.00348 14.3984 9.00348H10.7995C10.3222 9.00348 9.86452 9.19307 9.52706 9.53053C9.18959 9.868 9 10.3257 9 10.803V19.2005C9 19.6778 9.18959 20.1355 9.52706 20.4729C9.86452 20.8104 10.3222 21 10.7995 21H19.197C19.6743 21 20.132 20.8104 20.4695 20.4729C20.8069 20.1355 20.9965 19.6778 20.9965 19.2005V15.6016C20.9965 15.4425 20.9333 15.2899 20.8208 15.1774C20.7083 15.0649 20.5558 15.0017 20.3967 15.0017ZM11.3993 15.4576V18.0009C11.3993 18.16 11.4625 18.3125 11.575 18.425C11.6875 18.5375 11.84 18.6007 11.9991 18.6007H14.5424C14.6213 18.6012 14.6996 18.586 14.7727 18.5562C14.8458 18.5263 14.9122 18.4823 14.9683 18.4267L19.1191 14.27L20.8226 12.6024C20.8788 12.5467 20.9234 12.4803 20.9539 12.4072C20.9843 12.3341 21 12.2557 21 12.1766C21 12.0974 20.9843 12.019 20.9539 11.9459C20.9234 11.8728 20.8788 11.8064 20.8226 11.7507L18.2793 9.17743C18.2235 9.12121 18.1572 9.07658 18.0841 9.04613C18.011 9.01568 17.9326 9 17.8534 9C17.7742 9 17.6958 9.01568 17.6228 9.04613C17.5497 9.07658 17.4833 9.12121 17.4276 9.17743L15.736 10.8749L11.5733 15.0317C11.5177 15.0878 11.4737 15.1542 11.4438 15.2273C11.414 15.3004 11.3988 15.3787 11.3993 15.4576ZM17.8534 10.4491L19.5509 12.1466L18.6992 12.9983L17.0017 11.3008L17.8534 10.4491ZM12.599 15.7035L16.1559 12.1466L17.8534 13.8441L14.2965 17.401H12.599V15.7035Z" fill="white"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                      Question Edited by David Chen
                    </p>
                    <p className="font-roboto text-[12px] font-normal leading-[20px] text-dark-gray">
                      Jan 12, 2024
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-3 rounded-[8px] border border-[#E5E7EB] bg-white p-4 w-full max-w-[672px] h-auto"
                >
                  <div className="flex-shrink-0">
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="15" cy="15" r="15" fill="#FDF0D5"/>
                      <path d="M12.7496 20C12.7496 20 12.7481 20 12.7466 20C12.5464 19.9993 12.3559 19.919 12.2156 19.7765L9.21582 16.7298C8.92484 16.4343 8.92859 15.9595 9.22407 15.6692C9.51955 15.379 9.99352 15.382 10.2845 15.6775L12.7541 18.1856L19.7197 11.22C20.0129 10.9267 20.4868 10.9267 20.7801 11.22C21.0733 11.5125 21.0733 11.988 20.7801 12.2805L13.2806 19.781C13.1396 19.9213 12.9483 20 12.7496 20Z" fill="#ED4122" stroke="#ED4122" strokeWidth="0.5"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                      Question Approved by Emily Wong
                    </p>
                    <p className="font-roboto text-[12px] font-normal leading-[20px] text-dark-gray">
                      Jan 25, 2024
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 lg:w-[376px]">
            {/* Classification Card */}
            <div
              className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full lg:w-[376px] h-auto lg:h-[338px]"
              style={{
              }}
            >
              <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                {t('admin.questionDetails.sections.classification')}
              </h2>

              <div className="border-t border-[#E5E7EB] pt-4"></div>

              <div className="space-y-6 mt-4">
                {/* Subject */}
                <div>
                  <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                    {t('admin.questionDetails.fields.subject')}
                  </label>
                  <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                    Geography
                  </p>
                </div>

                {/* Topic */}
                <div>
                  <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                    {t('admin.questionDetails.fields.topic')}
                  </label>
                  <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                    European Capitals
                  </p>
                </div>

                {/* Cognitive Level */}
                <div>
                    <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                    {t('admin.questionDetails.fields.cognitiveLevel')}
                  </label>
                  <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                    Recall
                  </p>
                </div>
              </div>
            </div>

            {/* Workflow Information Card */}
            <div
              className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full lg:w-[376px] h-auto lg:h-[338px]"
              style={{
              }}
            >
              <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                {t('admin.questionDetails.sections.workflowInformation')}
              </h2>

              <div className="border-t border-[#E5E7EB] pt-4"></div>

              <div className="space-y-6 mt-4">
                <div>
                  <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                    {t('admin.questionDetails.fields.createdBy')}
                  </label>
                  <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                    Alice Johnson
                  </p>
                </div>
                <div>
                  <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                    {t('admin.questionDetails.fields.submittedOn')}
                  </label>
                  <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                    14-03-2024
                  </p>
                </div>
                <div>
                  <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                    {t('admin.questionDetails.fields.lastUpdate')}
                  </label>
                  <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                    15-03-2024
                  </p>
                </div>
              </div>
            </div>

            {/* Variants Card */}
            <div
              className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full lg:w-[376px] h-auto lg:h-[271px]"
              style={{
              }}
            >
              <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                {t('admin.questionDetails.sections.variants')}
              </h2>

              <div className="border-t border-[#E5E7EB] pt-4"></div>

              <div className="space-y-6 mt-4">
                <div>
                  <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                    {t('admin.questionDetails.fields.variantId')}
                  </label>
                  <p className="font-roboto text-[16px] font-normal leading-[100%] text-oxford-blue">
                    Variant #1
                  </p>
                </div>
                <div>
                  <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                    {t('admin.questionDetails.fields.createdByVariant')}
                  </label>
                  <p className="font-roboto text-[16px] font-normal leading-[100%] text-oxford-blue">
                    Sarah
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailsPage;

