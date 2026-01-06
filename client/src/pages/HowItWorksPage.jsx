import React from 'react';
import PageHeroSection from '../components/shared/PageHeroSection';
import LearningLoopSection from '../components/howitworks/LearningLoopSection';
import ScienceStrategiesSection from '../components/howitworks/ScienceStrategiesSection';
import TimingMattersSection from '../components/howitworks/TimingMattersSection';
import EffortfulLearningSection from '../components/howitworks/EffortfulLearningSection';
import QuestionBankSection from '../components/howitworks/QuestionBankSection';
import WantToGoDeeperSection from '../components/howitworks/WantToGoDeeperSection';
import { logoimg } from '../assets/svg/howitworks';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const HowItWorksPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <>
      <PageHeroSection
        titleParts={[
          { text: t('howItWorks.hero.title'), colorClass: 'text-oxford-blue' },
          { text: t('howItWorks.hero.titleHighlight'), colorClass: 'text-cinnebar-red' }
        ]}
        subtitle={t('howItWorks.hero.subtitle')}
        imageSrc={logoimg}
        imageAlt="How it works"
        buttons={[
          {
            text: t("homepage.hero.getStarted"),
            onClick: () => navigate("/signupfree") // ✅ redirect to signup
          }
        ]}
        textWidth="lg:w-[507px]"
        paddingTop="lg:pt-20 lg:pl-3"
        imageClassName="w-[382px] h-[231px] tablet:w-[650px] md:h-[403px] lg:w-[670px] lg:h-[403px] rounded-[12px]"
      />
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
