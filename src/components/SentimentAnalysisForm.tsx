import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Brain, TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const SentimentAnalysisForm = () => {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    sentiment: string;
    score: number;
    keywords: string[];
  } | null>(null);

  const analyzeSentiment = async () => {
    if (!content.trim()) {
      toast.error("Por favor ingresa contenido para analizar");
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sentiment-analyzer', {
        body: { content, platform }
      });

      if (error) throw error;

      setAnalysis(data);
      
      // Save to database (optional, requires auth)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: dbError } = await supabase
          .from('sentiment_analysis')
          .insert([{
            user_id: user.id,
            content,
            platform,
            sentiment: data.sentiment,
            sentiment_score: data.score,
            keywords: data.keywords
          }]);

        if (dbError) console.error('Error saving analysis:', dbError);
      }
      
      toast.success("Análisis completado");
    } catch (error: any) {
      console.error('Error:', error);
      if (error.message?.includes('429')) {
        toast.error("Límite de solicitudes excedido. Intenta en unos minutos.");
      } else if (error.message?.includes('402')) {
        toast.error("Se requiere agregar créditos a tu cuenta.");
      } else {
        toast.error("Error al analizar sentimiento");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentIcon = () => {
    if (!analysis) return null;
    
    switch (analysis.sentiment) {
      case 'positive':
        return <TrendingUp className="w-6 h-6 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-6 h-6 text-red-500" />;
      default:
        return <Minus className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getSentimentColor = () => {
    if (!analysis) return 'bg-muted';
    
    switch (analysis.sentiment) {
      case 'positive':
        return 'bg-green-500/20 border-green-500';
      case 'negative':
        return 'bg-red-500/20 border-red-500';
      default:
        return 'bg-yellow-500/20 border-yellow-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Análisis de Sentimiento con IA</h3>
        <p className="text-sm text-muted-foreground">
          Analiza el tono y sentimiento de tu contenido antes de publicar
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Plataforma</Label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="TikTok">TikTok</SelectItem>
              <SelectItem value="LinkedIn">LinkedIn</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="Twitter">Twitter</SelectItem>
              <SelectItem value="YouTube">YouTube</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Contenido a analizar</Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe o pega el contenido que quieres analizar..."
            className="min-h-[150px]"
          />
        </div>

        <Button
          onClick={analyzeSentiment}
          disabled={isAnalyzing}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analizando...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Analizar Sentimiento
            </>
          )}
        </Button>
      </div>

      {analysis && (
        <Card className={`border-2 ${getSentimentColor()}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {getSentimentIcon()}
              Resultado del Análisis
            </CardTitle>
            <CardDescription>
              Sentimiento detectado: <span className="font-semibold capitalize">{analysis.sentiment}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">Score de Confianza</Label>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full ${
                      analysis.sentiment === 'positive' ? 'bg-green-500' : 
                      analysis.sentiment === 'negative' ? 'bg-red-500' : 
                      'bg-yellow-500'
                    }`}
                    style={{ width: `${analysis.score * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">
                  {(analysis.score * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {analysis.keywords.length > 0 && (
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">
                  Palabras clave detectadas
                </Label>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
