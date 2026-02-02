
## Plan: Corregir el Generador de Contenido con IA

### Diagnóstico
He probado la función edge `content-generator` directamente y **funciona correctamente**, devolviendo 5 variantes de contenido. El problema puede estar en:
1. **Modelo de IA desactualizado**: Usa `google/gemini-2.5-flash` cuando el modelo recomendado actual es `google/gemini-3-flash-preview`
2. **Falta de manejo de errores específicos**: No se muestran mensajes claros para errores 429 (rate limit) o 402 (pago requerido) en el frontend
3. **Headers CORS incompletos**: Faltan algunos headers requeridos para Supabase

---

### Cambios Propuestos

#### 1. Actualizar Edge Function `content-generator`

| Cambio | Detalle |
|--------|---------|
| Modelo de IA | Cambiar de `google/gemini-2.5-flash` a `google/gemini-3-flash-preview` |
| Headers CORS | Agregar headers faltantes para compatibilidad con Supabase |
| Logging | Agregar logs más detallados para debugging |

**Archivo:** `supabase/functions/content-generator/index.ts`

```typescript
// Actualizar corsHeaders
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Cambiar modelo
model: "google/gemini-3-flash-preview",
```

---

#### 2. Mejorar Manejo de Errores en Frontend

**Archivo:** `src/components/ContentGeneratorForm.tsx`

Agregar manejo específico de errores para mostrar mensajes claros al usuario:

```typescript
if (functionError) {
  // Detectar errores específicos
  if (functionError.message?.includes('429') || functionError.status === 429) {
    toast({
      title: "Límite de solicitudes alcanzado",
      description: "Por favor espera un momento e intenta nuevamente",
      variant: "destructive",
    });
    return;
  }
  if (functionError.message?.includes('402') || functionError.status === 402) {
    toast({
      title: "Créditos agotados",
      description: "Contacta al administrador para agregar más créditos",
      variant: "destructive",
    });
    return;
  }
  throw functionError;
}
```

---

### Archivos a Modificar

| Archivo | Acción | Cambios |
|---------|--------|---------|
| `supabase/functions/content-generator/index.ts` | Modificar | Actualizar modelo de IA y headers CORS |
| `src/components/ContentGeneratorForm.tsx` | Modificar | Mejorar manejo de errores con mensajes específicos |

---

### Validaciones Post-Implementación

1. Probar generar contenido con diferentes tipos (post, email, blog)
2. Verificar que las variantes se muestran correctamente
3. Confirmar que el contenido se guarda en el historial
4. Verificar mensajes de error claros ante rate limits
