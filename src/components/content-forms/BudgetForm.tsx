import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ContentStrategy } from '@/types/content-strategy';

interface BudgetFormProps {
  control: Control<ContentStrategy>;
}

export const BudgetForm = ({ control }: BudgetFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="budget"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Presupuesto</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe tu gasto..."
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