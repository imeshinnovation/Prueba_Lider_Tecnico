# Auditoría de Seguridad Shadowmap

**Fecha:** 2025-12-23
**Estado:** Vulnerabilidades Resueltas

## Vulnerabilidades Identificadas

### [Moderada] esbuild - permite a cualquier sitio web enviar solicitudes al servidor de desarrollo y leer la respuesta
- **Paquete Afectado**: `esbuild`
- **Versión Vulnerable**: `<=0.24.2`
- **Versión Corregida**: `>=0.25.0`
- **Ruta de Dependencia**: `vite > esbuild`
- **Aviso**: [GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99)
- **Descripción**: esbuild permite que cualquier sitio web envíe solicitudes al servidor de desarrollo y lea la respuesta debido a la configuración predeterminada de CORS.
- **Estado de Resolución**: Resuelto
- **Pasos de Resolución**: Se agregó `"resolutions": { "esbuild": "^0.25.0" }` al `package.json` para forzar la actualización de la versión.

---
