import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebaseConfig';
import { Product } from './types';

// ==========================================
// OBTENER TODOS LOS PRODUCTOS
// ==========================================
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
    throw error;
  }
};

// ==========================================
// OBTENER PRODUCTOS POR CATEGORÍA
// ==========================================
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, 'productos'),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    
    return products;
  } catch (error) {
    console.error('Error obteniendo productos por categoría:', error);
    throw error;
  }
};

// ==========================================
// OBTENER PRODUCTOS DESTACADOS
// ==========================================
export const getFeaturedProducts = async (limitCount: number = 8): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, 'productos'),
      where('featured', '==', true),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    
    return products;
  } catch (error) {
    console.error('Error obteniendo productos destacados:', error);
    throw error;
  }
};

// ==========================================
// AGREGAR PRODUCTO
// ==========================================
export const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
  try {
    const newProduct = {
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const docRef = await addDoc(collection(db, 'productos'), newProduct);
    
    return {
      id: docRef.id,
      ...newProduct,
    } as Product;
  } catch (error) {
    console.error('Error agregando producto:', error);
    throw error;
  }
};

// ==========================================
// ACTUALIZAR PRODUCTO
// ==========================================
export const updateProduct = async (productId: string, productData: Partial<Product>): Promise<void> => {
  try {
    const productRef = doc(db, 'productos', productId);
    
    await updateDoc(productRef, {
      ...productData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    throw error;
  }
};

// ==========================================
// ELIMINAR PRODUCTO
// ==========================================
export const deleteProduct = async (productId: string, imageUrl?: string): Promise<void> => {
  try {
    // Eliminar documento de Firestore
    await deleteDoc(doc(db, 'productos', productId));
    
    // Eliminar imagen de Storage si existe
    if (imageUrl) {
      try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      } catch (imageError) {
        console.warn('No se pudo eliminar la imagen:', imageError);
      }
    }
  } catch (error) {
    console.error('Error eliminando producto:', error);
    throw error;
  }
};

// ==========================================
// SUBIR IMAGEN A STORAGE
// ==========================================
export const uploadProductImage = async (file: File, productId: string): Promise<string> => {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `productos/${productId}-${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, fileName);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    throw error;
  }
};

// ==========================================
// BUSCAR PRODUCTOS
// ==========================================
export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, 'productos'),
      orderBy('name'),
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff')
    );
    
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    
    return products;
  } catch (error) {
    console.error('Error buscando productos:', error);
    throw error;
  }
};
