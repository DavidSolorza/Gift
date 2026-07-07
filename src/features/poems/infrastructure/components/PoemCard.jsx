import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LockOverlay } from './LockOverlay.jsx';
import { Heart } from 'lucide-react';

/**
 * Componente: PoemCard
 * Tarjeta individual para mostrar un poema. Ofrece un efecto 3D Tilt interactivo
 * al pasar el mouse, soporte para apertura expandida por layoutId y bloqueo seguro.
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
    
    // Angulo máximo de inclinación (12 grados)
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

  // Animación de entrada inicial (Fade + Slide)
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
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
        y: !isLocked ? -2 : 0
      }}
      transition={{ 
        type: "spring", 
        stiffness: 150, 
        damping: 18,
        // Evitamos que layout se anime con resorte excesivo si no es necesario
        layout: { type: "spring", stiffness: 220, damping: 26 }
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={`group relative overflow-hidden flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br from-[#121214] to-[#0d0d0f] border min-h-[280px] cursor-pointer transition-all duration-300 ${
        isTodayRelease 
          ? 'border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
          : isLocked 
            ? 'border-white/5 opacity-55 cursor-not-allowed' 
            : 'border-white/[0.06] hover:border-purple-500/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5),0_0_15px_rgba(168,85,247,0.06)]'
      }`}
    >
      {/* Glow de fondo al hacer hover */}
      {!isLocked && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}

      {/* Indicador de poema liberado el día de hoy */}
      {isTodayRelease && !isLocked && (
        <span className="absolute top-3 right-3 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
        </span>
      )}

      {/* Cabecera de la Tarjeta */}
      <div 
        className="flex-grow flex flex-col justify-start z-10"
        style={{ transform: "translateZ(30px)" }} // Da profundidad en 3D
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] uppercase tracking-widest text-purple-400/70 font-mono font-bold">
            {poem.module}
          </span>
          <span className="text-[11px] text-gray-500/80 font-mono font-medium">
            N° {String(poem.poemNumber).padStart(3, '0')}
          </span>
        </div>

        {/* Título */}
        <h3 className={`text-lg font-serif font-semibold tracking-wide mb-4 transition-colors duration-300 ${
          isLocked ? 'text-gray-600' : 'text-purple-100 group-hover:text-purple-300'
        }`}>
          {isLocked ? `Poema N° ${poem.poemNumber}` : poem.title}
        </h3>

        {/* Contenido (si está desbloqueado) */}
        {!isLocked && poem.content && (
          <div className="text-gray-300 text-sm leading-relaxed font-light italic whitespace-pre-line border-l border-purple-500/20 pl-3 py-1 group-hover:border-purple-500/40 transition-all duration-300 line-clamp-4">
            {poem.content.join('\n\n')}
          </div>
        )}
      </div>

      {/* Pie de la Tarjeta (si está desbloqueado) */}
      {!isLocked && (
        <div 
          className="mt-6 pt-3 border-t border-white/[0.03] flex justify-between items-center text-[10px] text-gray-600 font-mono z-10"
          style={{ transform: "translateZ(15px)" }}
        >
          <span>Revelado el {poem.unlockDate}</span>
          <Heart className="w-3.5 h-3.5 text-purple-500/40 group-hover:text-purple-500/80 group-hover:scale-125 fill-purple-500/0 group-hover:fill-purple-500/10 transition-all duration-300" />
        </div>
      )}

      {/* Superposición de Bloqueo */}
      {isLocked && <LockOverlay unlockDate={poem.unlockDate} />}
    </motion.div>
  );
};
