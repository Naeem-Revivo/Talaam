import React from 'react';
import PageHeroSection from '../components/shared/PageHeroSection';
import ContactOptions from '../components/contact/ContactOptions';
import ContactForm from '../components/contact/ContactForm';
import FollowUs from '../components/contact/FollowUs';
import { contactherologo } from '../assets/svg';
import { useLanguage } from '../context/LanguageContext';

const ContactPage = () => {
  const { t } = useLanguage();

  return (
    <div className="">
      <PageHeroSection
        titleParts={[
          { text: t('contact.hero.title1'), colorClass: 'text-oxford-blue', className: 'inline-block' },
          { text: t('contact.hero.title2'), colorClass: 'text-cinnebar-red', className: 'inline-block laptop:pl-3' }
        ]}
        subtitle={t('contact.hero.subtitle')}
        imageSrc={contactherologo}
        imageAlt="Contact us"
        buttons={[]}
        textWidth="lg:w-[656px]"
        paddingTop="lg:pt-40"
        titleLayout="flex"
        imageClassName="w-[352px] h-[231px] md:w-auto md:px-7 laptop:px-0 md:h-auto lg:w-[670px] lg:h-[403px] rounded-[12px]"
      />
      <ContactOptions />
      <ContactForm />
      <FollowUs />
    </div>
  );
};

export default ContactPage;
