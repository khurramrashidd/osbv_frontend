import React, { useState } from 'react';
import { KeyRound, Unlock, AlertCircle, FileDown, FileText } from 'lucide-react';

export default function FiduciaryPortal() {
  const [shares, setShares] = useState(['', '', '']);
  const [recoveredText, setRecoveredText] = useState(null);
  const [recoveredFile, setRecoveredFile] = useState(null);
  const [error, setError] = useState(null);
  const [isRecovering, setIsRecovering] = useState(false);

  const handleShareChange = (index, value) => {
    const newShares = [...shares];
    newShares[index] = value;
    setShares(newShares);
  };

  const handleRecover = async () => {
    setIsRecovering(true);
    setError(null);
    setRecoveredText(null);
    setRecoveredFile(null);
    
    try {
      const response = await fetch('https://osbv-core-engine.onrender.com/api/vault/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shares: shares.filter(s => s.trim() !== '') })
      });
      
      const data = await response.json();
      if (response.ok) {
        if (data.recovered_text) setRecoveredText(data.recovered_text);
        if (data.recovered_file) {
          setRecoveredFile({
            data: data.recovered_file,
            name: data.file_name,
            type: data.file_type
          });
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server connection failed.");
    }
    setIsRecovering(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-block p-4 bg-red-50 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400 mb-4">
          <KeyRound size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Emergency Reconstitution</h2>
        <p className="text-sm text-gray-500">Input fiduciary shares to reconstitute the AES Master Key.</p>
      </div>

      <div className="space-y-4 mb-6">
        {shares.map((share, index) => (
          <div key={index}>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Fiduciary Share #{index + 1}</label>
            <input 
              type="text" value={share} onChange={(e) => handleShareChange(index, e.target.value)}
              className="w-full p-3 font-mono text-sm border rounded-lg outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              placeholder="Paste base64 share string..."
            />
          </div>
        ))}
        <button onClick={() => setShares([...shares, ''])} className="text-sm text-blue-600 dark:text-blue-400 font-medium">+ Add another share field</button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg flex gap-2"><AlertCircle size={20}/> {error}</div>}
      
      {/* Recovery Results Display */}
      {(recoveredText || recoveredFile) && (
        <div className="mb-6 space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl">
            <h3 className="text-green-800 dark:text-green-400 font-bold mb-2 flex items-center gap-2"><Unlock size={18}/> Vault Unlocked</h3>
            
            {recoveredText && (
              <div className="mb-4">
                <p className="text-sm text-green-700 dark:text-green-300 mb-1 font-semibold">Text Payload:</p>
                <p className="font-mono text-sm bg-white dark:bg-slate-800 p-3 rounded border text-slate-800 dark:text-slate-200 break-words">{recoveredText}</p>
              </div>
            )}

            {recoveredFile && (
              <div className="pt-4 border-t border-green-200 dark:border-green-800">
                 <p className="text-sm text-green-700 dark:text-green-300 mb-2 font-semibold">Recovered Document:</p>
                 <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2">
                      <FileText className="text-blue-500" size={20} />
                      <span className="text-sm font-medium dark:text-gray-200">{recoveredFile.name}</span>
                    </div>
                    {/* Construct the Base64 Download Link */}
                    <a 
                      href={`data:${recoveredFile.type};base64,${recoveredFile.data}`} 
                      download={recoveredFile.name}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition"
                    >
                      <FileDown size={16} /> Download
                    </a>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}

      <button onClick={handleRecover} disabled={isRecovering} className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition shadow-lg flex justify-center items-center gap-2">
        <Unlock size={20} /> {isRecovering ? "Deciphering AES Keys..." : "Execute Lagrange Interpolation"}
      </button>
    </div>
  );
}