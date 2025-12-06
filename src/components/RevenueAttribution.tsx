import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, DollarSign, TrendingUp, BarChart3, PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface ContentROI {
  contentId: string;
  title: string;
  platform: string;
  publishDate: string;
  metrics: {
    views: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
  roi: number;
  costPerConversion: number;
  attributionPath: string[];
}

interface RevenueOverview {
  totalRevenue: number;
  totalCost: number;
  overallROI: number;
  topPerformingContent: ContentROI[];
  revenueByPlatform: { platform: string; revenue: number; percentage: number }[];
  revenueByContentType: { type: string; revenue: number; percentage: number }[];
  monthlyTrend: { month: string; revenue: number; growth: number }[];
}

const RevenueAttribution = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [overview, setOverview] = useState<RevenueOverview | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsLoading(true);
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

      const { data, error } = await supabase.functions.invoke('revenue-attribution', {
        body: { 
          userId: user.id,
          timeRange
        }
      });

      if (error) throw error;

      setOverview(data.overview);
      toast({
        title: "Análisis completado",
        description: "Datos de atribución de revenue actualizados",
      });
    } catch (error) {
      console.error('Error analyzing revenue:', error);
      toast({
        title: "Error",
        description: "No se pudo analizar el revenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const getROIColor = (roi: number) => {
    if (roi >= 100) return "text-green-500";
    if (roi >= 50) return "text-yellow-500";
    if (roi >= 0) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Atribución de Revenue
          </CardTitle>
          <CardDescription>
            Conecta tu contenido directamente con ventas reales y mide el ROI de cada pieza
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="7d">7 días</TabsTrigger>
              <TabsTrigger value="30d">30 días</TabsTrigger>
              <TabsTrigger value="90d">90 días</TabsTrigger>
              <TabsTrigger value="1y">1 año</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button 
            onClick={handleAnalyze} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analizando atribución...
              </>
            ) : (
              <>
                <BarChart3 className="mr-2 h-4 w-4" />
                Analizar Revenue
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {overview && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Revenue Total</CardDescription>
                <CardTitle className="text-3xl text-green-500">
                  {formatCurrency(overview.totalRevenue)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span>Generado por contenido</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Inversión Total</CardDescription>
                <CardTitle className="text-3xl">
                  {formatCurrency(overview.totalCost)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span>En creación y promoción</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>ROI General</CardDescription>
                <CardTitle className={`text-3xl ${getROIColor(overview.overallROI)}`}>
                  {overview.overallROI}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress 
                  value={Math.min(overview.overallROI, 200) / 2} 
                  className="h-2"
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Revenue por Plataforma
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {overview.revenueByPlatform.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.platform}</span>
                      <span>{formatCurrency(item.revenue)}</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">
                      {item.percentage}% del total
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue por Tipo de Contenido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {overview.revenueByContentType.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.type}</span>
                      <span>{formatCurrency(item.revenue)}</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">
                      {item.percentage}% del total
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Contenido por ROI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {overview.topPerformingContent.map((content, index) => (
                  <div key={content.contentId} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <span className="font-medium">{content.title}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Badge variant="secondary">{content.platform}</Badge>
                          <span>{content.publishDate}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${getROIColor(content.roi)}`}>
                          {content.roi}% ROI
                        </p>
                        <p className="text-sm text-green-500">
                          {formatCurrency(content.metrics.revenue)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mt-3 text-center text-sm">
                      <div className="p-2 bg-muted rounded">
                        <p className="font-medium">{content.metrics.views.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Vistas</p>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <p className="font-medium">{content.metrics.clicks.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Clics</p>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <p className="font-medium">{content.metrics.conversions}</p>
                        <p className="text-xs text-muted-foreground">Conversiones</p>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <p className="font-medium">{formatCurrency(content.costPerConversion)}</p>
                        <p className="text-xs text-muted-foreground">CPA</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground">Ruta de atribución:</p>
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        {content.attributionPath.map((step, i) => (
                          <span key={i} className="flex items-center">
                            <Badge variant="outline" className="text-xs">{step}</Badge>
                            {i < content.attributionPath.length - 1 && (
                              <ArrowUpRight className="h-3 w-3 mx-1 text-muted-foreground" />
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tendencia Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {overview.monthlyTrend.map((month, index) => (
                  <div key={index} className="flex-shrink-0 p-3 bg-muted rounded-lg text-center min-w-[100px]">
                    <p className="text-sm font-medium">{month.month}</p>
                    <p className="text-lg font-bold">{formatCurrency(month.revenue)}</p>
                    <div className={`flex items-center justify-center gap-1 text-xs ${month.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {month.growth >= 0 ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {Math.abs(month.growth)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!overview && !isLoading && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="font-medium">Conecta contenido con ventas</h3>
              <p className="text-sm text-muted-foreground">
                Analiza qué contenido genera más revenue y optimiza tu estrategia
                basándote en datos reales de conversión.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RevenueAttribution;
