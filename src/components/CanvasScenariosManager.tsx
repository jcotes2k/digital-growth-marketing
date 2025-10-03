import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { BusinessCanvas } from '@/types/business-canvas';
import { Copy, Trash2, Star, StarOff, Loader2, GitCompare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CanvasScenario {
  id: string;
  name: string;
  description: string | null;
  canvas_data: BusinessCanvas;
  is_favorite: boolean;
  created_at: string;
}

interface CanvasScenariosManagerProps {
  currentCanvas: Partial<BusinessCanvas>;
  onLoadScenario: (canvas: Partial<BusinessCanvas>) => void;
  onCompareScenarios: (scenarios: CanvasScenario[]) => void;
}

export const CanvasScenariosManager: React.FC<CanvasScenariosManagerProps> = ({
  currentCanvas,
  onLoadScenario,
  onCompareScenarios
}) => {
  const [scenarios, setScenarios] = useState<CanvasScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDescription, setSaveDescription] = useState('');
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('canvas_scenarios')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScenarios(data as unknown as CanvasScenario[]);
    } catch (err) {
      console.error('Error loading scenarios:', err);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los escenarios',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScenario = async () => {
    if (!saveName.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre del escenario es requerido',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

      const { error } = await supabase
        .from('canvas_scenarios')
        .insert({
          user_id: user.id,
          name: saveName,
          description: saveDescription || null,
          canvas_data: currentCanvas
        });

      if (error) throw error;

      toast({
        title: '✅ Escenario Guardado',
        description: `"${saveName}" ha sido guardado exitosamente`,
      });

      setSaveName('');
      setSaveDescription('');
      setShowSaveDialog(false);
      loadScenarios();
    } catch (err) {
      console.error('Error saving scenario:', err);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el escenario',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteScenario = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este escenario?')) return;

    try {
      const { error } = await supabase
        .from('canvas_scenarios')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: '🗑️ Escenario Eliminado',
        description: 'El escenario ha sido eliminado',
      });

      loadScenarios();
    } catch (err) {
      console.error('Error deleting scenario:', err);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el escenario',
        variant: 'destructive'
      });
    }
  };

  const handleToggleFavorite = async (id: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('canvas_scenarios')
        .update({ is_favorite: !currentState })
        .eq('id', id);

      if (error) throw error;
      loadScenarios();
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleToggleComparisonSelection = (id: string) => {
    setSelectedForComparison(prev => {
      if (prev.includes(id)) {
        return prev.filter(sid => sid !== id);
      } else if (prev.length < 3) {
        return [...prev, id];
      } else {
        toast({
          title: 'Límite alcanzado',
          description: 'Solo puedes comparar hasta 3 escenarios',
          variant: 'destructive'
        });
        return prev;
      }
    });
  };

  const handleCompare = () => {
    const scenariosToCompare = scenarios.filter(s => selectedForComparison.includes(s.id));
    onCompareScenarios(scenariosToCompare);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gestión de Escenarios</h3>
          <p className="text-sm text-muted-foreground">
            Guarda y compara diferentes versiones de tu canvas
          </p>
        </div>
        <div className="flex gap-2">
          {selectedForComparison.length >= 2 && (
            <Button onClick={handleCompare} variant="outline">
              <GitCompare className="w-4 h-4 mr-2" />
              Comparar ({selectedForComparison.length})
            </Button>
          )}
          <Button onClick={() => setShowSaveDialog(true)}>
            Guardar Escenario Actual
          </Button>
        </div>
      </div>

      {scenarios.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>No tienes escenarios guardados aún.</p>
            <p className="text-sm mt-2">Guarda tu canvas actual para crear tu primer escenario.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <Card key={scenario.id} className={selectedForComparison.includes(scenario.id) ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {scenario.name}
                      {scenario.is_favorite && <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />}
                    </CardTitle>
                    {scenario.description && (
                      <CardDescription className="mt-1">{scenario.description}</CardDescription>
                    )}
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {new Date(scenario.created_at).toLocaleDateString()}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onLoadScenario(scenario.canvas_data)}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Cargar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleComparisonSelection(scenario.id)}
                  >
                    <GitCompare className="w-3 h-3 mr-1" />
                    {selectedForComparison.includes(scenario.id) ? 'Deseleccionar' : 'Comparar'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleFavorite(scenario.id, scenario.is_favorite)}
                  >
                    {scenario.is_favorite ? (
                      <StarOff className="w-3 h-3" />
                    ) : (
                      <Star className="w-3 h-3" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteScenario(scenario.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Guardar Escenario</DialogTitle>
            <DialogDescription>
              Dale un nombre y descripción a este escenario para identificarlo fácilmente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="scenario-name">Nombre del Escenario *</Label>
              <Input
                id="scenario-name"
                placeholder="Ej: Modelo Conservador, Escenario Optimista..."
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="scenario-description">Descripción (opcional)</Label>
              <Textarea
                id="scenario-description"
                placeholder="Describe qué hace único a este escenario..."
                value={saveDescription}
                onChange={(e) => setSaveDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowSaveDialog(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSaveScenario} className="flex-1">
                Guardar Escenario
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};