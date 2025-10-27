import React from 'react';

const NewsletterSection = () => {
  return (
    <div className="newsletter-section">
      <h2>Newsletter Section</h2>
      <p>Subscribe to our newsletter</p>
      <div className="newsletter-form">
        <input type="email" placeholder="Enter your email" />
        <button>Subscribe</button>
      </div>
    </div>
  );
};

export default NewsletterSection;
