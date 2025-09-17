import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { IntelligentContentStrategy } from '@/types/intelligent-content-strategy';

interface FormatsFormProps {
  control: Control<IntelligentContentStrategy>;
}

export const FormatsForm = ({ control }: FormatsFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="formats.primaryFormats"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Qué tipo de formatos utilizarás más?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ej: Imágenes (posts, carruseles, infografías), Videos (cortos, largos, reels, tutoriales), GIFs, historias interactivas..."
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
        name="formats.engagementFormats"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Qué formatos generan más interacción con tu audiencia?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Identifica los formatos que más engagement generan para tu marca..."
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
        name="formats.contentReuse"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Cómo puedes reutilizar un contenido en varios formatos?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Define estrategias para maximizar el valor de cada pieza de contenido..."
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