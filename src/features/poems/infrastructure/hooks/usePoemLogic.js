import { useState, useEffect, useMemo } from 'react';
import { LocalPoemRepository } from '../repositories/LocalPoemRepository.js';
import { GetPoemsUseCase } from '../../application/GetPoemsUseCase.js';

/**
 * Hook de Infraestructura: usePoemLogic
 * Orquesta la captura de la fecha del sistema (o simulada por URL), ejecuta el caso de uso
 * de negocio de forma asíncrona, y expone los estados reactivos de carga, éxito y error para la UI.
 * Autor: Agente 5 (Senior Frontend Engineer)
 */
export const usePoemLogic = () => {
  const [state, setState] = useState({
    loading: true,
    error: null,
    unlockedPoems: [],
    lockedPoems: [],
    isSystemShutdown: false,
    totalCount: 0,
    unlockedCount: 0,
    targetDate: ''
  });

  const [forceUnlock, setForceUnlock] = useState(false);

  // Captura y valida la fecha de simulación desde Query Params o usa la fecha local.
  // Memoizamos este valor para evitar ejecuciones repetidas e innecesarias.
  const targetDate = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get('date');
    
    // Validar formato YYYY-MM-DD
    if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      return dateParam;
    }
    
    // Obtener fecha actual en formato local YYYY-MM-DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        const repository = new LocalPoemRepository();
        const useCase = new GetPoemsUseCase(repository);
        
        const result = await useCase.execute(targetDate, forceUnlock);
        
        if (isMounted) {
          setState({
            loading: false,
            error: null,
            unlockedPoems: result.unlockedPoems,
            lockedPoems: result.lockedPoems,
            isSystemShutdown: result.isSystemShutdown,
            totalCount: result.totalCount,
            unlockedCount: result.unlockedCount,
            targetDate
          });
        }
      } catch (err) {
        if (isMounted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: err.message || 'Ocurrió un error inesperado al procesar los poemas.'
          }));
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [targetDate, forceUnlock]);

  const unlockAllPoems = () => {
    setForceUnlock(true);
  };

  return { ...state, unlockAllPoems };
};
