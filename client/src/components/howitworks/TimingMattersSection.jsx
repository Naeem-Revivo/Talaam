import React from 'react';
import { greaterthan, timinggraph } from '../../assets/svg';

const TimingMattersSection = () => {
  return (
    <section className="bg-[#C6D8D329] w-full mobile:py-10 tablet:py-10 tablet:pb-12 h-auto tablet:h-[790px] lg:h-[590px] overflow-hidden md:overflow-visible">
      <div className="">
        <div className="flex flex-col tablet:flex-col  laptop:flex-row md:items-center lg:items-center lg:justify-between px-5   lg:pl-[100px] lg:pr-10">
          {/* Left side - Text content */}
          <div className="flex flex-col gap-3 order-2 md:order-1 tablet:pr-12 laptop:pr-0">
            <h2 className="font-archivo font-bold text-[28px] md:text-[40px] mobile:pt-8 leading-[100%] tracking-[0] text-oxford-blue">Why Timing Matters</h2>
            <h3 className="font-archivo font-semibold text-[26px] md:text-[24px] leading-[100%] tracking-[0] text-oxford-blue pt-2 md:pt-4">Spaced Repetition</h3>
            
            <div className="space-y-3 md:space-y-4">
              <p className="font-roboto font-normal text-[16px] md:text-[16px] leading-[22px] tracking-[0] text-oxford-blue">
                Reviewing information at increasing intervals over time.
              </p>
              <p className="font-roboto font-normal text-[16px] md:text-[16px] leading-[22px] tracking-[0] text-oxford-blue md:w-[580px]">
                The forgetting curve shows how rapidly we lose information without reinforcement. Spaced repetition strategically times reviews just as you're about to forget, strengthening memory traces and dramatically improving retention.
              </p>
            </div>

            {/* Legend and Learn More button */}
            <div className="flex flex-col tablet:flex-row gap-4 mt-3 font-roboto">
              {/* Legend Items */}
              <div className="flex flex-row gap-6 text-oxford-blue items-center">
                <div className="flex items-center space-x-2">
                  <span className="w-[17px] h-[17px] bg-orange-gradient rounded-sm"></span>
                  <span className="text-[14px] md:text-base">Forgetting Curve</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-[17px] h-[17px] bg-blue-gradient rounded-sm"></span>
                  <span className="text-[14px] md:text-base">With Spaced Repetition</span>
                </div>
              </div>
              
              {/* Button */}
              <button className="flex items-center justify-around w-[164px] h-[38px] border text-oxford-blue border-oxford-blue font-archivo font-semibold text-[14px] rounded-[8px] leading-[14px] align-middle uppercase tracking-[0]">
               <div className="">
                LEARN MORE 
                </div> 
                <img src={greaterthan} alt="" className="" />
              </button>
            </div>
          </div>

          {/* Right side - Graph */}
       <div className="order-1 md:order-2 pl-0 md:pl-10 mb-6 tablet:mb-8 laptop:mb-0">
        <div className="w-[352px] h-[275px] overflow-hidden flex-shrink-0 relative tablet:w-[500px] tablet:h-[390px] laptop:h-[466px] laptop:w-[599px] md:overflow-visible">
          <img src={timinggraph} alt="" className="absolute inset-0 w-full h-full object-cover scale-125 tablet:scale-100 md:static md:w-auto md:h-auto md:object-contain" style={{ objectPosition: 'center' }} />
        </div>
       </div>
        </div>
      </div>
    </section>
  );
};

export default TimingMattersSection;
