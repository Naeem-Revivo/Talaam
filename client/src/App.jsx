import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import { AppRoutes } from './routes/index.jsx';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <AppRoutes />
      </Layout>
    </Router>
  );
}

export default App
