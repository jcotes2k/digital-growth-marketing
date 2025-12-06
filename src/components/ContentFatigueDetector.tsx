import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertTriangle, TrendingDown, RefreshCw, Lightbulb, BarChart3 } from "lucide-react";

interface FatigueAnalysis {
  overallFatigueScore: number;
  topicAnalysis: {
    topic: string;
    frequency: number;
    fatigueLevel: 'bajo' | 'medio' | 'alto' | 'crítico';
    lastUsed: string;
    recommendation: string;
  }[];
  formatAnalysis: {
    format: string;
    usage: number;
    saturation: number;
  }[];
  recommendations: string[];
  pivotSuggestions: {
    fromTopic: string;
    toTopic: string;
    reason: string;
  }[];
}

const ContentFatigueDetector = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<FatigueAnalysis | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para analizar tu contenido",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('content-fatigue-detector', {
        body: { userId: user.id }
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      toast({
        title: "Análisis completado",
        description: "Se analizó tu historial de contenido",
      });
    } catch (error) {
      console.error('Error analyzing fatigue:', error);
      toast({
        title: "Error",
        description: "No se pudo analizar el contenido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFatigueColor = (level: string) => {
    switch (level) {
      case 'crítico': return 'bg-red-500';
      case 'alto': return 'bg-orange-500';
      case 'medio': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getFatigueBadge = (level: string) => {
    switch (level) {
      case 'crítico': return <Badge variant="destructive">Crítico</Badge>;
      case 'alto': return <Badge className="bg-orange-500">Alto</Badge>;
      case 'medio': return <Badge variant="secondary">Medio</Badge>;
      default: return <Badge className="bg-green-500">Bajo</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-primary" />
            Detector de Fatiga de Contenido
          </CardTitle>
          <CardDescription>
            Analiza tu historial de contenido para detectar saturación de temas y recomendar pivotes estratégicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleAnalyze} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analizando historial...
              </>
            ) : (
              <>
                <BarChart3 className="mr-2 h-4 w-4" />
                Analizar Fatiga de Contenido
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Índice General de Fatiga</span>
                <span className={`text-3xl font-bold ${analysis.overallFatigueScore > 70 ? 'text-red-500' : analysis.overallFatigueScore > 40 ? 'text-yellow-500' : 'text-green-500'}`}>
                  {analysis.overallFatigueScore}%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress 
                value={analysis.overallFatigueScore} 
                className={`h-4 ${analysis.overallFatigueScore > 70 ? '[&>div]:bg-red-500' : analysis.overallFatigueScore > 40 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}`}
              />
              <p className="text-sm text-muted-foreground mt-2">
                {analysis.overallFatigueScore > 70 
                  ? "⚠️ Tu audiencia puede estar saturada. Es momento de pivotar."
                  : analysis.overallFatigueScore > 40
                  ? "📊 Nivel moderado. Considera diversificar algunos temas."
                  : "✅ Tu contenido mantiene variedad saludable."}
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Análisis por Tema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.topicAnalysis.map((topic, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{topic.topic}</span>
                      {getFatigueBadge(topic.fatigueLevel)}
                    </div>
                    <Progress value={topic.frequency} className={`h-2 [&>div]:${getFatigueColor(topic.fatigueLevel)}`} />
                    <p className="text-xs text-muted-foreground">
                      Última vez: {topic.lastUsed}
                    </p>
                    <p className="text-xs text-primary">
                      💡 {topic.recommendation}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Sugerencias de Pivote
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.pivotSuggestions.map((pivot, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">{pivot.fromTopic}</Badge>
                      <span>→</span>
                      <Badge className="bg-primary">{pivot.toTopic}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {pivot.reason}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Recomendaciones Estratégicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-primary">→</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ContentFatigueDetector;
