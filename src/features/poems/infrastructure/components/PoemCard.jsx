import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LockOverlay } from './LockOverlay.jsx';
import { Heart } from 'lucide-react';

/**
 * Componente: PoemCard
 * Tarjeta individual adaptada a la paleta Wine & Sand.
 * Autor: Agente 5 (Senior Frontend Engineer)
 */
export const PoemCard = ({ poem, isLocked, isTodayRelease, onClick, onLockClick }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  // Manejo de la inclinación 3D (Tilt Card)
  const handleMouseMove = (e) => {
    if (isLocked) return;
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    const maxTilt = 12;
    const rX = -(y / (box.height / 2)) * maxTilt;
    const rY = (x / (box.width / 2)) * maxTilt;
    
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // Animación de entrada inicial
  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const handleClick = () => {
    if (isLocked) {
      if (onLockClick) onLockClick(poem.unlockDate);
    } else {
      if (onClick) onClick(poem);
    }
  };

  return (
    <motion.div
      layoutId={`card-${poem.id}`}
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
        y: !isLocked ? -2 : 0
      }}
      transition={{ 
        type: "spring", 
        stiffness: 150, 
        damping: 18,
        layout: { type: "spring", stiffness: 220, damping: 26 }
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={`group relative overflow-hidden flex flex-col justify-between p-6 rounded-2xl bg-[#F5EBD0]/04 backdrop-blur-md border min-h-[280px] cursor-pointer transition-all duration-500 ${
        isTodayRelease 
          ? 'border-[#F5EBD0] border-[1.5px] shadow-[0_0_25px_rgba(245,235,208,0.22)] bg-[#F5EBD0]/10' 
          : isLocked 
            ? 'border-white/[0.02] opacity-55 cursor-not-allowed' 
            : 'border-[#F5EBD0]/15 hover:border-[#F5EBD0]/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(245,235,208,0.08)]'
      }`}
    >
      {/* Glow de fondo al hacer hover */}
      {!isLocked && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,235,208,0.06)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}

      {/* Indicador de poema liberado el día de hoy */}
      {isTodayRelease && !isLocked && (
        <span className="absolute top-3 right-3 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5EBD0] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F5EBD0]"></span>
        </span>
      )}

      {/* Cabecera de la Tarjeta */}
      <div 
        className="flex-grow flex flex-col justify-start z-10"
        style={{ transform: "translateZ(30px)" }}
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] uppercase tracking-widest text-[#F5EBD0]/80 font-mono font-bold">
            {poem.module}
          </span>
          <span className="text-[11px] text-[#F5EBD0]/60 font-mono">
            N° {String(poem.poemNumber).padStart(3, '0')}
          </span>
        </div>

        {/* Título */}
        <h3 className={`text-lg font-serif font-semibold tracking-wide mb-4 transition-colors duration-300 ${
          isLocked ? 'text-gray-500' : 'text-[#F5EBD0] group-hover:text-[#fffcf5]'
        }`}>
          {isLocked ? `Poema N° ${poem.poemNumber}` : poem.title}
        </h3>

        {/* Contenido (si está desbloqueado) - usando tipografía Lora */}
        {!isLocked && poem.content && (
          <div className="text-[#F5EBD0] text-sm leading-relaxed font-poem font-medium italic border-l border-[#F5EBD0]/20 pl-3 py-1 group-hover:border-[#F5EBD0]/45 transition-all duration-300 line-clamp-4">
            {poem.content.join('\n\n')}
          </div>
        )}
      </div>

      {/* Pie de la Tarjeta (si está desbloqueado) */}
      {!isLocked && (
        <div 
          className="mt-6 pt-3 border-t border-[#F5EBD0]/10 flex justify-between items-center text-[10px] text-[#F5EBD0]/50 font-mono z-10"
          style={{ transform: "translateZ(15px)" }}
        >
          <span>Revelado el {poem.unlockDate}</span>
          <Heart className="w-3.5 h-3.5 text-[#F5EBD0]/40 group-hover:text-[#F5EBD0] group-hover:scale-125 fill-[#F5EBD0]/0 group-hover:fill-[#F5EBD0]/10 transition-all duration-300" />
        </div>
      )}

      {/* Superposición de Bloqueo */}
      {isLocked && <LockOverlay unlockDate={poem.unlockDate} />}
    </motion.div>
  );
};
