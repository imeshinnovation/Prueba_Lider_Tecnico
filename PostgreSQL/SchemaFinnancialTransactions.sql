-- Crear la base de datos (opcional, si no existe)
CREATE DATABASE financial_transactions_db;

-- Conectar a la BD (en psql: \c financial_transactions_db)

-- Tabla de Usuarios: Dueños de las cuentas
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,                     -- ID autoincremental
    name VARCHAR(100) NOT NULL,                     -- Nombre del usuario
    email VARCHAR(255) UNIQUE NOT NULL,             -- Email único
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,  -- Auditoría
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP   -- Auditoría
);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_update_trigger
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Tabla de Cuentas: Asociadas a usuarios
CREATE TABLE IF NOT EXISTS accounts (
    account_id SERIAL PRIMARY KEY,                  -- ID autoincremental
    user_id INTEGER NOT NULL,                       -- Relación con usuario
    account_type VARCHAR(50) NOT NULL,              -- e.g., 'checking', 'savings', 'wallet'
    balance NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,   -- Saldo actual (precisión financiera)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE  -- Relación: si se borra usuario, borra cuentas
);

-- Trigger para updated_at en accounts
CREATE TRIGGER accounts_update_trigger
BEFORE UPDATE ON accounts
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Tabla de Categorías: Para clasificar transacciones
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,                 -- ID autoincremental
    name VARCHAR(100) UNIQUE NOT NULL,              -- e.g., 'salario', 'compra', 'transferencia'
    description TEXT,                               -- Descripción opcional
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Transacciones: Núcleo del sistema
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id SERIAL PRIMARY KEY,              -- ID autoincremental
    account_id_origin INTEGER NOT NULL,             -- Cuenta de origen (obligatoria)
    account_id_destination INTEGER,                 -- Cuenta de destino (opcional, para transferencias)
    category_id INTEGER NOT NULL,                   -- Categoría de la transacción
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),  -- Monto positivo
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('income', 'expense', 'transfer')),  -- Tipo: ingreso, egreso, transferencia
    description TEXT,                               -- Descripción detallada
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Fecha de la transacción
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_account_origin FOREIGN KEY (account_id_origin) REFERENCES accounts(account_id) ON DELETE RESTRICT,  -- No borrar si hay transacciones
    CONSTRAINT fk_account_destination FOREIGN KEY (account_id_destination) REFERENCES accounts(account_id) ON DELETE RESTRICT,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL  -- Si se borra categoría, set a NULL
);

-- Trigger para updated_at en transactions
CREATE TRIGGER transactions_update_trigger
BEFORE UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Índices para rendimiento
CREATE INDEX idx_transactions_date ON transactions(transaction_date);  -- Búsquedas por fecha
CREATE INDEX idx_transactions_account_origin ON transactions(account_id_origin);  -- Por cuenta origen
CREATE INDEX idx_transactions_category ON transactions(category_id);  -- Por categoría
