import React, { useState } from 'react';
import { Trash2, Plus, Edit2, X } from 'lucide-react';
import { Product } from '../types';

interface AdminPanelProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  onLogout: () => void;
}

export default function AdminPanel({
  products,
  onUpdateProducts,
  onLogout,
}: AdminPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    stock: 0,
  });

  const handleAddProduct = () => {
    if (!formData.name || !formData.price) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    if (editingId) {
      onUpdateProducts(
        products.map((p) =>
          p.id === editingId ? { ...p, ...formData } : p
        )
      );
      setEditingId(null);
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name || '',
        description: formData.description || '',
        price: formData.price || 0,
        image: formData.image || 'https://via.placeholder.com/300',
        category: formData.category || 'Otros',
        stock: formData.stock || 0,
        rating: 4.5,
      };
      onUpdateProducts([...products, newProduct]);
    }

    setFormData({
      name: '',
      description: '',
      price: 0,
      image: '',
      category: '',
      stock: 0,
    });
    setShowForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setFormData(product);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      onUpdateProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      image: '',
      category: '',
      stock: 0,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Panel Administrativo</h1>
        <button
          onClick={onLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Cerrar Sesión
        </button>
      </div>

      {!showForm ? (
        <div>
          <div className="mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Agregar Nuevo Producto
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Nombre</th>
                  <th className="px-6 py-4 text-left font-bold">Precio</th>
                  <th className="px-6 py-4 text-left font-bold">Stock</th>
                  <th className="px-6 py-4 text-left font-bold">Categoría</th>
                  <th className="px-6 py-4 text-left font-bold">Calificación</th>
                  <th className="px-6 py-4 text-center font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-gray-600">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-indigo-600">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          product.stock > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      ⭐ {product.rating}
                    </td>
                    <td className="px-6 py-4 flex gap-2 justify-center">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="bg-blue-100 text-blue-600 p-2 rounded hover:bg-blue-200 transition"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {editingId ? 'Editar Producto' : 'Agregar Nuevo Producto'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Nombre</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
                placeholder="Nombre del producto"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
                placeholder="Descripción del producto"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Precio</label>
                <input
                  type="number"
                  value={formData.price || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Stock</label>
                <input
                  type="number"
                  value={formData.stock || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                URL de Imagen
              </label>
              <input
                type="text"
                value={formData.image || ''}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Categoría
              </label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
                placeholder="Electrónica"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleAddProduct}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
            >
              {editingId ? 'Actualizar Producto' : 'Agregar Producto'}
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
