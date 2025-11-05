import React from 'react';
import HeroSection from '../components/howitworks/HeroSection';
import LearningLoopSection from '../components/howitworks/LearningLoopSection';
import ScienceStrategiesSection from '../components/howitworks/ScienceStrategiesSection';
import TimingMattersSection from '../components/howitworks/TimingMattersSection';
import EffortfulLearningSection from '../components/howitworks/EffortfulLearningSection';
import QuestionBankSection from '../components/howitworks/QuestionBankSection';
import WantToGoDeeperSection from '../components/howitworks/WantToGoDeeperSection';

const HowItWorksPage = () => {
  return (
    <>
      <HeroSection />
      <LearningLoopSection />
      <ScienceStrategiesSection />
      <TimingMattersSection />
      <EffortfulLearningSection />
      <QuestionBankSection />
      <WantToGoDeeperSection />
    </>
  );
};

export default HowItWorksPage;
