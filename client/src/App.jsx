import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import { AppRoutes } from './routes/index.jsx';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <AppRoutes />
        </Layout>
      </Router>
    </LanguageProvider>
  );
}

export default App
