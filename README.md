# Ecommerce Epcilon Project

Este proyecto es una aplicación de ecommerce que permite gestionar productos y usuarios con diferentes roles y funcionalidades avanzadas. 

## Características Principales

### Gestión de Productos
- **Agregar Producto**: Permite a los usuarios, premium y administradores agregar nuevos productos.
- **Listar Productos**: Todos los usuarios pueden ver la lista de productos disponibles e incluso los no registrados.
- **Eliminar Producto**: Permite a los administradores eliminar productos y enviar correspondientes mails a los propietarios.

### Gestión de Usuarios
- **Registro y Autenticación**: Los usuarios pueden registrarse e iniciar sesión.
- **Recuperación de Contraseña**: Funcionalidad para recuperar la contraseña mediante correo electrónico.
- **Roles de Usuario**: Hay tres tipos de roles: `Admin`, `Premium` y `User`.
- **Upgrade de Rol**: Los usuarios convencionales pueden cambiar el rol a premium y viceverza.
- **Cambio de Rol**: Los administradores pueden cambiar el rol de los usuarios e incluso crear nuevos admins.

## Jerarquía de Roles
1. **Admin**: Tiene todos los permisos, incluidos los de gestionar usuarios y productos.
2. **Premium**: Puede gestionar sus propios productos y tiene algunas funcionalidades adicionales.
3. **User**: Tiene permisos básicos como ver productos y gestionar su propio perfil.

## Usuarios de Ejemplo

### Administrador
- **Email**: `admin.ad@hotmail.com`
- **Contraseña**: `123`
- **Notas**: Este usuario puede acceder libremente por toda la pagina. Gestiona tanto roles, como eliminaciones tanto de cuentas como productos sin limite.

### Usuario Premium/User
- **Email**: `Pato@gmail.com`
- **Contraseña**: `123`
- **Notas**: Este usuario puede cambiar su rol dentro del perfil.

## Instalación y Configuración

### Prerrequisitos
- Node.js
- MongoDB

## Instalación y Uso

Para instalar y ejecutar el proyecto:

1. Clona este repositorio.
2. Instala las dependencias con `npm install`.
3. Configura las variables de entorno según `example.env`.
4. Inicia el servidor con `npm start`.

### Scripts Disponibles

- `npm start`: Inicia la aplicación en modo de producción.
- `npm run dev`: Inicia la aplicación en modo de desarrollo con Nodemon.

## Uso

### Endpoints Principales

#### Productos
- `GET /products`: Listar todos los productos.
- `POST /products`: Agregar un nuevo producto (requiere autenticación y rol `Admin` o `Premium`).
- `PUT /products/:id`: Actualizar un producto (requiere autenticación y ser el propietario o `Admin`).
- `DELETE /products/:id`: Eliminar un producto (requiere autenticación y ser el propietario o `Admin`).

#### Usuarios
- `POST /api/sessions/login`: Iniciar sesión.
- `POST /api/sessions/register`: Registrar un nuevo usuario.
- `POST /api/sessions/logout`: Cerrar sesión.
- `POST /api/sessions/forgot-password`: Recuperar contraseña.
- `GET /admin/users`: Listar usuarios (requiere autenticación y rol `Admin`).
- `PUT /admin/users/:id/role`: Cambiar el rol de un usuario (requiere autenticación y rol `Admin`).

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor, sigue estos pasos:

1. Haz un fork del proyecto.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añadir nueva funcionalidad'`).
4. Sube tus cambios a tu fork (`git push origin feature/nueva-funcionalidad`).
5. Crea un Pull Request.

---

¡Gracias por visitar mi repositorio! Si tienes alguna pregunta o sugerencia, no dudes en contactarme. Agradezco tu interés y apoyo continuo.
