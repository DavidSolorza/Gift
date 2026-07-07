# Especificación de la API REST - 100 Poemas para Nataly
# Autor: Agente 6 (Technical Writer & QA)
# Estado: APROBADO

Este documento especifica los contratos formales para los endpoints de la API de poemas. Define las rutas, los esquemas de entrada/salida (JSON) y el comportamiento detallado de control de acceso temporal y control de errores.

---

## 1. Resumen de Endpoints

| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/poems` | Obtiene la lista completa de poemas (filtrando el contenido de los bloqueados). | Público |
| `GET` | `/api/poems/:id` | Obtiene el detalle de un poema por su UUID. | Público (Control de Bloqueo) |
| `GET` | `/api/system/status` | Obtiene el estado actual de liberación del sistema y banderas especiales. | Público |

---

## 2. Especificación Detallada de Endpoints

### 2.1. Obtener Todos los Poemas
`GET /api/poems`

Obtiene la lista completa de los 100 poemas. Si un poema aún no cumple con la fecha de liberación respecto a la fecha del sistema (o la fecha simulada provista), su contenido (`content`) es omitido o devuelto vacío, y la propiedad `is_locked` se establece en `true`.

#### Parámetros de Consulta (Query Parameters)
*   `date` (opcional, string): Fecha en formato `YYYY-MM-DD` para simular la consulta en un momento específico en el tiempo. Si no se provee, la API usará la fecha actual UTC del servidor.

#### Matriz de Respuestas

##### 🟢 `200 OK` (Respuesta Exitosa)
Retorna la colección completa de poemas ordenados por su número de poema.

```json
[
  {
    "id": "7ac237f8-3e4b-4bc6-a9be-a006f1d9bf5b",
    "poem_number": 1,
    "unlock_date": "2026-07-14",
    "module": "AMOR",
    "title": "Eres Mi Hoy",
    "content": [
      "Antes de ti no sabía\nque el tiempo podía detenerse,\nque una sola mirada bastaba\npara llenar el alma de colores.",
      "Eres el hoy que quiero vivir,\nel mañana que me ilusiona..."
    ],
    "is_locked": false,
    "is_new_release": false
  },
  {
    "id": "e83f211b-c741-477d-8153-29a3e2c38210",
    "poem_number": 21,
    "unlock_date": "2026-07-18",
    "module": "APEGO",
    "title": "Cuando No Estás",
    "content": null,
    "is_locked": true,
    "is_new_release": false
  }
]
```

##### 🔴 `422 Unprocessable Entity` (Error de Validación de Esquema)
Ocurre si el parámetro de consulta `date` no cumple con el formato estructurado `YYYY-MM-DD`.

```json
{
  "error_code": "VALIDATION_FAILED",
  "message": "Los parámetros provistos fallaron las validaciones de esquema.",
  "details": [
    {
      "field": "date",
      "issue": "Debe tener un formato de fecha válido YYYY-MM-DD (ej. '2026-07-14')."
    }
  ]
}
```

---

### 2.2. Obtener Detalle de un Poema Específico
`GET /api/poems/:id`

Obtiene la información detallada de un único poema mediante su UUID.

#### Parámetros de Ruta (Path Parameters)
*   `id` (requerido, UUID): Identificador único universal del poema.

#### Parámetros de Consulta (Query Parameters)
*   `date` (opcional, string): Fecha de simulación del sistema (`YYYY-MM-DD`).

#### Matriz de Respuestas

##### 🟢 `200 OK` (Respuesta Exitosa)
Retorna la entidad de poema completa si ya ha sido desbloqueado.

```json
{
  "id": "7ac237f8-3e4b-4bc6-a9be-a006f1d9bf5b",
  "poem_number": 1,
  "unlock_date": "2026-07-14",
  "module": "AMOR",
  "title": "Eres Mi Hoy",
  "content": [
    "Antes de ti no sabía\nque el tiempo podía detenerse,\nque una sola mirada bastaba\npara llenar el alma de colores.",
    "Eres el hoy que quiero vivir,\nel mañana que me ilusiona..."
  ],
  "is_locked": false,
  "is_new_release": false
}
```

##### 🔴 `400 Bad Request` (Regla de Negocio Quebrada - Poema Bloqueado)
Ocurre si el cliente intenta acceder a los detalles o contenido de un poema cuya fecha de liberación es posterior a la fecha de consulta.

```json
{
  "error_code": "RESOURCE_LOCKED",
  "message": "El poema seleccionado está bloqueado temporalmente por política del remitente.",
  "details": {
    "unlock_date": "2026-07-18",
    "requested_date": "2026-07-14",
    "days_remaining": 4
  }
}
```

##### 🔴 `404 Not Found` (Recurso no Encontrado)
Ocurre si el UUID provisto no corresponde a ningún poema en el sistema.

```json
{
  "error_code": "POEM_NOT_FOUND",
  "message": "No se encontró ningún poema con el identificador proporcionado.",
  "details": {
    "id": "7ac237f8-3e4b-4bc6-a9be-a006f1d9bf5b"
  }
}
```

---

### 2.3. Obtener Estado del Sistema
`GET /api/system/status`

Retorna métricas generales y banderas críticas del estado del sistema, tales como la cantidad de poemas desbloqueados, si se ha alcanzado la fecha de cierre general, y si se cumple la condición de bloqueo total (`today === '2026-08-02'`).

#### Parámetros de Consulta (Query Parameters)
*   `date` (opcional, string): Fecha de simulación del sistema (`YYYY-MM-DD`).

#### Matriz de Respuestas

##### 🟢 `200 OK` (Respuesta Exitosa)

```json
{
  "current_date": "2026-07-18",
  "total_poems": 100,
  "unlocked_count": 40,
  "locked_count": 60,
  "next_unlock_date": "2026-07-22",
  "is_system_shutdown": false
}
```

Si el parámetro `date` es exactamente `'2026-08-02'`, el campo `is_system_shutdown` se evalúa en `true`.

```json
{
  "current_date": "2026-08-02",
  "total_poems": 100,
  "unlocked_count": 100,
  "locked_count": 0,
  "next_unlock_date": null,
  "is_system_shutdown": true
}
```

---

## 3. Respuestas de Errores Globales (Esquema Común)

### 🔴 `401 Unauthorized` (Error de Autenticación)
Si en el futuro se requiere autenticación, el formato de salida será:

```json
{
  "error_code": "UNAUTHORIZED",
  "message": "Se requieren credenciales de autorización válidas para acceder a este recurso."
}
```

### 🔴 `500 Internal Server Error` (Falla del Servidor)
Estructura uniforme para errores catastróficos inesperados.

```json
{
  "error_code": "INTERNAL_SERVER_ERROR",
  "message": "Ha ocurrido una anomalía inesperada en el servidor. Por favor, intente más tarde.",
  "reference_id": "err_987213892713"
}
```
