export default function Tabs({ activeTab, onTabChange }) {
  const tabs = ["Subject", "Topics", "Subtopics", "Concepts"];

  return (
    <div className="flex space-x-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`rounded-full w-[150px] py-3 text-center text-sm font-medium border transition-all
            ${
              activeTab === tab
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-[#032746] border-gray-300 hover:bg-gray-100"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}