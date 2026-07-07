import React, { useState } from 'react';
import { usePoemLogic } from './features/poems/infrastructure/hooks/usePoemLogic.js';
import { Landing } from './features/poems/infrastructure/pages/Landing.jsx';
import { Dashboard } from './features/poems/infrastructure/pages/Dashboard.jsx';
import { FinalScreen } from './features/poems/infrastructure/components/FinalScreen.jsx';
import { Heart } from 'lucide-react';

/**
 * Componente Principal: App
 * Coordina el flujo global de navegación entre la Landing de bienvenida,
 * el Dashboard principal de poemas y la FinalScreen de despedida según el estado temporal.
 * Autor: Agente 5 (Senior Frontend Engineer)
 */
function App() {
  const { 
    loading, 
    error, 
    unlockedPoems, 
    lockedPoems, 
    isSystemShutdown, 
    totalCount, 
    unlockedCount, 
    targetDate,
    unlockAllPoems
  } = usePoemLogic();

  const [currentView, setCurrentView] = useState('landing');
  const [bypassShutdown, setBypassShutdown] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleBypass = () => {
    setBypassShutdown(true);
    unlockAllPoems();
    setCurrentView('dashboard');
  };

  // Vista de pantalla completa de Carga (Skeleton Loader premium)
  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-[#7F011F] to-[#550013] flex flex-col justify-center items-center px-6">
        <Heart className="w-10 h-10 text-[#F5EBD0]/40 animate-pulse mb-6" />
        <div className="w-48 h-1.5 bg-[#F5EBD0]/05 border border-[#F5EBD0]/10 rounded-full overflow-hidden">
          <div className="h-full bg-[#F5EBD0] rounded-full animate-[loading_1.5s_infinite_ease-in-out]" style={{ width: '40%' }}></div>
        </div>
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(250%); }
          }
        `}</style>
      </div>
    );
  }

  // Vista de error (Error boundary simplificado de UI)
  if (error) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-[#7F011F] to-[#550013] flex flex-col justify-center items-center px-6 text-center select-none">
        <div className="p-4 bg-white/5 border border-red-500/20 text-[#F5EBD0] rounded-2xl mb-4 text-sm font-mono max-w-md">
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-[#F5EBD0]/10 border border-[#F5EBD0]/20 hover:bg-[#F5EBD0]/20 rounded-full text-xs font-mono tracking-wider text-[#F5EBD0] uppercase transition-all duration-300 cursor-pointer"
        >
          Reintentar Carga
        </button>
      </div>
    );
  }

  // 1. Si la fecha del sistema indica cierre absoluto (2 de Agosto de 2026), renderizamos FinalScreen directamente (salvo bypass)
  let activeContent;
  if (isSystemShutdown && !bypassShutdown) {
    activeContent = <FinalScreen onBypass={handleBypass} />;
  } else if (currentView === 'landing') {
    // 2. Si no es el cierre, alternamos entre Landing y Dashboard
    activeContent = <Landing onStart={() => setCurrentView('dashboard')} />;
  } else {
    activeContent = (
      <Dashboard
        unlockedPoems={unlockedPoems}
        lockedPoems={lockedPoems}
        totalCount={totalCount}
        unlockedCount={unlockedCount}
        targetDate={targetDate}
      />
    );
  }

  return (
    <div onMouseMove={handleMouseMove} className="relative min-h-screen w-screen overflow-x-hidden">
      <div className="grain-overlay" />
      <div 
        className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000 hidden md:block"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(245, 235, 208, 0.04), transparent 80%)`
        }}
      />
      {activeContent}
    </div>
  );
}

export default App;
