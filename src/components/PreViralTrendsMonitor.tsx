import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Flame, Clock, TrendingUp, Zap, Globe, Hash, ArrowUpRight } from "lucide-react";

interface EmergingTrend {
  id: string;
  topic: string;
  category: string;
  currentMentions: number;
  growthRate: number;
  predictedPeak: string;
  viralProbability: number;
  relatedHashtags: string[];
  suggestedAngles: string[];
  platforms: string[];
  timeToAct: string;
}

const PreViralTrendsMonitor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [trends, setTrends] = useState<EmergingTrend[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  const categories = ['all', 'tecnología', 'negocios', 'entretenimiento', 'lifestyle', 'noticias'];

  const handleScan = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('pre-viral-trends', {
        body: { category: selectedCategory === 'all' ? null : selectedCategory }
      });

      if (error) throw error;

      setTrends(data.trends || []);
      toast({
        title: "Escaneo completado",
        description: `Se detectaron ${data.trends?.length || 0} tendencias emergentes`,
      });
    } catch (error) {
      console.error('Error scanning trends:', error);
      toast({
        title: "Error",
        description: "No se pudieron obtener las tendencias",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyBadge = (timeToAct: string) => {
    if (timeToAct.includes('hora')) {
      return <Badge variant="destructive" className="animate-pulse">🔥 Urgente</Badge>;
    }
    if (timeToAct.includes('día') && parseInt(timeToAct) <= 1) {
      return <Badge className="bg-orange-500">⚡ Hoy</Badge>;
    }
    return <Badge variant="secondary">📅 Próximamente</Badge>;
  };

  const getViralBadge = (probability: number) => {
    if (probability >= 80) return <Badge className="bg-green-500">Alto potencial</Badge>;
    if (probability >= 60) return <Badge variant="secondary">Potencial medio</Badge>;
    return <Badge variant="outline">En observación</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            Monitor de Tendencias Pre-Virales
            <Badge variant="secondary">24-48h adelantado</Badge>
          </CardTitle>
          <CardDescription>
            Detecta tendencias emergentes antes de que se vuelvan mainstream y aprovecha la ventana de oportunidad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="flex flex-wrap h-auto">
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat} className="capitalize">
                  {cat === 'all' ? 'Todas' : cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Button 
            onClick={handleScan} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Escaneando tendencias...
              </>
            ) : (
              <>
                <Globe className="mr-2 h-4 w-4" />
                Escanear Tendencias Emergentes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {trends.length > 0 && (
        <div className="space-y-4">
          {trends.map((trend) => (
            <Card key={trend.id} className="overflow-hidden">
              <div className={`h-1 ${trend.viralProbability >= 80 ? 'bg-green-500' : trend.viralProbability >= 60 ? 'bg-yellow-500' : 'bg-muted'}`} />
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {trend.topic}
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{trend.category}</Badge>
                      {getUrgencyBadge(trend.timeToAct)}
                      {getViralBadge(trend.viralProbability)}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-500">+{trend.growthRate}%</p>
                    <p className="text-xs text-muted-foreground">crecimiento/hora</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="p-2 bg-muted rounded">
                    <p className="font-medium">{trend.currentMentions.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Menciones actuales</p>
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <p className="font-medium">{trend.predictedPeak}</p>
                    <p className="text-xs text-muted-foreground">Pico predicho</p>
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="h-3 w-3" />
                      <p className="font-medium">{trend.timeToAct}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Tiempo para actuar</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Probabilidad de viralización</p>
                  <Progress value={trend.viralProbability} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{trend.viralProbability}% de probabilidad</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Hash className="h-4 w-4" />
                    Hashtags relacionados
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {trend.relatedHashtags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Ángulos sugeridos para contenido
                  </p>
                  <ul className="space-y-1">
                    {trend.suggestedAngles.map((angle, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">→</span>
                        {angle}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Plataformas:</p>
                  <div className="flex gap-1">
                    {trend.platforms.map((platform, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {trends.length === 0 && !isLoading && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Flame className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="font-medium">Detecta tendencias antes que nadie</h3>
              <p className="text-sm text-muted-foreground">
                Nuestro sistema analiza millones de señales para identificar
                tendencias 24-48 horas antes de que se vuelvan virales.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PreViralTrendsMonitor;
