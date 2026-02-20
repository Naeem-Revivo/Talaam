import React from 'react';
import WhoWeAre from '../components/about/WhoWeAre';
import WhatMakesUsDifferent from '../components/about/WhatMakesUsDifferent';
import WhyWeStarted from '../components/about/WhyWeStarted';
import JoinUsForm from '../components/about/JoinUsForm';
import AboutHeroSection from '../components/about/AboutHeroSection';

const AboutPage = () => {
  return (
    <div className="">
      <AboutHeroSection />
      <WhoWeAre />
      <WhatMakesUsDifferent />
      <WhyWeStarted />
      <JoinUsForm />
    </div>
  );
};

export default AboutPage;
