import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import { AppRoutes } from './routes/index.jsx';
import { ToastContainer } from 'react-toastify';
import { store } from './store/store.js';
import { Provider } from 'react-redux';
import './styles/customToast.css';

function AppContent() {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isAdmin = location.pathname.startsWith('/admin');
  const isgatherer = location.pathname.startsWith('/gatherer');
  const isprocessor = location.pathname.startsWith('/processor');
  const iscreator = location.pathname.startsWith('/creator');
  const isexplainer = location.pathname.startsWith('/explainer');
  const isQuestionBanks = location.pathname.startsWith('/question-banks');
  
  // Auth pages that should NOT have header/footer (they use AuthLayout)
  const authPaths = ['/login', '/create-account', '/forgot-password', '/forgot-modal', '/set-new-password', '/password-reset', '/verify-email', '/complete-profile'];
  const isAuthPage = authPaths.includes(location.pathname);

  // Check if user is a student
  const isStudent = isAuthenticated && (user?.role === 'user' || user?.role === 'student');

  // Don't wrap dashboard routes, auth pages, or question-banks (for students) with the global Layout
  if (isDashboard || isAdmin || isgatherer || isprocessor || iscreator || isexplainer || isAuthPage || (isQuestionBanks && isStudent)) {
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
      <ToastContainer icon={false} />
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
