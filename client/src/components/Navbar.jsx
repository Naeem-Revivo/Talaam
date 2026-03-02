import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  hamburger,
  navlogo,
} from "../assets/svg";
import { useLanguage } from "../context/LanguageContext";
import { logout as logoutAction } from "../store/slices/authSlice";
import { showLogoutToast } from "../utils/toastConfig";
import profileAPI from "../api/profile";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [mobileProductsDropdownOpen, setMobileProductsDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [mobileLanguageDropdownOpen, setMobileLanguageDropdownOpen] = useState(false);
  const { language, changeLanguage, t } = useLanguage();
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

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownOpen && !event.target.closest('.language-dropdown-container')) {
        setLanguageDropdownOpen(false);
      }
      if (mobileLanguageDropdownOpen && !event.target.closest('.mobile-language-dropdown-container')) {
        setMobileLanguageDropdownOpen(false);
      }
    };

    if (languageDropdownOpen || mobileLanguageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [languageDropdownOpen, mobileLanguageDropdownOpen]);

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
      return "font-medium text-base tracking-[0] transition-colors text-[#DC2626]";
    }
    return "font-medium text-base tracking-[0] transition-colors text-[#475569] hover:text-[#DC2626]";
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

  // Handle language selection
  const handleLanguageSelect = async (langCode) => {
    // Only allow 'en' and 'ar' for now (LanguageContext limitation)
    if (langCode !== 'en' && langCode !== 'ar') {
      return;
    }

    changeLanguage(langCode);
    setLanguageDropdownOpen(false);
    setMobileLanguageDropdownOpen(false);

    // Sync with backend if authenticated
    const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (authToken) {
      try {
        await profileAPI.updateProfile({ language: langCode });
      } catch (error) {
        // Silently fail - don't block language change if API call fails
        console.error('Failed to sync language with backend:', error);
      }
    }
  };

  // Language options
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ar', name: 'Arabic', nativeName: 'عربي' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md shadow-[#173B501A] w-full">
      {/* Main Navigation Bar */}
      <div className="bg-white h-[97px]">
        <div className="max-w-[1180px] mx-auto w-full h-full px-4 md:px-8 lg:px-12 2xl:px-0 pt-2">
          <div className="flex justify-between items-center py-[13.5px] h-full">
            {/* Logo Icon */}
            <Link to="/" className="flex items-center">
              <div className="flex items-center justify-center">
                <img src={navlogo} alt="Taalam Logo" className="w-[97px] h-[80px]" />
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
            <div className={`flex items-center ${language === 'ar' ? 'gap-1 md:gap-3' : 'space-x-2 md:space-x-3'}`}>

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
                  {/* Log In Button - Hidden on small screens, shown on large screens */}
                  <Link
                    to="/login"
                    className="hidden font-roboto lg:flex text-text-dark text-lg font-medium tracking-[-0.44px] text-center items-center justify-center"
                  >
                    {t('navbar.logIn')}
                  </Link>
                  {/* SIGN UP Button - Desktop only */}
                  <Link
                    to="/create-account"
                    className="hidden lg:flex bg-gradient-to-r from-blue-dark to-blue-light w-[127px] h-[44px] text-white rounded-[12px] text-base font-semibold tracking-[-0.31px] text-center items-center justify-center"
                  >
                    {t('navbar.signUp')}
                  </Link>
                </>
              )}

              <div className="relative language-dropdown-container">
                <button
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  className="flex items-center justify-center w-[50px] h-[40px] rounded-[10px] bg-[#F3F4F6] transition-colors cursor-pointer"
                  aria-label="Select language"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_30_172)">
                      <path d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z" stroke="#A3A4A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M9 1.5C7.07418 3.52212 6 6.20756 6 9C6 11.7924 7.07418 14.4779 9 16.5C10.9258 14.4779 12 11.7924 12 9C12 6.20756 10.9258 3.52212 9 1.5Z" stroke="#A3A4A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M1.5 9H16.5" stroke="#A3A4A6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                    <defs>
                      <clipPath id="clip0_30_172">
                        <rect width="18" height="18" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                </button>

                {/* Language Dropdown Menu */}
                {languageDropdownOpen && (
                  <div className={`absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 ${language === 'ar' ? 'left-0' : 'right-0'}`}>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageSelect(lang.code)}
                        className={`w-full flex items-center justify-between px-4 py-2 text-left hover:bg-gray-50 transition-colors ${language === lang.code ? 'text-blue-600' : 'text-gray-700'
                          }`}
                      >
                        <span className="font-medium">{lang.nativeName}</span>
                        {language === lang.code && (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-blue-600"
                          >
                            <path
                              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                              fill="currentColor"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

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
              <div className="relative mobile-language-dropdown-container">
                <button
                  onClick={() => setMobileLanguageDropdownOpen(!mobileLanguageDropdownOpen)}
                  className="flex items-center justify-center w-[28px] h-[28px] rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                  aria-label="Select language"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-600"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                      fill="currentColor"
                    />
                  </svg>
                </button>

                {/* Mobile Language Dropdown Menu */}
                {mobileLanguageDropdownOpen && (
                  <div className={`absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 ${language === 'ar' ? 'right-0' : 'left-0'}`}>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageSelect(lang.code)}
                        className={`w-full flex items-center justify-between px-4 py-2 text-left hover:bg-gray-50 transition-colors ${language === lang.code ? 'text-blue-600' : 'text-gray-700'
                          }`}
                      >
                        <span className="font-medium">{lang.nativeName}</span>
                        {language === lang.code && (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-blue-600"
                          >
                            <path
                              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                              fill="currentColor"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
                    to="/create-account"
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