import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  GanttChart, 
  Loader2, 
  RefreshCw, 
  GripVertical,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RoadmapFeature, FeaturePriority, FeatureStatus, FeatureEffort } from '@/types/roadmap-feature';

const priorityColumns: { id: FeaturePriority; label: string; color: string }[] = [
  { id: 'must_have', label: 'Debe Tener', color: 'border-red-500 bg-red-50 dark:bg-red-950/30' },
  { id: 'should_have', label: 'Debería Tener', color: 'border-orange-500 bg-orange-50 dark:bg-orange-950/30' },
  { id: 'could_have', label: 'Podría Tener', color: 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' },
  { id: 'wont_have', label: 'No Tendrá', color: 'border-gray-500 bg-gray-50 dark:bg-gray-950/30' },
];

const statusIcons: Record<FeatureStatus, React.ReactNode> = {
  planned: <Clock className="h-3 w-3" />,
  in_progress: <Loader2 className="h-3 w-3 animate-spin" />,
  completed: <CheckCircle className="h-3 w-3" />,
  cancelled: <XCircle className="h-3 w-3" />,
};

const statusLabels: Record<FeatureStatus, string> = {
  planned: 'Planificado',
  in_progress: 'En Progreso',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

const effortBadgeColors: Record<FeatureEffort, string> = {
  small: 'bg-green-500',
  medium: 'bg-yellow-500',
  large: 'bg-orange-500',
  xlarge: 'bg-red-500',
};

export const RoadmapTimeline: React.FC = () => {
  const [features, setFeatures] = useState<RoadmapFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedFeature, setDraggedFeature] = useState<RoadmapFeature | null>(null);

  const fetchFeatures = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('product_roadmap_features')
        .select('*')
        .eq('user_id', user.id)
        .neq('priority', 'backlog')
        .order('priority_score', { ascending: false });

      if (error) throw error;
      setFeatures((data as RoadmapFeature[]) || []);
    } catch (error) {
      console.error('Error fetching features:', error);
      toast.error('Error al cargar funcionalidades');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleDragStart = (e: React.DragEvent, feature: RoadmapFeature) => {
    setDraggedFeature(feature);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetPriority: FeaturePriority) => {
    e.preventDefault();
    if (!draggedFeature || draggedFeature.priority === targetPriority) {
      setDraggedFeature(null);
      return;
    }

    try {
      const { error } = await supabase
        .from('product_roadmap_features')
        .update({ priority: targetPriority })
        .eq('id', draggedFeature.id);

      if (error) throw error;

      setFeatures(prev => 
        prev.map(f => 
          f.id === draggedFeature.id ? { ...f, priority: targetPriority } : f
        )
      );
      toast.success('Prioridad actualizada');
    } catch (error) {
      console.error('Error updating priority:', error);
      toast.error('Error al actualizar prioridad');
    } finally {
      setDraggedFeature(null);
    }
  };

  const updateStatus = async (featureId: string, newStatus: FeatureStatus) => {
    try {
      const { error } = await supabase
        .from('product_roadmap_features')
        .update({ status: newStatus })
        .eq('id', featureId);

      if (error) throw error;

      setFeatures(prev => 
        prev.map(f => 
          f.id === featureId ? { ...f, status: newStatus } : f
        )
      );
      toast.success('Estado actualizado');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error al actualizar estado');
    }
  };

  const getFeaturesByPriority = (priority: FeaturePriority) => 
    features.filter(f => f.priority === priority);

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
                <GanttChart className="h-5 w-5 text-primary" />
                Timeline Visual del Roadmap
              </CardTitle>
              <CardDescription>
                Arrastra y suelta las funcionalidades entre columnas para reorganizar prioridades
              </CardDescription>
            </div>
            <Button variant="outline" onClick={fetchFeatures}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refrescar
            </Button>
          </div>
        </CardHeader>
      </Card>

      {features.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No hay funcionalidades priorizadas. Usa el priorizador IA para clasificar las del backlog.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {priorityColumns.map((column) => (
            <div
              key={column.id}
              className={`rounded-lg border-t-4 ${column.color} p-4 min-h-[400px]`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <h3 className="font-semibold mb-4 text-center">
                {column.label}
                <Badge variant="outline" className="ml-2">
                  {getFeaturesByPriority(column.id).length}
                </Badge>
              </h3>
              
              <div className="space-y-3">
                {getFeaturesByPriority(column.id).map((feature) => (
                  <Card
                    key={feature.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, feature)}
                    className={`cursor-move hover:shadow-md transition-shadow ${
                      draggedFeature?.id === feature.id ? 'opacity-50' : ''
                    }`}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{feature.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {feature.description}
                          </p>
                          
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {feature.estimated_effort && (
                              <div 
                                className={`w-2 h-2 rounded-full ${effortBadgeColors[feature.estimated_effort]}`}
                                title={`Esfuerzo: ${feature.estimated_effort}`}
                              />
                            )}
                            <Badge 
                              variant="outline" 
                              className="text-xs cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                const statuses: FeatureStatus[] = ['planned', 'in_progress', 'completed', 'cancelled'];
                                const currentIndex = statuses.indexOf(feature.status);
                                const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                                updateStatus(feature.id, nextStatus);
                              }}
                            >
                              {statusIcons[feature.status]}
                              <span className="ml-1">{statusLabels[feature.status]}</span>
                            </Badge>
                            {feature.engagement_impact && (
                              <Badge variant="secondary" className="text-xs">
                                📈 {feature.engagement_impact}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
