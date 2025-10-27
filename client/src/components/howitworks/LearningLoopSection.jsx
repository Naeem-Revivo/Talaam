import React from 'react';
import { loopscard1, loopcard2, loopcard3, loopcard4, loopcard5, rightarrow, downtick } from '../../assets/svg';

const LearningLoopSection = () => {
  const steps = [
    {
      icon: loopscard1, // Graduation cap for Attention
      title: 'Attention',
      description: 'Filters sensory input and selects what enters working memory'
    },
    {
      icon: loopcard2, // Brain for Working Memory
      title: 'Working Memory',
      description: 'Temporarily holds and processes selected info'
    },
    {
      icon: loopcard3, // Document for Encoding
      title: 'Encoding',
      description: 'Transforms what is in the working memory into long-term memory'
    },
    {
      icon: loopcard4, // Open padlock for Consolidation
      title: 'Consolidation',
      description: 'Reinforces and stabilizes long term memory traces over time'
    },
    {
      icon: loopcard5, 
      title: 'Retrieval',
      description: 'Reactivates long-term memories for use'
    }
  ];

  return (
    <section className="mobile:h-auto tablet:h-auto laptop:h-[613px] w-full flex items-center justify-center bg-light-gradient mobile:py-8 tablet:py-12 laptop:py-0">
      <div className="flex flex-col items-center justify-center mobile:gap-5 tablet:gap-5 laptop:gap-8 mobile:w-full tablet:w-auto laptop:w-auto mobile:px-4 tablet:px-0 laptop:px-0">
        <div className="text-center flex flex-col mobile:mb-8 tablet:mb-12 laptop:mb-16 gap-4 tablet:gap-6 laptop:gap-7">
          <h2 className="font-archivo font-bold text-oxford-blue mobile:text-[36px] mobile:leading-[100%] tablet:text-[40px] tablet:leading-[100%] laptop:text-[60px] laptop:leading-[100%] tracking-[0]">The Learning Loop</h2>
          <p className="font-roboto font-normal mobile:text-[14px] mobile:leading-[20px] tablet:text-[18px] tablet:leading-[22px] laptop:text-[20px] laptop:leading-[100%] tracking-[0] text-oxford-blue">Understanding how your brain processes and retains information.</p>
        </div>
        
        <div className="mobile:flex mobile:flex-col tablet:flex-col laptop:flex laptop:flex-row justify-center items-center mobile:gap-4 tablet:gap-4 laptop:gap-0.5">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className={`bg-white flex flex-col items-center justify-center gap-3 rounded-lg p-6 shadow-lg text-center flex-shrink-0 mobile:w-[291px] mobile:h-[210px] tablet:w-[224px] tablet:h-auto laptop:w-[224px] ${index % 2 === 1 ? 'laptop:h-[250px]' : 'laptop:h-[209px]'} mobile:px-6 mobile:py-4 tablet:px-6 tablet:py-6 laptop:px-6 laptop:py-6`}>
                <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <img src={step.icon} alt={step.title} className="w-full h-full object-contain" />
                </div>
                <h3 className="font-archivo font-semibold text-oxford-blue mobile:text-[18px] tablet:text-[20px] laptop:text-[22px] leading-[100%] tracking-[0]">{step.title}</h3>
                <p className="text-oxford-blue font-roboto font-normal mobile:text-[14px] tablet:text-[15px] laptop:text-[16px] leading-[100%] tracking-[0] text-center">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <>
                  {/* Down arrow for mobile and tablet */}
                  <div className="mobile:block tablet:block laptop:hidden flex-shrink-0 my-0">
                    <img src={downtick} alt="arrow" className="w-6 h-6" />
                  </div>
                  {/* Right arrow for laptop */}
                  <div className="hidden laptop:block mx-3.5 flex-shrink-0">
                    <img src={rightarrow} alt="arrow" className="w-6 h-6" />
                  </div>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningLoopSection;
