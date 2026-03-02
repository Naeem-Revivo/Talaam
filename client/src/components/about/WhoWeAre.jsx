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
            <div className="bg-[#F9FAFB] rounded-[24px] border-2 border-[#F3F4F6] shadow-[0_8px_30px_rgba(0,0,0,0.06)] px-4 py-6 w-full md:w-[340px] lg:w-[427px]">
              <h3 className={`font-archivo text-center font-semibold text-[#0F172A] text-[20px] md:text-[32px] leading-[45px] mb-4 ${isArabic ? 'text-right' : ''}`}>
                {t('about.ourMission.title')}
              </h3>
              <p className={`font-roboto font-medium text-[#64748B] text-[12px] md:text-[14px] leading-[21px] ${isArabic ? 'text-right' : ''}`}>
                {t('about.ourMission.description')}
              </p>
            </div>
          </div>

          {/* Who We Are card */}
          <div className="bg-white rounded-2xl border-[2px] border-[#F3F4F6] shadow-[0_8px_30px_rgba(0,0,0,0.04)] px-6 py-8 md:px-10 md:py-10 lg:px-12 lg:py-12">
            <div className={`flex w-full gap-4 ${isArabic ? 'mr-auto text-right' : 'ml-0'}`}>
              <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#ED4122] to-[#FF8B67] flex items-center justify-center flex-shrink-0">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M26.6668 35V31.6667C26.6668 29.8986 25.9645 28.2029 24.7142 26.9526C23.464 25.7024 21.7683 25 20.0002 25H10.0002C8.23205 25 6.53636 25.7024 5.28612 26.9526C4.03588 28.2029 3.3335 29.8986 3.3335 31.6667V35M36.6668 35V31.6667C36.6657 30.1895 36.1741 28.7546 35.2691 27.5872C34.3641 26.4198 33.097 25.5859 31.6668 25.2167M26.6668 5.21667C28.1009 5.58384 29.3719 6.41784 30.2796 7.58718C31.1872 8.75653 31.6799 10.1947 31.6799 11.675C31.6799 13.1553 31.1872 14.5935 30.2796 15.7628C29.3719 16.9322 28.1009 17.7662 26.6668 18.1333M21.6668 11.6667C21.6668 15.3486 18.6821 18.3333 15.0002 18.3333C11.3183 18.3333 8.3335 15.3486 8.3335 11.6667C8.3335 7.98477 11.3183 5 15.0002 5C18.6821 5 21.6668 7.98477 21.6668 11.6667Z" stroke="white" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              {/* Icon + Title row */}
              <div className={`flex flex-col w-full max-w-[727px] items-start gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                {/* Person icon in orange circle */}
                <h2 className="font-archivo font-bold text-[#0F172A] text-[28px] md:text-[36px] lg:text-[48px] leading-[48px] tracking-[-0.96px]">
                  {t('about.whoWeAre.title')}
                </h2>

                <p className="font-roboto font-normal text-text-gray text-[20px] leading-[24px]">
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
