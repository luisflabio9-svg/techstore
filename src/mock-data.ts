import { Product } from "./types";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Báscula Digital 5kg",
    description: "Báscula digital de cocina con recipiente plástico",
    price: 45000,
    image: "https://images.unsplash.com/photo-1526408529623-e2b69802b2a8?w=500&q=80",
    gallery: [],
    category: "Básculas Digitales",
    stock: 100,
    rating: 4.9,
    isOffer: false,
    features: [
      { key: "Capacidad", value: "5 kg" },
      { key: "Precisión", value: "1 g" },
      { key: "Material", value: "Plástico" },
      { key: "Garantía", value: "6 meses" },
    ],
  },
  {
    id: "2",
    name: "Kit Herramientas 11 piezas",
    description: "Maletín con 11 herramientas básicas para el hogar",
    price: 65000,
    image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500&q=80",
    gallery: [],
    category: "Herramientas",
    stock: 25,
    rating: 4.7,
    isOffer: false,
    features: [
      { key: "Piezas", value: "11" },
      { key: "Incluye", value: "Martillo, alicates, destornilladores" },
      { key: "Garantía", value: "6 meses" },
    ],
  },
];

export const categories = [
  "Todas",
  "Televentas",
  "Soporte de TV",
  "Ofertas",
  "Accesorios de Celular",
  "Parlantes",
  "Accesorios de Videojuego",
  "Juguetería",
  "Motos",
  "Scooters Eléctricos",
  "Selladoras de Bolsa",
  "Herramientas",
  "Linternas",
  "Básculas Digitales",
  "Hogar",
];
