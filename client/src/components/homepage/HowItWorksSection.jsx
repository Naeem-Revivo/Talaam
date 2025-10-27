import React from 'react';
import { StepCard } from '../reusable';
import { addperson, bookcard } from '../../assets/svg';

const HowItWorksSection = () => {
  return (
    <div className="bg-light-gradient w-full mobile:h-auto tablet:h-auto laptop:h-[558px] mobile:py-12 tablet:py-16 laptop:py-0">
      <div className="w-full mobile:h-auto tablet:h-auto laptop:h-full flex flex-col items-center justify-center mobile:gap-12 tablet:gap-16 laptop:gap-20 mobile:px-4 tablet:px-8 laptop:px-0">
        {/* Header */}
        <div className="text-center flex flex-col items-center justify-center gap-6">
          <h2 className="font-archivo font-bold text-oxford-blue mobile:text-[32px] mobile:leading-[120%] tablet:text-[48px] tablet:leading-[110%] laptop:text-[60px] laptop:leading-[100%] tracking-[0]">
            How Taalam Works
          </h2>
          <p className="font-roboto text-oxford-blue font-normal mobile:text-[16px] mobile:leading-[140%] tablet:text-[18px] tablet:leading-[120%] laptop:text-[20px] laptop:leading-[100%] tracking-[0]">
            Simple steps to exam success
          </p>
        </div>
        
        {/* Steps Cards */}
        <div className="flex mobile:flex-col tablet:flex-col laptop:flex-row justify-center mobile:gap-8 tablet:gap-12 tablet:px-8 laptop:gap-[100px] mobile:w-full tablet:w-full laptop:w-auto">
          <StepCard
            stepNumber="Step 1"
            stepText="text-orange-dark"
            title="Make an Account"
            description="That's it — just sign up."
            iconBgColor="bg-orange-dark"
            icon={
              <img src={addperson} alt="Add Person" />
            }
          />
          
          <StepCard
            stepNumber="Step 2"
            stepText="text-moonstone-blue"
            title="Solve Questions"
            description="Learn by doing questions and reading explanations."
            iconBgColor="bg-moonstone-blue"
            icon={
              <img src={bookcard} alt="Solve Questions" />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
