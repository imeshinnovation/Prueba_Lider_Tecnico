# Gestión de Usuarios

Sistema de gestión de usuarios desarrollado con React, TypeScript y Vite. Este proyecto ha sido optimizado, asegurado y documentado siguiendo mejores prácticas de desarrollo y seguridad.

## 🚀 Mejoras Implementadas

Durante el ciclo de desarrollo se han realizado las siguientes intervenciones técnicas:

### 1. Estabilidad y Construcción
- **Resolución de Dependencias:** Se corrigieron errores de módulos faltantes (`@hookform/resolvers/zod`).
- **Configuración de Build:** Reconstrucción del entorno de compilación (restauración de `tsconfig.json`, `vite.config.ts`, y `index.html`).

### 2. UI/UX y Diseño
- **Migración a Tailwind CSS:** Se implementó una configuración completa de Tailwind (`postcss.config.js`, `tailwind.config.js`).
- **Modernización de Componentes:** Refactorización de `UserTable.tsx` para eliminar dependencias de clases Bootstrap heredadas y utilizar utilidades de Tailwind nativas.
- **Diseño Responsivo:** Mejoras en la visualización de tablas y modales para diferentes dispositivos.

### 3. Seguridad (Shadowmap)
Se ha implementado una auditoría de seguridad exhaustiva documentada en `SHADOWMAP.md`.
- **Análisis de Vulnerabilidades:** Escaneo profundo de dependencias (transitivas y directas).
- **Resolución de Conflictos:** Mitigación de vulnerabilidades críticas (ej. `esbuild`) mediante políticas de resolución estricta (`resolutions` en `package.json`).
- **Estado Actual:** 0 Vulnerabilidades detectadas.

### 4. Robustez y Disponibilidad
- **Health Check:** Implementación de monitoreo automático del estado del backend (`GET /health`).
- **Modo Mantenimiento:** El sistema detecta automáticamente caídas del servicio y muestra una pantalla de mantenimiento amigable, bloqueando la interacción hasta que el servicio se restablezca.
- **Polling Inteligente:** Verificación periódica (cada 15s) para recuperación automática sin recargar la página.

## 🛠 Stack Tecnológico

- **Core:** React 18, TypeScript, Vite
- **Estilos:** Tailwind CSS 3
- **Estado:** Zustand
- **Formularios:** React Hook Form + Zod
- **Cliente HTTP:** Axios
- **Iconos:** Lucide React
- **Testing:** Vitest, React Testing Library (TDD/BDD)

## 🧪 Pruebas (TDD/BDD)

El proyecto cuenta con una suite de pruebas unitarias configurada con **Vitest**.
- **Ejecutar Pruebas:** `npm test` o `yarn test`
- **Ubicación:** `src/components/__tests__`
- **Enfoque:** BDD (Behavior Driven Development) probando escenarios de usuario.


**Alexander Rubio Cáceres**
*Ingeniero de Software | Especialista en Seguridad de la Información*

- **Roles:**
  - Desarrollador FullStack
  - Líder Técnico
  - Arquitecto de Soluciones

---
*Este proyecto demuestra la capacidad de diagnóstico, refactorización y aseguramiento de aplicaciones web modernas.*
