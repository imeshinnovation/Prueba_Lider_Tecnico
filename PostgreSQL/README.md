# Base de Datos para Transacciones Financieras - PostgreSQL

Este proyecto define un esquema relacional en PostgreSQL para gestionar transacciones financieras, con soporte para usuarios, cuentas, categorías y movimientos de dinero (incluyendo transferencias internas).

## Explicación de las Tablas y Relaciones

**Tabla `users`**  
Almacena información básica de usuarios.  
**Relación**: Uno-a-Muchos con `accounts` (un usuario puede tener múltiples cuentas).

**Tabla `accounts`**  
Representa cuentas financieras.  
**Relación**: Muchos-a-Uno con `users` (vía `user_id`).  
El saldo se actualiza manualmente en la aplicación (por ejemplo, mediante triggers o lógica de negocio para sumar/restar transacciones).

**Tabla `categories`**  
Clasificación reusable para transacciones.  
**Relación**: Uno-a-Muchos con `transactions` (una categoría puede aplicarse a muchas transacciones).

**Tabla `transactions` (principal)**  
Registra cada movimiento financiero.  

**Relaciones**:
- Muchos-a-Uno con `accounts` (origen): Cada transacción sale de una cuenta.
- Muchos-a-Uno opcional con `accounts` (destino): Para transferencias internas.
- Muchos-a-Uno con `categories`: Clasifica el tipo de transacción.

**Constraints**:  
- Monto > 0  
- Tipo restringido (`income`, `expense`, `transfer`) para evitar datos inválidos  

**Auditoría**:  
Timestamps automáticos para rastreo (`created_at`, `updated_at`).

## Mejores Prácticas Implementadas

- **Triggers**: Actualizan automáticamente `updated_at` en cualquier actualización.
- **Constraints CHECK**: Validan datos directamente en la base de datos (ej. monto positivo, tipos válidos).
- **FOREIGN KEY con ON DELETE**: Manejan cascadas o restricciones para mantener la integridad referencial.
- **Índices**: Optimizan consultas comunes (ej. reportes por fecha, cuenta o categoría).
- **Tipos de Datos**: 
  - `NUMERIC` para precisión exacta en montos monetarios.
  - `TIMESTAMP WITH TIME ZONE` para manejar correctamente husos horarios globales.

## Datos de Prueba

Puedes insertar datos de ejemplo ejecutando las siguientes sentencias SQL:

```sql
INSERT INTO users (name, email) VALUES ('Juan Pérez', 'juan@example.com');
INSERT INTO accounts (user_id, account_type, balance) VALUES (1, 'checking', 1000.00);
INSERT INTO categories (name) VALUES ('Salario');
INSERT INTO transactions (account_id_origin, category_id, amount, transaction_type, description) VALUES (1, 1, 500.00, 'income', 'Pago mensual');
```
