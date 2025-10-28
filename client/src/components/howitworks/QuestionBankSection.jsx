import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const QuestionBankSection = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      title: t('howItWorks.questionBank.features.activeRecall'),
      side: 'left'
    },
    {
      title: t('howItWorks.questionBank.features.desirableDifficulty'),
      side: 'left'
    },
    {
      title: t('howItWorks.questionBank.features.spacedRepetition'),
      side: 'left'
    },
    {
      title: t('howItWorks.questionBank.features.interleaving'),
      side: 'right'
    },
    {
      title: t('howItWorks.questionBank.features.deliberatePractice'),
      side: 'right'
    }
  ];

  const leftFeatures = features.filter(feature => feature.side === 'left');
  const rightFeatures = features.filter(feature => feature.side === 'right');

  return (
    <section className="bg-soft-gradient w-full py-10 md:h-[683px] md:flex md:items-center md:justify-center">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-8 md:gap-16 ">
          <div className="text-center px-5">
            <h2 className="font-archivo font-bold text-[24px] md:text-[40px] leading-[100%] tracking-[0] text-oxford-blue mb-5 w-[352px] md:w-auto">{t('howItWorks.questionBank.title')}</h2>
            <p className="font-roboto font-normal mobile:px-1 text-[16px] md:text-[20px] leading-[100%] tracking-[0] text-oxford-blue">{t('howItWorks.questionBank.subtitle')}</p>
          </div>
          
          <div className="flex flex-col  laptop:flex-row  w-[352px] md:w-auto md:pl-10 laptop:pl-0">
            {/* Left column */}
            <div className="space-y-6 pr-0 md:pr-[80px] w-full">
              {leftFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-[#E43F21] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="font-roboto font-normal w-full md:w-[567px] text-[16px] md:text-[20px] leading-[25.6px] tracking-[0] text-oxford-blue text-start align-middle">{feature.title}</p>
                </div>
              ))}
            </div>
            
            {/* Right column */}
            <div className="space-y-6 pl-0 laptop:pl-[60px] mt-6 md:mt-4 laptop:mt-0 w-full ">
              {rightFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-[#E43F21] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="font-roboto font-normal w-full md:w-[567px] text-[16px] md:text-[20px] text-oxford-blue leading-[25.6px] tracking-[0] text-start align-middle">{feature.title}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Concluding statement */}
          <div className="w-[352px] md:max-w-[942px] h-[125px] md:h-[126px] md:w-full tablet:px-10 laptop:px-0">
            <div className="border-l-4 h-full flex items-center justify-center border-[#ED4122] rounded-lg p-4 md:p-6 bg-white shadow-sm">
              <p className="font-roboto font-medium text-[14px] md:text-[20px] leading-[25.6px] tracking-[0] text-center align-middle text-oxford-blue">
                {t('howItWorks.questionBank.conclusion')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuestionBankSection;
