import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Product } from './types';

export const getProducts = async (): Promise<Product[]> => {
  try {
    const q = query(collection(db, 'productos'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    return products;
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return [];
  }
};

export const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product | null> => {
  try {
    const newProduct = {
      ...productData,
      createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, 'productos'), newProduct);
    return { id: docRef.id, ...newProduct } as Product;
  } catch (error) {
    console.error('Error agregando producto:', error);
    return null;
  }
};

export const updateProduct = async (productId: string, productData: Partial<Product>): Promise<void> => {
  try {
    const productRef = doc(db, 'productos', productId);
    await updateDoc(productRef, productData);
  } catch (error) {
    console.error('Error actualizando producto:', error);
  }
};

export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'productos', productId));
  } catch (error) {
    console.error('Error eliminando producto:', error);
  }
};
