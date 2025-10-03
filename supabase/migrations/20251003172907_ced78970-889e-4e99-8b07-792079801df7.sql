-- Create persona_archetypes table
CREATE TABLE public.persona_archetypes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT[] NOT NULL,
  description TEXT NOT NULL,
  template JSONB NOT NULL,
  thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.persona_archetypes ENABLE ROW LEVEL SECURITY;

-- Everyone can read archetypes
CREATE POLICY "Anyone can view archetypes" 
ON public.persona_archetypes 
FOR SELECT 
USING (true);

-- Create trigger for timestamps
CREATE TRIGGER update_persona_archetypes_updated_at
BEFORE UPDATE ON public.persona_archetypes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial archetypes
INSERT INTO public.persona_archetypes (name, industry, description, template, thumbnail) VALUES
(
  'CMO Innovador',
  ARRAY['Marketing', 'Tecnología', 'SaaS'],
  'Director de Marketing tech-savvy de empresa mediana/grande. Busca herramientas innovadoras para optimizar campañas y demostrar ROI.',
  '{
    "title": "CMO / Director de Marketing",
    "functionalArea": "Marketing y Comunicación",
    "age": "35-45",
    "location": "Grandes ciudades (Madrid, Barcelona, México DF)",
    "personality": {"extrovert": 7, "thinking": 8, "control": 7, "practical": 6, "conservative": 3},
    "motivations": {
      "incentive": "Incrementar ROI y demostrar impacto del marketing",
      "fear": "Quedarse atrás en adopción de nuevas tecnologías",
      "achievement": "Liderar transformación digital del departamento",
      "growth": "Convertirse en referente de marketing digital",
      "power": "Tener presupuesto y equipo para ejecutar visión",
      "social": "Ser reconocido en eventos y comunidades de marketing"
    },
    "preferredChannels": {
      "traditionalMedia": false,
      "onlineSocialMobile": true,
      "emailPhone": true,
      "referrals": true,
      "faceToFacePhysical": true
    },
    "goals": "Aumentar conversión, reducir CAC, mejorar brand awareness",
    "pains": "Presupuestos limitados, dificultad medir ROI, herramientas desintegradas",
    "businessObjectives": "Crecimiento de ventas B2B/B2C, expansión a nuevos mercados"
  }'::jsonb,
  '📊'
),
(
  'SDR Junior',
  ARRAY['Ventas', 'Tecnología', 'Startups'],
  'Sales Development Representative joven que busca herramientas para aumentar su productividad y cerrar más deals.',
  '{
    "title": "Sales Development Representative",
    "functionalArea": "Ventas",
    "age": "25-32",
    "location": "Cualquier ciudad con ecosistema tech",
    "personality": {"extrovert": 8, "thinking": 6, "control": 5, "practical": 8, "conservative": 2},
    "motivations": {
      "incentive": "Comisiones y bonos por cumplir cuotas",
      "fear": "No alcanzar targets mensuales",
      "achievement": "Ser promovido a Account Executive",
      "growth": "Dominar técnicas de venta consultiva",
      "power": "Manejar cuentas más grandes",
      "social": "Ser el top performer del equipo"
    },
    "preferredChannels": {
      "traditionalMedia": false,
      "onlineSocialMobile": true,
      "emailPhone": true,
      "referrals": true,
      "faceToFacePhysical": false
    },
    "goals": "Agendar más demos, aumentar tasa de respuesta, cerrar deals más rápido",
    "pains": "CRM complicado, prospectos no responden, mucho tiempo en tareas administrativas",
    "businessObjectives": "Cumplir cuota mensual, generar pipeline de calidad"
  }'::jsonb,
  '🎯'
),
(
  'Growth Hacker',
  ARRAY['Startups', 'E-commerce', 'Tecnología'],
  'Experto en crecimiento digital y adquisición de usuarios. Experimenta constantemente con nuevos canales y tácticas.',
  '{
    "title": "Growth Lead / Growth Hacker",
    "functionalArea": "Growth / Marketing Digital",
    "age": "28-38",
    "location": "Hubs tech (Barcelona, Madrid, LATAM)",
    "personality": {"extrovert": 6, "thinking": 9, "control": 6, "practical": 9, "conservative": 1},
    "motivations": {
      "incentive": "Ver crecimiento exponencial de métricas",
      "fear": "Estancamiento en adquisición de usuarios",
      "achievement": "Encontrar el próximo canal de growth",
      "growth": "Dominar nuevas herramientas y frameworks",
      "power": "Autonomía para experimentar",
      "social": "Compartir wins en comunidades de growth"
    },
    "preferredChannels": {
      "traditionalMedia": false,
      "onlineSocialMobile": true,
      "emailPhone": false,
      "referrals": true,
      "faceToFacePhysical": false
    },
    "goals": "Reducir CAC, aumentar LTV, viralizar producto, optimizar funnels",
    "pains": "Herramientas caras, datos desintegrados, falta de recursos técnicos",
    "businessObjectives": "Crecimiento rápido de usuarios activos y revenue"
  }'::jsonb,
  '🚀'
),
(
  'CTO Corporativo',
  ARRAY['Tecnología', 'Enterprise', 'Finanzas'],
  'Chief Technology Officer de empresa grande. Toma decisiones técnicas estratégicas, prioriza seguridad y escalabilidad.',
  '{
    "title": "CTO / VP of Engineering",
    "functionalArea": "Tecnología / IT",
    "age": "40-55",
    "location": "Capitales y grandes ciudades",
    "personality": {"extrovert": 5, "thinking": 9, "control": 8, "practical": 7, "conservative": 6},
    "motivations": {
      "incentive": "Modernizar infraestructura tecnológica",
      "fear": "Brechas de seguridad o downtime crítico",
      "achievement": "Liderar transformación digital exitosa",
      "growth": "Mantenerse actualizado en arquitecturas modernas",
      "power": "Tener presupuesto para innovación",
      "social": "Ser referente en círculos de CTOs"
    },
    "preferredChannels": {
      "traditionalMedia": false,
      "onlineSocialMobile": false,
      "emailPhone": true,
      "referrals": true,
      "faceToFacePhysical": true
    },
    "goals": "Reducir deuda técnica, mejorar uptime, optimizar costos cloud",
    "pains": "Legacy systems, resistencia al cambio, complejidad de vendor management",
    "businessObjectives": "Alineación de IT con objetivos de negocio, innovación responsable"
  }'::jsonb,
  '💻'
),
(
  'Desarrollador Frontend',
  ARRAY['Tecnología', 'Agencias', 'Startups'],
  'Developer que implementa soluciones día a día. Busca herramientas que simplifiquen su workflow y mejoren productividad.',
  '{
    "title": "Frontend Developer / Fullstack Developer",
    "functionalArea": "Desarrollo / Ingeniería",
    "age": "25-35",
    "location": "Trabajo remoto o hubs tech",
    "personality": {"extrovert": 4, "thinking": 8, "control": 5, "practical": 9, "conservative": 3},
    "motivations": {
      "incentive": "Usar tecnologías modernas y bien documentadas",
      "fear": "Trabajar con código legacy mal documentado",
      "achievement": "Dominar frameworks modernos (React, Vue, etc)",
      "growth": "Convertirse en senior/tech lead",
      "power": "Autonomía en decisiones técnicas",
      "social": "Contribuir a open source y comunidades"
    },
    "preferredChannels": {
      "traditionalMedia": false,
      "onlineSocialMobile": true,
      "emailPhone": false,
      "referrals": true,
      "faceToFacePhysical": false
    },
    "goals": "Escribir código limpio, entregar features rápido, aprender constantemente",
    "pains": "Herramientas complejas, falta de documentación, tech debt",
    "businessObjectives": "Implementar features que usuarios amen"
  }'::jsonb,
  '👨‍💻'
),
(
  'Product Manager',
  ARRAY['Tecnología', 'SaaS', 'E-commerce'],
  'Gestiona roadmap de producto digital. Balance entre necesidades de usuarios, negocio y capacidad técnica del equipo.',
  '{
    "title": "Product Manager / Product Owner",
    "functionalArea": "Producto",
    "age": "30-40",
    "location": "Cualquier hub tecnológico",
    "personality": {"extrovert": 7, "thinking": 8, "control": 7, "practical": 7, "conservative": 4},
    "motivations": {
      "incentive": "Lanzar features exitosas que usuarios amen",
      "fear": "Construir features que nadie usa",
      "achievement": "Producto con alta adopción y retención",
      "growth": "Convertirse en Head of Product",
      "power": "Influir en estrategia de producto",
      "social": "Ser reconocido en comunidades de PM"
    },
    "preferredChannels": {
      "traditionalMedia": false,
      "onlineSocialMobile": true,
      "emailPhone": true,
      "referrals": true,
      "faceToFacePhysical": true
    },
    "goals": "Aumentar engagement, reducir churn, validar hipótesis rápido",
    "pains": "Priorización difícil, recursos limitados, feedback disperso",
    "businessObjectives": "Product-market fit, crecimiento de usuarios activos"
  }'::jsonb,
  '📱'
),
(
  'Emprendedor E-commerce',
  ARRAY['E-commerce', 'Retail', 'Startups'],
  'Dueño de tienda online pequeña/mediana. Busca herramientas asequibles para automatizar y escalar su negocio.',
  '{
    "title": "Fundador / Dueño E-commerce",
    "functionalArea": "Operaciones / General",
    "age": "28-45",
    "location": "Cualquier ubicación con acceso internet",
    "personality": {"extrovert": 6, "thinking": 7, "control": 6, "practical": 9, "conservative": 5},
    "motivations": {
      "incentive": "Aumentar ventas y margen de ganancia",
      "fear": "Quedarse sin inventario o capital",
      "achievement": "Crecer a 6-7 cifras de revenue",
      "growth": "Dominar marketing digital y operaciones",
      "power": "Independencia financiera",
      "social": "Ser parte de comunidades de emprendedores"
    },
    "preferredChannels": {
      "traditionalMedia": false,
      "onlineSocialMobile": true,
      "emailPhone": true,
      "referrals": true,
      "faceToFacePhysical": false
    },
    "goals": "Aumentar conversión, reducir devoluciones, optimizar ads",
    "pains": "Costos de adquisición altos, gestión de inventario, logística",
    "businessObjectives": "Escalar ventas de forma rentable"
  }'::jsonb,
  '🛒'
),
(
  'Gerente de Operaciones',
  ARRAY['Retail', 'Logística', 'Manufactura'],
  'Optimiza procesos operativos y cadena de suministro. Busca eficiencia y reducción de costos.',
  '{
    "title": "Gerente de Operaciones",
    "functionalArea": "Operaciones / Supply Chain",
    "age": "35-50",
    "location": "Ciudades con actividad industrial/comercial",
    "personality": {"extrovert": 5, "thinking": 8, "control": 9, "practical": 9, "conservative": 7},
    "motivations": {
      "incentive": "Reducir costos operativos y mejorar eficiencia",
      "fear": "Disrupciones en cadena de suministro",
      "achievement": "Implementar mejoras que impacten bottom line",
      "growth": "Dominar metodologías Lean/Six Sigma",
      "power": "Control sobre procesos y proveedores",
      "social": "Networking con otros gerentes de operaciones"
    },
    "preferredChannels": {
      "traditionalMedia": true,
      "onlineSocialMobile": false,
      "emailPhone": true,
      "referrals": true,
      "faceToFacePhysical": true
    },
    "goals": "Optimizar inventario, reducir tiempos de entrega, minimizar desperdicios",
    "pains": "Procesos manuales, falta de visibilidad en tiempo real, dependencia de proveedores",
    "businessObjectives": "Márgenes operativos saludables, entrega a tiempo"
  }'::jsonb,
  '⚙️'
),
(
  'Docente Digital',
  ARRAY['Educación', 'E-learning', 'Tecnología'],
  'Profesor que adopta tecnología para mejorar experiencia de aprendizaje. Busca herramientas fáciles de usar.',
  '{
    "title": "Profesor / Docente",
    "functionalArea": "Educación",
    "age": "30-50",
    "location": "Cualquier ubicación",
    "personality": {"extrovert": 6, "thinking": 6, "control": 5, "practical": 7, "conservative": 5},
    "motivations": {
      "incentive": "Mejorar resultados de aprendizaje de estudiantes",
      "fear": "Ser reemplazado por herramientas automatizadas",
      "achievement": "Estudiantes comprometidos y exitosos",
      "growth": "Dominar pedagogía digital",
      "power": "Autonomía en diseño de curso",
      "social": "Reconocimiento de colegas y estudiantes"
    },
    "preferredChannels": {
      "traditionalMedia": true,
      "onlineSocialMobile": true,
      "emailPhone": true,
      "referrals": true,
      "faceToFacePhysical": true
    },
    "goals": "Aumentar engagement, facilitar evaluación, personalizar aprendizaje",
    "pains": "Herramientas complicadas, falta de tiempo, resistencia institucional",
    "businessObjectives": "Mejores resultados académicos, retención de estudiantes"
  }'::jsonb,
  '👩‍🏫'
),
(
  'Coordinador Académico',
  ARRAY['Educación', 'Instituciones', 'E-learning'],
  'Toma decisiones sobre plataformas educativas a nivel institucional. Prioriza escalabilidad y soporte.',
  '{
    "title": "Coordinador Académico / Director",
    "functionalArea": "Administración Educativa",
    "age": "40-60",
    "location": "Ubicación de institución educativa",
    "personality": {"extrovert": 6, "thinking": 7, "control": 8, "practical": 8, "conservative": 7},
    "motivations": {
      "incentive": "Mejorar reputación y resultados de la institución",
      "fear": "Inversiones tecnológicas fallidas",
      "achievement": "Modernización exitosa de la institución",
      "growth": "Mantenerse actualizado en tendencias educativas",
      "power": "Presupuesto para innovación",
      "social": "Networking con otros líderes educativos"
    },
    "preferredChannels": {
      "traditionalMedia": true,
      "onlineSocialMobile": false,
      "emailPhone": true,
      "referrals": true,
      "faceToFacePhysical": true
    },
    "goals": "Mejorar tasas de graduación, optimizar costos, atraer más estudiantes",
    "pains": "Presupuestos limitados, resistencia al cambio de profesores, requisitos de compliance",
    "businessObjectives": "Sostenibilidad financiera, excelencia académica"
  }'::jsonb,
  '🎓'
),
(
  'Médico Privado',
  ARRAY['Salud', 'Servicios Profesionales'],
  'Profesional de salud con consultorio propio. Busca herramientas para gestionar agenda y pacientes eficientemente.',
  '{
    "title": "Médico / Especialista",
    "functionalArea": "Salud / Medicina",
    "age": "35-55",
    "location": "Ciudades medianas/grandes",
    "personality": {"extrovert": 5, "thinking": 8, "control": 7, "practical": 8, "conservative": 6},
    "motivations": {
      "incentive": "Atender más pacientes con mejor calidad",
      "fear": "Errores médicos o demandas",
      "achievement": "Reputación de excelencia profesional",
      "growth": "Mantenerse actualizado en especialidad",
      "power": "Autonomía en decisiones clínicas",
      "social": "Respeto de colegas y pacientes"
    },
    "preferredChannels": {
      "traditionalMedia": true,
      "onlineSocialMobile": false,
      "emailPhone": true,
      "referrals": true,
      "faceToFacePhysical": true
    },
    "goals": "Optimizar agenda, reducir no-shows, digitalizar historias clínicas",
    "pains": "Tiempo administrativo excesivo, software médico complicado, regulaciones estrictas",
    "businessObjectives": "Maximizar tiempo con pacientes, rentabilidad del consultorio"
  }'::jsonb,
  '👨‍⚕️'
),
(
  'Administrador Clínica',
  ARRAY['Salud', 'Gestión', 'Servicios'],
  'Gestiona operaciones de clínica u hospital. Busca eficiencia operativa y satisfacción del paciente.',
  '{
    "title": "Administrador / Gerente Clínica",
    "functionalArea": "Administración de Salud",
    "age": "35-55",
    "location": "Centros urbanos con infraestructura médica",
    "personality": {"extrovert": 6, "thinking": 8, "control": 9, "practical": 9, "conservative": 7},
    "motivations": {
      "incentive": "Mejorar eficiencia y reducir costos operativos",
      "fear": "Problemas de compliance o acreditación",
      "achievement": "Clínica rentable con pacientes satisfechos",
      "growth": "Expandir servicios o sucursales",
      "power": "Control sobre operaciones y presupuesto",
      "social": "Networking con otros administradores de salud"
    },
    "preferredChannels": {
      "traditionalMedia": true,
      "onlineSocialMobile": false,
      "emailPhone": true,
      "referrals": true,
      "faceToFacePhysical": true
    },
    "goals": "Reducir tiempos de espera, optimizar facturación, mejorar experiencia del paciente",
    "pains": "Sistemas legacy, regulaciones complejas, gestión de personal médico",
    "businessObjectives": "Rentabilidad sostenible, cumplimiento regulatorio"
  }'::jsonb,
  '🏥'
),
(
  'Abogado Independiente',
  ARRAY['Legal', 'Servicios Profesionales'],
  'Abogado con buffet pequeño o práctica independiente. Busca herramientas para gestión de casos y clientes.',
  '{
    "title": "Abogado / Socio",
    "functionalArea": "Legal",
    "age": "32-50",
    "location": "Cualquier ciudad",
    "personality": {"extrovert": 6, "thinking": 9, "control": 7, "practical": 7, "conservative": 6},
    "motivations": {
      "incentive": "Ganar casos importantes y aumentar honorarios",
      "fear": "Perder clientes por falta de organización",
      "achievement": "Reputación sólida en especialidad",
      "growth": "Expandir áreas de práctica",
      "power": "Independencia profesional",
      "social": "Networking con otros abogados y referidos"
    },
    "preferredChannels": {
      "traditionalMedia": true,
      "onlineSocialMobile": false,
      "emailPhone": true,
      "referrals": true,
      "faceToFacePhysical": true
    },
    "goals": "Optimizar gestión de casos, mejorar facturación, atraer mejores clientes",
    "pains": "Mucho trabajo administrativo, software legal caro, necesidad de confidencialidad",
    "businessObjectives": "Crecimiento de cartera de clientes, especialización rentable"
  }'::jsonb,
  '⚖️'
),
(
  'Consultor Senior',
  ARRAY['Consultoría', 'Negocios', 'Estrategia'],
  'Consultor experimentado que ayuda empresas a resolver problemas complejos. Busca herramientas para análisis y presentaciones.',
  '{
    "title": "Consultor Senior / Managing Consultant",
    "functionalArea": "Consultoría Estratégica",
    "age": "38-55",
    "location": "Grandes ciudades con actividad corporativa",
    "personality": {"extrovert": 7, "thinking": 9, "control": 7, "practical": 6, "conservative": 5},
    "motivations": {
      "incentive": "Resolver problemas complejos de alto impacto",
      "fear": "Perder relevancia en el mercado",
      "achievement": "Proyectos exitosos con clientes de prestigio",
      "growth": "Convertirse en thought leader",
      "power": "Influir en decisiones estratégicas C-level",
      "social": "Networking con ejecutivos y otros consultores"
    },
    "preferredChannels": {
      "traditionalMedia": true,
      "onlineSocialMobile": true,
      "emailPhone": true,
      "referrals": true,
      "faceToFacePhysical": true
    },
    "goals": "Entregar insights accionables, mantener clientes recurrentes, escalar práctica",
    "pains": "Análisis manual de datos, crear presentaciones toma mucho tiempo, difícil diferenciarse",
    "businessObjectives": "Clientes de alto valor, alta tasa de retención"
  }'::jsonb,
  '💼'
);

-- Create ai_conversations table for chatbot history
CREATE TABLE public.ai_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  persona_id UUID,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own conversations" 
ON public.ai_conversations 
FOR ALL 
USING (auth.uid() = user_id);

CREATE TRIGGER update_ai_conversations_updated_at
BEFORE UPDATE ON public.ai_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();