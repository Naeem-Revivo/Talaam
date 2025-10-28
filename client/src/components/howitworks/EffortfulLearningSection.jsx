import React from "react";
import { learningcard1, learningcard2 } from "../../assets/svg";
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
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-8 md:gap-12">
          <div className="text-center px-5">
            <h2 className="font-archivo font-bold text-[36px] md:text-[40px] leading-[100%] tracking-[0] text-oxford-blue mb-4 w-[352px] md:w-auto text-center">
              {t('howItWorks.effortfulLearning.title')}
            </h2>
            <p className="font-roboto font-normal text-[16px] md:text-[20px] leading-[100%] tracking-[0] text-oxford-blue text-center">
              {t('howItWorks.effortfulLearning.subtitle')}
            </p>
          </div>

          <div className="flex flex-col tablet:flex-col laptop:flex-row items-center justify-center gap-4 tablet:gap-[25px] laptop:gap-36">
            {strategies.map((strategy, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg w-[352px] h-[159px] md:w-[595px] md:h-[202px] flex items-center justify-center"
              >
                <div className="w-full p-4 md:p-6 flex items-center gap-3 md:gap-5 rounded-lg">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <img src={strategy.icon} alt="" className="w-[70px] h-[70px] md:w-auto md:h-auto" />
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex flex-col gap-2 md:gap-5 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-archivo font-semibold text-[20px] md:text-[22px] leading-[100%] tracking-[0] text-oxford-blue">
                        {strategy.title}
                      </h3>
                      <div className="md:block hidden">
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="font-roboto font-normal text-[16px] md:text-[16px] leading-[24px] tracking-[0] text-oxford-blue">
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
