import React, { useState } from 'react';
import { Trash2, Plus, Edit2, X, Image, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { Product, ProductFeature } from '../types';

interface AdminPanelProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  onLogout: () => void;
}

const emptyForm: Partial<Product> = {
  name: '', description: '', price: 0, originalPrice: undefined,
  image: '', gallery: [], category: '', stock: 0,
  isOffer: false, discountPercent: undefined, features: [],
};

export default function AdminPanel({ products, onUpdateProducts, onLogout }: AdminPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>(emptyForm);
  const [newFeatureKey, setNewFeatureKey] = useState('');
  const [newFeatureValue, setNewFeatureValue] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'features' | 'gallery' | 'offer'>('info');

  const handleSave = () => {
    if (!formData.name || !formData.price) { alert('Completa nombre y precio'); return; }
    if (editingId) {
      onUpdateProducts(products.map((p) => p.id === editingId ? { ...p, ...formData } as Product : p));
      setEditingId(null);
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name || '',
        description: formData.description || '',
        price: formData.price || 0,
        originalPrice: formData.originalPrice,
        image: formData.image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80',
        gallery: formData.gallery || [],
        category: formData.category || 'Otros',
        stock: formData.stock || 0,
        rating: 4.5,
        isOffer: formData.isOffer || false,
        discountPercent: formData.discountPercent,
        features: formData.features || [],
      };
      onUpdateProducts([...products, newProduct]);
    }
    setFormData(emptyForm);
    setShowForm(false);
    setActiveTab('info');
  };

  const handleCancel = () => { setShowForm(false); setEditingId(null); setFormData(emptyForm); setActiveTab('info'); };
  const handleEdit = (product: Product) => { setFormData({ ...product }); setEditingId(product.id); setShowForm(true); };
  const handleDelete = (id: string) => { if (window.confirm('¿Eliminar este producto?')) onUpdateProducts(products.filter((p) => p.id !== id)); };

  const addFeature = () => {
    if (!newFeatureKey || !newFeatureValue) return;
    const features = [...(formData.features || []), { key: newFeatureKey, value: newFeatureValue }];
    setFormData({ ...formData, features });
    setNewFeatureKey(''); setNewFeatureValue('');
  };

  const removeFeature = (index: number) => {
    const features = (formData.features || []).filter((_, i) => i !== index);
    setFormData({ ...formData, features });
  };

  const updateFeature = (index: number, field: 'key' | 'value', val: string) => {
    const features = (formData.features || []).map((f, i) => i === index ? { ...f, [field]: val } : f);
    setFormData({ ...formData, features });
  };

  const addGalleryImage = () => {
    if (!newGalleryUrl) return;
    const gallery = [...(formData.gallery || []), newGalleryUrl];
    setFormData({ ...formData, gallery });
    setNewGalleryUrl('');
  };

  const removeGalleryImage = (index: number) => {
    const gallery = (formData.gallery || []).filter((_, i) => i !== index);
    setFormData({ ...formData, gallery });
  };

  const tabs = [
    { id: 'info', label: '📋 Info' },
    { id: 'features', label: '⚡ Características' },
    { id: 'gallery', label: '🖼️ Galería' },
    { id: 'offer', label: '🔥 Oferta' },
  ] as const;

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Panel Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Electrónicos Japón</p>
        </div>
        <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-600 transition text-sm">Cerrar Sesión</button>
      </div>

      {!showForm ? (
        <div>
          <button onClick={() => setShowForm(true)}
            className="mb-6 bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition inline-flex items-center gap-2 btn-orange shadow-lg shadow-orange-500/20">
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
                  {products.map((product, i) => (
                    <tr key={product.id} className={`border-b hover:bg-orange-50 transition ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                          <div>
                            <p className="font-bold text-sm text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-400 truncate max-w-xs">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-black text-orange-500">${product.price.toFixed(2)}</span>
                        {product.originalPrice && <span className="text-xs text-gray-400 line-through block">${product.originalPrice.toFixed(2)}</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${product.stock > 10 ? 'bg-green-100 text-green-700' : product.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                      <td className="px-6 py-4">
                        {product.isOffer ? <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-lg">🔥 {product.discountPercent}%</span> : <span className="text-gray-300 text-xs">—</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => handleEdit(product)} className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition"><Edit2 size={15} /></button>
                          <button onClick={() => handleDelete(product.id)} className="bg-red-100 text-red-500 p-2 rounded-lg hover:bg-red-200 transition"><Trash2 size={15} /></button>
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-gray-900">{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-100 pb-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition ${activeTab === tab.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab: Info */}
          {activeTab === 'info' && (
            <div className="space-y-4 fade-in">
              <div>
                <label className="block text-xs font-bold mb-1 text-gray-500 uppercase tracking-wider">Nombre *</label>
                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none text-sm" placeholder="Nombre del producto" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-gray-500 uppercase tracking-wider">Descripción</label>
                <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none text-sm" rows={3} placeholder="Descripción del producto" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 text-gray-500 uppercase tracking-wider">Precio *</label>
                  <input type="number" value={formData.price || 0} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-gray-500 uppercase tracking-wider">Stock</label>
                  <input type="number" value={formData.stock || 0} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-gray-500 uppercase tracking-wider">Categoría</label>
                <input type="text" value={formData.category || ''} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none text-sm" placeholder="Electrónica, Audio, etc." />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-gray-500 uppercase tracking-wider">URL Imagen Principal</label>
                <input type="text" value={formData.image || ''} onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none text-sm" placeholder="https://..." />
                {formData.image && <img src={formData.image} className="mt-2 h-24 rounded-lg object-cover" alt="preview" />}
              </div>
            </div>
          )}

          {/* Tab: Características */}
          {activeTab === 'features' && (
            <div className="fade-in">
              <p className="text-sm text-gray-500 mb-4">Agrega, edita o elimina las características del producto.</p>
              <div className="space-y-2 mb-4">
                {(formData.features || []).map((f, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input value={f.key} onChange={(e) => updateFeature(i, 'key', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none" placeholder="Ej: Marca" />
                    <input value={f.value} onChange={(e) => updateFeature(i, 'value', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none" placeholder="Ej: Samsung" />
                    <button onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-600 p-2"><X size={16} /></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input value={newFeatureKey} onChange={(e) => setNewFeatureKey(e.target.value)}
                  className="flex-1 px-3 py-2 border border-dashed border-orange-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none" placeholder="Nueva característica" />
                <input value={newFeatureValue} onChange={(e) => setNewFeatureValue(e.target.value)}
                  className="flex-1 px-3 py-2 border border-dashed border-orange-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none" placeholder="Valor" />
                <button onClick={addFeature} className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition text-sm">+ Agregar</button>
              </div>
            </div>
          )}

          {/* Tab: Galería */}
          {activeTab === 'gallery' && (
            <div className="fade-in">
              <p className="text-sm text-gray-500 mb-4">Agrega URLs de imágenes adicionales para la galería del producto.</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {(formData.gallery || []).map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt={`img-${i}`} className="w-full h-24 object-cover rounded-lg" />
                    <button onClick={() => removeGalleryImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newGalleryUrl} onChange={(e) => setNewGalleryUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border border-dashed border-orange-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none" placeholder="https://url-imagen.com/foto.jpg" />
                <button onClick={addGalleryImage} className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition text-sm">+ Agregar</button>
              </div>
            </div>
          )}

          {/* Tab: Oferta */}
          {activeTab === 'offer' && (
            <div className="fade-in space-y-4">
              <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-xl hover:bg-orange-50 transition">
                <input type="checkbox" checked={formData.isOffer || false} onChange={(e) => setFormData({ ...formData, isOffer: e.target.checked })} className="accent-orange-500 w-5 h-5" />
                <div>
                  <p className="font-bold text-gray-900">¿Es una oferta? 🔥</p>
                  <p className="text-xs text-gray-500">Se mostrará con badge de oferta en la tienda</p>
                </div>
              </label>
              {formData.isOffer && (
                <div className="grid grid-cols-2 gap-4 fade-in">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-gray-500 uppercase tracking-wider">Precio Original</label>
                    <input type="number" value={formData.originalPrice || ''} onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none text-sm" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-gray-500 uppercase tracking-wider">% Descuento</label>
                    <input type="number" value={formData.discountPercent || ''} onChange={(e) => setFormData({ ...formData, discountPercent: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none text-sm" placeholder="Ej: 20" />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 mt-8">
            <button onClick={handleSave} className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-black hover:bg-orange-600 transition btn-orange">
              {editingId ? '✓ Actualizar Producto' : '+ Guardar Producto'}
            </button>
            <button onClick={handleCancel} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
