import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const ContactForm = () => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert(t('contact.contactForm.successAlert'));
    setFormData({ name: '', email: '', message: '' });
  };

  const infoItems = [
    {
      title: t('contact.contactForm.additionalInfo.responseTime.title'),
      description: t('contact.contactForm.additionalInfo.responseTime.description'),
      bgColor: 'bg-[#E0F2FE]',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0369A1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 6V12L16 14" stroke="#0369A1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

      ),
    },
    {
      title: t('contact.contactForm.additionalInfo.businessHours.title'),
      description: t('contact.contactForm.additionalInfo.businessHours.description'),
      bgColor: 'bg-[#FEE2E2]',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 2C9.43223 4.69615 8 8.27674 8 12C8 15.7233 9.43223 19.3038 12 22C14.5678 19.3038 16 15.7233 16 12C16 8.27674 14.5678 4.69615 12 2Z" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M2 12H22" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

      ),
    },
    {
      title: t('contact.contactForm.additionalInfo.location.title'),
      description: t('contact.contactForm.additionalInfo.location.description'),
      bgColor: 'bg-[#D1FAE5]',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 10C20 14.993 14.461 20.193 12.601 21.799C12.4277 21.9293 12.2168 21.9998 12 21.9998C11.7832 21.9998 11.5723 21.9293 11.399 21.799C9.539 20.193 4 14.993 4 10C4 7.87827 4.84285 5.84344 6.34315 4.34315C7.84344 2.84285 9.87827 2 12 2C14.1217 2 16.1566 2.84285 17.6569 4.34315C19.1571 5.84344 20 7.87827 20 10Z" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

      ),
    },
    {
      title: t('contact.contactForm.additionalInfo.qualitySupport.title'),
      description: t('contact.contactForm.additionalInfo.qualitySupport.description'),
      bgColor: 'bg-[#FEF3C7]',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.8006 9.99999C22.2573 12.2413 21.9318 14.5714 20.8785 16.6018C19.8251 18.6322 18.1075 20.24 16.0121 21.1573C13.9167 22.0746 11.5702 22.2458 9.36391 21.6424C7.15758 21.0389 5.2248 19.6974 3.88789 17.8414C2.55097 15.9854 1.89073 13.7272 2.01728 11.4434C2.14382 9.15952 3.04949 6.98808 4.58326 5.29116C6.11703 3.59424 8.18619 2.47442 10.4457 2.11844C12.7052 1.76247 15.0184 2.19185 16.9996 3.33499" stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M9 11L12 14L22 4" stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

      ),
    },
  ];

  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-[96px]">
      <div className="max-w-[1180px] mx-auto w-full px-4 md:px-8 lg:px-12 2xl:px-0">
        <div className={`flex flex-col lg:flex-row gap-10 lg:gap-11 ${isArabic ? 'lg:flex-row-reverse' : ''}`}>

          {/* Left - Form */}
          <div className="w-full lg:w-1/2 max-w-[536px]">
            <h2 className={`font-archivo font-bold text-text-dark text-[24px] md:text-[36px] leading-[40px] tracking-[-0.72px] mb-2 ${isArabic ? 'text-right' : 'text-left'}`}>
              {t('contact.contactForm.title')}
            </h2>
            <p className={`font-roboto text-text-gray font-normal text-[14px] md:text-[18px] leading-[28px] mb-6 md:mb-8 ${isArabic ? 'text-right' : 'text-left'}`}>
              {t('contact.contactForm.subtitle')}
            </p>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border-2 border-[#F3F4F6] shadow-lg shadow-[#0000001A] p-6 md:p-8 flex flex-col gap-5"
            >
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className={`font-archivo font-semibold text-[#032746] text-[13px] md:text-base ${isArabic ? 'text-right' : 'text-left'}`}
                >
                  {t('contact.contactForm.name')} <span className="">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={t('contact.contactForm.namePlaceholder')}
                  className={`w-full h-[44px] md:h-[60px] px-4 text-[14px] bg-white border-2 border-[#E5E7EB] rounded-lg outline-none focus:border-[#ED4122] transition-colors placeholder:text-[#94A3B8] ${isArabic ? 'text-right' : 'text-left'}`}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className={`font-archivo font-semibold text-[#032746] text-[13px] md:text-base ${isArabic ? 'text-right' : 'text-left'}`}
                >
                  {t('contact.contactForm.email')} <span className="">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={t('contact.contactForm.emailPlaceholder')}
                  className={`w-full h-[44px] md:h-[60px] px-4 text-[14px] bg-white border-2 border-[#E5E7EB] rounded-lg outline-none focus:border-[#ED4122] transition-colors placeholder:text-[#94A3B8] ${isArabic ? 'text-right' : 'text-left'}`}
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="message"
                  className={`font-archivo font-semibold text-[#032746] text-[13px] md:text-base ${isArabic ? 'text-right' : 'text-left'}`}
                >
                  {t('contact.contactForm.message')} <span className="">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder={t('contact.contactForm.messagePlaceholder')}
                  className={`w-full px-4 py-3 h-[140px] md:h-[180px] text-[14px] bg-white border-2 border-[#E5E7EB] rounded-lg outline-none focus:border-[#ED4122] transition-colors placeholder:text-[#94A3B8] resize-none ${isArabic ? 'text-right' : 'text-left'}`}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-b from-[#ED4122] to-[#FF6B47] hover:opacity-90 transition-opacity text-white rounded-lg h-[48px] md:h-[68px] px-8 font-archivo font-semibold text-[15px] md:text-[18px] leading-[28px] tracking-[-0.44px] shadow-[0_8px_24px_rgba(237,65,34,0.25)] mt-1"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.3334 1.66667L9.16669 10.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18.3334 1.66667L12.5 18.3333L9.16669 10.8333L1.66669 7.5L18.3334 1.66667Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t('contact.contactForm.button')}
              </button>
            </form>
          </div>

          {/* Right - Additional Information */}
          <div className="w-full lg:w-1/2 max-w-[536px]">
            <h2 className={`font-archivo font-bold text-[#032746] text-[24px] md:text-[30px] leading-[36px] mb-6 md:mb-9 ${isArabic ? 'text-right' : 'text-left'}`}>
              {t('contact.contactForm.additionalInfo.title')}
            </h2>

            <div className="flex flex-col gap-6">
              {infoItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 bg-white rounded-[16px] py-6 pl-6 border-2 border-[#F3F4F6] ${isArabic ? 'flex-row-reverse text-right' : ''}`}
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-[14px] ${item.bgColor} flex items-center justify-center flex-shrink-0`}>
                    {item.icon}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-archivo font-semibold text-[#032746] text-[14px] md:text-[18px] leading-[28px] tracking-[-0.44px]">
                      {item.title}
                    </h3>
                    <p className="mt-1 font-roboto font-normal text-[#6CA6C1] max-w-[336px] text-[14px] md:text-base tracking-[-0.31px]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Privacy Note */}
            <div className={`mt-6 bg-[#F9FAFB] rounded-[16px] py-4 px-6 ${isArabic ? 'text-right' : 'text-left'}`}>
              <p className="font-archivo font-semibold text-[#032746] text-[14px] md:text-base leading-[28px] tracking-[-0.44px] mb-1">
                Privacy Note:
              </p>
              <p className="font-roboto font-normal text-[#6CA6C1] text-[14px] md:text-base leading-[28px] tracking-[-0.31px] italic">
                {t('contact.contactForm.additionalInfo.privacyNote')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
