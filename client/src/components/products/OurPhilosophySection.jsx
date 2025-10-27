import React from 'react';

const OurPhilosophySection = () => {
  const philosophyPoints = [
    {
      id: 1,
      text: "At Taalam, we believe in learning through action. Our approach is simple but powerful: Start a block, answer a question, read the explanation, and move on. This cycle helps you learn faster – and more importantly, retain what you've learned.",
    },
    {
      id: 2,
      text: "Every question is designed to teach, not just test. We focus on the core concepts most commonly seen on the Qudurat exam, so your effort goes where it matters most.",
    },
    {
      id: 3,
      text: "Our platform also uses spaced repetition algorithms to automatically revisit key concepts just before you forget them – improving retention and making sure knowledge sticks.",
    },
  ];

  return (
    <section className="h-auto md:h-[506px] bg-[#C6D8D329] flex items-center justify-center py-12 md:py-0">

      <div className="flex flex-col gap-8 md:gap-16  items-center justify-center px-5 md:px-16 laptop:px-24 w-full max-w-[352px] md:max-w-none">
        <h2 className="font-archivo font-bold text-[36px] md:text-[60px] leading-[100%] tracking-[0] text-center md:text-start">
          Our Philosophy: Learn by Doing
        </h2>

        <div className="space-y-6 md:space-y-8 w-[352px] md:w-full">
          {philosophyPoints.map((point) => (
            <div key={point.id} className="flex items-start space-x-3 md:space-x-4">
              <div className="flex-shrink-0 mt-1">
                <span className="block w-3 h-3 bg-[#E43F21] rounded-full"></span>
              </div>
              <p className="font-roboto font-normal text-[14px] md:text-[18px] leading-[21px] md:leading-[100%] tracking-[0] text-black">
                {point.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPhilosophySection;
