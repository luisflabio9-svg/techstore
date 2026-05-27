import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const ADMIN_PIN = '30041999';
  const MAX_ATTEMPTS = 3;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      setError('Demasiados intentos. Intenta más tarde.');
      return;
    }

    if (pin === ADMIN_PIN) {
      setPin('');
      setError('');
      setAttempts(0);
      onLogin();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin('');

      if (newAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        setError('❌ Acceso denegado. Demasiados intentos fallidos.');
      } else {
        const remaining = MAX_ATTEMPTS - newAttempts;
        setError(`❌ PIN incorrecto. Intentos restantes: ${remaining}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center">
            <Lock className="text-indigo-600" size={32} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
          TechStore Admin
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Ingresa tu PIN para acceder
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              PIN de Administrador
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Ingresa tu PIN"
              maxLength={8}
              disabled={isLocked}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none text-center text-2xl tracking-widest font-mono disabled:bg-gray-100 disabled:cursor-not-allowed"
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
              <X className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 font-semibold text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLocked || pin.length === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition duration-200"
          >
            {isLocked ? '🔒 Acceso Bloqueado' : 'Acceder al Panel'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          Solo administradores pueden acceder
        </p>
      </div>
    </div>
  );
}