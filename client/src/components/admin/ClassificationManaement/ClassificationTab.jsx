export default function Tabs({ activeTab, onTabChange }) {
  const tabs = ["Subject", "Topics", "Subtopics", "Concepts"];

  return (
    <div className="flex space-x-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`rounded-full w-[150px] py-3 text-center text-[16px] leading-[100%] font-medium border transition-all
            ${
              activeTab === tab
                ? "bg-[#ED4122] text-white border-[#ED4122]"
                : "bg-white text-[#032746] border-gray-300 hover:bg-[#E5E7EB]"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}