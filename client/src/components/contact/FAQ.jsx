import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const FAQ = () => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  const questions = [
    t('contact.faq.questions.q1'),
    t('contact.faq.questions.q2'),
    t('contact.faq.questions.q3'),
    t('contact.faq.questions.q4'),
  ];

  return (
    <section className="w-full bg-[#F9FAFB] py-12 md:py-16 lg:py-[96px]">
      <div className="max-w-[1180px] mx-auto w-full px-4 md:px-8 lg:px-12 2xl:px-0">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-archivo font-bold text-text-dark text-[28px] md:text-[36px] lg:text-[48px] leading-[48px] tracking-[-0.96px]">
            {t('contact.faq.title')}
          </h2>
          <p className="mt-3 font-roboto font-normal text-text-gray text-[14px] md:text-[20px] leading-[28px]">
            {t('contact.faq.subtitle')}
          </p>
        </div>

        {/* Questions List */}
        <div className="max-w-[900px] mx-auto flex flex-col gap-3 md:gap-4">
          {questions.map((question, index) => (
            <div
              key={index}
              className={`flex items-center justify-between bg-white rounded-[16px] p-6 border-2 border-[#F3F4F6] transition-shadow cursor-pointer ${
                isArabic ? 'flex-row-reverse' : ''
              }`}
            >
              <span
                className={`font-archivo font-semibold text-[#032746] text-[14px] md:text-[18px] leading-[28px] tracking-[-0.44px] ${
                  isArabic ? 'text-right' : 'text-left'
                }`}
              >
                {question}
              </span>

              {/* Arrow icon */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-4">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={isArabic ? 'rotate-180' : ''}
                >
                  <path
                    d="M4.16699 10H15.8337"
                    stroke="#6CA6C1"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 4.16667L15.8333 10L10 15.8333"
                    stroke="#6CA6C1"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
