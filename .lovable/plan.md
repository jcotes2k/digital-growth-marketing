

## Plan: Actualizar Precios de Suscripcion

### Nuevos Precios
| Plan | Precio Anterior | Precio Nuevo |
|------|----------------|--------------|
| PRO | $19/mes | $39/mes |
| PREMIUM | $39/mes | $69/mes |
| GOLD | $49/mes | $89/mes |

### Archivos a Modificar (7 archivos)

#### Frontend (4 archivos)

| Archivo | Cambio |
|---------|--------|
| `src/components/RegistrationForm.tsx` | Cambiar precios en las PlanCards: PRO "$19" -> "$39", PREMIUM "$39" -> "$69", GOLD "$49" -> "$89" |
| `src/components/EPaycoCheckout.tsx` | Actualizar `PLAN_DETAILS`: pro 19->39, premium 39->69, gold 49->89 |
| `src/components/EPaycoSubscriptionForm.tsx` | Actualizar `PLAN_DETAILS`: pro 19->39, premium 39->69, gold 49->89 |
| `src/pages/Checkout.tsx` | Actualizar precios en el array de planes: pro 19->39, premium 39->69, gold 49->89 |

#### Backend - Edge Functions (2 archivos)

| Archivo | Cambio |
|---------|--------|
| `supabase/functions/epayco-create-session/index.ts` | Actualizar `PLAN_PRICES`: pro amount 19->39, premium 39->69, gold 49->89 |
| `supabase/functions/epayco-create-subscription/index.ts` | Actualizar `PLAN_CONFIG`: pro price 19->39, premium 39->69, gold 49->89 |

#### Documentacion PDF (1 archivo)

| Archivo | Cambio |
|---------|--------|
| `src/components/PlatformDocumentationPDF.tsx` | Actualizar todas las referencias de precios: "$19/mes" -> "$39/mes", "$39/mes" -> "$69/mes", "$49/mes" -> "$89/mes", y el ejemplo de ganancias de afiliados |

### Lo que NO cambia
- La estructura de planes (free, pro, premium, gold)
- Las features de cada plan
- La logica de pagos y webhooks
- La base de datos (los planes se guardan como texto 'pro', 'premium', 'gold', no con precios)

