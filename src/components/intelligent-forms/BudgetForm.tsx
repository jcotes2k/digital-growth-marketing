import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { IntelligentContentStrategy } from '@/types/intelligent-content-strategy';

interface BudgetFormProps {
  control: Control<IntelligentContentStrategy>;
}

export const BudgetForm = ({ control }: BudgetFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="budget.monthlyBudget"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Qué presupuesto mensual o trimestral tienes para pauta digital?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Define tu presupuesto disponible para publicidad digital..."
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
        name="budget.organicVsPaid"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Qué porcentaje se destina a orgánico y a publicidad pagada?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Define la distribución entre contenido orgánico y pauta pagada..."
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
        name="budget.networkInvestment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿En qué red social invertirás más presupuesto y por qué?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Justifica la distribución de presupuesto por plataforma..."
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
        name="budget.toolsInvestment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Vas a invertir en herramientas de gestión, diseño o analítica?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Lista las herramientas necesarias y su costo aproximado..."
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