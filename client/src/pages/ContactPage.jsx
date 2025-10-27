import React from 'react';
import { 
  HeroSection, 
  ContactOptions,
  ContactForm, 
  FollowUs
} from '../components/contact';

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
