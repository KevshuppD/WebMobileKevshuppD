# Biblioteca Digital de Cursos

Proyecto de Web Mobile - Kevin Castro

## Descripción

Esta es una aplicación web para gestionar una biblioteca digital de cursos. Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre cursos, instructores, estudiantes e inscripciones.

La aplicación está dividida en dos servidores:
- **Backend**: API REST construida con Node.js, Express, TypeScript y MongoDB.
- **Frontend**: Interfaz de usuario simple servida por un servidor Express, utilizando HTML, CSS y JavaScript vanilla.

## Características

- ✅ CRUD completo para Cursos
- ✅ CRUD completo para Instructores
- ✅ CRUD completo para Estudiantes
- ✅ CRUD completo para Inscripciones
- ✅ Interfaz web intuitiva
- ✅ API RESTful
- ✅ Base de datos MongoDB

## Requisitos

- Node.js (versión 18 o superior)
- MongoDB (local o en la nube, como MongoDB Atlas)
- npm o yarn

## Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/KevshuppD/WebMobileKevshuppD.git
cd WebMobileKevshuppD
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

#### Configurar la base de datos
Edita el archivo `backend/.env` y establece la URI de MongoDB:
```
MONGODB_URI=mongodb+srv://tu_usuario:tu_password@cluster.mongodb.net/tu_base_datos
```

#### Compilar y ejecutar
```bash
npm run build
npm start
```
El backend se ejecutará en http://localhost:3000

### 3. Configurar el Frontend

```bash
cd ../frontend
npm install
npm start
```
El frontend se ejecutará en http://localhost:3001

## Uso

1. Abre http://localhost:3001 en tu navegador
2. Usa los botones para navegar entre las secciones de Cursos, Instructores, Estudiantes e Inscripciones
3. Realiza operaciones CRUD según necesites

## API Endpoints

### Cursos
- GET /api/cursos - Listar todos los cursos
- POST /api/cursos - Crear un nuevo curso
- PUT /api/cursos/:id - Actualizar un curso
- DELETE /api/cursos/:id - Eliminar un curso

### Instructores
- GET /api/instructores - Listar todos los instructores
- POST /api/instructores - Crear un nuevo instructor
- PUT /api/instructores/:id - Actualizar un instructor
- DELETE /api/instructores/:id - Eliminar un instructor

### Estudiantes
- GET /api/estudiantes - Listar todos los estudiantes
- POST /api/estudiantes - Crear un nuevo estudiante
- PUT /api/estudiantes/:id - Actualizar un estudiante
- DELETE /api/estudiantes/:id - Eliminar un estudiante

### Inscripciones
- GET /api/inscripciones - Listar todas las inscripciones
- POST /api/inscripciones - Crear una nueva inscripción
- PUT /api/inscripciones/:id - Actualizar una inscripción
- DELETE /api/inscripciones/:id - Eliminar una inscripción

## Estructura del Proyecto

```
WebMobileKevshuppD/
├── backend/
│   ├── src/
│   │   ├── app.ts
│   │   ├── seed.ts
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── models/
│   │   │   ├── Curso.ts
│   │   │   ├── Estudiante.ts
│   │   │   ├── Instructor.ts
│   │   │   └── Inscripcion.ts
│   │   └── routes/
│   │       ├── cursos.ts
│   │       ├── estudiantes.ts
│   │       ├── inscripciones.ts
│   │       └── instructores.ts
│   ├── dist/
│   ├── .env
│   ├── package.json
│   ├── tsconfig.json
│   └── eslint.config.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── server.js
│   └── package.json
├── .git/
├── .gitignore
├── .gitattributes
└── README.md
```

## Tecnologías Utilizadas

- **Backend**: Node.js, Express.js, TypeScript, MongoDB, Mongoose
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Herramientas**: ESLint, Nodemon

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE.txt` para más detalles.

## Autor

Kevin Castro - KevshuppD</content>
<parameter name="filePath">d:\Web Mobile\WebMobileKevshuppD\README.md