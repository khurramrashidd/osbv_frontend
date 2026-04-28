import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import DashboardStats from './components/views/DashboardStats';
import SealAsset from './components/views/SealAsset';
import OmniSignals from './components/views/OmniSignals';
import FiduciaryPortal from './components/views/FiduciaryPortal';
import SecurityHub from './components/views/SecurityHub';
import Auth from './components/views/Auth';

export default function App() {
  // Store the logged-in user's email here
  const [authUser, setAuthUser] = useState(null); 
  const [currentView, setCurrentView] = useState('dashboard');

  // Gatekeeper: If no user is logged in, show Auth screen
  if (!authUser) {
    return <Auth setAuth={setAuthUser} />;
  }

  // Routing Logic
  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardStats setView={setCurrentView} />;
      case 'vault': return <SealAsset />;
      case 'signals': return <OmniSignals />;
      case 'access': return <FiduciaryPortal />;
      case 'security': return <SecurityHub />;
      default: return <DashboardStats setView={setCurrentView} />;
    }
  };

  return (
    // Pass authUser down into the Layout wrapper
    <Layout currentView={currentView} setView={setCurrentView} authUser={authUser}>
      <div className="animate-fade-in transition-all duration-300">
        {renderView()}
      </div>
    </Layout>
  );
}