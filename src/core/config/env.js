/**
 * Configuración de Variables de Entorno del Core
 * Autor: Agente 4 (Senior Backend Engineer)
 */
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  IS_DEV: import.meta.env.DEV,
  // Fecha base para pruebas de simulación si se requiere inyectar globalmente
  DEFAULT_SIMULATED_DATE: import.meta.env.VITE_DEFAULT_SIMULATED_DATE || null,
};
