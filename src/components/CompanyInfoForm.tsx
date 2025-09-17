import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CompanyInfo } from '@/types/company-info';
import { Building2, Globe, Facebook, Instagram, Music, Youtube, Twitter } from 'lucide-react';

interface CompanyInfoFormProps {
  onNext: (data: CompanyInfo) => void;
}

export const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({ onNext }) => {
  const form = useForm<CompanyInfo>({
    defaultValues: {
      companyName: '',
      facebook: '',
      instagram: '',
      tiktok: '',
      youtube: '',
      twitter: '',
      website: '',
    },
  });

  const onSubmit = (data: CompanyInfo) => {
    onNext(data);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Información de la Empresa</h1>
          <p className="text-xl text-muted-foreground">
            Comencemos registrando la información básica de tu empresa, emprendimiento o marca personal
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Datos Básicos
            </CardTitle>
            <CardDescription>
              Ingresa el nombre de tu empresa y los enlaces a tus redes sociales (opcional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  rules={{ required: 'El nombre de la empresa es obligatorio' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Nombre de la Empresa / Emprendimiento / Marca Personal *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ej: Mi Empresa SAS, Juan Pérez - Coach, etc."
                          {...field}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <Label className="text-base font-medium">Redes Sociales (Opcional)</Label>
                  
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Sitio Web
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://www.miempresa.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Facebook className="w-4 h-4" />
                          Facebook
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://www.facebook.com/miempresa"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Instagram className="w-4 h-4" />
                          Instagram
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://www.instagram.com/miempresa"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tiktok"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Music className="w-4 h-4" />
                          TikTok
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://www.tiktok.com/@miempresa"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="youtube"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Youtube className="w-4 h-4" />
                          YouTube
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://www.youtube.com/@miempresa"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Twitter className="w-4 h-4" />
                          Twitter (X)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://twitter.com/miempresa"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" size="lg" className="min-w-[200px]">
                    Continuar al Buyer Persona
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};