import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, TrendingUp, Clock, Target, Lightbulb, Award, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface TrendsAnalysisProps {
  metrics: any[];
  comparisons: any[];
}

interface Insight {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

interface Prediction {
  contentType: string;
  expectedEngagement: string;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
}

interface Recommendation {
  action: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  expectedImpact: string;
}

interface BestTimes {
  daysOfWeek: string[];
  timeRanges: string[];
  reasoning: string;
}

interface TopPerformers {
  contentStyles: string[];
  platforms: string[];
  characteristics: string[];
}

interface Analysis {
  keyInsights: Insight[];
  predictions: Prediction[];
  recommendations: Recommendation[];
  bestTimes: BestTimes;
  topPerformers: TopPerformers;
}

export const TrendsAnalysis = ({ metrics, comparisons }: TrendsAnalysisProps) => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('trends-analyzer', {
        body: {
          metricsData: metrics,
          comparisons: comparisons,
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysis(data.analysis);
      toast({
        title: "Análisis completado",
        description: "IA ha generado insights y predicciones basadas en tus métricas",
      });
    } catch (error: any) {
      console.error('Error analyzing trends:', error);
      
      let errorMessage = 'No se pudo completar el análisis';
      if (error.message?.includes('429') || error.message?.includes('Límite')) {
        errorMessage = 'Límite de solicitudes excedido. Intenta en unos minutos.';
      } else if (error.message?.includes('402') || error.message?.includes('Créditos')) {
        errorMessage = 'Créditos agotados. Añade créditos en Settings → Workspace → Usage.';
      }

      toast({
        title: "Error al analizar",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200';
    }
  };

  if (metrics.length === 0) {
    return (
      <Card>
        <CardContent className="min-h-[400px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No hay datos suficientes para análisis</p>
            <p className="text-sm mt-2">Agrega métricas de rendimiento en A/B Testing primero</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Análisis de Tendencias con IA</h2>
          <p className="text-muted-foreground mt-1">
            Predicciones y recomendaciones basadas en tus métricas
          </p>
        </div>
        <Button onClick={analyzeWithAI} disabled={isAnalyzing}>
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analizando...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Analizar con IA
            </>
          )}
        </Button>
      </div>

      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertTitle>Análisis impulsado por IA</AlertTitle>
        <AlertDescription>
          Usa Gemini 2.5 Flash para identificar patrones, predecir rendimiento y generar recomendaciones personalizadas.
          <br />
          <span className="text-xs text-muted-foreground">
            ✨ Todos los modelos Gemini son GRATIS hasta el 6 de octubre de 2025
          </span>
        </AlertDescription>
      </Alert>

      {!analysis && !isAnalyzing && (
        <Card>
          <CardContent className="min-h-[400px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Haz clic en "Analizar con IA" para generar insights</p>
              <p className="text-sm mt-2">La IA analizará {metrics.length} métricas de rendimiento</p>
            </div>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <>
          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Insights Principales
              </CardTitle>
              <CardDescription>Patrones y tendencias identificadas por IA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.keyInsights.map((insight, idx) => (
                <div key={idx} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{insight.title}</h4>
                    <Badge className={getImpactColor(insight.impact)}>
                      {insight.impact === 'high' ? 'Alto impacto' : insight.impact === 'medium' ? 'Impacto medio' : 'Bajo impacto'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Predictions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Predicciones de Rendimiento
              </CardTitle>
              <CardDescription>Qué esperar de diferentes tipos de contenido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.predictions.map((prediction, idx) => (
                <div key={idx} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{prediction.contentType}</h4>
                    <Badge className={getConfidenceColor(prediction.confidence)}>
                      {prediction.confidence === 'high' ? 'Alta confianza' : prediction.confidence === 'medium' ? 'Confianza media' : 'Baja confianza'}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-primary mb-1">
                    Engagement esperado: {prediction.expectedEngagement}
                  </p>
                  <p className="text-sm text-muted-foreground">{prediction.reasoning}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Recomendaciones Accionables
              </CardTitle>
              <CardDescription>Pasos concretos para mejorar tu estrategia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.recommendations.map((rec, idx) => (
                <div key={idx} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{rec.action}</h4>
                    <Badge variant={rec.priority === 'high' ? 'default' : 'secondary'}>
                      {rec.priority === 'high' ? '⚡ Prioridad alta' : rec.priority === 'medium' ? 'Prioridad media' : 'Prioridad baja'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{rec.reason}</p>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    💡 Impacto esperado: {rec.expectedImpact}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Best Times */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Mejores Momentos para Publicar
              </CardTitle>
              <CardDescription>Optimiza el timing de tus publicaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Días recomendados
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.bestTimes.daysOfWeek.map((day, idx) => (
                    <Badge key={idx} variant="secondary">{day}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horarios óptimos
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.bestTimes.timeRanges.map((time, idx) => (
                    <Badge key={idx} variant="outline">{time}</Badge>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">{analysis.bestTimes.reasoning}</p>
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Elementos de Mayor Rendimiento
              </CardTitle>
              <CardDescription>Qué está funcionando mejor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">🎨 Estilos de contenido top</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.topPerformers.contentStyles.map((style, idx) => (
                    <Badge key={idx} variant="default">{style}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">📱 Plataformas más efectivas</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.topPerformers.platforms.map((platform, idx) => (
                    <Badge key={idx} variant="secondary">{platform}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">✨ Características ganadoras</h4>
                <ul className="space-y-1">
                  {analysis.topPerformers.characteristics.map((char, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="text-primary">•</span>
                      {char}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
