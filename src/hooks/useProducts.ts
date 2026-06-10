import { useState, useEffect } from 'react';
import { Product } from '../types';
import { mockProducts } from '../mock-data';
import { loadProducts, saveAllProducts } from '../firebaseProducts';

const STORAGE_KEY = 'electronicosjapon_products';

export function useProducts() {
  // Carga rápida inicial desde localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('📦 Carga inicial desde localStorage:', parsed.length);
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error cargando localStorage:', error);
    }
    console.log('📦 Usando productos de ejemplo');
    return mockProducts;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos de Firebase al iniciar
  useEffect(() => {
    console.log('🔥 Intentando cargar de Firebase...');
    loadProducts()
      .then((firebaseProducts) => {
        console.log('✅ Productos cargados de Firebase:', firebaseProducts.length);
        setProducts(firebaseProducts);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(firebaseProducts));
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        console.error('❌ Error cargando Firebase:', err);
        console.log('⚠️ Usando datos locales como respaldo');
        setError('Usando datos locales - Firebase no disponible');
        setLoading(false);
      });
  }, []);

  // Actualizar productos (guarda en Firebase y localStorage)
  const updateProducts = async (newProducts: Product[]) => {
    console.log('🔄 Actualizando', newProducts.length, 'productos');
    
    // Actualizar estado inmediatamente
    setProducts(newProducts);
    
    // Respaldo en localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));

    // Guardar en Firebase
    try {
      await saveAllProducts(newProducts);
      console.log('✅ Guardado en Firebase exitoso');
      setError(null);
    } catch (err) {
      console.error('❌ Error guardando en Firebase:', err);
      setError('Guardado solo local - Sin conexión a Firebase');
    }
  };

  // Resetear a productos originales
  const resetToDefault = async () => {
    console.log('🔄 Restaurando productos originales');
    setProducts([...mockProducts]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProducts));
    try {
      await saveAllProducts(mockProducts);
      console.log('✅ Reset en Firebase exitoso');
    } catch (err) {
      console.error('❌ Error reset en Firebase:', err);
    }
  };

  return { 
    products, 
    updateProducts, 
    resetToDefault, 
    loading,
    error 
  };
}
