import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { BuyerPersona } from '@/types/buyer-persona';
import { Brain } from 'lucide-react';

interface PersonalityFormProps {
  control: Control<BuyerPersona>;
}

const personalityTraits = [
  {
    key: 'extrovert' as keyof BuyerPersona['personality'],
    left: 'Introvertido',
    right: 'Extrovertido',
    description: 'Tendencia a enfocarse hacia adentro vs. hacia afuera'
  },
  {
    key: 'thinking' as keyof BuyerPersona['personality'],
    left: 'Pensamiento',
    right: 'Sentimiento',
    description: 'Toma decisiones basadas en lógica vs. emociones'
  },
  {
    key: 'control' as keyof BuyerPersona['personality'],
    left: 'Control',
    right: 'Emprendedor',
    description: 'Prefiere estructuras definidas vs. flexibilidad e innovación'
  },
  {
    key: 'practical' as keyof BuyerPersona['personality'],
    left: 'Práctico',
    right: 'Visionario',
    description: 'Enfoque en lo tangible vs. posibilidades futuras'
  },
  {
    key: 'conservative' as keyof BuyerPersona['personality'],
    left: 'Conservador',
    right: 'Innovador',
    description: 'Prefiere métodos probados vs. nuevas alternativas'
  }
];

export const PersonalityForm: React.FC<PersonalityFormProps> = ({ control }) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
        <p className="text-muted-foreground">
          Ajusta los controles deslizantes para definir los rasgos de personalidad de tu buyer persona
        </p>
      </div>

      {personalityTraits.map((trait) => (
        <FormField
          key={trait.key}
          control={control}
          name={`personality.${trait.key}`}
          render={({ field }) => (
            <FormItem className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel className="font-medium">{trait.left}</FormLabel>
                <FormLabel className="font-medium">{trait.right}</FormLabel>
              </div>
              
              <FormControl>
                <div className="px-3">
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="w-full"
                  />
                </div>
              </FormControl>
              
              <div className="text-center">
                <span className="text-lg font-semibold text-primary">{field.value}/10</span>
              </div>
              
              <p className="text-sm text-muted-foreground text-center">
                {trait.description}
              </p>
              
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
};