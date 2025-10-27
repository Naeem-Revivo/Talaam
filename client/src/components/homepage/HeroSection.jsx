import React from "react";
import { buttonvedio, heropagelogo, herocardimg1, herocardimg2, herocardimg3 } from "../../assets/svg";
import { Card } from "../reusable";

const cardsData = [
  {
    id: 1,
    title: "Learn Smarter",
    description: "Built on science-backed techniques recall, spaced repetition, and deliberate practice.",
    iconSrc: herocardimg1
  },
  {
    id: 2,
    title: "Track Progress",
    description: "Monitor your learning journey with detailed analytics and personalized insights.",
    iconSrc: herocardimg2
  },
  {
    id: 3,
    title: "Achieve Goals",
    description: "Set and reach your academic targets with proven study methods and expert guidance.",
    iconSrc: herocardimg3
  }
];

const HeroSection = () => {
  return (
    <>
      <div className="max-w-full font-archivo h-[996px] mobile:h-auto tablet:h-auto laptop:h-[996px] bg-soft-orange-fade">
        <div className="max-w-full mobile:h-auto tablet:h-auto laptop:h-[648px] flex mobile:flex-col tablet:flex-col laptop:flex-row items-center justify-around mobile:px-4 mobile:py-8 tablet:px-8 tablet:py-12 laptop:px-[90px] desktop:px-[20px]">
          <div className="mobile:w-full tablet:w-full laptop:w-[656px] flex flex-col gap-6 mobile:items-center tablet:items-center laptop:items-start mobile:text-center tablet:text-center laptop:text-left">
            <p className="font-archivo mobile:text-start text-oxford-blue font-bold mobile:text-[32px] mobile:leading-[40px] tablet:text-[48px] tablet:leading-[56px] laptop:text-[80px] laptop:leading-[91px] tracking-[0] align-middle">
              Study Smart. <span className="font-archivo font-bold text-cinnebar-red mobile:text-[32px] mobile:leading-[40px] tablet:text-[48px] tablet:leading-[56px] laptop:text-[80px] laptop:leading-[91px] tracking-[0] align-middle">Ace Any Exam.</span>
            </p>
            <p className="font-roboto mobile:text-start text-oxford-blue mobile:w-full tablet:w-[600px] laptop:w-[507px] font-normal mobile:text-[14px] mobile:leading-[22px] tablet:text-[16px] tablet:leading-[25.6px] laptop:text-[16px] laptop:leading-[25.6px] tracking-[0] align-middle">
              Master Qudurat and Tahseely with science-backed techniques like
              active recall, spaced repetition, and deliberate practice.
            </p>
            <div className="flex  tablet:flex-row gap-5 mobile:w-full tablet:w-auto laptop:w-auto mobile:items-center tablet:items-center laptop:items-start">
              <button className="mobile:w-[140px] mobile:h-[44px] tablet:w-[140px] tablet:h-[44px] laptop:w-[164px] laptop:h-[54px] bg-orange-gradient rounded-[12px] text-white font-archivo font-semibold mobile:text-[12px] mobile:leading-[14px] laptop:text-[14px] laptop:leading-[14px] tracking-[0] align-middle uppercase">
                Get Started
              </button>
              <button className="mobile:w-[156px] mobile:h-[44px] tablet:w-[156px] tablet:h-[44px] laptop:w-[193px] laptop:h-[54px] font-archivo font-semibold border border-oxford-blue rounded-[12px] mobile:text-[12px] mobile:leading-[14px] laptop:text-[14px] laptop:leading-[14px] tracking-[0] align-middle uppercase text-oxford-blue">
                <div className="flex items-center justify-center gap-1">
                <p className="">EXPLORE MORE</p>
                <p className="">
                  <img src={buttonvedio} alt="" className="mobile:w-[18px] mobile:h-[18px] tablet:w-auto tablet:h-auto laptop:w-auto laptop:h-auto" />
                </p>
                </div>
              </button>
            </div>
          </div>
          <div className="mobile:mt-8 tablet:mt-8 laptop:mt-0 mobile:w-full tablet:w-auto laptop:w-auto mobile:flex mobile:justify-center tablet:flex tablet:justify-center laptop:flex laptop:justify-start">
            <img src={heropagelogo} alt="" className="mobile:w-[369px] mobile:h-[347px] tablet:w-[369px] tablet:h-[347px] laptop:w-auto laptop:h-auto" />
          </div>
        </div>
        
        <div className="tablet:h-auto laptop:h-[348px] laptop:pl-10 flex mobile:flex-col tablet:flex-col laptop:flex-row items-center justify-center mobile:gap-6 tablet:gap-8 laptop:gap-9 desktop:gap-6 mobile:p-5 tablet:p-8 laptop:p-8">
          {cardsData.map((card) => (
            <Card
              key={card.id}
              iconSrc={card.iconSrc}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default HeroSection;
