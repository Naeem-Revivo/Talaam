import React from 'react';
import WhatYouGetSection from '../components/products/WhatYouGetSection';
import OurPhilosophySection from '../components/products/OurPhilosophySection';
import ChooseYourPlanSection from '../components/products/ChooseYourPlanSection';
import ProductsGrid from '../components/products/ProductsGrid';
import FeaturesComparison from '../components/products/FeaturesComparison';
import ProductsCTA from '../components/products/ProductsCTA';
import ProductsHeroSection from '../components/products/ProductsHeroSection';
import HowItWorksSection from '../components/reusable/HowItWorksSection';
import { addperson, bookcard } from '../assets/svg';
import { useLanguage } from '../context/LanguageContext';

const ProductsPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-light-gradient">
      <ProductsHeroSection />
      <WhatYouGetSection />
      <OurPhilosophySection />
      <HowItWorksSection 
        title={t('products.howItWorks.title')}
        subtitle={t('products.howItWorks.subtitle')}
        backgroundColor="bg-soft-gradient"
        steps={[
          {
            stepNumber: "Step 1",
            stepText: "text-orange-dark",
            title: t('products.howItWorks.step1.title'),
            description: t('products.howItWorks.step1.description'),
            iconBgColor: "bg-orange-dark",
            icon: <img src={addperson} alt="Sign Up" />
          },
          {
            stepNumber: "Step 2",
            stepText: "text-moonstone-blue", 
            title: t('products.howItWorks.step2.title'),
            description: t('products.howItWorks.step2.description'),
            iconBgColor: "bg-moonstone-blue",
            icon: <img src={bookcard} alt="Start Practicing" />
          }
        ]}
      />
      <ChooseYourPlanSection />
    </div>
  );
};

export default ProductsPage;
