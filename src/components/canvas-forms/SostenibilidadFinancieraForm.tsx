import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { BusinessCanvas } from '@/types/business-canvas';

interface SostenibilidadFinancieraFormProps {
  control: Control<BusinessCanvas>;
}

export const SostenibilidadFinancieraForm = ({ control }: SostenibilidadFinancieraFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="revenueGeneration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Generación de Ingresos</FormLabel>
            <FormControl>
              <Textarea
                placeholder="¿De qué manera vas a obtener ingresos?"
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
        name="profitMargin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Margen de Beneficio</FormLabel>
            <FormControl>
              <Textarea
                placeholder="¿Cuál es el margen de beneficio esperado?"
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