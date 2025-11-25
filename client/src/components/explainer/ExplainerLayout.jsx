import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ExplainerSidebar from './ExplainerSidebar';
import Header from '../dashboard/Header';

const ExplainerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <ExplainerSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
          <Header onToggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <Outlet />
          </main>
      </div>
    </div>
  );
};

export default ExplainerLayout;