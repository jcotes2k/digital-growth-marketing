

## Plan: Redisenar Canvas de Estrategia de Contenido - Vista de Bloques Editables

### Resumen
Aplicar el mismo patron usado en Business Canvas y Product Roadmap: reemplazar la navegacion secuencial (Paso 1 de 8) con una grilla interactiva de bloques clickeables. El usuario ve todo el canvas de un vistazo y al hacer clic en cualquier bloque se abre un modal para editar.

### Estructura Visual Nueva

```text
+------------------------------------------------------------------+
| Canvas de Estrategia de Contenido        [Descargar PDF]         |
+------------------------------------------------------------------+
| [Objetivo]         | [Temas de Contenido] | [Equipo]             |
+------------------------------------------------------------------+
| [Canales]          | [Formato Contenido]  | [Presupuesto]        |
+------------------------------------------------------------------+
| [Ritmo]            | [Tono de Contenido (col-span-2)]            |
+------------------------------------------------------------------+
```

### Cambios

#### 1. Reescribir `ContentStrategyForm.tsx`
- Eliminar el sistema secuencial de pasos con Progress bar y botones Anterior/Siguiente
- Definir un array `contentBlocks` con los 8 bloques, cada uno mapeado a su icono y componente de formulario (GoalForm, ContentTopicsForm, TeamForm, ChannelsForm, ContentFormatForm, BudgetForm, RhythmForm, ContentToneForm)
- Renderizar una grilla de 3 columnas con Cards clickeables que muestran datos en tiempo real via `form.watch()`
- El bloque "Tono de Contenido" ocupa 2 columnas (como en la vista previa actual) y muestra los 5 sub-campos
- El bloque "Canales" muestra badges con los canales seleccionados
- Estado `editingBlock: string | null` para abrir el modal de edicion con el sub-formulario correspondiente
- Integrar logica de PDF (html2canvas + jsPDF) directamente con boton en la barra superior
- Contenido vacio muestra "No especificado" en gris

#### 2. `ContentStrategyPreview.tsx` se mantiene sin cambios
- Ya no se navega a ella como vista separada, pero se conserva por si se necesita internamente

### Experiencia del Usuario

1. Entra al modulo y ve los 8 bloques en una grilla
2. Cada bloque muestra el titulo con icono y el contenido actual
3. Hace clic en un bloque -> se abre un modal con el formulario de edicion
4. Cierra el modal -> el bloque se actualiza al instante
5. En cualquier momento puede descargar el PDF

### Archivos a Modificar

| Archivo | Accion | Detalle |
|---------|--------|---------|
| `src/components/ContentStrategyForm.tsx` | Reescribir | Cambiar de pasos secuenciales a grilla de bloques con modales |

### Lo que se conserva sin cambios
- Todos los sub-formularios (`content-forms/*.tsx`)
- Tipos (`content-strategy.ts`)
- `ContentStrategyPreview.tsx`
- Schema de validacion zod

