import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const WhoWeAre = () => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <section className="w-full bg-[#F9FAFB] py-12 md:py-16 lg:py-20">
      <div className="max-w-[1180px] mx-auto w-full px-4 md:px-8 lg:px-12 2xl:px-0">
        {/* Main container - relative for positioning the Our Mission card */}
        <div className="relative pt-8 md:pt-0">
          {/* Our Mission card - overlapping top-right corner */}
          <div className={`relative md:absolute md:top-[-100px] md:right-[40px] z-10 mb-6 md:mb-0 ${isArabic ? 'md:left-0' : 'md:right-0'}`}>
            <div className="bg-white rounded-2xl border-[2px] border-[#F3F4F6] shadow-[0_8px_30px_rgba(0,0,0,0.06)] px-6 py-5 md:px-7 md:py-6 w-full md:w-[340px] lg:w-[380px]">
              <h3 className={`font-archivo font-bold text-[#0F172A] text-[20px] md:text-[22px] leading-[130%] mb-2 ${isArabic ? 'text-right' : ''}`}>
                {t('about.ourMission.title')}
              </h3>
              <p className={`font-roboto font-normal text-[#64748B] text-[12px] md:text-[13px] leading-[165%] ${isArabic ? 'text-right' : ''}`}>
                {t('about.ourMission.description')}
              </p>
            </div>
          </div>

          {/* Who We Are card */}
          <div className="bg-white rounded-2xl border-[2px] border-[#F3F4F6] shadow-[0_8px_30px_rgba(0,0,0,0.04)] px-6 py-8 md:px-10 md:py-10 lg:px-12 lg:py-12">
            <div className={`flex w-full gap-4 ${isArabic ? 'mr-auto text-right' : 'ml-0'}`}>
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#ED4122] flex items-center justify-center flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 8V14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 11H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              {/* Icon + Title row */}
              <div className={`flex flex-col w-full max-w-[727px] items-start gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                {/* Person icon in orange circle */}
                <h2 className="font-archivo font-bold text-[#0F172A] text-[28px] md:text-[36px] lg:text-[40px] leading-[110%] tracking-[0]">
                  {t('about.whoWeAre.title')}
                </h2>

                <p className="font-roboto font-normal text-text-gray text-[20px] md:text-[20px] leading-[24px]]">
                {t('about.whoWeAre.description')}
              </p>
              </div>

            </div>
          </div>
        </div>

        {/* Divider */}
        {/* <div className="mt-12 md:mt-16 border-t border-[#E5E7EB]"></div> */}
      </div>
    </section>
  );
};

export default WhoWeAre;
