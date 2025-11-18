import React from 'react';
import WhoWeAre from '../components/about/WhoWeAre';
import OurMission from '../components/about/OurMission';
import WhatMakesUsDifferent from '../components/about/WhatMakesUsDifferent';
import WhyWeStarted from '../components/about/WhyWeStarted';
import HelpUsGrow from '../components/about/HelpUsGrow';
import JoinUsForm from '../components/about/JoinUsForm';
import PageHeroSection from '../components/shared/PageHeroSection';
import { aboutherologo, buttonvedio } from '../assets/svg';
import { useLanguage } from '../context/LanguageContext';

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <div className="">
      <PageHeroSection
        titleParts={[
          { text: t('about.hero.title1'), colorClass: 'text-oxford-blue', className: 'inline-block' },
          { text: t('about.hero.title2'), colorClass: 'text-orange-dark', className: 'inline-block laptop:pl-5' }
        ]}
        subtitle={t('about.hero.subtitle')}
        imageSrc={aboutherologo}
        imageAlt="About us"
        buttons={[
          { text: t('about.hero.getStarted'), variant: 'primary' },
          { text: t('about.hero.exploreMore'), variant: 'secondary', icon: buttonvedio }
        ]}
        textWidth="lg:w-[656px]"
        paddingTop="lg:pt-28"
        titleLayout="flex"
        imageClassName="w-[352px] h-[231px] md:w-auto md:px-7 laptop:px-0 md:h-auto lg:w-[670px] lg:h-[403px] rounded-[12px]"
      />
      <WhoWeAre />
      <OurMission />
      <WhatMakesUsDifferent />
      <WhyWeStarted />
      <JoinUsForm />
    </div>
  );
};

export default AboutPage;
