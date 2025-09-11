import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { BuyerPersona } from '@/types/buyer-persona';
import { Users, UserPlus, Vote, UserCog, CheckCircle } from 'lucide-react';

interface InfluencesFormProps {
  control: Control<BuyerPersona>;
}

const influenceFields = [
  {
    name: 'main_participants' as keyof BuyerPersona,
    label: 'Principales Participantes',
    placeholder: '¿Quiénes son los principales participantes en el proceso de compra?',
    icon: Users,
    description: 'Personas clave involucradas en la decisión de compra'
  },
  {
    name: 'internal_external_influencers' as keyof BuyerPersona,
    label: 'Influenciadores Internos y Externos',
    placeholder: '¿Quiénes son los influenciadores internos y externos?',
    icon: UserPlus,
    description: 'Personas dentro y fuera de la organización que influyen'
  },
  {
    name: 'decision_participant' as keyof BuyerPersona,
    label: 'Participante en Decisión',
    placeholder: '¿Quién participa como decisor de la compra?',
    icon: Vote,
    description: 'Quien tiene poder de decisión final'
  },
  {
    name: 'participant_roles' as keyof BuyerPersona,
    label: 'Roles de Participantes',
    placeholder: '¿Qué rol tiene cada una de esas personas en el proceso de compra?',
    icon: UserCog,
    description: 'Función específica de cada participante'
  },
  {
    name: 'approval_participant' as keyof BuyerPersona,
    label: 'Participante en Aprobación',
    placeholder: '¿Quién participa del proceso de aprobación?',
    icon: CheckCircle,
    description: 'Quien debe dar aprobación final o presupuestaria'
  }
];

export const InfluencesForm: React.FC<InfluencesFormProps> = ({ control }) => {
  return (
    <div className="space-y-6">
      {influenceFields.map((fieldConfig) => {
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