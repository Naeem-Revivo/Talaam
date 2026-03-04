import React from "react";
import RichTextEditor from "../RichTextEditor";

const AddQuestionExplanationSection = ({ explanation, setExplanation, t }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2 bg-white rounded-[14px] border border-[#03274633] px-[30px] pt-[50px] pb-10">
        <h2 className="text-[20px] leading-[100%] font-archivo font-bold text-blue-dark mb-6">
          {t("admin.addNewQuestion.sections.explanation")}
        </h2>
        <RichTextEditor
          value={explanation}
          onChange={setExplanation}
          placeholder={t("admin.addNewQuestion.placeholders.explanation")}
          minHeight="150px"
        />
      </div>
    </div>
  );
};

export default AddQuestionExplanationSection;
