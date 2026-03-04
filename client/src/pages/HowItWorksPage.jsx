import React from 'react';
import HowItWorksHeroSection from '../components/howitworks/HowItWorksHeroSection';
import LearningLoopSection from '../components/howitworks/LearningLoopSection';
import ScienceStrategiesSection from '../components/howitworks/ScienceStrategiesSection';
import TimingMattersSection from '../components/howitworks/TimingMattersSection';
import EffortfulLearningSection from '../components/howitworks/EffortfulLearningSection';
import QuestionBankSection from '../components/howitworks/QuestionBankSection';
import WantToGoDeeperSection from '../components/howitworks/WantToGoDeeperSection';
import CallToActionSection from '../components/homepage/CallToActionSection';

const HowItWorksPage = () => {
  return (
    <>
      <HowItWorksHeroSection />
      <LearningLoopSection />
      <ScienceStrategiesSection />
      <TimingMattersSection />
      {/* <EffortfulLearningSection /> */}
      <QuestionBankSection />
      <WantToGoDeeperSection />
      <CallToActionSection />
    </>
  );
};

export default HowItWorksPage;
