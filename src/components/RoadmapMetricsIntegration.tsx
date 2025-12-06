import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  Loader2, 
  RefreshCw, 
  Link2, 
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RoadmapFeature, FeaturePriority } from '@/types/roadmap-feature';

interface ContentPerformance {
  id: string;
  platform: string;
  views: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  engagement_rate: number | null;
  measured_at: string;
}

const priorityLabels: Record<FeaturePriority, string> = {
  must_have: 'Debe Tener',
  should_have: 'Debería Tener',
  could_have: 'Podría Tener',
  wont_have: 'No Tendrá',
  backlog: 'Backlog',
};

export const RoadmapMetricsIntegration: React.FC = () => {
  const [features, setFeatures] = useState<RoadmapFeature[]>([]);
  const [performances, setPerformances] = useState<ContentPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [featuresRes, performanceRes] = await Promise.all([
        supabase
          .from('product_roadmap_features')
          .select('*')
          .eq('user_id', user.id)
          .order('priority_score', { ascending: false }),
        supabase
          .from('content_performance')
          .select('id, platform, views, likes, comments, shares, engagement_rate, measured_at')
          .eq('user_id', user.id)
          .order('measured_at', { ascending: false })
          .limit(50)
      ]);

      if (featuresRes.error) throw featuresRes.error;
      if (performanceRes.error) throw performanceRes.error;

      setFeatures((featuresRes.data as RoadmapFeature[]) || []);
      setPerformances((performanceRes.data as ContentPerformance[]) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const linkPerformance = async (featureId: string, performanceId: string | null) => {
    try {
      const { error } = await supabase
        .from('product_roadmap_features')
        .update({ linked_performance_id: performanceId })
        .eq('id', featureId);

      if (error) throw error;

      setFeatures(prev => 
        prev.map(f => 
          f.id === featureId ? { ...f, linked_performance_id: performanceId } : f
        )
      );
      toast.success(performanceId ? 'Métrica vinculada' : 'Vínculo eliminado');
    } catch (error) {
      console.error('Error linking performance:', error);
      toast.error('Error al vincular métrica');
    }
  };

  const updateEngagementImpact = async (featureId: string, impact: number) => {
    try {
      const { error } = await supabase
        .from('product_roadmap_features')
        .update({ engagement_impact: impact })
        .eq('id', featureId);

      if (error) throw error;

      setFeatures(prev => 
        prev.map(f => 
          f.id === featureId ? { ...f, engagement_impact: impact } : f
        )
      );
      toast.success('Impacto actualizado');
    } catch (error) {
      console.error('Error updating impact:', error);
      toast.error('Error al actualizar impacto');
    }
  };

  const getLinkedPerformance = (performanceId: string | null) => 
    performances.find(p => p.id === performanceId);

  const calculateAverageEngagement = () => {
    const rates = performances.filter(p => p.engagement_rate != null).map(p => p.engagement_rate!);
    return rates.length > 0 ? (rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(2) : 'N/A';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Integración con Métricas de Engagement
              </CardTitle>
              <CardDescription>
                Vincula funcionalidades con métricas de rendimiento para priorizar mejor
              </CardDescription>
            </div>
            <Button variant="outline" onClick={fetchData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refrescar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4 text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{calculateAverageEngagement()}%</p>
                <p className="text-xs text-muted-foreground">Engagement Promedio</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <Eye className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {performances.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Total Vistas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {performances.reduce((sum, p) => sum + (p.likes || 0), 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Total Likes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <Link2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {features.filter(f => f.linked_performance_id).length}
                </p>
                <p className="text-xs text-muted-foreground">Features Vinculadas</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {features.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No hay funcionalidades. Genera algunas en la pestaña "Generar IA".
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Vincular Features con Métricas</h3>
          <div className="grid gap-4">
            {features.map((feature) => {
              const linkedPerf = getLinkedPerformance(feature.linked_performance_id);
              
              return (
                <Card key={feature.id}>
                  <CardContent className="pt-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{feature.title}</h4>
                          <Badge variant="outline">{priorityLabels[feature.priority]}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                        
                        {linkedPerf && (
                          <div className="mt-3 p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-2">📊 Métricas Vinculadas ({linkedPerf.platform})</p>
                            <div className="flex flex-wrap gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" /> {linkedPerf.views || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" /> {linkedPerf.likes || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" /> {linkedPerf.comments || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <Share2 className="h-3 w-3" /> {linkedPerf.shares || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" /> {linkedPerf.engagement_rate?.toFixed(2) || 0}%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <Select
                          value={feature.linked_performance_id || 'none'}
                          onValueChange={(value) => linkPerformance(feature.id, value === 'none' ? null : value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Vincular métrica" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Sin vincular</SelectItem>
                            {performances.map((perf) => (
                              <SelectItem key={perf.id} value={perf.id}>
                                {perf.platform} - {new Date(perf.measured_at).toLocaleDateString()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select
                          value={feature.engagement_impact?.toString() || 'none'}
                          onValueChange={(value) => updateEngagementImpact(feature.id, value === 'none' ? 0 : parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Impacto previsto" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Sin impacto</SelectItem>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                              <SelectItem key={n} value={n.toString()}>
                                Impacto: {n}/10
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
