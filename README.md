# FeliInventorys App

Bienvenido a **FeliInventory**, una aplicación de gestión de inventario robusta y moderna construida con **Next.js** versión 14 en el frontend. Esta aplicación permite a los administradores gestionar productos y su inventario de manera eficiente a través de una interfaz intuitiva que se conecta con un backend potente en NestJS.

## Demo

Puedes acceder a la aplicación en vivo en los siguientes enlaces:  
[Frontend - FeliInventorys](https://feli-inventory-frontend.vercel.app)  
[Backend - API](https://feliinventorybackend.onrender.com/docs)

## Características

- **Gestión de Productos**
  - Crear nuevos productos con SKU único
  - Actualizar información de productos existentes
  - Eliminar productos del inventario
  - Visualizar lista completa de productos

- **Control de Inventario**
  - Registrar entradas y salidas de stock
  - Seguimiento en tiempo real del inventario
  - Histórico de movimientos
  - Alertas automáticas de stock bajo

- **Interfaz Intuitiva**
  - Diseño responsive y moderno
  - Navegación fluida entre secciones
  - Feedback inmediato de acciones
  - Validaciones en tiempo real

## Imágenes de Referencia

### Vista principal de la aplicación
![image](https://github.com/user-attachments/assets/9821fbe8-301b-469c-9600-7f492b35a465)

### Ejemplo de la página con los productos
![image](https://github.com/user-attachments/assets/52a6f404-90b9-4d81-88f3-29361afadf59)

### Formulario de creación de productos
![image](https://github.com/user-attachments/assets/9b566b25-b87c-4b95-a924-2f27515bf314)

### Ejemplo de la página de los movimientos del inventario
![image](https://github.com/user-attachments/assets/28db9aa4-47c4-461c-b0e4-8bb45ddd2eda)

### Formulario de creación de movimientos
![image](https://github.com/user-attachments/assets/769da044-9200-4c0a-8c40-dda30494f2aa)


## Tecnologías Utilizadas

- **Frontend:**
  - Next.js 14 (con Server Actions)
  - React
  - Tailwind CSS
  - TypeScript
  - SWR para fetching de datos
  - YUP + REACT HOOK FORM

- **Hosting:**
  - Vercel (Frontend)
  - Render (Backend)

## Requisitos Especiales

El proyecto utiliza **Server Actions** de Next.js 14, por lo que es necesario tener en cuenta:

- Habilitar Server Actions en la configuración
- Usar `'use server'` al inicio de las acciones del servidor
- Configurar correctamente las variables de entorno

## Instalación Local

### Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Git

### Pasos de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tuusuario/feli-inventory.git
   cd feli-inventory
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crear archivo `.env.local` en la raíz del proyecto:
   ```plaintext
   API_URL = http://localhost:8080
   ```

4. **Iniciar el proyecto en desarrollo:**
   ```bash
   npm run dev
   ```

5. **Acceder a la aplicación:**
   Abrir [http://localhost:3000](http://localhost:3000) en el navegador


## Uso de la Aplicación

1. **Gestión de Productos:**
   - Accede a la sección de productos
   - Usa el formulario para crear nuevos productos
   - Edita o elimina productos existentes
   - Visualiza el stock actual

2. **Movimientos de Inventario:**
   - Registra entradas de nuevo stock
   - Documenta salidas de productos
   - Consulta el histórico de movimientos
   - Monitorea alertas de stock bajo

## Desarrollo y Contribución

1. Crear una rama para nuevas características:
   ```bash
   git checkout -b feature/nueva-caracteristica
   ```

2. Realizar cambios y commits:
   ```bash
   git commit -m "Descripción del cambio"
   ```

3. Subir cambios y crear Pull Request:
   ```bash
   git push origin feature/nueva-caracteristica
   ```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia la aplicación en modo producción
- `npm run lint` - Ejecuta el linter
- `npm run test` - Ejecuta las pruebas

## Soporte

Para reportar problemas o solicitar nuevas características, por favor:
1. Revisa los issues existentes
2. Crea un nuevo issue con detalles específicos
3. Sigue la plantilla proporcionada

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.
