import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ProductRoadmap } from '@/types/product-roadmap';

interface TargetAudienceFormProps {
  control: Control<ProductRoadmap>;
}

export const TargetAudienceForm = ({ control }: TargetAudienceFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="targetAudience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Perfil de Usuario Objetivo</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Recoge el perfil que hayas segmentado en la ficha persona. Describe quién es tu usuario principal..."
                className="min-h-[120px]"
              />
            </FormControl>
            <FormDescription>
              Define claramente para quién está diseñada tu solución basándote en tu buyer persona
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};