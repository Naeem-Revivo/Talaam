// Helper function to extract option text (handles both string and object formats)
export const getOptionText = (optionValue) => {
  if (!optionValue) return "—";
  if (typeof optionValue === 'string') return optionValue;
  if (typeof optionValue === 'object') {
    // Handle object format like {option: 'A', text: 'Some text'}
    return optionValue.text || optionValue.option || String(optionValue);
  }
  return String(optionValue);
};

// Helper function to extract correct answer letter (handles both string and object formats)
export const getCorrectAnswerLetter = (correctAnswerValue) => {
  if (!correctAnswerValue) return null;
  if (typeof correctAnswerValue === 'string') return correctAnswerValue;
  if (typeof correctAnswerValue === 'object') {
    // Handle object format like {option: 'A', text: 'Some text'}
    return correctAnswerValue.option || correctAnswerValue.text || null;
  }
  return String(correctAnswerValue);
};
