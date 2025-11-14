import React from "react";

const tabBaseClasses =
  "rounded-[30px] px-5 h-[44px] min-w-[164px] text-[16px] font-archivo font-medium leading-[16px] transition-colors flex items-center justify-center border border-transparent";

const QuestionBankTabs = ({ tabs, activeTab, onChange }) => {
  if (!tabs?.length) return null;

  return (
    <nav className="flex flex-wrap gap-3 py-4">
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange?.(tab.value)}
            className={`${tabBaseClasses} ${
              isActive
                ? "bg-[#ED4122] text-white "
                : "bg-white text-[#032746] hover:bg-[#F3F4F6] border border-[#E5E7EB]"
            }`}
          >
            {tab.label}
            {typeof tab.count === "number" && (
              <span
                className={`ml-2 inline-flex min-w-[28px] items-center justify-center rounded-full px-2 text-[12px] font-roboto font-medium ${
                  isActive ? "bg-white text-[#ED4122]" : "bg-[#F3F4F6] text-[#032746]"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default QuestionBankTabs;


