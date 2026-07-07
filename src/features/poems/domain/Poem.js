/**
 * Entidad de Dominio: Poema
 * Autor: Agente 4 (Senior Backend Engineer)
 */
export class Poem {
  constructor(data) {
    this.id = data.id || data.poem_number || data.poemNumber;
    this.poemNumber = data.poem_number || data.poemNumber || data.id;
    this.unlockDate = data.unlock_date || data.unlockDate; // Formato YYYY-MM-DD
    this.module = data.module;
    this.title = data.title;
    this.content = data.content; // Array de estrofas
  }

  isUnlocked(targetDate) {
    if (!targetDate) return false;
    return this.unlockDate <= targetDate;
  }

  isNewRelease(targetDate) {
    return this.unlockDate === targetDate;
  }
}
