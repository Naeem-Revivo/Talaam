import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '../locales/en.json';
import arTranslations from '../locales/ar.json';

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

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
    setTranslations(newLanguage === 'ar' ? arTranslations : enTranslations);
    localStorage.setItem('talaam-language', newLanguage);
    
    // Update document direction for RTL support
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
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
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

