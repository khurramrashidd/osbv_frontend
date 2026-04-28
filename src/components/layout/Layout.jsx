import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

// Receive authUser from App.jsx
export default function Layout({ children, currentView, setView, authUser }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900 text-gray-900 font-sans transition-colors duration-300">
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        currentView={currentView} 
        setView={setView} 
      />
      
      <div className="flex flex-col flex-1 w-full">
        {/* Pass authUser down to the Header component */}
        <Header toggleSidebar={toggleSidebar} authUser={authUser} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        <Footer />
      </div>
      
    </div>
  );
}