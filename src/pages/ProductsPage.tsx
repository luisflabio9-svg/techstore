import React, { useState, useMemo } from 'react';
import { Search, Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductsPageProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  categories: string[];
}

export default function ProductsPage({ products, onAddToCart, categories }: ProductsPageProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating'>('price-asc');
  const [priceRange, setPriceRange] = useState([0, 2000]);

  const filtered = useMemo(() => {
    let f = products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'Todas' || p.category === selectedCategory;
      return matchSearch && matchCat && p.price <= priceRange[1];
    });
    if (sortBy === 'price-asc') f.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') f.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') f.sort((a, b) => b.rating - a.rating);
    return f;
  }, [products, search, selectedCategory, priceRange, sortBy]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Nuestros Productos</h1>
      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="bg-white p-6 rounded-xl shadow-sm h-fit border-t-4 border-orange-500">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Filtros</h2>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none text-sm" />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-700">Categoría</label>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition font-medium ${selectedCategory === cat ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">Precio máx: ${priceRange[1]}</label>
            <input type="range" min="0" max="2000" value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full accent-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Ordenar</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400">
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="rating">Mejor calificación</option>
            </select>
          </div>
        </aside>

        <main className="lg:col-span-3">
          {filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-200">
                  <div className="relative">
                    <img src={product.image} alt={product.name} className="w-full h-56 object-cover" />
                    {product.stock < 5 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Poco stock</span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-900 leading-tight">{product.name}</h3>
                      <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded ml-2 flex-shrink-0">
                        <Star size={14} className="text-orange-500" />
                        <span className="text-xs font-semibold text-orange-700">{product.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-3">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400 text-xs">Stock: {product.stock}</span>
                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-orange-500">${product.price.toFixed(2)}</span>
                      <button onClick={() => onAddToCart(product)} disabled={product.stock === 0}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition disabled:bg-gray-300 flex items-center gap-2 text-sm">
                        <ShoppingCart size={16} /> Agregar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl shadow-sm text-center text-gray-500">No se encontraron productos</div>
          )}
        </main>
      </div>
    </div>
  );
}
