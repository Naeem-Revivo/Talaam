import React from 'react';
import { tick } from '../../assets/svg';

const ChooseYourPlanSection = () => {
  const features = [
    "Full QBank access (1,000+ questions)",
    "Smart study plan",
    "Science-backed methods built in",
    "Performance tracking",
    "Explanations that actually teach",
    "30-day access from subscription date"
  ];

  return (
    <section className="py-10 md:py-20 bg-soft-blue-green">

      <div className="flex flex-col items-center justify-center gap-10 md:gap-12 lg:gap-14 pt-5 px-5 md:px-0">
        {/* Main Title */}
        <h2 className="font-archivo text-oxford-blue font-bold text-[36px] md:text-[60px] leading-[100%] md:leading-[62.4px] align-middle tracking-[0]">
          Choose Your Plan
        </h2>

        {/* Pricing Card */}
        <div className="bg-white rounded-3xl border border-orange-dark-2 w-[352px] h-[696px] md:w-[490px] md:h-auto lg:h-[780px]">
          {/* Card Header */}
          <div className="px-6 md:px-8 py-4 md:py-6">
            
            
            {/* Price */}
            <div className="py-6 md:py-8 lg:py-10 flex flex-col items-center pt-16 md:pt-16 laptop:pt-24 lg:pt-16 justify-center gap-3 md:gap-4 lg:gap-5">
            <h3 className="font-archivo font-semibold text-[28px] md:text-[30px] leading-[100%] tracking-[0] align-middle text-center w-[306px] md:w-auto">
              Taalam Qudurat Access
            </h3>
              <p className="font-archivo font-semibold text-[30px] md:text-[40px] leading-[100%] tracking-[0] align-middle text-orange-dark-2">
                99 SAR
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-10 laptop:space-y-10 lg:space-y-7 mt-6 md:mt-3 lg:mt-6 px-2 md:px-3 ">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 md:space-x-3 lg:space-x-4">
                  <div className="flex-shrink-0">
                   <img src={tick} alt="" className="w-5 h-5 md:w-auto md:h-auto" />
                  </div>
                  <span className="font-roboto font-normal text-[14px] md:text-[20px] leading-[21px] md:leading-[25.6px] tracking-[0] text-left md:text-left text-oxford-blue">{feature}</span>
                </div>
              ))} 
            </div>

            {/* CTA Button */}
            <div className="text-center mt-1 md:my-7 lg:mt-12 px-2">
              <button className="font-archivo w-full md:w-[390px] h-[50px] bg-orange-gradient rounded-[8px] text-white font-bold text-[12px] leading-[100%] tracking-[0] align-middle uppercase">
                SUBSCRIBE NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChooseYourPlanSection;
