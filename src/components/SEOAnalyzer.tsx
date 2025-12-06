import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, Sparkles, CheckCircle2, XCircle, AlertTriangle, 
  FileText, Link2, Image, Type, BarChart3, Lightbulb 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SEOAnalysis {
  id: string;
  url?: string;
  content: string;
  overallScore: number;
  titleAnalysis: {
    score: number;
    length: number;
    hasKeyword: boolean;
    suggestions: string[];
  };
  metaAnalysis: {
    score: number;
    length: number;
    hasKeyword: boolean;
    suggestions: string[];
  };
  contentAnalysis: {
    score: number;
    wordCount: number;
    keywordDensity: number;
    readabilityScore: number;
    headingsCount: number;
    suggestions: string[];
  };
  technicalSEO: {
    score: number;
    issues: { type: 'error' | 'warning' | 'info'; message: string }[];
  };
  keywords: {
    primary: string;
    secondary: string[];
    lsiKeywords: string[];
  };
  competitors: {
    averageWordCount: number;
    suggestedWordCount: number;
    topKeywords: string[];
  };
  recommendations: string[];
  createdAt: Date;
}

export const SEOAnalyzer = () => {
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const { toast } = useToast();

  const analyzeContent = async () => {
    if (!content.trim() && !url.trim()) {
      toast({
        title: "Contenido requerido",
        description: "Por favor ingresa contenido o una URL para analizar",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('seo-analyzer', {
        body: { content, url, targetKeyword }
      });

      if (error) throw error;

      const newAnalysis: SEOAnalysis = {
        id: crypto.randomUUID(),
        url,
        content,
        overallScore: data.overallScore,
        titleAnalysis: data.titleAnalysis,
        metaAnalysis: data.metaAnalysis,
        contentAnalysis: data.contentAnalysis,
        technicalSEO: data.technicalSEO,
        keywords: data.keywords,
        competitors: data.competitors,
        recommendations: data.recommendations,
        createdAt: new Date()
      };

      setAnalysis(newAnalysis);
      toast({ title: "Análisis completado", description: "El análisis SEO ha sido generado" });
    } catch (error) {
      console.error('Error analyzing SEO:', error);
      toast({
        title: "Error",
        description: "No se pudo realizar el análisis. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-6 w-6" />
            Analizador SEO
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>URL del sitio (opcional)</Label>
            <Input
              placeholder="https://ejemplo.com/articulo"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Contenido a analizar</Label>
            <Textarea
              placeholder="Pega aquí el contenido de tu página o artículo..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Keyword objetivo</Label>
            <Input
              placeholder="Ej: marketing digital"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
            />
          </div>

          <Button 
            onClick={analyzeContent} 
            disabled={isAnalyzing || (!content.trim() && !url.trim())}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Analizar SEO
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <>
          {/* Overall Score Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}
                  </div>
                  <p className="text-muted-foreground mt-2">Puntuación SEO</p>
                </div>
                <div className="flex-1 max-w-md">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Título</span>
                      <span className={getScoreColor(analysis.titleAnalysis.score)}>{analysis.titleAnalysis.score}%</span>
                    </div>
                    <Progress value={analysis.titleAnalysis.score} className="h-2" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Meta Description</span>
                      <span className={getScoreColor(analysis.metaAnalysis.score)}>{analysis.metaAnalysis.score}%</span>
                    </div>
                    <Progress value={analysis.metaAnalysis.score} className="h-2" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Contenido</span>
                      <span className={getScoreColor(analysis.contentAnalysis.score)}>{analysis.contentAnalysis.score}%</span>
                    </div>
                    <Progress value={analysis.contentAnalysis.score} className="h-2" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>SEO Técnico</span>
                      <span className={getScoreColor(analysis.technicalSEO.score)}>{analysis.technicalSEO.score}%</span>
                    </div>
                    <Progress value={analysis.technicalSEO.score} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="content">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="content" className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Contenido</span>
                  </TabsTrigger>
                  <TabsTrigger value="technical" className="flex items-center gap-1">
                    <Link2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Técnico</span>
                  </TabsTrigger>
                  <TabsTrigger value="keywords" className="flex items-center gap-1">
                    <Type className="h-4 w-4" />
                    <span className="hidden sm:inline">Keywords</span>
                  </TabsTrigger>
                  <TabsTrigger value="competitors" className="flex items-center gap-1">
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Competencia</span>
                  </TabsTrigger>
                  <TabsTrigger value="recommendations" className="flex items-center gap-1">
                    <Lightbulb className="h-4 w-4" />
                    <span className="hidden sm:inline">Mejoras</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="mt-4 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span>Análisis del Título</span>
                          <Badge className={getScoreBg(analysis.titleAnalysis.score)}>
                            {analysis.titleAnalysis.score}%
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Longitud</span>
                          <Badge variant={analysis.titleAnalysis.length >= 50 && analysis.titleAnalysis.length <= 60 ? "default" : "secondary"}>
                            {analysis.titleAnalysis.length} caracteres
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Contiene keyword</span>
                          {analysis.titleAnalysis.hasKeyword ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        {analysis.titleAnalysis.suggestions.length > 0 && (
                          <div className="mt-2 pt-2 border-t">
                            <p className="text-xs text-muted-foreground mb-1">Sugerencias:</p>
                            <ul className="text-xs space-y-1">
                              {analysis.titleAnalysis.suggestions.map((s, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <span className="text-yellow-500">•</span> {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span>Meta Description</span>
                          <Badge className={getScoreBg(analysis.metaAnalysis.score)}>
                            {analysis.metaAnalysis.score}%
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Longitud</span>
                          <Badge variant={analysis.metaAnalysis.length >= 120 && analysis.metaAnalysis.length <= 160 ? "default" : "secondary"}>
                            {analysis.metaAnalysis.length} caracteres
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Contiene keyword</span>
                          {analysis.metaAnalysis.hasKeyword ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span>Análisis del Contenido</span>
                        <Badge className={getScoreBg(analysis.contentAnalysis.score)}>
                          {analysis.contentAnalysis.score}%
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">{analysis.contentAnalysis.wordCount}</div>
                          <div className="text-xs text-muted-foreground">Palabras</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">{analysis.contentAnalysis.keywordDensity}%</div>
                          <div className="text-xs text-muted-foreground">Densidad Keyword</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">{analysis.contentAnalysis.readabilityScore}</div>
                          <div className="text-xs text-muted-foreground">Legibilidad</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">{analysis.contentAnalysis.headingsCount}</div>
                          <div className="text-xs text-muted-foreground">Encabezados</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="technical" className="mt-4">
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {analysis.technicalSEO.issues.map((issue, index) => (
                        <Card key={index} className="p-3">
                          <div className="flex items-start gap-3">
                            {getIssueIcon(issue.type)}
                            <p className="text-sm">{issue.message}</p>
                          </div>
                        </Card>
                      ))}
                      {analysis.technicalSEO.issues.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                          <p>No se encontraron problemas técnicos</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="keywords" className="mt-4 space-y-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Keyword Principal</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className="text-lg px-4 py-2">{analysis.keywords.primary}</Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Keywords Secundarias</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keywords.secondary.map((kw, i) => (
                          <Badge key={i} variant="secondary">{kw}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">LSI Keywords (Relacionadas)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keywords.lsiKeywords.map((kw, i) => (
                          <Badge key={i} variant="outline">{kw}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="competitors" className="mt-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-3xl font-bold">{analysis.competitors.averageWordCount}</div>
                        <p className="text-sm text-muted-foreground">Promedio competencia</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-3xl font-bold text-primary">{analysis.competitors.suggestedWordCount}</div>
                        <p className="text-sm text-muted-foreground">Palabras sugeridas</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm font-medium mb-2">Top Keywords</p>
                        <div className="flex flex-wrap gap-1">
                          {analysis.competitors.topKeywords.map((kw, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{kw}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="recommendations" className="mt-4">
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {analysis.recommendations.map((rec, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium shrink-0">
                              {index + 1}
                            </div>
                            <p className="text-sm">{rec}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
