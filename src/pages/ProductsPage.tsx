import React, { useState, useMemo } from 'react';
import { Search, Star, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [maxPrice, setMaxPrice] = useState(2000);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [onlyOffers, setOnlyOffers] = useState(false);

  const filtered = useMemo(() => {
    let f = products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'Todas' || p.category === selectedCategory;
      const matchOffer = !onlyOffers || p.isOffer;
      return matchSearch && matchCat && p.price <= maxPrice && matchOffer;
    });
    if (sortBy === 'price-asc') f.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') f.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') f.sort((a, b) => b.rating - a.rating);
    return f;
  }, [products, search, selectedCategory, maxPrice, sortBy, onlyOffers]);

  return (
    <div className="fade-in">
      <h1 className="text-4xl font-black mb-8 text-gray-900">Nuestros Productos</h1>
      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="bg-white p-6 rounded-xl shadow-sm h-fit border-l-4 border-orange-500">
          <h2 className="text-lg font-black mb-6 text-gray-900">Filtros</h2>
          <div className="mb-5">
            <label className="block text-xs font-bold mb-2 text-gray-500 uppercase tracking-wider">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={15} />
              <input type="text" placeholder="Buscar productos..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none text-sm" />
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-xs font-bold mb-2 text-gray-500 uppercase tracking-wider">Categoría</label>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition font-medium ${selectedCategory === cat ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-xs font-bold mb-2 text-gray-500 uppercase tracking-wider">Precio máx: ${maxPrice}</label>
            <input type="range" min="0" max="2000" value={maxPrice} onChange={(e) => setMaxPrice(parseInt(e.target.value))} className="w-full accent-orange-500" />
          </div>
          <div className="mb-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={onlyOffers} onChange={(e) => setOnlyOffers(e.target.checked)} className="accent-orange-500 w-4 h-4" />
              <span className="text-sm font-semibold text-gray-700">Solo ofertas 🔥</span>
            </label>
          </div>
          <div>
            <label className="block text-xs font-bold mb-2 text-gray-500 uppercase tracking-wider">Ordenar</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400 bg-white">
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="rating">Mejor calificación</option>
            </select>
          </div>
        </aside>

        <main className="lg:col-span-3">
          <p className="text-sm text-gray-500 mb-4">{filtered.length} producto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>
          {filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden card-hover border border-gray-100">
                  <div className="relative">
                    <img src={product.image} alt={product.name} className="w-full h-52 object-cover" />
                    {product.isOffer && product.discountPercent && (
                      <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-black px-2 py-1 rounded-lg badge-offer">
                        -{product.discountPercent}%
                      </span>
                    )}
                    {product.stock < 5 && (
                      <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">Poco stock</span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-black text-gray-900 leading-tight">{product.name}</h3>
                      <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg ml-2 flex-shrink-0">
                        <Star size={12} className="text-orange-500 fill-orange-500" />
                        <span className="text-xs font-bold text-orange-600">{product.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-400">Stock: {product.stock}</span>
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                    </div>
                    {product.features && product.features.length > 0 && (
                      <div className="mb-3">
                        <button onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-orange-500 hover:text-orange-600 transition">
                          {expandedId === product.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          {expandedId === product.id ? 'Ocultar' : 'Ver'} características
                        </button>
                        {expandedId === product.id && (
                          <div className="mt-2 bg-gray-50 rounded-lg p-3 fade-in">
                            <table className="w-full text-xs">
                              <tbody>
                                {product.features.map((f) => (
                                  <tr key={f.key} className="border-b border-gray-100 last:border-0">
                                    <td className="py-1 font-semibold text-gray-600 pr-3">{f.key}</td>
                                    <td className="py-1 text-gray-800">{f.value}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-black text-orange-500">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through ml-2">${product.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <button onClick={() => onAddToCart(product)} disabled={product.stock === 0}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition disabled:bg-gray-300 flex items-center gap-2 text-sm">
                        <ShoppingCart size={15} /> Agregar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl shadow-sm text-center text-gray-400">No se encontraron productos</div>
          )}
        </main>
      </div>
    </div>
  );
}
