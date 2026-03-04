import React from 'react';
import ContactHeroSection from '../components/contact/ContactHeroSection';
import ContactOptions from '../components/contact/ContactOptions';
import ContactForm from '../components/contact/ContactForm';
import FAQ from '../components/contact/FAQ';
import FollowUs from '../components/contact/FollowUs';

const ContactPage = () => {
  return (
    <div className="">
      <ContactHeroSection />
      <ContactOptions />
      <ContactForm />
      <FAQ />
      <FollowUs />
    </div>
  );
};

export default ContactPage;
