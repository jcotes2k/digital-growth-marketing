import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { BusinessCanvas } from '@/types/business-canvas';

interface IndicadoresClaveFormProps {
  control: Control<BusinessCanvas>;
}

export const IndicadoresClaveForm = ({ control }: IndicadoresClaveFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="keyActivities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Actividades Clave</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Establece qué actividades queremos medir."
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
        name="keyIndicators"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Indicadores Clave</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Con qué indicadores vamos a medir estas actividades."
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