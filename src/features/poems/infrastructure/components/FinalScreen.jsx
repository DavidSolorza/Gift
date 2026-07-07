import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

/**
 * Componente: FinalScreen
 * Cierre definitivo del sistema para el 2 de agosto.
 * Rediseñado con la paleta Wine & Sand y lluvia de copos de arena y vino.
 * Autor: Agente 5 (Senior Frontend Engineer)
 */
export const FinalScreen = ({ onBypass }) => {
  const canvasRef = useRef(null);

  // Animación del Canvas de Partículas (Efecto Lluvia de Copos)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Paleta de partículas: arena y vino translúcido
    const colors = [
      'rgba(245, 235, 208, 0.4)',  // Sand (#F5EBD0)
      'rgba(245, 235, 208, 0.25)', // Sand suave
      'rgba(127, 1, 31, 0.2)',     // Wine (#7F011F)
      'rgba(85, 0, 19, 0.25)'       // Wine profundo
    ];

    const particles = Array.from({ length: 65 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      radius: Math.random() * 3.5 + 1.5,
      density: Math.random() * 35,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.5 + 0.3,
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.05 + 0.01,
      tiltAngle: 0,
      speed: Math.random() * 1.1 + 0.5
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += p.speed + (Math.cos(p.density) + 1.5) / 2;
        p.x += Math.sin(p.tiltAngle) * 0.7;
        p.tilt = Math.sin(p.tiltAngle - idx / 3) * 12;

        if (p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = -20;
          p.tilt = Math.random() * 10 - 5;
          p.speed = Math.random() * 1.1 + 0.5;
        }

        ctx.beginPath();
        ctx.arc(p.x + p.tilt, p.y, p.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const containerVariants = {
    initial: { backgroundColor: '#000000' },
    animate: { 
      backgroundColor: '#7F011F',
      transition: { duration: 4.5, ease: 'easeInOut' }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom, duration: 1.8, ease: [0.16, 1, 0.3, 1] }
    })
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen w-screen flex flex-col justify-center items-center px-6 text-center select-none overflow-hidden relative bg-gradient-to-br from-[#7F011F] to-[#550013]"
    >
      {/* Canvas para la lluvia de copos */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Luces de fondo sutiles en tono Sand */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,235,208,0.04)_0%,transparent_70%)] pointer-events-none z-0" />

      <div className="max-w-2xl z-10 flex flex-col items-center">
        {/* Ícono de corazón pulsante */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [1, 1.08, 1], 
            opacity: 1,
            transition: { 
              scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
              opacity: { delay: 1, duration: 1.5 } 
            }
          }}
          className="p-4 bg-[#F5EBD0]/05 border border-[#F5EBD0]/20 rounded-full mb-8 text-[#F5EBD0] shadow-[0_0_15px_rgba(245,235,208,0.15)]"
        >
          <Heart className="w-8 h-8 fill-[#F5EBD0]/10" />
        </motion.div>

        {/* Textos secuenciales */}
        <motion.h1 
          custom={1.8}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#F5EBD0] tracking-wide mb-6 leading-tight"
        >
          El recorrido ha finalizado, Nataly.
        </motion.h1>

        <motion.p 
          custom={3.5}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-base sm:text-lg md:text-xl text-[#F5EBD0]/90 font-serif italic font-light leading-relaxed mb-8 max-w-lg"
        >
          "Ciento de versos escritos en el viento,<br />
          cinco meses guardando cada latido,<br />
          y una sola certeza inmutable:<br />
          el amor no mide el tiempo, pero lo hace eterno."
        </motion.p>

        <motion.div 
          custom={5.2}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#F5EBD0]/30 to-transparent mb-8"
        />

        <motion.p 
          custom={6.5}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-xs font-mono tracking-widest text-[#F5EBD0]/60 uppercase font-light"
        >
          Gracias por leer cada día. Con todo mi amor.
        </motion.p>

        {/* Botón Volver a la Bitácora */}
        <motion.button
          custom={8.0}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(245, 235, 208, 0.22)' }}
          whileTap={{ scale: 0.98 }}
          onClick={onBypass}
          className="mt-12 px-6 py-2.5 bg-[#F5EBD0]/05 hover:bg-[#F5EBD0]/15 text-[#F5EBD0] border border-[#F5EBD0]/35 rounded-full font-mono text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.4)]"
        >
          Volver a la bitácora
        </motion.button>
      </div>

      {/* Partículas flotantes sutiles adicionales en CSS */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-[#F5EBD0] rounded-full blur-[1.5px]"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float-slow ${Math.random() * 10 + 15}s infinite linear`,
              animationDelay: `${Math.random() * -10}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float-slow {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.1; }
          50% { transform: translateY(-45px) translateX(20px) scale(1.2); opacity: 0.7; }
          100% { transform: translateY(-90px) translateX(0px) scale(1); opacity: 0.1; }
        }
      `}</style>
    </motion.div>
  );
};
