import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { BusinessCanvas } from '@/types/business-canvas';
import { Loader2, Search, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CanvasTemplate {
  id: string;
  name: string;
  business_type: string[];
  description: string;
  template: Partial<BusinessCanvas>;
  thumbnail: string;
}

interface CanvasTemplateLibraryProps {
  onSelectTemplate: (canvas: Partial<BusinessCanvas>) => void;
  onClose: () => void;
}

export const CanvasTemplateLibrary: React.FC<CanvasTemplateLibraryProps> = ({
  onSelectTemplate,
  onClose
}) => {
  const [templates, setTemplates] = useState<CanvasTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<CanvasTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<CanvasTemplate | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [searchTerm, selectedType, templates]);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('canvas_templates')
        .select('*')
        .order('name');

      if (error) throw error;

      setTemplates(data as CanvasTemplate[]);
      setFilteredTemplates(data as CanvasTemplate[]);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los templates',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(t => t.business_type.includes(selectedType));
    }

    setFilteredTemplates(filtered);
  };

  const allTypes = Array.from(new Set(templates.flatMap(t => t.business_type))).sort();

  const handleSelectTemplate = (template: CanvasTemplate) => {
    onSelectTemplate(template.template);
    toast({
      title: '✨ Template seleccionado',
      description: `"${template.name}" ha sido cargado. Puedes personalizarlo ahora.`,
    });
    onClose();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Templates de Canvas por Tipo de Negocio</h2>
        </div>
        <p className="text-muted-foreground">
          Selecciona un template predefinido según tu tipo de negocio social. Todos son totalmente personalizables.
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedType === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType(null)}
          >
            Todos los tipos
          </Button>
          {allTypes.map(type => (
            <Button
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type)}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="text-4xl">{template.thumbnail}</div>
                <div className="flex flex-wrap gap-1">
                  {template.business_type.slice(0, 2).map(type => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setPreviewTemplate(template)}
                  variant="outline"
                  className="flex-1"
                >
                  Ver detalles
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSelectTemplate(template)}
                  className="flex-1"
                >
                  Usar template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No se encontraron templates que coincidan con tu búsqueda
        </div>
      )}

      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{previewTemplate?.thumbnail}</span>
              <div>
                <DialogTitle>{previewTemplate?.name}</DialogTitle>
                <div className="flex gap-1 mt-2">
                  {previewTemplate?.business_type.map(type => (
                    <Badge key={type} variant="secondary">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <DialogDescription className="mt-4">
              {previewTemplate?.description}
            </DialogDescription>
          </DialogHeader>

          {previewTemplate && (
            <div className="space-y-4 mt-6">
              <div>
                <h4 className="font-semibold mb-2">🎯 Propuesta de Valor</h4>
                <p className="text-sm text-muted-foreground">
                  {previewTemplate.template.valueProposition}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">💡 Ventaja Diferencial</h4>
                <p className="text-sm text-muted-foreground">
                  {previewTemplate.template.differentialAdvantage}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">👥 Segmentos de Clientes</h4>
                  <p className="text-sm text-muted-foreground">
                    {previewTemplate.template.customerSegments}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">💰 Generación de Ingresos</h4>
                  <p className="text-sm text-muted-foreground">
                    {previewTemplate.template.revenueGeneration}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">🌍 Impacto Social</h4>
                  <p className="text-sm text-muted-foreground">
                    {previewTemplate.template.socialImpact}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🌱 Impacto Ambiental</h4>
                  <p className="text-sm text-muted-foreground">
                    {previewTemplate.template.environmentalImpact}
                  </p>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => {
                  handleSelectTemplate(previewTemplate);
                  setPreviewTemplate(null);
                }}
              >
                Usar este template
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};