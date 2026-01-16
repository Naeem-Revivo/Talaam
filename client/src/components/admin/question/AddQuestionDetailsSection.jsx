import React from "react";
import RichTextEditor from "../../common/RichTextEditor";
import Dropdown from "../../common/Dropdown";

const AddQuestionDetailsSection = ({
  questionText,
  setQuestionText,
  questionType,
  handleQuestionTypeChange,
  options,
  handleOptionChange,
  correctAnswer,
  setCorrectAnswer,
  t,
}) => {
  return (
    <div className="xl:col-span-2 bg-white rounded-[14px] border border-[#03274633] px-[30px] pt-[50px] pb-10">
      <h2 className="text-[20px] font-archivo leading-[32px] font-bold text-blue-dark mb-[30px]">
        {t("admin.addNewQuestion.sections.questionDetails")}
      </h2>

      <div className="space-y-6">
        {/* Question Text */}
        <div>
          <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-5">
            {t("admin.addNewQuestion.fields.questionText")}
          </label>
          <RichTextEditor
            value={questionText}
            onChange={setQuestionText}
            placeholder={t("admin.addNewQuestion.placeholders.questionText")}
            minHeight="200px"
          />
        </div>

        {/* Question Type */}
        <div>
          <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
            {t("admin.addNewQuestion.fields.questionType")}
          </label>
          <Dropdown
            value={questionType}
            onChange={handleQuestionTypeChange}
            placeholder="Select question type"
            options={[
              t('admin.addNewQuestion.questionTypes.multipleChoice'),
              t('admin.addNewQuestion.questionTypes.trueFalse')
            ]}
          />
        </div>

        {/* Options Grid - Show 4 options for MCQ, 2 options for True/False */}
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
                  {t("admin.addNewQuestion.fields.optionA")}
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
                  {t("admin.addNewQuestion.fields.optionC")}
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
                  {t("admin.addNewQuestion.fields.optionB")}
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
                  {t("admin.addNewQuestion.fields.optionD")}
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
            {t("admin.addNewQuestion.fields.correctAnswer")}
          </label>
          {questionType === "True/False" ? (
            <Dropdown
              value={correctAnswer}
              onChange={setCorrectAnswer}
              placeholder="Select correct answer"
              options={["True", "False"]}
            />
          ) : (
            <Dropdown
              value={correctAnswer}
              onChange={setCorrectAnswer}
              placeholder="Select correct answer"
              options={[
                t('admin.addNewQuestion.correctAnswerOptions.optionA'),
                t('admin.addNewQuestion.correctAnswerOptions.optionB'),
                t('admin.addNewQuestion.correctAnswerOptions.optionC'),
                t('admin.addNewQuestion.correctAnswerOptions.optionD')
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddQuestionDetailsSection;
