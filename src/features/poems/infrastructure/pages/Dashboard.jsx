import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PoemCard } from '../components/PoemCard.jsx';
import { Heart, Calendar, Compass, RefreshCw, X, Lock } from 'lucide-react';

/**
 * Página: Dashboard
 * Panel principal de poemas. Muestra estadísticas de progreso,
 * un grid responsivo con carga escalonada (Staggered), soporte para simulación de fechas,
 * notificaciones Toast personalizadas para bloqueos y un lector expandido via layoutId.
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

  // Verificar si la fecha de la URL es diferente de la real para mostrar la alerta
  const isSimulation = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const local = new Date();
    const localStr = `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, '0')}-${String(local.getDate()).padStart(2, '0')}`;
    return targetDate !== todayStr && targetDate !== localStr;
  }, [targetDate]);

  // Manejo de la notificación Toast
  const triggerToast = (unlockDateStr) => {
    // Formatear la fecha del bloqueo
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

  // Contenedor de la lista para animar los elementos secuencialmente (Stagger)
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03, // Transición secuencial rápida y profesional
        delayChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-gray-100 py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* Fondo con degradado radial sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(88,28,135,0.08)_0%,transparent_50%)] pointer-events-none" />

      {/* Notificación Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: -20, x: "-50%", scale: 0.95 }}
            className="fixed top-6 left-1/2 z-50 px-5 py-3.5 bg-purple-950/90 border border-purple-500/30 text-purple-200 text-xs tracking-wider uppercase font-mono rounded-xl shadow-[0_10px_30px_rgba(168,85,247,0.2)] flex items-center gap-3 backdrop-blur-md w-[calc(100%-2rem)] max-w-sm text-center justify-center"
          >
            <Lock className="w-4 h-4 text-purple-400 shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Cabecera del Panel */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.04] pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 text-purple-400 font-mono text-xs uppercase tracking-widest font-bold">
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Mi corazon late por ti</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-white tracking-wide">
              Un recorrido maravillo donde las palabras no alcanzan 
            </h1>
          </div>

          {/* Estado de la simulación */}
          {isSimulation && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400/90 text-[11px] font-mono rounded-lg self-start md:self-auto">
              <Calendar className="w-3.5 h-3.5" />
              <span>Simulación Activa: {targetDate}</span>
              <button 
                onClick={() => { window.location.href = window.location.pathname; }}
                className="ml-1 hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 inline" />
              </button>
            </div>
          )}
        </header>

        {/* Tarjeta de Estadísticas / Progreso */}
        <section className="mb-12 p-6 rounded-2xl bg-gradient-to-br from-[#121215] to-[#0e0e11] border border-white/[0.05] shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Texto de progreso */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
                <Heart className="w-6 h-6 fill-purple-500/10" />
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-widest font-mono">Progreso de Desbloqueo</span>
                <h4 className="text-lg font-sans font-medium text-purple-100 mt-0.5">
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
              <div className="w-full h-2.5 bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.02]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
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
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex justify-center items-center p-4 cursor-zoom-out"
          >
            {/* Contenedor del poema expandido */}
            <motion.article 
              layoutId={`card-${activePoem.id}`}
              onClick={(e) => e.stopPropagation()}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className="w-full max-w-3xl bg-gradient-to-b from-[#141416] to-[#0a0a0c] border border-purple-500/25 p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-2xl relative cursor-default max-h-[90vh] overflow-y-auto"
            >
              {/* Botón de Cierre */}
              <button 
                onClick={() => setActivePoem(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Encabezado del Lector */}
              <header className="mb-6 pb-4 border-b border-white/[0.04] pr-10 sm:pr-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-purple-400 font-mono font-bold">
                    {activePoem.module}
                  </span>
                  <span className="text-[11px] text-gray-500 font-mono">
                    Poema N° {String(activePoem.poemNumber).padStart(3, '0')}
                  </span>
                </div>
                <h2 className="text-xl sm:text-3xl font-serif font-bold text-purple-100 tracking-wide mt-2">
                  {activePoem.title}
                </h2>
              </header>

              {/* Contenido Poético Completo (Sin Clamping) */}
              <p className="text-gray-200 text-sm sm:text-lg leading-relaxed font-light italic whitespace-pre-line border-l-2 border-purple-500/30 pl-4 sm:pl-5 py-2 mb-8 bg-white/[0.01] rounded-r-xl">
                {activePoem.content.join('\n\n')}
              </p>

              {/* Pie de Página del Lector */}
              <footer className="pt-4 border-t border-white/[0.03] flex justify-between items-center text-[10px] text-gray-500 font-mono">
                <span>Revelado el {activePoem.unlockDate}</span>
                <div className="flex items-center gap-1 text-purple-400/80">
                  <Heart className="w-3 h-3 fill-purple-400/20" />
                  <span>Para Nataly</span>
                </div>
              </footer>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
