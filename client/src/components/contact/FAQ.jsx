import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const FAQ = () => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';
  const [openIndex, setOpenIndex] = useState(null);

  const faqItems = [
    {
      question: t('contact.faq.questions.q1'),
      answer: t('contact.faq.answers.a1') || 'We typically respond within 24 hours during business days. For urgent matters, please contact us via WhatsApp for faster response.',
    },
    {
      question: t('contact.faq.questions.q2'),
      answer: t('contact.faq.answers.a2') || 'Please include your name, email address, and a detailed description of your question or issue. The more information you provide, the better we can assist you.',
    },
    {
      question: t('contact.faq.questions.q3'),
      answer: t('contact.faq.answers.a3') || 'Currently, we offer support via email and WhatsApp. Phone support may be available for premium members - please contact us for more information.',
    },
    {
      question: t('contact.faq.questions.q4'),
      answer: t('contact.faq.answers.a4') || 'Yes! We provide full support in both Arabic and English. You can contact us in whichever language you prefer, and our team will respond accordingly.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div
                key={index}
                className={`bg-white rounded-[16px] border-2 transition-all duration-300 ${
                  isOpen ? 'border-[#6CA6C1] shadow-md' : 'border-[#F3F4F6]'
                }`}
              >
                {/* Question Header */}
                <div
                  onClick={() => toggleFAQ(index)}
                  className={`flex items-center justify-between p-6 cursor-pointer ${
                    isArabic ? 'flex-row-reverse' : ''
                  }`}
                >
                  <span
                    className={`font-archivo font-semibold text-[#032746] text-[14px] md:text-[18px] leading-[28px] tracking-[-0.44px] flex-1 ${
                      isArabic ? 'text-right' : 'text-left'
                    }`}
                  >
                    {item.question}
                  </span>

                  {/* Arrow icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                    isArabic ? 'mr-4' : 'ml-4'
                  } ${isOpen ? 'rotate-90' : ''}`}>
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

                {/* Answer Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className={`px-6 pb-6 ${isArabic ? 'text-right' : 'text-left'}`}>
                    <p className="font-roboto font-normal text-[#525252] text-[14px] md:text-[16px] leading-[24px]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
