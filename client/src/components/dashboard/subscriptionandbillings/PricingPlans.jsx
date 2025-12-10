import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { bookIcon, videoIcon, checkCircleIcon, phoneIcon, check } from "../../../assets/svg";
import productsData from "../../../data/productsData.json";

export default function PricingPlans() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const iconMap = {
    bookIcon,
    videoIcon,
    checkCircleIcon,
    phoneIcon
  };

  // Create Taalam Qudurat Access product from translations
  const quduratFeatures = [
    t('products.choosePlan.features.feature1'),
    t('products.choosePlan.features.feature2'),
    t('products.choosePlan.features.feature3'),
    t('products.choosePlan.features.feature4'),
    t('products.choosePlan.features.feature5'),
    t('products.choosePlan.features.feature6')
  ];

  const quduratProduct = {
    id: 'qudurat',
    name: t('products.choosePlan.planName'),
    description: 'Premium access to Qudurat question bank with smart study tools and performance tracking.',
    features: quduratFeatures,
    price: t('products.choosePlan.price'),
    popular: false,
    iconName: 'checkCircleIcon',
    isQudurat: true
  };

  // Prepare products array with only Qudurat card
  const products = [{
    ...quduratProduct,
    icon: <img src={iconMap[quduratProduct.iconName]} alt="" className="w-12 h-12" />
  }];

  const handleSubscribe = (product) => {
    console.log('Subscribe button clicked for product:', product);
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    console.log('Auth check - token:', !!token, 'user:', !!user);
    
    if (!token || !user) {
      // Store the intended destination in localStorage
      localStorage.setItem('redirectAfterLogin', '/moyassar-payment');
      // Navigate to login
      console.log('User not logged in, redirecting to login');
      navigate('/login');
    } else {
      // User is logged in, navigate to Moyassar payment page in same tab
      console.log('User logged in, navigating to /moyassar-payment');
      navigate('/moyassar-payment');
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-[24px] leading-7 font-semibold text-oxford-blue font-archivo mb-7">
        {t("dashboard.subscriptionBilling.pricingPlans.title")}
      </h2>

      <div className="flex justify-center">
        <div className="w-full max-w-md">
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
                      product.popular || product.isMoyassar || product.isQudurat
                        ? 'bg-gradient-to-r from-[#ED4122] to-[#FF8B67] hover:from-[#d6341f] hover:to-[#e67a5a] text-white' 
                        : 'border border-[#032746] text-oxford-blue hover:bg-oxford-blue hover:text-white'
                    }`}
                  >
                    {product.isMoyassar || product.isQudurat ? 'Subscribe' : product.popular ? 'Get Started' : 'Try Free'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}