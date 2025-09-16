import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ContentStrategy } from '@/types/content-strategy';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface ContentTopicsFormProps {
  control: Control<ContentStrategy>;
}

export const ContentTopicsForm = ({ control }: ContentTopicsFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="contentTopics"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Temas de Contenido
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <div className="space-y-2">
                      <p className="font-semibold text-blue-600">BENEFICIOS FUNCIONALES Y EMOCIONALES</p>
                      <p className="text-sm">Los beneficios funcionales serían: hidratación, frescura, piel suave... y los emocionales: belleza, confianza, autoestima etc</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Apunta algunas categorías clave sobre las que puedas publicar..."
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