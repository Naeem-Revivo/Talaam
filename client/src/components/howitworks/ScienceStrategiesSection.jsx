import React, { useState } from 'react';
import { brain } from '../../assets/svg';
import { downarrow } from '../../assets/svg/howitworks';
import { useLanguage } from '../../context/LanguageContext';

const ScienceStrategiesSection = () => {
  const { t, language } = useLanguage();
  const [activeStrategy, setActiveStrategy] = useState(null);

  const strategies = [
    {
      id: 'active-recall',
      title: t('howItWorks.scienceStrategies.strategies.activeRecall.title'),
      description: t('howItWorks.scienceStrategies.strategies.activeRecall.description')
    },
    {
      id: 'interleaving',
      title: t('howItWorks.scienceStrategies.strategies.interleaving.title'),
      description: t('howItWorks.scienceStrategies.strategies.interleaving.description')
    }
  ];

  return (
    <section className="bg-[#fffaef] w-full mobile:h-auto laptop:h-[590px] flex items-center justify-center mobile:py-8 laptop:py-0">
      <div className="max-w-[1400px] mx-auto w-full px-4 md:px-8 lg:px-12">
        <div className="mobile:flex mobile:flex-col laptop:flex laptop:flex-row items-center justify-around">
          {/* Left side - Brain Image */}
          <div className="mobile:w-full mobile:max-w-[352px] mobile:mb-6 laptop:w-auto laptop:mb-0">
            <img src={brain} alt="" className="mobile:w-full mobile:h-[275px] laptop:w-[587px] laptop:h-[388px]" />
          </div>
          
          {/* Right side - Text content */}
          <div className="mobile:space-y-6 laptop:space-y-8 mobile:w-full mobile:max-w-[352px] laptop:w-auto">
            <h2 className="font-archivo font-bold mobile:text-[20px] text-center laptop:text-[40px] leading-[100%] tracking-[0] text-oxford-blue mobile:whitespace-nowrap">{t('howItWorks.scienceStrategies.title')}</h2>
            
            <div className="mobile:space-y-3 laptop:space-y-4">
              {strategies.map((strategy) => (
                <div key={strategy.id} className="bg-white rounded-lg mobile:w-full mobile:h-[136px] laptop:w-[580px] laptop:h-[143px] flex items-center justify-center shadow-md border border-gray-100">
                  <button
                    className={`w-full mobile:px-6 mobile:py-4 laptop:px-6 laptop:py-4 rounded-lg ${language === 'ar' ? 'text-right' : 'text-left'}`}
                    onClick={() => setActiveStrategy(activeStrategy === strategy.id ? null : strategy.id)}
                  >
                    <div className='flex flex-col mobile:gap-2 laptop:gap-4'>
                      <div className="flex items-center justify-between">
                        <h3 className="font-archivo font-semibold text-[22px] leading-[100%] tracking-[0] text-oxford-blue">{strategy.title}</h3>
                        <img src={downarrow} alt="down arrow" style={{ width: '12.64px', height: '5.99px' }} />
                      </div>
                      <p className="font-roboto font-normal text-[16px] leading-[21px] tracking-[0] text-oxford-blue">{strategy.description}</p>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScienceStrategiesSection;
