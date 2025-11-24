import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton, PrimaryButton } from "../../components/common/Button";
import StatsCards from "../../components/common/StatsCards";
import { useState } from "react";
import ProcessorFilter from "../../components/Processor/ProcessorFilter";

const Dashboard = () => {
  const { t } = useLanguage();

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");

  const stats=[
    { label: "New Questions to Review", value: 124, color: "blue" },
    { label: "Creator Submissions", value: 12, color: "blue" },
    { label: "Accepted (Today)", value: 32, color: "red" },
    { label: "Rejected (Today)", value: 8, color: "red" }
  ]


  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
        <header className="flex flex-col gap-4">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
              Processor Dashboard
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              Review incoming questions, accept or reject, and pass them to
              creators.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-end">
            <OutlineButton
              text="Completed Questions"
            //   onClick={handleExport}
            className="py-[10px], px-[14px]"
            />
            <OutlineButton
              text="Sent Back to Creator"
            //   onClick={handleExport}
            className="py-[10px] px-6"
            />

            <PrimaryButton text="Approve & Sent to Explainer" className="py-[10px] px-5"/>
          </div>
        </header>

        <StatsCards stats={stats}/>

        <ProcessorFilter
        searchValue={search}
        subjectValue={subject}
        topicValue={topic}
        subtopicValue={subtopic}
        onSearchChange={setSearch}
        onSubjectChange={setSubject}
        onTopicChange={setTopic}
        onSubtopicChange={setSubtopic}
      />
      </div>
    </div>
  );
};

export default Dashboard;
