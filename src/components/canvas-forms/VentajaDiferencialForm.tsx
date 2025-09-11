import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { BusinessCanvas } from '@/types/business-canvas';

interface VentajaDiferencialFormProps {
  control: Control<BusinessCanvas>;
}

export const VentajaDiferencialForm = ({ control }: VentajaDiferencialFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="differentialAdvantage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ventaja Diferencial</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Lo que te hace especial y diferente, que causa que los clientes repitan."
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