import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { IntelligentContentStrategy } from '@/types/intelligent-content-strategy';

interface CommunicationToneFormProps {
  control: Control<IntelligentContentStrategy>;
}

export const CommunicationToneForm = ({ control }: CommunicationToneFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="communicationTone.brandPerception"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Cómo quieres que tu marca se perciba en redes sociales?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ej: profesional, cercana, divertida, disruptiva..."
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
        name="communicationTone.languageStyle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Qué lenguaje usarás?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ej: formal, informal, coloquial, técnico..."
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
        name="communicationTone.emotionsToEvoke"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Qué emociones quieres despertar en tu audiencia?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Define las emociones que quieres generar con tu comunicación..."
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
        name="communicationTone.voicePersonality"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Tu marca hablará en primera persona, plural o tercera persona?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Define el estilo de comunicación y personalidad de voz..."
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