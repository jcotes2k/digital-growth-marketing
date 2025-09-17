import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { IntelligentContentStrategy } from '@/types/intelligent-content-strategy';

interface RhythmFormProps {
  control: Control<IntelligentContentStrategy>;
}

export const RhythmForm = ({ control }: RhythmFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="rhythm.publicationFrequency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Cuántas publicaciones por semana harás en cada red?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Define la frecuencia de publicación para cada plataforma..."
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
        name="rhythm.networkDifferences"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Habrá diferencia de frecuencia entre redes?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ej: Twitter vs LinkedIn, Instagram vs YouTube..."
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
        name="rhythm.storiesReelsVideos"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Cuántas historias/reels/videos cortos planeas subir al mes?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Define la estrategia para contenido efímero y videos cortos..."
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
        name="rhythm.optimalTiming"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Qué días y horarios consume más tu audiencia?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Define los mejores horarios de publicación por plataforma..."
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