import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ContentStrategy } from '@/types/content-strategy';

interface ContentFormatFormProps {
  control: Control<ContentStrategy>;
}

export const ContentFormatForm = ({ control }: ContentFormatFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="contentFormat"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Formato de Contenido</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Identifica qué formatos de publicación prefieren tus usuarios..."
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