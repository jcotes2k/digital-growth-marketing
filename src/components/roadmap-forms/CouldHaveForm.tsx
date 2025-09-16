import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ProductRoadmap } from '@/types/product-roadmap';

interface CouldHaveFormProps {
  control: Control<ProductRoadmap>;
}

export const CouldHaveForm = ({ control }: CouldHaveFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="couldHaveFeatures"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Funcionalidades Futuras</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Lista las funcionalidades que tu solución podría tener en el futuro..."
                className="min-h-[120px]"
              />
            </FormControl>
            <FormDescription>
              Características deseables para el desarrollo a largo plazo
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="futureVision"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Visión de Futuro</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Describe tu visión a largo plazo para el producto..."
                className="min-h-[120px]"
              />
            </FormControl>
            <FormDescription>
              Hacia dónde quieres que evolucione tu solución
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};