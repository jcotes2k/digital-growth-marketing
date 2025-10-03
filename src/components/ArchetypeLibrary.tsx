import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { BuyerPersona } from '@/types/buyer-persona';
import { Loader2, Search, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Archetype {
  id: string;
  name: string;
  industry: string[];
  description: string;
  template: Partial<BuyerPersona>;
  thumbnail: string;
}

interface ArchetypeLibraryProps {
  onSelectArchetype: (persona: Partial<BuyerPersona>) => void;
  onClose: () => void;
}

export const ArchetypeLibrary: React.FC<ArchetypeLibraryProps> = ({ onSelectArchetype, onClose }) => {
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [filteredArchetypes, setFilteredArchetypes] = useState<Archetype[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [previewArchetype, setPreviewArchetype] = useState<Archetype | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchArchetypes();
  }, []);

  useEffect(() => {
    filterArchetypes();
  }, [searchTerm, selectedIndustry, archetypes]);

  const fetchArchetypes = async () => {
    try {
      const { data, error } = await supabase
        .from('persona_archetypes')
        .select('*')
        .order('name');

      if (error) throw error;

      setArchetypes(data as Archetype[]);
      setFilteredArchetypes(data as Archetype[]);
    } catch (error) {
      console.error('Error fetching archetypes:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los arquetipos',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterArchetypes = () => {
    let filtered = archetypes;

    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedIndustry) {
      filtered = filtered.filter(a => a.industry.includes(selectedIndustry));
    }

    setFilteredArchetypes(filtered);
  };

  const allIndustries = Array.from(new Set(archetypes.flatMap(a => a.industry))).sort();

  const handleSelectArchetype = (archetype: Archetype) => {
    onSelectArchetype(archetype.template);
    toast({
      title: '✨ Arquetipo seleccionado',
      description: `"${archetype.name}" ha sido cargado como base. Puedes personalizarlo ahora.`,
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
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Biblioteca de Arquetipos</h2>
        </div>
        <p className="text-muted-foreground">
          Selecciona un arquetipo predefinido como punto de partida para tu buyer persona. Todos son totalmente personalizables.
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
            variant={selectedIndustry === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedIndustry(null)}
          >
            Todas las industrias
          </Button>
          {allIndustries.map(industry => (
            <Button
              key={industry}
              variant={selectedIndustry === industry ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedIndustry(industry)}
            >
              {industry}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArchetypes.map((archetype) => (
          <Card key={archetype.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="text-4xl">{archetype.thumbnail}</div>
                <div className="flex flex-wrap gap-1">
                  {archetype.industry.slice(0, 2).map(ind => (
                    <Badge key={ind} variant="secondary" className="text-xs">
                      {ind}
                    </Badge>
                  ))}
                </div>
              </div>
              <CardTitle className="text-lg">{archetype.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {archetype.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setPreviewArchetype(archetype)}
                  variant="outline"
                  className="flex-1"
                >
                  Ver detalles
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSelectArchetype(archetype)}
                  className="flex-1"
                >
                  Usar arquetipo
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArchetypes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No se encontraron arquetipos que coincidan con tu búsqueda
        </div>
      )}

      <Dialog open={!!previewArchetype} onOpenChange={() => setPreviewArchetype(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{previewArchetype?.thumbnail}</span>
              <div>
                <DialogTitle>{previewArchetype?.name}</DialogTitle>
                <div className="flex gap-1 mt-2">
                  {previewArchetype?.industry.map(ind => (
                    <Badge key={ind} variant="secondary">
                      {ind}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <DialogDescription className="mt-4">
              {previewArchetype?.description}
            </DialogDescription>
          </DialogHeader>

          {previewArchetype && (
            <div className="space-y-6 mt-6">
              <div>
                <h4 className="font-semibold mb-2">📋 Información Básica</h4>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="text-muted-foreground">Cargo:</dt>
                  <dd>{previewArchetype.template.title || 'N/A'}</dd>
                  <dt className="text-muted-foreground">Área:</dt>
                  <dd>{previewArchetype.template.functionalArea || 'N/A'}</dd>
                  <dt className="text-muted-foreground">Edad:</dt>
                  <dd>{previewArchetype.template.age || 'N/A'}</dd>
                  <dt className="text-muted-foreground">Ubicación:</dt>
                  <dd>{previewArchetype.template.location || 'N/A'}</dd>
                </dl>
              </div>

              <div>
                <h4 className="font-semibold mb-2">🎯 Motivaciones</h4>
                <ul className="space-y-1 text-sm">
                  <li><strong>Incentivo:</strong> {previewArchetype.template.motivations?.incentive}</li>
                  <li><strong>Miedo:</strong> {previewArchetype.template.motivations?.fear}</li>
                  <li><strong>Logro:</strong> {previewArchetype.template.motivations?.achievement}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">💼 Objetivos & Pain Points</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Objetivos:</strong> {previewArchetype.template.goals}</p>
                  <p><strong>Frustraciones:</strong> {previewArchetype.template.pains}</p>
                  <p><strong>Objetivos de negocio:</strong> {previewArchetype.template.businessObjectives}</p>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => {
                  handleSelectArchetype(previewArchetype);
                  setPreviewArchetype(null);
                }}
              >
                Usar este arquetipo
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};