import React from 'react';
import RichTextEditor from '../../../common/RichTextEditor';

const ExplanationEditor = ({ title, value, onChange, placeholder, t }) => {
  return (
    <div className="border border-[#03274633] shadow-[0px_2px_20px_0px_#0327460D] bg-white pt-[18px] pb-[53px] px-[30px] rounded-[14px] mb-[30px]">
      <h2 className="text-[20px] leading-[32px] font-bold text-blue-dark font-archivo mb-[18px]">
        {title}
      </h2>
      <p className="text-[16px] leading-[100%] font-medium font-roboto text-blue-dark mb-5">
        Explanation
      </p>
      <RichTextEditor
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        minHeight="150px"
      />
    </div>
  );
};

export default ExplanationEditor;
