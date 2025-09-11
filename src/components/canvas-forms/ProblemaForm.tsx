import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { BusinessCanvas } from '@/types/business-canvas';

interface ProblemaFormProps {
  control: Control<BusinessCanvas>;
}

export const ProblemaForm = ({ control }: ProblemaFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="mainProblems"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Problemas Principales</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Identifica los 3 principales problemas de ese colectivo y descubre cuáles son las soluciones alternativas a tu producto que usan para resolverlos."
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
        name="alternativeSolutions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Soluciones Alternativas</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe las soluciones alternativas que actualmente utilizan para resolver estos problemas."
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