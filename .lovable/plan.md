
## Plan: Redisenar Business Canvas - Vista de Bloques Editables

### Resumen
Reemplazar la navegacion secuencial por tabs con una vista de bloques tipo grid (similar a la Vista Previa actual). Cada bloque muestra el contenido actual y al hacer clic se expande para editar. El usuario ve todo el canvas de un vistazo y puede descargar PDF en cualquier momento.

### Cambios Principales

#### 1. Reescribir `BusinessCanvasForm.tsx`
- Eliminar el sistema de Tabs secuencial con menu horizontal
- Mostrar directamente una grilla de 3 columnas con todos los 11 bloques del canvas
- Cada bloque es una Card clickeable que muestra el valor actual (o "No especificado")
- Al hacer clic en un bloque, se abre un Dialog/modal con el formulario correspondiente (ProblemaForm, SolucionForm, etc.)
- Mantener el boton "Descargar PDF" siempre visible en la parte superior
- Mantener los botones de "Templates" y "Generar con IA"
- Agregar acceso a "Validacion" y "Escenarios" como botones secundarios (ya no son tabs)

#### 2. Simplificar `BusinessCanvasPreview.tsx`
- Ya no sera necesario como componente separado para la tab "Vista Previa", porque la vista principal ES la vista previa
- La logica de generacion de PDF se movera al componente principal o se reutilizara

### Experiencia del Usuario (Nuevo Flujo)

1. El usuario entra al modulo Business Canvas
2. Ve inmediatamente todos los 11 bloques en una grilla de 3 columnas
3. Cada bloque muestra el titulo y el contenido actual
4. Hace clic en cualquier bloque -> se abre un modal con los campos de edicion
5. Completa/edita y cierra el modal -> el bloque se actualiza al instante
6. En cualquier momento puede descargar el PDF con el boton superior
7. Accede a Validacion IA y Escenarios desde botones en la barra superior

### Detalle Tecnico

**Archivo: `src/components/BusinessCanvasForm.tsx`** (reescritura mayor)

```text
Estructura nueva:
+--------------------------------------------------+
| Titulo + [Templates] [IA] [Validacion] [Escenarios] [PDF] |
+--------------------------------------------------+
| [Problema]  [Solucion]  [Propuesta Valor]        |
| [Ventaja]   [Segmentos] [Indicadores]            |
| [Canales]   [Costes]    [Sostenibilidad]         |
| [Equipo]    [Impacto]                            |
+--------------------------------------------------+
```

- Estado `editingBlock: string | null` controla cual bloque esta abierto en modal
- Cada Card muestra datos del `form.watch()` en tiempo real
- El Dialog renderiza el sub-formulario correspondiente (ProblemaForm, SolucionForm, etc.)
- La grilla completa tiene `id="canvas-preview"` para la generacion de PDF
- Se conserva toda la logica de carga de datos, templates, IA, escenarios y comparacion

**Archivo: `src/components/BusinessCanvasPreview.tsx`**
- Se mantiene pero solo se usa internamente para el PDF (o se integra la logica de PDF directamente en el form principal)

### Archivos a Modificar

| Archivo | Accion | Detalle |
|---------|--------|---------|
| `src/components/BusinessCanvasForm.tsx` | Reescribir | Cambiar de tabs a grilla de bloques con modales de edicion |
| `src/components/BusinessCanvasPreview.tsx` | Ajustar | Reutilizar logica de PDF o integrarla en el componente principal |

### Lo que se conserva sin cambios
- Todos los sub-formularios (`canvas-forms/*.tsx`)
- Tipos (`business-canvas.ts`)
- Componentes de IA, Templates, Validacion, Escenarios, Comparacion
- Logica de carga de datos de usuario (buyer personas, company info)
