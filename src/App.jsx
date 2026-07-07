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

  const handleBypass = () => {
    setBypassShutdown(true);
    unlockAllPoems();
    setCurrentView('dashboard');
  };

  // Vista de pantalla completa de Carga (Skeleton Loader premium)
  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-[#0A0A0C] flex flex-col justify-center items-center px-6">
        <Heart className="w-10 h-10 text-purple-500/40 animate-pulse mb-6" />
        <div className="w-48 h-1.5 bg-white/[0.03] border border-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-purple-500 rounded-full animate-[loading_1.5s_infinite_ease-in-out]" style={{ width: '40%' }}></div>
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
      <div className="min-h-screen w-screen bg-[#0A0A0C] flex flex-col justify-center items-center px-6 text-center select-none">
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl mb-4 text-sm font-mono max-w-md">
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-xs font-mono tracking-wider text-gray-300 uppercase transition-all duration-300 cursor-pointer"
        >
          Reintentar Carga
        </button>
      </div>
    );
  }

  // 1. Si la fecha del sistema indica cierre absoluto (2 de Agosto de 2026), renderizamos FinalScreen directamente (salvo bypass)
  if (isSystemShutdown && !bypassShutdown) {
    return <FinalScreen onBypass={handleBypass} />;
  }

  // 2. Si no es el cierre, alternamos entre Landing y Dashboard
  if (currentView === 'landing') {
    return <Landing onStart={() => setCurrentView('dashboard')} />;
  }

  return (
    <Dashboard
      unlockedPoems={unlockedPoems}
      lockedPoems={lockedPoems}
      totalCount={totalCount}
      unlockedCount={unlockedCount}
      targetDate={targetDate}
    />
  );
}

export default App;
