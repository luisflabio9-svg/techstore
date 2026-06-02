import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
  onClose: () => void;
}

export default function AdminLogin({ onLogin, onClose }: AdminLoginProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const ADMIN_PIN = '30041999';
  const MAX_ATTEMPTS = 3;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) { setError('Demasiados intentos. Intenta más tarde.'); return; }
    if (pin === ADMIN_PIN) {
      setPin(''); setError(''); setAttempts(0); onLogin();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin('');
      if (newAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        setError('❌ Acceso denegado. Demasiados intentos fallidos.');
      } else {
        setError(`❌ PIN incorrecto. Intentos restantes: ${MAX_ATTEMPTS - newAttempts}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition"><X size={22} /></button>
        <div className="flex justify-center mb-6">
          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center">
            <Lock className="text-orange-500" size={30} />
          </div>
        </div>
        <h1 className="text-2xl font-black text-center mb-1 text-gray-900">Panel Admin</h1>
        <p className="text-center text-gray-400 mb-6 text-sm">Electrónicos Japón</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••••••"
            maxLength={8}
            disabled={isLocked}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none text-center text-2xl tracking-widest font-mono disabled:bg-gray-100 transition"
            autoFocus
          />
          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3"><p className="text-red-600 text-sm text-center font-semibold">{error}</p></div>}
          <button type="submit" disabled={isLocked || pin.length === 0}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-3 rounded-xl transition btn-orange">
            {isLocked ? '🔒 Bloqueado' : 'Acceder'}
          </button>
        </form>
        <p className="text-center text-gray-300 text-xs mt-4">Solo administradores</p>
      </div>
    </div>
  );
}
