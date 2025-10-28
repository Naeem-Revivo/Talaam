import React from 'react';
import { twitters, instagrams, linkedins, youtubes, tiktoks } from '../../assets/svg';
import { useLanguage } from '../../context/LanguageContext';

const FollowUs = () => {
  const { t } = useLanguage();
  return (
    <section className="h-auto py-10 md:py-14 lg:h-[380px] bg-soft-blue-green flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-4">
        <h2 className="font-archivo font-bold text-[32px] md:text-[45px] lg:text-[60px] leading-[100%] tracking-[0] text-oxford-blue mb-4 md:mb-5">
          {t('contact.followUs.title')}
        </h2>
        <div className="flex justify-center space-x-3 mb-6 md:mb-8">
          {/* Twitter */}
          <a href="#" className="">
            <img src={twitters} alt="Twitter" className="" />
          </a>
          
          {/* Instagram */}
          <a href="#" className="">
            <img src={instagrams} alt="Instagram" className="" />
          </a>
          
          {/* LinkedIn */}
          <a href="#" className="">
            <img src={linkedins} alt="LinkedIn" className="" />
          </a>
          
          {/* YouTube */}
          <a href="#" className="">
            <img src={youtubes} alt="YouTube" className="" />
          </a>
          
          {/* TikTok */}
          <a href="#" className="">
            <img src={tiktoks} alt="TikTok" className="" />
          </a>
        </div>
        <p className="font-archivo font-normal text-center text-[16px] md:text-[17px] lg:text-[18px] leading-[130%] md:leading-[120%] lg:leading-[100%] tracking-[0] text-oxford-blue px-4">
          {t('contact.followUs.description')}
        </p>
      </div>
    </section>
  );
};

export default FollowUs;
