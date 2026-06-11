import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

const STORAGE_KEY = 'installPromptDismissed';
const DISMISS_DAYS = 3;

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const daysDiff = (Date.now() - new Date(dismissed).getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff < DISMISS_DAYS) return;
    }
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`📲 Usuario ${outcome === 'accepted' ? 'instaló' : 'canceló'} la app`);
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 fade-in">
      <div className="bg-gray-900 border border-orange-500 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-2xl max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📲</span>
          <div>
            <p className="text-white font-bold text-sm">Instalar Electrónicos Japón</p>
            <p className="text-gray-400 text-xs">Accede más rápido desde tu celular</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={handleInstall}
            className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-orange-600 transition flex items-center gap-1">
            <Download size={14} /> Instalar
          </button>
          <button onClick={handleDismiss} className="text-gray-400 hover:text-white transition p-1">
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
