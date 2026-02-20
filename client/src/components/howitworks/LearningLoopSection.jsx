import React from 'react';
import { loopscard1, loopcard2, loopcard3, loopcard4, loopcard5, rightarrow, downtick } from '../../assets/svg';
import { useLanguage } from '../../context/LanguageContext';

const LearningLoopSection = () => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  const steps = [
    {
      icon: loopscard1,
      title: t('howItWorks.learningLoop.steps.attention.title'),
      description: t('howItWorks.learningLoop.steps.attention.description')
    },
    {
      icon: loopcard2,
      title: t('howItWorks.learningLoop.steps.workingMemory.title'),
      description: t('howItWorks.learningLoop.steps.workingMemory.description')
    },
    {
      icon: loopcard3,
      title: t('howItWorks.learningLoop.steps.encoding.title'),
      description: t('howItWorks.learningLoop.steps.encoding.description')
    },
    {
      icon: loopcard4,
      title: t('howItWorks.learningLoop.steps.consolidation.title'),
      description: t('howItWorks.learningLoop.steps.consolidation.description')
    },
    {
      icon: loopcard5,
      title: t('howItWorks.learningLoop.steps.retrieval.title'),
      description: t('howItWorks.learningLoop.steps.retrieval.description')
    }
  ];

  return (
    <section className="mobile:h-auto tablet:h-auto laptop:h-[613px] w-full flex items-center justify-center mobile:py-8 tablet:py-12 laptop:py-0">
      <div className="max-w-[1180px] mx-auto w-full flex flex-col items-center mobile:gap-5 tablet:gap-5 laptop:gap-8 px-4 md:px-8 lg:px-12 2xl:px-0">
        <div className="text-center flex flex-col mobile:mb-8 tablet:mb-12 laptop:mb-16 gap-4">
          <h2 className="font-archivo font-bold text-text-dark mobile:text-[36px] mobile:leading-[100%] tablet:text-[40px] tablet:leading-[100%] laptop:text-[48px] laptop:leading-[48px] tracking-[-0.96px]">{t('howItWorks.learningLoop.title')}</h2>
          <p className="font-roboto font-normal mobile:text-[14px] mobile:leading-[20px] tablet:text-[18px] tablet:leading-[22px] laptop:text-[20px] laptop:leading-[28px] tracking-[0] text-text-gray">{t('howItWorks.learningLoop.subtitle')}</p>
        </div>

        <div className="flex justify-center mobile:flex-col tablet:flex-col laptop:flex-row mobile:items-center tablet:items-center laptop:items-center  w-full flex-wrap laptop:flex-nowrap">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div
                className={`bg-white border-[2px] relative border-[#F3F4F6] flex flex-col items-center rounded-[16px] text-center flex-shrink-0 mobile:w-[291px] tablet:w-[291px] laptop:w-[160px] xl:w-[208px] mobile:h-[210px] tablet:h-[250px] laptop:h-[252px] mobile:px-4 tablet:px-4 laptop:px-3 mobile:py-5 tablet:py-6 laptop:py-6`}
              >
                {/* Icon - fixed height container so icons align across cards */}
                <div className="h-[80px] w-[80px] tablet:h-[64px] tablet:w-[64px] xl:h-[80px] xl:w-[80px] flex items-center justify-center mb-3 flex-shrink-0">
                  <img src={step.icon} alt={step.title} className="h-[80px] w-[80px] tablet:h-[64px] tablet:w-[64px] xl:h-[80px] xl:w-[80px] object-contain" />
                </div>
                {/* Title - single line */}
                <h3 className="font-archivo font-semibold text-text-dark mobile:text-[16px] tablet:text-[16px] xl:text-[20px] leading-[24px] tracking-[0] whitespace-nowrap mb-2 flex-shrink-0">{step.title}</h3>
                {/* Description - flows naturally, doesn't affect above */}
                <p className="text-text-gray font-roboto font-normal mobile:text-[12px] tablet:text-[13px] laptop:text-[14px] leading-[18px] tracking-[-0.15px] text-center flex-grow">{step.description}</p>
                {index < steps.length - 1 && (
                  <>
                    {/* Down arrow for mobile and tablet */}
                    <div className="absolute -bottom-3 left-16 rotate-90 mobile:block tablet:block laptop:hidden flex-shrink-0 flex items-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z" fill="#ED4122" />
                        <path d="M7.91675 12H16.0834" stroke="white" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M12 7.91663L16.0833 12L12 16.0833" stroke="white" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>

                    </div>
                    {/* Right arrow for laptop - centered vertically */}
                    <div className="absolute top-20 -right-7 hidden laptop:block mx-3.5 flex-shrink-0 self-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z" fill="#ED4122" />
                        <path d="M7.91675 12H16.0834" stroke="white" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M12 7.91663L16.0833 12L12 16.0833" stroke="white" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>

                    </div>
                  </>
                )}
              </div>
              {index < steps.length - 1 && (
                <>
                  {/* Down arrow for mobile and tablet */}
                  <div className="mobile:block tablet:block laptop:hidden flex-shrink-0 self-center bg-[#E5E7EB] w-1 h-12">
                  </div>
                  {/* Right arrow for laptop - centered vertically */}
                  <div className="hidden laptop:block flex-shrink-0 self-center bg-[#E5E7EB] w-6 h-1">
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
