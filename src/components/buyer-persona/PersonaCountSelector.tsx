import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Minus } from 'lucide-react';

interface PersonaCountSelectorProps {
  onCountSelected: (count: number) => void;
}

export const PersonaCountSelector = ({ onCountSelected }: PersonaCountSelectorProps) => {
  const [selectedCount, setSelectedCount] = useState(1);

  const handleCountChange = (increment: boolean) => {
    if (increment && selectedCount < 6) {
      setSelectedCount(selectedCount + 1);
    } else if (!increment && selectedCount > 1) {
      setSelectedCount(selectedCount - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Generador de Buyer Persona</h1>
          <p className="text-xl text-muted-foreground mb-8">
            ¿Cuántos buyer personas deseas crear?
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="w-6 h-6" />
              Selecciona la cantidad
            </CardTitle>
            <CardDescription>
              Puedes crear entre 1 y 6 buyer personas. Te recomendamos empezar con 2-3 personas principales.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex items-center justify-center gap-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCountChange(false)}
                disabled={selectedCount <= 1}
                className="h-12 w-12"
              >
                <Minus className="w-5 h-5" />
              </Button>
              
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">
                  {selectedCount}
                </div>
                <Badge variant="secondary" className="text-sm">
                  {selectedCount === 1 ? 'Buyer Persona' : 'Buyer Personas'}
                </Badge>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCountChange(true)}
                disabled={selectedCount >= 6}
                className="h-12 w-12"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((count) => (
                <Button
                  key={count}
                  variant={selectedCount === count ? 'default' : 'outline'}
                  onClick={() => setSelectedCount(count)}
                  className="h-16 text-lg"
                >
                  {count}
                </Button>
              ))}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Recomendaciones:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>1-2 personas:</strong> Para productos específicos o nichos</li>
                <li>• <strong>3-4 personas:</strong> Para la mayoría de negocios (recomendado)</li>
                <li>• <strong>5-6 personas:</strong> Para productos con múltiples segmentos</li>
              </ul>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={() => onCountSelected(selectedCount)}
                size="lg"
                className="px-8"
              >
                Crear {selectedCount} {selectedCount === 1 ? 'Buyer Persona' : 'Buyer Personas'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};