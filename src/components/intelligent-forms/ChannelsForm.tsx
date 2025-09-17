import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { IntelligentContentStrategy } from '@/types/intelligent-content-strategy';

interface ChannelsFormProps {
  control: Control<IntelligentContentStrategy>;
}

export const ChannelsForm = ({ control }: ChannelsFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="channels.socialNetworks"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿En qué redes sociales está realmente tu audiencia?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Lista las redes donde tienes mayor presencia de tu audiencia objetivo..."
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
        name="channels.platformContentFit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Qué plataformas encajan mejor con tu tipo de contenido?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ej: visual, educativo, aspiracional, corporativo..."
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
        name="channels.channelRoles"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Cuál será el rol de cada canal?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ej: Instagram para branding, LinkedIn para B2B, YouTube para autoridad..."
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
        name="channels.resourcePrioritization"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Tienes recursos para gestionarlas todas o debes priorizar?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Define la distribución de recursos y prioridades por canal..."
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