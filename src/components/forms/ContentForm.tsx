import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { BuyerPersona } from '@/types/buyer-persona';
import { FileText, Share2, Filter, Search, Clock, Download } from 'lucide-react';

interface ContentFormProps {
  control: Control<BuyerPersona>;
}

const contentFields = [
  {
    name: 'trusted_info_sources' as keyof BuyerPersona,
    label: 'Fuentes de Información Confiables',
    placeholder: '¿Qué información y qué fuentes gozan de la confianza del cliente?',
    icon: FileText,
    description: 'Fuentes de información en las que confía',
    type: 'textarea'
  },
  {
    name: 'content_usage' as keyof BuyerPersona,
    label: 'Uso de Contenido',
    placeholder: '¿Cómo utilizan y comparten contenido?',
    icon: Share2,
    description: 'Forma en que consume y comparte información',
    type: 'textarea'
  },
  {
    name: 'content_affects_decision' as keyof BuyerPersona,
    label: 'Contenido y Decisión',
    placeholder: '¿Qué tipo de contenido afecta a la decisión de compra?',
    icon: Filter,
    description: 'Tipo de contenido que influye en sus decisiones',
    type: 'textarea'
  },
  {
    name: 'content_types_sought' as keyof BuyerPersona,
    label: 'Tipos de Contenido Buscados',
    placeholder: '¿Cuáles son los tipos de contenidos que los clientes buscan?',
    icon: Search,
    description: 'Formatos y tipos de contenido que prefiere',
    type: 'textarea'
  },
  {
    name: 'content_search_timing' as keyof BuyerPersona,
    label: 'Momento de Búsqueda',
    placeholder: '¿Cuándo los buscan?',
    icon: Clock,
    description: 'En qué momento del proceso busca información',
    type: 'input'
  },
  {
    name: 'info_acquisition_methods' as keyof BuyerPersona,
    label: 'Métodos de Adquisición',
    placeholder: '¿Cómo obtienen y reciben información nuestros clientes?',
    icon: Download,
    description: 'Canales y métodos para obtener información',
    type: 'textarea'
  },
  {
    name: 'interests' as keyof BuyerPersona,
    label: 'Intereses Generales',
    placeholder: 'Deportes, hobbies, libros, marcas, afiliaciones...',
    icon: FileText,
    description: 'Intereses personales y profesionales',
    type: 'textarea'
  },
  {
    name: 'goals' as keyof BuyerPersona,
    label: 'Objetivos Profesionales',
    placeholder: '¿Cuáles son sus objetivos y necesidades profesionales?',
    icon: FileText,
    description: 'Metas que quiere alcanzar en su carrera',
    type: 'textarea'
  },
  {
    name: 'pains' as keyof BuyerPersona,
    label: 'Dolores y Frustraciones',
    placeholder: '¿Cuáles son sus dolores y miedos profesionales?',
    icon: FileText,
    description: 'Problemas y frustraciones que enfrenta',
    type: 'textarea'
  },
  {
    name: 'quote' as keyof BuyerPersona,
    label: 'Frase Característica',
    placeholder: '¿Qué frase describiría mejor a este persona?',
    icon: FileText,
    description: 'Frase que representa su mentalidad',
    type: 'input'
  },
  {
    name: 'keyReasonToBuy' as keyof BuyerPersona,
    label: 'Razón Clave de Compra',
    placeholder: '¿Cuál es la razón principal por la que compraría tu producto/servicio?',
    icon: FileText,
    description: 'Principal motivador para la compra',
    type: 'textarea'
  },
  {
    name: 'dealMaker' as keyof BuyerPersona,
    label: 'Deal-Maker',
    placeholder: '¿Qué haría más probable cerrar un trato exitoso con este persona?',
    icon: FileText,
    description: 'Factores que facilitan el cierre',
    type: 'textarea'
  },
  {
    name: 'dealBreaker' as keyof BuyerPersona,
    label: 'Deal-Breaker',
    placeholder: '¿Qué acabaría con un trato en el acto con este persona?',
    icon: FileText,
    description: 'Factores que impiden el cierre',
    type: 'textarea'
  }
];

export const ContentForm: React.FC<ContentFormProps> = ({ control }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {contentFields.map((fieldConfig) => {
        const Icon = fieldConfig.icon;
        return (
          <FormField
            key={fieldConfig.name}
            control={control}
            name={fieldConfig.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {fieldConfig.label}
                </FormLabel>
                <p className="text-sm text-muted-foreground mb-2">
                  {fieldConfig.description}
                </p>
                <FormControl>
                  {fieldConfig.type === 'textarea' ? (
                    <Textarea
                      placeholder={fieldConfig.placeholder}
                      className="min-h-[100px]"
                      value={typeof field.value === 'string' ? field.value : ''}
                      onChange={field.onChange}
                    />
                  ) : (
                    <Input
                      placeholder={fieldConfig.placeholder}
                      value={typeof field.value === 'string' ? field.value : ''}
                      onChange={field.onChange}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      })}
    </div>
  );
};