import React from 'react';
import { brainvedio } from '../../assets/svg';
import { useLanguage } from '../../context/LanguageContext';

const WantToGoDeeperSection = () => {
  const { t } = useLanguage();
  return (
    <section className="bg-soft-blue-green w-full py-10 md:h-[813px] md:flex md:items-center md:justify-center">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-8 md:gap-12">
          <div className="text-center px-5">
            <h2 className="font-archivo font-bold text-[36px] md:text-[50px] text-oxford-blue leading-[100%] tracking-[0] mb-5 w-[352px] md:w-auto">{t('howItWorks.wantToGoDeeper.title')}</h2>
            <p className="font-roboto tablet:px-10 laptop:px-0 font-normal max-w-full md:max-w-[738px] text-[15px] md:text-[20px] leading-[25px] tracking-[0] text-center text-oxford-blue">
              {t('howItWorks.wantToGoDeeper.subtitle')}
            </p>
          </div>
          
          {/* Video Player Placeholder */}
         <div className="w-[352px] h-[240px] md:w-auto md:h-auto">
          <img src={brainvedio} alt="" className="w-full h-full object-cover md:w-auto md:h-auto md:object-contain" />
         </div>
        </div>
      </div>
    </section>
  );
};

export default WantToGoDeeperSection;
