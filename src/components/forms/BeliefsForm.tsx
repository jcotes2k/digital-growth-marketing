import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { BuyerPersona } from '@/types/buyer-persona';
import { Heart, Eye, Brain, Zap, Scale, Star, Target } from 'lucide-react';

interface BeliefsFormProps {
  control: Control<BuyerPersona>;
}

const beliefsFields = [
  {
    name: 'interests_responsibilities' as keyof BuyerPersona,
    label: 'Intereses y Responsabilidades',
    placeholder: '¿Cuáles son sus áreas de interés y responsabilidades?',
    icon: Heart,
    description: 'Áreas de interés profesional y personal, responsabilidades clave'
  },
  {
    name: 'perceptions_beliefs' as keyof BuyerPersona,
    label: 'Percepciones y Creencias',
    placeholder: '¿Qué percepciones y creencias tienen nuestros clientes?',
    icon: Eye,
    description: 'Creencias fundamentales sobre el mercado, productos y servicios'
  },
  {
    name: 'beliefs_influence_behavior' as keyof BuyerPersona,
    label: 'Influencia de las Creencias',
    placeholder: '¿Cómo afectan las creencias de nuestros clientes a su comportamiento de compra?',
    icon: Brain,
    description: 'Cómo sus creencias impactan sus decisiones de compra'
  },
  {
    name: 'client_beliefs_affect_choices' as keyof BuyerPersona,
    label: 'Creencias vs Elecciones',
    placeholder: '¿Cómo afectan las creencias de nuestro cliente a las elecciones más racionales?',
    icon: Zap,
    description: 'Tensión entre creencias emocionales y decisiones racionales'
  },
  {
    name: 'decision_factors' as keyof BuyerPersona,
    label: 'Factores de Decisión',
    placeholder: '¿Cuáles son los decisores conscientes de la compra?',
    icon: Scale,
    description: 'Factores conscientes que considera al tomar decisiones'
  },
  {
    name: 'value_consequences' as keyof BuyerPersona,
    label: 'Valoración de Consecuencias',
    placeholder: '¿Cómo valoran nuestros clientes las consecuencias/premios por su compra?',
    icon: Star,
    description: 'Cómo evalúa los beneficios y riesgos de sus decisiones'
  },
  {
    name: 'unconscious_drivers' as keyof BuyerPersona,
    label: 'Drivers Inconscientes',
    placeholder: '¿Cuáles son los decisores inconscientes de la compra?',
    icon: Target,
    description: 'Motivaciones subconscientes que influyen en sus decisiones'
  }
];

export const BeliefsForm: React.FC<BeliefsFormProps> = ({ control }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {beliefsFields.map((fieldConfig) => {
        const Icon = fieldConfig.icon;
        return (
          <FormField
            key={fieldConfig.name}
            control={control}
            name={fieldConfig.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {fieldConfig.label}
                </FormLabel>
                <p className="text-sm text-muted-foreground mb-2">
                  {fieldConfig.description}
                </p>
                <FormControl>
                  <Textarea
                    placeholder={fieldConfig.placeholder}
                    className="min-h-[100px]"
                    value={typeof field.value === 'string' ? field.value : ''}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      })}
    </div>
  );
};