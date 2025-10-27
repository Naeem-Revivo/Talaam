import React from 'react';

const WhoWeAre = () => {
  return (
    <section className="py-10 md:py-16 lg:py-20 bg-light-gradient h-auto lg:h-[426px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <div className="flex flex-col items-center justify-center gap-4 md:gap-6 lg:gap-8">
          <h2 className="font-archivo font-bold text-[32px] md:text-[45px] lg:text-[60px] leading-[100%] tracking-[0] text-oxford-blue text-center px-4">
            Who We Are
          </h2>
          <div className="max-w-4xl mx-auto  md:px-6 laptop:px-0">
            <p className="font-roboto font-normal text-[16px] md:text-[18px] lg:text-[20px] leading-[140%] md:leading-[120%] lg:leading-[100%] tracking-[0] text-center text-black w-full lg:w-[985px] px-4 md:px-6 lg:px-0">
            We are a team of passionate educators, lifelong learners, and innovative technologists.<br/> Our focus is to empower students in Saudi Arabia with smarter ways to prepare for their studies.<br/> We specialize in high-stakes exams like Qudurat, where the right preparation can change futures.<br/> By blending proven learning science with modern technology, we make studying more effective and engaging.<br/> At Taalam, we believe every student deserves the opportunity to learn smarter and achieve their goals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
