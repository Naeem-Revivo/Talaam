import React from 'react';

const Attachments = ({ files, t }) => {
  return (
    <div className="bg-white border border-[#BCBCBD] rounded-lg p-5">
      <h3 className="text-blue-dark font-bold text-[20px] leading-[32px] font-archivo mb-5">
        {t("processor.viewQuestion.attachments")}
      </h3>
      <div className="flex flex-wrap gap-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#F6F7F8] border border-[#BCBCBD] rounded-lg font-normal text-[16px] leading-[100%] font-roboto text-blue-dark"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{file.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Attachments;
