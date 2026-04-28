import React, { useState, useEffect } from 'react';
import { GitCommit, Hexagon, Activity, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

export default function OmniSignals() {
  const [githubUser, setGithubUser] = useState('');
  const [ethAddress, setEthAddress] = useState('');
  const [syncResults, setSyncResults] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState(null);

  // Function to link a profile to the backend
  const handleLink = async (platform, identifier) => {
    if (!identifier) return;
    try {
      const res = await fetch('https://osbv-core-engine.onrender.com/api/signals/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, identifier })
      });
      const data = await res.json();
      setMessage({ type: 'success', text: data.message });
      handleSync(); // Automatically sync after linking
    } catch (err) {
      setMessage({ type: 'error', text: "Failed to link to backend." });
    }
  };

  // Function to tell the backend to go fetch the live data
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('https://osbv-core-engine.onrender.com/api/signals/sync');
      const data = await res.json();
      setSyncResults(data.results || []);
    } catch (err) {
      setMessage({ type: 'error', text: "Failed to sync signals." });
    }
    setIsSyncing(false);
  };

  // Helper to find a specific platform's result
  const getResult = (platform) => syncResults.find(r => r.platform === platform);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 max-w-2xl mx-auto animate-fade-in">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
            <Activity className="text-blue-600" /> Omni-Signal Monitors
          </h2>
          <p className="text-gray-500 dark:text-gray-400">The system monitors these profiles for passive signs of life.</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition flex items-center gap-2 font-medium"
        >
          <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
          {isSyncing ? "Syncing..." : "Force Sync"}
        </button>
      </div>

      {message && (
        <div className={`p-3 mb-6 rounded-lg flex items-center gap-2 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {/* GitHub Integration */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50/50 dark:bg-slate-800/50">
          <div className="p-3 bg-gray-200 dark:bg-slate-700 rounded-lg text-gray-700 dark:text-gray-300 w-12 h-12 flex items-center justify-center shrink-0">
            <GitCommit size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 dark:text-white">GitHub Commits</h3>
            {getResult('GitHub') ? (
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${getResult('GitHub').status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {getResult('GitHub').last_seen} ({getResult('GitHub').event_type})
                </span>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-1">Not connected</p>
            )}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input 
              type="text" 
              value={githubUser}
              onChange={(e) => setGithubUser(e.target.value)}
              placeholder="GitHub Username" 
              className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg outline-none text-sm flex-1 sm:w-40 dark:bg-slate-700 dark:text-white"
            />
            <button onClick={() => handleLink('github', githubUser)} className="px-4 py-2 bg-slate-800 dark:bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition">Link</button>
          </div>
        </div>

        {/* Etherscan Integration */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-gray-200 dark:border-slate-700 rounded-xl bg-indigo-50/30 dark:bg-slate-800/50">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400 w-12 h-12 flex items-center justify-center shrink-0">
            <Hexagon size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 dark:text-white">Ethereum Network</h3>
            {getResult('Etherscan') ? (
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${getResult('Etherscan').status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {getResult('Etherscan').last_seen}
                </span>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-1">Not connected</p>
            )}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input 
              type="text" 
              value={ethAddress}
              onChange={(e) => setEthAddress(e.target.value)}
              placeholder="0x..." 
              className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg outline-none text-sm flex-1 sm:w-40 dark:bg-slate-700 dark:text-white"
            />
            <button onClick={() => handleLink('etherscan', ethAddress)} className="px-4 py-2 bg-slate-800 dark:bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition">Link</button>
          </div>
        </div>
      </div>
    </div>
  );
}