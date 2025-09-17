import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { IntelligentContentStrategy } from '@/types/intelligent-content-strategy';

interface KpisFormProps {
  control: Control<IntelligentContentStrategy>;
}

const kpiOptions = [
  "Alcance e impresiones",
  "Engagement rate",
  "Leads cualificados", 
  "Conversiones web",
  "Share of voice",
  "Brand awareness",
  "Tráfico web",
  "CTR (Click Through Rate)",
  "Costo por lead",
  "ROI de campañas"
];

export const KpisForm = ({ control }: KpisFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="kpis.priorityMetrics"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Qué quieres medir prioritariamente?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ej: reconocimiento de marca, interacción, ventas, fidelización..."
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
        name="kpis.relevantKpis"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Cuáles son los KPI's más relevantes para ti?</FormLabel>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {kpiOptions.map((kpi) => (
                <FormItem key={kpi} className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(kpi)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...(field.value || []), kpi]);
                        } else {
                          field.onChange(field.value?.filter((value) => value !== kpi));
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    {kpi}
                  </FormLabel>
                </FormItem>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="kpis.numericObjectives"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Qué objetivos numéricos o porcentuales vas a definir?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Define metas específicas para cada KPI..."
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