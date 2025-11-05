import React from 'react';
import HeroSection from '../components/contact/HeroSection';
import ContactOptions from '../components/contact/ContactOptions';
import ContactForm from '../components/contact/ContactForm';
import FollowUs from '../components/contact/FollowUs';

const ContactPage = () => {
  return (
    <div className="">
      <HeroSection />
      <ContactOptions />
      <ContactForm />
      <FollowUs />
    </div>
  );
};

export default ContactPage;
