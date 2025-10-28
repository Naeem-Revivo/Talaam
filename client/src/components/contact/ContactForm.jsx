import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const ContactForm = () => {
  const { t } = useLanguage();
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
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert(t('contact.contactForm.successAlert'));
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section className="bg-[#C6D8D329] h-auto py-10 md:py-16 lg:h-[1006px] flex items-center justify-center">
      <div className="flex items-center justify-center w-full px-4 md:px-6 lg:px-0">
        <div className="bg-white w-full md:w-[600px] lg:w-[684px] h-auto lg:h-[706px] rounded-lg shadow-lg p-6 md:p-7 lg:p-8 flex flex-col items-center justify-center gap-6 md:gap-8 lg:gap-10">
          <h2 className="font-archivo font-bold text-[24px] md:text-[28px] lg:text-[30px] leading-[100%] tracking-[0] align-middle text-oxford-blue text-center">
            {t('contact.contactForm.title')}
          </h2>
          <form onSubmit={handleSubmit} className="w-full space-y-6 md:space-y-7 lg:space-y-9 mt-2">
            <div className='flex flex-col gap-2'>
              <label htmlFor="name" className="font-archivo font-normal text-[18px] md:text-[20px] lg:text-[22px] leading-[100%] tracking-[0] text-oxford-blue">
                {t('contact.contactForm.name')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full lg:w-[604px] h-[48px] md:h-[52px] lg:h-[54px] pl-2 text-[16px] md:text-[18px] lg:text-lg bg-[#FEFEFC] border outline-none border-[#E2E2E2] rounded-[8px]"
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="email" className="font-archivo font-normal text-[18px] md:text-[20px] lg:text-[22px] leading-[100%] tracking-[0] text-oxford-blue mb-2">
                {t('contact.contactForm.email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full lg:w-[604px] h-[48px] md:h-[52px] lg:h-[54px] pl-2 text-[16px] md:text-[18px] lg:text-lg bg-[#FEFEFC] border outline-none border-[#E2E2E2] rounded-[8px]"
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="message" className="font-archivo font-normal text-[18px] md:text-[20px] lg:text-[22px] leading-[100%] tracking-[0] text-oxford-blue mb-2">
                {t('contact.contactForm.message')}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full lg:w-[604px] pl-2 text-[16px] md:text-[18px] lg:text-lg bg-[#FEFEFC] border outline-none border-[#E2E2E2] rounded-[8px]"
              />
            </div>
            <button
              type="submit"
              className="text-white rounded-lg bg-orange-gradient w-full lg:w-[604px] h-[48px] md:h-[52px] lg:h-[54px] font-archivo font-medium text-[18px] md:text-[20px] lg:text-[22px] leading-[14px] tracking-[0] align-middle uppercase"
            >
              {t('contact.contactForm.button')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
