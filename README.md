# Todo App

Bienvenido a **Felitasks**, una aplicación de lista de tareas (To-Do) creada con **Next.js** versión 14 en el frontend y **NestJS** en el backend. Esta aplicación permite a los usuarios gestionar sus tareas de manera fácil y rápida a través de una interfaz intuitiva y un backend escalable. Este proyecto utiliza **Server Actions** en Next.js, por lo que es necesario habilitarlas.

## Demo

Puedes acceder a la aplicación en vivo en el siguiente enlace:  
[Frontend - Todo App](https://todo-frontend-next-puce.vercel.app/)

> **Nota:** Para iniciar el backend, ya que está alojado en Render y puede estar en modo de suspensión, visita esta URL para activar el servidor:  
> [Backend - Todo API](https://todo-backend-nest-jjq1.onrender.com/)

## Características

- **Crear tareas:** Agrega nuevas tareas a tu lista.
- **Marcar como completadas:** Marca tareas como completadas a medida que avanzas.
- **Eliminar tareas:** Elimina tareas que ya no necesitas.
- **Persistencia de datos:** La aplicación guarda tus tareas para que puedas acceder a ellas en cualquier momento.

## Tecnologías Utilizadas

- **Frontend:** Next.js 14 (con Server Actions), React
- **Backend:** NestJS
- **Hosting:** Vercel (Frontend) y Render (Backend)

## Requisitos Especiales

Debido a que el proyecto utiliza **Server Actions** en Next.js 14, es importante habilitarlas en tu configuración. Asegúrate de tener las Server Actions activadas en tu entorno de desarrollo y producción para un funcionamiento correcto. Deben colocar `'use server'` al inicio de las acciones que requieran ejecutar en el servidor.

## Imágenes de Referencia

### Vista principal de la aplicación
![Vista Principal]!![3](https://github.com/user-attachments/assets/4565e269-8222-47d4-8e44-646548b5a7f8)

### Ejemplo de tareas completadas
![Tareas Completadas]![1](https://github.com/user-attachments/assets/beb2a9dc-36b9-48ab-aa79-20b0af18d0ad)


### Formulario de creación de tareas
![Formulario de Tareas]![2](https://github.com/user-attachments/assets/c0b35904-f80a-4ef3-bd32-4bbad33fc61c)


## Instalación Local

Si deseas ejecutar esta aplicación localmente, sigue los pasos a continuación.

### Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tuusuario/todo-app.git
   cd todo-app
   ```
2. **Instala las dependencias:**
   ```bash
     cd frontend
    npm install
   ```
3. **Inicia el repositorio:**
  ```bash
  npm run dev

  ```
### Uso aplicativo
0. Inicia el Backend que se encuentra en mi repositorio o usa el remoto.
1. Asegúrate de configurar la variable de entorno `API_URL` en el archivo `.env.local` dentro de la carpeta `frontend`:
   ```plaintext
   API_URL=https://todo-backend-nest-jjq1.onrender.com/
   ```
2. Accede a http://localhost:3000 en tu navegador.
3. Crea, marca como completadas o elimina tareas según lo necesites.
