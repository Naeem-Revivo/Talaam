import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '../locales/en.json';
import arTranslations from '../locales/ar.json';
import profileAPI from '../api/profile';

const LanguageContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState(enTranslations);

  // Load language from localStorage on mount and set document direction
  useEffect(() => {
    const savedLanguage = localStorage.getItem('talaam-language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguage(savedLanguage);
      setTranslations(savedLanguage === 'ar' ? arTranslations : enTranslations);
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLanguage;
    } else {
      // Set default direction to ltr for English
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  }, []);

  const toggleLanguage = async () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
    setTranslations(newLanguage === 'ar' ? arTranslations : enTranslations);
    localStorage.setItem('talaam-language', newLanguage);
    
    // Update document direction for RTL support
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;

    // If user is authenticated, also update the backend profile
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        await profileAPI.updateProfile({ language: newLanguage });
      } catch (error) {
        // Silently fail - don't block language change if API call fails
        console.error('Failed to sync language with backend:', error);
      }
    }
  };

  const changeLanguage = (newLanguage) => {
    if (newLanguage === 'en' || newLanguage === 'ar') {
      setLanguage(newLanguage);
      setTranslations(newLanguage === 'ar' ? arTranslations : enTranslations);
      localStorage.setItem('talaam-language', newLanguage);
      
      // Update document direction for RTL support
      document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLanguage;
    }
  };

  const t = (path, variables = {}) => {
    const keys = path.split('.');
    let result = translations;
    for (const key of keys) {
      result = result?.[key];
      if (!result) return path;
    }
    // Handle variable interpolation (e.g., {{days}})
    if (typeof result === 'string' && variables) {
      Object.keys(variables).forEach(key => {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), variables[key]);
      });
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

