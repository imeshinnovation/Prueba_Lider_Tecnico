# Decisiones Técnicas - Prueba Líder Técnico

**Autor:** Alexander Rubio Cáceres  
**Rol:** Ingeniero de Software | Especialista en Seguridad de la Información | Desarrollador FullStack | Líder Técnico | Arquitecto de Soluciones  
**Fecha:** Diciembre 2025

---

## Tabla de Contenidos

1. [Proyecto Go - Average Service](#1-proyecto-go---average-service)
2. [Proyecto NodeJS - User Service](#2-proyecto-nodejs---user-service)
3. [Proyecto PostgreSQL - Financial Transactions Schema](#3-proyecto-postgresql---financial-transactions-schema)
4. [Proyecto Python - N Primos](#4-proyecto-python---n-primos)
5. [Proyecto ReactJS - User Manager](#5-proyecto-reactjs---user-manager)
6. [Conclusiones Generales](#6-conclusiones-generales)

---

## 1. Proyecto Go - Average Service

### 1.1 Arquitectura

**Patrón Arquitectónico:** Clean Architecture / Hexagonal Architecture

**Estructura de Capas:**
```
average-service/
├── cmd/server/           # Punto de entrada (main.go)
├── internal/
│   ├── handler/          # Capa de presentación (HTTP handlers)
│   ├── service/          # Lógica de negocio
│   └── middleware/       # Middlewares (Recovery, Logger)
└── pkg/config/           # Configuración global
```

**Decisiones Arquitectónicas:**

- **Separación de Responsabilidades:** Se implementó una arquitectura en capas para mantener el código desacoplado y facilitar el testing unitario.
  - `cmd/`: Punto de entrada de la aplicación, responsable únicamente de inicializar el servidor.
  - `internal/`: Código privado del servicio, no exportable a otros módulos Go.
  - `pkg/`: Código reutilizable y exportable (configuraciones).

- **Framework Web:** Se eligió **Gin** por su alto rendimiento, simplicidad y amplia adopción en la comunidad Go.

- **Inyección de Dependencias:** Se utiliza inyección manual de dependencias para mantener el control explícito del flujo de datos.

### 1.2 Estrategias de Codificación

**Estándares de Código:**

- **Go Idioms:** Se siguieron las convenciones idiomáticas de Go:
  - Nombres de paquetes en minúsculas sin guiones bajos.
  - Manejo explícito de errores (no se utilizan excepciones).
  - Uso de interfaces para abstracciones.

- **Validación de Datos:** Se implementó validación robusta usando `go-playground/validator/v10`:
  ```go
  type AverageRequest struct {
      Numbers []float64 `json:"numbers" binding:"required,min=1"`
  }
  ```

- **Logging Estructurado:** Se utilizó **Zerolog** para logging JSON estructurado, facilitando la integración con sistemas de monitoreo (ELK, Datadog, etc.):
  ```go
  log.Info().
      Float64("average", result).
      Int("count", len(numbers)).
      Msg("Average calculated successfully")
  ```

- **Manejo de Errores:** Implementación de middleware de recuperación de pánicos para evitar caídas del servicio.

**Configuración:**

- **Variables de Entorno:** Se utilizó `godotenv` para cargar configuraciones desde archivos `.env`, siguiendo el principio de [12-Factor App](https://12factor.net/).
- **Valores por Defecto:** El puerto predeterminado es `3801`, configurable mediante `PORT`.

### 1.3 Pruebas

**Estrategia de Testing:**

- **Pruebas Unitarias:** Aunque no se incluyeron archivos de test en el proyecto actual, la arquitectura está diseñada para facilitar el testing:
  - La lógica de negocio en `service/` es independiente del framework HTTP.
  - Los handlers pueden ser testeados mediante `httptest` de la biblioteca estándar de Go.

**Recomendaciones para Testing:**
```go
// Ejemplo de test unitario para el servicio
func TestCalculateAverage(t *testing.T) {
    svc := service.NewAverageService()
    result := svc.Calculate([]float64{10, 20, 30})
    expected := 20.0
    if result != expected {
        t.Errorf("Expected %f, got %f", expected, result)
    }
}
```

### 1.4 Dependencias Principales

```go
require (
    github.com/gin-gonic/gin v1.10.0           // Framework HTTP
    github.com/go-playground/validator/v10 v10.22.1  // Validación
    github.com/joho/godotenv v1.5.1            // Variables de entorno
    github.com/rs/zerolog v1.33.0              // Logging estructurado
)
```

**Justificación:**
- **Gin:** Alto rendimiento (hasta 40x más rápido que otros frameworks Go).
- **Validator:** Validación declarativa mediante tags, reduciendo código boilerplate.
- **Zerolog:** Zero-allocation logging, ideal para aplicaciones de alta concurrencia.

### 1.5 Containerización

**Docker:**
- Se incluyó `Dockerfile` multi-stage para optimizar el tamaño de la imagen:
  - Stage 1: Build (compilación del binario Go).
  - Stage 2: Runtime (imagen mínima con el binario).

**Docker Compose:**
- Configuración lista para orquestación local, facilitando el desarrollo y testing.

### 1.6 Decisiones Estratégicas

- **API RESTful:** Se implementó un endpoint `/api/v1/average` versionado para facilitar evoluciones futuras sin romper compatibilidad.
- **Health Check:** Endpoint `/api/v1/health` para monitoreo de disponibilidad (Kubernetes liveness/readiness probes).
- **CORS:** No se implementó CORS en este servicio, asumiendo que se manejará a nivel de API Gateway o proxy reverso.

---

## 2. Proyecto NodeJS - User Service

### 2.1 Arquitectura

**Patrón Arquitectónico:** Domain-Driven Design (DDD)

**Estructura de Capas:**
```
user-service/
├── src/
│   ├── domain/            # Entidades e interfaces de repositorios
│   ├── application/       # Casos de uso (lógica de negocio)
│   ├── infrastructure/    # Implementaciones técnicas
│   │   ├── persistence/   # Repositorios MongoDB
│   │   └── web/           # Controladores y rutas Express
│   ├── config/            # Configuraciones globales
│   └── docs/              # Definiciones Swagger/OpenAPI
└── tests/                 # Pruebas unitarias
```

**Decisiones Arquitectónicas:**

- **DDD (Domain-Driven Design):** Se eligió DDD para proyectos con lógica de negocio compleja, separando claramente:
  - **Dominio:** Entidades puras sin dependencias externas.
  - **Aplicación:** Orquestación de casos de uso.
  - **Infraestructura:** Detalles técnicos (BD, HTTP, etc.).

- **Inversión de Dependencias:** Las capas superiores (dominio/aplicación) no dependen de las inferiores (infraestructura). Se utilizan interfaces para abstraer repositorios.

- **Framework Web:** **Express 5.x** por su madurez, ecosistema extenso y simplicidad.

### 2.2 Estrategias de Codificación

**TypeScript:**

- **Configuración Estricta:**
  ```json
  {
    "compilerOptions": {
      "strict": true,
      "target": "ES2020",
      "module": "commonjs",
      "esModuleInterop": true
    }
  }
  ```
  - `strict: true` habilita todas las verificaciones estrictas de TypeScript.
  - `ES2020` para soporte de características modernas (optional chaining, nullish coalescing).

- **Tipado Fuerte:** Todas las entidades, DTOs y respuestas están tipadas, eliminando errores en tiempo de ejecución.

**Estándares de Código:**

- **Nomenclatura:**
  - PascalCase para clases e interfaces (`User`, `UserRepository`).
  - camelCase para variables y funciones (`createUser`, `userId`).
  - UPPER_SNAKE_CASE para constantes (`MONGODB_URI`).

- **Manejo de Errores:** Se implementó manejo centralizado de errores mediante middleware de Express:
  ```typescript
  app.use((err, req, res, next) => {
      logger.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
  });
  ```

### 2.3 Pruebas

**Estrategia de Testing:** TDD (Test-Driven Development) + BDD (Behavior-Driven Development)

**Herramientas:**
- **Jest:** Framework de testing con soporte nativo para TypeScript (via `ts-jest`).
- **Configuración:**
  ```javascript
  // jest.config.js
  module.exports = {
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['**/tests/**/*.test.ts']
  };
  ```

**Tipos de Pruebas:**
- **Unitarias:** Testing de casos de uso aislados (mocking de repositorios).
- **Integración:** Testing de endpoints HTTP con base de datos en memoria.

**Comando:** `yarn test`

### 2.4 Base de Datos

**MongoDB:**

**Justificación:**
- **Flexibilidad de Esquema:** Ideal para entidades con campos variables (perfiles de usuario).
- **Escalabilidad Horizontal:** Sharding nativo para crecimiento futuro.
- **Ecosistema Node.js:** Driver oficial con excelente soporte para TypeScript.

**Patrón Repository:**
```typescript
interface UserRepository {
    create(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    delete(id: string): Promise<boolean>;
}
```

### 2.5 Documentación API

**Swagger/OpenAPI:**

- **Herramientas:** `swagger-jsdoc` + `swagger-ui-express`
- **Endpoint:** `/api-docs`
- **Beneficios:**
  - Documentación interactiva autogenerada.
  - Testing manual de endpoints sin herramientas externas.
  - Generación de clientes automáticos (SDKs).

### 2.6 Seguridad

**Auditoría de Dependencias:**

- **Herramienta:** `yarn audit` / `npm audit`
- **Estado:** ✅ **SEGURO** (0 vulnerabilidades críticas/altas)
- **Documentación:** Ver `SHADOWMAP.md` para detalles completos.

**CORS:**
- Configurado mediante `cors` middleware para permitir peticiones cross-origin desde el frontend.

### 2.7 Decisiones Estratégicas

- **Versionado de API:** Endpoints bajo `/api/v1/` para evolución sin breaking changes.
- **Variables de Entorno:** Configuración externalizada (`.env`) para diferentes ambientes (dev, staging, prod).
- **Logging:** Implementación de logger estructurado para trazabilidad de operaciones.

---

## 3. Proyecto PostgreSQL - Financial Transactions Schema

### 3.1 Arquitectura de Base de Datos

**Modelo Relacional:** Normalización 3NF (Tercera Forma Normal)

**Entidades Principales:**
1. **users:** Usuarios del sistema
2. **accounts:** Cuentas financieras asociadas a usuarios
3. **categories:** Categorías de transacciones
4. **transactions:** Registro de movimientos financieros

**Diagrama de Relaciones:**
```
users (1) ──< (N) accounts
accounts (1) ──< (N) transactions (origen)
accounts (1) ──< (N) transactions (destino, opcional)
categories (1) ──< (N) transactions
```

### 3.2 Decisiones de Diseño

**Tipos de Datos:**

- **NUMERIC(15, 2):** Para montos monetarios, garantizando precisión exacta (sin errores de punto flotante).
  ```sql
  balance NUMERIC(15, 2) DEFAULT 0.00 NOT NULL
  ```

- **TIMESTAMP WITH TIME ZONE:** Para auditoría global, manejando correctamente husos horarios.
  ```sql
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  ```

- **VARCHAR vs TEXT:**
  - `VARCHAR(N)` para campos con límite conocido (email, nombres).
  - `TEXT` para descripciones sin límite predefinido.

**Constraints:**

- **CHECK Constraints:** Validación a nivel de base de datos:
  ```sql
  amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0)
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('income', 'expense', 'transfer'))
  ```

- **UNIQUE:** Email único por usuario:
  ```sql
  email VARCHAR(255) UNIQUE NOT NULL
  ```

- **FOREIGN KEYS con Políticas:**
  - `ON DELETE CASCADE` en `users → accounts` (si se borra usuario, se borran sus cuentas).
  - `ON DELETE RESTRICT` en `accounts → transactions` (no permitir borrar cuentas con transacciones).
  - `ON DELETE SET NULL` en `categories → transactions` (si se borra categoría, transacciones quedan sin categoría).

### 3.3 Estrategias de Codificación

**Triggers:**

- **Actualización Automática de `updated_at`:**
  ```sql
  CREATE OR REPLACE FUNCTION update_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  ```

**Índices:**

- **Optimización de Consultas Frecuentes:**
  ```sql
  CREATE INDEX idx_transactions_date ON transactions(transaction_date);
  CREATE INDEX idx_transactions_account_origin ON transactions(account_id_origin);
  CREATE INDEX idx_transactions_category ON transactions(category_id);
  ```

**Justificación:**
- Reportes por fecha (rango de fechas).
- Consultas de transacciones por cuenta.
- Filtrado por categoría.

### 3.4 Integridad Referencial

**Estrategias:**

- **Cascadas Controladas:** Se evitó `ON DELETE CASCADE` en transacciones para prevenir pérdida accidental de datos históricos.
- **Soft Deletes (Recomendación Futura):** Para auditoría completa, considerar agregar columna `deleted_at` en lugar de borrado físico.

### 3.5 Auditoría

**Timestamps Automáticos:**
- `created_at`: Registro de creación.
- `updated_at`: Última modificación (actualizado por triggers).

**Trazabilidad:**
- Todas las tablas principales incluyen campos de auditoría.
- Posibilidad futura de agregar `created_by` / `updated_by` para rastrear usuarios responsables.

### 3.6 Decisiones Estratégicas

- **Normalización vs Desnormalización:** Se priorizó normalización (3NF) para evitar redundancia y anomalías de actualización.
- **Escalabilidad:** Índices estratégicos para soportar crecimiento de datos sin degradación de performance.
- **Seguridad:** Constraints a nivel de BD como primera línea de defensa (defense in depth).

---

## 4. Proyecto Python - N Primos

### 4.1 Arquitectura

**Patrón:** Script funcional simple

**Estructura:**
```python
nprimos.py
├── es_primo(n: int) -> bool      # Función de utilidad
├── obtener_primos(lista) -> list # Función principal
└── __main__                      # Punto de entrada
```

### 4.2 Estrategias de Codificación

**Type Hints (PEP 484):**

```python
def es_primo(n: int) -> bool:
    """Determina si un número es primo."""
    ...

def obtener_primos(lista: list[int]) -> list[int]:
    """Filtra números primos de una lista."""
    ...
```

**Beneficios:**
- Autodocumentación del código.
- Detección temprana de errores con herramientas como `mypy`.
- Mejor soporte en IDEs (autocompletado, refactoring).

**Docstrings (PEP 257):**

- Todas las funciones incluyen docstrings descriptivos.
- Formato compatible con generadores de documentación (Sphinx).

**Algoritmo Optimizado:**

**Decisión:** Implementación del algoritmo de prueba de primalidad optimizado (6k ± 1):

```python
def es_primo(n: int) -> bool:
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True
```

**Complejidad:** O(√n) en lugar de O(n) de la implementación naive.

**Justificación:**
- Todos los primos > 3 son de la forma 6k ± 1.
- Reducción significativa de iteraciones.

### 4.3 Pruebas

**Estrategia:** Testing manual mediante bloque `__main__`

```python
if __name__ == "__main__":
    numeros = [10, 15, 3, 7, 11, 20, 23, 29, 30, 31, 37, 40]
    primos_encontrados = obtener_primos(numeros)
    print(f"Números primos: {primos_encontrados}")
    # Salida esperada: [3, 7, 11, 23, 29, 31, 37]
```

**Recomendaciones para Testing Formal:**

```python
import unittest

class TestPrimos(unittest.TestCase):
    def test_es_primo(self):
        self.assertTrue(es_primo(7))
        self.assertFalse(es_primo(10))
    
    def test_obtener_primos(self):
        resultado = obtener_primos([2, 3, 4, 5])
        self.assertEqual(resultado, [2, 3, 5])
```

**Herramientas Sugeridas:**
- `pytest`: Framework moderno de testing.
- `coverage.py`: Análisis de cobertura de código.

### 4.4 Estándares de Código

**PEP 8 (Style Guide):**
- Indentación de 4 espacios.
- Nombres de funciones en `snake_case`.
- Líneas máximo 79 caracteres (flexible a 100 en proyectos modernos).

**Linting:**
- **Herramientas Recomendadas:**
  - `pylint`: Análisis estático completo.
  - `black`: Formateador automático.
  - `mypy`: Verificación de tipos estáticos.

### 4.5 Decisiones Estratégicas

- **Simplicidad:** Se priorizó claridad sobre optimización prematura.
- **Reutilizabilidad:** Funciones puras sin efectos secundarios, fácilmente integrables en proyectos mayores.
- **Extensibilidad:** Fácil agregar funciones adicionales (ej: `obtener_n_primos(n)` para generar los primeros N primos).

---

## 5. Proyecto ReactJS - User Manager

### 5.1 Arquitectura

**Patrón:** Component-Based Architecture + State Management

**Estructura:**
```
user-manager/
├── src/
│   ├── components/        # Componentes React
│   │   ├── CreateUserForm.tsx
│   │   ├── UserTable.tsx
│   │   └── __tests__/     # Pruebas unitarias
│   ├── api/               # Cliente HTTP (Axios)
│   ├── store/             # Estado global (Zustand)
│   ├── types/             # Definiciones TypeScript
│   └── main.tsx           # Punto de entrada
└── vite.config.ts         # Configuración Vite
```

### 5.2 Estrategias de Codificación

**TypeScript Estricto:**

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Beneficios:**
- Detección temprana de errores.
- Refactoring seguro.
- Mejor experiencia de desarrollo (IntelliSense).

**Gestión de Estado:**

**Zustand:** State manager minimalista

```typescript
import { create } from 'zustand';

interface UserStore {
    refreshTrigger: number;
    refresh: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    refreshTrigger: 0,
    refresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));
```

**Justificación:**
- **Simplicidad:** API minimalista sin boilerplate (vs Redux).
- **Performance:** Re-renders optimizados automáticamente.
- **TypeScript:** Soporte nativo de primera clase.

**Formularios:**

**React Hook Form + Zod:**

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const userSchema = z.object({
    name: z.string().min(1, 'Nombre requerido'),
    email: z.string().email('Email inválido'),
});

const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
});
```

**Beneficios:**
- Validación declarativa con Zod.
- Performance optimizado (validación solo en submit/blur).
- Manejo automático de errores.

### 5.3 Pruebas

**Estrategia:** TDD/BDD con Vitest + React Testing Library

**Configuración:**
```typescript
// vite.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
    },
});
```

**Ejemplo de Test:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { CreateUserForm } from './CreateUserForm';

describe('CreateUserForm', () => {
    it('should display validation errors for invalid input', async () => {
        render(<CreateUserForm />);
        
        const submitButton = screen.getByRole('button', { name: /crear/i });
        fireEvent.click(submitButton);
        
        expect(await screen.findByText(/nombre requerido/i)).toBeInTheDocument();
    });
});
```

**Comando:** `npm test` / `yarn test`

### 5.4 Estilos

**Tailwind CSS:**

**Justificación:**
- **Utility-First:** Desarrollo rápido sin salir del HTML.
- **Consistencia:** Sistema de diseño predefinido (spacing, colors).
- **Performance:** PurgeCSS automático (solo CSS usado en producción).
- **Responsividad:** Breakpoints integrados (`sm:`, `md:`, `lg:`).

**Configuración:**
```javascript
// tailwind.config.js
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {},
    },
    plugins: [],
};
```

**Migración desde Bootstrap:**
- Se eliminaron clases Bootstrap heredadas.
- Refactorización completa a utilidades Tailwind nativas.

### 5.5 Seguridad

**Auditoría de Vulnerabilidades:**

**Herramientas:**
- `npm audit` / `yarn audit`
- Análisis de dependencias transitivas.

**Mitigaciones:**
- **Resoluciones Estrictas:** Forzar versiones seguras de dependencias problemáticas:
  ```json
  "resolutions": {
      "esbuild": "^0.25.0"
  }
  ```

**Estado Actual:** ✅ **0 Vulnerabilidades**

**Documentación:** Ver `SHADOWMAP.md` para detalles completos.

### 5.6 Robustez y Disponibilidad

**Health Check Automático:**

```typescript
useEffect(() => {
    const checkHealth = async () => {
        try {
            await axios.get('/health');
            setIsHealthy(true);
        } catch {
            setIsHealthy(false);
        }
    };
    
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
}, []);
```

**Modo Mantenimiento:**
- Detección automática de caídas del backend.
- Pantalla de mantenimiento amigable.
- Polling inteligente para recuperación automática.

### 5.7 Build y Desarrollo

**Vite:**

**Justificación:**
- **Velocidad:** HMR (Hot Module Replacement) instantáneo.
- **Simplicidad:** Configuración mínima out-of-the-box.
- **Optimización:** Tree-shaking y code-splitting automáticos.

**Scripts:**
```json
{
    "scripts": {
        "dev": "vite",              // Servidor de desarrollo
        "build": "tsc && vite build", // Build de producción
        "preview": "vite preview",   // Preview del build
        "test": "vitest"            // Ejecutar pruebas
    }
}
```

### 5.8 Decisiones Estratégicas

- **Component Composition:** Componentes pequeños y reutilizables (Single Responsibility Principle).
- **Accesibilidad:** Uso de `@headlessui/react` para componentes accesibles (ARIA compliant).
- **UX:** Feedback visual con `react-hot-toast` para operaciones asíncronas.
- **Iconografía:** `lucide-react` para iconos modernos y tree-shakeable.

---

## 6. Conclusiones Generales

### 6.1 Principios Transversales

**1. Clean Code:**
- Nombres descriptivos y autoexplicativos.
- Funciones pequeñas con responsabilidad única.
- Comentarios solo cuando el código no es autoexplicativo.

**2. SOLID Principles:**
- **S**ingle Responsibility: Cada módulo/clase tiene una única razón para cambiar.
- **O**pen/Closed: Abierto a extensión, cerrado a modificación.
- **L**iskov Substitution: Interfaces bien definidas.
- **I**nterface Segregation: Interfaces específicas, no genéricas.
- **D**ependency Inversion: Dependencia de abstracciones, no de concreciones.

**3. DRY (Don't Repeat Yourself):**
- Reutilización de código mediante funciones/componentes.
- Configuraciones centralizadas.

**4. YAGNI (You Aren't Gonna Need It):**
- No se implementaron características especulativas.
- Foco en requisitos actuales.

### 6.2 Seguridad

**Defense in Depth:**
- **Validación en Múltiples Capas:**
  - Frontend: Validación con Zod/React Hook Form.
  - Backend: Validación con Validator (Go) / Class-validator (Node).
  - Base de Datos: Constraints y triggers.

**Auditoría de Dependencias:**
- Todos los proyectos Node/React auditados.
- Estado: 0 vulnerabilidades críticas/altas.

**Configuración Segura:**
- Variables sensibles en `.env` (nunca en código).
- `.gitignore` configurado para excluir secretos.

### 6.3 Testing

**Estrategias por Proyecto:**

| Proyecto | Framework | Estrategia | Cobertura |
|----------|-----------|------------|-----------|
| Go       | Testing estándar | Unitarias + HTTP | Recomendado |
| NodeJS   | Jest + ts-jest | TDD/BDD | Implementado |
| PostgreSQL | - | Testing manual | Scripts SQL |
| Python   | - | Testing manual | Recomendado pytest |
| ReactJS  | Vitest + RTL | BDD | Implementado |

**Recomendación General:**
- Mínimo 80% de cobertura en lógica de negocio.
- 100% en funciones críticas (autenticación, pagos, etc.).

### 6.4 DevOps y Deployment

**Containerización:**
- **Go:** Dockerfile multi-stage para imágenes optimizadas.
- **NodeJS:** Dockerfile con `node:alpine` para reducir tamaño.
- **ReactJS:** Build estático servido por Nginx.

**Orquestación:**
- Docker Compose para desarrollo local.
- Kubernetes-ready (health checks implementados).

**CI/CD (Recomendaciones):**
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          npm test
          go test ./...
```

### 6.5 Monitoreo y Observabilidad

**Logging:**
- **Go:** Zerolog (JSON estructurado).
- **NodeJS:** Winston/Pino (recomendado).
- **ReactJS:** Sentry para error tracking.

**Métricas:**
- Prometheus + Grafana para métricas de aplicación.
- Health checks para Kubernetes liveness/readiness probes.

### 6.6 Escalabilidad

**Horizontal Scaling:**
- Todos los servicios son stateless (estado en BD).
- Load balancing mediante Nginx/HAProxy/Kubernetes Ingress.

**Vertical Scaling:**
- Optimización de queries (índices en PostgreSQL).
- Connection pooling en MongoDB.

### 6.7 Mantenibilidad

**Documentación:**
- READMEs completos en cada proyecto.
- Swagger/OpenAPI para APIs.
- Comentarios en código complejo.

**Versionado:**
- Git con commits semánticos (Conventional Commits).
- Versionado semántico (SemVer) para releases.

### 6.8 Stack Tecnológico Consolidado

| Capa | Tecnologías |
|------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **Backend** | Go (Gin), Node.js (Express), TypeScript |
| **Base de Datos** | PostgreSQL, MongoDB |
| **Testing** | Jest, Vitest, Go Testing, React Testing Library |
| **DevOps** | Docker, Docker Compose, GitHub Actions |
| **Monitoreo** | Zerolog, Winston, Sentry, Prometheus |

---

## Anexos

### A. Comandos Útiles

**Go:**
```bash
go mod download          # Descargar dependencias
go run cmd/server/main.go # Ejecutar servidor
go test ./...            # Ejecutar tests
go build -o bin/server   # Compilar binario
```

**NodeJS:**
```bash
yarn install             # Instalar dependencias
yarn dev                 # Modo desarrollo
yarn build               # Compilar TypeScript
yarn test                # Ejecutar tests
yarn audit               # Auditoría de seguridad
```

**ReactJS:**
```bash
npm install              # Instalar dependencias
npm run dev              # Servidor desarrollo
npm run build            # Build producción
npm test                 # Ejecutar tests
```

**PostgreSQL:**
```bash
psql -U postgres -d financial_transactions_db -f SchemaFinnancialTransactions.sql
```

**Python:**
```bash
python nprimos.py        # Ejecutar script
pytest                   # Ejecutar tests (si están configurados)
mypy nprimos.py          # Verificación de tipos
```

### B. Referencias

- [Go Best Practices](https://go.dev/doc/effective_go)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [12-Factor App](https://12factor.net/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

**Documento generado el:** 23 de Diciembre de 2025  
**Versión:** 1.0  
**Autor:** Alexander Rubio Cáceres
