import React from 'react';
import { flag, setting } from '../icons';

const StudyModeHeader = ({
  currentIndex,
  totalQuestions,
  currentQuestion,
  onToggleQuestionNav,
  onNavigate,
}) => (
  <header className="bg-white border-b border-[#E5E7EB] px-4 md:px-6 py-3 md:py-4">
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="flex items-center justify-between gap-4 w-full lg:w-auto">
        <div className="text-[20px] font-bold text-[#032746] font-archivo leading-[28px] tracking-[0%]">
          Item {currentIndex + 1} of {totalQuestions}
        </div>
        <div className="hidden lg:block text-[14px] md:text-[16px] font-normal text-[#6B7280] font-roboto">
          Question Id: {currentQuestion.id}
        </div>
        <button className="hidden lg:block text-[#032746] hover:opacity-70">
          <img src={flag} alt="Flag" />
        </button>
        <button onClick={onToggleQuestionNav} className="lg:hidden text-[#032746] hover:opacity-70">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="lg:hidden flex items-center gap-2 w-full justify-between">
        <button className="px-3 py-1.5 bg-[#F3F4F6] text-[#032746] rounded text-[14px] font-normal font-roboto hover:opacity-70 flex items-center gap-2">
          <img src={flag} alt="Mark" />
        </button>
        <button className="px-3 py-1.5 bg-[#F3F4F6] text-[#032746] rounded text-[14px] font-normal font-roboto hover:opacity-70">
          Formula Sheet
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-normal text-[#032746] font-roboto">
            Time Remaining <span className="font-bold">{currentQuestion.timeRemaining || '--:--'}</span>
          </span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4 flex-wrap flex-1 justify-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate(-1)}
            disabled={currentIndex === 0}
            className={`px-3 py-1 rounded text-[14px] font-normal font-roboto transition-colors ${
              currentIndex === 0 ? 'text-[#9CA3AF] cursor-not-allowed' : 'text-[#032746] hover:bg-[#F3F4F6]'
            }`}
          >
            &lt; Previous
          </button>
          <button
            onClick={() => onNavigate(1)}
            disabled={currentIndex === totalQuestions - 1}
            className={`px-3 py-1 rounded text-[14px] font-normal font-roboto transition-colors ${
              currentIndex === totalQuestions - 1 ? 'text-[#9CA3AF] cursor-not-allowed' : 'text-[#032746] hover:bg-[#F3F4F6]'
            }`}
          >
            Next &gt;
          </button>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-2 md:gap-4 w-full lg:w-auto justify-between lg:justify-end">
        <button className="hidden lg:block px-2 md:px-3 py-1.5 bg-[#F3F4F6] text-[#032746] rounded text-[12px] md:text-[14px] font-normal font-roboto hover:opacity-70">
          <span className="hidden sm:inline">Formula Sheet</span>
          <span className="sm:hidden">Formula</span>
        </button>
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-[12px] md:text-[14px] font-normal text-[#032746] font-roboto">
            <span className="hidden sm:inline">Time Remaining </span>
            {currentQuestion.timeRemaining || '--:--'}
          </span>
          <button className="text-[#032746] hover:opacity-70">
            <img src={setting} alt="Settings" className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  </header>
);

export default StudyModeHeader;


