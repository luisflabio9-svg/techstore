import React, { useState } from 'react';
import { Trash2, Plus, Edit2, X, CheckCircle, AlertCircle, ImageOff, RotateCcw } from 'lucide-react';
import { Product } from '../types';
import { formatCOP } from '../lib/utils';
import { mockProducts } from '../mock-data';

interface AdminPanelProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  onLogout: () => void;
}

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80';

interface FormErrors {
  name?: string;
  price?: string;
  stock?: string;
  category?: string;
  image?: string;
}

function validateForm(data: Partial<Product>): FormErrors {
  const errors: FormErrors = {};
  if (!data.name || data.name.trim().length < 2) errors.name = 'El nombre debe tener al menos 2 caracteres';
  if (!data.price || data.price <= 0) errors.price = 'El precio debe ser mayor a $0';
  if (data.price && data.price > 100000000) errors.price = 'El precio parece muy alto, verifica';
  if (data.stock === undefined || data.stock < 0) errors.stock = 'El stock no puede ser negativo';
  if (!data.category || data.category.trim().length < 2) errors.category = 'Ingresa una categoría válida';
  if (data.image && data.image.trim() !== '') {
    try { new URL(data.image); } catch { errors.image = 'La URL de imagen no es válida'; }
  }
  return errors;
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-700">Agotado</span>;
  if (stock <= 5) return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-yellow-100 text-yellow-700">Poco: {stock}</span>;
  if (stock <= 15) return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-orange-100 text-orange-700">Medio: {stock}</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-green-100 text-green-700">Buen stock: {stock}</span>;
}

function ImagePreview({ url }: { url: string }) {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  React.useEffect(() => {
    if (!url || url.trim() === '') { setStatus('idle'); return; }
    try { new URL(url); } catch { setStatus('error'); return; }
    setStatus('loading');
    const img = new Image();
    img.onload = () => setStatus('ok');
    img.onerror = () => setStatus('error');
    img.src = url;
  }, [url]);
  if (status === 'idle') return null;
  if (status === 'loading') return (
    <div className="mt-2 h-28 bg-gray-100 rounded-xl flex items-center
