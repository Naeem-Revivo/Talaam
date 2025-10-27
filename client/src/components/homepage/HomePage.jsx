import React from 'react';
import HeroSection from './HeroSection';
import HowItWorksSection from './HowItWorksSection';
import ValuesSection from './ValuesSection';
import CallToActionSection from './CallToActionSection';

const HomePage = () => {
  return (
    <div className="homepage mobile:overflow-x-hidden tablet:overflow-x-hidden laptop:overflow-x-auto">
      <HeroSection />
      <HowItWorksSection />
      <ValuesSection />
      <CallToActionSection />
    </div>
  );
};

export default HomePage;
