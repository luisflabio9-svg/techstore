import React from 'react';
import { ArrowRight, Star, Truck, Shield, Zap, Tag } from 'lucide-react';
import { Product } from '../types';
import { formatCOP } from '../lib/utils';

interface HomePageProps {
  onViewProducts: () => void;
  onAddToCart: (product: Product) => void;
  products: Product[];
}

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80';

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
          { icon: <Truck className="text-orange-500" size={26} />, title: "Envío Gratis", desc: "En compras mayores a $50.000" },
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
                <img src={product.image} alt={product.name} className="w-full h-44 object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMG; }} />
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-black text-orange-500">{formatCOP(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">{formatCOP(product.originalPrice)}</span>
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
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMG; }} />
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
                  <span className="text-xl font-black text-orange-500">{formatCOP(product.price)}</span>
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

      <section className="mt-16 bg-gray-900 text-white rounded-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <span className="text-orange-500 font-semibold uppercase tracking-widest text-sm">Respaldo total</span>
          <h2 className="text-3xl font-black mt-2">Garantía Electrónicos Japón</h2>
          <p className="text-gray-400 mt-2">Todos nuestros productos tienen garantía. Cualquier problema se resuelve directamente en nuestro local.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: '🛡️', title: 'Garantía en todos los productos', desc: 'Cada producto que vendemos tiene garantía respaldada por nuestra tienda.' },
            { icon: '🔧', title: 'Soporte técnico presencial', desc: 'Visítanos en nuestro local y nuestros técnicos te atenderán de inmediato.' },
            { icon: '✅', title: 'Solución garantizada', desc: 'Si hay un problema con tu producto, lo solucionamos o te lo cambiamos.' },
          ].map((g) => (
            <div key={g.title} className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
              <div className="text-4xl mb-3">{g.icon}</div>
              <h3 className="font-bold text-white mb-2">{g.title}</h3>
              <p className="text-gray-400 text-sm">{g.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-orange-500 rounded-xl p-6 text-center">
          <h3 className="text-xl font-black mb-6">📍 Visítanos en nuestro local</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-bold text-white mb-2">📌 Dirección</p>
              <p className="text-orange-100">Cartagena, Colombia — Bolívar</p>
              <p className="text-orange-100">Bazurto, Centro Comercial El Puntazo</p>
              <p className="text-orange-100 font-bold mt-1">Local 106/107</p>
            </div>
            <div>
              <p className="font-bold text-white mb-2">📞 Teléfono</p>
              <a href="tel:+573226926464" className="text-orange-100 hover:text-white transition font-bold text-lg">
                322 692 6464
              </a>
            </div>
            <div>
              <p className="font-bold text-white mb-2">💬 WhatsApp</p>
              <a href="https://wa.me/573226926464" target="_blank" rel="noreferrer"
                className="text-orange-100 hover:text-white transition font-bold text-lg">
                Escríbenos ahora
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
