import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Eye, Heart, MessageCircle, Share2, MousePointer, Users, Plus, Award } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface PerformanceMetric {
  id: string;
  content_id: string;
  platform: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  reach: number;
  engagement_rate: number;
  conversion_rate: number;
  notes: string;
  measured_at: string;
  content?: {
    content: string;
    style: string;
    platform: string;
  };
}

interface ContentComparison {
  style: string;
  avgViews: number;
  avgLikes: number;
  avgEngagement: number;
  totalPosts: number;
}

export const ABTestingDashboard = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [comparisons, setComparisons] = useState<ContentComparison[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addMetricOpen, setAddMetricOpen] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState('');
  const [availableContent, setAvailableContent] = useState<any[]>([]);
  const { toast } = useToast();

  const [metricForm, setMetricForm] = useState({
    platform: '',
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    clicks: 0,
    reach: 0,
    notes: '',
  });

  useEffect(() => {
    fetchMetrics();
    fetchAvailableContent();
  }, []);

  useEffect(() => {
    if (metrics.length > 0) {
      calculateComparisons();
    }
  }, [metrics]);

  const fetchAvailableContent = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setAvailableContent(data || []);
    } catch (error: any) {
      console.error('Error fetching content:', error);
    }
  };

  const fetchMetrics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: metricsData, error } = await supabase
        .from('content_performance')
        .select(`
          *,
          content:generated_content(content, style, platform)
        `)
        .order('measured_at', { ascending: false });

      if (error) throw error;
      setMetrics(metricsData || []);
    } catch (error: any) {
      console.error('Error fetching metrics:', error);
      toast({
        title: "Error al cargar métricas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateComparisons = () => {
    const styleGroups: Record<string, PerformanceMetric[]> = {};

    metrics.forEach(metric => {
      const style = metric.content?.style || 'Unknown';
      if (!styleGroups[style]) {
        styleGroups[style] = [];
      }
      styleGroups[style].push(metric);
    });

    const comparisonData: ContentComparison[] = Object.entries(styleGroups).map(([style, metrics]) => {
      const totalViews = metrics.reduce((sum, m) => sum + (m.views || 0), 0);
      const totalLikes = metrics.reduce((sum, m) => sum + (m.likes || 0), 0);
      const totalEngagement = metrics.reduce((sum, m) => sum + (m.engagement_rate || 0), 0);

      return {
        style,
        avgViews: Math.round(totalViews / metrics.length),
        avgLikes: Math.round(totalLikes / metrics.length),
        avgEngagement: parseFloat((totalEngagement / metrics.length).toFixed(2)),
        totalPosts: metrics.length,
      };
    });

    setComparisons(comparisonData.sort((a, b) => b.avgEngagement - a.avgEngagement));
  };

  const addMetric = async () => {
    if (!selectedContentId || !metricForm.platform) {
      toast({
        title: "Faltan datos",
        description: "Selecciona contenido y plataforma",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const engagementRate = metricForm.views > 0
        ? parseFloat((((metricForm.likes + metricForm.comments + metricForm.shares) / metricForm.views) * 100).toFixed(2))
        : 0;

      const conversionRate = metricForm.clicks > 0 && metricForm.views > 0
        ? parseFloat(((metricForm.clicks / metricForm.views) * 100).toFixed(2))
        : 0;

      const { error } = await supabase.from('content_performance').insert({
        user_id: user.id,
        content_id: selectedContentId,
        platform: metricForm.platform,
        views: metricForm.views,
        likes: metricForm.likes,
        comments: metricForm.comments,
        shares: metricForm.shares,
        clicks: metricForm.clicks,
        reach: metricForm.reach,
        engagement_rate: engagementRate,
        conversion_rate: conversionRate,
        notes: metricForm.notes,
      });

      if (error) throw error;

      toast({
        title: "Métrica agregada",
        description: "Los datos de rendimiento se han guardado",
      });

      setAddMetricOpen(false);
      setMetricForm({
        platform: '',
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        clicks: 0,
        reach: 0,
        notes: '',
      });
      setSelectedContentId('');
      fetchMetrics();
    } catch (error: any) {
      toast({
        title: "Error al agregar métrica",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="min-h-[400px] flex items-center justify-center">
          <p>Cargando dashboard...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Dashboard A/B Testing</h2>
          <p className="text-muted-foreground mt-1">
            Compara el rendimiento de tus variantes de contenido
          </p>
        </div>
        <Dialog open={addMetricOpen} onOpenChange={setAddMetricOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Métrica
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agregar Métricas de Rendimiento</DialogTitle>
              <DialogDescription>
                Registra el rendimiento de tu contenido publicado
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Contenido</Label>
                <Select value={selectedContentId} onValueChange={setSelectedContentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el contenido" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableContent.map(content => (
                      <SelectItem key={content.id} value={content.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{content.style}</span>
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {content.content.substring(0, 50)}...
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Plataforma</Label>
                <Select value={metricForm.platform} onValueChange={(value) => setMetricForm({ ...metricForm, platform: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Twitter">Twitter/X</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vistas</Label>
                  <Input
                    type="number"
                    value={metricForm.views}
                    onChange={(e) => setMetricForm({ ...metricForm, views: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Alcance</Label>
                  <Input
                    type="number"
                    value={metricForm.reach}
                    onChange={(e) => setMetricForm({ ...metricForm, reach: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Me gusta</Label>
                  <Input
                    type="number"
                    value={metricForm.likes}
                    onChange={(e) => setMetricForm({ ...metricForm, likes: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Comentarios</Label>
                  <Input
                    type="number"
                    value={metricForm.comments}
                    onChange={(e) => setMetricForm({ ...metricForm, comments: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Compartidos</Label>
                  <Input
                    type="number"
                    value={metricForm.shares}
                    onChange={(e) => setMetricForm({ ...metricForm, shares: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Clics</Label>
                  <Input
                    type="number"
                    value={metricForm.clicks}
                    onChange={(e) => setMetricForm({ ...metricForm, clicks: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notas (opcional)</Label>
                <Textarea
                  value={metricForm.notes}
                  onChange={(e) => setMetricForm({ ...metricForm, notes: e.target.value })}
                  placeholder="Observaciones sobre el rendimiento..."
                />
              </div>
            </div>

            <Button onClick={addMetric} className="w-full">
              Guardar Métrica
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {metrics.length === 0 ? (
        <Card>
          <CardContent className="min-h-[400px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No hay métricas registradas</p>
              <p className="text-sm mt-2">Agrega métricas de rendimiento para ver comparaciones</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Resumen de métricas */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vistas</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.reduce((sum, m) => sum + (m.views || 0), 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Promedio: {Math.round(metrics.reduce((sum, m) => sum + (m.views || 0), 0) / metrics.length).toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Interacciones</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.reduce((sum, m) => sum + (m.likes || 0) + (m.comments || 0) + (m.shares || 0), 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Likes + Comentarios + Compartidos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Promedio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(metrics.reduce((sum, m) => sum + (m.engagement_rate || 0), 0) / metrics.length).toFixed(2)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Tasa de interacción
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Publicaciones</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.length}</div>
                <p className="text-xs text-muted-foreground">
                  Contenidos medidos
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Comparación de estilos */}
          {comparisons.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Comparación de Estilos</CardTitle>
                <CardDescription>
                  Rendimiento promedio por tipo de contenido
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comparisons.map((comp, index) => (
                    <div key={comp.style} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {index === 0 && <Award className="h-5 w-5 text-yellow-500" />}
                          <div>
                            <p className="font-medium">{comp.style}</p>
                            <p className="text-xs text-muted-foreground">
                              {comp.totalPosts} publicaciones
                            </p>
                          </div>
                        </div>
                        <Badge variant={index === 0 ? "default" : "secondary"}>
                          {comp.avgEngagement}% engagement
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-muted-foreground" />
                          <span>{comp.avgViews.toLocaleString()} vistas</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3 text-muted-foreground" />
                          <span>{comp.avgLikes.toLocaleString()} likes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-muted-foreground" />
                          <span>{comp.avgEngagement}% engagement</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gráficos */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Vistas por Estilo</CardTitle>
                <CardDescription>Comparación de alcance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisons}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="style" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgViews" fill="#8b5cf6" name="Vistas promedio" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement por Estilo</CardTitle>
                <CardDescription>Tasa de interacción</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={comparisons}
                      dataKey="avgEngagement"
                      nameKey="style"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {comparisons.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Insights y recomendaciones */}
          {comparisons.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Insights y Recomendaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                  <p className="font-medium text-green-900 dark:text-green-100">
                    🏆 Mejor estilo: {comparisons[0].style}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Este estilo tiene un engagement promedio de {comparisons[0].avgEngagement}% y
                    {' '}{comparisons[0].avgViews.toLocaleString()} vistas por publicación.
                  </p>
                </div>
                
                {comparisons.length > 1 && (
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      💡 Oportunidad de mejora
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Considera usar más contenido del tipo "{comparisons[0].style}" ya que genera
                      {' '}{((comparisons[0].avgEngagement / comparisons[comparisons.length - 1].avgEngagement - 1) * 100).toFixed(0)}%
                      más engagement que "{comparisons[comparisons.length - 1].style}".
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
