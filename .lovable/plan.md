

## Plan: Hacer visibles los botones de subida de archivos

Los botones `DocumentUploadButton` ya están en el código de los 3 formularios, pero no se ven porque están al final de las barras de herramientas y se pierden visualmente. El fix es hacerlos más prominentes y asegurar que sean visibles.

### Cambios

#### 1. `src/components/BusinessCanvasForm.tsx` (línea ~236)
- Mover el `DocumentUploadButton` antes del botón "Descargar PDF" para darle más visibilidad
- Agregar un label explícito: `label="Subir Canvas"`

#### 2. `src/components/ProductRoadmapForm.tsx` (línea ~179)
- Mover el `DocumentUploadButton` antes del botón "Descargar PDF"
- Agregar label: `label="Subir Roadmap"`

#### 3. `src/components/BuyerPersonaForm.tsx` (línea ~349)
- El botón está dentro de la pantalla `select-count`, que solo se ve después de llenar company info
- Moverlo también a la pantalla `create-personas` (header del formulario principal) para que siempre esté accesible
- Agregar label: `label="Subir Persona"`

#### 4. `src/components/DocumentUploadButton.tsx` (línea ~132)
- Cambiar el estilo del botón de `variant="outline" size="sm"` a algo más visible: agregar un icono de color y borde destacado para que no se confunda con los demás botones de la barra

