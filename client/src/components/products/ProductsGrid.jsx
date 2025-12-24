import React from 'react';
import { useNavigate } from 'react-router-dom';
import { bookIcon, videoIcon, checkCircleIcon, phoneIcon, check } from '../../assets/svg';
import productsData from '../../data/productsData.json';

const ProductsGrid = () => {
  const navigate = useNavigate();
  const iconMap = {
    bookIcon,
    videoIcon,
    checkCircleIcon,
    phoneIcon
  };

  const products = productsData.map(product => ({
    ...product,
    icon: <img src={iconMap[product.iconName]} alt="" className="w-12 h-12" />
  }));

  const handleSubscribe = (product) => {
    if (product.isMoyassar) {
      // Check if user is logged in
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
        // Store the intended destination in localStorage
        localStorage.setItem('redirectAfterLogin', '/moyassar-payment');
        // Navigate to login
        navigate('/login');
      } else {
        // User is logged in, navigate to Moyassar payment page
        navigate('/moyassar-payment');
      }
    } else {
      // Handle other products
      console.log('Subscribe to:', product.name);
    }
  };

  return (
    <section className="py-20">
      <div className="max-w-[1400px] mx-auto w-full px-4 md:px-8 lg:px-12">
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
                    <div className="text-oxford-blue">
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
                        <img src={check} alt="" className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-oxford-blue hover:bg-[#021f38] text-white px-4 py-2 rounded-md font-medium transition duration-200">
                    Learn More
                  </button>
                  <button 
                    onClick={() => handleSubscribe(product)}
                    className={`flex-1 px-4 py-2 rounded-md font-medium transition duration-200 ${
                      product.popular || product.isMoyassar
                      ? 'bg-gradient-to-r from-[#ED4122] to-[#FF8B67] hover:from-[#d6341f] hover:to-[#e67a5a] text-white' 
                      : 'border border-[#032746] text-oxford-blue hover:bg-oxford-blue hover:text-white'
                    }`}
                  >
                    {product.isMoyassar ? 'Subscribe' : product.popular ? 'Get Started' : 'Try Free'}
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
