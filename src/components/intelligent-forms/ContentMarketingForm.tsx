import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { IntelligentContentStrategy } from '@/types/intelligent-content-strategy';

interface ContentMarketingFormProps {
  control: Control<IntelligentContentStrategy>;
}

export const ContentMarketingForm = ({ control }: ContentMarketingFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="contentMarketing.mainTopics"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Cuáles son los temas principales (máx. 5) de los que hablará tu marca?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Lista los 5 temas principales de tu estrategia de contenido..."
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
        name="contentMarketing.coreMessages"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Qué mensajes o valores deben estar siempre presentes?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Define los mensajes clave que deben ser consistentes en todo tu contenido..."
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
        name="contentMarketing.topicsToAvoid"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Qué cosas o temáticas debe evitar la marca?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Lista los temas o enfoques que tu marca debe evitar..."
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
        name="contentMarketing.valueContribution"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Cómo puedes aportar valor con tu contenido?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Define cómo vas a educar, inspirar, entretener o persuadir a tu audiencia..."
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