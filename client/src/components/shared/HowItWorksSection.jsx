import React from 'react';
import { teamiconorange, playicon } from '../../assets/svg';

const HowItWorksSection = ({ 
  title = "How It Works: 2 Simple Steps",
  subtitle = "Getting started is quick and easy",
  backgroundColor = "bg-light-gradient",
  steps = [
    {
      stepNumber: "1",
      stepText: "text-white",
      title: "Sign Up",
      description: "Create your account and choose your study goals. No credit card required to start.",
      iconBgColor: "bg-orange-dark",
      badgeColor: "bg-[#ED4122]",
      icon: <img src={teamiconorange} alt="Sign Up" />
    },
    {
      stepNumber: "2",
      stepText: "text-white", 
      title: "Start Practicing",
      description: "Jump right into practice sessions with immediate feedback and personalized insights.",
      iconBgColor: "bg-moonstone-blue",
      badgeColor: "bg-[#0F2D46]",
      icon: <img src={playicon} alt="Start Practicing" />
    }
  ]
}) => {
  return (
    <section className={`bg-[#F9FAFB] w-full py-12 md:py-16 lg:py-[96px]`}>
      <div className="max-w-[1180px] mx-auto w-full px-4 md:px-8 lg:px-12 2xl:px-0">
        {/* Header */}
        <div className="text-center mb-10 md:mb-[64px]">
          <h2 className="font-archivo font-bold text-text-dark text-[32px] md:text-[48px] leading-[48px] tracking-[-0.96px]">
            {title}
          </h2>
          <p className="mt-3 md:mt-4 font-roboto font-normal text-text-gray text-[14px] md:text-[20px] leading-[28px]">
            {subtitle}
          </p>
        </div>

        {/* Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
          {steps.map((step, index) => {
            const badgeBg = step.badgeColor || (index === 0 ? 'bg-[#ED4122]' : 'bg-[#0F2D46]');
            const iconBg = step.iconBgColor || (index === 0 ? 'bg-[#FFEEE8]' : 'bg-[#E5F0FF]');

            return (
              <div key={index} className="relative pt-5">
                {/* Step Number Badge - overlapping top-left */}
                <div
                  className={`absolute -top-0 -left-6 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full ${badgeBg} flex items-center justify-center shadow-md`}
                >
                  <span className="font-archivo font-bold text-white text-[18px] md:text-[20px]">
                    {step.stepNumber?.replace('Step ', '') || index + 1}
                  </span>
                </div>

                {/* Card */}
                <div className="bg-white border-[2px] border-[#F3F4F6] rounded-[16px] px-8 py-10 md:px-10 md:py-12 flex flex-col items-center text-center gap-4">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 md:w-[64px] md:h-[64px] rounded-[16px] ${iconBg} flex items-center justify-center`}
                  >
                    <span>
                      {step.icon}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-archivo font-bold text-text-dark text-[22px] md:text-[30px] leading-[36px]">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="font-roboto font-normal text-text-gray text-[13px] md:text-[18px] leading-[30px] max-w-[460px]">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
