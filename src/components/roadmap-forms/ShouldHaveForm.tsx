import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ProductRoadmap } from '@/types/product-roadmap';

interface ShouldHaveFormProps {
  control: Control<ProductRoadmap>;
}

export const ShouldHaveForm = ({ control }: ShouldHaveFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="shouldHaveFeatures"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Funcionalidades Importantes</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Describe las principales funcionalidades que debería tener a corto plazo..."
                className="min-h-[120px]"
              />
            </FormControl>
            <FormDescription>
              Características importantes para el crecimiento a corto plazo
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="shortTermGoals"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Objetivos a Corto Plazo</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Define qué quieres lograr en los próximos 3-6 meses..."
                className="min-h-[120px]"
              />
            </FormControl>
            <FormDescription>
              Metas específicas para llegar al siguiente nivel de desarrollo
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};