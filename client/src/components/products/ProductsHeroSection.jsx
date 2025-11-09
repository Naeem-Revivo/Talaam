import React from 'react';
import { logoimg, buttonvedio } from '../../assets/svg';
import { useLanguage } from '../../context/LanguageContext';

const ProductsHeroSection = () => {
  const { t, language } = useLanguage();
  const exploreLabel = t('products.hero.exploreQbank');
  return (
    <div className="max-w-full font-archivo h-[603px] md:h-auto lg:h-[603px] bg-soft-orange-fade">
      <div className="max-w-[1400px] mx-auto w-full md:h-auto lg:h-[648px] flex flex-col md:flex-col lg:flex-row py-8 px-4 md:py-12 md:px-8 lg:px-12 lg:justify-around">
        {/* Text content */}
        <div className={`w-full md:w-full lg:w-[656px] flex flex-col gap-0 md:gap-6 lg:gap-3 pt-0 md:pt-0 lg:pt-8 items-start md:items-center lg:items-start ${language === 'ar' ? 'md:text-center lg:text-right' : 'text-left md:text-center lg:text-left'} order-1 md:order-1 lg:order-1`}>
          <h1 className="leading-[0] md:leading-tight lg:leading-tight font-archivo mb-2 md:mb-2 lg:mb-2">
            <div className="font-bold text-oxford-blue text-[32px] leading-[40px] md:text-[48px] md:leading-[56px] lg:text-[55px] lg:leading-[70px] tracking-[0]">{t('products.hero.title1')}</div>
            <div className="font-bold text-oxford-blue text-[32px] leading-[40px] md:text-[48px] md:leading-[56px] lg:text-[55px] lg:leading-[70px] tracking-[0]">{t('products.hero.title2')}</div>
            <div className="font-bold text-cinnebar-red text-[32px] leading-[40px] md:text-[48px] md:leading-[56px] lg:text-[55px] lg:leading-[70px] tracking-[0]">{t('products.hero.titleHighlight')}</div>
          </h1>
          
          <p className={`font-roboto text-oxford-blue w-full md:w-[600px] lg:w-[567px] font-normal text-[14px] leading-[22px] md:text-[16px] md:leading-[25.6px] lg:text-[16px] lg:leading-[25.6px] tracking-[0] mt-2 md:mt-2 lg:mt-0 ${language === 'ar' ? 'md:text-center lg:text-right' : 'text-left md:text-center lg:text-left'}`}>
            {t('products.hero.subtitle')}
          </p>
          
          <div className="flex md:flex-row gap-5 w-full md:w-auto lg:w-auto items-start md:items-center lg:items-start mt-6 md:mt-6 lg:mt-5">
            <button className="w-[140px] h-[44px] md:w-[140px] md:h-[44px] lg:w-[164px] lg:h-[54px] bg-orange-gradient rounded-[12px] text-white font-archivo font-semibold text-[12px] leading-[14px] md:text-[12px] md:leading-[14px] lg:text-[14px] lg:leading-[14px] tracking-[0] align-middle uppercase">
              {t('products.hero.getStarted')}
            </button>
            <button className="w-[156px] h-[44px] md:w-[156px] md:h-[44px] lg:w-[193px] lg:h-[54px] font-archivo font-semibold border border-oxford-blue rounded-[12px] text-[12px] leading-[14px] md:text-[12px] md:leading-[14px] lg:text-[14px] lg:leading-[14px] tracking-[0] align-middle uppercase text-oxford-blue">
              <div className="flex items-center justify-center gap-1">
                <p className="">{exploreLabel === 'products.hero.exploreQbank' ? 'EXPLORE QBANK' : exploreLabel}</p>
                <p className="">
                  <img src={buttonvedio} alt="" className="w-[18px] h-[18px] md:w-[18px] md:h-[18px] lg:w-auto lg:h-auto" />
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="w-full md:w-auto lg:w-auto flex justify-center md:justify-center lg:justify-start lg:pt-8 mt-8 md:mt-8 lg:mt-0 order-2 md:order-2 lg:order-2">
          <img
            src={logoimg}
            alt=""
            className="w-[352px] h-[231px] md:w-auto md:h-auto lg:w-[670px] lg:h-[403px] rounded-[12px]"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsHeroSection;
