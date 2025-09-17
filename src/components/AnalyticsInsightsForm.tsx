import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, MessageCircle, Target, Search, Zap } from "lucide-react";

export const AnalyticsInsightsForm = () => {
  // Simulamos datos basados en las fases anteriores
  const channelData = {
    facebook: {
      topContent: "Posts educativos sobre el problema que resuelve tu producto",
      engagement: "Videos cortos (15-30s) con 3.2% engagement rate",
      bestFormat: "Carrusel de imágenes con tips prácticos",
      optimalTiming: "Martes y jueves 7-9 PM"
    },
    instagram: {
      topContent: "Stories interactivas con polls y preguntas",
      engagement: "Reels de transformaciones con 8.5% engagement",
      bestFormat: "Reels educativos + carruseles informativos",
      optimalTiming: "Lunes, miércoles y viernes 6-8 PM"
    },
    tiktok: {
      topContent: "Tutoriales rápidos y tips del día",
      engagement: "Videos verticales 15-30s con 12.8% engagement",
      bestFormat: "Contenido educativo con tendencias musicales",
      optimalTiming: "Diario 7-10 PM"
    },
    youtube: {
      topContent: "Tutoriales detallados y casos de estudio",
      engagement: "Videos 5-8 min con 4.2% engagement rate",
      bestFormat: "Contenido educativo profundo + shorts",
      optimalTiming: "Martes y jueves 2-4 PM"
    }
  };

  const competitors = [
    {
      name: "Competidor Principal A",
      content: "Enfoque en casos de éxito y testimoniales",
      interactions: "Promedio 2.5K likes, 150 comentarios",
      activeFollowers: "85% audiencia activa, mayor engagement sábados",
      contentTypes: "70% video, 20% carrusel, 10% imagen simple",
      strengths: "Storytelling emocional, comunidad activa",
      opportunities: "Poco contenido educativo, débil en TikTok"
    },
    {
      name: "Competidor Emergente B",
      content: "Contenido viral y trending topics",
      interactions: "Promedio 1.8K likes, 200 comentarios",
      activeFollowers: "78% audiencia activa, picos los viernes",
      contentTypes: "60% reels, 25% stories, 15% posts",
      strengths: "Viralidad, creatividad visual",
      opportunities: "Falta consistencia en mensaje, poca autoridad"
    },
    {
      name: "Líder del Mercado C",
      content: "Contenido premium y exclusivo",
      interactions: "Promedio 5.2K likes, 300 comentarios",
      activeFollowers: "92% audiencia activa, estable toda la semana",
      contentTypes: "50% video largo, 30% carrusel, 20% live",
      strengths: "Autoridad establecida, contenido de calidad",
      opportunities: "Poco engagement en generación Z, formato rígido"
    }
  ];

  const contentHooks = {
    hooks: [
      "¿Sabías que el 90% de [tu audiencia] comete este error?",
      "La estrategia secreta que cambió mi [resultado específico]",
      "3 errores que te están costando [beneficio deseado]",
      "Por qué [creencia común] está completamente equivocada",
      "El método que [autoridad reconocida] no quiere que sepas"
    ],
    copyStrategies: [
      "Fórmula PAS: Problema + Agitación + Solución",
      "Storytelling de transformación personal",
      "Prueba social con números específicos",
      "Urgencia genuina con límite de tiempo",
      "Beneficio emocional + resultado racional"
    ],
    callToActions: [
      "Comenta 'YO' si quieres la guía completa",
      "Guarda este post para aplicarlo después",
      "Comparte con quien necesita ver esto",
      "Desliza para ver el antes y después",
      "Haz clic en el link de mi bio para [acción específica]"
    ],
    seoKeywords: [
      "[tu industria] + consejos",
      "[tu producto] + tutorial",
      "[problema común] + solución",
      "[tu nicho] + guía completa",
      "[beneficio principal] + cómo conseguir"
    ],
    semKeywords: [
      "[tu producto] + precio",
      "[competidor] + alternativa",
      "[problema urgente] + solución rápida",
      "[tu ciudad] + [tu servicio]",
      "[beneficio] + garantizado"
    ],
    contentHacks: [
      "Repostar contenido exitoso con nuevo ángulo cada 3 meses",
      "Crear carruseles de 10 slides para maximizar tiempo en pantalla",
      "Usar la regla 80/20: 80% valor, 20% promoción",
      "Hacer preguntas abiertas en la primera línea",
      "Incluir tu cara en el primer frame de videos"
    ]
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Fase 6: Análisis e Insights</h1>
          <p className="text-xl text-muted-foreground">
            Análisis profundo de contenido, competencia y estrategias optimizadas
          </p>
        </div>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Análisis de Contenido
            </TabsTrigger>
            <TabsTrigger value="competitors" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Análisis Competencia
            </TabsTrigger>
            <TabsTrigger value="hooks" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Hooks & Hacks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(channelData).map(([channel, data]) => (
                <Card key={channel} className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      {channel.charAt(0).toUpperCase() + channel.slice(1)}
                    </CardTitle>
                    <CardDescription>Análisis de contenido con mayor interacción</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Contenido Top</h4>
                      <p className="text-sm text-muted-foreground">{data.topContent}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Engagement</h4>
                      <Badge variant="secondary">{data.engagement}</Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Mejor Formato</h4>
                      <p className="text-sm text-muted-foreground">{data.bestFormat}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Horario Óptimo</h4>
                      <Badge variant="outline">{data.optimalTiming}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="competitors" className="space-y-6">
            <div className="grid gap-6">
              {competitors.map((competitor, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      {competitor.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Contenido Principal</h4>
                          <p className="text-sm text-muted-foreground">{competitor.content}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Interacciones Promedio</h4>
                          <Badge variant="secondary">{competitor.interactions}</Badge>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Seguidores Activos</h4>
                          <p className="text-sm text-muted-foreground">{competitor.activeFollowers}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Tipos de Contenido</h4>
                          <p className="text-sm text-muted-foreground">{competitor.contentTypes}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Fortalezas</h4>
                          <Badge variant="default">{competitor.strengths}</Badge>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Oportunidades</h4>
                          <Badge variant="destructive">{competitor.opportunities}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hooks" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Hooks para Contenido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {contentHooks.hooks.map((hook, index) => (
                      <Badge key={index} variant="outline" className="block w-full text-left p-2 h-auto">
                        {hook}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Estrategias de Copy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {contentHooks.copyStrategies.map((strategy, index) => (
                      <Badge key={index} variant="secondary" className="block w-full text-left p-2 h-auto">
                        {strategy}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Call to Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {contentHooks.callToActions.map((cta, index) => (
                      <Badge key={index} variant="default" className="block w-full text-left p-2 h-auto">
                        {cta}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Keywords SEO/SEM
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">SEO Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {contentHooks.seoKeywords.map((keyword, index) => (
                        <Badge key={index} variant="outline">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">SEM Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {contentHooks.semKeywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Content Hacks
                </CardTitle>
                <CardDescription>Técnicas avanzadas para maximizar el alcance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {contentHooks.contentHacks.map((hack, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <p className="text-sm">{hack}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};