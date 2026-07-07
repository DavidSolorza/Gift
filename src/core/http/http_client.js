/**
 * Cliente HTTP Nativo/Puro (Cero SDKs comerciales)
 * Autor: Agente 4 (Senior Backend Engineer)
 */
import { ENV } from '../config/env.js';

export const httpClient = {
  async get(path, params = {}) {
    const url = new URL(`${ENV.API_BASE_URL}${path}`, window.location.origin);
    
    // Adjuntar query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, value);
      }
    });

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          message: errorData.message || 'Error en la petición HTTP',
          code: errorData.error_code || 'HTTP_ERROR',
          details: errorData.details || null
        };
      }

      return await response.json();
    } catch (error) {
      if (error.status) throw error; // Re-lanzar error HTTP estructurado
      
      throw {
        status: 500,
        message: error.message || 'Error de conexión de red',
        code: 'NETWORK_ERROR',
        details: error
      };
    }
  }
};
