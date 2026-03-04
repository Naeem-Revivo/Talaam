import React from "react";
import AddQuestionVariantForm from "./AddQuestionVariantForm";

const AddQuestionVariantsSection = ({
  variants,
  onAddVariant,
  onDeleteVariant,
  onVariantQuestionTextChange,
  onVariantQuestionTypeChange,
  onVariantOptionChange,
  onVariantCorrectAnswerChange,
  onVariantExplanationChange,
  t,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] leading-[100%] font-archivo font-bold text-blue-dark">
          Variants
        </h2>
        <button
          type="button"
          onClick={onAddVariant}
          className="flex h-[36px] items-center justify-center rounded-[8px] bg-[#ED4122] px-4 md:px-6 text-[14px] md:text-[16px] font-archivo font-medium leading-[16px] text-white transition hover:bg-[#d43a1f]"
        >
          + Add Variant
        </button>
      </div>

      {/* Variants List */}
      {variants.map((variant, index) => (
        <AddQuestionVariantForm
          key={variant.id}
          variant={variant}
          index={index}
          onDelete={onDeleteVariant}
          onQuestionTextChange={onVariantQuestionTextChange}
          onQuestionTypeChange={onVariantQuestionTypeChange}
          onOptionChange={onVariantOptionChange}
          onCorrectAnswerChange={onVariantCorrectAnswerChange}
          onExplanationChange={onVariantExplanationChange}
          t={t}
        />
      ))}
    </div>
  );
};

export default AddQuestionVariantsSection;
