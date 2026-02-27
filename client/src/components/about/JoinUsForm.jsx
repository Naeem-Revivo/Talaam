import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

const JoinUsForm = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  return (
    <section className="py-10 md:py-16 lg:py-20 h-auto lg:h-[1130px] bg-gradient-to-l from-[#FFFFFF] to-[#F0F9FF]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="text-center mb-[64px] flex flex-col gap-3 md:gap-4 lg:gap-6 pt-4 md:pt-6 lg:pt-8 pb-4 md:pb-6 lg:pb-10">
          <h2 className="font-archivo font-bold text-text-dark text-[32px] md:text-[48px] leading-[48px] tracking-[-0.96px] px-4">
            {t('about.joinUs.title')}
          </h2>
          <p className="font-roboto max-w-[700px] mx-auto font-normal text-text-gray text-[14px] md:text-[20px] leading-[28px] text-center px-4 md:px-8 2xl:px-0">
            {t('about.joinUs.subtitle')}
          </p>
        </div>
      </div>
      <div className="max-w-full md:max-w-[600px] lg:max-w-[700px] mx-auto h-auto lg:h-[700px] px-4 md:px-0 lg:px-0">
        <div className="flex justify-center h-full">
          <div className="bg-white rounded-[24px] border-2 overflow-hidden border-[#F3F4F6] shadow-lg shadow-text-dark/50 p-6 md:p-7 lg:p-[42px] w-full h-full flex flex-col gap-8 md:gap-12 lg:gap-[32px]">
            <h3 className="font-archivo pt-4 md:pt-5 lg:pt-7 font-bold text-[24px] md:text-[28px] lg:text-[30px] leading-[36px] tracking-[0] text-center text-oxford-blue">
              {t('about.joinUs.formTitle')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="font-archivo font-semibold text-base tracking-[0] text-text-dark">
                  {t('about.joinUs.name')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full lg:w-[604px] h-[48px] md:h-[52px] lg:h-[54px] px-4 border-2 border-[#E5E7EB] rounded-[14px] outline-none text-[16px] md:text-[18px]"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="font-archivo font-semibold text-base tracking-[0] text-text-dark">
                  {t('about.joinUs.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full lg:w-[604px] h-[48px] md:h-[52px] lg:h-[54px] px-4 border-2 border-[#E5E7EB] rounded-[14px] outline-none text-[16px] md:text-[18px]"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="font-archivo font-semibold text-base tracking-[0] text-text-dark">
                  {t('about.joinUs.message')}
                </label>
                <textarea
                  name="message"
                  placeholder={t('about.joinUs.placeholder')}
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-[14px] outline-none resize-none text-[16px] md:text-[18px]"
                  required
                />
              </div>
              <button
                type="submit"
                className="h-[48px] md:h-[52px] lg:h-[68px] text-white w-full lg:w-[604px] py-3 px-6 rounded-[16px] bg-gradient-to-b from-[#ED4122] to-[#FF8B67] font-archivo font-medium text-[18px] md:text-[20px] lg:text-[22px] leading-[14px] tracking-[0] align-middle uppercase inline-flex items-center justify-center gap-2"
              >
                {t('about.joinUs.button')}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M12 5L19 12L12 19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinUsForm;
