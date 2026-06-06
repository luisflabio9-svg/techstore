import { useState, useEffect } from 'react';
import { Product } from '../types';
import { mockProducts } from '../mock-data';
import { loadProducts, saveAllProducts } from '../firebase/products';

const STORAGE_KEY = 'electronicosjapon_products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => {
    // Carga inicial desde localStorage mientras Firebase responde
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return mockProducts;
  });

  const [loading, setLoading] = useState(true);

  // Cargar productos desde Firebase al iniciar
  useEffect(() => {
    loadProducts()
      .then((firebaseProducts) => {
        setProducts(firebaseProducts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Actualizar productos y guardar en Firebase
  const updateProducts = async (newProducts: Product[]) => {
    setProducts(newProducts);
    try {
      await saveAllProducts(newProducts);
    } catch {
      // Si falla Firebase, ya quedó en localStorage via saveAllProducts
      console.error('Error guardando en Firebase, datos en localStorage');
    }
  };

  const resetToDefault = async () => {
    setProducts(mockProducts);
    try {
      await saveAllProducts(mockProducts);
    } catch {}
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProducts));
  };

  return { products, updateProducts, resetToDefault, loading };
}
