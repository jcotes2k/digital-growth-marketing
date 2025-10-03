import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Copy, Download, Calendar as CalendarIcon, Star, RefreshCw, Hash, Sparkles, Award, TrendingUp, Eye, Zap, History, CalendarPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ContentVariant } from '@/types/content-variant';
import { analyzeContentQuality, getScoreColor, getScoreBadgeVariant, getScoreLabel, ContentScore } from '@/utils/content-scorer';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentHistory } from './ContentHistory';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

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
  const [adaptedContent, setAdaptedContent] = useState<Record<string, ContentVariant>>({});
  const [adaptingTo, setAdaptingTo] = useState<string | null>(null);
  const [contentScores, setContentScores] = useState<Record<string, ContentScore>>({});
  const [activeTab, setActiveTab] = useState('generator');
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [variantToSchedule, setVariantToSchedule] = useState<ContentVariant | null>(null);
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState('12:00');
  const [schedulePlatform, setSchedulePlatform] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
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
      
      // Analyze content quality for each variant
      const scores: Record<string, ContentScore> = {};
      functionData.variants.forEach((variant: ContentVariant) => {
        scores[variant.id] = analyzeContentQuality(variant.content, variant.hashtags);
      });
      setContentScores(scores);
      
      // Save variants to database
      await saveVariantsToHistory(functionData.variants, data.topic, scores);
      
      toast({
        title: "Variantes generadas exitosamente",
        description: `Se generaron ${functionData.variants.length} variantes de contenido con análisis de calidad`,
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

  const saveVariantsToHistory = async (variants: ContentVariant[], topic: string, scores: Record<string, ContentScore>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const recordsToInsert = variants.map(variant => ({
        user_id: user.id,
        content: variant.content,
        style: variant.style,
        platform: variant.bestFor || null,
        hashtags: variant.hashtags,
        score_data: scores[variant.id] as any,
        topic: topic,
      }));

      const { error } = await supabase
        .from('generated_content')
        .insert(recordsToInsert);

      if (error) {
        console.error('Error inserting records:', error);
        return;
      }

      setHistoryRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error saving to history:', error);
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

  const adaptToPlatform = async (variant: ContentVariant, platform: string) => {
    setAdaptingTo(platform);
    try {
      const { data, error } = await supabase.functions.invoke('content-generator', {
        body: {
          adaptTo: platform,
          existingContent: variant.content,
        }
      });

      if (error) throw error;

      const adaptedVariant = data.variants[0];
      setAdaptedContent(prev => ({
        ...prev,
        [platform]: {
          ...adaptedVariant,
          id: `adapted-${platform}`,
        }
      }));

      toast({
        title: "Contenido adaptado",
        description: `Contenido optimizado para ${platform}`,
      });
    } catch (error: any) {
      console.error('Error adapting content:', error);
      toast({
        title: "Error al adaptar",
        description: error.message || 'No se pudo adaptar el contenido',
        variant: "destructive",
      });
    } finally {
      setAdaptingTo(null);
    }
  };

  const platforms = [
    { id: 'instagram', name: 'Instagram', chars: '2200', color: 'bg-pink-500' },
    { id: 'linkedin', name: 'LinkedIn', chars: '3000', color: 'bg-blue-600' },
    { id: 'twitter', name: 'Twitter/X', chars: '280', color: 'bg-black' },
    { id: 'facebook', name: 'Facebook', chars: '500', color: 'bg-blue-500' },
    { id: 'tiktok', name: 'TikTok', chars: '2200', color: 'bg-slate-900' },
  ];

  const selectedVariant = variants.find(v => v.id === selectedVariantId);

  const handleReuseContent = (content: string, hashtags: string[]) => {
    form.setValue('topic', content.substring(0, 100));
    setActiveTab('generator');
    toast({
      title: "Contenido reutilizado",
      description: "El tema se ha copiado al generador",
    });
  };

  const openScheduleDialog = (variant: ContentVariant) => {
    setVariantToSchedule(variant);
    setSchedulePlatform(variant.bestFor || '');
    setScheduleDialogOpen(true);
  };

  const scheduleToCalendar = async () => {
    if (!variantToSchedule || !scheduleDate || !schedulePlatform) {
      toast({
        title: "Faltan datos",
        description: "Por favor selecciona fecha y plataforma",
        variant: "destructive",
      });
      return;
    }

    setIsScheduling(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "No autenticado",
          description: "Debes iniciar sesión para programar publicaciones",
          variant: "destructive",
        });
        return;
      }

      const [hours, minutes] = scheduleTime.split(':');
      const scheduledDateTime = new Date(scheduleDate);
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const { error } = await supabase.from('editorial_calendar').insert({
        user_id: user.id,
        title: `Post ${variantToSchedule.style}`,
        content: variantToSchedule.content,
        platform: schedulePlatform,
        content_type: 'social-post',
        scheduled_date: format(scheduleDate, 'yyyy-MM-dd'),
        scheduled_time: scheduleTime,
        status: 'planned',
        tags: variantToSchedule.hashtags,
        generated_by_ai: true,
      });

      if (error) throw error;

      toast({
        title: "Programado exitosamente",
        description: `Publicación programada para ${format(scheduleDate, 'PPP', { locale: es })} a las ${scheduleTime}`,
      });

      setScheduleDialogOpen(false);
      setVariantToSchedule(null);
      setScheduleDate(undefined);
      setScheduleTime('12:00');
      setSchedulePlatform('');
    } catch (error: any) {
      console.error('Error scheduling:', error);
      toast({
        title: "Error al programar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Generador de Contenido Multi-Variante con IA</h1>
        <p className="text-muted-foreground">
          Genera variantes de contenido con diferentes estilos y gestiona tu historial
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="generator">
            <Sparkles className="h-4 w-4 mr-2" />
            Generador
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            Historial ({historyRefreshTrigger})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-8">

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
                {variants.map((variant) => {
                  const score = contentScores[variant.id];
                  return (
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
                              {score && (
                                <Badge variant={getScoreBadgeVariant(score.overall)} className="ml-auto">
                                  <Award className="h-3 w-3 mr-1" />
                                  {score.overall}
                                </Badge>
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
                        
                        {score && (
                          <div className="grid grid-cols-3 gap-2 mt-3">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="text-center p-2 bg-muted rounded">
                                    <TrendingUp className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                                    <div className={`text-xs font-semibold ${getScoreColor(score.seo)}`}>
                                      {score.seo}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">SEO</div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Optimización para motores de búsqueda</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="text-center p-2 bg-muted rounded">
                                    <Eye className="h-4 w-4 mx-auto mb-1 text-green-600" />
                                    <div className={`text-xs font-semibold ${getScoreColor(score.readability)}`}>
                                      {score.readability}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">Legibilidad</div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Facilidad de lectura y comprensión</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="text-center p-2 bg-muted rounded">
                                    <Zap className="h-4 w-4 mx-auto mb-1 text-purple-600" />
                                    <div className={`text-xs font-semibold ${getScoreColor(score.engagement)}`}>
                                      {score.engagement}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">Engagement</div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Potencial de interacción y engagement</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
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
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            openScheduleDialog(variant);
                          }}
                          variant="default"
                          size="sm"
                          className="flex-1"
                        >
                          <CalendarPlus className="mr-2 h-3 w-3" />
                          Programar
                        </Button>
                      </div>
                    </CardContent>
                    </Card>
                  );
                })}
              </div>

              {selectedVariant && (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle>Vista Detallada - {selectedVariant.style}</CardTitle>
                        <CardDescription>
                          {selectedVariant.bestFor}
                        </CardDescription>
                      </div>
                      {contentScores[selectedVariant.id] && (
                        <Badge variant={getScoreBadgeVariant(contentScores[selectedVariant.id].overall)} className="text-lg px-4 py-2">
                          <Award className="h-5 w-5 mr-2" />
                          {contentScores[selectedVariant.id].overall} / 100
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {contentScores[selectedVariant.id] && (
                      <Card className="bg-muted/50">
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Análisis de Calidad - {getScoreLabel(contentScores[selectedVariant.id].overall)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  SEO
                                </span>
                                <span className={`font-semibold ${getScoreColor(contentScores[selectedVariant.id].seo)}`}>
                                  {contentScores[selectedVariant.id].seo}/100
                                </span>
                              </div>
                              <Progress value={contentScores[selectedVariant.id].seo} className="h-2" />
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  Legibilidad
                                </span>
                                <span className={`font-semibold ${getScoreColor(contentScores[selectedVariant.id].readability)}`}>
                                  {contentScores[selectedVariant.id].readability}/100
                                </span>
                              </div>
                              <Progress value={contentScores[selectedVariant.id].readability} className="h-2" />
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="flex items-center gap-1">
                                  <Zap className="h-3 w-3" />
                                  Engagement
                                </span>
                                <span className={`font-semibold ${getScoreColor(contentScores[selectedVariant.id].engagement)}`}>
                                  {contentScores[selectedVariant.id].engagement}/100
                                </span>
                              </div>
                              <Progress value={contentScores[selectedVariant.id].engagement} className="h-2" />
                            </div>
                          </div>
                          
                          {contentScores[selectedVariant.id].suggestions.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                              <p className="text-sm font-medium mb-2">💡 Sugerencias de Mejora:</p>
                              <ul className="space-y-1">
                                {contentScores[selectedVariant.id].suggestions.map((suggestion, idx) => (
                                  <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    <span>{suggestion}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                    
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

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Adaptar para Plataforma
                        </h4>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                        {platforms.map((platform) => (
                          <Button
                            key={platform.id}
                            variant="outline"
                            size="sm"
                            onClick={() => adaptToPlatform(selectedVariant, platform.id)}
                            disabled={adaptingTo === platform.id}
                            className="w-full"
                          >
                            {adaptingTo === platform.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              platform.name
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>

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

              {Object.keys(adaptedContent).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Contenido Adaptado por Plataforma</CardTitle>
                    <CardDescription>
                      Versiones optimizadas para cada red social
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(adaptedContent).map(([platform, variant]) => {
                      const platformInfo = platforms.find(p => p.id === platform);
                      return (
                        <Card key={platform} className="border-2">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge className={platformInfo?.color}>
                                  {platformInfo?.name}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {variant.characterCount} / {platformInfo?.chars} caracteres
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyVariantToClipboard(variant)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => downloadVariantAsText(variant)}
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <Textarea
                              value={variant.content}
                              readOnly
                              className="min-h-[120px] resize-none text-sm"
                            />

                            {variant.hashtags && variant.hashtags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {variant.hashtags.map((tag, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
        </TabsContent>

        <TabsContent value="history">
          <ContentHistory onReuseContent={handleReuseContent} key={historyRefreshTrigger} />
        </TabsContent>
      </Tabs>

      {/* Diálogo para programar en calendario */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Programar Publicación</DialogTitle>
            <DialogDescription>
              Selecciona fecha, hora y plataforma para esta publicación
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {variantToSchedule && (
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium mb-1">{variantToSchedule.style}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {variantToSchedule.content}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha de publicación</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !scheduleDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduleDate ? format(scheduleDate, 'PPP', { locale: es }) : <span>Selecciona una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={scheduleDate}
                    onSelect={setScheduleDate}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Hora de publicación</label>
              <Input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Plataforma</label>
              <Select value={schedulePlatform} onValueChange={setSchedulePlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la plataforma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Twitter">Twitter/X</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setScheduleDialogOpen(false)}
              className="flex-1"
              disabled={isScheduling}
            >
              Cancelar
            </Button>
            <Button
              onClick={scheduleToCalendar}
              className="flex-1"
              disabled={isScheduling || !scheduleDate || !schedulePlatform}
            >
              {isScheduling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Programando...
                </>
              ) : (
                <>
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Programar
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};