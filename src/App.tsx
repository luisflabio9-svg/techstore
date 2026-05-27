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
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleLogout = () => {
    setIsAdmin(false);
    setCurrentPage('home');
    setShowAdminLogin(false);
  };

  const handleAdminLogin = () => {
    setShowAdminLogin(true);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setCurrentPage('admin');
    setShowAdminLogin(false);
  };

  // Si está en la pantalla de login de admin
  if (showAdminLogin) {
    return (
      <div>
        <button
          onClick={() => setShowAdminLogin(false)}
          className="fixed top-4 left-4 z-50 bg-white rounded-lg p-2 shadow-lg hover:shadow-xl transition"
        >
          <X size={24} className="text-gray-700" />
        </button>
        <AdminLogin onLogin={handleAdminLoginSuccess} />
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onViewProducts={() => setCurrentPage('products')}
            onAddToCart={addToCart}
          />
        );
      case 'products':
        return (
          <ProductsPage
            products={products}
            onAddToCart={addToCart}
            categories={categories}
          />
        );
      case 'cart':
        return (
          <CartPage
            cart={cart}
            onRemoveItem={removeFromCart}
            onUpdateQuantity={updateCartQuantity}
            total={cartTotal}
          />
        );
      case 'admin':
        return (
          <AdminPanel
            products={products}
            onUpdateProducts={setProducts}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition"
          >
            🛒 TechStore
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setCurrentPage('home')}
              className={`font-semibold transition ${
                currentPage === 'home'
                  ? 'text-indigo-600'
                  : 'text-gray-700 hover:text-indigo-600'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => setCurrentPage('products')}
              className={`font-semibold transition ${
                currentPage === 'products'
                  ? 'text-indigo-600'
                  : 'text-gray-700 hover:text-indigo-600'
              }`}
            >
              Productos
            </button>
            <button
              onClick={() => setCurrentPage('cart')}
              className="relative text-gray-700 hover:text-indigo-600 transition"
            >
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            {!isAdmin ? (
              <button
                onClick={handleAdminLogin}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="md:hidden bg-gray-50 border-t p-4 space-y-3">
            <button
              onClick={() => {
                setCurrentPage('home');
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-100 rounded transition"
            >
              Inicio
            </button>
            <button
              onClick={() => {
                setCurrentPage('products');
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-100 rounded transition"
            >
              Productos
            </button>
            <button
              onClick={() => {
                setCurrentPage('cart');
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-100 rounded transition flex items-center gap-2"
            >
              <ShoppingCart size={20} />
              Carrito {cart.length > 0 && `(${cart.length})`}
            </button>
            {!isAdmin ? (
              <button
                onClick={() => {
                  handleAdminLogin();
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <LayoutDashboard size={20} />
                Admin
              </button>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition flex items-center gap-2"
              >
                <LogOut size={20} />
                Salir
              </button>
            )}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">🛒 TechStore</h3>
              <p className="text-sm">
                Tu tienda de tecnología de confianza
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" onClick={() => setCurrentPage('home')} className="hover:text-white transition">Inicio</a></li>
                <li><a href="#" onClick={() => setCurrentPage('products')} className="hover:text-white transition">Productos</a></li>
                <li><a href="#" className="hover:text-white transition">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Envíos</a></li>
                <li><a href="#" className="hover:text-white transition">Devoluciones</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Términos</a></li>
                <li><a href="#" className="hover:text-white transition">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 TechStore. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}