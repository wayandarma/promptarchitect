import React, { useState } from 'react';
import { Copy, Download, RefreshCw, FileJson, FileText, Check, MessageSquare } from 'lucide-react';
import { ChatInterface } from './ChatInterface';

interface PreviewPanelProps {
  promptText: string;
  jsonOutput: object;
  onReset: () => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ promptText, jsonOutput, onReset }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'json' | 'chat'>('text');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = activeTab === 'json' 
      ? JSON.stringify(jsonOutput, null, 2)
      : promptText;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonOutput, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `prompt_architect_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="bg-dark-800 border-l border-dark-700 h-screen sticky top-0 flex flex-col shadow-2xl">
      <div className="p-4 border-b border-dark-700 bg-dark-900/50 backdrop-blur-md">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
          Live Preview
        </h2>
      </div>

      <div className="flex border-b border-dark-700 bg-dark-800">
        <button 
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-3 text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'text' 
            ? 'text-brand-400 border-b-2 border-brand-500 bg-dark-700/50' 
            : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <FileText size={14} /> Output
        </button>
        <button 
          onClick={() => setActiveTab('json')}
          className={`flex-1 py-3 text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'json' 
            ? 'text-brand-400 border-b-2 border-brand-500 bg-dark-700/50' 
            : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <FileJson size={14} /> JSON
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'chat' 
            ? 'text-brand-400 border-b-2 border-brand-500 bg-dark-700/50' 
            : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <MessageSquare size={14} /> AI Assist
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative group bg-dark-900/30">
        <div className={`h-full overflow-auto p-4 ${activeTab === 'text' ? 'block' : 'hidden'}`}>
          <div className="prose prose-invert prose-sm max-w-none">
            <p className="whitespace-pre-wrap font-mono text-slate-300 leading-relaxed text-sm">
              {promptText || <span className="text-slate-600 italic">Configure options to generate a prompt...</span>}
            </p>
          </div>
        </div>

        <div className={`h-full overflow-auto p-4 ${activeTab === 'json' ? 'block' : 'hidden'}`}>
          <pre className="font-mono text-xs text-brand-100 whitespace-pre-wrap">
            {JSON.stringify(jsonOutput, null, 2)}
          </pre>
        </div>

        <div className={`h-full ${activeTab === 'chat' ? 'block' : 'hidden'}`}>
          <ChatInterface currentPrompt={promptText} isVisible={activeTab === 'chat'} />
        </div>
      </div>

      {/* Stats Bar (Only show for text/json tabs) */}
      {activeTab !== 'chat' && (
        <div className="px-4 py-2 bg-dark-800 border-t border-dark-700 text-xs text-slate-500 flex justify-between">
          <span>Chars: {promptText.length}</span>
          <span>Words: {promptText.split(/\s+/).filter(w => w.length > 0).length}</span>
        </div>
      )}

      {/* Action Area (Only show for text/json tabs) */}
      {activeTab !== 'chat' && (
        <div className="p-4 bg-dark-800 border-t border-dark-700 space-y-3">
          <button 
            onClick={handleCopy}
            className={`w-full py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 transform active:scale-95 ${
              copied 
                ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)]' 
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_20px_rgba(20,184,166,0.5)]'
            }`}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleDownload}
              className="py-2.5 px-4 rounded-lg border border-dark-600 bg-dark-700 hover:bg-dark-600 text-slate-300 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Download size={16} /> Download
            </button>
            <button 
              onClick={onReset}
              className="py-2.5 px-4 rounded-lg border border-red-900/30 bg-red-900/10 hover:bg-red-900/20 text-red-400 hover:text-red-300 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw size={16} /> Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};