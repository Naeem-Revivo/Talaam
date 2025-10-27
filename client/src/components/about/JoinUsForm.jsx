import React, { useState } from "react";

const JoinUsForm = () => {
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
    <section className="py-10 md:py-16 lg:py-20 h-auto lg:h-[1130px] bg-soft-blue-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12 lg:mb-16 flex flex-col gap-3 md:gap-4 lg:gap-6 pt-4 md:pt-6 lg:pt-8 pb-4 md:pb-6 lg:pb-10">
          <h2 className="font-archivo font-bold text-[28px] md:text-[38px] lg:text-[50px] leading-[110%] md:leading-[100%] lg:leading-[100%] tracking-[0] text-oxford-blue px-4">
            Help us grow
          </h2>
          <p className="font-roboto font-normal text-[16px] md:text-[18px] lg:text-[20px] leading-[130%] md:leading-[120%] lg:leading-[100%] tracking-[0] text-center text-oxford-blue px-4 md:px-8">
            We're always looking for passionate people to join our mission. If
            you believe in helping students learn smarter, apply below.
          </p>
        </div>
      </div>
      <div className="max-w-full md:max-w-[600px] lg:max-w-[684px] mx-auto h-auto lg:h-[711px] shadow-[0px_2px_25px_0px_#0000001A] px-4 md:px-0 lg:px-0">
        <div className="flex justify-center h-full">
          <div className="bg-[#FEFEFC] rounded-lg shadow-xl p-6 md:p-7 lg:p-8 w-full h-full flex flex-col gap-8 md:gap-12 lg:gap-16">
            <h3 className="font-archivo pt-4 md:pt-5 lg:pt-7 font-bold text-[24px] md:text-[28px] lg:text-[30px] leading-[100%] tracking-[0] text-center text-oxford-blue">
              join us
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-7 lg:space-y-9">
              <div className="space-y-2">
                <label className="font-archivo font-normal text-[18px] md:text-[20px] lg:text-[22px] leading-[100%] tracking-[0] text-oxford-blue">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full lg:w-[604px] h-[48px] md:h-[52px] lg:h-[54px] px-4 bg-[#FEFEFC] border border-[#E2E2E2] rounded-[8px] outline-none text-[16px] md:text-[18px]"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="font-archivo font-normal text-[18px] md:text-[20px] lg:text-[22px] leading-[100%] tracking-[0] text-oxford-blue">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full lg:w-[604px] h-[48px] md:h-[52px] lg:h-[54px] px-4 bg-[#FEFEFC] border border-[#E2E2E2] rounded-[8px] outline-none text-[16px] md:text-[18px]"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="font-archivo font-normal text-[18px] md:text-[20px] lg:text-[22px] leading-[100%] tracking-[0] text-oxford-blue">
                  Message
                </label>
                <textarea
                  name="message"
                  placeholder="Why do you want to join us ?"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-[#FEFEFC] border border-[#E2E2E2] placeholder:font-roboto placeholder:font-normal placeholder:text-[16px] md:placeholder:text-[18px] placeholder:leading-[100%] text-[16px] md:text-[18px] placeholder:text-[#6B728080] rounded-[8px] outline-none resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="h-[48px] md:h-[52px] lg:h-[54px] text-white w-full lg:w-[604px] py-3 px-6 rounded-lg bg-orange-gradient font-archivo font-medium text-[18px] md:text-[20px] lg:text-[22px] leading-[14px] tracking-[0] align-middle uppercase"
              >
                APPLY NOW
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinUsForm;
