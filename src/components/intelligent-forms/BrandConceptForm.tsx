import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { IntelligentContentStrategy } from '@/types/intelligent-content-strategy';

interface BrandConceptFormProps {
  control: Control<IntelligentContentStrategy>;
}

export const BrandConceptForm = ({ control }: BrandConceptFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="brandConcept.valueProposition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Cuál es la propuesta de valor de tu marca?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Define qué valor único ofreces a tus clientes..."
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
        name="brandConcept.keyDifferentiators"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Qué te diferencia de tu competencia?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Lista los diferenciadores clave de tu marca..."
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
        name="brandConcept.brandAttributes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Qué atributos quieres que asocien con tu marca?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ej: innovación, confianza, cercanía, lujo, etc."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="brandConcept.customerPromise"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Cuál es la promesa que haces a tu cliente?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Define el compromiso principal con tus clientes..."
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
        name="brandConcept.creativeConceptPhrase"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Cómo resumirías en una frase el concepto rector creativo?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Una frase que capture la esencia de tu comunicación..."
                className="min-h-[80px]"
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