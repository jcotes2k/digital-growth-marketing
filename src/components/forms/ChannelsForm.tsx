import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { BuyerPersona } from '@/types/buyer-persona';
import { Tv, Smartphone, Mail, UserCheck, MapPin } from 'lucide-react';

interface ChannelsFormProps {
  control: Control<BuyerPersona>;
}

const channelOptions = [
  {
    key: 'traditionalMedia' as keyof BuyerPersona['preferredChannels'],
    label: 'Medios Tradicionales',
    description: 'TV, radio, prensa escrita, publicidad exterior',
    icon: Tv
  },
  {
    key: 'onlineSocialMobile' as keyof BuyerPersona['preferredChannels'],
    label: 'Online, Social y Móvil',
    description: 'Redes sociales, websites, aplicaciones móviles, contenido digital',
    icon: Smartphone
  },
  {
    key: 'emailPhone' as keyof BuyerPersona['preferredChannels'],
    label: 'Email y Teléfono',
    description: 'Comunicación directa por correo electrónico y llamadas telefónicas',
    icon: Mail
  },
  {
    key: 'referrals' as keyof BuyerPersona['preferredChannels'],
    label: 'Referencias',
    description: 'Recomendaciones de colegas, amigos, testimonios y word-of-mouth',
    icon: UserCheck
  },
  {
    key: 'faceToFacePhysical' as keyof BuyerPersona['preferredChannels'],
    label: 'Cara a Cara / Eventos Físicos',
    description: 'Reuniones presenciales, conferencias, ferias comerciales, networking',
    icon: MapPin
  }
];

export const ChannelsForm: React.FC<ChannelsFormProps> = ({ control }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-muted-foreground">
          Selecciona los canales de comunicación que prefiere tu buyer persona
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {channelOptions.map((channel) => {
          const Icon = channel.icon;
          return (
            <FormField
              key={channel.key}
              control={control}
              name={`preferredChannels.${channel.key}`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 transition-colors">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none flex-1">
                    <FormLabel className="flex items-center gap-2 font-medium cursor-pointer">
                      <Icon className="h-4 w-4" />
                      {channel.label}
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {channel.description}
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
      </div>
    </div>
  );
};