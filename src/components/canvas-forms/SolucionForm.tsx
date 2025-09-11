import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { BusinessCanvas } from '@/types/business-canvas';

interface SolucionFormProps {
  control: Control<BusinessCanvas>;
}

export const SolucionForm = ({ control }: SolucionFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="keyCharacteristics"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Características Clave de la Solución</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Establece las 3 características más importantes de tu propuesta que les van a ayudar a resolverlo."
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