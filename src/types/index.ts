export interface ProductFeature {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  gallery?: string[];
  category: string;
  stock: number;
  rating: number;
  isOffer?: boolean;
  discountPercent?: number;
  features?: ProductFeature[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}
