import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-grow w-full pt-[97px]">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
