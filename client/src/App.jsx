import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import { AppRoutes } from './routes/index.jsx';
import { ToastContainer } from 'react-toastify';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isAdmin = location.pathname.startsWith('/admin');

  // Don't wrap dashboard routes with the global Layout
  if (isDashboard || isAdmin) {
    return <AppRoutes />;
  }

  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <ToastContainer />
      <LanguageProvider>
        <AuthProvider>
          <ScrollToTop />
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App
