import React from 'react';
import { Trash2, ShoppingBag, MessageCircle, Heart } from 'lucide-react';
import { CartItem } from '../types';

interface CartPageProps {
  cart: CartItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  total: number;
  onGoProducts: () => void;
}

const WHATSAPP_NUMBER = '573226926464';

export default function CartPage({ cart, onRemoveItem, onUpdateQuantity, total, onGoProducts }: CartPageProps) {
  const handleWhatsApp = () => {
    const lines = cart.map((item) =>
      `📦 ${item.product.name} x${item.quantity} — $${(item.product.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const message =
      `¡Hola Electrónicos Japón! Quiero realizar este pedido:\n\n` +
      `${lines}\n\n` +
      `💳 *TOTAL: $${total.toFixed(2)}*\n\n` +
      `Por favor confirmar disponibilidad. ¡Gracias!`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-24 fade-in">
        <ShoppingBag size={72} className="mx-auto text-gray-200 mb-4" />
        <h2 className="text-2xl font-black mb-2 text-gray-700">Tu carrito está vacío</h2>
        <p className="text-gray-400 mb-8">Agrega productos para comenzar tu pedido</p>
        <button onClick={onGoProducts}
          className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition btn-orange">
          Ver Productos
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h1 className="text-4xl font-black mb-8 text-gray-900">Carrito de Compras</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {cart.map((item) => (
            <div key={item.product.id} className="bg-white rounded-xl shadow-sm p-4 flex gap-4 border border-gray-100 card-hover">
              <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-cover rounded-xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-gray-900">{item.product.name}</h3>
                <p className="text-gray-400 text-sm mb-2 truncate">{item.product.description}</p>
                <p className="text-orange-500 font-black text-lg">${item.product.price.toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)} className="px-3 py-2 hover:bg-gray-100 font-black text-gray-700">−</button>
                  <span className="px-3 py-2 font-black min-w-[2.5rem] text-center text-gray-900">{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)} className="px-3 py-2 hover:bg-gray-100 font-black text-gray-700">+</button>
                </div>
                <button onClick={() => onRemoveItem(item.product.id)} className="text-red-400 hover:text-red-600 flex items-center gap-1 text-xs font-semibold transition">
                  <Trash2 size={14} /> Eliminar
                </button>
                <p className="font-black text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-white p-6 rounded-xl shadow-sm h-fit border-t-4 border-orange-500">
          <h2 className="text-xl font-black mb-6 text-gray-900">Resumen del Pedido</h2>

          <div className="flex justify-between font-black text-3xl mb-2 text-gray-900">
            <span>Total</span>
            <span className="text-orange-500">${total.toFixed(2)}</span>
          </div>

          <p className="text-gray-400 text-xs mb-6">* Envío e impuestos se coordinan al confirmar el pedido</p>

          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6 text-center">
            <Heart className="text-orange-500 mx-auto mb-2" size={22} />
            <p className="text-sm font-semibold text-gray-700">
              ¡Gracias por confiar en nosotros! 🎉
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Tu pedido llegará con todo el amor de Electrónicos Japón
            </p>
          </div>

          <button onClick={handleWhatsApp}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-black transition flex items-center justify-center gap-3 text-lg mb-3 shadow-lg shadow-green-500/20">
            <MessageCircle size={22} />
            Pedir por WhatsApp
          </button>
          <p className="text-xs text-center text-gray-400 mb-3">
            Te redirige a WhatsApp con tu pedido listo 📱
          </p>
          <button onClick={onGoProducts}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition text-sm">
            Continuar Comprando
          </button>
        </aside>
      </div>
    </div>
  );
}
