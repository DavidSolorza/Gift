import { Poem } from '../domain/Poem.js';

/**
 * Caso de Uso: GetPoemsUseCase
 * Encapsula la regla de negocio para obtener poemas, validar su estado de desbloqueo,
 * proteger el contenido de poemas bloqueados para evitar fugas en memoria,
 * y determinar la condición especial de cierre del sistema.
 * Autor: Agente 4 (Senior Backend Engineer)
 */
export class GetPoemsUseCase {
  constructor(poemRepository) {
    this.poemRepository = poemRepository;
  }

  /**
   * Ejecuta la lógica del caso de uso.
   * @param {string} targetDate - Fecha en formato YYYY-MM-DD
   * @param {boolean} forceUnlockAll - Si es verdadero, desbloquea todos los poemas
   * @returns {Promise<{unlockedPoems: Array<Poem>, lockedPoems: Array<Poem>, isSystemShutdown: boolean, totalCount: number, unlockedCount: number}>}
   */
  async execute(targetDate, forceUnlockAll = false) {
    const rawData = await this.poemRepository.getPoems();
    
    // Mapeamos a entidades de dominio Poem
    const allPoems = rawData.map(data => new Poem(data));
    
    const unlockedPoems = [];
    const lockedPoems = [];
    
    allPoems.forEach(poem => {
      if (forceUnlockAll || poem.isUnlocked(targetDate)) {
        unlockedPoems.push(poem);
      } else {
        // Clausuramos el contenido (content = null) para evitar
        // que una inspección de estado del cliente revele poemas futuros.
        const secureLockedPoem = new Poem({
          id: poem.id,
          poem_number: poem.poemNumber,
          unlock_date: poem.unlockDate,
          module: poem.module,
          title: poem.title,
          content: null // Ocultado físicamente en memoria de aplicación
        });
        lockedPoems.push(secureLockedPoem);
      }
    });
    
    // Condición de cierre absoluto del sistema: 2 de Agosto de 2026
    const isSystemShutdown = targetDate === '2026-08-02';
    
    return {
      unlockedPoems,
      lockedPoems,
      isSystemShutdown,
      totalCount: allPoems.length,
      unlockedCount: unlockedPoems.length
    };
  }
}
