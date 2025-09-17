import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { IntelligentContentStrategy } from '@/types/intelligent-content-strategy';

interface AudienceFormProps {
  control: Control<IntelligentContentStrategy>;
}

export const AudienceForm = ({ control }: AudienceFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="audience.primaryBuyerPersona"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Quién es tu buyer persona principal?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe tu audiencia principal basada en los buyer personas creados..."
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
        name="audience.archetypes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Qué arquetipos representan mejor a tus clientes?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ej: explorador, cuidador, sabio, héroe, etc."
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
        name="audience.keyPublics"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Qué públicos clave deseas alcanzar?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ej: B2B, B2C, comunidades específicas..."
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
        name="audience.audienceProblemsNeeds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Qué problemas, necesidades o motivaciones tiene tu audiencia?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Define los pain points y necesidades que tu marca puede resolver..."
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