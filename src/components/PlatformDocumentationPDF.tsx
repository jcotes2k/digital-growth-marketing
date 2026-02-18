import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const PlatformDocumentationPDF = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      
      // Helper functions
      const addHeader = (pageNum: number) => {
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('Digital Growth Marketing - Documentación de Plataforma', margin, 10);
        doc.text(`Página ${pageNum}`, pageWidth - margin - 15, 10);
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, 12, pageWidth - margin, 12);
      };

      const addFooter = () => {
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        const date = new Date().toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        doc.text(`Generado el ${date}`, margin, pageHeight - 10);
        doc.text('© 2025 Digital Growth Marketing', pageWidth - margin - 50, pageHeight - 10);
      };

      const addTitle = (text: string, y: number, size: number = 16) => {
        doc.setFontSize(size);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 30, 30);
        doc.text(text, margin, y);
        return y + 10;
      };

      const addSubtitle = (text: string, y: number) => {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(60, 60, 60);
        doc.text(text, margin, y);
        return y + 8;
      };

      const addParagraph = (text: string, y: number) => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);
        const lines = doc.splitTextToSize(text, contentWidth);
        doc.text(lines, margin, y);
        return y + lines.length * 5 + 5;
      };

      const addBulletList = (items: string[], y: number) => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);
        let currentY = y;
        items.forEach(item => {
          const lines = doc.splitTextToSize(`• ${item}`, contentWidth - 5);
          doc.text(lines, margin + 5, currentY);
          currentY += lines.length * 5 + 2;
        });
        return currentY + 3;
      };

      const checkPageBreak = (y: number, needed: number = 30): number => {
        if (y + needed > pageHeight - 20) {
          doc.addPage();
          pageNumber++;
          addHeader(pageNumber);
          addFooter();
          return 25;
        }
        return y;
      };

      let pageNumber = 1;

      // ========== PORTADA ==========
      doc.setFillColor(30, 64, 175);
      doc.rect(0, 0, pageWidth, 80, 'F');
      
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('Digital Growth Marketing', pageWidth / 2, 35, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('Plataforma de Marketing de Contenido con IA', pageWidth / 2, 50, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text('Documentación Completa para Inversores y Clientes', pageWidth / 2, 65, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      const currentDate = new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      doc.text(`Versión 1.0 - ${currentDate}`, pageWidth / 2, 100, { align: 'center' });
      
      // Índice
      let y = 120;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text('Contenido', margin, y);
      y += 10;
      
      const indexItems = [
        '1. Resumen Ejecutivo',
        '2. Arquitectura de la Plataforma',
        '3. Sistema de Progresión (18 Fases)',
        '4. Módulos y Funcionalidades Detalladas',
        '5. Sistema de Agentes IA Especializados',
        '6. Planes y Precios',
        '7. Programa de Afiliados',
        '8. Integraciones y Tecnología',
        '9. Seguridad y Cumplimiento',
        '10. Roadmap y Visión Futura'
      ];
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      indexItems.forEach((item, i) => {
        doc.text(item, margin + 10, y + i * 7);
      });

      // ========== SECCIÓN 1: RESUMEN EJECUTIVO ==========
      doc.addPage();
      pageNumber++;
      addHeader(pageNumber);
      addFooter();
      
      y = 25;
      y = addTitle('1. Resumen Ejecutivo', y, 18);
      y += 5;
      
      y = addSubtitle('Propuesta de Valor', y);
      y = addParagraph(
        'Digital Growth Marketing es una plataforma SaaS integral de marketing de contenido que combina inteligencia artificial avanzada con metodologías probadas de negocio. Nuestra solución guía a emprendedores, PyMEs y equipos de marketing a través de un proceso estructurado de 18 fases, desde la definición del buyer persona hasta la automatización completa del marketing con agentes IA especializados.',
        y
      );
      
      y = checkPageBreak(y, 40);
      y = addSubtitle('Problema que Resolvemos', y);
      y = addBulletList([
        'Fragmentación de herramientas de marketing (promedio de 8-12 herramientas por empresa)',
        'Falta de estrategia coherente entre canales',
        'Contenido inconsistente que no conecta con la audiencia objetivo',
        'Inversión de tiempo excesiva en tareas repetitivas de marketing',
        'Dificultad para medir el ROI real del marketing de contenidos'
      ], y);
      
      y = checkPageBreak(y, 40);
      y = addSubtitle('Mercado Objetivo', y);
      y = addBulletList([
        'Emprendedores y startups en fase de crecimiento',
        'PyMEs con equipos de marketing de 1-10 personas',
        'Agencias de marketing digital',
        'Consultores y freelancers de marketing',
        'Empresas en transformación digital'
      ], y);
      
      y = checkPageBreak(y, 40);
      y = addSubtitle('Modelo de Negocio', y);
      y = addParagraph(
        'Modelo SaaS de suscripción mensual con 4 niveles de acceso progresivo. Incluimos un programa de afiliados con comisiones recurrentes del 10% para incentivar el crecimiento orgánico.',
        y
      );

      // ========== SECCIÓN 2: ARQUITECTURA ==========
      doc.addPage();
      pageNumber++;
      addHeader(pageNumber);
      addFooter();
      
      y = 25;
      y = addTitle('2. Arquitectura de la Plataforma', y, 18);
      y += 5;
      
      y = addSubtitle('Stack Tecnológico', y);
      y = addBulletList([
        'Frontend: React 18 + TypeScript + Vite (build ultrarrápido)',
        'Estilos: Tailwind CSS + shadcn/ui (componentes accesibles)',
        'Backend: Supabase (PostgreSQL + Auth + Storage + Edge Functions)',
        'IA: Integración con OpenAI GPT-4, Google Gemini',
        'Pagos: ePayco (suscripciones recurrentes)',
        'Hosting: Lovable Cloud (escalabilidad automática)'
      ], y);
      
      y = checkPageBreak(y, 50);
      y = addSubtitle('Características Técnicas', y);
      y = addBulletList([
        'Arquitectura serverless para escalabilidad automática',
        'Row Level Security (RLS) para aislamiento de datos por usuario',
        'Edge Functions para procesamiento distribuido globalmente',
        'Real-time subscriptions para actualizaciones en vivo',
        'Autenticación segura con tokens JWT',
        'Backups automáticos diarios de base de datos'
      ], y);
      
      y = checkPageBreak(y, 50);
      y = addSubtitle('Seguridad', y);
      y = addBulletList([
        'Encriptación en tránsito (TLS 1.3) y en reposo (AES-256)',
        'Autenticación multi-factor disponible',
        'Políticas de acceso granulares por rol',
        'Cumplimiento GDPR para usuarios europeos',
        'Logs de auditoría para todas las acciones críticas'
      ], y);

      // ========== SECCIÓN 3: SISTEMA DE PROGRESIÓN ==========
      doc.addPage();
      pageNumber++;
      addHeader(pageNumber);
      addFooter();
      
      y = 25;
      y = addTitle('3. Sistema de Progresión (18 Fases)', y, 18);
      y += 5;
      
      y = addParagraph(
        'Nuestra plataforma guía a los usuarios a través de un sistema estructurado de 18 fases, cada una construyendo sobre la anterior para crear una estrategia de marketing completa y coherente.',
        y
      );
      
      y = checkPageBreak(y, 60);
      y = addSubtitle('Fases 1-6: Core (Plan Free)', y);
      
      const coreFases = [
        'Fase 1 - Información de Empresa: Configuración inicial del perfil empresarial, sector, misión y visión.',
        'Fase 2 - Buyer Persona: Definición del cliente ideal con 3 métodos (manual, plantillas, IA asistida).',
        'Fase 3 - Business Canvas: Modelo de negocio visual con 11 bloques especializados.',
        'Fase 4 - Product Roadmap: Planificación de producto con priorización MoSCoW.',
        'Fase 5 - Estrategia de Contenido: Plan editorial con objetivos, canales y KPIs.',
        'Fase 6 - Estrategia Inteligente: Versión avanzada con IA para optimización automática.'
      ];
      y = addBulletList(coreFases, y);
      
      y = checkPageBreak(y, 50);
      y = addSubtitle('Fases 7-9: Herramientas de Contenido (Plan Pro)', y);
      
      const proFases = [
        'Fase 7 - Generador de Contenido: Creación automática de posts para múltiples plataformas.',
        'Fase 8 - Calendario Editorial: Planificación visual drag-and-drop con sincronización.',
        'Fase 9 - Generador de Hashtags: Hashtags optimizados por plataforma y nicho.'
      ];
      y = addBulletList(proFases, y);
      
      y = checkPageBreak(y, 80);
      y = addSubtitle('Fases 10-18: Herramientas Avanzadas (Plan Premium)', y);
      
      const premiumFases = [
        'Fase 10 - Análisis de Sentimiento: Monitoreo de percepción de marca en redes.',
        'Fase 11 - Análisis de Competencia: Benchmarking automático con competidores.',
        'Fase 12 - Banco de Imágenes IA: Generación de imágenes con DALL-E/Midjourney.',
        'Fase 13 - Atomizador de Contenido: Transforma 1 pieza en 15 formatos diferentes.',
        'Fase 14 - Predictor de Viralidad: Score predictivo antes de publicar.',
        'Fase 15 - Dashboard en Tiempo Real: Métricas unificadas de todas las plataformas.',
        'Fase 16 - A/B Testing: Optimización de variantes de contenido.',
        'Fase 17 - Atribución de Ingresos: Tracking de conversiones por contenido.',
        'Fase 18 - Reportes y ROI: Informes ejecutivos y cálculo de retorno.'
      ];
      y = addBulletList(premiumFases, y);

      // ========== SECCIÓN 4: MÓDULOS DETALLADOS ==========
      doc.addPage();
      pageNumber++;
      addHeader(pageNumber);
      addFooter();
      
      y = 25;
      y = addTitle('4. Módulos y Funcionalidades Detalladas', y, 18);
      y += 5;
      
      y = addSubtitle('4.1 Buyer Persona con IA', y);
      y = addParagraph(
        'Sistema avanzado de creación de buyer personas con tres metodologías complementarias:',
        y
      );
      y = addBulletList([
        'Formulario Manual: 8 secciones (demografía, motivaciones, canales, etc.)',
        'Biblioteca de Arquetipos: 14+ plantillas por industria (CMO, Desarrolladores, E-commerce...)',
        'Asistente IA Conversacional: Chatbot que guía la creación mediante preguntas inteligentes'
      ], y);
      
      y = checkPageBreak(y, 50);
      y = addSubtitle('4.2 Business Canvas Inteligente', y);
      y = addParagraph(
        'Adaptación del Business Model Canvas para negocios modernos con 11 bloques:',
        y
      );
      y = addBulletList([
        'Problema, Solución, Propuesta de Valor Única',
        'Segmentos de Clientes, Canales, Métricas Clave',
        'Ventaja Diferencial, Estructura de Costes',
        'Sostenibilidad Financiera, Impacto, Equipo'
      ], y);
      
      y = checkPageBreak(y, 50);
      y = addSubtitle('4.3 Generador de Contenido Multi-plataforma', y);
      y = addBulletList([
        'Plataformas soportadas: Instagram, Facebook, LinkedIn, Twitter/X, TikTok, YouTube',
        'Estilos: Profesional, Casual, Inspiracional, Educativo, Promocional',
        'Incluye: Texto optimizado, hashtags, llamadas a la acción, emojis contextuales',
        'Puntuación predictiva de engagement antes de publicar'
      ], y);
      
      y = checkPageBreak(y, 50);
      y = addSubtitle('4.4 Calendario Editorial Visual', y);
      y = addBulletList([
        'Vista mensual, semanal y diaria con drag-and-drop',
        'Estados de publicación: Borrador, Programado, Publicado, En Revisión',
        'Flujos de aprobación para equipos',
        'Integración con análisis de mejor horario por plataforma'
      ], y);
      
      y = checkPageBreak(y, 50);
      y = addSubtitle('4.5 Atomizador de Contenido', y);
      y = addParagraph(
        'Transforma una pieza de contenido principal en múltiples formatos:',
        y
      );
      y = addBulletList([
        '1 artículo → 15 piezas: Tweets, carruseles, infografías, reels scripts',
        'Optimización automática de longitud por plataforma',
        'Mantenimiento de mensaje central y tono de marca',
        'Sugerencias de imágenes/videos complementarios'
      ], y);

      // ========== SECCIÓN 5: AGENTES IA ==========
      doc.addPage();
      pageNumber++;
      addHeader(pageNumber);
      addFooter();
      
      y = 25;
      y = addTitle('5. Sistema de Agentes IA Especializados', y, 18);
      y += 3;
      
      y = addParagraph(
        'Exclusivo del Plan Gold: 16 agentes de IA especializados que funcionan como una agencia de marketing virtual 24/7.',
        y
      );
      
      y = checkPageBreak(y, 60);
      y = addSubtitle('Equipo Central y Estratégico', y);
      y = addBulletList([
        'CEO Digital: Coordinación estratégica y toma de decisiones',
        'Director Estratégico: Planificación a largo plazo y objetivos',
        'Investigador de Mercado: Análisis de tendencias y oportunidades',
        'Estratega de Marca: Posicionamiento y diferenciación',
        'Project Manager: Gestión de proyectos y deadlines'
      ], y);
      
      y = checkPageBreak(y, 50);
      y = addSubtitle('Especialistas en Contenido', y);
      y = addBulletList([
        'Copywriter: Redacción persuasiva y storytelling',
        'SEO Manager: Optimización para motores de búsqueda',
        'Social Media Manager: Gestión de comunidades y engagement',
        'Paid Media Specialist: Campañas publicitarias y ROI',
        'Growth Optimizer: Experimentos y optimización continua',
        'Data Analyst: Interpretación de métricas y reportes'
      ], y);
      
      y = checkPageBreak(y, 50);
      y = addSubtitle('Tecnología y Creatividad', y);
      y = addBulletList([
        'CRM Expert: Gestión de relaciones con clientes',
        'Customer Success: Retención y satisfacción',
        'Director Creativo: Dirección artística y branding visual',
        'Productor Multimedia: Videos, podcasts, infografías',
        'Desarrollador Web: Landing pages y optimización técnica'
      ], y);
      
      y = checkPageBreak(y, 30);
      y = addSubtitle('Consultor de Negocios (Bonus)', y);
      y = addParagraph(
        'Agente especializado en análisis de modelo de negocio, identificación de oportunidades de crecimiento y recomendaciones estratégicas personalizadas.',
        y
      );

      // ========== SECCIÓN 6: PLANES Y PRECIOS ==========
      doc.addPage();
      pageNumber++;
      addHeader(pageNumber);
      addFooter();
      
      y = 25;
      y = addTitle('6. Planes y Precios', y, 18);
      y += 5;
      
      // Tabla de precios
      const plans = [
        { name: 'Free', price: '$0', features: 'Fases 1-6 (Core)', users: '1' },
        { name: 'Pro', price: '$39/mes', features: 'Fases 1-9 + PDF Export', users: '1' },
        { name: 'Premium', price: '$69/mes', features: 'Fases 1-18 + WhatsApp', users: '5' },
        { name: 'Gold', price: '$89/mes', features: 'Todo + 16 Agentes IA', users: '10' }
      ];
      
      // Dibujar tabla
      const tableStartY = y;
      const colWidths = [35, 35, 70, 30];
      const rowHeight = 12;
      
      // Header de tabla
      doc.setFillColor(30, 64, 175);
      doc.rect(margin, tableStartY, contentWidth, rowHeight, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('Plan', margin + 5, tableStartY + 8);
      doc.text('Precio', margin + 40, tableStartY + 8);
      doc.text('Incluye', margin + 75, tableStartY + 8);
      doc.text('Usuarios', margin + 145, tableStartY + 8);
      
      // Filas de tabla
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      plans.forEach((plan, i) => {
        const rowY = tableStartY + rowHeight * (i + 1);
        if (i % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(margin, rowY, contentWidth, rowHeight, 'F');
        }
        doc.text(plan.name, margin + 5, rowY + 8);
        doc.text(plan.price, margin + 40, rowY + 8);
        doc.text(plan.features, margin + 75, rowY + 8);
        doc.text(plan.users, margin + 150, rowY + 8);
      });
      
      y = tableStartY + rowHeight * 5 + 15;
      
      y = checkPageBreak(y, 50);
      y = addSubtitle('Características por Plan', y);
      
      y = addParagraph('Plan Free:', y);
      y = addBulletList([
        '6 fases core completamente funcionales',
        'Creación de buyer persona y business canvas',
        'Estrategia de contenido básica',
        'Soporte por documentación'
      ], y);
      
      y = checkPageBreak(y, 40);
      y = addParagraph('Plan Pro ($39/mes):', y);
      y = addBulletList([
        'Todo lo del plan Free',
        'Generador de contenido con IA',
        'Calendario editorial visual',
        'Generador de hashtags optimizados',
        'Exportación a PDF',
        'Soporte por email'
      ], y);
      
      y = checkPageBreak(y, 40);
      y = addParagraph('Plan Premium ($69/mes):', y);
      y = addBulletList([
        'Todo lo del plan Pro',
        '9 herramientas avanzadas adicionales',
        'Análisis de sentimiento y competencia',
        'Predictor de viralidad',
        'Dashboard en tiempo real',
        'Soporte por WhatsApp'
      ], y);
      
      y = checkPageBreak(y, 40);
      y = addParagraph('Plan Gold ($89/mes):', y);
      y = addBulletList([
        'Todo lo del plan Premium',
        '16 Agentes IA especializados',
        'Automatización de workflows',
        'Consultor de negocios IA',
        'Soporte prioritario 24/7'
      ], y);

      // ========== SECCIÓN 7: PROGRAMA DE AFILIADOS ==========
      doc.addPage();
      pageNumber++;
      addHeader(pageNumber);
      addFooter();
      
      y = 25;
      y = addTitle('7. Programa de Afiliados', y, 18);
      y += 5;
      
      y = addParagraph(
        'Programa de marketing de afiliados diseñado para incentivar el crecimiento orgánico de la plataforma a través de recomendaciones de usuarios satisfechos.',
        y
      );
      
      y = checkPageBreak(y, 50);
      y = addSubtitle('Modelo de Comisiones', y);
      y = addBulletList([
        'Comisión recurrente del 10% mensual por cada referido',
        'Sin límite de referidos',
        'Comisiones de por vida mientras el referido mantenga su suscripción',
        'Tracking automático mediante código único de afiliado'
      ], y);
      
      y = checkPageBreak(y, 50);
      y = addSubtitle('Ejemplo de Ganancias', y);
      y = addParagraph(
        'Si un afiliado refiere 20 usuarios al plan Premium ($69/mes):\n• Comisión mensual: 20 × $69 × 10% = $138/mes\n• Comisión anual: $138 × 12 = $1,656/año\n• Ingreso pasivo recurrente mientras los usuarios permanezcan activos',
        y
      );
      
      y = checkPageBreak(y, 50);
      y = addSubtitle('Métodos de Pago', y);
      y = addBulletList([
        'Transferencia bancaria (Colombia y internacional)',
        'Nequi (Colombia)',
        'Daviplata (Colombia)',
        'Mínimo de retiro: $50.000 COP o equivalente'
      ], y);
      
      y = checkPageBreak(y, 40);
      y = addSubtitle('Dashboard de Afiliado', y);
      y = addBulletList([
        'Estadísticas en tiempo real de clics y conversiones',
        'Historial de comisiones y pagos',
        'Generador de enlaces personalizados',
        'Materiales de marketing descargables',
        'Solicitud de retiro con un clic'
      ], y);

      // ========== SECCIÓN 8: INTEGRACIONES ==========
      doc.addPage();
      pageNumber++;
      addHeader(pageNumber);
      addFooter();
      
      y = 25;
      y = addTitle('8. Integraciones y Tecnología', y, 18);
      y += 5;
      
      y = addSubtitle('Inteligencia Artificial', y);
      y = addBulletList([
        'OpenAI GPT-4 / GPT-4 Turbo: Generación de contenido y análisis',
        'Google Gemini: Procesamiento multimodal (texto + imágenes)',
        'DALL-E 3: Generación de imágenes personalizadas',
        'Whisper: Transcripción de audio para podcasts',
        'Modelos custom fine-tuned para marketing en español'
      ], y);
      
      y = checkPageBreak(y, 50);
      y = addSubtitle('Pagos y Facturación', y);
      y = addBulletList([
        'ePayco: Procesador de pagos líder en Colombia',
        'Suscripciones recurrentes automáticas',
        'Múltiples métodos: Tarjeta, PSE, efectivo',
        'Webhooks para sincronización en tiempo real',
        'Facturación automática mensual'
      ], y);
      
      y = checkPageBreak(y, 50);
      y = addSubtitle('Backend y Base de Datos', y);
      y = addBulletList([
        'Supabase: Backend-as-a-Service basado en PostgreSQL',
        'Autenticación segura con JWT',
        'Storage para archivos e imágenes',
        'Edge Functions para lógica serverless',
        'Realtime para actualizaciones en vivo'
      ], y);
      
      y = checkPageBreak(y, 40);
      y = addSubtitle('Integraciones Futuras (Roadmap)', y);
      y = addBulletList([
        'Conexión directa con Meta Business Suite',
        'Publicación automática en redes sociales',
        'Integración con Google Analytics 4',
        'Zapier para automatizaciones externas',
        'API pública para desarrolladores'
      ], y);

      // ========== SECCIÓN 9: SEGURIDAD ==========
      doc.addPage();
      pageNumber++;
      addHeader(pageNumber);
      addFooter();
      
      y = 25;
      y = addTitle('9. Seguridad y Cumplimiento', y, 18);
      y += 5;
      
      y = addSubtitle('Protección de Datos', y);
      y = addBulletList([
        'Encriptación TLS 1.3 para todas las conexiones',
        'Encriptación AES-256 para datos en reposo',
        'Aislamiento de datos por usuario mediante RLS',
        'Backups automáticos diarios con retención de 30 días',
        'Infraestructura en centros de datos certificados ISO 27001'
      ], y);
      
      y = checkPageBreak(y, 50);
      y = addSubtitle('Autenticación y Acceso', y);
      y = addBulletList([
        'Autenticación segura con email/contraseña',
        'Tokens JWT con expiración automática',
        'Políticas de contraseña robustas',
        'Logs de auditoría para acciones sensibles',
        'Cierre de sesión automático por inactividad'
      ], y);
      
      y = checkPageBreak(y, 50);
      y = addSubtitle('Cumplimiento Normativo', y);
      y = addBulletList([
        'GDPR: Derecho al olvido y portabilidad de datos',
        'Ley 1581 de 2012 (Colombia): Protección de datos personales',
        'Política de privacidad transparente',
        'Términos de servicio claros',
        'Consentimiento explícito para uso de datos'
      ], y);

      // ========== SECCIÓN 10: ROADMAP ==========
      doc.addPage();
      pageNumber++;
      addHeader(pageNumber);
      addFooter();
      
      y = 25;
      y = addTitle('10. Roadmap y Visión Futura', y, 18);
      y += 5;
      
      y = addSubtitle('Q1 2025 (Completado)', y);
      y = addBulletList([
        '✓ Lanzamiento de las 18 fases completas',
        '✓ Sistema de suscripciones con ePayco',
        '✓ Programa de afiliados activo',
        '✓ 16 Agentes IA para plan Gold'
      ], y);
      
      y = checkPageBreak(y, 40);
      y = addSubtitle('Q2 2025', y);
      y = addBulletList([
        'Publicación automática en redes sociales',
        'Aplicación móvil (iOS/Android)',
        'Integración con Canva para diseño',
        'Plantillas de contenido por industria'
      ], y);
      
      y = checkPageBreak(y, 40);
      y = addSubtitle('Q3 2025', y);
      y = addBulletList([
        'API pública para desarrolladores',
        'Marketplace de plantillas',
        'Integración con CRMs populares',
        'Reportes avanzados con IA predictiva'
      ], y);
      
      y = checkPageBreak(y, 40);
      y = addSubtitle('Q4 2025', y);
      y = addBulletList([
        'Expansión a mercados internacionales',
        'Soporte multiidioma (inglés, portugués)',
        'Plan Enterprise para grandes equipos',
        'Certificaciones de seguridad adicionales'
      ], y);
      
      y = checkPageBreak(y, 50);
      y = addSubtitle('Visión a Largo Plazo', y);
      y = addParagraph(
        'Convertirnos en la plataforma líder de marketing de contenido con IA en Latinoamérica, empoderando a más de 100,000 emprendedores y equipos de marketing para crear estrategias de contenido efectivas y automatizadas que generen resultados medibles.',
        y
      );

      // ========== PÁGINA FINAL ==========
      doc.addPage();
      pageNumber++;
      
      doc.setFillColor(30, 64, 175);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('¿Listo para transformar', pageWidth / 2, 80, { align: 'center' });
      doc.text('tu marketing de contenido?', pageWidth / 2, 95, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('Contacto:', pageWidth / 2, 130, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text('📧 digitalcoach@jaimecotes.com', pageWidth / 2, 145, { align: 'center' });
      doc.text('🌐 digital-growth-marketing.lovable.app', pageWidth / 2, 160, { align: 'center' });
      
      doc.setFontSize(10);
      doc.text('© 2025 Digital Growth Marketing', pageWidth / 2, 200, { align: 'center' });
      doc.text('Todos los derechos reservados', pageWidth / 2, 210, { align: 'center' });

      // Guardar PDF
      doc.save('Digital-Growth-Marketing-Documentacion-Completa.pdf');
      
      toast({
        title: "PDF generado exitosamente",
        description: "La documentación completa ha sido descargada.",
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error al generar PDF",
        description: "Hubo un problema al crear el documento. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/20 rounded-lg">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Documentación de Plataforma</h3>
            <p className="text-muted-foreground mb-4">
              Genera un PDF profesional de ~20 páginas con toda la información de Digital Growth Marketing. 
              Ideal para presentaciones a inversores, clientes potenciales o equipo interno.
            </p>
            <div className="text-sm text-muted-foreground mb-4">
              <strong>Incluye:</strong> Resumen ejecutivo, arquitectura técnica, 18 fases detalladas, 
              agentes IA, planes y precios, programa de afiliados, integraciones, seguridad y roadmap.
            </div>
            <Button 
              onClick={generatePDF} 
              disabled={isGenerating}
              size="lg"
              className="gap-2"
            >
              <Download className="h-5 w-5" />
              {isGenerating ? 'Generando PDF...' : 'Descargar Documentación Completa'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
