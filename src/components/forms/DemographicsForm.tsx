import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BuyerPersona } from '@/types/buyer-persona';
import { User, Briefcase, MapPin, Calendar } from 'lucide-react';

interface DemographicsFormProps {
  control: Control<BuyerPersona>;
}

export const DemographicsForm: React.FC<DemographicsFormProps> = ({ control }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={control}
        name="personaName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Nombre del Persona
            </FormLabel>
            <FormControl>
              <Input placeholder="Ej: María González" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Cargo/Título
            </FormLabel>
            <FormControl>
              <Input placeholder="Ej: Directora de Marketing" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="functionalArea"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Área Funcional</FormLabel>
            <FormControl>
              <Input placeholder="Ej: Marketing Digital" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="age"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Edad
            </FormLabel>
            <FormControl>
              <Input placeholder="Ej: 35-45 años" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Ubicación
            </FormLabel>
            <FormControl>
              <Input placeholder="Ej: Madrid, España" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="md:col-span-2">
        <FormField
          control={control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biografía</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe brevemente el trasfondo, experiencia y contexto personal/profesional de este persona..."
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};