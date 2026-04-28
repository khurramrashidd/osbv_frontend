import React, { useState } from 'react';
import { Shield, Fingerprint, BellRing, Database, AlertCircle, CheckCircle } from 'lucide-react';

export default function SecurityHub() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [saveStatus, setSaveStatus] = useState(null);
  const [bioEnabled, setBioEnabled] = useState(true);

  const saveWebhook = async () => {
    try {
      await fetch('https://osbv-core-engine.onrender.com/api/system/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhookUrl })
      });
      setSaveStatus("Webhook active! Alerts will route here.");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (e) {
      setSaveStatus("Failed to save webhook.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
        <Shield className="text-blue-600" /> Security & Audit Command Center
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Webhook & Alerts (Feature 9 & 18) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="font-semibold flex items-center gap-2 text-slate-800 dark:text-white mb-2"><BellRing size={18} className="text-orange-500"/> Webhook Escalation Engine</h3>
          <p className="text-sm text-gray-500 mb-4">Route SMS/Email/Slack alerts when TTL expires or honeypots trip.</p>
          <input 
            type="text" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://webhook.site/..." 
            className="w-full p-2 mb-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm"
          />
          <button onClick={saveWebhook} className="w-full py-2 bg-slate-800 dark:bg-blue-600 text-white rounded-lg text-sm font-medium">Save Endpoint</button>
          {saveStatus && <p className="text-xs text-green-600 mt-2">{saveStatus}</p>}
        </div>

        {/* Biometrics & Anomalies (Feature 10 & 13) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="font-semibold flex items-center gap-2 text-slate-800 dark:text-white mb-2"><Fingerprint size={18} className="text-purple-500"/> Keystroke Biometrics & AI</h3>
          <p className="text-sm text-gray-500 mb-4">Analyzes typing patterns (dwell/flight time) during login to detect unauthorized users or distress scenarios.</p>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg border dark:border-slate-600">
            <span className="text-sm font-medium dark:text-gray-300">Biometric Enforcement</span>
            <button 
              onClick={() => setBioEnabled(!bioEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${bioEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${bioEnabled ? 'translate-x-6' : 'translate-x-0'}`}></span>
            </button>
          </div>
        </div>
      </div>

      {/* Audit Logs (Feature 15) */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
        <h3 className="font-semibold flex items-center gap-2 text-slate-800 dark:text-white mb-4"><Database size={18} className="text-blue-500"/> Immutable Audit Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300">
              <tr><th className="p-3">Timestamp</th><th className="p-3">Event Action</th><th className="p-3">IP / Context</th><th className="p-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700 text-gray-600 dark:text-gray-400">
              <tr><td className="p-3">Just now</td><td className="p-3 font-medium text-slate-800 dark:text-gray-200">System Boot</td><td className="p-3">Localhost</td><td className="p-3 text-green-500">Secure</td></tr>
              <tr><td className="p-3">2 hrs ago</td><td className="p-3 font-medium text-slate-800 dark:text-gray-200">GitHub Omni-Signal Sync</td><td className="p-3">API Worker</td><td className="p-3 text-green-500">Verified</td></tr>
              <tr><td className="p-3">1 day ago</td><td className="p-3 font-medium text-slate-800 dark:text-gray-200">Vault Sealed (AES-256)</td><td className="p-3">192.168.1.5</td><td className="p-3 text-green-500">Encrypted</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}