import React, { useState } from 'react';
import { ShoppingCart, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { Product, CartItem, User } from './types';
import { mockProducts, categories } from './mock-data';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AdminPanel from './pages/AdminPanel';
import CartPage from './pages/CartPage';

type Page = 'home' | 'products' | 'cart' | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const user: User | null = isAdmin 
    ? { id: '1', name: 'Admin', email: 'admin@test.com', role: 'admin' }
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
  };

  const handleAdmin
