import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, Copy, Download, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ContentGeneratorFormData {
  contentType: string;
  topic: string;
  tone: string;
  audience: string;
}

export const ContentGeneratorForm = () => {
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContentGeneratorFormData>({
    defaultValues: {
      contentType: '',
      topic: '',
      tone: '',
      audience: '',
    },
  });

  const contentTypes = [
    { value: 'social-post', label: 'Post para Redes Sociales' },
    { value: 'blog-post', label: 'Artículo de Blog' },
    { value: 'email', label: 'Email Marketing' },
    { value: 'ad-copy', label: 'Copy para Anuncios' },
    { value: 'product-description', label: 'Descripción de Producto' },
    { value: 'landing-page', label: 'Texto para Landing Page' },
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'video-script', label: 'Guion para Video' },
  ];

  const tones = [
    { value: 'professional', label: 'Profesional' },
    { value: 'casual', label: 'Casual' },
    { value: 'friendly', label: 'Amigable' },
    { value: 'persuasive', label: 'Persuasivo' },
    { value: 'educational', label: 'Educativo' },
    { value: 'humorous', label: 'Divertido' },
    { value: 'inspiring', label: 'Inspirador' },
    { value: 'urgent', label: 'Urgente' },
  ];

  const onSubmit = async (data: ContentGeneratorFormData) => {
    setIsGenerating(true);
    setGeneratedContent('');

    try {
      // Obtener datos estratégicos del localStorage (si existen)
      const strategicData = {
        buyerPersona: localStorage.getItem('buyerPersonaData'),
        contentStrategy: localStorage.getItem('contentStrategyData'),
        intelligentStrategy: localStorage.getItem('intelligentContentStrategyData'),
      };

      const { data: functionData, error: functionError } = await supabase.functions.invoke('content-generator', {
        body: {
          contentType: data.contentType,
          topic: data.topic,
          tone: data.tone,
          audience: data.audience,
          strategy: strategicData,
        }
      });

      if (functionError) {
        throw functionError;
      }

      setGeneratedContent(functionData.content);
      toast({
        title: "Contenido generado exitosamente",
        description: "Tu contenido está listo para usar",
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error al generar contenido",
        description: "Por favor intenta nuevamente",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      toast({
        title: "Copiado al portapapeles",
        description: "El contenido ha sido copiado",
      });
    } catch (error) {
      toast({
        title: "Error al copiar",
        description: "No se pudo copiar el contenido",
        variant: "destructive",
      });
    }
  };

  const downloadAsText = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contenido-generado.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Archivo descargado",
      description: "El contenido se ha guardado como archivo de texto",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Generador de Contenido con IA</h1>
        <p className="text-muted-foreground">
          Crea contenido personalizado usando la estrategia y datos que has definido
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configuración del Contenido</CardTitle>
            <CardDescription>
              Define qué tipo de contenido necesitas y sus características
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="contentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Contenido</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo de contenido" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {contentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tema o Tópico</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Lanzamiento de nuevo producto, tips de productividad..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tono de Comunicación</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tono" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tones.map((tone) => (
                            <SelectItem key={tone.value} value={tone.value}>
                              {tone.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audiencia Específica (Opcional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: emprendedores jóvenes, profesionales de marketing..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generando contenido...
                    </>
                  ) : (
                    'Generar Contenido'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contenido Generado</CardTitle>
            <CardDescription>
              Aquí aparecerá tu contenido personalizado
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedContent ? (
              <div className="space-y-4">
                <Textarea
                  value={generatedContent}
                  readOnly
                  className="min-h-[300px] resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar
                  </Button>
                  <Button
                    onClick={downloadAsText}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Descargar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="min-h-[300px] flex items-center justify-center text-muted-foreground">
                {isGenerating ? (
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p>Generando tu contenido personalizado...</p>
                  </div>
                ) : (
                  <p>El contenido generado aparecerá aquí</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};