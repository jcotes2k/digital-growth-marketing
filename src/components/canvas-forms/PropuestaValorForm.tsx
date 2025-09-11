import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { BusinessCanvas } from '@/types/business-canvas';

interface PropuestaValorFormProps {
  control: Control<BusinessCanvas>;
}

export const PropuestaValorForm = ({ control }: PropuestaValorFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="valueProposition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Propuesta de Valor</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Deja de forma clara, simple, sencilla qué hace especial tu solución y cómo vas a ayudar a tus clientes a resolver su problema."
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