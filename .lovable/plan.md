
## Plan: Mejorar Agentes IA - Navegacion Directa, Menu Interactivo y Nuevos Agentes

### Resumen
Tres cambios principales:
1. Al hacer clic en un agente desde el Home, se abre directamente su chat (no el dashboard general). Dentro del chat, arriba aparece un menu interactivo con los demas agentes para navegar sin volver al menu.
2. Renombrar agentes existentes: "Gerente SEO" con subtitulo "Experto en SEO & GEO-IA", "Especialista Paid Media" pasa a ser "Trafficker", "Gerente Redes Sociales" pasa a ser "Community Manager".
3. Crear nuevo agente "Marketing Content Manager" al inicio del equipo de Contenido.

### Cambios por Archivo

#### 1. `src/types/ai-agents.ts`

**Agregar nuevo tipo de agente:**
- Agregar `'marketing-content-manager'` al tipo `AgentType` en la seccion de Contenido

**Renombrar agentes existentes:**
- `seo-manager`: cambiar `title` de "Gerente de Contenido y SEO" a "Experto en SEO & GEO-IA"
- `paid-media-specialist`: cambiar `name` de "Especialista Paid Media" a "Trafficker", mantener `title` como "Especialista en Paid Media"
- `social-media-manager`: cambiar `name` de "Gerente Redes Sociales" a "Community Manager", mantener `title` como "Gerente de Redes Sociales y Comunidad"

**Crear nuevo agente completo:**
- id: `marketing-content-manager`
- name: "Marketing Content Manager"
- title: "Director de Estrategia de Contenido"
- team: `content`
- icon: "BookOpen" (u otro apropiado)
- color: "sky"
- Insertar como PRIMER agente del equipo `content` en el array `AI_AGENTS`
- capabilities: Brand content, product content, funnel content, growth marketing, engagement content, community building, paid content, email marketing, blog, etc.
- systemPrompt completo describiendo su rol de supervisor y experto en todas las areas de contenido digital

#### 2. `src/components/agents/AgencyDashboard.tsx`

**Agregar prop `initialAgentId` opcional:**
- La interfaz recibira un `initialAgentId?: string` para abrir directamente el chat de un agente
- En `useEffect`, si `initialAgentId` esta definido, buscar el agente por id y setear `selectedAgent`

**Agregar menu interactivo de agentes en el chat:**
- Cuando `selectedAgent` esta activo, en lugar de mostrar solo el `AgentChatInterface`, agregar una barra horizontal de agentes arriba del chat
- Esta barra mostrara todos los agentes como iconos/botones pequenos con tooltip, agrupados visualmente
- Al hacer clic en otro agente, se cambia `selectedAgent` directamente (sin volver al menu)
- El agente activo se resalta visualmente

#### 3. `src/pages/Index.tsx`

**Pasar el agente seleccionado al dashboard:**
- Agregar estado `selectedAgentId` para trackear que agente se clickeo
- En los bloques del Home, al hacer clic en un agente especifico, guardar su `agent.id` en el estado
- Cuando se navega a `ai-agency`, pasar `initialAgentId={selectedAgentId}` al `AgencyDashboard`
- Actualizar el badge de especialistas de "16+" a "17+" (por el nuevo agente)

### Experiencia del Usuario

1. En el Home, el usuario ve los 17+ agentes en la grilla (incluyendo el nuevo Marketing Content Manager)
2. Hace clic en un agente especifico (ej: "Copywriter IA")
3. Se abre directamente el chat con ese agente
4. Arriba del chat hay una barra con los otros agentes como iconos clickeables
5. Puede cambiar de agente haciendo clic en otro icono sin volver al menu
6. Puede volver al menu principal con el boton "Volver"

### Lo que se conserva sin cambios
- `AgentCard.tsx` (se usa dentro del dashboard para la vista de tarjetas)
- `AgentChatInterface.tsx` (se mantiene igual, solo se envuelve con la barra de agentes)
- Toda la logica de plans, desbloqueo y permisos
