import { useState } from "react";

export default function Tabs() {
  const [activeTab, setActiveTab] = useState("Subject");

  const tabs = ["Subject", "Topics", "Subtopics", "Concepts"];

  return (
    <div className="flex space-x-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`rounded-full w-[150px] py-3 text-center text-sm font-medium border transition-all
            ${
              activeTab === tab
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-dark-blue border-gray-300 hover:bg-gray-100"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
