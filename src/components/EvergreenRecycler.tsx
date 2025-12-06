import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Recycle, Calendar, TrendingUp, RefreshCw, Clock, Star } from "lucide-react";

interface EvergreenContent {
  id: string;
  title: string;
  originalContent: string;
  platform: string;
  originalDate: string;
  performance: {
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
  };
  recycleScore: number;
  suggestedUpdates: string[];
  bestTimeToRepost: string;
  updatedContent?: string;
}

const EvergreenRecycler = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [evergreenContent, setEvergreenContent] = useState<EvergreenContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('evergreen-recycler', {
        body: { 
          userId: user.id,
          action: 'analyze'
        }
      });

      if (error) throw error;

      setEvergreenContent(data.content || []);
      toast({
        title: "Análisis completado",
        description: `Se encontraron ${data.content?.length || 0} contenidos reciclables`,
      });
    } catch (error) {
      console.error('Error analyzing evergreen content:', error);
      toast({
        title: "Error",
        description: "No se pudo analizar el contenido",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRecycle = async () => {
    if (selectedContent.length === 0) {
      toast({
        title: "Selecciona contenido",
        description: "Elige al menos un contenido para reciclar",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('evergreen-recycler', {
        body: { 
          contentIds: selectedContent,
          action: 'recycle'
        }
      });

      if (error) throw error;

      setEvergreenContent(prev => 
        prev.map(content => {
          const updated = data.recycledContent?.find((r: any) => r.id === content.id);
          return updated ? { ...content, updatedContent: updated.updatedContent } : content;
        })
      );

      toast({
        title: "Contenido reciclado",
        description: `Se actualizaron ${selectedContent.length} contenidos`,
      });
    } catch (error) {
      console.error('Error recycling content:', error);
      toast({
        title: "Error",
        description: "No se pudo reciclar el contenido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedContent(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-orange-500";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Recycle className="h-5 w-5 text-primary" />
            Reciclador de Contenido Evergreen
            <Badge>PRO</Badge>
          </CardTitle>
          <CardDescription>
            Identifica tu mejor contenido antiguo y actualízalo automáticamente para republicar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analizando contenido histórico...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Buscar Contenido Reciclable
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {evergreenContent.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedContent.length} de {evergreenContent.length} seleccionados
            </p>
            <Button 
              onClick={handleRecycle}
              disabled={isLoading || selectedContent.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reciclando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reciclar Seleccionados
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            {evergreenContent.map((content) => (
              <Card key={content.id} className={selectedContent.includes(content.id) ? 'ring-2 ring-primary' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedContent.includes(content.id)}
                      onCheckedChange={() => toggleSelection(content.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{content.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{content.platform}</Badge>
                          <span className={`font-bold ${getScoreColor(content.recycleScore)}`}>
                            {content.recycleScore}%
                          </span>
                        </div>
                      </div>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3" />
                        Original: {content.originalDate}
                        <Clock className="h-3 w-3 ml-2" />
                        Mejor hora: {content.bestTimeToRepost}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-4 gap-2 text-center text-sm">
                    <div className="p-2 bg-muted rounded">
                      <p className="font-medium">{content.performance.likes}</p>
                      <p className="text-xs text-muted-foreground">Likes</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="font-medium">{content.performance.comments}</p>
                      <p className="text-xs text-muted-foreground">Comentarios</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="font-medium">{content.performance.shares}</p>
                      <p className="text-xs text-muted-foreground">Compartidos</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="font-medium">{content.performance.engagementRate}%</p>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Actualizaciones sugeridas:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {content.suggestedUpdates.map((update, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-primary">→</span>
                          {update}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {content.updatedContent && (
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                        ✓ Contenido actualizado:
                      </p>
                      <p className="text-sm">{content.updatedContent}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {evergreenContent.length === 0 && !isAnalyzing && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Recycle className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="font-medium">Analiza tu contenido histórico</h3>
              <p className="text-sm text-muted-foreground">
                Haz clic en "Buscar Contenido Reciclable" para encontrar tus mejores posts
                que pueden ser actualizados y republicados.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EvergreenRecycler;
