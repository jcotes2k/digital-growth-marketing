import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Hash, TrendingUp, Target, Award, Copy, Download, Lightbulb, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { HashtagResponse, HashtagCollection, Hashtag } from '@/types/hashtag';

export const HashtagGeneratorForm = () => {
  const [formData, setFormData] = useState({
    topic: '',
    platform: 'Instagram',
    numberOfHashtags: 15,
    contentType: '',
    audience: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<HashtagResponse | null>(null);
  const [collections, setCollections] = useState<HashtagCollection[]>([]);
  const { toast } = useToast();

  const platforms = [
    'Instagram',
    'Twitter/X',
    'LinkedIn',
    'TikTok',
    'Facebook',
    'YouTube',
    'Pinterest'
  ];

  const contentTypes = [
    'Post educativo',
    'Contenido promocional',
    'Story/Reels',
    'Video',
    'Infografía',
    'Testimonial',
    'Behind the scenes',
    'Tutorial',
    'Meme/Humor'
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateHashtags = async () => {
    if (!formData.topic) {
      toast({
        title: "Tema requerido",
        description: "Por favor describe el tema de tu contenido",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('hashtag-generator', {
        body: formData
      });

      if (error) throw error;

      const hashtagData = data.hashtags;
      setResult(hashtagData);

      // Save to collections
      const newCollection: HashtagCollection = {
        id: crypto.randomUUID(),
        topic: formData.topic,
        platform: formData.platform,
        hashtags: hashtagData,
        createdAt: new Date()
      };
      setCollections(prev => [newCollection, ...prev]);

      toast({
        title: "Hashtags generados",
        description: `${hashtagData.trending?.length + hashtagData.niche?.length + hashtagData.branded?.length || 0} hashtags creados exitosamente`
      });
    } catch (error) {
      console.error('Error generating hashtags:', error);
      toast({
        title: "Error",
        description: "No se pudieron generar los hashtags. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyHashtags = (hashtags: Hashtag[]) => {
    const hashtagString = hashtags.map(h => h.hashtag).join(' ');
    navigator.clipboard.writeText(hashtagString);
    toast({
      title: "Copiado",
      description: `${hashtags.length} hashtags copiados al portapapeles`
    });
  };

  const copyAllHashtags = () => {
    if (!result) return;
    const allHashtags = [
      ...(result.trending || []),
      ...(result.niche || []),
      ...(result.branded || [])
    ].map(h => h.hashtag).join(' ');
    
    navigator.clipboard.writeText(allHashtags);
    toast({
      title: "Todos copiados",
      description: "Todos los hashtags copiados al portapapeles"
    });
  };

  const downloadHashtags = () => {
    if (!result) return;

    const content = `ESTRATEGIA DE HASHTAGS - ${formData.platform}
Tema: ${formData.topic}
Generado: ${new Date().toLocaleString()}

═══════════════════════════════════════

HASHTAGS TRENDING (${result.trending?.length || 0})
${result.trending?.map(h => `${h.hashtag}\n  📊 Alcance: ${h.reach} | Competencia: ${h.competition}\n  💡 ${h.reason}`).join('\n\n') || 'N/A'}

═══════════════════════════════════════

HASHTAGS DE NICHO (${result.niche?.length || 0})
${result.niche?.map(h => `${h.hashtag}\n  📊 Alcance: ${h.reach} | Competencia: ${h.competition}\n  💡 ${h.reason}`).join('\n\n') || 'N/A'}

═══════════════════════════════════════

HASHTAGS BRANDED (${result.branded?.length || 0})
${result.branded?.map(h => `${h.hashtag}\n  📊 Alcance: ${h.reach} | Competencia: ${h.competition}\n  💡 ${h.reason}`).join('\n\n') || 'N/A'}

═══════════════════════════════════════

RECOMENDACIONES

⏰ Mejor Momento:
${result.recommendations?.bestTime || 'N/A'}

📋 Estrategia:
${result.recommendations?.strategy || 'N/A'}

💡 Tips:
${result.recommendations?.tips?.map((tip, i) => `${i + 1}. ${tip}`).join('\n') || 'N/A'}

═══════════════════════════════════════

TODOS LOS HASHTAGS:
${[...(result.trending || []), ...(result.niche || []), ...(result.branded || [])].map(h => h.hashtag).join(' ')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hashtags-${formData.platform.toLowerCase()}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getReachBadgeColor = (reach: string) => {
    switch (reach) {
      case 'alto': return 'bg-green-500';
      case 'medio': return 'bg-yellow-500';
      case 'bajo': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getCompetitionBadgeColor = (competition: string) => {
    switch (competition) {
      case 'alta': return 'bg-red-500';
      case 'media': return 'bg-orange-500';
      case 'baja': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const HashtagCard = ({ hashtags, title, icon: Icon, color }: { 
    hashtags: Hashtag[], 
    title: string, 
    icon: any, 
    color: string 
  }) => (
    <Card className={`border-l-4 ${color}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {title} ({hashtags?.length || 0})
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyHashtags(hashtags)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {hashtags?.map((item, index) => (
              <div key={index} className="space-y-2 pb-4 border-b last:border-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-lg">{item.hashtag}</span>
                  <Badge className={`${getReachBadgeColor(item.reach)} text-white`}>
                    Alcance: {item.reach}
                  </Badge>
                  <Badge className={`${getCompetitionBadgeColor(item.competition)} text-white`}>
                    Competencia: {item.competition}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.reason}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Generator Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-6 w-6" />
            Generador de Hashtags con IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Tema del Contenido *</Label>
              <Input
                id="topic"
                placeholder="Ej: Marketing digital para startups"
                value={formData.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma *</Label>
              <Select value={formData.platform} onValueChange={(value) => handleInputChange('platform', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map(platform => (
                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentType">Tipo de Contenido</Label>
              <Select value={formData.contentType} onValueChange={(value) => handleInputChange('contentType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tipo..." />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Audiencia Objetivo</Label>
              <Input
                id="audience"
                placeholder="Ej: Emprendedores, Millennials..."
                value={formData.audience}
                onChange={(e) => handleInputChange('audience', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfHashtags">Número de Hashtags: {formData.numberOfHashtags}</Label>
              <Input
                id="numberOfHashtags"
                type="range"
                min="5"
                max="30"
                value={formData.numberOfHashtags}
                onChange={(e) => handleInputChange('numberOfHashtags', parseInt(e.target.value))}
              />
            </div>
          </div>

          <Button 
            onClick={generateHashtags} 
            disabled={isGenerating || !formData.topic}
            className="w-full"
            size="lg"
          >
            {isGenerating ? 'Generando hashtags...' : 'Generar Hashtags con IA'}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-2 flex-wrap">
                <Button onClick={copyAllHashtags} variant="default">
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Todos
                </Button>
                <Button onClick={downloadHashtags} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Estrategia
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Hashtag Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <HashtagCard
              hashtags={result.trending || []}
              title="Trending"
              icon={TrendingUp}
              color="border-l-red-500"
            />
            <HashtagCard
              hashtags={result.niche || []}
              title="Nicho"
              icon={Target}
              color="border-l-blue-500"
            />
            <HashtagCard
              hashtags={result.branded || []}
              title="Branded"
              icon={Award}
              color="border-l-purple-500"
            />
          </div>

          {/* Recommendations */}
          {result.recommendations && (
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Recomendaciones Estratégicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4" />
                    <h4 className="font-semibold">Mejor Momento para Publicar</h4>
                  </div>
                  <p className="text-muted-foreground">{result.recommendations.bestTime}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Estrategia Recomendada</h4>
                  <p className="text-muted-foreground">{result.recommendations.strategy}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Tips para Maximizar Alcance</h4>
                  <ul className="space-y-2">
                    {result.recommendations.tips?.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};