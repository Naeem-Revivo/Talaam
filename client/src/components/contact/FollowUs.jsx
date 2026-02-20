import React from 'react';
import { twitters, instagrams, linkedins, youtubes, tiktoks } from '../../assets/svg';
import { useLanguage } from '../../context/LanguageContext';

const FollowUs = () => {
  const { t } = useLanguage();
  return (
    <section className="h-auto py-10 md:py-14 lg:h-[380px] bg-white flex items-center justify-center">
      <div className="max-w-[1180px] mx-auto w-full px-4 md:px-8 lg:px-12 text-center pt-4">
        <h2 className="font-archivo font-bold text-text-dark text-[32px] md:text-[48px] leading-[48px] tracking-[-0.96px] mb-4">
          {t('contact.followUs.title')}
        </h2>
        <p className="font-roboto font-normal text-center text-[14px] md:text-[20px] leading-[28px] text-text-gray mb-4">
          {t('contact.followUs.description')}
        </p>
        <div className="flex justify-center space-x-3">          
          {/* LinkedIn */}
          <a href="#" className="">
            <img src={linkedins} alt="LinkedIn" className="h-[64px] w-[64px]" />
          </a>
          
          {/* YouTube */}
          <a href="#" className="">
            <img src={youtubes} alt="YouTube" className="h-[64px] w-[64px]" />
          </a>
          
          {/* TikTok */}
          <a href="#" className="">
            <img src={tiktoks} alt="TikTok" className="h-[64px] w-[64px]" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FollowUs;
