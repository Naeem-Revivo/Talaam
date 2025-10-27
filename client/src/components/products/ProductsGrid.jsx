import React from 'react';

const ProductsGrid = () => {
  const products = [
    {
      id: 1,
      name: "Learning Management System",
      description: "Comprehensive platform for managing and delivering educational content with advanced analytics and reporting.",
      features: ["Course Management", "Student Tracking", "Assessment Tools", "Analytics Dashboard"],
      price: "Starting at $99/month",
      popular: true,
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      id: 2,
      name: "Virtual Classroom",
      description: "Interactive online classroom solution with real-time collaboration tools and video conferencing.",
      features: ["Live Streaming", "Screen Sharing", "Interactive Whiteboard", "Breakout Rooms"],
      price: "Starting at $149/month",
      popular: false,
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 3,
      name: "Assessment Platform",
      description: "Advanced testing and assessment platform with AI-powered grading and detailed performance analytics.",
      features: ["Auto Grading", "Plagiarism Detection", "Performance Analytics", "Custom Tests"],
      price: "Starting at $79/month",
      popular: false,
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 4,
      name: "Mobile Learning App",
      description: "Native mobile applications for iOS and Android with offline learning capabilities and push notifications.",
      features: ["Offline Access", "Push Notifications", "Progress Sync", "Mobile Optimized"],
      price: "Starting at $199/month",
      popular: false,
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Solution
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select from our range of powerful educational tools designed to meet your specific needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product) => (
            <div key={product.id} className={`relative bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 hover:shadow-xl ${product.popular ? 'ring-2 ring-[#ED4122]' : ''}`}>
              {product.popular && (
                <div className="absolute top-4 right-4 bg-[#ED4122] text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <div className="text-[#032746]">
                      {product.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-[#ED4122] font-semibold">
                      {product.price}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {product.description}
                </p>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                    Key Features
                  </h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-[#032746] hover:bg-[#021f38] text-white px-4 py-2 rounded-md font-medium transition duration-200">
                    Learn More
                  </button>
                  <button className={`flex-1 px-4 py-2 rounded-md font-medium transition duration-200 ${
                    product.popular 
                      ? 'bg-gradient-to-r from-[#ED4122] to-[#FF8B67] hover:from-[#d6341f] hover:to-[#e67a5a] text-white' 
                      : 'border border-[#032746] text-[#032746] hover:bg-[#032746] hover:text-white'
                  }`}>
                    {product.popular ? 'Get Started' : 'Try Free'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsGrid;
