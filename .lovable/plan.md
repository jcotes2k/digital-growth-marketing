

## Plan: Mostrar Bloques de Agentes IA Especializados en el Home

### Resumen
Reemplazar la tarjeta unica "Agencia de Marketing IA" en la seccion GOLD del Home con una grilla de bloques individuales que muestre cada uno de los 16+ agentes IA con su nombre, rol, icono y color. El cliente podra ver de un vistazo todo el equipo de especialistas que obtiene con el plan GOLD.

### Experiencia del Usuario

1. En el Home, la seccion "Agentes IA Especializados" mostrara los 4 equipos con sus agentes
2. Cada agente se muestra como una Card compacta con su icono, nombre y titulo/rol
3. Los agentes bloqueados (plan anual) tendran un badge especial
4. Al hacer clic en un agente (si tiene plan GOLD), se navega a la Agencia y abre el chat con ese agente
5. Si no tiene plan GOLD, se muestra como bloqueado con badge "Upgrade" y "GOLD"

### Estructura Visual

```text
+------------------------------------------------------------------+
| Agentes IA Especializados                         [GOLD badge]   |
+------------------------------------------------------------------+
| Equipo Central y Estrategico                                     |
| [CEO Digital] [Dir. Estrategico] [Investigador] [Estratega Marca]|
| [Gerente Proyectos]                                              |
+------------------------------------------------------------------+
| Especialistas en Contenido y Rendimiento                         |
| [Copywriter] [Gerente SEO] [Social Media] [Paid Media]          |
| [Growth Optimizer] [Analista Datos]                              |
+------------------------------------------------------------------+
| Tecnologia, Creatividad y Cliente                                |
| [Experto CRM] [Exito Cliente] [Dir. Creativo] [Multimedia]      |
| [Desarrollador Web]                                              |
+------------------------------------------------------------------+
| Consultor Exclusivo (Plan Anual)                                 |
| [Consultor Business - Plan Anual badge]                          |
+------------------------------------------------------------------+
```

### Detalle Tecnico

**Archivo: `src/pages/Index.tsx`** (modificacion en la seccion AI Agents - GOLD, lineas 519-580)

- Eliminar la Card unica "Agencia de Marketing IA"
- Importar `AI_AGENTS`, `AGENT_TEAMS` desde `@/types/ai-agents`
- Importar iconos dinamicos desde `lucide-react` (usando el patron ya existente en AgentCard.tsx con `import * as Icons`)
- Iterar sobre `AGENT_TEAMS` para mostrar cada equipo como subseccion
- Dentro de cada equipo, mostrar los agentes en una grilla de 4 columnas (responsive: 2 en movil, 3 en tablet, 4 en desktop)
- Cada Card de agente muestra: icono con color, nombre, titulo/rol
- Usar el mismo mapa de colores que ya existe en `AgentCard.tsx` (colorClasses)
- Si el usuario tiene plan GOLD y la fase esta desbloqueada: clickeable, navega al agente
- Si no tiene plan GOLD: opacidad reducida con badges "Upgrade" y "GOLD"
- Los agentes `isAnnualOnly` muestran badge "Plan Anual"

### Archivos a Modificar

| Archivo | Accion | Detalle |
|---------|--------|---------|
| `src/pages/Index.tsx` | Modificar | Reemplazar la Card unica por grilla de agentes individuales agrupados por equipo |

### Lo que se conserva sin cambios
- `src/types/ai-agents.ts` (datos de agentes y equipos)
- `src/components/agents/AgentCard.tsx` (se usa dentro de AgencyDashboard, no en el Home)
- `src/components/agents/AgencyDashboard.tsx` (se abre al hacer clic en un agente)
- Toda la logica de desbloqueo y planes existente en Index.tsx

