import React from 'react';
import { useNavigate } from 'react-router-dom';
import { brain, rightarrow, orangebrainicon, metericon, restoreicon, aimicon } from '../../assets/svg';
import { useLanguage } from '../../context/LanguageContext';

const ScienceStrategiesSection = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  // Four science-backed methods/cards
  const strategies = [
    {
      id: 'active-recall',
      title: t('howItWorks.scienceStrategies.strategies.activeRecall.title'),
      description: t('howItWorks.scienceStrategies.strategies.activeRecall.description'),
      icon: orangebrainicon,
      bgColor: 'bg-[#FF8B67]',
    },
    {
      id: 'desirable-difficulty',
      title: t('howItWorks.effortfulLearning.strategies.desirableDifficulty.title'),
      description: t('howItWorks.effortfulLearning.strategies.desirableDifficulty.description'),
      icon: metericon,
      bgColor: 'bg-[#032746]',
    },
    {
      id: 'interleaving',
      title: t('howItWorks.scienceStrategies.strategies.interleaving.title'),
      description: t('howItWorks.scienceStrategies.strategies.interleaving.description'),
      icon: restoreicon,
      bgColor: 'bg-[#6CA6C1]',
    },
    {
      id: 'deliberate-practice',
      title: t('howItWorks.effortfulLearning.strategies.deliberatePractice.title'),
      description: t('howItWorks.effortfulLearning.strategies.deliberatePractice.description'),
      icon: aimicon,
      bgColor: 'bg-[#FF8B67]',
    },
  ];

  return (
    <section className="w-full bg-[#F9FAFB] py-12 md:py-16 lg:py-20 flex items-center justify-center">
      <div className="max-w-[1180px] mx-auto w-full px-4 md:px-8 lg:px-12 2xl:px-0">
        {/* Header */}
        <div className="text-center max-w-[720px] mx-auto space-y-4">
          <h2 className="font-archivo font-bold text-text-dark mobile:text-[36px] mobile:leading-[100%] tablet:text-[40px] tablet:leading-[100%] laptop:text-[48px] laptop:leading-[48px] tracking-[-0.96px]">
            {t('howItWorks.scienceStrategies.title')}
          </h2>
          <p className="font-roboto font-normal mobile:text-[14px] mobile:leading-[20px] tablet:text-[18px] tablet:leading-[22px] laptop:text-[20px] laptop:leading-[28px] tracking-[0] text-text-gray">
            {t('howItWorks.scienceStrategies.subtitle')}
          </p>
        </div>

        {/* Cards grid */}
        <div className="mt-10 md:mt-[64px] grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {strategies.map((strategy) => (
            <article
              key={strategy.id}
              className="bg-white rounded-2xl shadow-[0_12px_28px_rgba(16,24,40,0.08)] border border-black/5 px-6 py-6 md:px-8 md:pl-8 md:pr-[64px] flex flex-col gap-4 h-full"
            >
              <div className={`flex items-start gap-4 ${isArabic ? 'flex-row-reverse text-right' : ''}`}>
                {/* Icon */}
                <img
                  src={strategy.icon}
                  alt={strategy.title}
                  className="w-10 h-10 md:w-[64px] md:h-[64px] object-contain flex-shrink-0"
                />

                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-archivo font-bold text-text-dark text-[18px] md:text-[30px] leading-[36px]">
                    {strategy.title}
                  </h3>
                  <p className="mt-2 font-roboto font-normal text-text-gray text-[14px] md:text-[18px] leading-[22px]">
                    {strategy.description}
                  </p>

                  {/* Learn more link */}
                  <button
                    type="button"
                    onClick={() => navigate('/products')}
                    className={`mt-3 inline-flex items-center gap-1 font-roboto text-[13px] md:text-[14px] font-semibold text-orange-dark hover:opacity-80 transition ${
                      isArabic ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <span>{t('howItWorks.scienceStrategies.learnMore')}</span>
                    <img
                      src={rightarrow}
                      alt=""
                      className={`w-3 h-2 md:w-4 md:h-4 ${isArabic ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScienceStrategiesSection;
