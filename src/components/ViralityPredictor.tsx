import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, TrendingUp, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";

interface ViralityPrediction {
  viralityScore: number;
  engagementPrediction: {
    likes: string;
    comments: string;
    shares: string;
  };
  strengths: string[];
  improvements: string[];
  bestPostingTime: string;
  riskFactors: string[];
  viralPotential: 'bajo' | 'medio' | 'alto' | 'viral';
}

const ViralityPredictor = () => {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<ViralityPrediction | null>(null);
  const { toast } = useToast();

  const handlePredict = async () => {
    if (!content.trim() || !platform) {
      toast({
        title: "Error",
        description: "Por favor ingresa contenido y selecciona una plataforma",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('virality-predictor', {
        body: { content, platform }
      });

      if (error) throw error;

      setPrediction(data.prediction);
      toast({
        title: "Predicción completada",
        description: `Potencial viral: ${data.prediction?.viralPotential || 'calculado'}`,
      });
    } catch (error) {
      console.error('Error predicting virality:', error);
      toast({
        title: "Error",
        description: "No se pudo analizar el contenido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getPotentialBadge = (potential: string) => {
    switch (potential) {
      case 'viral': return <Badge className="bg-green-500">🔥 Viral</Badge>;
      case 'alto': return <Badge className="bg-blue-500">📈 Alto</Badge>;
      case 'medio': return <Badge variant="secondary">📊 Medio</Badge>;
      default: return <Badge variant="outline">📉 Bajo</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Predictor de Viralidad con IA
          </CardTitle>
          <CardDescription>
            Analiza tu contenido antes de publicar para predecir su potencial de engagement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Plataforma</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona la plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="twitter">Twitter/X</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Contenido a Analizar</Label>
            <Textarea
              placeholder="Pega aquí el contenido que planeas publicar..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
            />
          </div>

          <Button 
            onClick={handlePredict} 
            disabled={isLoading || !content.trim() || !platform}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analizando viralidad...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Predecir Viralidad
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {prediction && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Puntuación de Viralidad</span>
                {getPotentialBadge(prediction.viralPotential)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <span className={`text-5xl font-bold ${getScoreColor(prediction.viralityScore)}`}>
                  {prediction.viralityScore}
                </span>
                <span className="text-2xl text-muted-foreground">/100</span>
              </div>
              <Progress value={prediction.viralityScore} className="h-3" />
              
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="p-2 bg-muted rounded">
                  <p className="font-medium">{prediction.engagementPrediction.likes}</p>
                  <p className="text-muted-foreground">Likes</p>
                </div>
                <div className="p-2 bg-muted rounded">
                  <p className="font-medium">{prediction.engagementPrediction.comments}</p>
                  <p className="text-muted-foreground">Comentarios</p>
                </div>
                <div className="p-2 bg-muted rounded">
                  <p className="font-medium">{prediction.engagementPrediction.shares}</p>
                  <p className="text-muted-foreground">Compartidos</p>
                </div>
              </div>

              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium">Mejor hora para publicar:</p>
                <p className="text-lg font-bold text-primary">{prediction.bestPostingTime}</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Fortalezas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {prediction.strengths.map((strength, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Mejoras Sugeridas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {prediction.improvements.map((improvement, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-yellow-500">→</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {prediction.riskFactors.length > 0 && (
              <Card className="border-destructive/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Factores de Riesgo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {prediction.riskFactors.map((risk, i) => (
                      <li key={i} className="text-sm flex items-start gap-2 text-destructive">
                        <span>⚠</span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViralityPredictor;
