import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ContentStrategy } from '@/types/content-strategy';

interface TeamFormProps {
  control: Control<ContentStrategy>;
}

export const TeamForm = ({ control }: TeamFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="team"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Equipo</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Elige quién va a coordinar..."
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