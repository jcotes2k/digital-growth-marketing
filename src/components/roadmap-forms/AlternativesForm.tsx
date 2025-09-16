import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ProductRoadmap } from '@/types/product-roadmap';

interface AlternativesFormProps {
  control: Control<ProductRoadmap>;
}

export const AlternativesForm = ({ control }: AlternativesFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="marketAlternatives"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alternativas del Mercado</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Lista las alternativas que existen en el mercado..."
                className="min-h-[120px]"
              />
            </FormControl>
            <FormDescription>
              Soluciones existentes que atienden las mismas necesidades de usuario
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="competitorAnalysis"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Análisis de Competidores</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Analiza cómo responden los competidores a las historias de usuarios identificadas..."
                className="min-h-[120px]"
              />
            </FormControl>
            <FormDescription>
              Evalúa qué tan bien cubren las necesidades del usuario objetivo
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};