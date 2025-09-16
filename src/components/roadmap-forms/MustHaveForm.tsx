import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ProductRoadmap } from '@/types/product-roadmap';

interface MustHaveFormProps {
  control: Control<ProductRoadmap>;
}

export const MustHaveForm = ({ control }: MustHaveFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="mustHaveFeatures"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Funcionalidades Esenciales</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Lista las características mínimas que tu solución debe tener para ser viable..."
                className="min-h-[120px]"
              />
            </FormControl>
            <FormDescription>
              Requisitos mínimos que ha de tener tu solución para funcionar
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="userStories"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Historias de Usuario (Early Adopters)</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Escribe las historias de usuario validadas: 'Como [usuario], quiero [funcionalidad] para [beneficio]'..."
                className="min-h-[120px]"
              />
            </FormControl>
            <FormDescription>
              Basa estas historias en las necesidades de tus primeros adoptadores
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};