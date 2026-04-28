import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Lock, Activity, Clock, RefreshCw, AlertTriangle } from 'lucide-react';

export default function DashboardStats({ setView }) {
  const [sysState, setSysState] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Poll the backend state every second to keep the timer visually ticking
  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch('https://osbv-core-engine.onrender.com/api/system/state');
        const data = await res.json();
        setSysState(data);
      } catch (err) {
        console.error("Backend offline");
      }
    };

    fetchState();
    const interval = setInterval(fetchState, 1000);
    return () => clearInterval(interval);
  }, []);

  const simulateHeartbeat = async () => {
    setIsRefreshing(true);
    await fetch('https://osbv-core-engine.onrender.com/api/signals/simulate_activity', { method: 'POST' });
    setIsRefreshing(false);
  };

  const triggerHoneypot = async () => {
    await fetch('https://osbv-core-engine.onrender.com/api/security/honeypot_trigger', { method: 'POST' });
  };

  if (!sysState) return <div className="p-8 text-center text-gray-500 animate-pulse">Connecting to OSBV Core Engine...</div>;

  // Determine UI Colors based on State Machine
  let statusColor = "bg-green-100 text-green-800 border-green-200";
  let icon = <Shield className="text-green-600" size={32} />;
  
  if (sysState.status === 'Escalation') {
    statusColor = "bg-yellow-100 text-yellow-800 border-yellow-200";
    icon = <AlertTriangle className="text-yellow-600" size={32} />;
  } else if (sysState.status === 'Lockdown' || sysState.status === 'Recovery') {
    statusColor = "bg-red-100 text-red-800 border-red-200";
    icon = <ShieldAlert className="text-red-600" size={32} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Primary Status Header */}
      <header className={`flex flex-col md:flex-row justify-between items-center p-6 rounded-2xl shadow-sm border ${statusColor} transition-colors duration-500`}>
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          {icon}
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-wider">System State: {sysState.status}</h1>
            <p className="text-sm font-medium opacity-80">
              Last Activity: {sysState.last_activity_date} ({sysState.days_since} days ago)
            </p>
          </div>
        </div>
        
        {/* The Granular TTL Countdown Timer */}
        <div className="text-right bg-white/50 dark:bg-black/20 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-3 text-3xl font-black font-mono">
            <Clock size={24} className="opacity-70" />
            <span>{String(sysState.countdown.days).padStart(2, '0')}</span>:
            <span>{String(sysState.countdown.hours).padStart(2, '0')}</span>:
            <span>{String(sysState.countdown.minutes).padStart(2, '0')}</span>:
            <span>{String(sysState.countdown.seconds).padStart(2, '0')}</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest opacity-70">Days : Hrs : Min : Sec</span>
        </div>
      </header>

      {/* Demo Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
            <Activity className="text-blue-500" /> Omni-Signal Monitors
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Awaiting passive signals from GitHub or Etherscan. You can manually simulate an incoming heartbeat below to watch the TTL timer reset in real-time.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={simulateHeartbeat}
              className="flex-1 py-3 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-bold rounded-xl hover:bg-blue-100 transition flex justify-center items-center gap-2"
            >
              <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} /> Simulate Activity
            </button>
            <button 
              onClick={() => setView('signals')}
              className="px-4 py-3 bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 transition"
            >
              Config
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
            <ShieldAlert className="text-orange-500" /> Active Defenses
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Canarytokens are deployed. Triggering a honeypot will instantly override the timer and freeze the vault.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={triggerHoneypot}
              className="flex-1 py-3 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-bold rounded-xl hover:bg-red-100 transition flex justify-center items-center gap-2"
            >
              <Lock size={18} /> Trigger Honeypot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}