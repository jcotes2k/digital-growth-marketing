import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { BuyerPersona } from '@/types/buyer-persona';
import { Target, AlertTriangle, Trophy, TrendingUp, Crown, Users } from 'lucide-react';

interface MotivationsFormProps {
  control: Control<BuyerPersona>;
}

const motivationFields = [
  {
    key: 'incentive' as keyof BuyerPersona['motivations'],
    label: 'Incentivos',
    placeholder: 'Qué motiva a esta persona a tomar acción...',
    icon: Target,
    description: 'Qué recompensas o beneficios busca obtener'
  },
  {
    key: 'fear' as keyof BuyerPersona['motivations'],
    label: 'Miedos',
    placeholder: 'Qué teme perder o que suceda...',
    icon: AlertTriangle,
    description: 'Qué riesgos o consecuencias trata de evitar'
  },
  {
    key: 'achievement' as keyof BuyerPersona['motivations'],
    label: 'Logros',
    placeholder: 'Qué metas profesionales quiere alcanzar...',
    icon: Trophy,
    description: 'Qué objetivos profesionales o personales persigue'
  },
  {
    key: 'growth' as keyof BuyerPersona['motivations'],
    label: 'Crecimiento',
    placeholder: 'Cómo quiere desarrollarse profesionalmente...',
    icon: TrendingUp,
    description: 'Oportunidades de desarrollo que valora'
  },
  {
    key: 'power' as keyof BuyerPersona['motivations'],
    label: 'Poder',
    placeholder: 'Qué nivel de influencia o autoridad busca...',
    icon: Crown,
    description: 'Deseo de influencia, control o autoridad'
  },
  {
    key: 'social' as keyof BuyerPersona['motivations'],
    label: 'Social',
    placeholder: 'Cómo quiere ser percibido socialmente...',
    icon: Users,
    description: 'Reconocimiento social y pertenencia que busca'
  }
];

export const MotivationsForm: React.FC<MotivationsFormProps> = ({ control }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {motivationFields.map((fieldConfig) => {
        const Icon = fieldConfig.icon;
        return (
          <FormField
            key={fieldConfig.key}
            control={control}
            name={`motivations.${fieldConfig.key}`}
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
                    {...field}
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