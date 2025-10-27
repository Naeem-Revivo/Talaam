import React from 'react';
import {
  WhoWeAre,
  OurMission,
  WhatMakesUsDifferent,
  WhyWeStarted,
  HelpUsGrow,
  JoinUsForm,
  HeroSection
} from '../components/about';

const AboutPage = () => {
  return (
    <div className="">
      <HeroSection />
      <WhoWeAre />
      <OurMission />
      <WhatMakesUsDifferent />
      <WhyWeStarted />
      <JoinUsForm />
    </div>
  );
};

export default AboutPage;
