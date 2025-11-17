import React from "react";
import { learningcard1, learningcard2, chevronDownSmall } from "../../assets/svg";
import { useLanguage } from "../../context/LanguageContext";

const EffortfulLearningSection = () => {
  const { t } = useLanguage();

  const strategies = [
    {
      title: t('howItWorks.effortfulLearning.strategies.desirableDifficulty.title'),
      description: t('howItWorks.effortfulLearning.strategies.desirableDifficulty.description'),
      icon: learningcard1,
      iconColor: "bg-orange-500",
    },
    {
      title: t('howItWorks.effortfulLearning.strategies.deliberatePractice.title'),
      description: t('howItWorks.effortfulLearning.strategies.deliberatePractice.description'),
      icon: learningcard2,
      iconColor: "bg-blue-500",
    },
  ];

  return (
    <section className="bg-light-gradient w-full py-10 tablet:h-[650px] laptop:h-[590px] md:flex md:items-center md:justify-center">
      <div className="max-w-[1400px] mx-auto w-full px-4 md:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-center gap-8 md:gap-12">
          <div className="text-center px-5">
            <h2 className="font-archivo font-bold text-[32px] md:text-[48px] lg:text-[60px] leading-[100%] tracking-[0] text-oxford-blue mb-4 w-full md:w-auto text-center">
              {t('howItWorks.effortfulLearning.title')}
            </h2>
            <p className="font-roboto font-normal text-[16px] md:text-[18px] lg:text-[20px] leading-[100%] tracking-[0] text-oxford-blue text-center">
              {t('howItWorks.effortfulLearning.subtitle')}
            </p>
          </div>

          <div className="flex flex-col tablet:flex-col laptop:flex-row items-center justify-center gap-4 tablet:gap-[25px] laptop:gap-28">
            {strategies.map((strategy, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg w-[352px] h-[159px] md:w-[595px] md:h-[202px] flex items-center justify-center"
              >
                <div className="w-full p-4 md:p-6 flex items-center gap-2 md:gap-5 rounded-lg">
                 
                  
                  {/* Text Content */}
                  <div className="flex flex-col gap-1 md:gap-5 flex-1">
                    <div className="flex items-center justify-between px-3">
                      <div className="flex items-center gap-5">
                       {/* Icon */}
                  <div className="flex-shrink-0">
                    <img src={strategy.icon} alt="" className="w-[70px] h-[70px] md:w-auto md:h-auto" />
                  </div>
                      <h3 className="font-archivo font-semibold text-[22px] md:text-[24px] lg:text-[26px] leading-[100%] tracking-[0] text-oxford-blue">
                        {strategy.title}
                      </h3>
                      </div>
                      <div className="md:block hidden">
                        <img 
                          src={chevronDownSmall} 
                          alt=""
                          className="w-5 h-5 text-gray-500"
                        />
                      </div>
                    </div>
                    <p className="font-roboto px-3 font-normal text-[16px] md:text-[18px] leading-[100%] tracking-[0] text-oxford-blue">
                      {strategy.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EffortfulLearningSection;
