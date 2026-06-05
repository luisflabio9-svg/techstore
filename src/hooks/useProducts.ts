import { useState, useEffect } from 'react';
import { Product } from '../types';
import { mockProducts } from '../mock-data';

const STORAGE_KEY = 'electronicosjapon_products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('✅ Productos cargados desde localStorage:', parsed.length);
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error cargando productos:', e);
    }
    console.log('📦 Usando productos por defecto');
    return mockProducts;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      console.log('💾 Productos guardados en localStorage:', products.length);
    } catch (e) {
      console.error('Error guardando productos:', e);
    }
  }, [products]);

  const updateProducts = (newProducts: Product[]) => {
    console.log('🔄 Actualizando productos:', newProducts.length);
    setProducts(newProducts);
  };

  const resetToDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProducts(mockProducts);
    console.log('🔁 Productos restaurados al catálogo original');
  };

  return { products, updateProducts, resetToDefault };
}
