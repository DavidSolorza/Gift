import React from 'react';
import { Lock } from 'lucide-react';

/**
 * Componente: LockOverlay
 * Superposición elegante para representar el estado bloqueado de un poema con efectos de desenfoque.
 * Autor: Agente 5 (Senior Frontend Engineer)
 */
export const LockOverlay = ({ unlockDate }) => {
  // Formatear la fecha para hacerla más amigable en español (ej. "14 de Julio")
  const formatDate = (dateStr) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    try {
      const parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      const [_, month, day] = parts;
      const monthIndex = parseInt(month, 10) - 1;
      return `${parseInt(day, 10)} de ${months[monthIndex]}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/75 backdrop-blur-[2px] rounded-2xl border border-white/5 transition-all duration-500 group-hover:bg-black/80">
      <div className="p-3 bg-purple-950/40 border border-purple-500/20 rounded-full mb-3 text-purple-400 group-hover:scale-110 group-hover:text-purple-300 transition-all duration-500">
        <Lock className="w-5 h-5" />
      </div>
      <span className="text-xs uppercase tracking-widest text-gray-500 font-mono">Disponible el</span>
      <span className="text-sm font-semibold text-purple-300/80 mt-1 font-sans">{formatDate(unlockDate)}</span>
    </div>
  );
};
