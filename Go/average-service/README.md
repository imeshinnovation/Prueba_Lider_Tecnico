# Average Service

Servicio desarrollado en Go para calcular el promedio de una lista de números. Este proyecto demuestra una arquitectura limpia, manejo de errores robusto, validaciones y configuración lista para producción.

## Características

- 🚀 **API RESTful** con Gin Framework
- 📝 **Logging estructurado** con Zerolog
- 🛡️ **Validación de datos** con go-playground/validator
- ⚙️ **Configuración flexible** mediante variables de entorno
- 🐳 **Soporte Docker** y Docker Compose incluido
- 🔍 **Health Checks** y recuperación de pánicos

## Requisitos

- Go 1.23+
- Docker & Docker Compose (Opcional)

## Instalación y Ejecución

### Localmente

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   go mod download
   ```
3. Ejecutar el servidor:
   ```bash
   go run cmd/server/main.go
   ```

El servidor iniciará en el puerto `3801` por defecto.

### Con Docker Compose

Para levantar el servicio aislado en un contenedor:

```bash
docker-compose up -d --build
```

## Uso de la API

### 1. Calcular Promedio

Calcula la media aritmética de un arreglo de números.

**Endpoint:** `POST /api/v1/average`

**Ejemplo de Solicitud:**

```bash
curl -X POST http://localhost:3801/api/v1/average \
  -H "Content-Type: application/json" \
  -d '{"numbers": [10, 20, 30, 40]}'
```

**Body JSON:**
```json
{
  "numbers": [10, 20, 30, 40]
}
```

**Respuesta Exitosa (200 OK):**
```json
{
  "average": 25
}
```

**Errores Comunes:**
- Arreglo vacío o faltante.
- Valores no numéricos.

### 2. Health Check

Verifica el estado del servicio.

**Endpoint:** `GET /api/v1/health`

**Respuesta:**
```json
{
  "status": "healthy",
  "service": "average-service"
}
```

## Estructura del Proyecto

```
.
├── cmd/
│   └── server/       # Punto de entrada (main.go)
├── internal/
│   ├── handler/      # Controladores HTTP
│   ├── service/      # Lógica de negocio
│   └── middleware/   # Middlewares (Recovery, Logger)
├── pkg/
│   └── config/       # Configuración global
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Desarrollador

**Alexander Rubio Cáceres**
Ingeniero de Software, Especialista en Seguridad de la Información, Desarrollador FullStack, Líder Técnico, Arquitecto de Soluciones.