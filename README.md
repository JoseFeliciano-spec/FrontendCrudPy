# 📦 Aplicación de Gestión de Productos (frontendcrudpy)

**Aplicación de Gestión de Productos** es una aplicación web moderna para administrar un catálogo de productos, desarrollada con **Next.js**, **TypeScript** y un stack de tecnologías frontend modernas. Permite a los usuarios realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en productos a través de una interfaz segura, responsiva e intuitiva.

---

## ✨ Características

- **Gestión Completa de Productos** – Crea, visualiza, actualiza y elimina productos con facilidad.
- **Múltiples Vistas de Diseño** – Cambia entre una vista de **Tabla** detallada, una cuadrícula visual de **Tarjetas** y una vista de **Formulario** dedicada para gestionar productos.
- **Interfaz con Estado** – La aplicación recuerda tu diseño de vista preferido.
- **Autenticación Segura** – Sistema seguro de inicio de sesión y registro de usuarios.
- **Modales y Diálogos Interactivos** – Experiencia de usuario optimizada para crear, editar y confirmar acciones.
- **Manejo de Datos en el Cliente** – Obtención de datos y gestión de estado eficientes con TanStack Query y Zustand.
- **Diseño Responsivo** – Totalmente funcional en computadoras de escritorio, tabletas y dispositivos móviles.

---

## 🧰 Tecnologías Utilizadas

### 📦 Frontend

- [**Next.js**](https://nextjs.org/) – Framework de React para renderizado del lado del servidor y generación de sitios estáticos.
- [**TypeScript**](https://www.typescriptlang.org/) – Superconjunto de JavaScript con tipado estático.
- [**Tailwind CSS**](https://tailwindcss.com/) – Un framework de CSS "utility-first" para un desarrollo rápido de la interfaz de usuario.
- [**Radix UI**](https://www.radix-ui.com/) – Componentes accesibles y sin estilos para construir sistemas de diseño de alta calidad.
- [**Lucide React**](https://lucide.dev/) – Una librería de íconos hermosa y consistente.

### ⚙️ Gestión de Estado y Datos

- [**TanStack Query**](https://tanstack.com/query/latest) – Potente gestor de estado asíncrono para obtener, cachear y actualizar datos.
- [**Zustand**](https://github.com/pmndrs/zustand) – Una solución de gestión de estado pequeña, rápida y escalable.
- [**Axios**](https://axios-http.com/) – Cliente HTTP basado en promesas para realizar peticiones al backend.

### 📋 Formularios

- [**React Hook Form**](https://react-hook-form.com/) – Formularios eficientes, flexibles y extensibles con validación fácil de usar.
- [**Zod**](https://zod.dev/) – Librería para declaración y validación de esquemas "TypeScript-first".

---

## 🚀 Primeros Pasos

Sigue estos pasos para instalar y ejecutar el proyecto localmente.

### ✅ Prerrequisitos

- Node.js v20 o superior
- npm o yarn

### 📥 Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone <your-repository-url>
    cd frontendcrudpy
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    # o con yarn
    yarn install
    ```

### ⚙️ Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
API_URL=http://localhost:8080
```

### ▶️ Ejecuta la Aplicación

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

---

## 🧾 Scripts Disponibles

-   `npm run dev` – Ejecuta la aplicación en modo de desarrollo.
-   `npm run build` – Compila la aplicación para producción.
-   `npm run start` – Inicia un servidor de producción.
-   `npm run lint` – Ejecuta el linter para verificar la calidad del código.

---

## 🗂️ Estructura del Proyecto

```txt
.
├── public/                   # Archivos estáticos (imágenes, íconos)
├── src/
│   ├── app/                  # Estructura de App Router (rutas, layouts)
│   │   ├── (auth)/           # Rutas de autenticación (login, registro)
│   │   ├── @modal/           # Rutas interceptadas para modales
│   │   └── layout.tsx        # Layout raíz de la aplicación
│   ├── components/           # Componentes de UI y lógica reutilizables
│   │   ├── auth/             # Componentes relacionados con la autenticación
│   │   ├── product/          # Componentes de gestión de productos (manager, formularios)
│   │   └── ui/               # Elementos de UI genéricos (botones, diálogos, etc.)
│   ├── actions/              # Server Actions (auth, revalidación)
│   ├── hooks/                # Hooks personalizados (ej., useProducts)
│   ├── lib/                  # Utilidades y configuraciones compartidas (axios)
│   └── store/                # Estado global con Zustand
├── .env.local                # Variables de entorno locales
├── tailwind.config.ts        # Configuración de Tailwind CSS
├── tsconfig.json             # Configuración de TypeScript
└── next.config.mjs           # Configuración de Next.js
```

---

## 🖼️ Capturas de Pantalla

### Página de Inicio
<img width="1919" height="927" alt="image" src="https://github.com/user-attachments/assets/494221f2-6073-4a7f-867b-934512674b35" />

### Página de registro
<img width="1919" height="922" alt="image" src="https://github.com/user-attachments/assets/cc37a8d2-5bcf-4990-8d1c-effd63928217" />

### Página de Login
<img width="1918" height="928" alt="image" src="https://github.com/user-attachments/assets/307f418a-e144-4634-b15a-9271178f0c9b" />

### Página de Home - Logueado - Tabla
<img width="1919" height="919" alt="image" src="https://github.com/user-attachments/assets/c571c0a9-ccff-43a3-8a8c-12ecbea23c7e" />

### Página de Home - Logueado - Card
<img width="1919" height="914" alt="image" src="https://github.com/user-attachments/assets/69e89e00-0d38-4ee8-816a-ea616f2b1b92" />

### Crear producto - Modal - Crear Step 1 
<img width="1912" height="927" alt="image" src="https://github.com/user-attachments/assets/58181891-d578-4e1d-886a-ea056adbea77" />

### Crear producto - Modal - Crear Step 2
<img width="1919" height="922" alt="image" src="https://github.com/user-attachments/assets/560481c9-b3a3-426a-a648-a0b6e7e072b3" />

### Crear producto - Modal - Crear Step 3
<img width="1919" height="913" alt="image" src="https://github.com/user-attachments/assets/1df0148b-e52b-4972-b640-4bff76660e1d" />

### Página de Home - Logueado - Formulario
<img width="1919" height="919" alt="image" src="https://github.com/user-attachments/assets/b0291cd8-f851-4bdd-a899-b3e34b14c6ae" />

### Página de Home -  Formulario - Crear Step 1
<img width="1907" height="932" alt="image" src="https://github.com/user-attachments/assets/16a2b828-dc37-4de6-aae4-e752058f63a3" />

### Página de Home - Formulario - Editar Step 1
<img width="1919" height="920" alt="image" src="https://github.com/user-attachments/assets/1b9069ce-5123-4584-b857-f13659581232" />

---

## 📄 Licencia

Este proyecto está bajo la [Licencia MIT](LICENSE) y creado por Jose Feliciano.
