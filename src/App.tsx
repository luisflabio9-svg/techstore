import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { Product, CartItem, User } from './types';
import { mockProducts, categories } from './mock-data';
import { loadProducts, saveProducts } from './lib/storage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AdminPanel from './pages/AdminPanel';
import CartPage from './pages/CartPage';
import AdminLogin from './components/AdminLogin';

type Page = 'home' | 'products' | 'cart' | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  
  // ✅ Carrito sincronizado con localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('techstore-cart');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('❌ Error al cargar carrito:', error);
      return [];
    }
  });
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // ✅ CORRECCIÓN PRINCIPAL: Carga desde localStorage con clave 'electronicosjapon_products'
  const [products, setProducts] = useState<Product[]>(() => {
    console.log('🔄 Inicializando productos...');
    const savedProducts = loadProducts();
    if (savedProducts.length > 0) {
      console.log('✅ Usando productos guardados en localStorage');
      return savedProducts;
    }
    console.log('📦 Usando datos mock por defecto');
    return mockProducts;
  });
  
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // ✅ Guarda automáticamente cada vez que products cambie
  useEffect(() => {
    console.log('📝 useEffect: Productos cambió, guardando...', products.length, 'items');
    saveProducts(products);
  }, [products]);

  // ✅ Guarda automáticamente el carrito con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('techstore-cart', JSON.stringify(cart));
        console.log('💳 Carrito guardado:', cart.length, 'items');
      } catch (error) {
        console.error('❌ Error al guardar carrito:', error);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [cart]);

  const user: User | null = isAdmin
    ? { id: '1', name: 'Admin', email: 'admin@techstore.com', role: 'admin' }
    : null;

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) return prev.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => setCart((prev) => prev.filter((item) => item.product.id !== productId));

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart((prev) => prev.map((item) => item.product.id === productId ? { ...item, quantity } : item));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => { 
    console.log('🚪 Cerrando sesión...');
    setIsAdmin(false); 
    setCurrentPage('home'); 
    setShowAdminLogin(false); 
  };

  const navTo = (page: Page) => { setCurrentPage(page); setMenuOpen(false); };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage onViewProducts={() => navTo('products')} onAddToCart={addToCart} products={products} />;
      case 'products': return <ProductsPage products={products} onAddToCart={addToCart} categories={categories} />;
      case 'cart': return <CartPage cart={cart} onRemoveItem={removeFromCart} onUpdateQuantity={updateCartQuantity} total={cartTotal} onGoProducts={() => navTo('products')} />;
      case 'admin': return <AdminPanel products={products} onUpdateProducts={setProducts} onLogout={handleLogout} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {showAdminLogin && (
        <AdminLogin
          onLogin={() => { setIsAdmin(true); setCurrentPage('admin'); setShowAdminLogin(false); }}
          onClose={() => setShowAdminLogin(false)}
        />
      )}

      <header className="bg-gray-900 shadow-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navTo('home')} className="flex items-center gap-2 group">
            <span className="text-2xl font-black text-orange-500 group-hover:text-orange-400 transition tracking-tight">
              Electrónicos Japón
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {(['home', 'products'] as Page[]).map((page) => (
              <button key={page} onClick={() => navTo(page)}
                className={`font-semibold transition-all duration-200 pb-1 border-b-2 ${
                  currentPage === page
                    ? 'text-orange-500 border-orange-500'
                    : 'text-gray-300 border-transparent hover:text-orange-400 hover:border-orange-400'
                }`}>
                {page === 'home' ? 'Inicio' : 'Productos'}
              </button>
            ))}
            <button onClick={() => navTo('cart')} className="relative text-gray-300 hover:text-orange-400 transition">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            {!isAdmin ? (
              <button onClick={() => setShowAdminLogin(true)}
                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition btn-orange">
                <LayoutDashboard size={16} /> Admin
              </button>
            ) : (
              <button onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition">
                <LogOut size={16} /> Salir
              </button>
            )}
          </nav>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-300">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <nav className="md:hidden bg-gray-800 border-t border-gray-700 p-4 space-y-2 fade-in">
            <button onClick={() => navTo('home')} className="block w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-orange-400 rounded-lg transition">Inicio</button>
            <button onClick={() => navTo('products')} className="block w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-orange-400 rounded-lg transition">Productos</button>
            <button onClick={() => navTo('cart')} className="block w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-orange-400 rounded-lg transition">
              🛒 Carrito {totalItems > 0 && `(${totalItems})`}
            </button>
            {!isAdmin ? (
              <button onClick={() => { setShowAdminLogin(true); setMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition">Admin</button>
            ) : (
              <button onClick={handleLogout} className="block w-full text-left px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition">Salir</button>
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
              <h3 className="text-orange-500 font-black text-lg mb-3">Electrónicos Japón</h3>
              <p className="text-sm">Tu tienda de tecnología de confianza</p>
            </div>
            {[
              { title: 'Links', items: ['Inicio', 'Productos', 'Contacto'] },
              { title: 'Soporte', items: ['FAQ', 'Envíos', 'Devoluciones'] },
              { title: 'Legal', items: ['Términos', 'Privacidad', 'Cookies'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold mb-3">{col.title}</h4>
                <ul className="space-y-2 text-sm">
                  {col.items.map((item) => <li key={item}><a href="#" className="hover:text-orange-400 transition">{item}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm">
            <p>© 2024 Electrónicos Japón. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
