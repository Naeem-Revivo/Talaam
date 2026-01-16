import React from 'react';
import RichTextEditor from '../../../common/RichTextEditor';
import Dropdown from '../common/Dropdown';

const VariantForm = ({
  variant,
  index,
  onDelete,
  onQuestionTextChange,
  onQuestionTypeChange,
  onOptionChange,
  onCorrectAnswerChange,
  t
}) => {
  return (
    <div className="bg-white rounded-[14px] border border-[#03274633] px-[30px] pt-[50px] pb-10">
      <div className="flex items-center justify-between mb-[30px]">
        <h2 className="text-[20px] font-archivo leading-[32px] font-bold text-blue-dark">
          Variant #{index + 1}
        </h2>
        <button
          type="button"
          onClick={() => onDelete(variant.id)}
          className="flex items-center justify-center text-red-600 hover:text-red-700 transition-colors"
          title="Delete variant"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.33334 5.83333H16.6667M7.50001 5.83333V4.16667C7.50001 3.50362 8.00362 2.99999 8.66667 2.99999H11.3333C11.9964 2.99999 12.5 3.50362 12.5 4.16667V5.83333M7.50001 5.83333H12.5M7.50001 5.83333H4.16667M12.5 5.83333H15.8333M4.16667 5.83333L4.58334 15.8333C4.58334 16.4964 5.08695 17 5.75 17H14.25C14.9131 17 15.4167 16.4964 15.4167 15.8333L15.8333 5.83333M8.33334 9.16667V13.3333M11.6667 9.16667V13.3333"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-6">
        {/* Question Text */}
        <div>
          <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-5">
            {t("creator.createVariants.fields.questionText")}
          </label>
          <RichTextEditor
            value={variant.questionText}
            onChange={(value) => onQuestionTextChange(variant.id, value)}
            placeholder={t("creator.createVariants.placeholders.questionText")}
            minHeight="200px"
          />
        </div>

        {/* Question Type */}
        <div>
          <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
            {t("creator.createVariants.fields.questionType")}
          </label>
          <Dropdown
            value={variant.questionType}
            onChange={(value) => onQuestionTypeChange(variant.id, value)}
            options={[
              t("creator.createVariants.questionTypes.multipleChoice"),
              t("creator.createVariants.questionTypes.trueFalse"),
            ]}
          />
        </div>

        {/* Options Grid */}
        {variant.questionType === "True/False" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                True
              </label>
              <input
                type="text"
                value={variant.options.A}
                disabled
                className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-gray-100 px-4 py-3 text-blue-dark cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                False
              </label>
              <input
                type="text"
                value={variant.options.B}
                disabled
                className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-gray-100 px-4 py-3 text-blue-dark cursor-not-allowed"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                  {t("creator.createVariants.fields.optionA")}
                </label>
                <input
                  type="text"
                  value={variant.options.A}
                  onChange={(e) => onOptionChange(variant.id, "A", e.target.value)}
                  className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                />
              </div>
              <div>
                <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                  {t("creator.createVariants.fields.optionC")}
                </label>
                <input
                  type="text"
                  value={variant.options.C}
                  onChange={(e) => onOptionChange(variant.id, "C", e.target.value)}
                  className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                  {t("creator.createVariants.fields.optionB")}
                </label>
                <input
                  type="text"
                  value={variant.options.B}
                  onChange={(e) => onOptionChange(variant.id, "B", e.target.value)}
                  className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                />
              </div>
              <div>
                <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                  {t("creator.createVariants.fields.optionD")}
                </label>
                <input
                  type="text"
                  value={variant.options.D}
                  onChange={(e) => onOptionChange(variant.id, "D", e.target.value)}
                  className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Correct Answer */}
        <div>
          <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
            {t("creator.createVariants.fields.correctAnswer")}
          </label>
          {variant.questionType === "True/False" ? (
            <Dropdown
              value={variant.correctAnswer}
              onChange={(value) => onCorrectAnswerChange(variant.id, value)}
              options={["True", "False"]}
            />
          ) : (
            <Dropdown
              value={variant.correctAnswer}
              onChange={(value) => onCorrectAnswerChange(variant.id, value)}
              options={[
                t("creator.createVariants.correctAnswerOptions.optionA"),
                t("creator.createVariants.correctAnswerOptions.optionB"),
                t("creator.createVariants.correctAnswerOptions.optionC"),
                t("creator.createVariants.correctAnswerOptions.optionD"),
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VariantForm;
