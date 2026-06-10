import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc,
  writeBatch 
} from 'firebase/firestore';
import { db } from './firebase/config';
import { Product } from '../types';
import { mockProducts } from '../mock-data';

const COLLECTION_NAME = 'products';

// Cargar todos los productos de Firebase
export async function loadProducts(): Promise<Product[]> {
  try {
    console.log('🔄 Conectando a Firebase...');
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    
    if (querySnapshot.empty) {
      console.log('📭 Firestore vacío. Migrando productos iniciales...');
      await saveAllProducts(mockProducts);
      return mockProducts;
    }

    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));

    console.log('✅ Productos cargados de Firebase:', products.length);
    return products;
  } catch (error) {
    console.error('❌ Error al cargar de Firebase:', error);
    throw error;
  }
}

// Guardar un solo producto
export async function saveProduct(product: Product): Promise<void> {
  try {
    console.log('💾 Guardando producto:', product.name);
    await setDoc(doc(db, COLLECTION_NAME, product.id), product);
    console.log('✅ Producto guardado en Firebase');
  } catch (error) {
    console.error('❌ Error al guardar producto:', error);
    throw error;
  }
}

// Guardar todos los productos
export async function saveAllProducts(products: Product[]): Promise<void> {
  try {
    console.log('💾 Guardando', products.length, 'productos en Firebase...');
    
    const batch = writeBatch(db);
    
    products.forEach((product) => {
      const docRef = doc(db, COLLECTION_NAME, product.id);
      batch.set(docRef, product);
    });

    await batch.commit();
    console.log('✅ Todos los productos guardados en Firebase');
  } catch (error) {
    console.error('❌ Error al guardar en Firebase:', error);
    throw error;
  }
}

// Eliminar un producto
export async function deleteProduct(productId: string): Promise<void> {
  try {
    console.log('🗑️ Eliminando producto:', productId);
    await deleteDoc(doc(db, COLLECTION_NAME, productId));
    console.log('✅ Producto eliminado de Firebase');
  } catch (error) {
    console.error('❌ Error al eliminar:', error);
    throw error;
  }
}
