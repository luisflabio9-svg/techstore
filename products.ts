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

// Cargar todos los productos desde Firebase
export async function loadProducts(): Promise<Product[]> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));

    // Si la colección está vacía, migrar los productos de ejemplo
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

    // Guardar copia en localStorage como respaldo
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return products;

  } catch (error) {
    console.error('❌ Error cargando desde Firebase, usando localStorage:', error);

    // Respaldo: cargar desde localStorage
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

// Guardar o actualizar un producto en Firebase
export async function saveProduct(product: Product): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTION, product.id), product);
    console.log('💾 Producto guardado en Firebase:', product.name);
  } catch (error) {
    console.error('❌ Error guardando en Firebase:', error);
    throw error;
  }
}

// Guardar lista completa de productos en Firebase
export async function saveAllProducts(products: Product[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    products.forEach((product) => {
      const ref = doc(db, COLLECTION, product.id);
      batch.set(ref, product);
    });
    await batch.commit();
    console.log('💾 Todos los productos guardados en Firebase:', products.length);

    // Actualizar respaldo en localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('❌ Error guardando en Firebase, guardando en localStorage:', error);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    throw error;
  }
}

// Eliminar un producto de Firebase
export async function deleteProduct(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
    console.log('🗑️ Producto eliminado de Firebase:', id);
  } catch (error) {
    console.error('❌ Error eliminando de Firebase:', error);
    throw error;
  }
}

// Migrar productos de ejemplo a Firebase (solo primera vez)
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
    console.error('❌ Error migrando productos de ejemplo:', error);
  }
}
