import React from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartPageProps {
  cart: CartItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  total: number;
}

export default function CartPage({ cart, onRemoveItem, onUpdateQuantity, total }: CartPageProps) {
  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-gray-700">Carrito Vacío</h2>
        <p className="text-gray-500 mb-6">No hay productos en tu carrito aún</p>
      </div>
    );
  }

  const tax = total * 0.1;
  const shipping = total > 50 ? 0 : 10;
  const grandTotal = total + tax + shipping;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Carrito de Compras</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.product.id} className="bg-white rounded-xl shadow-sm p-4 flex gap-4 border border-gray-200">
              <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900">{item.product.name}</h3>
                <p className="text-gray-500 text-sm mb-2 truncate">{item.product.description}</p>
                <p className="text-orange-500 font-bold">${item.product.price.toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)} className="px-3 py-2 hover:bg-gray-100 font-bold">−</button>
                  <span className="px-3 py-2 font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)} className="px-3 py-2 hover:bg-gray-100 font-bold">+</button>
                </div>
                <button onClick={() => onRemoveItem(item.product.id)} className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm">
                  <Trash2 size={16} /> Eliminar
                </button>
                <p className="font-bold text-lg text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <aside className="bg-white p-6 rounded-xl shadow-sm h-fit border-t-4 border-orange-500">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Resumen</h2>
          <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-semibold">${total.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Impuesto (10%)</span><span className="font-semibold">${tax.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Envío</span><span className="font-semibold">{shipping === 0 ? '🎉 Gratis' : `$${shipping.toFixed(2)}`}</span></div>
          </div>
          <div className="flex justify-between font-bold text-xl mb-6">
            <span>Total</span><span className="text-orange-500">${grandTotal.toFixed(2)}</span>
          </div>
          {shipping === 0 && <p className="text-xs text-green-600 bg-green-50 p-2 rounded-lg mb-4 text-center">✓ ¡Envío gratis aplicado!</p>}
          <button className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition mb-3">Proceder al Pago</button>
          <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition text-sm">Continuar Comprando</button>
        </aside>
      </div>
    </div>
  );
}
