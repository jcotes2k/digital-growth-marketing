import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Hash, Loader2, Copy, TrendingUp, Target, Award, Lightbulb, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HashtagResponse } from "@/types/hashtag";

export const HashtagGeneratorForm = () => {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [contentType, setContentType] = useState("");
  const [audience, setAudience] = useState("");
  const [numberOfHashtags, setNumberOfHashtags] = useState(15);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hashtags, setHashtags] = useState<HashtagResponse | null>(null);

  const generateHashtags = async () => {
    if (!topic.trim()) {
      toast.error("Por favor ingresa un tema");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('hashtag-generator', {
        body: { 
          topic, 
          platform, 
          numberOfHashtags,
          contentType,
          audience
        }
      });

      if (error) throw error;

      setHashtags(data.hashtags);
      toast.success("Hashtags generados exitosamente");
    } catch (error: any) {
      console.error('Error:', error);
      if (error.message?.includes('429')) {
        toast.error("Límite de solicitudes excedido. Intenta en unos minutos.");
      } else if (error.message?.includes('402')) {
        toast.error("Se requiere agregar créditos a tu cuenta.");
      } else {
        toast.error("Error al generar hashtags");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const copyHashtags = (hashtagList: any[]) => {
    const text = hashtagList.map(h => h.hashtag).join(' ');
    navigator.clipboard.writeText(text);
    toast.success("Hashtags copiados al portapapeles");
  };

  const copyAllHashtags = () => {
    if (!hashtags) return;
    const allHashtags = [
      ...hashtags.trending,
      ...hashtags.niche,
      ...hashtags.branded
    ].map(h => h.hashtag).join(' ');
    navigator.clipboard.writeText(allHashtags);
    toast.success("Todos los hashtags copiados");
  };

  const getReachColor = (reach: string) => {
    switch (reach) {
      case 'alto': return 'text-green-500';
      case 'medio': return 'text-yellow-500';
      case 'bajo': return 'text-blue-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Generador de Hashtags con IA</h3>
        <p className="text-sm text-muted-foreground">
          Genera hashtags estratégicos y optimizados para cada plataforma
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Tema/Tópico *</Label>
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ej: Marketing digital, Fitness, Comida vegana..."
          />
        </div>

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
          <Label>Tipo de contenido (opcional)</Label>
          <Input
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            placeholder="Ej: Tutorial, Review, Vlog..."
          />
        </div>

        <div className="space-y-2">
          <Label>Audiencia objetivo (opcional)</Label>
          <Input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="Ej: Emprendedores, Millennials..."
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Número de hashtags: {numberOfHashtags}</Label>
          <input
            type="range"
            min="5"
            max="30"
            value={numberOfHashtags}
            onChange={(e) => setNumberOfHashtags(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <Button
        onClick={generateHashtags}
        disabled={isGenerating}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generando hashtags...
          </>
        ) : (
          <>
            <Hash className="w-4 h-4 mr-2" />
            Generar Hashtags
          </>
        )}
      </Button>

      {hashtags && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">Hashtags Generados</h4>
            <Button variant="outline" size="sm" onClick={copyAllHashtags}>
              <Copy className="w-4 h-4 mr-2" />
              Copiar Todos
            </Button>
          </div>

          {/* Trending Hashtags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Hashtags Trending
              </CardTitle>
              <CardDescription>
                Alta popularidad y alcance potencial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {hashtags.trending.map((item, index) => (
                <div key={index} className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-primary">{item.hashtag}</span>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className={getReachColor(item.reach)}>
                        Alcance: {item.reach}
                      </Badge>
                      <Badge variant="outline">
                        Competencia: {item.competition}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.reason}</p>
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={() => copyHashtags(hashtags.trending)}>
                <Copy className="w-3 h-3 mr-2" />
                Copiar trending
              </Button>
            </CardContent>
          </Card>

          {/* Niche Hashtags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-blue-500" />
                Hashtags de Nicho
              </CardTitle>
              <CardDescription>
                Específicos de tu audiencia y tema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {hashtags.niche.map((item, index) => (
                <div key={index} className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-primary">{item.hashtag}</span>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className={getReachColor(item.reach)}>
                        Alcance: {item.reach}
                      </Badge>
                      <Badge variant="outline">
                        Competencia: {item.competition}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.reason}</p>
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={() => copyHashtags(hashtags.niche)}>
                <Copy className="w-3 h-3 mr-2" />
                Copiar nicho
              </Button>
            </CardContent>
          </Card>

          {/* Branded Hashtags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="w-5 h-5 text-purple-500" />
                Hashtags de Marca
              </CardTitle>
              <CardDescription>
                Únicos para construir comunidad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {hashtags.branded.map((item, index) => (
                <div key={index} className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-primary">{item.hashtag}</span>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className={getReachColor(item.reach)}>
                        Alcance: {item.reach}
                      </Badge>
                      <Badge variant="outline">
                        Competencia: {item.competition}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.reason}</p>
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={() => copyHashtags(hashtags.branded)}>
                <Copy className="w-3 h-3 mr-2" />
                Copiar branded
              </Button>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="w-5 h-5 text-primary" />
                Recomendaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-sm font-semibold">Mejor horario:</Label>
                </div>
                <p className="text-sm">{hashtags.recommendations.bestTime}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Estrategia:</Label>
                <p className="text-sm">{hashtags.recommendations.strategy}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Tips adicionales:</Label>
                <ul className="space-y-1">
                  {hashtags.recommendations.tips.map((tip, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
