# 🛍️ TechStore - E-commerce de Tecnología

E-commerce moderno de tecnología construido con **React**, **TypeScript**, **Tailwind CSS** y **Vite**.

## 🚀 Características

✅ **Catálogo de Productos** - Navegación intuitiva y filtros avanzados  
✅ **Carrito de Compras** - Gestión completa del carrito  
✅ **Panel Administrativo** - Crear, editar y eliminar productos  
✅ **Diseño Responsivo** - Funciona perfectamente en móvil, tablet y desktop  
✅ **Interfaz Moderna** - Diseño limpio con Tailwind CSS  
✅ **Totalmente Gratis** - Sin dependencias de pago

## 📋 Requisitos Previos

- **Node.js** 16.x o superior
- **npm** o **yarn**

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/luisflabio9-svg/techstore.git
cd techstore
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

### 4. Compilar para producción
```bash
npm run build
```

### 5. Vista previa de producción
```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── components/        # Componentes reutilizables
├── pages/            # Páginas principales
│   ├── HomePage.tsx
│   ├── ProductsPage.tsx
│   ├── CartPage.tsx
│   └── AdminPanel.tsx
├── types/            # Interfaces TypeScript
│   └── index.ts
├── lib/              # Utilidades
│   └── utils.ts
├── mock-data.ts      # Datos de ejemplo
├── App.tsx           # Componente raíz
├── main.tsx          # Punto de entrada
└── index.css         # Estilos globales
```

## 🛒 Cómo Usar

### Como Cliente
1. **Ver Productos** - Navega a la sección "Productos"
2. **Filtrar** - Usa los filtros por categoría, precio y búsqueda
3. **Agregar al Carrito** - Haz clic en "Agregar"
4. **Gestionar Carrito** - Modifica cantidades o elimina productos
5. **Pagar** - Procede al pago (interfaz de ejemplo)

### Como Admin
1. **Acceder** - Haz clic en el botón "Admin"
2. **Agregar Producto** - Rellena el formulario
3. **Editar** - Modifica productos existentes
4. **Eliminar** - Elimina productos del catálogo

## 💻 Tecnologías Utilizadas

- **React 18** - UI Library
- **TypeScript** - Lenguaje tipado
- **Tailwind CSS** - Framework de estilos
- **Vite** - Build tool ultrarrápido
- **Lucide React** - Iconos modernos
- **clsx & tailwind-merge** - Utilidades CSS

## 🎨 Características de Diseño

- Paleta de colores moderna (Indigo/Purple)
- Componentes reutilizables
- Estados de carga y vacío
- Animaciones suaves
- Tipografía clara y legible
- Espaciado consistente

## 📱 Compatibilidad

✅ Chrome (últimas 2 versiones)  
✅ Firefox (últimas 2 versiones)  
✅ Safari (últimas 2 versiones)  
✅ Edge (últimas 2 versiones)  
✅ Móvil (iOS/Android)

## 🚀 Despliegue Gratuito

### Opción 1: Vercel (RECOMENDADO)
```bash
npm install -g vercel
vercel
```

### Opción 2: Netlify
```bash
npm run build
# Sube la carpeta 'dist' a Netlify
```

### Opción 3: GitHub Pages
```bash
npm run build
git add .
git commit -m "Deploy"
git push origin main
```

## 📝 Licencia

MIT - Libre para usar en proyectos personales y comerciales.

## 👨‍💻 Autor

**Luis Flabio** - [@luisflabio9-svg](https://github.com/luisflabio9-svg)

## 💬 Soporte

Si tienes preguntas o sugerencias, abre un issue en el repositorio.

---

**¡Hecho con ❤️ y totalmente gratis!**
