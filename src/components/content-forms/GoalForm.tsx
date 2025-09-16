import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ContentStrategy } from '@/types/content-strategy';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface GoalFormProps {
  control: Control<ContentStrategy>;
}

export const GoalForm = ({ control }: GoalFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="goal"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Objetivo
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <div className="space-y-2">
                      <p className="font-semibold text-blue-600">Ejemplo NIVEA - PRODUCTO</p>
                      <p className="text-sm">Cremas y lociones corporales, faciales, solares, desodorantes y geles de baño</p>
                      <p className="font-semibold text-blue-600 mt-3">OBJETIVO DEL TERRITORIO DE MARCA</p>
                      <p className="text-sm">El objetivo de branding es posicionarse como expertos en el cuidado de la piel</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Escribe cómo se ve el éxito para ti..."
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