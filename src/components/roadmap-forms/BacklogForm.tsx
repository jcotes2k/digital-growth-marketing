import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ProductRoadmap } from '@/types/product-roadmap';

interface BacklogFormProps {
  control: Control<ProductRoadmap>;
}

export const BacklogForm = ({ control }: BacklogFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="backlogFeatures"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ideas Sin Clasificar</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Anota todas las ideas y funcionalidades que aún no has clasificado..."
                className="min-h-[120px]"
              />
            </FormControl>
            <FormDescription>
              Colecciona funcionalidades o características que todavía no has clasificado
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="unclassifiedIdeas"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ideas Pendientes de Evaluar</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Lista ideas que necesitan más investigación o validación..."
                className="min-h-[120px]"
              />
            </FormControl>
            <FormDescription>
              Ideas que requieren análisis adicional antes de priorizarlas
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};