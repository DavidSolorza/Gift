import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PoemCard } from '../components/PoemCard.jsx';
import { Heart, Compass, X, Lock } from 'lucide-react';

/**
 * Helper: getModalBg
 * Mapea los diferentes módulos a variaciones sutiles dentro de la gama cromática del vino (Wine #7F011F),
 * logrando una sutil atmósfera distintiva para cada bloque emocional.
 */
const getModalBg = (moduleName) => {
  switch (moduleName) {
    case 'AMOR':
    case 'CARIÑO':
    case 'ADMIRACIÓN':
    case 'CONFIANZA':
      return 'from-[#7F011F] to-[#500010] border-[#F5EBD0]/35';
    case 'APEGO':
    case 'PROTECCIÓN':
    case 'DESEO':
    case 'PAZ':
      return 'from-[#6c0119] to-[#40000a] border-[#F5EBD0]/35';
    case 'MIEDO':
    case 'ORGULLO':
    case 'CELOS':
    case 'GRATITUD':
      return 'from-[#550113] to-[#2b0005] border-[#F5EBD0]/35';
    case 'POEMAS MIXTOS':
    case 'POEMAS ADICIONALES':
      return 'from-[#8c0223] to-[#550012] border-[#F5EBD0]/35';
    case 'EL FINAL':
      return 'from-[#74011b] to-[#45000e] border-[#F5EBD0]/35';
    default:
      return 'from-[#7F011F] to-[#550013] border-[#F5EBD0]/30';
  }
};

/**
 * Página: Dashboard
 * Panel principal de poemas. Muestra estadísticas de progreso,
 * un grid responsivo y un lector expandido. Adaptado a la paleta Wine & Sand.
 * Autor: Agente 5 (Senior Frontend Engineer)
 */
export const Dashboard = ({ 
  unlockedPoems, 
  lockedPoems, 
  totalCount, 
  unlockedCount, 
  targetDate 
}) => {
  const [activePoem, setActivePoem] = useState(null);
  const [toast, setToast] = useState(null);

  // Combinamos todos los poemas para representarlos en el grid
  const allPoems = useMemo(() => {
    return [...unlockedPoems, ...lockedPoems].sort((a, b) => a.poemNumber - b.poemNumber);
  }, [unlockedPoems, lockedPoems]);

  // Porcentaje de progreso
  const progressPercent = useMemo(() => {
    return totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;
  }, [unlockedCount, totalCount]);



  // Manejo de la notificación Toast
  const triggerToast = (unlockDateStr) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    let formattedDate = unlockDateStr;
    try {
      const parts = unlockDateStr.split('-');
      if (parts.length === 3) {
        const [_, month, day] = parts;
        formattedDate = `${parseInt(day, 10)} de ${months[parseInt(month, 10) - 1]}`;
      }
    } catch {}

    setToast(`Este recuerdo está sellado. Se revelará el ${formattedDate}.`);

    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Contenedor de la lista para animar los elementos secuencialmente
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7F011F] to-[#550013] text-[#F5EBD0] py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-[#F5EBD0]/20 overflow-x-hidden">
      
      {/* Fondo con degradado radial sutil en tono Sand */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,235,208,0.04)_0%,transparent_60%)] pointer-events-none" />

      {/* Notificación Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: -20, x: "-50%", scale: 0.95 }}
            className="fixed top-6 left-1/2 z-50 px-5 py-3.5 bg-[#7F011F] border border-[#F5EBD0]/35 text-[#F5EBD0] text-xs tracking-wider uppercase font-mono rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-3 backdrop-blur-md w-[calc(100%-2rem)] max-w-sm text-center justify-center"
          >
            <Lock className="w-4 h-4 text-[#F5EBD0] shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Cabecera del Panel */}
        <header className="mb-12 border-b border-[#F5EBD0]/10 pb-8">
          <div className="flex items-center gap-2 mb-2 text-[#F5EBD0]/80 font-mono text-xs uppercase tracking-widest font-bold">
            <Compass className="w-4 h-4 text-[#F5EBD0]/80" />
            <span>Diario de Versos</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#F5EBD0] tracking-wide">
            El Recorrido del Amor
          </h1>
        </header>

        {/* Tarjeta de Estadísticas / Progreso */}
        <section className="mb-12 p-6 rounded-2xl bg-[#F5EBD0]/02 border border-[#F5EBD0]/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Texto de progreso */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#F5EBD0]/05 border border-[#F5EBD0]/10 rounded-xl text-[#F5EBD0]">
                <Heart className="w-6 h-6 fill-[#F5EBD0]/10" />
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-widest font-mono">Progreso de Desbloqueo</span>
                <h4 className="text-lg font-sans font-medium text-[#F5EBD0]/90 mt-0.5">
                  {unlockedCount} de {totalCount} poemas liberados
                </h4>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="flex-grow max-w-md">
              <div className="flex justify-between text-xs text-gray-400 font-mono mb-2">
                <span>Completado</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-black/25 rounded-full overflow-hidden border border-white/[0.01]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-gradient-to-r from-[#F5EBD0] to-[#e3d7bb] rounded-full"
                />
              </div>
            </div>

          </div>
        </section>

        {/* Grid de Poemas */}
        <motion.main 
          variants={gridVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {allPoems.map((poem) => {
              const isLocked = lockedPoems.some(lp => lp.poemNumber === poem.poemNumber);
              const isTodayRelease = poem.unlockDate === targetDate;
              return (
                <PoemCard
                  key={poem.id}
                  poem={poem}
                  isLocked={isLocked}
                  isTodayRelease={isTodayRelease}
                  onClick={(p) => setActivePoem(p)}
                  onLockClick={(date) => triggerToast(date)}
                />
              );
            })}
          </AnimatePresence>
        </motion.main>

      </div>

      {/* Lector de Poema Expandido (Modal con Hero Transition por layoutId) */}
      <AnimatePresence>
        {activePoem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePoem(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-center p-4 cursor-zoom-out"
          >
            {/* Contenedor del poema expandido */}
            <motion.article 
              layoutId={`card-${activePoem.id}`}
              onClick={(e) => e.stopPropagation()}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className={`w-full max-w-3xl bg-gradient-to-b ${getModalBg(activePoem.module)} p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-2xl relative cursor-default max-h-[90vh] overflow-y-auto border transition-all duration-500`}
            >
              {/* Botón de Cierre */}
              <button 
                onClick={() => setActivePoem(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-white/5 border border-white/5 text-[#F5EBD0]/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Encabezado del Lector */}
              <header className="mb-6 pb-4 border-b border-[#F5EBD0]/10 pr-10 sm:pr-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#F5EBD0]/80 font-mono font-bold">
                    {activePoem.module}
                  </span>
                  <span className="text-[11px] text-[#F5EBD0]/60 font-mono">
                    Poema N° {String(activePoem.poemNumber).padStart(3, '0')}
                  </span>
                </div>
                <h2 className="text-xl sm:text-3xl font-serif font-bold text-[#F5EBD0] tracking-wide mt-2">
                  {activePoem.title}
                </h2>
              </header>

              {/* Contenido Poético Completo con animación de revelado de pluma */}
              <motion.div 
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.15,
                      delayChildren: 0.2
                    }
                  }
                }}
                initial="hidden"
                animate="visible"
                className="border-l-2 border-[#F5EBD0]/40 pl-4 sm:pl-5 py-1 mb-8 bg-white/[0.005] rounded-r-xl"
              >
                {activePoem.content.map((stanza, idx) => (
                  <motion.p 
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, y: 8 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                      }
                    }}
                    className="text-[#F5EBD0] text-sm sm:text-lg leading-relaxed font-poem italic mb-5 last:mb-0"
                  >
                    {stanza}
                  </motion.p>
                ))}
              </motion.div>

              {/* Pie de Página del Lector */}
              <footer className="pt-4 border-t border-[#F5EBD0]/10 flex justify-between items-center text-[10px] text-[#F5EBD0]/60 font-mono">
                <span>Revelado el {activePoem.unlockDate}</span>
                <div className="flex items-center gap-1 text-[#F5EBD0]/80">
                  <Heart className="w-3 h-3 fill-[#F5EBD0]/20" />
                  <span>Para ti ♡</span>
                </div>
              </footer>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
