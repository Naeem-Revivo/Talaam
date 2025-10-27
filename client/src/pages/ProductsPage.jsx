import React from 'react';
import {
  WhatYouGetSection,
  OurPhilosophySection,
  ChooseYourPlanSection,
  ProductsGrid,
  FeaturesComparison,
  ProductsCTA,
  ProductsHeroSection
} from '../components/products';
import { HowItWorksSection } from '../components/reusable';
import { addperson, bookcard } from '../assets/svg';

const ProductsPage = () => {
  return (
    <div className="bg-light-gradient">
      <ProductsHeroSection />
      <WhatYouGetSection />
      <OurPhilosophySection />
      <HowItWorksSection 
        title="How It Works: 2 Simple Steps"
        subtitle="Simple steps to exam success"
        backgroundColor="bg-soft-gradient"
        steps={[
          {
            stepNumber: "Step 1",
            stepText: "text-orange-dark",
            title: "Sign Up",
            description: "Create your account and unlock your tools.",
            iconBgColor: "bg-orange-dark",
            icon: <img src={addperson} alt="Sign Up" />
          },
          {
            stepNumber: "Step 2",
            stepText: "text-moonstone-blue", 
            title: "Start Practicing",
            description: "Solve questions, learn from explanations, and track your progress.",
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
