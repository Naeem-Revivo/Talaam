import React from 'react';

const StudyModeFooter = ({ currentIndex, totalQuestions, onNavigate, onExit }) => (
  <div className="fixed md:relative bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 md:px-6 py-3 md:py-4 z-30 shadow-[0_-2px_10px_0px_rgba(0,0,0,0.05)] md:shadow-none">
    <div className="md:hidden flex items-center justify-between gap-2 mb-4">
      <button
        onClick={() => onNavigate(-1)}
        disabled={currentIndex === 0}
        className={`flex-1 px-3 py-2 rounded text-[14px] font-normal font-roboto transition-colors ${
          currentIndex === 0 ? 'text-[#9CA3AF] cursor-not-allowed bg-[#F3F4F6]' : 'text-[#032746] bg-[#F3F4F6] hover:bg-[#E5E7EB]'
        }`}
      >
        &lt; Previous
      </button>
      <button
        onClick={() => onNavigate(1)}
        disabled={currentIndex === totalQuestions - 1}
        className={`flex-1 px-3 py-2 rounded text-[14px] font-normal font-roboto transition-colors ${
          currentIndex === totalQuestions - 1 ? 'text-[#9CA3AF] cursor-not-allowed bg-[#F3F4F6]' : 'text-[#032746] bg-[#F3F4F6] hover:bg-[#E5E7EB]'
        }`}
      >
        Next &gt;
      </button>
    </div>

    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 md:gap-10">
      <button
        onClick={onExit}
        className="w-full sm:w-auto px-4 py-2 bg-white border border-[#E5E7EB] text-[#032746] rounded-lg text-[14px] md:text-[16px] font-normal font-roboto hover:opacity-90 transition-opacity"
      >
        Exit Session
      </button>
    </div>
  </div>
);

export default StudyModeFooter;


