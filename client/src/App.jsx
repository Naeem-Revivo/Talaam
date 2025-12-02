import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import { AppRoutes } from './routes/index.jsx';
import { ToastContainer } from 'react-toastify';
import { store } from './store/store.js';
import { Provider } from 'react-redux';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isAdmin = location.pathname.startsWith('/admin');
  const isgatherer = location.pathname.startsWith('/gatherer');
  const isprocessor = location.pathname.startsWith('/processor');
  const iscreator = location.pathname.startsWith('/creator');
  const isexplainer = location.pathname.startsWith('/explainer');

  // Don't wrap dashboard routes with the global Layout
  if (isDashboard || isAdmin || isgatherer || isprocessor || iscreator || isexplainer) {
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
        <Provider store={store}>
          <ScrollToTop />
          <AppContent />
        </Provider>
      </LanguageProvider>
    </Router>
  );
}

export default App
