import React, { useState } from 'react';
import { Lock, FileUp, X, CheckCircle, AlertCircle, FileText } from 'lucide-react';

export default function SealAsset() {
  const [payload, setPayload] = useState('');
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  
  const [shares, setShares] = useState(5);
  const [threshold, setThreshold] = useState(3);
  const [generatedShares, setGeneratedShares] = useState([]);
  const [isSealing, setIsSealing] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        // Extract only the base64 data string (removes the data:image/png;base64, part)
        const base64String = reader.result.split(',')[1];
        setFileData(base64String);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileData(null);
  };

  const handleSeal = async (e) => {
    e.preventDefault();
    setIsSealing(true);
    setError(null);
    setGeneratedShares([]);
    
    try {
      const response = await fetch('https://osbv-core-engine.onrender.com/api/vault/seal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          payload, 
          file_data: fileData,
          file_name: file?.name,
          file_type: file?.type,
          n_shares: shares, 
          k_threshold: threshold 
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || "An unknown error occurred.");
        setIsSealing(false);
        return;
      }
      setGeneratedShares(data.shares);
    } catch (err) {
      setError("Failed to connect to backend. Is the Python server running?");
    }
    setIsSealing(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
        <Lock className="text-blue-600" /> Seal Digital Estate (AES-256)
      </h2>
      
      <form className="space-y-6" onSubmit={handleSeal}>
        
        {/* Document Upload Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Legal Document / Asset File</label>
          {!file ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-slate-700/50 transition cursor-pointer relative">
              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileUpload} />
              <FileUp className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">PDF, DOCX, JPG, PNG (Max 5MB)</p>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="text-blue-600 dark:text-blue-400 shrink-0" size={24} />
                <div className="truncate">
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-100 truncate">{file.name}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Ready for encryption</p>
                </div>
              </div>
              <button type="button" onClick={removeFile} className="p-2 text-blue-400 hover:text-red-500 transition"><X size={20} /></button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Text Payload / Instructions</label>
          <textarea 
            value={payload} onChange={(e) => setPayload(e.target.value)} rows="3" 
            className="w-full p-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg outline-none"
            placeholder="Additional instructions, crypto seed phrases..."
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-slate-700 pt-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Total Fiduciaries (N)</label>
            <input type="number" value={shares} onChange={(e) => setShares(Number(e.target.value))} className="w-full p-2 border rounded-lg outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Quorum Threshold (K)</label>
            <input type="number" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-full p-2 border rounded-lg outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} /><span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <button disabled={isSealing || (!payload && !file)} className="w-full py-3 bg-slate-800 dark:bg-blue-600 text-white font-bold rounded-lg hover:bg-slate-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
          {isSealing ? "Applying Hybrid Encryption..." : "Encrypt & Generate Shares"}
        </button>
      </form>

      {generatedShares && generatedShares.length > 0 && (
        <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl">
          <h3 className="text-green-800 dark:text-green-400 font-bold mb-3 flex items-center gap-2"><CheckCircle size={18}/> Assets Secured</h3>
          <p className="text-sm text-green-700 dark:text-green-300 mb-4">Master keys split. Distribute these shares to your fiduciaries. {threshold} required to unlock.</p>
          <div className="space-y-2">
            {generatedShares.map((share, idx) => (
              <div key={idx} className="flex gap-2">
                <input readOnly value={share} className="flex-1 p-2 text-xs font-mono bg-white dark:bg-slate-800 border rounded dark:text-gray-300 dark:border-slate-600" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}