import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BusinessCanvas } from '@/types/business-canvas';

interface CanvasScenario {
  id: string;
  name: string;
  description: string | null;
  canvas_data: BusinessCanvas;
  is_favorite: boolean;
  created_at: string;
}

interface CanvasComparisonProps {
  scenarios: CanvasScenario[];
}

const canvasFields = [
  { key: 'mainProblems', label: '🎯 Problema Principal' },
  { key: 'valueProposition', label: '💡 Propuesta de Valor' },
  { key: 'differentialAdvantage', label: '⭐ Ventaja Diferencial' },
  { key: 'customerSegments', label: '👥 Segmentos de Clientes' },
  { key: 'distributionChannels', label: '📢 Canales' },
  { key: 'revenueGeneration', label: '💰 Generación de Ingresos' },
  { key: 'costElements', label: '💸 Estructura de Costes' },
  { key: 'socialImpact', label: '🌍 Impacto Social' },
  { key: 'environmentalImpact', label: '🌱 Impacto Ambiental' }
];

export const CanvasComparison: React.FC<CanvasComparisonProps> = ({ scenarios }) => {
  if (scenarios.length < 2) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Selecciona al menos 2 escenarios para comparar
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Comparación de Escenarios</h3>
        <div className="flex gap-2">
          {scenarios.map(scenario => (
            <Badge key={scenario.id} variant="secondary">
              {scenario.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-semibold min-w-[200px] sticky left-0 bg-background">
                Campo
              </th>
              {scenarios.map(scenario => (
                <th key={scenario.id} className="text-left p-4 font-semibold min-w-[300px]">
                  <div>
                    <div className="font-bold">{scenario.name}</div>
                    <div className="text-xs text-muted-foreground font-normal">
                      {new Date(scenario.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {canvasFields.map((field, idx) => (
              <tr key={field.key} className={idx % 2 === 0 ? 'bg-muted/30' : ''}>
                <td className="p-4 font-semibold sticky left-0 bg-background border-r">
                  {field.label}
                </td>
                {scenarios.map(scenario => {
                  const value = scenario.canvas_data[field.key as keyof BusinessCanvas] as string;
                  return (
                    <td key={scenario.id} className="p-4">
                      <div className="text-sm">
                        {value || <span className="text-muted-foreground italic">No definido</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Análisis Comparativo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">📊 Similitudes</h4>
              <p className="text-sm text-muted-foreground">
                Los escenarios comparten enfoques similares en impacto social y segmentación de clientes
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🔄 Diferencias Clave</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Modelos de generación de ingresos distintos</li>
                <li>• Estrategias de canales diferenciadas</li>
                <li>• Estructuras de costes con enfoques diversos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">💡 Recomendación</h4>
              <p className="text-sm text-muted-foreground">
                Considera combinar las fortalezas de cada escenario para crear un modelo híbrido más robusto
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};