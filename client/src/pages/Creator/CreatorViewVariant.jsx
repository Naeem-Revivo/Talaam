import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const CreatorViewVariant = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [comment, setComment] = useState("");
  const [explanation, setExplanation] = useState("");

  const handleCancel = () => {
    navigate("/creator/question-bank/completed-question");
  };

  const handleRefresh = () => {
    // TODO: Implement refresh functionality
    console.log("Refresh");
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export");
  };

  const handleSendToExplainer = () => {
    // TODO: Implement send to explainer functionality
    console.log("Send to explainer");
  };

  const handleReject = () => {
    // TODO: Implement reject functionality
    console.log("Reject");
  };

  const handleApprove = () => {
    // TODO: Implement approve functionality
    console.log("Approve");
  };

  const handleAddComment = () => {
    // TODO: Implement add comment functionality
    console.log("Add comment", comment);
    setComment("");
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
      <div className="rounded-[8px] border border-[#CDD4DA] bg-white overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 border-b border-[#CDD4DA] bg-[#F6F7F8] py-3 px-2 rounded-t-[8px]">
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
              <rect width="28" height="28" rx="4" transform="matrix(-1 0 0 1 28 0)" fill="#E5E7EB" />
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

  const activityLog = [
    {
      id: 1,
      action: "Variant Created",
      description: "Variant Created by Adeel (Creator)",
      date: "Oct 13, 2023, 10:32 AM",
      icon: (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="15" r="15" fill="#ED4122" />
          <path d="M15 9V21M9 15H21" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 2,
      action: "Sent for Review",
      description: "Sent for Review by Sarah (Processor)",
      date: "Oct 13, 2023, 11:45 AM",
      icon: (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="15" r="15" fill="#3B82F6" />
          <path d="M11 15L14 18L19 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: 3,
      action: "Status Changed",
      description: "Status Changed: In Review - Approved by Reviewer (Adeel)",
      date: "Oct 13, 2023, 2:15 PM",
      icon: (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="30" height="30" rx="4" fill="#F59E0B" />
          <path d="M9 15L12 18L21 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  const comments = [
    {
      id: 1,
      author: "Emily Davis",
      text: "Thos variant looks good, but the explanation could be more detailed.",
      avatar: "ED",
      date: "14-01-2024",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-4 md:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[38px] text-oxford-blue mb-2">
              {t('creator.ViewVariant.heading')}
            </h1>
            <p className="font-roboto text-[14px] md:text-[18px] font-normal leading-[20px] md:leading-[24px] text-dark-gray">
              {t('creator.ViewVariant.subheading')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={handleCancel}
              className="flex h-[36px] items-center justify-center rounded-[8px] border border-[#03274633] bg-white px-4 text-[16px] font-roboto font-medium leading-[16px] text-[#374151] transition hover:bg-[#F9FAFB]"
            >
              {t('admin.variantQuestionReview.buttons.cancel')}
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="flex h-[36px] items-center justify-center rounded-[8px] border border-[#03274633] bg-white px-4 text-[16px] font-roboto font-medium leading-[16px] text-[#374151] transition hover:bg-[#F9FAFB]"
            >
              {t('admin.variantQuestionReview.buttons.refresh')}
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="flex h-[36px] items-center justify-center gap-2 rounded-[8px] bg-[#ED4122] px-4 text-[16px] font-roboto font-medium leading-[16px] text-white transition hover:bg-[#d43a1f]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.10357 3.51181C4.86316 3.2714 4.86316 2.88163 5.10357 2.64122L7.5651 0.179682C7.62172 0.123067 7.68994 0.0779487 7.76542 0.0467692C7.91558 -0.0155898 8.08542 -0.0155898 8.23558 0.0467692C8.31106 0.0779487 8.37908 0.123067 8.4357 0.179682L10.8972 2.64122C11.1376 2.88163 11.1376 3.2714 10.8972 3.51181C10.7774 3.63161 10.6199 3.6923 10.4623 3.6923C10.3048 3.6923 10.1472 3.63243 10.0274 3.51181L8.61619 2.10051V11.2821C8.61619 11.6217 8.34049 11.8974 8.0008 11.8974C7.66111 11.8974 7.38542 11.6217 7.38542 11.2821V2.10131L5.97416 3.51262C5.73293 3.75221 5.34398 3.75223 5.10357 3.51181ZM12.9231 5.74359C12.5834 5.74359 12.3077 6.01928 12.3077 6.35897C12.3077 6.69866 12.5834 6.97436 12.9231 6.97436C14.217 6.97436 14.7692 7.52656 14.7692 8.82051V12.9231C14.7692 14.217 14.217 14.7692 12.9231 14.7692H3.07692C1.78297 14.7692 1.23077 14.217 1.23077 12.9231V8.82051C1.23077 7.52656 1.78297 6.97436 3.07692 6.97436C3.41662 6.97436 3.69231 6.69866 3.69231 6.35897C3.69231 6.01928 3.41662 5.74359 3.07692 5.74359C1.09292 5.74359 0 6.83651 0 8.82051V12.9231C0 14.9071 1.09292 16 3.07692 16H12.9231C14.9071 16 16 14.9071 16 12.9231V8.82051C16 6.83651 14.9071 5.74359 12.9231 5.74359Z" fill="white"/>
              </svg>
              {t('admin.variantQuestionReview.buttons.export')}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Source Question Reference Card */}
          <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full lg:w-[879px] h-auto lg:h-[296px]">
            <h2 className="p-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
              {t('admin.variantQuestionReview.sections.sourceQuestionReference')}
            </h2>
            <div className="p-4 space-y-3">
              <p className="font-roboto text-[20px] font-bold leading-[20px] text-oxford-blue">
                <span className="font-bold">{t('admin.variantQuestionReview.fields.questionId')}</span> 12345
              </p>
              <p className="font-roboto pt-2 text-[16px] font-normal leading-[20px] text-dark-gray">
                What is the capital of France?
              </p>
              <div className="grid pt-1 grid-cols-2 gap-x-8 gap-y-3">
                <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">A. Berlin</p>
                <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">B. Paris</p>
                <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">C. Rome</p>
                <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">D. Madrid</p>
              </div>
            </div>
          </div>

          {/* Variant Question Card */}
          <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full lg:w-[879px] h-auto lg:h-[686px]">
            <h2 className="p-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
              {t('admin.variantQuestionReview.sections.variantQuestion')}
            </h2>
            <div className="p-4 space-y-4">
              <div>
                <label className="block font-roboto text-[20px] font-bold leading-[20px] text-oxford-blue mb-2">
                  {t('admin.variantQuestionReview.fields.question')}
                </label>
                <p className="font-roboto py-2 text-[16px] font-normal leading-[20px] text-dark-gray">
                  What is the capital of France?
                </p>
              </div>
              <div>
                <label className="block pb-3 font-archivo text-[20px] font-bold leading-[20px] text-oxford-blue mb-2">
                  {t('admin.variantQuestionReview.fields.options')}
                </label>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">A. Berlin</p>
                  <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">B. Paris</p>
                  <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">C. Rome</p>
                  <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">D. Madrid</p>
                </div>
              </div>
              <div>
                <label className="block pb-3 font-archivo text-[20px] font-bold leading-[20px] text-oxford-blue mb-2">
                  {t('admin.variantQuestionReview.fields.correctAnswer')}
                </label>
                <p className="font-roboto pb-5 text-[16px] font-normal leading-[20px] text-[#ED4122]">
                  B. Paris
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray mb-2">
                    {t('admin.variantQuestionReview.fields.type')}
                  </label>
                  <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                    {t('admin.variantQuestionReview.types.multipleChoice')}
                  </p>
                </div>
                <div>
                  <label className="block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray mb-2">
                    {t('admin.variantQuestionReview.fields.creator')}
                  </label>
                  <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                    Sarah Johnson
                  </p>
                </div>
                <div>
                  <label className="block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray mb-2">
                    {t('admin.variantQuestionReview.fields.status')}
                  </label>
                  <p className="font-roboto text-[16px] font-normal leading-[20px] text-[#ED4122]">
                    {t('admin.variantQuestionReview.status.inReview')}
                  </p>
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-wrap justify-end gap-2 md:gap-3 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={handleCancel}
                className="flex h-[36px] items-center justify-center rounded-[8px] border border-[#03274633] bg-white px-3 md:px-4 text-[14px] md:text-[16px] font-roboto font-medium leading-[16px] text-[#374151] transition hover:bg-[#F9FAFB]"
              >
                {t('admin.variantQuestionReview.buttons.cancel')}
              </button>
              <button
                type="button"
                onClick={handleSendToExplainer}
                className="flex h-[36px] items-center justify-center rounded-[8px] border border-[#03274633] bg-white px-3 md:px-4 text-[14px] md:text-[16px] font-roboto font-medium leading-[16px] text-[#374151] transition hover:bg-[#F9FAFB]"
              >
                {t('admin.variantQuestionReview.buttons.sendToExplainer')}
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="flex h-[36px] items-center justify-center rounded-[8px] border border-[#03274633] bg-white px-3 md:px-4 text-[14px] md:text-[16px] font-roboto font-medium leading-[16px] text-[#374151] transition hover:bg-[#F9FAFB]"
              >
                {t('admin.variantQuestionReview.buttons.reject')}
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="flex h-[36px] items-center justify-center rounded-[8px] bg-[#ED4122] px-4 md:px-7 text-[14px] md:text-[16px] font-roboto font-medium leading-[16px] text-white transition hover:bg-[#d43a1f]"
              >
                {t('admin.variantQuestionReview.buttons.approve')}
              </button>
            </div>
          </div>

          {/* Explanation Card */}
          <div
            className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full lg:w-[879px] shadow-card"
          >
            <h2 className="py-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
              {t('admin.variantQuestionReview.sections.explanation')}
            </h2>
            <div className="mt-4">
              <RichTextEditor
                value={explanation}
                onChange={setExplanation}
                placeholder={t('admin.variantQuestionReview.placeholders.explanation')}
                minHeight="182px"
              />
            </div>
          </div>

          {/* Classification Card */}
          <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full lg:w-[879px] h-auto lg:h-[263px] shadow-card">
            <h2 className="py-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
              {t('admin.variantQuestionReview.sections.classification')}
            </h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <div>
                <label className="block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray mb-2">
                  {t('admin.variantQuestionReview.fields.subject')}
                </label>
                <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                  Geography
                </p>
              </div>
              <div>
                <label className="block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray mb-2">
                  {t('admin.variantQuestionReview.fields.topic')}
                </label>
                <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                  European Capitals
                </p>
              </div>
              <div>
                <label className="block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray mb-2">
                  {t('admin.variantQuestionReview.fields.cognitiveLevel')}
                </label>
                <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                  Recall
                </p>
              </div>
              <div>
                <label className="block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray mb-2">
                  {t('admin.variantQuestionReview.fields.sourceQuestion')}
                </label>
                <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                  Q123456
                </p>
              </div>
              <div>
                <label className="block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray mb-2">
                  {t('admin.variantQuestionReview.fields.workflowStage')}
                </label>
                <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                  Review
                </p>
              </div>
              <div>
                  <label className="block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray mb-2">
                  {t('admin.variantQuestionReview.fields.lastUpdate')}
                </label>
                <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                  15-01-2024
                </p>
              </div>
            </div>
          </div>

          {/* Internal Comments Card */}
          <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full lg:w-[879px] h-auto lg:h-[308px]">
            <h2 className="py-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
              {t('admin.variantQuestionReview.sections.internalComments')}
            </h2>
            <div className="mt-1 space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ED4122] flex items-center justify-center text-white font-roboto text-[14px] font-semibold">
                    {comment.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="rounded-[8px] bg-[#F6F7F8] border border-[#E5E7EB] p-4">
                      <div className="flex items-center gap-3 ">
                        <p className="font-roboto text-[12px] font-medium leading-[20px] text-oxford-blue">
                          {comment.author}
                        </p>
                        <p className="font-roboto text-[10px] font-normal leading-[20px] text-dark-gray">
                          {comment.date}
                        </p>
                      </div>
                      <p className="font-roboto text-[12px] font-normal leading-[20px] text-oxford-blue">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ED4122] flex items-center justify-center text-white font-roboto text-[14px] font-semibold">
                  JD
                </div>
                <div className="flex flex-col gap-4 items-end">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t('admin.variantQuestionReview.placeholders.addComment')}
                    className="w-full p-3 border border-[#03274633] rounded-[8px] bg-white font-roboto text-[12px] md:text-[16px] font-normal leading-[20px] text-oxford-blue placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#ED4122] resize-none lg:w-[776px] lg:h-[62px]"
                  />
                  <button
                    type="button"
                    onClick={handleAddComment}
                    className="bottom-3 right-3 flex h-[36px] items-center justify-center rounded-[8px] bg-[#ED4122] px-6 text-[16px] font-roboto font-medium leading-[16px] text-white transition hover:bg-[#d43a1f]"
                  >
                    {t('admin.variantQuestionReview.buttons.addComment')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log Card */}
          <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full lg:w-[874px] shadow-card">
            <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
              {t('admin.variantQuestionReview.sections.activityLog')}
            </h2>
            <div className="mt-4 space-y-4">
              {activityLog.map((activity) => (
                <div
                  key={activity.id}
                  className="flex gap-4 items-start p-4 rounded-[8px] border border-[#E5E7EB] bg-white"
                >
                  <div className="flex-shrink-0">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue mb-1">
                      {activity.description}
                    </p>
                    <p className="font-roboto text-[12px] font-normal leading-[16px] text-dark-gray">
                      {activity.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-wrap justify-end gap-3 md:gap-4 mt-4 md:mt-6 pb-4 md:pb-6">
          <button
            type="button"
            onClick={handleCancel}
            className="flex h-[36px] items-center justify-center rounded-[8px] border border-[#03274633] bg-white px-3 md:px-4 text-[14px] md:text-[16px] font-archivo font-semibold leading-[16px] text-[#374151] transition hover:bg-[#F9FAFB]"
          >
            {t('admin.variantQuestionReview.buttons.cancel')}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/create-variant")}
            className="flex h-[36px] items-center justify-center rounded-[8px] bg-[#ED4122] px-3 md:px-4 text-[14px] md:text-[16px] font-archivo font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f]"
          >
            {t('admin.variantQuestionReview.buttons.createVariant')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatorViewVariant;

