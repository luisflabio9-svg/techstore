import { useState, useEffect } from 'react';
import { Product } from '../types';
import { mockProducts } from '../mock-data';

const STORAGE_KEY = 'electronicosjapon_products';

export function useProducts() {
  // 1. Cargar desde localStorage PRIMERO
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('✅ Productos cargados de localStorage:', parsed.length);
          return parsed;
        }
      }
    } catch (error) {
      console.error('❌ Error cargando de localStorage:', error);
    }
    console.log('📦 Usando productos de ejemplo iniciales');
    return mockProducts;
  });

  // 2. Guardar en localStorage CADA VEZ que products cambie
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      console.log('💾 Productos guardados en localStorage:', products.length);
    } catch (error) {
      console.error('❌ Error guardando en localStorage:', error);
    }
  }, [products]);

  // 3. Función simple para actualizar productos
  const updateProducts = (newProducts: Product[]) => {
    console.log('🔄 Actualizando productos:', newProducts.length);
    setProducts(newProducts);
  };

  // 4. Resetear a productos de ejemplo
  const resetToDefault = () => {
    console.log('🔄 Restaurando productos originales');
    setProducts([...mockProducts]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProducts));
  };

  return { 
    products, 
    updateProducts, 
    resetToDefault, 
    loading: false // Ya no necesitamos loading porque es instantáneo
  };
}
