import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { BusinessCanvas } from '@/types/business-canvas';

interface EstructuraCostesFormProps {
  control: Control<BusinessCanvas>;
}

export const EstructuraCostesForm = ({ control }: EstructuraCostesFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="costElements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Elementos de Costo</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Elementos que nos cuestan dinero, y que en la práctica indican el gasto aproximado que tendremos mensualmente."
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
        name="monthlyExpenses"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gastos Mensuales Estimados</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Detalla los gastos mensuales aproximados de tu negocio."
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