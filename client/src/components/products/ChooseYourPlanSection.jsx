import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const ChooseYourPlanSection = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isArabic = language === 'ar';

  const features = [
    t('products.choosePlan.features.feature1'),
    t('products.choosePlan.features.feature2'),
    t('products.choosePlan.features.feature3'),
    t('products.choosePlan.features.feature4'),
    t('products.choosePlan.features.feature5'),
    t('products.choosePlan.features.feature6'),
  ];

  const handleSubscribe = () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      localStorage.setItem('redirectAfterLogin', '/moyassar-payment');
      navigate('/login');
    } else {
      navigate('/moyassar-payment');
    }
  };

  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="max-w-[1180px] mx-auto w-full px-4 md:px-8 lg:px-12 2xl:px-0">
        {/* Header */}
        <div className="text-center mb-10 md:mb-[64px]">
          <h2 className="font-archivo font-bold text-text-dark text-[32px] md:text-[44px] lg:text-[48px] leading-[48px] tracking-[-0.96px]">
            {t('products.choosePlan.title')}
          </h2>
          <p className="mt-3 md:mt-4 font-roboto font-normal text-text-gray text-[14px] md:text-[20px] leading-[28px]">
            {t('products.choosePlan.subtitle')}
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-[480px] mx-auto relative">
          {/* "MOST POPULAR" Badge - overlapping top center */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <span className="inline-block bg-[#ED4122] text-white font-archivo font-bold text-[11px] md:text-[14px] leading-[20px] tracking-[0.5px] uppercase px-5 py-2 rounded-full shadow-[0_4px_12px_rgba(237,65,34,0.3)]">
              {t('products.choosePlan.badge')}
            </span>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border-2 border-[#ED4122] shadow-[0_8px_30px_rgba(237,65,34,0.08)] pt-10 pb-8 px-6 md:px-10">
            {/* Plan Name */}
            <h3 className="font-archivo font-bold text-[#0F172A] text-[22px] md:text-[30px] leading-[36px] text-center">
              {t('products.choosePlan.planName')}
            </h3>

            {/* Price */}
            <div className="text-center mt-4 md:mt-5">
              <span className="font-archivo font-bold text-[#ED4122] text-[48px] md:text-[60px] leading-[60px]">
                {t('products.choosePlan.price')}
              </span>
              <span className="font-roboto font-semibold text-[#6CA6C1] text-[18px] md:text-[24px] leading-[32px] ml-2">
                {t('products.choosePlan.currency')}
              </span>
            </div>

            {/* Payment Note */}
            <p className="text-center mb-4 font-roboto font-normal text-[#6CA6C1] text-[12px] md:text-[16px] leading-[24px] tracking-[-0.31px] mt-2">
              {t('products.choosePlan.paymentNote')}
            </p>

            {/* Features List */}
            <div className="flex flex-col gap-4 md:gap-5">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse text-right' : ''}`}
                >
                  {/* Checkmark */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z" fill="#FEF2F0" />
                    <path d="M17.3332 8L9.99984 15.3333L6.6665 12" stroke="#D3341B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <span className="font-roboto font-normal text-[#0F172A] text-base">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Subscribe Button */}
            <button
              onClick={handleSubscribe}
              className="w-full mt-8 md:mt-10 bg-gradient-to-b from-[#ED4122] to-[#FF8B67] hover:opacity-90 transition-opacity text-white rounded-xl h-[50px] md:h-[54px] font-archivo font-bold text-[15px] md:text-[18px] leading-[28px] tracking-[-0.44px] shadow-[0_8px_24px_rgba(237,65,34,0.25)]"
            >
              {t('products.choosePlan.subscribe')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChooseYourPlanSection;
