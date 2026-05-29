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
      <section className="bg-gray-900 text-white rounded-2xl py-20 px-6 mb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent pointer-events-none" />
        <h1 className="text-5xl font-bold mb-4">
          Bienvenido a <span className="text-orange-500">TechStore</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Descubre la mejor tecnología con los mejores precios
        </p>
        <button
          onClick={onViewProducts}
          className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition"
        >
          Ver Productos <ArrowRight size={20} />
        </button>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-16">
        {[
          { icon: <Truck className="text-orange-500" size={24} />, title: "Envío Gratis", desc: "En compras mayores a $50" },
          { icon: <Shield className="text-orange-500" size={24} />, title: "Garantía Segura", desc: "Compra protegida al 100%" },
          { icon: <Zap className="text-orange-500" size={24} />, title: "Entrega Rápida", desc: "En 24-48 horas" },
        ].map((f) => (
          <div key={f.title} className="bg-white p-6 rounded-xl shadow-sm text-center border-t-4 border-orange-500">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">{f.icon}</div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Productos Destacados</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-200">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                  <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded">
                    <Star size={14} className="text-orange-500" />
                    <span className="text-sm font-semibold text-orange-700">{product.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-500">${product.price}</span>
                  <button
                    onClick={() => onAddToCart(product)}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
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
            className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition inline-flex items-center gap-2"
          >
            Ver Todos los Productos <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
}
