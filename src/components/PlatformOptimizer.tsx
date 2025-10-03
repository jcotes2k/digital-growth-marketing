import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { IntelligentContentStrategy } from '@/types/intelligent-content-strategy';
import { Zap, Loader2, Copy, TrendingUp, Clock, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PlatformOptimization {
  platform: string;
  optimizedContent: string;
  hashtags: string[];
  optimalLength: number;
  bestPostingTime: string;
  engagementPrediction: number;
  tips: string[];
}

interface PlatformOptimizerProps {
  contentStrategy: Partial<IntelligentContentStrategy>;
}

const platforms = ['Instagram', 'TikTok', 'LinkedIn', 'Facebook', 'Twitter', 'YouTube'];

export const PlatformOptimizer: React.FC<PlatformOptimizerProps> = ({ contentStrategy }) => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Instagram', 'LinkedIn']);
  const [optimizations, setOptimizations] = useState<PlatformOptimization[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleOptimize = async () => {
    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa contenido para optimizar',
        variant: 'destructive'
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: 'Error',
        description: 'Selecciona al menos una plataforma',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('platform-optimizer', {
        body: {
          content,
          platforms: selectedPlatforms,
          contentStrategy
        }
      });

      if (error) throw error;

      setOptimizations(data.optimizations);
      toast({
        title: '✨ Contenido Optimizado',
        description: `Se optimizó para ${data.optimizations.length} plataformas`,
      });
    } catch (err) {
      console.error('Error optimizing content:', err);
      toast({
        title: 'Error',
        description: 'No se pudo optimizar el contenido',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: '📋 Copiado',
      description: 'Contenido copiado al portapapeles',
    });
  };

  const handleTogglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const getPredictionColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            <CardTitle>Optimizador por Plataforma</CardTitle>
          </div>
          <CardDescription>
            Adapta automáticamente tu contenido para cada red social con IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="content">Contenido Base</Label>
            <Textarea
              id="content"
              placeholder="Escribe tu contenido base aquí... La IA lo adaptará para cada plataforma seleccionada"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {content.length} caracteres
            </p>
          </div>

          <div>
            <Label className="mb-3 block">Plataformas a Optimizar</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {platforms.map(platform => (
                <div key={platform} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform}
                    checked={selectedPlatforms.includes(platform)}
                    onCheckedChange={() => handleTogglePlatform(platform)}
                  />
                  <Label htmlFor={platform} className="cursor-pointer">
                    {platform}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleOptimize} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Optimizando para {selectedPlatforms.length} plataformas...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Optimizar Contenido
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {optimizations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Resultados de Optimización</h3>
          {optimizations.map((opt) => (
            <Card key={opt.platform}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{opt.platform}</CardTitle>
                    <Badge className={getPredictionColor(opt.engagementPrediction)}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {opt.engagementPrediction}/10 engagement
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(opt.optimizedContent)}
                  >
                    <Copy className="w-3 h-3 mr-2" />
                    Copiar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Contenido Optimizado</Label>
                  <div className="mt-2 p-4 bg-muted rounded-lg">
                    <p className="whitespace-pre-wrap">{opt.optimizedContent}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {opt.optimalLength} caracteres
                  </p>
                </div>

                {opt.hashtags && opt.hashtags.length > 0 && (
                  <div>
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      Hashtags Sugeridos
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {opt.hashtags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <Alert>
                    <Clock className="w-4 h-4" />
                    <AlertDescription>
                      <strong>Mejor horario:</strong><br />
                      {opt.bestPostingTime}
                    </AlertDescription>
                  </Alert>
                </div>

                {opt.tips && opt.tips.length > 0 && (
                  <div>
                    <Label className="text-xs text-muted-foreground">💡 Tips Adicionales</Label>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {opt.tips.map((tip, idx) => (
                        <li key={idx}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};