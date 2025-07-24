# 🚗 Mapa Movilidad

**Mapa Movilidad** es una aplicación web moderna para la gestión de flotas de vehículos en tiempo real, desarrollada con **Next.js**, **TypeScript** y un ecosistema de tecnologías modernas. Permite monitorear ubicaciones en vivo, gestionar conductores y recibir alertas predictivas desde una interfaz adaptable y segura.

---

## ✨ Características

- **Seguimiento GPS en Tiempo Real** – Visualiza las ubicaciones de los vehículos en un mapa interactivo.
- **Gestión de Vehículos** – Registra, actualiza y administra los vehículos de tu flota.
- **Interfaz por Roles** – Paneles diferenciados para administradores y conductores.
- **Sistema de Autenticación** – Inicio de sesión y registro seguro de usuarios.
- **Alertas Predictivas** – Notificaciones automáticas, por ejemplo, de bajo nivel de combustible.
- **Diseño Adaptativo** – Funciona perfectamente en computadoras, tabletas y dispositivos móviles.

---

## 🧰 Tecnologías Utilizadas

### 📦 Frontend

- [**Next.js**](https://nextjs.org/) – Framework React para SSR y SSG.
- [**TypeScript**](https://www.typescriptlang.org/) – Superset tipado de JavaScript.
- [**Tailwind CSS**](https://tailwindcss.com/) – Framework CSS basado en utilidades.
- [**Chakra UI**](https://chakra-ui.com/) y [**Radix UI**](https://www.radix-ui.com/) – Bibliotecas de componentes accesibles y personalizables.
- [**React Leaflet**](https://react-leaflet.js.org/) – Integración de Leaflet para mapas interactivos.
- [**Socket.IO Client**](https://socket.io/docs/v4/client-api/) – Comunicación en tiempo real bidireccional.

### ⚙️ Gestión de Estado y Datos

- [**Zustand**](https://github.com/pmndrs/zustand) – Estado global simple y escalable.
- [**Axios**](https://axios-http.com/) – Cliente HTTP para solicitudes al backend.
- [**React Hook Form**](https://react-hook-form.com/) – Manejo de formularios eficiente y validaciones.

---

## 🚀 Primeros Pasos

Sigue los siguientes pasos para instalar y ejecutar el proyecto localmente.

### ✅ Requisitos Previos

- Node.js v20 o superior
- npm o yarn

### 📥 Instalación

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/JoseFeliciano-spec/MapaInteractivoFrontend.git
   cd MapaInteractivoFrontend
  ``

2. **Instalar las dependencias:**

   ```bash
   npm install --force
   # o con yarn
   yarn install
   ```

### ⚙️ Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
API_URL=http://localhost:8080
```

### ▶️ Ejecutar la Aplicación

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

---

## 🧾 Scripts Disponibles

* `npm run dev` – Ejecuta la aplicación en modo desarrollo.
* `npm run build` – Construye la versión para producción.
* `npm run start` – Inicia la aplicación en modo producción.
* `npm run lint` – Ejecuta el linter para mantener el código limpio.

---

## 🗂️ Estructura del Proyecto

```txt
.
├── public/                   # Archivos estáticos (imágenes, íconos)
├── src/
│   ├── app/                  # Estructura App Router (rutas, layouts)
│   │   ├── (auth)/           # Rutas de login y registro
│   │   ├── @modal/           # Rutas paralelas (modales)
│   │   └── layout.tsx        # Layout raíz de la aplicación
│   ├── components/           # Componentes reutilizables de UI y lógica
│   │   ├── auth/             # Componentes de autenticación
│   │   ├── driver/           # Componentes para conductores
│   │   ├── maps/             # Mapa en tiempo real
│   │   └── ui/               # Elementos UI personalizados
│   ├── actions/              # Acciones del lado del servidor (auth, revalidación)
│   ├── lib/                  # Utilidades y configuraciones compartidas
│   └── store/                # Estado global con Zustand
├── .env.local                # Variables de entorno
├── tailwind.config.ts        # Configuración de Tailwind CSS
├── tsconfig.json             # Configuración de TypeScript
└── next.config.mjs           # Configuración de Next.js
```

---

## 🖼️ Capturas de Pantalla

Agrega aquí las imágenes de tu aplicación para una mejor visualización del producto.

### 🔐 Página de Inicio
<img width="1910" height="925" alt="image" src="https://github.com/user-attachments/assets/238015d3-cf7d-42ef-bd61-8cdd87474943" />

### 🔐 Página de Inicio de sesión
<img width="515" height="612" alt="image" src="https://github.com/user-attachments/assets/fef73cae-2014-4b80-a7eb-be00f993c6c0" />

### 🗺️ Interfaz del inicio y listado
<img width="1919" height="920" alt="image" src="https://github.com/user-attachments/assets/fb401a40-2be1-456d-ad5f-dc5e587e2eb5" />

### 🗺️ Creación del conductor
<img width="1919" height="925" alt="image" src="https://github.com/user-attachments/assets/00884388-f71d-4720-b4c6-c76fcd57734e" />

### 🗺️ Mapa en tiempo Real
<img width="1919" height="914" alt="image" src="https://github.com/user-attachments/assets/6856d60f-7ffa-459d-a9ef-1b16d4264745" />

### 🗺️ Vista del conductor
<img width="1916" height="886" alt="image" src="https://github.com/user-attachments/assets/8ff54ec8-cb04-42b5-86a9-5f3603a24d71" />


---

## 📄 Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

---

## 👨‍💻 Autor

Desarrollado por **@JoseFelicianospec**.
No dudes en contribuir, proponer mejoras o abrir issues.

