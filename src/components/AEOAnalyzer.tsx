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
  Bot, Sparkles, CheckCircle2, XCircle, AlertTriangle,
  MessageSquare, Zap, Brain, Target, Lightbulb, Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AEOAnalysis {
  id: string;
  content: string;
  topic: string;
  overallScore: number;
  aiReadinessScore: number;
  structureAnalysis: {
    score: number;
    hasDirectAnswers: boolean;
    hasClearStructure: boolean;
    hasFactualClaims: boolean;
    suggestions: string[];
  };
  questionOptimization: {
    score: number;
    targetQuestions: string[];
    missingQuestions: string[];
  };
  contentQuality: {
    score: number;
    authoritySignals: string[];
    missingSignals: string[];
    citationOpportunities: string[];
  };
  snippetOptimization: {
    score: number;
    potentialSnippets: { type: string; content: string; question: string }[];
    improvements: string[];
  };
  voiceSearchOptimization: {
    score: number;
    conversationalKeywords: string[];
    longTailQueries: string[];
  };
  entityOptimization: {
    entities: { name: string; type: string; confidence: number }[];
    missingEntities: string[];
  };
  recommendations: { priority: 'high' | 'medium' | 'low'; action: string; impact: string }[];
  createdAt: Date;
}

export const AEOAnalyzer = () => {
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  const [targetQuestions, setTargetQuestions] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AEOAnalysis | null>(null);
  const { toast } = useToast();

  const analyzeContent = async () => {
    if (!content.trim()) {
      toast({
        title: "Contenido requerido",
        description: "Por favor ingresa contenido para analizar",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('aeo-analyzer', {
        body: { 
          content, 
          topic, 
          targetQuestions: targetQuestions.split('\n').filter(q => q.trim()) 
        }
      });

      if (error) throw error;

      const newAnalysis: AEOAnalysis = {
        id: crypto.randomUUID(),
        content,
        topic,
        overallScore: data.overallScore,
        aiReadinessScore: data.aiReadinessScore,
        structureAnalysis: data.structureAnalysis,
        questionOptimization: data.questionOptimization,
        contentQuality: data.contentQuality,
        snippetOptimization: data.snippetOptimization,
        voiceSearchOptimization: data.voiceSearchOptimization,
        entityOptimization: data.entityOptimization,
        recommendations: data.recommendations,
        createdAt: new Date()
      };

      setAnalysis(newAnalysis);
      toast({ title: "Análisis completado", description: "El análisis AEO ha sido generado" });
    } catch (error) {
      console.error('Error analyzing AEO:', error);
      toast({
        title: "Error",
        description: "No se pudo realizar el análisis. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado", description: "Texto copiado al portapapeles" });
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            Analizador AEO (AI Engine Optimization)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Optimiza tu contenido para aparecer en respuestas de IA como ChatGPT, Perplexity, Claude y Gemini
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tema principal</Label>
            <Input
              placeholder="Ej: Marketing de contenidos para PYMES"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Contenido a analizar</Label>
            <Textarea
              placeholder="Pega aquí tu artículo, página web o contenido que quieres optimizar para IA..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Preguntas objetivo (una por línea, opcional)</Label>
            <Textarea
              placeholder="¿Qué es marketing de contenidos?&#10;¿Cómo crear una estrategia de contenido?&#10;¿Cuáles son los beneficios del marketing de contenidos?"
              value={targetQuestions}
              onChange={(e) => setTargetQuestions(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <Button 
            onClick={analyzeContent} 
            disabled={isAnalyzing || !content.trim()}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Analizando para IA...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Analizar Optimización para IA
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <>
          {/* Score Overview */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}
                  </div>
                  <p className="text-muted-foreground mt-2">Puntuación AEO General</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getScoreColor(analysis.aiReadinessScore)}`}>
                    {analysis.aiReadinessScore}
                  </div>
                  <p className="text-muted-foreground mt-2">Preparación para IA</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Score Breakdown */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-32 text-sm">Estructura</div>
                  <Progress value={analysis.structureAnalysis.score} className="flex-1" />
                  <span className={`w-12 text-right ${getScoreColor(analysis.structureAnalysis.score)}`}>
                    {analysis.structureAnalysis.score}%
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 text-sm">Preguntas</div>
                  <Progress value={analysis.questionOptimization.score} className="flex-1" />
                  <span className={`w-12 text-right ${getScoreColor(analysis.questionOptimization.score)}`}>
                    {analysis.questionOptimization.score}%
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 text-sm">Calidad</div>
                  <Progress value={analysis.contentQuality.score} className="flex-1" />
                  <span className={`w-12 text-right ${getScoreColor(analysis.contentQuality.score)}`}>
                    {analysis.contentQuality.score}%
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 text-sm">Snippets</div>
                  <Progress value={analysis.snippetOptimization.score} className="flex-1" />
                  <span className={`w-12 text-right ${getScoreColor(analysis.snippetOptimization.score)}`}>
                    {analysis.snippetOptimization.score}%
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 text-sm">Voz/Búsqueda</div>
                  <Progress value={analysis.voiceSearchOptimization.score} className="flex-1" />
                  <span className={`w-12 text-right ${getScoreColor(analysis.voiceSearchOptimization.score)}`}>
                    {analysis.voiceSearchOptimization.score}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis Tabs */}
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="structure">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="structure" className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    <span className="hidden sm:inline">Estructura</span>
                  </TabsTrigger>
                  <TabsTrigger value="questions" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">Preguntas</span>
                  </TabsTrigger>
                  <TabsTrigger value="snippets" className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    <span className="hidden sm:inline">Snippets</span>
                  </TabsTrigger>
                  <TabsTrigger value="entities" className="flex items-center gap-1">
                    <Brain className="h-4 w-4" />
                    <span className="hidden sm:inline">Entidades</span>
                  </TabsTrigger>
                  <TabsTrigger value="actions" className="flex items-center gap-1">
                    <Lightbulb className="h-4 w-4" />
                    <span className="hidden sm:inline">Acciones</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="structure" className="mt-4 space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {analysis.structureAnalysis.hasDirectAnswers ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="font-medium">Respuestas Directas</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        El contenido incluye respuestas claras y concisas a preguntas comunes
                      </p>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {analysis.structureAnalysis.hasClearStructure ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="font-medium">Estructura Clara</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Usa encabezados, listas y párrafos bien organizados
                      </p>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {analysis.structureAnalysis.hasFactualClaims ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="font-medium">Datos Factuales</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Incluye datos, estadísticas y hechos verificables
                      </p>
                    </Card>
                  </div>

                  {analysis.structureAnalysis.suggestions.length > 0 && (
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm">Sugerencias de Mejora</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.structureAnalysis.suggestions.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="questions" className="mt-4 space-y-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Preguntas que tu contenido responde</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.questionOptimization.targetQuestions.map((q, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-green-500/10 rounded-lg">
                            <span className="text-sm">{q}</span>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Preguntas que deberías incluir</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.questionOptimization.missingQuestions.map((q, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-red-500/10 rounded-lg">
                            <span className="text-sm">{q}</span>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(q)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="snippets" className="mt-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {analysis.snippetOptimization.potentialSnippets.map((snippet, i) => (
                        <Card key={i}>
                          <CardHeader className="py-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm">{snippet.question}</CardTitle>
                              <Badge variant="secondary">{snippet.type}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-muted p-3 rounded-lg">
                              <p className="text-sm">{snippet.content}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => copyToClipboard(snippet.content)}
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              Copiar
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="entities" className="mt-4 space-y-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Entidades Detectadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysis.entityOptimization.entities.map((entity, i) => (
                          <Badge 
                            key={i} 
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <span>{entity.name}</span>
                            <span className="text-xs opacity-60">({entity.type})</span>
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Entidades Sugeridas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysis.entityOptimization.missingEntities.map((entity, i) => (
                          <Badge key={i} variant="outline">{entity}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Keywords para Búsqueda por Voz</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysis.voiceSearchOptimization.conversationalKeywords.map((kw, i) => (
                          <Badge key={i} variant="default">{kw}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="actions" className="mt-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {analysis.recommendations.map((rec, i) => (
                        <Card key={i} className="p-4">
                          <div className="flex items-start gap-3">
                            <Badge className={`${getPriorityColor(rec.priority)} shrink-0`}>
                              {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'}
                            </Badge>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{rec.action}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Impacto: {rec.impact}
                              </p>
                            </div>
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
