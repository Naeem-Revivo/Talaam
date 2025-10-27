import React from "react";
import { buttonvedio, logoimg } from "../../assets/svg";

const TahseelyHeroContent = () => {
  return (
    <div className="max-w-full font-archivo h-[603px] mobile:h-auto tablet:h-auto laptop:h-[603px] bg-soft-orange-fade">
      <div className="max-w-full mobile:h-auto tablet:h-auto laptop:h-[648px] flex mobile:flex-col tablet:flex-col laptop:flex-row justify-around mobile:px-4 mobile:py-8 tablet:px-8 laptop:px-[90px] desktop:px-[20px]">
        <div className="mobile:w-full tablet:w-full laptop:w-[656px] flex flex-col gap-6 pt-16 mobile:items-center tablet:items-center laptop:items-start mobile:text-center tablet:text-center laptop:text-left">
          <p className="font-archivo font-bold text-[55px] leading-[70px] tracking-[0%] align-middle text-oxford-blue ">
           <p className="">
           Master the Tahseely Exam with
            </p>
            <p className="font-archivo font-bold text-cinnebar-red text-[55px] leading-[70px] tracking-[0%] align-middle">
              Confidence
            </p>
          </p>
          <p className="font-roboto text-oxford-blue mobile:w-full tablet:w-[600px] laptop:w-[567px] font-normal mobile:text-[14px] mobile:leading-[22px] tablet:text-[16px] tablet:leading-[25.6px] laptop:text-[16px] laptop:leading-[25.6px] tracking-[0] align-middle">
          Master Qudurat and Tahseely with science-backed techniques like
          active recall, spaced repetition, and deliberate practice.
          </p>
          <div className="flex mobile:flex-col tablet:flex-row gap-5 mobile:w-full tablet:w-auto laptop:w-auto mobile:items-center tablet:items-center laptop:items-start">
            <button className="mobile:w-full tablet:w-[164px] laptop:w-[164px] h-[54px] bg-orange-gradient rounded-[12px] mobile:max-w-[280px] text-white">
              Get Started
            </button>
            <button className="mobile:w-full tablet:w-[193px] laptop:w-[193px] h-[54px] font-archivo font-semibold border border-oxford-blue rounded-[12px] text-[14px] leading-[14px] tracking-[0] align-middle uppercase text-oxford-blue mobile:max-w-[280px]">
            <button className="mobile:w-full tablet:w-[193px] laptop:w-[193px] h-[54px] font-archivo font-semibold border border-oxford-blue rounded-[12px] text-[14px] leading-[14px] tracking-[0] align-middle uppercase text-oxford-blue mobile:max-w-[280px]">
                <div className="flex items-center justify-center gap-1">
                <p className="">EXPLORE MORE</p>
                <p className="">
                  <img src={buttonvedio} alt="" className="" />
                </p>
                </div>
              </button>
            </button>
          </div>
        </div>
        <div className="pt-16 ">
          <img
            src={logoimg}
            alt=""
            className="w-[670px] h-[403px]"
          />
        </div>
      </div>
    </div>
  );
};

export default TahseelyHeroContent;
