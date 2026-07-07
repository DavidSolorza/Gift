import React from 'react';
import { Lock } from 'lucide-react';

/**
 * Componente: LockOverlay
 * Superposición elegante para representar el estado bloqueado de un poema.
 * Diseñado con la paleta Wine & Sand.
 * Autor: Agente 5 (Senior Frontend Engineer)
 */
export const LockOverlay = ({ unlockDate }) => {
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
    <div className="absolute inset-0 flex flex-col justify-center items-center bg-[#500010]/95 backdrop-blur-[3px] rounded-2xl border border-[#F5EBD0]/10 transition-all duration-500 group-hover:bg-[#500010]/98 relative">
      
      {/* Gradiente sutil de fondo en hover (Sand) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#F5EBD0]/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

      {/* Ícono de candado minimalista y delgado */}
      <div className="mb-4 p-2.5 bg-white/[0.02] border border-[#F5EBD0]/10 rounded-full text-[#F5EBD0] group-hover:scale-105 group-hover:text-white group-hover:border-[#F5EBD0]/20 transition-all duration-500 shadow-[0_0_15px_rgba(0,0,0,0.2)]">
        <Lock className="w-4 h-4 stroke-[1.5]" />
      </div>

      {/* Etiqueta Editorial */}
      <span className="text-[9px] uppercase tracking-[0.25em] text-[#F5EBD0]/60 font-mono font-bold">
        Disponible el
      </span>

      {/* Fecha destacada con tipografía de Serif y colores Sand */}
      <span className="text-xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#F5EBD0] to-[#e3d7bb] font-light mt-2 tracking-wide group-hover:from-white group-hover:to-[#fff5da] transition-colors duration-300">
        {formatDate(unlockDate)}
      </span>
    </div>
  );
};
