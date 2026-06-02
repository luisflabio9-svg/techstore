import React from 'react';
import { ArrowRight, Star, Truck, Shield, Zap, Tag } from 'lucide-react';
import { Product } from '../types';

interface HomePageProps {
  onViewProducts: () => void;
  onAddToCart: (product: Product) => void;
  products: Product[];
}

export default function HomePage({ onViewProducts, onAddToCart, products }: HomePageProps) {
  const featured = products.slice(0, 3);
  const offers = products.filter((p) => p.isOffer);

  return (
    <div className="fade-in">
      <section className="bg-gray-900 text-white rounded-2xl py-24 px-6 mb-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent pointer-events-none" />
        <p className="text-orange-500 font-semibold uppercase tracking-widest text-sm mb-4">Tecnología de calidad</p>
        <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
          Electrónicos <span className="text-orange-500">Japón</span>
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto">
          Descubre la mejor tecnología con los mejores precios
        </p>
        <button onClick={onViewProducts}
          className="inline-flex items-center gap-2 bg-orange-500 text-white px-10 py-4 rounded-xl font-bold hover:bg-orange-600 transition btn-orange text-lg shadow-lg shadow-orange-500/30">
          Ver Productos <ArrowRight size={22} />
        </button>
      </section>

      <section className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: <Truck className="text-orange-500" size={26} />, title: "Envío Gratis", desc: "En compras mayores a $50" },
          { icon: <Shield className="text-orange-500" size={26} />, title: "Garantía Segura", desc: "Compra protegida al 100%" },
          { icon: <Zap className="text-orange-500" size={26} />, title: "Entrega Rápida", desc: "En 24-48 horas" },
        ].map((f) => (
          <div key={f.title} className="bg-white p-6 rounded-xl shadow-sm text-center border-b-4 border-orange-500 card-hover">
            <div className="bg-orange-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">{f.icon}</div>
            <h3 className="font-bold text-lg mb-1 text-gray-900">{f.title}</h3>
            <p className="text-gray-500 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {offers.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Tag className="text-orange-500" size={24} />
            <h2 className="text-2xl font-black text-gray-900">Ofertas Especiales</h2>
            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full badge-offer">HOT</span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {offers.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden card-hover border border-gray-100 relative">
                {product.discountPercent && (
                  <div className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-xs font-black px-2 py-1 rounded-lg">
                    -{product.discountPercent}%
                  </div>
                )}
                <img src={product.image} alt={product.name} className="w-full h-44 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-black text-orange-500">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <button onClick={() => onAddToCart(product)}
                    className="w-full bg-gray-900 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition text-sm">
                    Agregar al carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-black mb-6 text-gray-900">Productos Destacados</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {featured.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden card-hover border border-gray-100">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">{product.name}</h3>
                  <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                    <Star size={13} className="text-orange-500 fill-orange-500" />
                    <span className="text-xs font-bold text-orange-600">{product.rating}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-orange-500">${product.price.toFixed(2)}</span>
                  <button onClick={() => onAddToCart(product)}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition text-sm">
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button onClick={onViewProducts}
            className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition inline-flex items-center gap-2 btn-orange shadow-lg shadow-orange-500/20">
            Ver Todos los Productos <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
}
