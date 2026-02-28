

## Plan: Renombrar "Fases Principales" y Agregar Subida de Archivos

### Cambios

#### 1. Renombrar titulo en `src/pages/Index.tsx`
- Linea 465: cambiar "Fases Principales" por "Cerebro del Negocio"

#### 2. Crear bucket de storage para archivos subidos
- Migración SQL: crear bucket `user-documents` (privado)
- Crear tabla `user_uploaded_documents` con campos: id, user_id, document_type (business-canvas | buyer-persona | product-roadmap), file_name, file_url, uploaded_at
- RLS: usuarios solo ven/crean sus propios documentos
- Políticas de storage para que cada usuario suba/lea sus propios archivos

#### 3. Crear componente reutilizable `src/components/DocumentUploadButton.tsx`
- Recibe props: `documentType` ('business-canvas' | 'buyer-persona' | 'product-roadmap'), `label` opcional
- Boton con icono de upload que abre un input file (acepta PDF, DOCX, imágenes, etc.)
- Al seleccionar archivo: sube a storage bucket `user-documents/{user_id}/{document_type}/{filename}`
- Guarda registro en tabla `user_uploaded_documents`
- Muestra lista de archivos previamente subidos con opcion de descargar/eliminar
- Toast de confirmacion al subir

#### 4. Integrar el boton en los 3 formularios

**`src/components/BusinessCanvasForm.tsx`**
- Importar y agregar `<DocumentUploadButton documentType="business-canvas" />` en la barra de herramientas (junto a los botones existentes de Sparkles, Library, etc.)

**`src/components/BuyerPersonaForm.tsx`**
- Importar y agregar `<DocumentUploadButton documentType="buyer-persona" />` en la interfaz, visible en la pantalla principal del formulario

**`src/components/ProductRoadmapForm.tsx`**
- Importar y agregar `<DocumentUploadButton documentType="product-roadmap" />` en la barra de herramientas superior (junto a Generar IA, Priorizar, etc.)

### Archivos a crear/modificar

| Archivo | Acción |
|---------|--------|
| Migración SQL | Crear bucket + tabla + RLS |
| `src/components/DocumentUploadButton.tsx` | Crear (componente reutilizable) |
| `src/pages/Index.tsx` | Renombrar titulo |
| `src/components/BusinessCanvasForm.tsx` | Agregar boton upload |
| `src/components/BuyerPersonaForm.tsx` | Agregar boton upload |
| `src/components/ProductRoadmapForm.tsx` | Agregar boton upload |

