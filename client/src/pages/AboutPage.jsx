import React from 'react';
import WhoWeAre from '../components/about/WhoWeAre';
import OurMission from '../components/about/OurMission';
import WhatMakesUsDifferent from '../components/about/WhatMakesUsDifferent';
import WhyWeStarted from '../components/about/WhyWeStarted';
import HelpUsGrow from '../components/about/HelpUsGrow';
import JoinUsForm from '../components/about/JoinUsForm';
import HeroSection from '../components/about/HeroSection';

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
