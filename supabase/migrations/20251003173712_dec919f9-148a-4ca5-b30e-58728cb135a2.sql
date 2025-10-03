-- Create canvas_templates table
CREATE TABLE public.canvas_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  business_type TEXT[] NOT NULL,
  description TEXT NOT NULL,
  template JSONB NOT NULL,
  thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.canvas_templates ENABLE ROW LEVEL SECURITY;

-- Everyone can read templates
CREATE POLICY "Anyone can view canvas templates" 
ON public.canvas_templates 
FOR SELECT 
USING (true);

-- Create trigger for timestamps
CREATE TRIGGER update_canvas_templates_updated_at
BEFORE UPDATE ON public.canvas_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial canvas templates
INSERT INTO public.canvas_templates (name, business_type, description, template, thumbnail) VALUES
(
  'Startup Social Tech',
  ARRAY['Startup', 'Social', 'Tecnología'],
  'Modelo para startups tecnológicas con impacto social que buscan resolver problemas mediante soluciones digitales.',
  '{
    "mainProblems": "Brechas de acceso a servicios básicos, falta de inclusión digital, problemas sociales no resueltos por sector privado tradicional",
    "alternativeSolutions": "ONGs tradicionales, programas gubernamentales, iniciativas comunitarias sin tecnología",
    "keyCharacteristics": "Plataforma digital escalable, UX intuitivo, modelo freemium, accesibilidad multiplataforma",
    "valueProposition": "Democratizar acceso a [servicio/solución] mediante tecnología accesible y escalable",
    "differentialAdvantage": "Combinación de impacto social medible con modelo de negocio sostenible y tecnología innovadora",
    "customerSegments": "Beneficiarios directos (usuarios finales), organizaciones aliadas, sector público",
    "earlyAdopters": "ONGs innovadoras, gobiernos locales progresistas, fundaciones con enfoque tech4good",
    "keyActivities": "Desarrollo de producto, alianzas estratégicas, medición de impacto, fundraising",
    "keyIndicators": "Usuarios activos, impacto social generado, NPS, retención, crecimiento MoM",
    "distributionChannels": "Plataforma web/mobile, alianzas con ONGs, redes sociales, eventos de impacto social",
    "reachStrategy": "Marketing de contenido social, partnerships estratégicos, word-of-mouth, PR en medios especializados",
    "costElements": "Desarrollo y mantenimiento tecnológico, equipo core, servidores/cloud, marketing",
    "monthlyExpenses": "Salarios equipo tech y social, infraestructura cloud, herramientas SaaS, marketing digital",
    "revenueGeneration": "Modelo freemium (usuarios premium), grants y donaciones, servicios B2B a organizaciones",
    "profitMargin": "Reinversión en impacto social y crecimiento, márgenes ajustados priorizando accesibilidad",
    "teamMembers": "CTO/Tech Lead, Product Manager, Social Impact Lead, Community Manager",
    "keyRoles": "Desarrollo tecnológico, medición de impacto, gestión de alianzas, fundraising",
    "socialImpact": "Inclusión digital, reducción de desigualdades, empoderamiento de comunidades vulnerables",
    "environmentalImpact": "Reducción de huella de carbono mediante soluciones digitales, promoción de sostenibilidad",
    "improvementMeasures": "ODS alineados, métricas de impacto transparentes, reportes anuales de sostenibilidad"
  }'::jsonb,
  '💻'
),
(
  'ONG Tradicional',
  ARRAY['ONG', 'Non-profit', 'Social'],
  'Modelo para organizaciones sin fines de lucro con enfoque en impacto social directo y financiamiento por donaciones.',
  '{
    "mainProblems": "Problemas sociales estructurales (pobreza, educación, salud), falta de recursos en comunidades vulnerables",
    "alternativeSolutions": "Programas gubernamentales, otras ONGs, iniciativas comunitarias locales",
    "keyCharacteristics": "Programas de intervención directa, voluntariado activo, transparencia en uso de fondos",
    "valueProposition": "Generar impacto social tangible y medible en comunidades vulnerables de forma transparente",
    "differentialAdvantage": "Presencia en terreno, red de voluntarios comprometidos, experiencia en sector específico",
    "customerSegments": "Beneficiarios directos (comunidades), donantes individuales, fundaciones, empresas con RSC",
    "earlyAdopters": "Donantes recurrentes, voluntarios core, empresas con programas de RSC establecidos",
    "keyActivities": "Ejecución de programas, fundraising, gestión de voluntarios, medición de impacto, comunicación",
    "keyIndicators": "Beneficiarios atendidos, fondos recaudados, tasa de retención de donantes, impacto por programa",
    "distributionChannels": "Presencia en terreno, redes sociales, eventos de recaudación, newsletter, alianzas corporativas",
    "reachStrategy": "Storytelling de impacto, campañas de donación, eventos presenciales, marketing de causa",
    "costElements": "Ejecución de programas, salarios staff, infraestructura, comunicación y fundraising",
    "monthlyExpenses": "Operaciones de programas, salarios equipo, alquiler oficina/espacios, marketing y comunicación",
    "revenueGeneration": "Donaciones individuales, grants institucionales, eventos de recaudación, partnerships corporativos",
    "profitMargin": "Modelo sin fines de lucro - reinversión 100% en programas sociales",
    "teamMembers": "Director Ejecutivo, Coordinador de Programas, Fundraiser, Coordinador de Voluntarios",
    "keyRoles": "Diseño y ejecución de programas, recaudación de fondos, gestión de stakeholders, medición de impacto",
    "socialImpact": "Mejora de calidad de vida de beneficiarios, reducción de desigualdades, desarrollo comunitario",
    "environmentalImpact": "Dependiendo del enfoque: conservación, reciclaje, agricultura sostenible",
    "improvementMeasures": "ODS relevantes al sector, reportes anuales transparentes, auditorías externas"
  }'::jsonb,
  '🤝'
),
(
  'Empresa B Corp',
  ARRAY['B Corp', 'Sostenibilidad', 'Negocios'],
  'Modelo para empresas certificadas B que equilibran propósito social/ambiental con rentabilidad financiera.',
  '{
    "mainProblems": "Consumidores buscan marcas con propósito, crisis climática, desigualdades sociales en cadenas de suministro",
    "alternativeSolutions": "Empresas tradicionales con programas de RSC superficiales, greenwashing sin impacto real",
    "keyCharacteristics": "Triple impacto (económico, social, ambiental), transparencia radical, gobernanza participativa",
    "valueProposition": "Productos/servicios de calidad que generan impacto positivo verificable en sociedad y medio ambiente",
    "differentialAdvantage": "Certificación B Corp como aval de impacto, comunidad global de empresas B, modelo replicable",
    "customerSegments": "Consumidores conscientes, empresas que buscan proveedores sostenibles, inversores de impacto",
    "earlyAdopters": "Millennials y Gen Z con valores sociales/ambientales, empresas B2B con políticas ESG",
    "keyActivities": "Producción sostenible, medición de impacto triple, comunicación de valores, innovación responsable",
    "keyIndicators": "Score B Impact Assessment, revenue growth, NPS, reducción de huella ambiental, satisfacción empleados",
    "distributionChannels": "E-commerce propio, retail especializado, marketplaces sostenibles, B2B directo",
    "reachStrategy": "Marketing de propósito, certificaciones visibles, comunidad B Corp, contenido educativo",
    "costElements": "Producción sostenible (mayor costo), certificación B Corp, salarios justos, comunicación de impacto",
    "monthlyExpenses": "Operaciones sostenibles, equipo, materias primas éticas, marketing, medición de impacto",
    "revenueGeneration": "Venta de productos/servicios con premium por sostenibilidad, contratos B2B, servicios de consultoría",
    "profitMargin": "Márgenes saludables que permiten reinversión en impacto sin sacrificar rentabilidad",
    "teamMembers": "CEO/Founder, COO, Sustainability Manager, Sales/Marketing Lead, Impact Measurement Analyst",
    "keyRoles": "Liderazgo con propósito, operaciones sostenibles, medición de triple impacto, comunicación auténtica",
    "socialImpact": "Salarios justos, diversidad e inclusión, cadenas de suministro éticas, desarrollo de proveedores",
    "environmentalImpact": "Neutralidad de carbono, economía circular, materiales sostenibles, reducción de residuos",
    "improvementMeasures": "Certificación B Corp renovable, ODS prioritarios, reportes de impacto anuales, mejora continua"
  }'::jsonb,
  '🌱'
),
(
  'Cooperativa Social',
  ARRAY['Cooperativa', 'Economía Social', 'Autogestión'],
  'Modelo para cooperativas que combinan objetivos económicos con impacto social mediante gobernanza democrática.',
  '{
    "mainProblems": "Desempleo en comunidades vulnerables, falta de acceso a servicios financieros, explotación laboral",
    "alternativeSolutions": "Empleo tradicional con bajos salarios, microcréditos informales, subsidios gubernamentales",
    "keyCharacteristics": "Gobernanza democrática (1 socio = 1 voto), distribución equitativa de excedentes, autogestión",
    "valueProposition": "Generación de empleo digno y desarrollo económico comunitario mediante modelo cooperativo sostenible",
    "differentialAdvantage": "Modelo de propiedad colectiva, reinversión en comunidad, resiliencia económica, compromiso de socios",
    "customerSegments": "Consumidores locales, sector público, empresas con cadenas de suministro éticas",
    "earlyAdopters": "Comunidad local, socios fundadores, organizaciones de economía social y solidaria",
    "keyActivities": "Producción/servicios cooperativos, formación de socios, gestión democrática, fortalecimiento comunitario",
    "keyIndicators": "Socios activos, excedentes generados, empleos creados, impacto en comunidad, satisfacción de socios",
    "distributionChannels": "Venta directa local, mercados cooperativos, e-commerce, contratos con sector público",
    "reachStrategy": "Redes de economía social, word-of-mouth comunitario, ferias locales, alianzas con otras cooperativas",
    "costElements": "Operaciones productivas, formación de socios, infraestructura compartida, gestión democrática",
    "monthlyExpenses": "Salarios equitativos de socios, materias primas, espacios cooperativos, capacitaciones",
    "revenueGeneration": "Venta de productos/servicios, contratos públicos, aportaciones de socios, subsidios específicos",
    "profitMargin": "Excedentes distribuidos equitativamente entre socios según participación y decisión democrática",
    "teamMembers": "Consejo de Administración (electo), Gerente General, Socios trabajadores, Comité de Vigilancia",
    "keyRoles": "Gestión democrática, operaciones productivas, educación cooperativa, vinculación comunitaria",
    "socialImpact": "Empleo digno, reducción de desigualdades, empoderamiento económico, desarrollo local",
    "environmentalImpact": "Producción local (menor huella), prácticas sostenibles, economía circular",
    "improvementMeasures": "Principios cooperativos ICA, balance social cooperativo, auditorías participativas"
  }'::jsonb,
  '🤲'
),
(
  'Empresa Social de Comercio Justo',
  ARRAY['Comercio Justo', 'Social', 'Cadena de Valor'],
  'Modelo para empresas que conectan productores vulnerables con mercados mediante relaciones comerciales justas.',
  '{
    "mainProblems": "Productores pequeños excluidos de mercados, intermediarios abusivos, precios volátiles, falta de acceso a financiamiento",
    "alternativeSolutions": "Comercio tradicional con márgenes bajos para productores, programas de RSC superficiales",
    "keyCharacteristics": "Precios justos garantizados, relaciones de largo plazo, prefinanciamiento, capacitación a productores",
    "valueProposition": "Productos de calidad con historia auténtica que garantizan impacto directo en productores",
    "differentialAdvantage": "Certificación Fair Trade, trazabilidad completa, historias reales de productores, comunidad consciente",
    "customerSegments": "Consumidores conscientes, retail especializado, hoteles/restaurantes sostenibles, empresas con políticas ESG",
    "earlyAdopters": "Consumidores millennials/Gen Z, tiendas de comercio justo, corporativos con compras sostenibles",
    "keyActivities": "Gestión de cadena de suministro ética, comercialización, storytelling de productores, certificaciones",
    "keyIndicators": "Productores beneficiados, volumen comercializado, impacto económico en origen, NPS, crecimiento ventas",
    "distributionChannels": "Retail especializado, e-commerce propio, horeca sostenible, B2B corporativo, tiendas propias",
    "reachStrategy": "Storytelling de productores, certificaciones visibles, eventos de degustación, marketing de causa",
    "costElements": "Precios justos a productores, certificación Fair Trade, logística internacional, marketing diferenciado",
    "monthlyExpenses": "Compras a productores, importación/logística, equipo comercial, marketing, certificaciones",
    "revenueGeneration": "Venta de productos con premium ético, servicios B2B, experiencias (tours de origen), consultoría",
    "profitMargin": "Márgenes moderados que permiten sostenibilidad financiera sin comprometer precios justos",
    "teamMembers": "Sourcing Manager, Trade Relations Manager, Marketing Lead, Logistics Coordinator",
    "keyRoles": "Gestión de relaciones con productores, comercialización ética, comunicación de impacto, certificaciones",
    "socialImpact": "Mejora de ingresos de productores, desarrollo comunitario en origen, empoderamiento económico",
    "environmentalImpact": "Prácticas agrícolas sostenibles, reducción de químicos, conservación de biodiversidad",
    "improvementMeasures": "Certificación Fair Trade, ODS 1, 8, 12, reportes de impacto en origen, auditorías externas"
  }'::jsonb,
  '☕'
),
(
  'Emprendimiento de Impacto Ambiental',
  ARRAY['Medio Ambiente', 'Sostenibilidad', 'Economía Circular'],
  'Modelo para empresas enfocadas en solucionar problemas ambientales mediante economía circular y soluciones verdes.',
  '{
    "mainProblems": "Contaminación, residuos no gestionados, modelo económico lineal, cambio climático, pérdida de biodiversidad",
    "alternativeSolutions": "Reciclaje tradicional, programas gubernamentales, iniciativas de voluntariado sin escalabilidad",
    "keyCharacteristics": "Modelo de economía circular, productos/servicios carbono neutral, innovación verde, medición ambiental",
    "valueProposition": "Soluciones ambientales escalables que generan valor económico mientras regeneran el planeta",
    "differentialAdvantage": "Tecnología verde innovadora, impacto ambiental medible y verificable, modelo circular replicable",
    "customerSegments": "Consumidores eco-conscientes, empresas con metas ESG, gobiernos locales, fondos de impacto ambiental",
    "earlyAdopters": "Early adopters verdes, empresas B2B con políticas ambientales, comunidades sostenibles",
    "keyActivities": "Innovación en economía circular, medición de huella ambiental, educación ambiental, certificaciones verdes",
    "keyIndicators": "CO2 evitado, residuos valorizados, economía circular (%), impacto ambiental neto, revenue growth",
    "distributionChannels": "E-commerce verde, retail eco, B2B sostenible, alianzas con gobiernos, plataformas de impacto",
    "reachStrategy": "Marketing ambiental, certificaciones visibles, PR verde, comunidad eco, contenido educativo",
    "costElements": "I+D verde, materiales sostenibles, certificaciones ambientales, medición de impacto, comunicación",
    "monthlyExpenses": "Operaciones circulares, equipo especializado, herramientas de medición, marketing verde",
    "revenueGeneration": "Venta de productos/servicios verdes, bonos de carbono, consultoría ambiental, grants climáticos",
    "profitMargin": "Márgenes que permiten reinversión en I+D verde y expansión de impacto ambiental",
    "teamMembers": "Sustainability Officer, Environmental Scientist, Circular Economy Specialist, Green Marketing Lead",
    "keyRoles": "Innovación ambiental, medición científica de impacto, operaciones circulares, comunicación verde",
    "socialImpact": "Empleos verdes, educación ambiental comunitaria, salud pública mejorada",
    "environmentalImpact": "Reducción neta de emisiones, restauración de ecosistemas, economía circular, biodiversidad",
    "improvementMeasures": "Neutralidad de carbono certificada, ODS 13, 14, 15, reportes LCA, certificaciones ISO 14001"
  }'::jsonb,
  '🌍'
);