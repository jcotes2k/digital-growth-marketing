import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { IntelligentContentStrategy } from '@/types/intelligent-content-strategy';

interface WorkflowFormProps {
  control: Control<IntelligentContentStrategy>;
}

export const WorkflowForm = ({ control }: WorkflowFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="workflow.managementTools"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Qué herramientas usarás para administrar contenido?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ej: Hootsuite, Metricool, Notion, Trello..."
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
        name="workflow.editorialCalendar"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Tienes un calendario editorial de publicaciones?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe tu estrategia de planificación de contenido..."
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
        name="workflow.teamWorkflow"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Cómo se organizará el flujo de trabajo del equipo?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Define el workflow entre equipo de diseño, copy, pauta y community manager..."
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
        name="workflow.analyticsTools"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Qué herramientas de analítica vas a usar para medir KPI's?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Lista las herramientas de medición y análisis que utilizarás..."
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
        name="workflow.aiUsage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Usarás inteligencia artificial para generación de ideas, copies o diseños?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Define cómo integrarás IA en tu proceso de creación de contenido..."
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