import React from 'react';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { CartItem } from '../types';

interface CartPageProps {
  cart: CartItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  total: number;
}

export default function CartPage({
  cart,
  onRemoveItem,
  onUpdateQuantity,
  total,
}: CartPageProps) {
  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Carrito Vacío</h2>
        <p className="text-gray-600 mb-6">
          No hay productos en tu carrito aún
        </p>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition inline-flex items-center gap-2">
          <ArrowLeft size={20} />
          Continuar comprando
        </button>
      </div>
    );
  }

  const tax = total * 0.1;
  const shipping = total > 50 ? 0 : 10;
  const grandTotal = total + tax + shipping;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Carrito de Compras</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-6 border-b last:border-b-0"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="font-bold text-lg">{item.product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {item.product.description}
                  </p>
                  <p className="text-indigo-600 font-bold">
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2 border border-gray-300 rounded">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-red-600 hover:text-red-700 transition flex items-center gap-1"
                  >
                    <Trash2 size={18} />
                    Eliminar
                  </button>

                  <p className="font-bold text-lg">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="bg-white p-6 rounded-lg shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-6">Resumen del Pedido</h2>

          <div className="space-y-4 mb-6 pb-6 border-b">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Impuesto (10%)</span>
              <span className="font-semibold">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Envío</span>
              <span className="font-semibold">
                {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
          </div>

          <div className="flex justify-between text-lg font-bold mb-6">
            <span>Total</span>
            <span className="text-indigo-600">${grandTotal.toFixed(2)}</span>
          </div>

          {shipping === 0 && (
            <p className="text-sm text-green-600 bg-green-50 p-2 rounded mb-6">
              ✓ ¡Envío gratis en este pedido!
            </p>
          )}

          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition mb-3">
            Proceder al Pago
          </button>

          <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition">
            Continuar Comprando
          </button>
        </aside>
      </div>
    </div>
  );
}