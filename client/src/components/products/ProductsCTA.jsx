import React from 'react';

const ProductsCTA = () => {
  return (
    <section className="py-20 bg-[#032746]">
      <div className="max-w-[1400px] mx-auto w-full px-4 md:px-8 lg:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Transform Your Learning?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Contact our sales team to discuss which product is right for your organization.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-[#ED4122] to-[#FF8B67] hover:from-[#d6341f] hover:to-[#e67a5a] text-white px-8 py-3 rounded-lg font-semibold text-lg transition duration-200 transform hover:scale-105">
            Schedule Demo
          </button>
          <button className="border-2 border-white text-white hover:bg-white hover:text-[#032746] px-8 py-3 rounded-lg font-semibold text-lg transition duration-200">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductsCTA;
