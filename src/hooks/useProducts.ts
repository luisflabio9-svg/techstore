import { useState, useEffect, useCallback } from 'react';
import { getProducts, addProduct as addProductFB, updateProduct as updateProductFB, deleteProduct as deleteProductFB } from '../firebaseProducts';
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

  // Agregar producto (Firebase + estado)
  const addProduct = useCallback(async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      const newProduct = await addProductFB(productData);
      if (newProduct) {
        setProducts(prev => [...prev, newProduct]);
      }
      return newProduct;
    } catch (err) {
      console.error('Error al agregar producto:', err);
      throw err;
    }
  }, []);

  // Actualizar producto (Firebase + estado)
  const updateProduct = useCallback(async (productId: string, productData: Partial<Product>) => {
    try {
      await updateProductFB(productId, productData);
      setProducts(prev =>
        prev.map(p => (p.id === productId ? { ...p, ...productData } : p))
      );
    } catch (err) {
      console.error('Error al actualizar producto:', err);
      throw err;
    }
  }, []);

  // Eliminar producto (Firebase + estado)
  const deleteProduct = useCallback(async (productId: string) => {
    try {
      await deleteProductFB(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      throw err;
    }
  }, []);

  // Reemplazo directo del arreglo (para restaurar o resets masivos)
  const setProductsDirect = useCallback((newProducts: Product[]) => {
    setProducts(newProducts);
  }, []);

  return { products, loading, error, addProduct, updateProduct, deleteProduct, setProducts: setProductsDirect };
}
