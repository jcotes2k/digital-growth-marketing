import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Copy, Download, Calendar as CalendarIcon, Star, RefreshCw, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ContentVariant } from '@/types/content-variant';

interface ContentGeneratorFormData {
  contentType: string;
  topic: string;
  tone: string;
  audience: string;
}

export const ContentGeneratorForm = () => {
  const [variants, setVariants] = useState<ContentVariant[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
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
    setVariants([]);
    setSelectedVariantId(null);

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

      setVariants(functionData.variants);
      setSelectedVariantId(functionData.variants[0]?.id || null);
      toast({
        title: "Variantes generadas exitosamente",
        description: `Se generaron ${functionData.variants.length} variantes de contenido`,
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

  const toggleFavorite = (variantId: string) => {
    setVariants(prev => prev.map(v => 
      v.id === variantId ? { ...v, isFavorite: !v.isFavorite } : v
    ));
  };

  const copyVariantToClipboard = async (variant: ContentVariant) => {
    try {
      await navigator.clipboard.writeText(variant.content);
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

  const downloadVariantAsText = (variant: ContentVariant) => {
    const blob = new Blob([variant.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contenido-${variant.style.toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Archivo descargado",
      description: "El contenido se ha guardado como archivo de texto",
    });
  };

  const selectedVariant = variants.find(v => v.id === selectedVariantId);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Generador de Contenido Multi-Variante con IA</h1>
        <p className="text-muted-foreground">
          Genera 3-5 variantes de contenido con diferentes estilos y elige la mejor
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Configuración del Contenido</CardTitle>
            <CardDescription>
              Define qué tipo de contenido necesitas
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
                            <SelectValue placeholder="Selecciona el tipo" />
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
                          placeholder="Ej: Lanzamiento de producto..."
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
                      <FormLabel>Tono Base</FormLabel>
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
                      <FormLabel>Audiencia (Opcional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: emprendedores jóvenes..."
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
                      Generando variantes...
                    </>
                  ) : (
                    'Generar 3-5 Variantes'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {isGenerating && (
            <Card>
              <CardContent className="min-h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-lg font-medium">Generando variantes de contenido...</p>
                  <p className="text-sm text-muted-foreground mt-2">Esto puede tomar unos segundos</p>
                </div>
              </CardContent>
            </Card>
          )}

          {!isGenerating && variants.length === 0 && (
            <Card>
              <CardContent className="min-h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p className="text-lg">Las variantes aparecerán aquí</p>
                  <p className="text-sm mt-2">Configura los parámetros y genera contenido</p>
                </div>
              </CardContent>
            </Card>
          )}

          {variants.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {variants.length} Variantes Generadas
                </h2>
                <Badge variant="secondary">
                  {variants.filter(v => v.isFavorite).length} favoritas
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {variants.map((variant) => (
                  <Card 
                    key={variant.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedVariantId === variant.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedVariantId(variant.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {variant.style}
                            {variant.isFavorite && (
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {variant.bestFor}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(variant.id);
                          }}
                        >
                          <Star 
                            className={`h-4 w-4 ${
                              variant.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''
                            }`} 
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        value={variant.content}
                        readOnly
                        className="min-h-[150px] resize-none text-sm"
                      />
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{variant.characterCount} caracteres</span>
                        {variant.hashtags.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            {variant.hashtags.length} hashtags
                          </span>
                        )}
                      </div>

                      {variant.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {variant.hashtags.slice(0, 3).map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {variant.hashtags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{variant.hashtags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyVariantToClipboard(variant);
                          }}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Copy className="mr-2 h-3 w-3" />
                          Copiar
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadVariantAsText(variant);
                          }}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Download className="mr-2 h-3 w-3" />
                          Descargar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedVariant && (
                <Card>
                  <CardHeader>
                    <CardTitle>Vista Detallada - {selectedVariant.style}</CardTitle>
                    <CardDescription>
                      {selectedVariant.bestFor}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={selectedVariant.content}
                      readOnly
                      className="min-h-[200px] resize-none"
                    />
                    
                    {selectedVariant.hashtags.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Hashtags sugeridos:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedVariant.hashtags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyVariantToClipboard(selectedVariant)}
                        variant="outline"
                        className="flex-1"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar
                      </Button>
                      <Button
                        onClick={() => downloadVariantAsText(selectedVariant)}
                        variant="outline"
                        className="flex-1"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Descargar
                      </Button>
                      <Button
                        onClick={() => {
                          localStorage.setItem('generatedContent', JSON.stringify({
                            content: selectedVariant.content,
                            contentType: form.getValues('contentType'),
                            topic: form.getValues('topic'),
                            tone: form.getValues('tone'),
                            style: selectedVariant.style
                          }));
                          window.location.hash = 'editorial-calendar';
                          window.location.reload();
                        }}
                        className="flex-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Programar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};