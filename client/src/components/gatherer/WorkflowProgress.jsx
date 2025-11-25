import React from "react";

// WorkflowProgress.jsx
const WorkflowProgress = ({ steps, currentStep }) => {
  return (
    <div className="bg-white px-4 sm:px-8 md:px-12 lg:px-[50px] py-8 sm:py-10 md:py-12 lg:py-[60px] rounded-[12px] border border-[#E5E7EB]">
      <div className="flex flex-col sm:flex-row items-start justify-between w-full gap-6 sm:gap-0">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber <= currentStep;
          return (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center gap-2 sm:gap-3 flex-1 w-full sm:w-auto">
                {/* Circle with check or number */}
                <div
                  className={`w-10 h-10 sm:w-[40px] sm:h-[40px] xl:w-[60px] xl:h-[60px] rounded-full flex items-center justify-center text-base sm:text-lg xl:text-[24px] leading-[100%] font-semibold font-archivo ${
                    isCompleted
                      ? "bg-[#ED4122] text-white"
                      : "bg-[#E5E7EB] text-[#6B7280]"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 xl:w-6 xl:h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                {/* Step label */}
                <span
                  className={`text-xs sm:text-sm xl:text-[18px] leading-[100%] font-archivo font-semibold text-center ${
                    isCompleted ? "text-[#ED4122]" : "text-[#6B7280]"
                  }`}
                >
                  {step}
                </span>
              </div>
              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="hidden sm:flex items-end pt-0 sm:pt-[58px] xl:pt-[76px]">
                  <svg
                    width="20"
                    height="9"
                    viewBox="0 0 31 14"
                    className="sm:w-[20px] sm:h-[9px] xl:w-[31px] xl:h-[14px]"
                    fill={isCompleted ? '#EF4444' : '#E5E7EB'} 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M30.4217 7.25691L24.5892 13.0894C24.4267 13.2519 24.2133 13.3336 24 13.3336C23.7867 13.3336 23.5733 13.2519 23.4108 13.0894C23.085 12.7636 23.085 12.2369 23.4108 11.911L27.8216 7.50023H0.833333C0.3725 7.50023 0 7.1269 0 6.6669C0 6.2069 0.3725 5.83357 0.833333 5.83357H27.8216L23.4108 1.42276C23.085 1.09693 23.085 0.570208 23.4108 0.244375C23.7366 -0.0814583 24.2634 -0.0814583 24.5892 0.244375L30.4217 6.07689C30.4992 6.15439 30.5601 6.246 30.6026 6.3485C30.6867 6.55183 30.6867 6.78197 30.6026 6.9853C30.5601 7.0878 30.4992 7.17941 30.4217 7.25691Z"
                      fill={isCompleted ? '#EF4444' : '#E5E7EB'} 
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
export default WorkflowProgress;
