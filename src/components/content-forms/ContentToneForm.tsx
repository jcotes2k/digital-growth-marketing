import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ContentStrategy } from '@/types/content-strategy';

interface ContentToneFormProps {
  control: Control<ContentStrategy>;
}

export const ContentToneForm = ({ control }: ContentToneFormProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormLabel>Tono de Contenido</FormLabel>
        <p className="text-sm text-muted-foreground">Elige un tono para crear el sentimiento que los usuarios desean</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="contentTone.significado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Significado</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="¿Qué significa tu marca?"
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
            name="contentTone.territorio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Territorio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="¿En qué territorio compites?"
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
            name="contentTone.percepcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Percepción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="¿Cómo te perciben?"
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
            name="contentTone.personalidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personalidad</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="¿Cuál es tu personalidad de marca?"
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
            name="contentTone.valoresAtributos"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Valores y Atributos</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="¿Cuáles son tus valores y atributos clave?"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};