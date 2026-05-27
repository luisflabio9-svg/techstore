import React from 'react';
import { ArrowRight, Star, Truck, Shield, Zap } from 'lucide-react';
import { Product } from '../types';
import { mockProducts } from '../mock-data';

interface HomePageProps {
  onViewProducts: () => void;
  onAddToCart: (product: Product) => void;
}

export default function HomePage({ onViewProducts, onAddToCart }: HomePageProps) {
  const featuredProducts = mockProducts.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg py-20 px-6 mb-16 text-center">
        <h1 className="text-5xl font-bold mb-4">Bienvenido a TechStore</h1>
        <p className="text-xl text-indigo-100 mb-8">
          Descubre la mejor tecnología con los mejores precios
        </p>
        <button
          onClick={onViewProducts}
          className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold hover:bg-indigo-50 transition"
        >
          Ver Productos
          <ArrowRight size={20} />
        </button>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="text-indigo-600" size={24} />
          </div>
          <h3 className="font-bold text-lg mb-2">Envío Gratis</h3>
          <p className="text-gray-600">
            En compras mayores a $50
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-indigo-600" size={24} />
          </div>
          <h3 className="font-bold text-lg mb-2">Garantía Segura</h3>
          <p className="text-gray-600">
            Compra protegida al 100%
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="text-indigo-600" size={24} />
          </div>
          <h3 className="font-bold text-lg mb-2">Entrega Rápida</h3>
          <p className="text-gray-600">
            En 24-48 horas
          </p>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Productos Destacados</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
                    <Star size={16} className="text-yellow-500" />
                    <span className="text-sm font-semibold">{product.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-indigo-600">
                    ${product.price}
                  </span>
                  <button
                    onClick={() => onAddToCart(product)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded font-semibold hover:bg-indigo-700 transition"
                  >
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button
            onClick={onViewProducts}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition inline-flex items-center gap-2"
          >
            Ver Todos los Productos
            <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
}
