import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, Folder, ExternalLink, Terminal } from 'lucide-react';
import { LARAVEL_PROJECT_FILES, LaravelFile } from '../data/laravelCode';

interface LaravelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LaravelModal: React.FC<LaravelModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<LaravelFile>(LARAVEL_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative bg-slate-900 text-slate-100 rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-blue-800/60 flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Topbar */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-red-500/20 font-bold text-sm">
              PHP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Laravel 11 Backend Arxitekturası</h2>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-900/80 text-blue-300 px-2 py-0.5 rounded-md border border-blue-700/50">
                  Task 4 Full-Stack
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Geyim mağazasının API, verilənlər bazası miqrasiyaları, Eloquent modelləri və nəzarətçiləri
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-72 bg-slate-950/60 border-r border-slate-800 p-4 space-y-4 overflow-y-auto">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-blue-400" />
              <span>Laravel Layihə Strukturu</span>
            </div>

            <div className="space-y-1">
              {LARAVEL_PROJECT_FILES.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className="w-3.5 h-3.5 shrink-0 text-blue-400" />
                      <span className="truncate">{file.name}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-slate-800/80 text-slate-300">
                      {file.category}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Setup Instructions */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] space-y-2 text-slate-400">
              <div className="flex items-center gap-1.5 text-blue-300 font-bold">
                <Terminal className="w-3.5 h-3.5" />
                <span>Artisan Əmrləri</span>
              </div>
              <p className="font-mono text-[10px] text-slate-300 bg-black/40 p-2 rounded-lg border border-slate-800">
                composer create-project laravel/laravel mavi-boutique<br />
                php artisan migrate --seed<br />
                php artisan serve
              </p>
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
            {/* File Header Bar */}
            <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <div>
                <p className="text-xs font-mono font-bold text-blue-400">{selectedFile.path}</p>
                <p className="text-[11px] text-slate-400">{selectedFile.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  title="Kodu kopyala"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Kopyalandı!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kopyala</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Fayl kimi yüklə"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Faylı Yüklə (.php)</span>
                </button>
              </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto p-6 font-mono text-xs leading-relaxed text-blue-100 bg-[#0b1120]">
              <pre className="selection:bg-blue-600 selection:text-white">
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
