import { useState } from "react";
import { BuyerPersonaForm } from "@/components/BuyerPersonaForm";
import { BusinessCanvasForm } from "@/components/BusinessCanvasForm";
import { ProductRoadmapForm } from "@/components/ProductRoadmapForm";
import { ContentStrategyForm } from "@/components/ContentStrategyForm";
import { IntelligentContentStrategyForm } from "@/components/IntelligentContentStrategyForm";
import { AnalyticsInsightsForm } from "@/components/AnalyticsInsightsForm";
import { ContentGeneratorForm } from "@/components/ContentGeneratorForm";
import { EditorialCalendarForm } from "@/components/EditorialCalendarForm";
import { CompetitorAnalyzerForm } from "@/components/CompetitorAnalyzerForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [currentPhase, setCurrentPhase] = useState<'menu' | 'buyer-persona' | 'business-canvas' | 'product-roadmap' | 'content-strategy' | 'intelligent-content-strategy' | 'analytics-insights' | 'content-generator' | 'editorial-calendar' | 'competitor-analyzer'>('menu');

  const renderPhase = () => {
    switch (currentPhase) {
      case 'buyer-persona':
        return <BuyerPersonaForm />;
      case 'business-canvas':
        return <BusinessCanvasForm />;
      case 'product-roadmap':
        return <ProductRoadmapForm />;
      case 'content-strategy':
        return <ContentStrategyForm />;
      case 'intelligent-content-strategy':
        return <IntelligentContentStrategyForm />;
      case 'analytics-insights':
        return <AnalyticsInsightsForm />;
      case 'content-generator':
        return <ContentGeneratorForm />;
      case 'editorial-calendar':
        return <EditorialCalendarForm />;
      case 'competitor-analyzer':
        return <CompetitorAnalyzerForm />;
      default:
        return (
          <div className="min-h-screen bg-background p-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold mb-4">Metodología de Negocio</h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Selecciona la fase de la metodología que deseas completar
                </p>
              </div>

              <div className="space-y-6">
                {/* Primera fila - Fases 1 y 2 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentPhase('buyer-persona')}>
                    <CardHeader>
                      <CardTitle>Fase 1: Buyer Persona</CardTitle>
                      <CardDescription>
                        Crea un perfil detallado de tu cliente ideal siguiendo nuestra metodología paso a paso
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">Comenzar Buyer Persona</Button>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentPhase('business-canvas')}>
                    <CardHeader>
                      <CardTitle>Fase 2: Modelo de Negocio</CardTitle>
                      <CardDescription>
                        Define tu modelo de negocio con nuestra metodología Canvas estructurada
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">Comenzar Canvas</Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Segunda fila - Fases 3 y 4 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentPhase('product-roadmap')}>
                    <CardHeader>
                      <CardTitle>Fase 3: Product Roadmap</CardTitle>
                      <CardDescription>
                        Planifica tu producto con priorización MoSCoW y análisis competitivo
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">Comenzar Roadmap</Button>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentPhase('content-strategy')}>
                    <CardHeader>
                      <CardTitle>Fase 4: Estrategia de Contenido</CardTitle>
                      <CardDescription>
                        Desarrolla tu estrategia de contenido con canales, tono y objetivos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">Comenzar Estrategia</Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Tercera fila - Fases 5 y 6 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentPhase('intelligent-content-strategy')}>
                    <CardHeader>
                      <CardTitle>Fase 5: Estrategia Inteligente</CardTitle>
                      <CardDescription>
                        Estrategia de contenido generada automáticamente basada en tus datos previos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">Comenzar Estrategia IA</Button>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentPhase('analytics-insights')}>
                    <CardHeader>
                      <CardTitle>Fase 6: Análisis e Insights</CardTitle>
                      <CardDescription>
                        Análisis de contenido, competencia y hooks para maximizar resultados
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">Ver Análisis</Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Cuarta fila - Nuevas Funcionalidades */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow border-primary/20" onClick={() => setCurrentPhase('content-generator')}>
                    <CardHeader className="text-center">
                      <CardTitle className="text-primary">🤖 Generador de Contenido</CardTitle>
                      <CardDescription>
                        Crea contenido personalizado usando toda la estrategia que has definido
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" variant="default">
                        Generar Contenido
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-shadow border-secondary/20" onClick={() => setCurrentPhase('editorial-calendar')}>
                    <CardHeader className="text-center">
                      <CardTitle className="text-secondary">📅 Calendario Editorial</CardTitle>
                      <CardDescription>
                        Planifica y organiza todo tu contenido en un calendario visual
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" variant="secondary">
                        Ver Calendario
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Quinta fila - Análisis Competitivo */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow border-orange-200" onClick={() => setCurrentPhase('competitor-analyzer')}>
                    <CardHeader className="text-center">
                      <CardTitle className="text-orange-600">🔍 Análisis Competitivo</CardTitle>
                      <CardDescription>
                        Analiza tu competencia con IA y descubre oportunidades de mercado
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" variant="outline">
                        Analizar Competencia
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="text-center mt-8">
                <Button variant="outline" onClick={() => setCurrentPhase('menu')}>
                  Volver al Menú Principal
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      {currentPhase !== 'menu' && (
        <div className="fixed top-4 left-4 z-50">
          <Button variant="outline" onClick={() => setCurrentPhase('menu')}>
            ← Volver al Menú
          </Button>
        </div>
      )}
      {renderPhase()}
    </div>
  );
};

export default Index;
