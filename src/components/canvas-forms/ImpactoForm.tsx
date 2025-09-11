import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { BusinessCanvas } from '@/types/business-canvas';

interface ImpactoFormProps {
  control: Control<BusinessCanvas>;
}

export const ImpactoForm = ({ control }: ImpactoFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="socialImpact"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Impacto Social</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Qué impacto vamos a generar en el entorno social."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="environmentalImpact"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Impacto Medioambiental</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Qué impacto vamos a generar en el medio ambiental."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="improvementMeasures"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Medidas de Mejora</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Las medidas para mejorar estos aspectos."
                className="min-h-[100px]"
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