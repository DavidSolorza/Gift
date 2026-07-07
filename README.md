# 100 Poemas para Nataly 📜💜

Este es un rincón digital poético y altamente inmersivo creado para la entrega progresiva de 100 poemas divididos en 5 módulos emocionales. El sistema libera los poemas automáticamente a medida que transcurren los días, culminando con una despedida emotiva y cálida el **2 de agosto de 2026**.

Este proyecto se ha implementado siguiendo un **Contrato de Gobernanza Técnica Multi-Agente** basado en Clean Architecture y Vertical Slicing.

---

## 🚀 Inicialización y Despliegue Rápido

### Prerrequisitos
- Node.js (v18 o superior)
- `pnpm` o `npm`

### Instalación de Dependencias
```bash
# Instalar todos los paquetes base y Tailwind v4
pnpm install
```

### Ejecutar en Desarrollo
```bash
# Iniciar el servidor local de Vite
pnpm dev
```
Abre tu navegador en [http://localhost:5173](http://localhost:5173).

### Compilar para Producción
```bash
# Genera el compilado estático optimizado en la carpeta dist/
pnpm run build
```

---

## 🛠️ Simulación de Fechas (QA y Pruebas)

Dado que los poemas se desbloquean en fechas futuras del año 2026, la aplicación implementa una funcionalidad de inyección temporal segura en la URL para simular fechas exactas:

*   **Fase 1 (Inicio):** [http://localhost:5173/?date=2026-07-14](http://localhost:5173/?date=2026-07-14) (Desbloquea Módulo 1: "AMOR")
*   **Fase 2 (Sincronización):** [http://localhost:5173/?date=2026-07-18](http://localhost:5173/?date=2026-07-18) (Desbloquea Módulo 2: "APEGO")
*   **Fase 2.1 (Intermedia):** [http://localhost:5173/?date=2026-07-26](http://localhost:5173/?date=2026-07-26) (Módulos 1, 2, 3 y 4 libres; Módulo 5 bloqueado)
*   **Fase 3 (Gran Cierre):** [http://localhost:5173/?date=2026-08-02](http://localhost:5173/?date=2026-08-02) (Oculta el grid y muestra la pantalla final de despedida)

*Nota: Si no se pasa el parámetro `?date=YYYY-MM-DD`, el sistema tomará automáticamente la fecha actual local del dispositivo.*

---

## 📂 Arquitectura de Directorios

La estructura física del proyecto respeta milimétricamente la organización por **Features (Rebanadas Verticales)** aisladas e independientes del núcleo base:

```plaintext
5meses/
├── docs/                    # Especificaciones y diseños del sistema
│   ├── 1_architecture.md    # Diseño de componentes y decisiones (ADR)
│   ├── 2_database.md        # Diseño físico DDL PostgreSQL y diccionario
│   └── 3_api_spec.md        # Especificación REST de endpoints y errores
├── src/                     # Código fuente de la aplicación
│   ├── core/                # Elementos core globales e invariables
│   │   ├── config/          # Gestión de variables de entorno y configs
│   │   ├── errors/          # Clasificación y modelado de errores
│   │   └── http/            # Cliente HTTP nativo (sin SDKs comerciales)
│   └── features/            # Rebanadas Verticales Autónomas
│       └── poems/           # Módulo autónomo de poemas
│           ├── domain/      # Entidades y interfaces contractuales (Poem)
│           ├── application/ # Casos de uso de negocio (GetPoemsUseCase)
│           └── infrastructure/ # Implementaciones de UI y repositorios
│               ├── components/  # Componentes visuales (PoemCard, FinalScreen)
│               ├── pages/       # Vistas de alto nivel (Landing, Dashboard)
│               ├── data/        # Archivo JSON consolidado (1 a 100 poemas)
│               ├── hooks/       # usePoemLogic.js (React State y URL logic)
│               └── repositories/# LocalPoemRepository (Adaptador asíncrono)
├── index.html               # Configuración SEO y Meta Open Graph
├── tailwind.config.js       # (Manejado directamente por Tailwind v4 en CSS)
└── README.md                # Esta guía técnica
```

---

## 🏛️ Gobernanza y Decisiones de Ingeniería

1.  **Seguridad de Contenido:** El contenido de los poemas futuros nunca viaja a la memoria de la vista. `GetPoemsUseCase` filtra físicamente y borra el texto de los poemas bloqueados antes de que lleguen a los estados de React, imposibilitando hackeos mediante la consola de desarrollo del navegador.
2.  **Modularidad Absoluta (SOLID):** Toda la lógica de persistencia está desacoplada mediante el patrón **Repository**. Si se decide almacenar los poemas en PostgreSQL o Firebase, basta con crear una nueva clase en `/repositories` que implemente la interfaz `/domain/PoemRepository` y cambiar su instanciación en el hook. Cero cambios en la UI.
3.  **UI Premium:** Diseñado con una paleta elegante de negros profundos (`#0A0A0C`), toques de lilas, violetas y efectos de iluminación orbital en Tailwind. Animaciones e intensidades de color manejadas mediante `framer-motion` para garantizar una respuesta táctil y emocional sobresaliente.
