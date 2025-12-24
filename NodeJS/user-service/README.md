# User Service (DDD)

Este proyecto es un microservicio para la gestión de usuarios, desarrollado con **Node.js**, **Express** y **TypeScript**, implementando una arquitectura basada en **Domain-Driven Design (DDD)**.

## 🚀 Características

- **Gestión de Usuarios**: Operaciones CRUD (Crear, Listar, Consultar por ID, Eliminar).
- **Arquitectura Limpia**: Separación de responsabilidades en Capas (Dominio, Aplicación, Infraestructura).
- **Documentación API**: Swagger UI integrado para explorar y probar los endpoints.
- **Base de Datos**: Persistencia en MongoDB.
- **TypeScript**: Código tipado para mayor robustez y mantenibilidad.

## 🛠️ Tecnologías

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)

## 📋 Prerrequisitos

Asegúrate de tener instalado:
- **Node.js**: (v16 o superior)
- **Yarn**: (o NPM)
- **MongoDB**: Instancia local o remota en ejecución.

## ⚙️ Configuración

1.  Clonar el repositorio o descargar el código.
2.  Instalar las dependencias usando Yarn:

    ```bash
    yarn install
    ```

3.  Crear un archivo `.env` en la raíz del proyecto. Puedes usar el siguiente ejemplo como referencia:

    ```env
    PORT=3800
    MONGODB_URI=mongodb://localhost:27017/user-service-db
    ```

    *Asegúrate de ajustar `MONGODB_URI` a tu configuración local o remota.*

## ▶️ Ejecución

### Modo Desarrollo
Para ejecutar el servidor con `nodemon` (recarga automática al hacer cambios):

```bash
yarn dev
```

### Modo Producción
Para compilar el código TypeScript y ejecutar la versión optimizada:

```bash
yarn build
yarn start
```


## 🧪 Pruebas

El proyecto cuenta con pruebas unitarias implementadas con **Jest** y **ts-jest**, siguiendo prácticas de **TDD (Test Driven Development)** y **BDD (Behavior Driven Development)**.

### Ejecutar Pruebas
Para ejecutar el set de pruebas unitarias:

```bash
yarn test
```

Esto ejecutará los tests ubicados en `tests/` y mostrará un reporte en la consola.

## 📚 Documentación de la API

Una vez que el servicio esté en ejecución (por defecto en el puerto 3800), puedes acceder a la documentación interactiva en:

👉 [http://localhost:3800/api-docs](http://localhost:3800/api-docs)

Aquí podrás ver todos los endpoints disponibles, sus parámetros y probar las peticiones directamente.


## 🛡️ Seguridad y Auditoría

Este proyecto ha sido sometido a un análisis estático de dependencias para identificar vulnerabilidades conocidas.

- **Herramienta**: Auditoría de dependencias (`npm/yarn audit`).
- **Estado**: ✅ **SEGURO** (0 vulnerabilidades críticas/altas detectadas).
- **Informe Detallado**: Consultar el archivo [SHADOWMAP.md](./SHADOWMAP.md) para ver el desglose de componentes y el estado de auditoría.

## 🏗️ Estructura del Proyecto

El proyecto sigue una estructura de directorios alineada con DDD:

```
src/
├── application/       # Lógica de negocio y casos de uso
├── domain/            # Entidades del dominio e interfaces de repositorios
├── infrastructure/    # Implementaciones técnicas (BD, Servidor Web, etc.)
│   ├── persistence/   # Conexión y repositorios de MongoDB
│   └── web/           # Controladores, rutas y configuración de Express
├── config/            # Configuraciones globales (Database, etc.)
├── docs/              # Definiciones de Swagger/OpenAPI
└── index.ts           # Punto de entrada de la aplicación
```


## 👨‍💻 Desarrollador

- **Nombre**: Alexander Rubio Cáceres
- **Rol**: Ingeniero de Software | Especialista en Seguridad de la Información | Desarrollador FullStack | Líder Técnico | Arquitecto de Soluciones
