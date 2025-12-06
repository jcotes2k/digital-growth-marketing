import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Loader2, Check, X, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { GeneratedFeature, FeatureEffort } from '@/types/roadmap-feature';

interface RoadmapFeatureGeneratorProps {
  targetAudience: string;
  onFeaturesGenerated: () => void;
}

const effortColors: Record<FeatureEffort, string> = {
  small: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  large: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  xlarge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const effortLabels: Record<FeatureEffort, string> = {
  small: 'Pequeño',
  medium: 'Mediano',
  large: 'Grande',
  xlarge: 'Muy Grande',
};

export const RoadmapFeatureGenerator: React.FC<RoadmapFeatureGeneratorProps> = ({
  targetAudience,
  onFeaturesGenerated,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [businessContext, setBusinessContext] = useState('');
  const [generatedFeatures, setGeneratedFeatures] = useState<GeneratedFeature[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<Set<number>>(new Set());

  const generateFeatures = async (count: number) => {
    setIsGenerating(true);
    setGeneratedFeatures([]);
    setSelectedFeatures(new Set());

    try {
      const { data, error } = await supabase.functions.invoke('roadmap-feature-generator', {
        body: {
          targetAudience,
          businessContext,
          featureCount: count,
        },
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      const features = data.features as GeneratedFeature[];
      setGeneratedFeatures(features);
      setSelectedFeatures(new Set(features.map((_, i) => i)));
      toast.success(`${features.length} funcionalidades generadas`);
    } catch (error) {
      console.error('Error generating features:', error);
      toast.error('Error al generar funcionalidades');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleFeature = (index: number) => {
    const newSelected = new Set(selectedFeatures);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedFeatures(newSelected);
  };

  const saveSelectedFeatures = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Debes iniciar sesión para guardar funcionalidades');
      return;
    }

    const featuresToSave = generatedFeatures.filter((_, i) => selectedFeatures.has(i));
    if (featuresToSave.length === 0) {
      toast.error('Selecciona al menos una funcionalidad');
      return;
    }

    setIsSaving(true);

    try {
      const insertData = featuresToSave.map(feature => ({
        user_id: user.id,
        title: feature.title,
        description: feature.description,
        estimated_effort: feature.estimated_effort,
        priority_score: feature.priority_score,
        tags: feature.tags,
        ai_reasoning: feature.reasoning,
        ai_generated: true,
        priority: 'backlog',
        status: 'planned',
      }));

      const { error } = await supabase
        .from('product_roadmap_features')
        .insert(insertData);

      if (error) throw error;

      toast.success(`${featuresToSave.length} funcionalidades guardadas`);
      setGeneratedFeatures([]);
      setSelectedFeatures(new Set());
      onFeaturesGenerated();
    } catch (error) {
      console.error('Error saving features:', error);
      toast.error('Error al guardar funcionalidades');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generador de Funcionalidades con IA
          </CardTitle>
          <CardDescription>
            Genera ideas de funcionalidades basadas en tu audiencia objetivo y contexto de negocio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Audiencia Objetivo</Label>
            <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-lg">
              {targetAudience || 'No especificada - completa la pestaña "¿Para quién?"'}
            </p>
          </div>

          <div>
            <Label htmlFor="business-context">Contexto Adicional del Negocio (opcional)</Label>
            <Textarea
              id="business-context"
              placeholder="Ej: Es una app de delivery de comida enfocada en opciones saludables para profesionales ocupados..."
              value={businessContext}
              onChange={(e) => setBusinessContext(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => generateFeatures(5)}
              disabled={isGenerating}
              variant="default"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              Generar 5 Features
            </Button>
            <Button
              onClick={() => generateFeatures(10)}
              disabled={isGenerating}
              variant="outline"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              Generar 10 Features
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedFeatures.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Funcionalidades Generadas ({selectedFeatures.size}/{generatedFeatures.length} seleccionadas)
            </h3>
            <Button
              onClick={saveSelectedFeatures}
              disabled={isSaving || selectedFeatures.size === 0}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Guardar Seleccionadas
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {generatedFeatures.map((feature, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all ${
                  selectedFeatures.has(index)
                    ? 'ring-2 ring-primary'
                    : 'opacity-60 hover:opacity-100'
                }`}
                onClick={() => toggleFeature(index)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                    <Checkbox
                      checked={selectedFeatures.has(index)}
                      onCheckedChange={() => toggleFeature(index)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={effortColors[feature.estimated_effort]}>
                      {effortLabels[feature.estimated_effort]}
                    </Badge>
                    <Badge variant="outline">
                      Score: {feature.priority_score}/10
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {feature.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    💡 {feature.reasoning}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
