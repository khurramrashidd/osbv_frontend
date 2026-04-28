import React from 'react';
import { LayoutDashboard, Shield, Activity, Users, FileKey, X } from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar, currentView, setView }) {
  const navItems = [
    { id: 'dashboard', name: 'Dashboard & Status', icon: LayoutDashboard },
    { id: 'vault', name: 'Digital Vault (AES)', icon: FileKey },
    { id: 'signals', name: 'Omni-Signals', icon: Activity },
    { id: 'access', name: 'Access Control', icon: Users },
    { id: 'security', name: 'Security & Audit', icon: Shield },
  ];

  const handleNavigation = (id) => {
    setView(id);
    if (window.innerWidth < 768) toggleSidebar();
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm transition-opacity" onClick={toggleSidebar} />}
      <aside className={`fixed inset-y-0 left-0 bg-slate-900 text-slate-300 w-64 z-30 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static border-r border-slate-800`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <span className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
            <Shield className="text-blue-500" size={24} /> OSBV
          </span>
          <button className="md:hidden text-slate-400 hover:text-white transition-colors" onClick={toggleSidebar}><X size={24} /></button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <button 
              key={item.id} onClick={() => handleNavigation(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${currentView === item.id ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white hover:translate-x-1'}`}
            >
              <item.icon size={20} className={currentView === item.id ? 'text-white' : 'text-slate-400'} />
              <span className="font-medium text-sm">{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}