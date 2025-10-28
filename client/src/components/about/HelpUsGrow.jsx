import React from 'react';

const HelpUsGrow = () => {
  return (
    <section className="py-10 md:py-16 lg:py-20 bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-[28px] md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 px-4">
            Help us grow
          </h2>
          <p className="text-[16px] md:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto px-4">
            We're always looking for passionate people to join our mission. If you believe 
            in helping students learn smarter, apply below.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HelpUsGrow;
