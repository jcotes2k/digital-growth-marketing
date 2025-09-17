import { IntelligentContentStrategy } from "@/types/intelligent-content-strategy";
import { BuyerPersona } from "@/types/buyer-persona";
import { BusinessCanvas } from "@/types/business-canvas";
import { ProductRoadmap } from "@/types/product-roadmap";
import { ContentStrategy } from "@/types/content-strategy";

// Simulamos datos existentes de fases anteriores
// En una implementación real, estos datos vendrían del localStorage o una API
const getMockPreviousData = () => {
  return {
    buyerPersonas: [] as BuyerPersona[],
    businessCanvas: {} as BusinessCanvas,
    productRoadmap: {} as ProductRoadmap,
    contentStrategy: {} as ContentStrategy,
  };
};

export const generateIntelligentStrategy = async (): Promise<IntelligentContentStrategy> => {
  const previousData = getMockPreviousData();
  
  // Simular un delay para mostrar el loading
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    brandConcept: {
      valueProposition: "Ofrecemos soluciones innovadoras que transforman la manera en que nuestros clientes abordan sus desafíos más importantes, brindando resultados medibles y experiencias excepcionales.",
      keyDifferentiators: "• Enfoque personalizado y consultivo\n• Tecnología de vanguardia\n• Equipo especializado con amplia experiencia\n• Metodología probada con resultados garantizados\n• Soporte continuo post-implementación",
      brandAttributes: "Innovación, Confianza, Excelencia, Cercanía, Responsabilidad, Transparencia",
      customerPromise: "Te acompañamos en cada paso de tu transformación, garantizando resultados que superen tus expectativas y generen un impacto positivo duradero en tu organización.",
      creativeConceptPhrase: "Transformamos ideas en resultados extraordinarios",
    },
    kpis: {
      priorityMetrics: "Reconocimiento de marca, Generación de leads cualificados, Conversiones",
      relevantKpis: [
        "Alcance e impresiones",
        "Engagement rate",
        "Leads cualificados",
        "Conversiones web",
        "Share of voice",
        "Brand awareness"
      ],
      numericObjectives: "• Aumentar el engagement rate en un 25% en 6 meses\n• Generar 100 leads cualificados mensuales\n• Incrementar el reconocimiento de marca en un 40%\n• Lograr una tasa de conversión del 5% en landing pages",
    },
    audience: {
      primaryBuyerPersona: "Directivos y tomadores de decisiones de empresas medianas y grandes, entre 35-50 años, con enfoque en innovación y crecimiento empresarial.",
      archetypes: "El Sabio (busca conocimiento y expertise), El Héroe (quiere superar desafíos), El Explorador (busca nuevas oportunidades)",
      keyPublics: "• B2B: Directores, Gerentes, Ejecutivos\n• Decisores de compra en empresas de 100+ empleados\n• Profesionales en transformación digital\n• Líderes de innovación",
      audienceProblemsNeeds: "• Necesidad de modernizar procesos obsoletos\n• Falta de visibilidad en resultados\n• Presión por mostrar ROI\n• Miedo al cambio y la disrupción\n• Búsqueda de socios confiables",
    },
    channels: {
      socialNetworks: "LinkedIn (principal), YouTube, Twitter, Newsletter especializado",
      platformContentFit: "• LinkedIn: Contenido profesional, casos de éxito, thought leadership\n• YouTube: Webinars, tutoriales, testimoniales\n• Twitter: Tendencias, participación en conversaciones del sector",
      channelRoles: "• LinkedIn: Generación de leads y networking\n• YouTube: Educación y demostración de expertise\n• Newsletter: Nurturing y fidelización\n• Twitter: Brand awareness y engagement",
      resourcePrioritization: "80% LinkedIn, 15% YouTube, 5% Twitter - Enfocar recursos donde está nuestra audiencia principal",
    },
    rhythm: {
      publicationFrequency: "• LinkedIn: 5 posts/semana\n• YouTube: 2 videos/mes\n• Newsletter: Semanal\n• Twitter: 3 posts/semana",
      networkDifferences: "LinkedIn requiere mayor frecuencia por su naturaleza profesional, YouTube enfoque en calidad sobre cantidad",
      storiesReelsVideos: "• 8 stories/mes en LinkedIn\n• 4 videos cortos/mes\n• 2 webinars/mes\n• 1 caso de éxito detallado/semana",
      optimalTiming: "• LinkedIn: Martes-Jueves 9-11am y 2-4pm\n• YouTube: Miércoles y viernes\n• Newsletter: Martes 10am\n• Twitter: Lunes-Viernes 12-2pm",
    },
    contentMarketing: {
      mainTopics: "1. Transformación digital\n2. Liderazgo empresarial\n3. Innovación y tecnología\n4. Casos de éxito\n5. Tendencias del sector",
      coreMessages: "• Somos expertos en transformación\n• Resultados medibles y garantizados\n• Acompañamiento integral\n• Innovación accesible\n• Éxito conjunto",
      topicsToAvoid: "• Política y temas controversiales\n• Comparaciones directas negativas con competencia\n• Promesas irreales\n• Tecnicismos excesivos sin contexto",
      valueContribution: "Educamos sobre mejores prácticas, inspiramos con casos reales, entretenemos con storytelling empresarial, persuadimos con datos y resultados",
    },
    communicationTone: {
      brandPerception: "Profesional pero cercana, experta pero accesible, innovadora pero confiable",
      languageStyle: "Profesional con toques conversacionales, evitando jerga excesiva, priorizando claridad y valor",
      emotionsToEvoke: "Confianza, Inspiración, Seguridad, Entusiasmo por el crecimiento, Sentido de posibilidad",
      voicePersonality: "Hablamos en primera persona del plural ('nosotros') para mostrar cercanía y trabajo en equipo",
    },
    formats: {
      primaryFormats: "• Posts con carrusel de LinkedIn\n• Videos explicativos cortos\n• Infografías con datos\n• Casos de estudio detallados\n• Webinars interactivos",
      engagementFormats: "Videos y carruseles generan mayor interacción, seguidos de posts con preguntas directas",
      contentReuse: "Un caso de éxito se convierte en: post LinkedIn, video YouTube, newsletter section, infografía, presentación webinar",
    },
    budget: {
      monthlyBudget: "$5,000 USD mensuales para pauta digital",
      organicVsPaid: "70% orgánico (creación de contenido) - 30% pauta pagada (amplificación)",
      networkInvestment: "60% LinkedIn Ads, 25% YouTube Ads, 15% herramientas y otros",
      toolsInvestment: "Hootsuite ($300), Canva Pro ($150), Analytics tools ($200), Video editing ($300)",
    },
    faqsCrisis: {
      frequentQuestions: "• ¿Cuánto tiempo toma ver resultados?\n• ¿Qué garantías ofrecen?\n• ¿Cómo miden el éxito?\n• ¿Trabajan con empresas de nuestro sector?\n• ¿Cuál es la inversión requerida?",
      reputationRisks: "• Promesas no cumplidas\n• Comunicación poco clara\n• Retrasos en proyectos\n• Testimonios negativos\n• Comparaciones desfavorables con competencia",
      crisisProtocol: "1. Respuesta inmediata (máx. 2 horas)\n2. Evaluación interna del issue\n3. Respuesta pública transparente\n4. Acciones correctivas\n5. Seguimiento y prevención",
      responseTime: "Máximo 2 horas para crisis graves, 8 horas para consultas regulares, 24 horas para temas complejos",
    },
    workflow: {
      managementTools: "Notion para planning, Hootsuite para programación, Slack para comunicación, Google Drive para archivos",
      editorialCalendar: "Calendario mensual con temas principales, fechas especiales del sector, lanzamientos de productos, eventos importantes",
      teamWorkflow: "1. Strategy lead define temas semanales\n2. Content creator desarrolla materiales\n3. Designer crea assets visuales\n4. Community manager programa y publica\n5. Analytics specialist mide y reporta",
      analyticsTools: "Google Analytics, LinkedIn Analytics, YouTube Analytics, Hootsuite Insights, herramientas nativas de cada plataforma",
      aiUsage: "ChatGPT para ideación de contenido, Midjourney para assets visuales, Jasper para copy variations, Notion AI para organización",
    },
  };
};