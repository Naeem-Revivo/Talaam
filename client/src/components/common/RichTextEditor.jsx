import React, { useRef, useState, useEffect, useCallback } from "react";

// Rich Text Editor Component - Fixed version
const RichTextEditor = React.memo(({
  value,
  onChange,
  placeholder,
  minHeight = "200px",
}) => {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');

  // Sync external value changes when not focused
  useEffect(() => {
    if (!isFocused && editorRef.current && value !== internalValue) {
      setInternalValue(value || '');
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, isFocused, internalValue]);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && value && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
      setInternalValue(value);
    }
  }, []);

  const handleInput = useCallback((e) => {
    const html = e.target.innerHTML;
    setInternalValue(html);
    onChange(html);
  }, [onChange]);

  const handleCommand = useCallback((command, value = null) => {
    if (editorRef.current) {
      // Save selection
      const selection = window.getSelection();
      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      
      // Execute command
      document.execCommand(command, false, value);
      
      // Restore focus
      editorRef.current.focus();
      
      // Restore selection
      if (range) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      // Update state
      const newHtml = editorRef.current.innerHTML;
      setInternalValue(newHtml);
      onChange(newHtml);
    }
  }, [onChange]);

  const handleInsertHTML = useCallback((html) => {
    if (editorRef.current) {
      // Save selection
      const selection = window.getSelection();
      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      
      // Insert HTML
      if (range) {
        range.deleteContents();
        const div = document.createElement("div");
        div.innerHTML = html;
        const fragment = document.createDocumentFragment();
        while (div.firstChild) {
          fragment.appendChild(div.firstChild);
        }
        range.insertNode(fragment);
      }
      
      // Update state
      const newHtml = editorRef.current.innerHTML;
      setInternalValue(newHtml);
      onChange(newHtml);
      
      // Restore focus
      editorRef.current.focus();
    }
  }, [onChange]);

  const handleLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (url) {
      handleCommand("createLink", url);
    }
  }, [handleCommand]);

  const handleImage = useCallback(() => {
    const url = prompt("Enter image URL:");
    if (url) {
      handleCommand("insertImage", url);
    }
  }, [handleCommand]);

  // Toolbar button handler with preventDefault
  const handleToolbarClick = useCallback((action) => {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();
      action();
    };
  }, []);

  return (
    <div className="rounded-[8px] w-full h-auto lg:h-[208px] min-h-[150px] border border-[#CDD4DA] bg-white overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center flex-wrap gap-2 border-b border-[#CDD4DA] bg-[#F6F7F8] py-3 px-2 rounded-t-[8px]">
        {/* Text Formatting */}
        <button
          type="button"
          onClick={handleToolbarClick(() => handleCommand("bold"))}
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
          onClick={handleToolbarClick(() => handleCommand("italic"))}
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
          onClick={handleToolbarClick(() => handleCommand("underline"))}
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
          onClick={handleToolbarClick(() => handleCommand("strikeThrough"))}
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
        {/* Alignment */}
        <button
          type="button"
          onClick={handleToolbarClick(() => handleCommand("justifyLeft"))}
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
          onClick={handleToolbarClick(() => handleCommand("justifyCenter"))}
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
          onClick={handleToolbarClick(() => handleCommand("justifyRight"))}
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
      </div>
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full p-4 font-roboto text-[16px] leading-[100%] text-oxford-blue focus:outline-none ${
          !internalValue && !isFocused ? "text-[#9CA3AF]" : ""
        }`}
        style={{ minHeight }}
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
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
