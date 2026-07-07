# Diseño de Base de Datos - 100 Poemas para Nataly
# Autor: Agente 3 (Principal DBA)
# Estado: APROBADO

Este documento define el esquema de persistencia físico y relacional para soportar el almacenamiento y la consulta de los poemas. Se ha seleccionado **PostgreSQL** por su soporte nativo de tipos de datos avanzados (como arreglos `TEXT[]` para estrofas de poemas) y su estricto cumplimiento ACID.

---

## 1. Script DDL (Data Definition Language)

```sql
-- Habilitar la extensión para generación de UUIDs si no está activa
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tipo ENUM para clasificación de módulos temáticos (opcional, para integridad a nivel de BD)
CREATE TYPE poem_module AS ENUM ('AMOR', 'APEGO', 'MIEDO', 'POEMAS MIXTOS', 'EL FINAL');

-- Tabla Principal de Poemas
CREATE TABLE IF NOT EXISTS poems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poem_number INT NOT NULL UNIQUE,
    unlock_date DATE NOT NULL,
    module poem_module NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Restricciones de integridad de negocio
    CONSTRAINT check_poem_number_range CHECK (poem_number >= 1 AND poem_number <= 100),
    CONSTRAINT check_unlock_date_valid CHECK (unlock_date >= '2026-07-14' AND unlock_date <= '2026-08-02')
);

-- Índices optimizados para búsquedas frecuentes
-- Índice para filtros rápidos por fecha de desbloqueo (usado en el cálculo del estado actual)
CREATE INDEX IF NOT EXISTS idx_poems_unlock_date ON poems(unlock_date);

-- Índice para búsquedas ordenadas por número de poema
CREATE INDEX IF NOT EXISTS idx_poems_number ON poems(poem_number);

-- Comentario explicativo de la tabla
COMMENT ON TABLE poems IS 'Tabla que almacena los 100 poemas destinados a Nataly con su respectiva fecha de liberación progresiva.';
```

---

## 2. Diccionario de Datos Exhaustivo

### Tabla: `poems`

| Nombre de Columna | Tipo de Datos Exacto | Restricciones (PK, FK, NULL, etc.) | Regla de Negocio / Descripción Detallada |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, NOT NULL, DEFAULT uuid_generate_v4()` | Identificador único universal, global e inmutable para cada registro de poema. |
| `poem_number` | `INTEGER` | `UNIQUE, NOT NULL, CHECK (poem_number BETWEEN 1 AND 100)` | El número correlativo del poema (del 1 al 100). Sirve para identificar el orden de visualización. |
| `unlock_date` | `DATE` | `NOT NULL, CHECK (unlock_date >= '2026-07-14')` | Fecha a partir de la cual el poema queda disponible para lectura (formato `YYYY-MM-DD`). |
| `module` | `poem_module` | `NOT NULL` | Módulo temático al que pertenece el poema (AMOR, APEGO, MIEDO, POEMAS MIXTOS, EL FINAL). |
| `title` | `VARCHAR(255)` | `NOT NULL` | Título del poema. |
| `content` | `TEXT[]` | `NOT NULL` | Arreglo de cadenas de texto (PostgreSQL array) donde cada elemento representa una estrofa o párrafo del poema. Preserva el formato y saltos de línea. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT CURRENT_TIMESTAMP` | Fecha y hora en la que se registró el poema en la base de datos (con zona horaria). |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT CURRENT_TIMESTAMP` | Fecha y hora de la última modificación del registro. |

---

## 3. Disparadores (Triggers) y Funciones de Auditoría

Para garantizar que el campo `updated_at` se actualice automáticamente en caso de edición:

```sql
CREATE OR REPLACE FUNCTION update_poems_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_poems_updated_at
BEFORE UPDATE ON poems
FOR EACH ROW
EXECUTE FUNCTION update_poems_updated_at_column();
```
