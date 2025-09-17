import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Sparkles } from "lucide-react";
import { IntelligentContentStrategy } from "@/types/intelligent-content-strategy";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface IntelligentContentStrategyPreviewProps {
  data: IntelligentContentStrategy;
}

export const IntelligentContentStrategyPreview = ({ data }: IntelligentContentStrategyPreviewProps) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const element = document.getElementById('intelligent-strategy-preview');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('estrategia-contenido-inteligente.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Editar
          </Button>
          
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Estrategia de Contenido Inteligente</h1>
              <p className="text-muted-foreground">Tu canvas completo listo para implementar</p>
            </div>
          </div>
          
          <Button
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className="ml-auto flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isGeneratingPDF ? 'Generando PDF...' : 'Descargar PDF'}
          </Button>
        </div>

        <div id="intelligent-strategy-preview" className="bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Canvas de Estrategia de Contenido Inteligente</h1>
            <p className="text-gray-600">Generado automáticamente basado en tus datos de metodología empresarial</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Marca - Concepto Rector */}
            <Card className="col-span-full">
              <CardHeader className="bg-red-50">
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <span className="text-2xl">❤️</span>
                  1. Marca - Concepto Rector
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Propuesta de Valor:</h4>
                  <p className="text-sm text-gray-700">{data.brandConcept.valueProposition}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Diferenciadores Clave:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{data.brandConcept.keyDifferentiators}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Atributos de Marca:</h4>
                  <p className="text-sm text-gray-700">{data.brandConcept.brandAttributes}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Promesa al Cliente:</h4>
                  <p className="text-sm text-gray-700">{data.brandConcept.customerPromise}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Concepto Rector Creativo:</h4>
                  <p className="text-sm text-gray-700 italic font-medium">{data.brandConcept.creativeConceptPhrase}</p>
                </div>
              </CardContent>
            </Card>

            {/* KPIs */}
            <Card>
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <span className="text-2xl">📊</span>
                  2. KPI's
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Métricas Prioritarias:</h4>
                  <p className="text-sm text-gray-700">{data.kpis.priorityMetrics}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">KPI's Relevantes:</h4>
                  <ul className="text-sm text-gray-700">
                    {data.kpis.relevantKpis.map((kpi, index) => (
                      <li key={index}>• {kpi}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Objetivos Numéricos:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{data.kpis.numericObjectives}</p>
                </div>
              </CardContent>
            </Card>

            {/* Audiencia */}
            <Card>
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <span className="text-2xl">🎯</span>
                  3. Audiencia
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Buyer Persona Principal:</h4>
                  <p className="text-sm text-gray-700">{data.audience.primaryBuyerPersona}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Arquetipos:</h4>
                  <p className="text-sm text-gray-700">{data.audience.archetypes}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Públicos Clave:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{data.audience.keyPublics}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Problemas y Necesidades:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{data.audience.audienceProblemsNeeds}</p>
                </div>
              </CardContent>
            </Card>

            {/* Canales */}
            <Card>
              <CardHeader className="bg-purple-50">
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <span className="text-2xl">📱</span>
                  4. Canales
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Redes Sociales:</h4>
                  <p className="text-sm text-gray-700">{data.channels.socialNetworks}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Fit Plataforma-Contenido:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{data.channels.platformContentFit}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Rol de Cada Canal:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{data.channels.channelRoles}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Priorización de Recursos:</h4>
                  <p className="text-sm text-gray-700">{data.channels.resourcePrioritization}</p>
                </div>
              </CardContent>
            </Card>

            {/* Ritmo */}
            <Card>
              <CardHeader className="bg-orange-50">
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <span className="text-2xl">⏱️</span>
                  5. Ritmo
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Frecuencia de Publicación:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{data.rhythm.publicationFrequency}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Diferencias entre Redes:</h4>
                  <p className="text-sm text-gray-700">{data.rhythm.networkDifferences}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Stories/Reels/Videos:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{data.rhythm.storiesReelsVideos}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Timing Óptimo:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{data.rhythm.optimalTiming}</p>
                </div>
              </CardContent>
            </Card>

            {/* Marketing de Contenidos */}
            <Card>
              <CardHeader className="bg-yellow-50">
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <span className="text-2xl">🏆</span>
                  6. Marketing de Contenidos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Temas Principales:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{data.contentMarketing.mainTopics}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Mensajes Clave:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{data.contentMarketing.coreMessages}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Temas a Evitar:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{data.contentMarketing.topicsToAvoid}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Aporte de Valor:</h4>
                  <p className="text-sm text-gray-700">{data.contentMarketing.valueContribution}</p>
                </div>
              </CardContent>
            </Card>

            {/* Tono de Comunicación */}
            <Card>
              <CardHeader className="bg-pink-50">
                <CardTitle className="flex items-center gap-2 text-pink-800">
                  <span className="text-2xl">🎤</span>
                  6B. Tono de Comunicación
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Percepción de Marca:</h4>
                  <p className="text-sm text-gray-700">{data.communicationTone.brandPerception}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Estilo de Lenguaje:</h4>
                  <p className="text-sm text-gray-700">{data.communicationTone.languageStyle}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Emociones a Despertar:</h4>
                  <p className="text-sm text-gray-700">{data.communicationTone.emotionsToEvoke}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Personalidad de Voz:</h4>
                  <p className="text-sm text-gray-700">{data.communicationTone.voicePersonality}</p>
                </div>
              </CardContent>
            </Card>

            {/* Formatos */}
            <Card>
              <CardHeader className="bg-indigo-50">
                <CardTitle className="flex items-center gap-2 text-indigo-800">
                  <span className="text-2xl">🎬</span>
                  7. Formatos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Formatos Principales:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{data.formats.primaryFormats}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Formatos de Mayor Engagement:</h4>
                  <p className="text-sm text-gray-700">{data.formats.engagementFormats}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Reutilización de Contenido:</h4>
                  <p className="text-sm text-gray-700">{data.formats.contentReuse}</p>
                </div>
              </CardContent>
            </Card>

            {/* Presupuesto */}
            <Card>
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <span className="text-2xl">💰</span>
                  8. Presupuesto
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Presupuesto Mensual:</h4>
                  <p className="text-sm text-gray-700">{data.budget.monthlyBudget}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Orgánico vs Pagado:</h4>
                  <p className="text-sm text-gray-700">{data.budget.organicVsPaid}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Inversión por Red:</h4>
                  <p className="text-sm text-gray-700">{data.budget.networkInvestment}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Inversión en Herramientas:</h4>
                  <p className="text-sm text-gray-700">{data.budget.toolsInvestment}</p>
                </div>
              </CardContent>
            </Card>

            {/* FAQ's y Crisis */}
            <Card>
              <CardHeader className="bg-red-50">
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <span className="text-2xl">⚡</span>
                  9. FAQ's y Crisis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Preguntas Frecuentes:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{data.faqsCrisis.frequentQuestions}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Riesgos de Reputación:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{data.faqsCrisis.reputationRisks}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Protocolo de Crisis:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{data.faqsCrisis.crisisProtocol}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tiempo de Respuesta:</h4>
                  <p className="text-sm text-gray-700">{data.faqsCrisis.responseTime}</p>
                </div>
              </CardContent>
            </Card>

            {/* Workflow */}
            <Card>
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <span className="text-2xl">🔄</span>
                  10. Workflow
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Herramientas de Gestión:</h4>
                  <p className="text-sm text-gray-700">{data.workflow.managementTools}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Calendario Editorial:</h4>
                  <p className="text-sm text-gray-700">{data.workflow.editorialCalendar}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Flujo de Equipo:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{data.workflow.teamWorkflow}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Herramientas de Analítica:</h4>
                  <p className="text-sm text-gray-700">{data.workflow.analyticsTools}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Uso de IA:</h4>
                  <p className="text-sm text-gray-700">{data.workflow.aiUsage}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-8" />
          
          <div className="text-center text-gray-500 text-sm">
            <p>Canvas de Estrategia de Contenido Inteligente - Generado automáticamente</p>
            <p className="mt-2">Este documento ha sido creado basándose en los datos ingresados en las fases anteriores de tu metodología empresarial</p>
          </div>
        </div>
      </div>
    </div>
  );
};