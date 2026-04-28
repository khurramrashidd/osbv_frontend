import React, { useState, useEffect } from 'react';
import { Menu, Bell, ShieldCheck, Sun, Moon, User, X, CheckCircle } from 'lucide-react';

export default function Header({ toggleSidebar, authUser }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [profileData, setProfileData] = useState({ full_name: '', phone: '', fiduciary_contact: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const getInitials = (name) => {
    if (!name || name.trim().length === 0) return '??';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  useEffect(() => {
    if (isModalOpen && authUser) {
      fetch(`https://osbv-core-engine.onrender.com/api/user/profile?email=${authUser}`)
        .then(res => res.json())
        .then(data => setProfileData(data.profile))
        .catch(err => console.error("Failed to load profile"));
    }
  }, [isModalOpen, authUser]);

  const saveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch('https://osbv-core-engine.onrender.com/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authUser, ...profileData })
      });
      const data = await res.json();
      setSaveMessage(data.message);
      
      // AUTO-CLOSE MODAL AFTER 1.5 SECONDS
      setTimeout(() => {
        setSaveMessage(null);
        setIsModalOpen(false);
      }, 1500);
      
    } catch (err) {
      setSaveMessage("Failed to secure profile. Backend connection failed.");
    }
    setIsSaving(false);
  };

  const currentInitials = getInitials(profileData.full_name);

  return (
    <>
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 md:hidden transition-colors" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <div className="hidden md:flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full text-sm font-semibold border border-green-100 dark:border-green-800 transition-colors">
            <ShieldCheck size={16} />
            <span>System Secure</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-gray-400 hover:text-amber-500 dark:hover:text-blue-400 bg-gray-50 dark:bg-slate-700 rounded-full transition-all">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 relative transition-colors">
            <Bell size={20} />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-800" />
          </button>
          
          <button onClick={() => setIsModalOpen(true)} className="h-9 w-9 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-bold hover:bg-blue-700 transition shadow-md group relative">
            <span className="text-sm font-semibold text-white transition-opacity group-hover:opacity-0">{currentInitials}</span>
            <User size={18} className="absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </header>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in transition-all">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden relative">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <User className="text-blue-500" /> Vault Identity Creation
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={saveProfile} className="p-6 space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg text-sm mb-4 border border-blue-100 dark:border-blue-800/50">
                <strong>Securing identity for decentralized ID:</strong> {authUser}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Legal Name</label>
                <input type="text" required value={profileData.full_name} onChange={(e) => setProfileData({...profileData, full_name: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="e.g., Khurram Rashid" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Secure Phone Number</label>
                <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="+1 (555) 000-0000" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary Fiduciary Email</label>
                <input type="email" value={profileData.fiduciary_contact} onChange={(e) => setProfileData({...profileData, fiduciary_contact: e.target.value})} className="w-full p-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="trusted.contact@email.com" />
              </div>

              {saveMessage && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mt-2 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg border border-green-100 dark:border-green-800">
                  <CheckCircle size={16} /> {saveMessage}
                </div>
              )}

              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-700 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 transition">Cancel</button>
                <button disabled={isSaving} className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md">
                  {isSaving ? "Securing Identity..." : "Save Profile Identity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}