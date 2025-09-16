import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ContentStrategy } from '@/types/content-strategy';
import { Facebook, Twitter, Youtube, Instagram, Linkedin, MessageCircle, Camera, Users } from 'lucide-react';

interface ChannelsFormProps {
  control: Control<ContentStrategy>;
}

export const ChannelsForm = ({ control }: ChannelsFormProps) => {
  const socialChannels = [
    { key: 'facebook', label: 'Facebook', icon: Facebook },
    { key: 'twitter', label: 'Twitter', icon: Twitter },
    { key: 'youtube', label: 'YouTube', icon: Youtube },
    { key: 'instagram', label: 'Instagram', icon: Instagram },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { key: 'pinterest', label: 'Pinterest', icon: MessageCircle },
    { key: 'tiktok', label: 'TikTok', icon: Camera },
    { key: 'snapchat', label: 'Snapchat', icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormLabel>Canales</FormLabel>
        <p className="text-sm text-muted-foreground">Selecciona qué canales quieres aprovechar</p>
        
        <div className="grid grid-cols-2 gap-4">
          {socialChannels.map(({ key, label, icon: Icon }) => (
            <FormField
              key={key}
              control={control}
              name={`channels.${key}` as any}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value as boolean}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      {label}
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          ))}
        </div>

        <FormField
          control={control}
          name="channels.other"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Otros canales</FormLabel>
              <FormControl>
                <Input
                  placeholder="Especifica otros canales..."
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