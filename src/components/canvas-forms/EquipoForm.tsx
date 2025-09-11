import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { BusinessCanvas } from '@/types/business-canvas';

interface EquipoFormProps {
  control: Control<BusinessCanvas>;
}

export const EquipoForm = ({ control }: EquipoFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="teamMembers"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Miembros del Equipo</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe los miembros actuales y futuros del equipo."
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
        name="keyRoles"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Roles Clave</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Identifica los roles clave necesarios para el éxito del negocio."
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