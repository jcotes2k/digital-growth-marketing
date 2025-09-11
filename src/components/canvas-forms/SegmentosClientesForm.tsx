import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { BusinessCanvas } from '@/types/business-canvas';

interface SegmentosClientesFormProps {
  control: Control<BusinessCanvas>;
}

export const SegmentosClientesForm = ({ control }: SegmentosClientesFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="customerSegments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Segmentos de Clientes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Identificar y conocer los segmentos de clientes sobre los vamos a trabajar."
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
        name="earlyAdopters"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Early Adopters</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Quiénes podrían ser los early adopters o usuarios visionarios con los que comenzar a trabajar."
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