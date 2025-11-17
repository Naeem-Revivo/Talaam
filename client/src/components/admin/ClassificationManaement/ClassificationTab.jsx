import { useLanguage } from "../../../context/LanguageContext";

export default function Tabs({ activeTab, onTabChange }) {
  const { t } = useLanguage();
  const tabs = [
    { key: "Subject", label: t('admin.classificationManagement.tabs.subject') },
    { key: "Topics", label: t('admin.classificationManagement.tabs.topics') },
    { key: "Subtopics", label: t('admin.classificationManagement.tabs.subtopics') },
    { key: "Concepts", label: t('admin.classificationManagement.tabs.concepts') }
  ];

  return (
    <div className="flex space-x-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`rounded-full w-[150px] py-3 text-center text-[16px] leading-[100%] font-medium border transition-all
            ${
              activeTab === tab.key
                ? "bg-[#ED4122] text-white border-[#ED4122]"
                : "bg-white text-oxford-blue border-gray-300 hover:bg-[#E5E7EB]"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}