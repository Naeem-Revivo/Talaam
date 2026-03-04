import React from 'react';
import RichTextEditor from '../../../common/RichTextEditor';
import Dropdown from '../common/Dropdown';

const OriginalQuestionForm = ({
  questionText,
  setQuestionText,
  questionType,
  handleQuestionTypeChange,
  options,
  handleOptionChange,
  correctAnswer,
  setCorrectAnswer,
  t
}) => {
  return (
    <div className="bg-white rounded-[14px] border border-[#03274633] px-[30px] pt-[50px] pb-10">
      <h2 className="text-[20px] font-archivo leading-[32px] font-bold text-blue-dark mb-[30px]">
        Original Question
      </h2>

      <div className="space-y-6">
        {/* Question Text */}
        <div>
          <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-5">
            {t("creator.createVariants.fields.questionText")}
          </label>
          <RichTextEditor
            value={questionText}
            onChange={setQuestionText}
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
            value={questionType}
            onChange={handleQuestionTypeChange}
            options={[
              t("creator.createVariants.questionTypes.multipleChoice"),
              t("creator.createVariants.questionTypes.trueFalse"),
            ]}
          />
        </div>

        {/* Options Grid */}
        {questionType === "True/False" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                True
              </label>
              <input
                type="text"
                value={options.A}
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
                value={options.B}
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
                  value={options.A}
                  onChange={(e) => handleOptionChange("A", e.target.value)}
                  className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                />
              </div>
              <div>
                <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                  {t("creator.createVariants.fields.optionC")}
                </label>
                <input
                  type="text"
                  value={options.C}
                  onChange={(e) => handleOptionChange("C", e.target.value)}
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
                  value={options.B}
                  onChange={(e) => handleOptionChange("B", e.target.value)}
                  className="w-full h-[50px] rounded-[12px] border border-[#03274633] bg-white px-4 py-3 text-blue-dark focus:border-blue-dark outline-none"
                />
              </div>
              <div>
                <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
                  {t("creator.createVariants.fields.optionD")}
                </label>
                <input
                  type="text"
                  value={options.D}
                  onChange={(e) => handleOptionChange("D", e.target.value)}
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
          {questionType === "True/False" ? (
            <Dropdown
              value={correctAnswer}
              onChange={setCorrectAnswer}
              options={["True", "False"]}
            />
          ) : (
            <Dropdown
              value={correctAnswer}
              onChange={setCorrectAnswer}
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

export default OriginalQuestionForm;
