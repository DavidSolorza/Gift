Guía de Desarrollo: Proyecto "100 Poemas para Nataly"
1. Arquitectura del Proyecto
Utilizaremos Vite por su velocidad y React con Tailwind CSS. La estructura de carpetas será modular para facilitar el mantenimiento.

Plaintext
/src
  /assets        # Imágenes y assets globales
  /components    # UI reutilizable
    /PoemCard.jsx
    /LockOverlay.jsx
    /FinalScreen.jsx
  /data          # Tus 5 archivos JSON (modulo1.json, etc.)
  /hooks         # Lógica de desbloqueo
    /usePoemLogic.js
  /context       # Estado global (Auth/System Status)
  /pages         # Vistas
    /Dashboard.jsx
    /Landing.jsx
2. Lógica Central (usePoemLogic.js)
Esta es la parte "matemática" del proyecto. Necesitas una función que compare la fecha actual con el unlock_date de cada poema.

JavaScript
// Ejemplo de lógica en un hook
export const usePoemLogic = (allPoems) => {
  const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

  const unlockedPoems = allPoems.filter(p => p.unlock_date <= today);
  const lockedPoems = allPoems.filter(p => p.unlock_date > today);

  return { unlockedPoems, lockedPoems, isSystemShutdown: today === '2026-08-02' };
};
3. UI Component: PoemCard.jsx (Tailwind)
La tarjeta debe ser minimalista. Si está bloqueada, aplicamos un filtro visual.

JavaScript
const PoemCard = ({ poem, isLocked }) => (
  <div className={`p-6 bg-gray-900 border ${isLocked ? 'border-gray-800 opacity-50' : 'border-purple-500'} rounded-lg transition-all`}>
    {isLocked ? (
      <div className="flex justify-center items-center h-full">
        <span className="text-gray-500">🔒 Bloqueado hasta {poem.unlock_date}</span>
      </div>
    ) : (
      <>
        <h3 className="text-xl text-purple-200 mb-2">{poem.title}</h3>
        <p className="text-gray-300 italic">{poem.content.join('\n')}</p>
      </>
    )}
  </div>
);
4. Plan de Implementación por Fases
Fase 1: El Lanzamiento (14 de Julio)
Componente Landing.jsx: Pantalla a pantalla completa (h-screen w-screen bg-black).

Mensaje: Usa una tipografía elegante (font-serif) con un efecto de fade-in de 2 segundos.

Botón: "Comenzar el recorrido" que redirige al /dashboard.

Fase 2: Sincronización (15 Jul - 1 Ago)
Grid de Poemas: Usa un grid-cols-1 md:grid-cols-2 lg:grid-cols-3 de Tailwind.

Feedback visual: Cuando ella entre, los poemas que se desbloquearon ese día deben tener una animación de "entrada" (animate-pulse o fade-in).

Fase 3: Cierre (2 de Agosto)
Detector de Fin: Si allPoems.length === 100 y today === '2026-08-02':

Ocultas el Grid de poemas.

Renderizas FinalScreen.jsx.

Animación: Usa framer-motion para que el texto de despedida aparezca mientras el fondo cambia de negro a un tono más cálido.

5. Checklist de Desarrollo
[ ] Configuración: pnpm create vite@latest y configurar Tailwind CSS.

[ ] Data: Convertir tus JSONs en un único array centralizado para facilitar el filtrado.

[ ] Lógica: Implementar el hook de comparación de fechas YYYY-MM-DD.

[ ] Estilos: Definir la paleta de colores (Negros profundos #0A0A0A, Grises espaciales, y detalles en tonos violetas).

[ ] Animaciones: Instalar framer-motion para que el despliegue de los poemas sea suave.

[ ] Testing: Simular manualmente la fecha 2026-08-02 en tu código para verificar que el "Gran Final" se ejecute correctamente.