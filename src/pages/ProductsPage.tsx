import React, { useState, useMemo } from 'react';
import { Search, Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductsPageProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  categories: string[];
}

export default function ProductsPage({
  products,
  onAddToCart,
  categories,
}: ProductsPageProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating'>('price-asc');
  const [priceRange, setPriceRange] = useState([0, 2000]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === 'Todas' || product.category === selectedCategory;
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  }, [products, search, selectedCategory, priceRange, sortBy]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Nuestros Productos</h1>

      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="bg-white p-6 rounded-lg shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-6">Filtros</h2>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">Categoría</label>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded transition ${
                    selectedCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">
              Precio: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <input
              type="range"
              min="0"
              max="2000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Ordenar</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
            >
              <option value="price-asc">Menor a Mayor Precio</option>
              <option value="price-desc">Mayor a Menor Precio</option>
              <option value="rating">Mejor Calificación</option>
            </select>
          </div>
        </aside>

        <main className="lg:col-span-3">
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    {product.stock < 5 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Poco stock
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg">{product.name}</h3>
                      <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
                        <Star size={16} className="text-yellow-500" />
                        <span className="text-sm font-semibold">{product.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-500 text-sm">
                        Stock: {product.stock}
                      </span>
                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-indigo-600">
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => onAddToCart(product)}
                        disabled={product.stock === 0}
                        className="bg-indigo-600 text-white px-4 py-2 rounded font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <ShoppingCart size={18} />
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-lg shadow-sm text-center">
              <p className="text-gray-600 text-lg">
                No se encontraron productos que coincidan con tus filtros
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}