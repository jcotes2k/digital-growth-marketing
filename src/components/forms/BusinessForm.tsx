import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { BuyerPersona } from '@/types/buyer-persona';
import { Building2, User, Briefcase, ShoppingCart } from 'lucide-react';

interface BusinessFormProps {
  control: Control<BuyerPersona>;
}

const businessFields = [
  {
    name: 'businessObjectives' as keyof BuyerPersona,
    label: 'Objetivos de Negocio',
    placeholder: '¿Cuáles son los objetivos de negocio de venta?',
    icon: Building2,
    description: 'Metas relacionadas con el crecimiento y éxito del negocio'
  },
  {
    name: 'personalObjectives' as keyof BuyerPersona,
    label: 'Objetivos Personales',
    placeholder: '¿Cuáles son sus objetivos personales?',
    icon: User,
    description: 'Metas personales y de desarrollo individual'
  },
  {
    name: 'workObjectives' as keyof BuyerPersona,
    label: 'Objetivos de Trabajo',
    placeholder: '¿Qué objetivos de su trabajo u organización afectan a su comportamiento de compra?',
    icon: Briefcase,
    description: 'Objetivos profesionales que influyen en sus decisiones'
  },
  {
    name: 'buyingProcess' as keyof BuyerPersona,
    label: 'Proceso de Compra',
    placeholder: '¿Cuál es el proceso de compra de nuestros clientes?',
    icon: ShoppingCart,
    description: 'Pasos que sigue para tomar decisiones de compra'
  },
  {
    name: 'typicalBuyingProcess' as keyof BuyerPersona,
    label: 'Proceso Típico de Compra',
    placeholder: '¿Cuál es el proceso de compra típico?',
    icon: ShoppingCart,
    description: 'Secuencia habitual en su proceso de adquisición'
  },
  {
    name: 'productAcquisitionInfluence' as keyof BuyerPersona,
    label: 'Influencia en la Adquisición',
    placeholder: '¿Cómo influye la adquisición del producto en el proceso de compra?',
    icon: ShoppingCart,
    description: 'Factores que afectan la decisión de adquisición'
  }
];

export const BusinessForm: React.FC<BusinessFormProps> = ({ control }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {businessFields.map((fieldConfig) => {
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