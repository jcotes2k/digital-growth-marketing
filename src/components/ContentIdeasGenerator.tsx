import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { IntelligentContentStrategy } from '@/types/intelligent-content-strategy';
import { Lightbulb, Loader2, TrendingUp, CheckCircle2, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ContentIdea {
  id?: string;
  title: string;
  description: string;
  platform: string;
  topic: string;
  suggestedFormat: string;
  trendingScore: number;
  keywords: string[];
  used?: boolean;
}

interface ContentIdeasGeneratorProps {
  contentStrategy: Partial<IntelligentContentStrategy>;
}

export const ContentIdeasGenerator: React.FC<ContentIdeasGeneratorProps> = ({ contentStrategy }) => {
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadSavedIdeas();
  }, []);

  const loadSavedIdeas = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('content_ideas')
        .select('*')
        .eq('user_id', user.id)
        .order('trending_score', { ascending: false });

      if (error) throw error;
      if (data) {
        setIdeas(data.map(d => ({
          id: d.id,
          title: d.title,
          description: d.description,
          platform: d.platform,
          topic: d.topic,
          suggestedFormat: d.suggested_format || '',
          trendingScore: d.trending_score || 0,
          keywords: d.keywords || [],
          used: d.used
        })));
      }
    } catch (err) {
      console.error('Error loading ideas:', err);
    }
  };

  const handleGenerate = async (count: number = 10) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('content-ideas-generator', {
        body: { contentStrategy, count }
      });

      if (error) throw error;

      setIdeas(data.ideas);
      toast({
        title: '✨ Ideas Generadas',
        description: `Se generaron ${data.ideas.length} ideas de contenido`,
      });
    } catch (err) {
      console.error('Error generating ideas:', err);
      toast({
        title: 'Error',
        description: 'No se pudieron generar las ideas',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsUsed = async (ideaId: string) => {
    try {
      await supabase
        .from('content_ideas')
        .update({ used: true })
        .eq('id', ideaId);

      setIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, used: true } : i));
      
      toast({
        title: '✓ Marcada como usada',
        description: 'La idea ha sido marcada como utilizada',
      });
    } catch (err) {
      console.error('Error marking as used:', err);
    }
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = searchTerm === '' || 
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlatform = filterPlatform === 'all' || idea.platform === filterPlatform;
    
    return matchesSearch && matchesPlatform;
  });

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-primary" />
              <CardTitle>Generador Automático de Ideas</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleGenerate(5)} disabled={loading} variant="outline" size="sm">
                5 Ideas
              </Button>
              <Button onClick={() => handleGenerate(10)} disabled={loading} size="sm">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    10 Ideas
                  </>
                )}
              </Button>
            </div>
          </div>
          <CardDescription>
            La IA genera ideas de contenido basadas en tu estrategia, tendencias actuales y mejores prácticas por plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ideas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterPlatform} onValueChange={setFilterPlatform}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las plataformas</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="Twitter">Twitter</SelectItem>
                <SelectItem value="YouTube">YouTube</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredIdeas.length === 0 && !loading && (
            <div className="text-center py-12 text-muted-foreground">
              <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay ideas generadas aún</p>
              <p className="text-sm mt-2">Genera ideas automáticamente con el botón de arriba</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {filteredIdeas.map((idea, idx) => (
              <Card key={idea.id || idx} className={idea.used ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{idea.platform}</Badge>
                        <Badge variant="outline">{idea.suggestedFormat}</Badge>
                        <Badge className={getScoreColor(idea.trendingScore)}>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {idea.trendingScore}/10
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{idea.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{idea.description}</p>
                  
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Tema:</p>
                    <Badge variant="secondary">{idea.topic}</Badge>
                  </div>

                  {idea.keywords && idea.keywords.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Keywords:</p>
                      <div className="flex flex-wrap gap-1">
                        {idea.keywords.slice(0, 5).map((kw, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            #{kw}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {idea.id && !idea.used && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkAsUsed(idea.id!)}
                      className="w-full"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-2" />
                      Marcar como usada
                    </Button>
                  )}
                  {idea.used && (
                    <div className="text-xs text-muted-foreground text-center">
                      ✓ Ya utilizada
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};