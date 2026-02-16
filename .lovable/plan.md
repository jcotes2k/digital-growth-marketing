
## Plan: Redisenar Product Roadmap - Vista de Bloques Editables

### Resumen
Aplicar el mismo patron del Business Canvas al Product Roadmap: reemplazar la navegacion secuencial por tabs con una grilla de bloques clickeables. Cada bloque muestra el contenido actual y al hacer clic se abre un modal para editar. Las herramientas de IA (Generar, Priorizar, Timeline, Metricas) pasan a la barra superior como botones.

### Experiencia del Usuario (Nuevo Flujo)

1. El usuario entra al modulo Product Roadmap
2. Ve todos los bloques en una grilla de 2 columnas con el contenido actual
3. Hace clic en cualquier bloque para editar en un modal
4. Las herramientas avanzadas (Generar IA, Priorizar, Timeline, Metricas) estan en botones superiores que abren modales
5. En cualquier momento puede descargar el PDF

### Estructura Visual

```text
+------------------------------------------------------------------+
| Product Roadmap Canvas                                           |
| [Generar IA] [Priorizar] [Timeline] [Metricas] [Descargar PDF]  |
+------------------------------------------------------------------+
| [Para quien?]        | [Debe tener]                             |
|  - Perfil usuario    |  - Funcionalidades esenciales             |
|                      |  - Historias de usuario                   |
+------------------------------------------------------------------+
| [Deberia tener]      | [Podria tener]                           |
|  - Func. importantes |  - Func. futuras                         |
|  - Objetivos corto   |  - Vision futuro                         |
+------------------------------------------------------------------+
| [Backlog]            | [Alternativas]                           |
|  - Ideas sin clasif. |  - Mercado                               |
|  - Pendientes        |  - Competidores                          |
+------------------------------------------------------------------+
```

### Detalle Tecnico

**Archivo: `src/components/ProductRoadmapForm.tsx`** (reescritura mayor)

- Eliminar el sistema de Tabs, Progress bar, y navegacion Anterior/Siguiente
- Definir un array `roadmapBlocks` con los 6 bloques de datos (Para quien, Debe tener, Deberia tener, Podria tener, Backlog, Alternativas), cada uno con sus campos y el componente de formulario asociado
- Renderizar una grilla de Cards clickeables con `form.watch()` para vista previa en tiempo real
- Estado `editingBlock: string | null` para controlar el modal de edicion
- Las 4 herramientas avanzadas (Generar IA, Priorizar, Timeline, Metricas) se muestran como botones en la barra superior que abren Dialogs independientes
- Integrar la logica de PDF usando html2canvas + jsPDF sobre el `#roadmap-grid`
- Mantener el `refreshKey` para las herramientas de IA

**Archivo: `src/components/ProductRoadmapPreview.tsx`**

- Sin cambios necesarios (la logica de PDF se integrara directamente en el componente principal)

### Archivos a Modificar

| Archivo | Accion | Detalle |
|---------|--------|---------|
| `src/components/ProductRoadmapForm.tsx` | Reescribir | Cambiar de tabs a grilla de bloques con modales |

### Lo que se conserva sin cambios
- Todos los sub-formularios (`roadmap-forms/*.tsx`)
- Tipos (`product-roadmap.ts`, `roadmap-feature.ts`)
- Componentes de IA: RoadmapFeatureGenerator, RoadmapPrioritizer, RoadmapTimeline, RoadmapMetricsIntegration
- ProductRoadmapPreview
