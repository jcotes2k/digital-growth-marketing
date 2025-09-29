import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Smile, Frown, Meh, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function SentimentAnalysisForm() {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('facebook');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      loadHistory(user.id);
    }
  };

  const loadHistory = async (userId: string) => {
    const { data } = await supabase
      .from('sentiment_analysis')
      .select('*')
      .eq('user_id', userId)
      .order('analyzed_at', { ascending: false })
      .limit(10);

    setHistory(data || []);
  };

  const handleAnalyze = async () => {
    if (!content.trim() || !user) return;

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('sentiment-analyzer', {
        body: { content, platform }
      });

      if (error) throw error;

      // Save to database
      await supabase.from('sentiment_analysis').insert({
        user_id: user.id,
        platform,
        content,
        sentiment: data.sentiment,
        sentiment_score: data.score,
        keywords: data.keywords,
      });

      setAnalysis(data);
      loadHistory(user.id);

      toast({
        title: "Análisis completado",
        description: "El sentimiento ha sido analizado exitosamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo analizar el sentimiento",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Smile className="h-8 w-8 text-green-500" />;
      case 'negative': return <Frown className="h-8 w-8 text-red-500" />;
      default: return <Meh className="h-8 w-8 text-gray-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Análisis de Sentimientos con IA</h1>
          <p className="text-muted-foreground">Analiza el sentimiento de menciones, comentarios y contenido</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Analysis Form */}
          <Card>
            <CardHeader>
              <CardTitle>Analizar Contenido</CardTitle>
              <CardDescription>Introduce el texto que deseas analizar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Pega aquí el contenido a analizar (comentarios, menciones, posts...)"
                rows={6}
              />

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !content.trim()}
                className="w-full"
              >
                {isAnalyzing ? 'Analizando...' : 'Analizar Sentimiento'}
              </Button>
            </CardContent>
          </Card>

          {/* Analysis Result */}
          <Card>
            <CardHeader>
              <CardTitle>Resultado del Análisis</CardTitle>
              <CardDescription>Sentimiento detectado y palabras clave</CardDescription>
            </CardHeader>
            <CardContent>
              {analysis ? (
                <div className="space-y-6">
                  <div className="text-center py-6">
                    {getSentimentIcon(analysis.sentiment)}
                    <h3 className="text-3xl font-bold mt-4 capitalize">{analysis.sentiment}</h3>
                    <p className="text-muted-foreground">
                      Confianza: {(analysis.score * 100).toFixed(0)}%
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Palabras Clave:</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords.map((keyword: string, idx: number) => (
                        <Badge key={idx} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <Meh className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Analiza contenido para ver los resultados aquí</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* History */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Análisis</CardTitle>
            <CardDescription>Últimos análisis realizados</CardDescription>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No hay análisis previos</p>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {getSentimentIcon(item.sentiment)}
                        <Badge className={getSentimentColor(item.sentiment)}>
                          {item.sentiment}
                        </Badge>
                        <Badge variant="outline">{item.platform}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(item.analyzed_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p>
                    {item.keywords && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.keywords.slice(0, 5).map((keyword: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}