import { useState, useEffect } from 'react';
import { Product } from '../types';
import { mockProducts } from '../mock-data';
import { loadProducts, saveAllProducts } from '../firebaseProducts';

const STORAGE_KEY = 'electronicosjapon_products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 Cargando productos desde Firebase...');
    loadProducts()
      .then((firebaseProducts) => {
        console.log('✅ Productos recibidos:', firebaseProducts.length);
        setProducts(firebaseProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error('❌ Error:', error);
        // Respaldo localStorage
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setProducts(parsed);
              return;
            }
          }
        } catch {}
        setProducts(mockProducts);
        setLoading(false);
      });
  }, []);

  const updateProducts = async (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
    try {
      await saveAllProducts(newProducts);
      console.log('💾 Guardado en Firebase:', newProducts.length);
    } catch (error) {
      console.error('❌ Error guardando en Firebase:', error);
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
