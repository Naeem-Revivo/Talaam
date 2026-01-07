import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  fb,
  hamburger,
  instagram,
  linkedin,
  navlogo,
  youtube,
} from "../assets/svg";
import { useLanguage } from "../context/LanguageContext";
import { logout as logoutAction } from "../store/slices/authSlice";
import { showLogoutToast } from "../utils/toastConfig";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [mobileProductsDropdownOpen, setMobileProductsDropdownOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Check authentication status from both localStorage and sessionStorage
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };

    // Check on mount
    checkAuth();

    // Listen for storage changes (in case user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check on location change (in case user navigates after login/logout)
    checkAuth();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logoutAction());
    showLogoutToast(t('toast.message.logoutSuccess') || 'You have been logged out successfully.', {
      title: t('toast.title.logout') || 'Logout Successful',
      isAuth: true
    });
    setTimeout(() => {
      navigate('/login', { replace: true });
    }, 1500);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };
  const getLinkClasses = (path) => {
    const active = isActive(path);
    if (active) {
      return "font-medium text-[18px] leading-[100%] tracking-[0] transition-colors text-[#ED4122]";
    }
    return "font-medium text-[18px] leading-[100%] tracking-[0] transition-colors text-oxford-blue hover:text-[#ED4122]";
  };
  const getMobileLinkClasses = (path) => {
    const active = isActive(path);
    if (active) {
      return "block px-3 py-2 text-lg font-archivo font-medium rounded-md transition-colors text-[#ED4122] bg-orange-light/10";
    }
    return "block px-3 py-2 text-lg font-archivo font-medium rounded-md transition-colors text-oxford-blue hover:bg-gray-50 hover:text-[#ED4122]";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle Tahseely click - redirects to products page
  const handleTahseelyClick = (e) => {
    e.preventDefault();
    navigate('/products');
    setProductsDropdownOpen(false);
    setMobileProductsDropdownOpen(false);
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  // Handle Qudraat click - disabled
  const handleQudraatClick = (e) => {
    e.preventDefault();
    // Optionally, you can show a toast message here
    console.log("Qudraat is coming soon");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md w-full">
      {/* Top Bar with Social Icons */}
      <div className="bg-oxford-blue w-full h-[62px]">
        <div className="max-w-[1400px] mx-auto w-full h-full px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-end h-full gap-4">
          {/* Facebook */}
          <img src={fb} alt="" className="" />
          {/* Instagram */}
          <img src={instagram} alt="" className="" />
          {/* LinkedIn */}
          <img src={linkedin} alt="" className="" />
          {/* YouTube */}
          <img src={youtube} alt="" className="" />
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white h-[84px]">
        <div className="max-w-[1400px] mx-auto w-full h-full px-4 md:px-8 lg:px-12 pt-2">
          <div className="flex justify-between items-center py-[13.5px] h-full">
            {/* Logo Icon */}
            <Link to="/" className="flex items-center">
              <div className="flex items-center justify-center">
                <img src={navlogo} alt="Taalam Logo" className="w-[114px] h-[57px]" />
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className={`hidden font-archivo lg:flex items-center ${language === 'ar' ? 'gap-8' : 'space-x-8'}`}>
            <Link
                to="/"
                className={getLinkClasses("/")}
              >
                {t('navbar.goToApp')}
              </Link>
              <Link
                to="/how-it-works"
                className={getLinkClasses("/how-it-works")}
              >
                {t('navbar.howItWorks')}
              </Link>
              <div 
                className="relative products-nav-item group"
                onMouseEnter={() => setProductsDropdownOpen(true)}
                onMouseLeave={() => setProductsDropdownOpen(false)}
              >
                <button
                  className={`${getLinkClasses("/products")} flex items-center ${language === 'ar' ? 'flex-row-reverse gap-1' : 'gap-0'}`}
                >
                  {t('navbar.products')}
                  <svg 
                    width="24" 
                    height="11" 
                    viewBox="0 0 24 11" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="transition-colors products-arrow"
                  >
                    <path 
                      d="M7 3L12 8L17 3H7Z" 
                      fill={productsDropdownOpen || isActive("/products") ? "#ED4122" : "#032746"}
                      className="transition-colors"
                    />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {productsDropdownOpen && (
                  <div className="absolute top-full left-0 mt-0 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={handleTahseelyClick}
                      className="flex justify-between items-center w-full px-4 py-2 text-left text-oxford-blue hover:bg-gray-50 hover:text-[#ED4122] transition-colors"
                    >
                      <span className="font-medium">Tahseely</span>
                    </button>
                    <button
                      onClick={handleQudraatClick}
                      className="flex justify-between items-center w-full px-4 py-2 text-left text-gray-400 cursor-not-allowed"
                      disabled
                    >
                      <span className="font-medium">Qudurat</span>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">Coming Soon</span>
                    </button>
                  </div>
                )}
              </div>
              <style>{`
                .products-nav-item:hover .products-arrow path {
                  fill: #ED4122 !important;
                }
              `}</style>
              <Link
                to="/about"
                className={getLinkClasses("/about")}
              >
                {t('navbar.about')}
              </Link>
              <Link
                to="/contact"
                className={getLinkClasses("/contact")}
              >
                {t('navbar.contact')}
              </Link>
            </div>

            {/* Right Side - Language Selector, Login, and Menu */}
            <div className={`flex items-center ${language === 'ar' ? 'gap-1 md:gap-3' : 'space-x-2 md:space-x-6'}`}>
              {/* Language Selector */}
              <button 
                onClick={toggleLanguage}
                className="flex items-center justify-around border-[#FF8B6736] rounded-xl border w-[66px] h-[28px] cursor-pointer hover:opacity-80 transition-opacity"
              >
                <span className={`${language === 'en' ? 'bg-gradient-to-r from-orange-dark to-orange-light text-white' : 'text-[#131313]'} w-[35px] h-[24px] text-center items-center justify-center flex rounded-xl text-[10px] font-medium transition-all`}>
                  EN
                </span>
                <span className={`${language === 'ar' ? 'bg-gradient-to-r from-orange-dark to-orange-light text-white' : 'text-[#131313]'} w-[35px] h-[24px] text-center items-center justify-center flex rounded-xl text-[10px] font-medium transition-all`}>
                  عربي
                </span>
              </button>

              {/* Show Logout button if authenticated, otherwise show Login/Signup */}
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="hidden lg:flex bg-cinnebar-red w-[105px] h-[40px] text-white py-2 rounded-md text-xs md:text-sm font-medium text-center items-center justify-center hover:bg-[#d43a1f] transition-colors"
                >
                  {t('navbar.logout')}
                </button>
              ) : (
                <>
                  {/* SIGN UP Button - Desktop only */}
                  <Link 
                    to="/signupfree"
                    className="hidden lg:flex bg-gradient-to-r from-orange-dark to-orange-light w-[105px] h-[40px] text-white  py-2.5 rounded-md text-xs md:text-sm font-medium text-center items-center justify-center"
                  >
                    {t('navbar.signUp')}
                  </Link>

                  {/* Log In Button - Hidden on small screens, shown on large screens */}
                  <Link 
                    to="/login"
                    className="hidden lg:flex bg-gradient-to-r from-blue-dark to-moonstone-blue w-[90px] md:w-[105px] h-[40px] text-white py-2 rounded-md text-xs md:text-sm font-medium text-center items-center justify-center"
                  >
                    {t('navbar.logIn')}
                  </Link>
                </>
              )}

              {/* Hamburger Menu button */}
              <button
                onClick={toggleMenu}
                className="flex items-center lg:hidden"
              >
                <img src={hamburger} alt="Menu" className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 pt-4 pb-6 space-y-4">
            <Link
              to="/how-it-works"
              className={getMobileLinkClasses("/how-it-works")}
              onClick={toggleMenu}
            >
              {t('navbar.howItWorks')}
            </Link>
            
            {/* Mobile Products Dropdown */}
            <div>
              <button
                onClick={() => setMobileProductsDropdownOpen(!mobileProductsDropdownOpen)}
                className="block w-full text-left px-3 py-2 text-lg font-archivo font-medium rounded-md transition-colors text-oxford-blue hover:bg-gray-50 hover:text-[#ED4122]"
              >
                {t('navbar.products')}
              </button>
              
              {mobileProductsDropdownOpen && (
                <div className="pl-4 mt-1 space-y-2">
                  <button
                    onClick={handleTahseelyClick}
                    className="block w-full text-left px-3 py-2 text-base font-archivo font-medium rounded-md transition-colors text-oxford-blue hover:bg-gray-50 hover:text-[#ED4122]"
                  >
                    Tahseely
                  </button>
                  <button
                    onClick={handleQudraatClick}
                    className="flex justify-between items-center w-full px-3 py-2 text-base font-archivo font-medium rounded-md transition-colors text-gray-400 cursor-not-allowed"
                    disabled
                  >
                    <span>Qudurat</span>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">Coming Soon</span>
                  </button>
                </div>
              )}
            </div>
            
            <Link
              to="/about"
              className={getMobileLinkClasses("/about")}
              onClick={toggleMenu}
            >
              {t('navbar.about')}
            </Link>
            <Link
              to="/contact"
              className={getMobileLinkClasses("/contact")}
              onClick={toggleMenu}
            >
              {t('navbar.contact')}
            </Link>
            
            {/* Language Selector in Mobile Menu */}
            <div className="px-3 py-2">
              <button 
                onClick={toggleLanguage}
                className="flex items-center justify-around border-[#FF8B6736] rounded-xl border w-[66px] h-[28px] cursor-pointer hover:opacity-80 transition-opacity"
              >
                <span className={`${language === 'en' ? 'bg-gradient-to-r from-orange-dark to-orange-light text-white' : 'text-[#131313]'} w-[35px] h-[24px] text-center items-center justify-center flex rounded-xl text-[10px] font-medium transition-all`}>
                  EN
                </span>
                <span className={`${language === 'ar' ? 'bg-gradient-to-r from-orange-dark to-orange-light text-white' : 'text-[#131313]'} w-[35px] h-[24px] text-center items-center justify-center flex rounded-xl text-[10px] font-medium transition-all`}>
                  عربي
                </span>
              </button>
            </div>

            {/* Buttons in Mobile Menu */}
            <div className="flex flex-col space-y-2 px-3">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="bg-cinnebar-red text-white px-4 py-2 rounded-md text-sm font-medium text-center hover:bg-[#d43a1f] transition-colors"
                >
                  {t('navbar.logout')}
                </button>
              ) : (
                <>
                  <Link 
                    to="/signupfree"
                    className="bg-gradient-to-r from-orange-dark to-orange-light text-white px-4 py-2 rounded-md text-sm font-medium text-center"
                    onClick={toggleMenu}
                  >
                    {t('navbar.signUp')}
                  </Link>
                  <Link 
                    to="/login"
                    className="bg-gradient-to-r from-blue-dark to-moonstone-blue text-white px-4 py-2 rounded-md text-sm font-medium text-center"
                    onClick={toggleMenu}
                  >
                    {t('navbar.logIn')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;