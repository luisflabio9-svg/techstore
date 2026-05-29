import React, { useState } from 'react';
import { ShoppingCart, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { Product, CartItem, User } from './types';
import { mockProducts, categories } from './mock-data';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AdminPanel from './pages/AdminPanel';
import CartPage from './pages/CartPage';
import AdminLogin from './components/AdminLogin';

type Page = 'home' | 'products' | 'cart' | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const user: User | null = isAdmin
    ? { id: '1', name: 'Admin', email: 'admin@techstore.com', role: 'admin' }
    : null;

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    setIsAdmin(false);
    setCurrentPage('home');
    setShowAdminLogin(false);
  };

  if (showAdminLogin) {
    return (
      <div>
        <button
          onClick={() => setShowAdminLogin(false)}
          className="fixed top-4 left-4 z-50 bg-white rounded-lg p-2 shadow-lg hover:shadow-xl transition"
        >
          <X size={24} className="text-gray-700" />
        </button>
        <AdminLogin onLogin={() => { setIsAdmin(true); setCurrentPage('admin'); setShowAdminLogin(false); }} />
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onViewProducts={() => setCurrentPage('products')} onAddToCart={addToCart} />;
      case 'products':
        return <ProductsPage products={products} onAddToCart={addToCart} categories={categories} />;
      case 'cart':
        return <CartPage cart={cart} onRemoveItem={removeFromCart} onUpdateQuantity={updateCartQuantity} total={cartTotal} />;
      case 'admin':
        return <AdminPanel products={products} onUpdateProducts={setProducts} onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-2xl font-bold text-orange-500 hover:text-orange-400 transition"
          >
            🛒 TechStore
          </button>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setCurrentPage('home')}
              className={`font-semibold transition ${
                currentPage === 'home' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-400'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => setCurrentPage('products')}
              className={`font-semibold transition ${
                currentPage === 'products' ? 'text-orange-500' : 'text-gray-300 hover:text-orange-400'
              }`}
            >
              Productos
            </button>
            <button
              onClick={() => setCurrentPage('cart')}
              className="relative text-gray-300 hover:text-orange-400 transition"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            {!isAdmin ? (
              <button
                onClick={() => setShowAdminLogin(true)}
                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                <LayoutDashboard size={18} />
                Admin
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                <LogOut size={18} />
                Salir
              </button>
            )}
          </nav>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-300">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <nav className="md:hidden bg-gray-800 border-t border-gray-700 p-4 space-y-2">
            <button onClick={() => { setCurrentPage('home'); setMenuOpen(false); }}
              className="block w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-orange-400 rounded transition">
              Inicio
            </button>
            <button onClick={() => { setCurrentPage('products'); setMenuOpen(false); }}
              className="block w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-orange-400 rounded transition">
              Productos
            </button>
            <button onClick={() => { setCurrentPage('cart'); setMenuOpen(false); }}
              className="block w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-orange-400 rounded transition">
              🛒 Carrito {totalItems > 0 && `(${totalItems})`}
            </button>
            {!isAdmin ? (
              <button onClick={() => { setShowAdminLogin(true); setMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 bg-orange-500 text-white rounded font-semibold hover:bg-orange-600 transition">
                Admin
              </button>
            ) : (
              <button onClick={handleLogout}
                className="block w-full text-left px-4 py-3 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition">
                Salir
              </button>
            )}
          </nav>
        )}
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {renderPage()}
      </main>

      <footer className="bg-gray-900 text-gray-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-orange-500 font-bold text-lg mb-3">🛒 TechStore</h3>
              <p className="text-sm">Tu tienda de tecnología de confianza</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" onClick={() => setCurrentPage('home')} className="hover:text-orange-400 transition">Inicio</a></li>
                <li><a href="#" onClick={() => setCurrentPage('products')} className="hover:text-orange-400 transition">Productos</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Soporte</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-orange-400 transition">FAQ</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Envíos</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Devoluciones</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-orange-400 transition">Términos</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Privacidad</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm">
            <p>© 2024 TechStore. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
