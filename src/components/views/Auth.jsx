import React, { useState } from 'react';
import { Shield, Mail, Key, Fingerprint, Activity, AlertCircle, RefreshCw } from 'lucide-react';

export default function Auth({ setAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Keystroke Biometrics State
  const [typingData, setTypingData] = useState(0); // Visual bar
  const [lastKeyDown, setLastKeyDown] = useState(0);
  const [typingSpeeds, setTypingSpeeds] = useState([]);

  // Feature 10: Record flight time between keystrokes
  const handleKeyDown = () => {
    const now = Date.now();
    if (lastKeyDown !== 0) {
      const flightTime = now - lastKeyDown;
      // Ignore pauses longer than 1.5s (user stopped to think)
      if (flightTime < 1500) {
        setTypingSpeeds(prev => [...prev, flightTime]);
      }
    }
    setLastKeyDown(now);
  };

  const handleTyping = (e) => {
    setPassword(e.target.value);
    setTypingData(prev => Math.min(prev + 10, 100)); // Visual progress
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Calculate the average typing speed in milliseconds
    const avgSpeed = typingSpeeds.length > 0 
      ? typingSpeeds.reduce((a, b) => a + b, 0) / typingSpeeds.length 
      : 0;

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    
    try {
      const res = await fetch(`https://osbv-core-engine.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, avg_speed: avgSpeed })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (isLogin) {
          setAuth(email); // Unlock the app!
        } else {
          setIsLogin(true);
          setError("Profile created! Please log in to verify biometrics.");
          setPassword('');
          setTypingData(0);
          setTypingSpeeds([]);
          setLastKeyDown(0);
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Cannot connect to OSBV Core Engine.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-fade-in">
        
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
          <Shield className="mx-auto text-blue-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-white tracking-widest uppercase">OSBV Secure Gateway</h2>
          <p className="text-slate-400 text-sm mt-2">Omni-Signal Behavioral Vault</p>
        </div>

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 dark:bg-slate-700 p-1 rounded-lg flex w-full max-w-xs">
              <button onClick={() => { setIsLogin(true); setError(null); setTypingData(0); setTypingSpeeds([]); }} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-white dark:bg-slate-800 shadow text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>Login</button>
              <button onClick={() => { setIsLogin(false); setError(null); setTypingData(0); setTypingSpeeds([]); }} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-white dark:bg-slate-800 shadow text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>Initialize Vault</button>
            </div>
          </div>

          {error && (
            <div className={`p-3 mb-6 rounded-lg flex gap-2 text-sm font-medium ${error.includes('created') ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Decentralized ID (Email)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 p-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all" placeholder="fiduciary@domain.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Master Cryptographic Passphrase</label>
              <div className="relative">
                <Key className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="password" required 
                  value={password} 
                  onChange={handleTyping} 
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 p-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all" 
                  placeholder="••••••••••••" 
                />
              </div>
              
              {isLogin && password.length > 0 && (
                <div className="mt-3 flex items-center gap-2 text-xs font-medium text-purple-600 dark:text-purple-400">
                  <Activity size={14} className="animate-pulse" />
                  <span>Analyzing Keystroke Dynamics... {typingData}% profile match</span>
                </div>
              )}
            </div>

            <button disabled={isLoading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex justify-center items-center gap-2 mt-4">
              {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <Fingerprint size={18} />}
              {isLogin ? 'Authenticate & Decrypt' : 'Generate Master Keys'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}