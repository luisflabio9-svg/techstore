import {
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';
import { Product } from '../types';
import { mockProducts } from '../mock-data';

const COLLECTION = 'productos';
const STORAGE_KEY = 'electronicosjapon_products';

export async function loadProducts(): Promise<Product[]> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    if (snapshot.empty) {
      console.log('📦 Colección vacía, cargando productos de ejemplo...');
      await migrateMockProducts();
      return mockProducts;
    }
    const products: Product[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Product[];
    console.log('✅ Productos cargados desde Firebase:', products.length);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return products;
  } catch (error) {
    console.error('❌ Error cargando desde Firebase:', error);
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
    products.forEach((product) => {
      const ref = doc(db, COLLECTION, product.id);
      batch.set(ref, product);
    });
    await batch.commit();
    console.log('💾 Productos guardados en Firebase:', products.length);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('❌ Error guardando en Firebase:', error);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
    console.log('🗑️ Producto eliminado de Firebase:', id);
  } catch (error) {
    console.error('❌ Error eliminando de Firebase:', error);
    throw error;
  }
}

async function migrateMockProducts(): Promise<void> {
  try {
    const batch = writeBatch(db);
    mockProducts.forEach((product) => {
      const ref = doc(db, COLLECTION, product.id);
      batch.set(ref, product);
    });
    await batch.commit();
    console.log('✅ Productos de ejemplo migrados a Firebase');
  } catch (error) {
    console.error('❌ Error migrando productos:', error);
  }
}
