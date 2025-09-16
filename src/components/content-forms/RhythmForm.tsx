import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ContentStrategy } from '@/types/content-strategy';

interface RhythmFormProps {
  control: Control<ContentStrategy>;
}

export const RhythmForm = ({ control }: RhythmFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="rhythm"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ritmo</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Planifica cuándo vas a publicar en redes sociales..."
                className="min-h-[200px]"
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