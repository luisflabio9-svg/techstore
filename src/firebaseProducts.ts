import { collection, getDocs, doc, writeBatch, deleteDoc } from 'firebase/firestore';
import { db } from './firebase/config'; // ← CORREGIDO: apunta a la carpeta firebase
import { Product } from './types';
import { mockProducts } from './mock-data';

const COLLECTION = 'productos';
const STORAGE_KEY = 'electronicosjapon_products';

export async function loadProducts(): Promise<Product[]> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    if (snapshot.empty) {
      await migrateMockProducts();
      return mockProducts;
    }
    const products = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Product[];
    console.log('✅ Productos cargados desde Firebase:', products.length);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return products;
  } catch (error) {
    console.error('❌ Error Firebase, usando localStorage:', error);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return mockProducts;
  }
}

export async function saveAllProducts(products: Product[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    products.forEach((p) => batch.set(doc(db, COLLECTION, p.id), p));
    await batch.commit();
    console.log('💾 Guardado en Firebase:', products.length);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('❌ Error guardando:', error);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
    console.log('🗑️ Eliminado de Firebase:', id);
  } catch (error) {
    console.error('❌ Error eliminando:', error);
  }
}

async function migrateMockProducts(): Promise<void> {
  try {
    const batch = writeBatch(db);
    mockProducts.forEach((p) => batch.set(doc(db, COLLECTION, p.id), p));
    await batch.commit();
    console.log('✅ Productos migrados a Firebase');
  } catch (error) {
    console.error('❌ Error migrando:', error);
  }
}
