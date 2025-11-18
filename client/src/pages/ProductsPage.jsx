import React from "react";
import WhatYouGetSection from "../components/products/WhatYouGetSection";
import OurPhilosophySection from "../components/products/OurPhilosophySection";
import ChooseYourPlanSection from "../components/products/ChooseYourPlanSection";
import ProductsGrid from "../components/products/ProductsGrid";
import FeaturesComparison from "../components/products/FeaturesComparison";
import ProductsCTA from "../components/products/ProductsCTA";
import PageHeroSection from "../components/shared/PageHeroSection";
import HowItWorksSection from "../components/shared/HowItWorksSection";
import { addperson, bookcard, logoimg, buttonvedio } from "../assets/svg";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";

const ProductsPage = () => {
  const { t } = useLanguage();
  const exploreLabel = t("products.hero.exploreQbank");
  const navigate = useNavigate();

  return (
    <div className="bg-light-gradient">
      <PageHeroSection
        titleParts={[
          {
            text: t("products.hero.title1"),
            colorClass: "text-oxford-blue",
            useDiv: true,
          },
          {
            text: t("products.hero.title2"),
            colorClass: "text-oxford-blue",
            useDiv: true,
          },
          {
            text: t("products.hero.titleHighlight"),
            colorClass: "text-cinnebar-red",
            useDiv: true,
          },
        ]}
        subtitle={t("products.hero.subtitle")}
        imageSrc={logoimg}
        imageAlt="Products"
        buttons={[
          {
            text: t("products.hero.getStarted"),
            variant: "primary",
          },
          {
            text:
              exploreLabel === "products.hero.exploreQbank"
                ? "EXPLORE QBANK"
                : exploreLabel,
            variant: "secondary",
            icon: buttonvedio,
            onClick: () => navigate("/question-banks"),
          },
        ]}
        textWidth="lg:w-[656px]"
        paddingTop="lg:pt-8"
      />
      <WhatYouGetSection />
      <OurPhilosophySection />
      <HowItWorksSection
        title={t("products.howItWorks.title")}
        subtitle={t("products.howItWorks.subtitle")}
        backgroundColor="bg-soft-gradient"
        steps={[
          {
            stepNumber: "Step 1",
            stepText: "text-orange-dark",
            title: t("products.howItWorks.step1.title"),
            description: t("products.howItWorks.step1.description"),
            iconBgColor: "bg-orange-dark",
            icon: <img src={addperson} alt="Sign Up" />,
          },
          {
            stepNumber: "Step 2",
            stepText: "text-moonstone-blue",
            title: t("products.howItWorks.step2.title"),
            description: t("products.howItWorks.step2.description"),
            iconBgColor: "bg-moonstone-blue",
            icon: <img src={bookcard} alt="Start Practicing" />,
          },
        ]}
      />
      <ChooseYourPlanSection />
    </div>
  );
};

export default ProductsPage;
