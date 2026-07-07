/**
 * Clasificación y Modelado de Errores Globales
 * Autor: Agente 4 (Senior Backend Engineer)
 */

export class AppError extends Error {
  constructor(message, code, status = 400) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ResourceLockedError extends AppError {
  constructor(message = 'El recurso seleccionado está bloqueado temporalmente por política del remitente.', details = {}) {
    super(message, 'RESOURCE_LOCKED', 400);
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado.') {
    super(message, 'NOT_FOUND', 404);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Los parámetros provistos fallaron las validaciones de esquema.', details = []) {
    super(message, 'VALIDATION_FAILED', 422);
    this.details = details;
  }
}
