import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ListOrdered, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RoadmapFeature, FeaturePriority } from '@/types/roadmap-feature';

interface RoadmapPrioritizerProps {
  onPrioritizationComplete: () => void;
}

const priorityColors: Record<FeaturePriority, string> = {
  must_have: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  should_have: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  could_have: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  wont_have: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  backlog: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
};

const priorityLabels: Record<FeaturePriority, string> = {
  must_have: 'Debe Tener',
  should_have: 'Debería Tener',
  could_have: 'Podría Tener',
  wont_have: 'No Tendrá',
  backlog: 'Backlog',
};

export const RoadmapPrioritizer: React.FC<RoadmapPrioritizerProps> = ({
  onPrioritizationComplete,
}) => {
  const [features, setFeatures] = useState<RoadmapFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [businessContext, setBusinessContext] = useState('');

  const fetchBacklogFeatures = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('product_roadmap_features')
        .select('*')
        .eq('user_id', user.id)
        .eq('priority', 'backlog')
        .order('created_at', { ascending: false });

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
    fetchBacklogFeatures();
  }, []);

  const prioritizeWithAI = async () => {
    if (features.length === 0) {
      toast.error('No hay funcionalidades en el backlog para priorizar');
      return;
    }

    setIsPrioritizing(true);

    try {
      const { data, error } = await supabase.functions.invoke('roadmap-prioritizer', {
        body: {
          features: features.map(f => ({
            id: f.id,
            title: f.title,
            description: f.description,
          })),
          businessContext,
        },
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      const prioritizedFeatures = data.features;

      // Update each feature in the database
      for (const pf of prioritizedFeatures) {
        const originalFeature = features.find(f => f.title === pf.title);
        if (originalFeature) {
          await supabase
            .from('product_roadmap_features')
            .update({
              priority: pf.priority,
              priority_score: pf.priority_score,
              ai_reasoning: pf.ai_reasoning,
            })
            .eq('id', originalFeature.id);
        }
      }

      toast.success('Funcionalidades priorizadas correctamente');
      fetchBacklogFeatures();
      onPrioritizationComplete();
    } catch (error) {
      console.error('Error prioritizing features:', error);
      toast.error('Error al priorizar funcionalidades');
    } finally {
      setIsPrioritizing(false);
    }
  };

  const updatePriority = async (featureId: string, newPriority: FeaturePriority) => {
    try {
      const { error } = await supabase
        .from('product_roadmap_features')
        .update({ priority: newPriority })
        .eq('id', featureId);

      if (error) throw error;

      toast.success('Prioridad actualizada');
      fetchBacklogFeatures();
      onPrioritizationComplete();
    } catch (error) {
      console.error('Error updating priority:', error);
      toast.error('Error al actualizar prioridad');
    }
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
          <CardTitle className="flex items-center gap-2">
            <ListOrdered className="h-5 w-5 text-primary" />
            Priorización MoSCoW con IA
          </CardTitle>
          <CardDescription>
            Clasifica automáticamente las funcionalidades del backlog usando el método MoSCoW
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="prioritize-context">Contexto para Priorización (opcional)</Label>
            <Textarea
              id="prioritize-context"
              placeholder="Ej: Estamos en fase MVP, el presupuesto es limitado, necesitamos lanzar en 3 meses..."
              value={businessContext}
              onChange={(e) => setBusinessContext(e.target.value)}
              className="mt-1"
              rows={2}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={prioritizeWithAI}
              disabled={isPrioritizing || features.length === 0}
            >
              {isPrioritizing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ListOrdered className="h-4 w-4 mr-2" />
              )}
              Auto-Priorizar Backlog ({features.length})
            </Button>
            <Button variant="outline" onClick={fetchBacklogFeatures}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refrescar
            </Button>
          </div>
        </CardContent>
      </Card>

      {features.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No hay funcionalidades en el backlog. Genera algunas en la pestaña "Generar IA".
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Funcionalidades en Backlog</h3>
          <div className="grid gap-4">
            {features.map((feature) => (
              <Card key={feature.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {feature.description}
                      </p>
                      {feature.ai_reasoning && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          💡 {feature.ai_reasoning}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={priorityColors[feature.priority]}>
                        {priorityLabels[feature.priority]}
                      </Badge>
                      <div className="flex flex-wrap gap-1">
                        {(['must_have', 'should_have', 'could_have', 'wont_have'] as FeaturePriority[]).map((p) => (
                          <Button
                            key={p}
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => updatePriority(feature.id, p)}
                          >
                            {priorityLabels[p]}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
