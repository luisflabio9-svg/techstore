import { Product } from '../types';

const STORAGE_KEY = 'techstore-products';

export function loadProducts(): Product[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log('✅ Productos cargados de localStorage:', parsed.length);
        return parsed;
      }
    }
  } catch (error) {
    console.error('❌ Error al cargar:', error);
  }
  console.log('📦 localStorage vacío, se usarán datos mock');
  return [];
}

export function saveProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    console.log('💾 Productos guardados:', products.length);
  } catch (error) {
    console.error('❌ Error al guardar:', error);
  }
}

export function clearProducts(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ localStorage limpiado');
  } catch (error) {
    console.error('❌ Error al limpiar:', error);
  }
}
