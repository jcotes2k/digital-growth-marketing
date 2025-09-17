import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { IntelligentContentStrategy } from '@/types/intelligent-content-strategy';

interface FaqsCrisisFormProps {
  control: Control<IntelligentContentStrategy>;
}

export const FaqsCrisisForm = ({ control }: FaqsCrisisFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="faqsCrisis.frequentQuestions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Qué preguntas frecuentes hacen los clientes y cómo responderás?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Lista las preguntas más comunes y sus respuestas preparadas..."
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
        name="faqsCrisis.reputationRisks"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Cuáles son los riesgos de reputación que puede enfrentar la marca?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Identifica posibles crisis o situaciones de riesgo reputacional..."
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
        name="faqsCrisis.crisisProtocol"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Qué protocolo seguirás si surge una crisis digital?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Define los pasos a seguir en caso de crisis: ataques, quejas masivas, reclamos públicos..."
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
        name="faqsCrisis.responseTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Cuánto tiempo máximo debe tardar la marca en responder?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Define los tiempos de respuesta según el tipo de situación..."
                className="min-h-[100px]"
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