import { PoemRepository } from '../../domain/PoemRepository.js';
import rawPoems from '../data/poems_data.json';

/**
 * Adaptador de Infraestructura: LocalPoemRepository
 * Implementa el contrato de dominio obteniendo datos de un archivo local consolidad
 * y simulando la latencia y comportamiento asíncrono de un cliente HTTP nativo.
 * Autor: Agente 4 (Senior Backend Engineer)
 */
export class LocalPoemRepository extends PoemRepository {
  async getPoems() {
    // Simulamos la llamada asíncrona de red para permitir que los estados de carga
    // en la UI (loading, skeletons) funcionen de forma natural y premium.
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(rawPoems);
      }, 350);
    });
  }
}
