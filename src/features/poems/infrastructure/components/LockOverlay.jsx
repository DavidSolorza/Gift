import React from 'react';
import { Lock } from 'lucide-react';

/**
 * Componente: LockOverlay
 * Superposición elegante para representar el estado bloqueado de un poema.
 * Diseñado con estética premium (editorial / Glassmorphism), tipografía jerarquizada
 * y micro-detalles de degradado en hover.
 * Autor: Agente 5 (Senior Frontend Engineer)
 */
export const LockOverlay = ({ unlockDate }) => {
  // Formatear la fecha para hacerla amigable e impactante (ej. "14 de Julio")
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
    <div className="absolute inset-0 flex flex-col justify-center items-center bg-[#070709]/80 backdrop-blur-[3px] rounded-2xl border border-white/[0.04] transition-all duration-500 group-hover:bg-[#070709]/85 relative">
      
      {/* Gradiente sutil de fondo en hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

      {/* Ícono de candado minimalista y delgado */}
      <div className="mb-4 p-2.5 bg-white/[0.02] border border-white/5 rounded-full text-purple-400/70 group-hover:scale-105 group-hover:text-purple-300/90 group-hover:border-purple-500/20 transition-all duration-500 shadow-[0_0_15px_rgba(0,0,0,0.2)]">
        <Lock className="w-4 h-4 stroke-[1.5]" />
      </div>

      {/* Etiqueta Editorial */}
      <span className="text-[9px] uppercase tracking-[0.25em] text-gray-500/90 font-mono font-bold">
        Disponible el
      </span>

      {/* Fecha destacada con tipografía de Serif (Playfair Display) */}
      <span className="text-xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-200 font-light mt-2 tracking-wide group-hover:from-purple-100 group-hover:to-indigo-100 transition-colors duration-300">
        {formatDate(unlockDate)}
      </span>
    </div>
  );
};
