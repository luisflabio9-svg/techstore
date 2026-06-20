import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../firebaseProducts';
import { Product } from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos al montar
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError('Error al cargar productos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Función para actualizar la lista de productos (usada por AdminPanel)
  const updateProducts = useCallback((newProducts: Product[]) => {
    setProducts(newProducts);
  }, []);

  return { products, loading, error, updateProducts };
}
