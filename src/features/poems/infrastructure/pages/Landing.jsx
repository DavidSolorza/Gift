import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/**
 * Página: Landing
 * Pantalla de bienvenida minimalista, premium y altamente interactiva.
 * Incluye un efecto Parallax sensible al mouse y revelado de texto palabra por palabra.
 * Autor: Agente 5 (Senior Frontend Engineer)
 */
export const Landing = ({ onStart }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Manejador del efecto Parallax sutil
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    // Dividimos por un factor alto para mantener el movimiento sutil y elegante
    const x = (clientX - window.innerWidth / 2) / 35;
    const y = (clientY - window.innerHeight / 2) / 35;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  // Frases divididas en palabras para la animación de revelación
  const titleText = "100 Poemas para ti";
  const quoteText = "Cada día guarda una palabra y cada letra tiene un momento. Bienvenida a este pequeño espacio creado solo para ti.";

  // Configuración de los contenedores de Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="h-screen w-screen bg-black flex flex-col justify-center items-center px-6 relative overflow-hidden select-none"
    >
      {/* Aura decorativa Parallax de fondo */}
      <motion.div 
        animate={{ 
          x: mousePosition.x * 1.5, 
          y: mousePosition.y * 1.5 
        }}
        transition={{ type: "spring", stiffness: 40, damping: 15 }}
        className="absolute w-[600px] h-[600px] rounded-full bg-purple-950/15 blur-[130px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />

      {/* Cielo estrellado sutil con efecto Parallax inverso */}
      <motion.div 
        animate={{ 
          x: -mousePosition.x * 0.5, 
          y: -mousePosition.y * 0.5 
        }}
        transition={{ type: "spring", stiffness: 50, damping: 18 }}
        className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(1.5px_1.5px_at_10%_20%,#ffffff,transparent_100%),radial-gradient(1.5px_1.5px_at_40%_70%,#ffffff_80%,transparent_100%),radial-gradient(1.5px_1.5px_at_70%_30%,#ffffff_50%,transparent_100%),radial-gradient(2px_2px_at_90%_80%,#ffffff_30%,transparent_100%)]"
      />

      {/* Contenedor principal de contenido */}
      <div className="max-w-xl z-10 flex flex-col items-center text-center">
        
        {/* Tag introductorio */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.1 }}
          className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full mb-8 text-[10px] tracking-[0.2em] uppercase font-mono text-purple-400/80"
        >
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>Un regalo en el tiempo</span>
        </motion.div>

        {/* Mensaje de bienvenida: Revelación por palabras */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight tracking-wide mb-6 flex flex-wrap justify-center gap-x-3"
        >
          {titleText.split(" ").map((word, idx) => (
            <motion.span 
              key={idx} 
              variants={itemVariants}
              className="inline-block"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtítulo / Cita poética: Revelación por palabras con retraso */}
        <motion.p
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          custom={1.2}
          className="text-sm sm:text-base md:text-lg text-gray-400 font-serif italic leading-relaxed max-w-md mb-12 font-light flex flex-wrap justify-center gap-x-1.5"
        >
          {quoteText.split(" ").map((word, idx) => (
            <motion.span 
              key={idx} 
              variants={itemVariants}
              className="inline-block"
            >
              {word}
            </motion.span>
          ))}
        </motion.p>

        {/* Botón de inicio interactivo con micro-animaciones */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(168, 85, 247, 0.25)' }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-full font-sans font-medium text-xs tracking-wider uppercase shadow-[0_4px_20px_rgba(168,85,247,0.15)] border border-purple-500/20 transition-all duration-300 cursor-pointer"
        >
          Comenzar el recorrido
        </motion.button>
      </div>
    </div>
  );
};
