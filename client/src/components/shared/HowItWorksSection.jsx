import React from 'react';
import StepCard from './StepCard';
import { addperson, bookcard } from '../../assets/svg';

const HowItWorksSection = ({ 
  title = "How It Works: 2 Simple Steps",
  subtitle = "Simple steps to exam success",
  backgroundColor = "bg-light-gradient",
  steps = [
    {
      stepNumber: "Step 1",
      stepText: "text-orange-dark",
      title: "Sign Up",
      description: "Create your account and unlock your tools.",
      iconBgColor: "bg-orange-dark",
      icon: <img src={addperson} alt="Sign Up" />
    },
    {
      stepNumber: "Step 2",
      stepText: "text-moonstone-blue", 
      title: "Start Practicing",
      description: "Solve questions, learn from explanations, and track your progress.",
      iconBgColor: "bg-moonstone-blue",
      icon: <img src={bookcard} alt="Start Practicing" />
    }
  ]
}) => {
  return (
    <div className={`${backgroundColor} w-full mobile:h-auto tablet:h-auto laptop:h-[558px] mobile:py-12 tablet:py-16 laptop:py-0`}>
      <div className="w-full mobile:h-auto tablet:h-auto laptop:h-full flex flex-col items-center justify-center mobile:gap-12 tablet:gap-16 laptop:gap-12 mobile:px-4 tablet:px-8 laptop:px-0">
        {/* Header */}
        <div className="text-center flex flex-col items-center justify-center gap-6">
          <h2 className="font-archivo font-bold text-oxford-blue mobile:text-[32px] mobile:leading-[120%] tablet:text-[44px] tablet:leading-[110%] laptop:text-[48px] laptop:leading-[100%] tracking-[0]">
            {title}
          </h2>
          <p className="font-roboto text-oxford-blue font-normal mobile:text-[16px] mobile:leading-[140%] tablet:text-[18px] tablet:leading-[120%] laptop:text-[20px] laptop:leading-[100%] tracking-[0]">
            {subtitle}
          </p>
        </div>
        
        {/* Steps Cards */}
        <div className="flex mobile:flex-col tablet:flex-col laptop:flex-row justify-center mobile:gap-8 tablet:gap-12 tablet:px-7 laptop:px-0 laptop:gap-[120px] laptop:pl-2 mobile:w-full tablet:w-full laptop:w-auto">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              stepNumber={step.stepNumber}
              stepText={step.stepText}
              title={step.title}
              description={step.description}
              iconBgColor={step.iconBgColor}
              icon={step.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
