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
    <div className="mt-2 h-28 bg-gray-100 rounded-xl flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (status === 'error') return (
    <div className="mt-2 h-28 bg-red-50 border border-red-200 rounded-xl flex flex-col items-center justify-center gap-1">
      <ImageOff size={24} className="text-red-400" />
      <p className="text-xs text-red-500 font-semibold">No se pudo cargar la imagen</p>
    </div>
  );
  return <img src={url} className="mt-2 h-28 w-full rounded-xl object-cover border border-gray-200" alt="preview" />;
}

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  React.useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl font-semibold text-white fade-in ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
      {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={16} /></button>
    </div>
  );
}

const emptyForm = (): Partial<Product> => ({
  name: '', description: '', price: 0, originalPrice: undefined,
  image: '', gallery: [], category: '', stock: 0,
  isOffer: false, discountPercent: undefined, features: [],
});

export default function AdminPanel({ products, onUpdateProducts, onLogout }: AdminPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>(emptyForm());
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [newFeatureKey, setNewFeatureKey] = useState('');
  const [newFeatureValue, setNewFeatureValue] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'features' | 'gallery' | 'offer'>('info');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  const set = (field: keyof Product, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (touched[field]) setErrors(validateForm(updated));
  };

  const touch = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validateForm(formData));
  };

  const handleSave = () => {
    setTouched({ name: true, price: true, stock: true, category: true, image: true });
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      showToast('Corrige los errores antes de guardar', 'error');
      setActiveTab('info');
      return;
    }
    if (editingId) {
      onUpdateProducts(products.map((p) => p.id === editingId ? { ...p, ...formData } as Product : p));
      showToast('Producto actualizado correctamente', 'success');
      setEditingId(null);
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name!.trim(),
        description: formData.description?.trim() || '',
        price: formData.price!,
        originalPrice: formData.originalPrice || undefined,
        image: formData.image?.trim() || DEFAULT_IMG,
        gallery: formData.gallery || [],
        category: formData.category!.trim(),
        stock: formData.stock!,
        rating: 4.5,
        isOffer: formData.isOffer || false,
        discountPercent: formData.discountPercent || undefined,
        features: formData.features || [],
      };
      onUpdateProducts([...products, newProduct]);
      showToast('Producto agregado correctamente', 'success');
    }
    setFormData(emptyForm()); setErrors({}); setTouched({});
    setShowForm(false); setActiveTab('info');
  };

  const handleCancel = () => {
    setShowForm(false); setEditingId(null);
    setFormData(emptyForm()); setErrors({}); setTouched({}); setActiveTab('info');
  };

  const handleEdit = (product: Product) => {
    setFormData({ ...product }); setEditingId(product.id);
    setErrors({}); setTouched({}); setShowForm(true); setActiveTab('info');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Eliminar "${name}"?\nEsta acción no se puede deshacer.`)) {
      onUpdateProducts(products.filter((p) => p.id !== id));
      showToast('Producto eliminado', 'success');
    }
  };

  const handleReset = () => {
    onUpdateProducts(mockProducts);
    try { localStorage.removeItem('electronicosjapon_products'); } catch {}
    setShowResetConfirm(false);
    showToast('Productos restaurados al catálogo original', 'success');
  };

  const addFeature = () => {
    if (!newFeatureKey.trim() || !newFeatureValue.trim()) { showToast('Completa nombre y valor', 'error'); return; }
    set('features', [...(formData.features || []), { key: newFeatureKey.trim(), value: newFeatureValue.trim() }]);
    setNewFeatureKey(''); setNewFeatureValue('');
  };
  const removeFeature = (i: number) => set('features', (formData.features || []).filter((_, idx) => idx !== i));
  const updateFeature = (i: number, field: 'key' | 'value', val: string) =>
    set('features', (formData.features || []).map((f, idx) => idx === i ? { ...f, [field]: val } : f));

  const addGallery = () => {
    if (!newGalleryUrl.trim()) return;
    try { new URL(newGalleryUrl); } catch { showToast('URL de imagen no válida', 'error'); return; }
    set('gallery', [...(formData.gallery || []), newGalleryUrl.trim()]);
    setNewGalleryUrl('');
  };
  const removeGallery = (i: number) => set('gallery', (formData.gallery || []).filter((_, idx) => idx !== i));

  const inputCls = (field: keyof FormErrors) =>
    `w-full px-4 py-3 border rounded-xl outline-none text-sm transition ${
      touched[field] && errors[field]
        ? 'border-red-400 focus:ring-2 focus:ring-red-300 bg-red-50'
        : 'border-gray-200 focus:ring-2 focus:ring-orange-400'
    }`;

  const tabs = [
    { id: 'info' as const, label: '📋 Info' },
    { id: 'features' as const, label: '⚡ Características' },
    { id: 'gallery' as const, label: '🖼️ Galería' },
    { id: 'offer' as const, label: '🔥 Oferta' },
  ];

  return (
    <div className="fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Panel Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Electrónicos Japón — {products.length} productos</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-2 rounded-xl font-semibold hover:bg-gray-200 transition text-sm">
            <RotateCcw size={14} /> Restaurar
          </button>
          <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-600 transition text-sm">Cerrar Sesión</button>
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-black text-gray-900 text-lg mb-2">Restaurar catálogo original</h3>
            <p className="text-gray-500 text-sm mb-6">Esto eliminará todos los cambios y volverá a los productos de ejemplo. No se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={handleReset} className="flex-1 bg-red-500 text-white py-2 rounded-xl font-bold hover:bg-red-600 transition text-sm">Sí, restaurar</button>
              <button onClick={() => setShowResetConfirm(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-200 transition text-sm">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {!showForm ? (
        <div>
          <button onClick={() => { setFormData(emptyForm()); setErrors({}); setTouched({}); setShowForm(true); }}
            className="mb-6 bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition inline-flex items-center gap-2 shadow-lg shadow-orange-500/20">
            <Plus size={20} /> Agregar Producto
          </button>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold">Producto</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Precio</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Categoría</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Oferta</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm">Sin productos. Agrega el primero.</td></tr>
                  ) : products.map((product, i) => (
                    <tr key={product.id} className={`border-b hover:bg-orange-50 transition ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image || DEFAULT_IMG} alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                            onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMG; }} />
                          <div>
                            <p className="font-bold text-sm text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-400 truncate max-w-[180px]">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-black text-orange-500 text-sm">{formatCOP(product.price)}</span>
                        {product.originalPrice && <span className="text-xs text-gray-400 line-through block">{formatCOP(product.originalPrice)}</span>}
                      </td>
                      <td className="px-6 py-4"><StockBadge stock={product.stock} /></td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                      <td className="px-6 py-4">
                        {product.isOffer ? <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-lg">🔥 {product.discountPercent}%</span> : <span className="text-gray-300 text-xs">—</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => handleEdit(product)} className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-orange-100 hover:text-orange-600 transition"><Edit2 size={15} /></button>
                          <button onClick={() => handleDelete(product.id, product.name)} className="bg-red-100 text-red-500 p-2 rounded-lg hover:bg-red-200 transition"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      ) : (
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-3xl fade-in">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-black text-gray-900">{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
          </div>
          <p className="text-xs text-gray-400 mb-6">Los campos marcados con * son obligatorios</p>

          <div className="flex gap-2 mb-6 border-b border-gray-100 pb-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition ${activeTab === tab.id ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'info' && (
            <div className="space-y-4 fade-in">
              <div>
                <label className="block text-xs font-bold mb-1 text-gray-500 uppercase tracking-wider">Nombre *</label>
                <input type="text" value={formData.name || ''} placeholder="Ej: Audífonos Sony WH-1000XM5"
                  onChange={(e) => set('name', e.target.value)} onBlur={() => touch('name')} className={inputCls('name')} />
                {touched.name && errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-gray-500 uppercase tracking-wider">Descripción</label>
                <textarea value={formData.description || ''} placeholder="Describe el producto brevemente..."
                  onChange={(e) => set('description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none text-sm" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 text-gray-500 uppercase tracking-wider">Precio COP *</label>
                  <input type="number" value={formData.price || ''} placeholder="Ej: 1500000" min="0"
                    onChange={(e) => set('price', parseFloat(e.target.value) || 0)} onBlur={() => touch('price')} className={inputCls('price')} />
                  {formData.price && formData.price > 0 && <p className="text-xs text-orange-500 mt-1 font-bold">{formatCOP(formData.price)}</p>}
                  {touched.price && errors.price && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-gray-500 uppercase tracking-wider">Stock *</label>
                  <input type="number" value={formData.stock ?? ''} placeholder="Ej: 10" min="0"
                    onChange={(e) => set('stock', parseInt(e.target.value) || 0)} onBlur={() => touch('stock')} className={inputCls('stock')} />
                  {formData.stock !== undefined && formData.stock >= 0 && <div className="mt-1"><StockBadge stock={formData.stock} /></div>}
                  {touched.stock && errors.stock && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.stock}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-gray-500 uppercase tracking-wider">Categoría *</label>
                <input type="text" value={formData.category || ''} placeholder="Ej: Electrónica, Audio, Wearables..."
                  onChange={(e) => set('category', e.target.value)} onBlur={() => touch('category')} className={inputCls('category')} />
                {touched.category && errors.category && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.category}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-gray-500 uppercase tracking-wider">URL de imagen principal</label>
                <input type="url" value={formData.image || ''} placeholder="https://i.imgur.com/tuimagen.jpg"
                  onChange={(e) => set('image', e.target.value)} onBlur={() => touch('image')} className={inputCls('image')} />
                {touched.image && errors.image && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.image}</p>}
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-700 font-bold mb-1">💡 Cómo subir tu foto gratis:</p>
                  <ol className="text-xs text-blue-600 space-y-0.5 list-decimal list-inside">
                    <li>Ve a <a href="https://imgur.com/upload" target="_blank" rel="noreferrer" className="underline font-bold">imgur.com/upload</a></li>
                    <li>Selecciona tu foto del celular o computador</li>
                    <li>Clic derecho en la imagen subida → "Copiar dirección"</li>
                    <li>Pega el link en este campo</li>
                  </ol>
                </div>
                <ImagePreview url={formData.image || ''} />
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="fade-in">
              <p className="text-sm text-gray-500 mb-4">Especificaciones técnicas del producto (marca, RAM, pantalla, batería...)</p>
              {(formData.features || []).length === 0 && (
                <div className="text-center py-6 text-gray-300 bg-gray-50 rounded-xl mb-4 text-sm">Sin características. Agrega la primera.</div>
              )}
              <div className="space-y-2 mb-4">
                {(formData.features || []).map((f, i) => (
                  <div key={i} className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg">
                    <input value={f.key} onChange={(e) => updateFeature(i, 'key', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none bg-white" placeholder="Característica" />
                    <span className="text-gray-400">:</span>
                    <input value={f.value} onChange={(e) => updateFeature(i, 'value', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none bg-white" placeholder="Valor" />
                    <button onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition"><X size={16} /></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 bg-orange-50 p-3 rounded-xl border border-dashed border-orange-300">
                <input value={newFeatureKey} onChange={(e) => setNewFeatureKey(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addFeature()}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none" placeholder="Ej: RAM" />
                <input value={newFeatureValue} onChange={(e) => setNewFeatureValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addFeature()}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none" placeholder="Ej: 8GB" />
                <button onClick={addFeature} className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition text-sm whitespace-nowrap">+ Agregar</button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Tip: presiona Enter para agregar rápido</p>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="fade-in">
              <p className="text-sm text-gray-500 mb-1">Fotos adicionales del producto.</p>
              <p className="text-xs text-gray-400 mb-4">Usa <a href="https://imgur.com/upload" target="_blank" rel="noreferrer" className="text-orange-500 underline font-semibold">imgur.com</a> para subir fotos gratis</p>
              {(formData.gallery || []).length === 0 && (
                <div className="text-center py-6 text-gray-300 bg-gray-50 rounded-xl mb-4 text-sm">Sin fotos en la galería aún</div>
              )}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {(formData.gallery || []).map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt={`galería-${i}`} className="w-full h-24 object-cover rounded-lg border border-gray-100"
                      onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMG; }} />
                    <button onClick={() => removeGallery(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 bg-orange-50 p-3 rounded-xl border border-dashed border-orange-300">
                <input value={newGalleryUrl} onChange={(e) => setNewGalleryUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addGallery()}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none" placeholder="https://i.imgur.com/..." />
                <button onClick={addGallery} className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition text-sm">+ Agregar</button>
              </div>
            </div>
          )}

          {activeTab === 'offer' && (
            <div className="fade-in space-y-4">
              <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-gray-200 rounded-xl hover:bg-orange-50 hover:border-orange-300 transition">
                <input type="checkbox" checked={formData.isOffer || false}
                  onChange={(e) => set('isOffer', e.target.checked)} className="accent-orange-500 w-5 h-5" />
                <div>
                  <p className="font-bold text-gray-900">Marcar como oferta 🔥</p>
                  <p className="text-xs text-gray-500">Aparecerá en la sección de Ofertas Especiales con badge animado</p>
                </div>
              </label>
              {formData.isOffer && (
                <div className="grid grid-cols-2 gap-4 fade-in">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-gray-500 uppercase tracking-wider">Precio original (COP)</label>
                    <input type="number" value={formData.originalPrice || ''} min="0"
                      onChange={(e) => set('originalPrice', parseFloat(e.target.value) || undefined)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none text-sm" placeholder="Ej: 2000000" />
                    {formData.originalPrice && <p className="text-xs text-gray-400 mt-1">{formatCOP(formData.originalPrice)}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-gray-500 uppercase tracking-wider">% de descuento</label>
                    <input type="number" value={formData.discountPercent || ''} min="1" max="99"
                      onChange={(e) => set('discountPercent', parseInt(e.target.value) || undefined)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none text-sm" placeholder="Ej: 20" />
                    {formData.discountPercent && <p className="text-xs text-orange-500 mt-1 font-bold">{formData.discountPercent}% de descuento</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
            <button onClick={handleSave}
              className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-black hover:bg-orange-600 transition flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20">
              <CheckCircle size={18} />
              {editingId ? 'Actualizar Producto' : 'Guardar Producto'}
            </button>
            <button onClick={handleCancel} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
  }
}
