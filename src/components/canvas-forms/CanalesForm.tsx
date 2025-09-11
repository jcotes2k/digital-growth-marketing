import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { BusinessCanvas } from '@/types/business-canvas';

interface CanalesFormProps {
  control: Control<BusinessCanvas>;
}

export const CanalesForm = ({ control }: CanalesFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="distributionChannels"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Canales de Distribución</FormLabel>
            <FormControl>
              <Textarea
                placeholder="¿Cómo vas a hacer llegar tu solución a los segmentos de clientes?"
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="reachStrategy"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estrategia de Alcance</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe tu estrategia para llegar efectivamente a tus clientes objetivo."
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};