import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { BusinessCanvas } from '@/types/business-canvas';
import { BuyerPersona } from '@/types/buyer-persona';
import { CompanyInfo } from '@/types/company-info';
import { Sparkles, Loader2, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AICanvasGeneratorProps {
  buyerPersonas: BuyerPersona[];
  companyInfo: CompanyInfo | null;
  onCanvasGenerated: (canvas: Partial<BusinessCanvas>) => void;
  onClose: () => void;
}

export const AICanvasGenerator: React.FC<AICanvasGeneratorProps> = ({
  buyerPersonas,
  companyInfo,
  onCanvasGenerated,
  onClose
}) => {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!buyerPersonas || buyerPersonas.length === 0) {
      setError('Necesitas crear al menos un buyer persona antes de generar el canvas.');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('canvas-generator', {
        body: {
          buyerPersonas,
          companyInfo
        }
      });

      if (functionError) throw functionError;

      if (data.canvas) {
        onCanvasGenerated(data.canvas);
        toast({
          title: '✨ Canvas Generado',
          description: 'El asistente IA ha creado tu Business Canvas basándose en tus buyer personas.',
        });
        onClose();
      }
    } catch (err) {
      console.error('Error generating canvas:', err);
      setError('No se pudo generar el canvas. Por favor intenta de nuevo.');
      toast({
        title: 'Error',
        description: 'No se pudo generar el canvas con IA',
        variant: 'destructive'
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <CardTitle>Generador Automático de Canvas con IA</CardTitle>
        </div>
        <CardDescription>
          La IA analizará tus buyer personas y generará automáticamente un Business Canvas personalizado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
            <Users className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold">Buyer Personas Detectados</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {buyerPersonas && buyerPersonas.length > 0 ? (
                  <>
                    Se encontraron <strong>{buyerPersonas.length} buyer persona(s)</strong>. 
                    La IA analizará sus problemas, motivaciones y canales preferidos para crear tu canvas.
                  </>
                ) : (
                  <span className="text-destructive">
                    No se encontraron buyer personas. Por favor crea al menos uno antes de continuar.
                  </span>
                )}
              </p>
              {buyerPersonas && buyerPersonas.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {buyerPersonas.slice(0, 3).map((persona, idx) => (
                    <li key={idx} className="text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      {persona.personaName || `Persona ${idx + 1}`} - {persona.title}
                    </li>
                  ))}
                  {buyerPersonas.length > 3 && (
                    <li className="text-sm text-muted-foreground">
                      ... y {buyerPersonas.length - 3} más
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">📋 ¿Qué generará la IA?</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>Problema y Solución:</strong> Basados en los pain points de tus personas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>Propuesta de Valor:</strong> Alineada con las motivaciones identificadas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>Segmentos de Clientes:</strong> Basados en tus buyer personas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>Canales:</strong> Alineados con los canales preferidos de tus personas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>Estructura completa:</strong> Costes, ingresos, equipo, impacto social/ambiental</span>
              </li>
            </ul>
          </div>

          <Alert>
            <Sparkles className="w-4 h-4" />
            <AlertDescription>
              El canvas generado es un punto de partida. Puedes editarlo y personalizarlo después de la generación.
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={generating}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={generating || !buyerPersonas || buyerPersonas.length === 0}
            className="flex-1"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generando Canvas...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generar Canvas con IA
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};