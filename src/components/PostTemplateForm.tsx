import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Copy, Download, Sparkles, Plus, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PostTemplate, GeneratedPost } from '@/types/post-template';

// Templates predefinidos
const PREDEFINED_TEMPLATES: PostTemplate[] = [
  {
    id: '1',
    name: 'Promoción de Producto',
    platform: 'instagram',
    type: 'promotional',
    structure: 'Hook + Beneficio + Características + CTA',
    tone: 'Entusiasta y persuasivo',
    cta: 'Compra ahora / Conoce más',
    variables: ['PRODUCTO', 'BENEFICIO_PRINCIPAL', 'DESCUENTO'],
    example: '🎉 ¡Nueva colección disponible! Descubre [PRODUCTO] y disfruta [BENEFICIO_PRINCIPAL]. Por tiempo limitado: [DESCUENTO]% de descuento. ¡No te lo pierdas!',
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'Contenido Educativo',
    platform: 'linkedin',
    type: 'educational',
    structure: 'Problema + Solución + Tips + Invitación',
    tone: 'Profesional e informativo',
    cta: 'Aprende más / Comparte tu experiencia',
    variables: ['TEMA', 'PROBLEMA', 'SOLUCION'],
    example: '💡 ¿Luchas con [PROBLEMA]? Aquí está la solución: [SOLUCION]. 3 tips para dominar [TEMA]: 1) ... 2) ... 3) ... ¿Qué estrategia te funciona mejor?',
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'Engagement / Pregunta',
    platform: 'facebook',
    type: 'engagement',
    structure: 'Pregunta Abierta + Contexto + Invitación a Comentar',
    tone: 'Conversacional y amigable',
    cta: 'Cuéntanos en comentarios',
    variables: ['PREGUNTA', 'CONTEXTO'],
    example: '🤔 [PREGUNTA] Hemos notado que [CONTEXTO]. Queremos conocer tu opinión. ¡Cuéntanos en los comentarios! 👇',
    createdAt: new Date()
  },
  {
    id: '4',
    name: 'Historia de Cliente',
    platform: 'instagram',
    type: 'storytelling',
    structure: 'Situación Inicial + Desafío + Solución + Resultado',
    tone: 'Inspirador y emotivo',
    cta: 'Lee la historia completa / Tu puedes ser el siguiente',
    variables: ['CLIENTE', 'DESAFIO', 'RESULTADO'],
    example: '✨ Conoce la historia de [CLIENTE]. Enfrentaba [DESAFIO], pero con nuestra ayuda logró [RESULTADO]. Su transformación es increíble. 💪 ¡Tú también puedes lograrlo!',
    createdAt: new Date()
  },
  {
    id: '5',
    name: 'Anuncio de Novedad',
    platform: 'twitter',
    type: 'announcement',
    structure: 'Noticia + Detalles Clave + Acción',
    tone: 'Emocionante y directo',
    cta: 'Descubre más / Regístrate ahora',
    variables: ['NOVEDAD', 'DETALLES', 'BENEFICIO'],
    example: '🚀 ¡Gran noticia! Lanzamos [NOVEDAD]. [DETALLES] que te ayudará a [BENEFICIO]. Disponible desde hoy. 🔗',
    createdAt: new Date()
  },
  {
    id: '6',
    name: 'Video Explicativo (TikTok)',
    platform: 'tiktok',
    type: 'educational',
    structure: 'Hook Visual + Pasos + Resultado Final',
    tone: 'Dinámico y juvenil',
    cta: 'Guarda para después / Sígueme para más',
    variables: ['TEMA', 'PASOS', 'RESULTADO'],
    example: '⚡ Cómo [TEMA] en 3 pasos: 1️⃣ [PASO1] 2️⃣ [PASO2] 3️⃣ [PASO3]. El resultado: [RESULTADO] 🎯 ¿Lo probarás?',
    createdAt: new Date()
  }
];

export const PostTemplateForm = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<PostTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [additionalContext, setAdditionalContext] = useState('');
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTemplateSelect = (template: PostTemplate) => {
    setSelectedTemplate(template);
    setGeneratedPost(null);
    // Inicializar variables vacías
    const initialVars: Record<string, string> = {};
    template.variables.forEach(v => initialVars[v] = '');
    setVariables(initialVars);
  };

  const handleGeneratePost = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('template-generator', {
        body: {
          template: selectedTemplate,
          variables,
          additionalContext
        }
      });

      if (error) throw error;

      setGeneratedPost(data.post);
      toast.success('¡Post generado exitosamente!');
    } catch (error) {
      console.error('Error generating post:', error);
      toast.error('Error al generar el post. Intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado al portapapeles');
  };

  const downloadPost = () => {
    if (!generatedPost) return;
    
    const content = `${generatedPost.content}\n\n${generatedPost.hashtags.join(' ')}\n\n---\nSugerencias: ${generatedPost.suggestions}\nMejor momento: ${generatedPost.bestTimeToPost}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `post-${selectedTemplate?.platform}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Post descargado');
  };

  const getPlatformBadgeColor = (platform: string) => {
    const colors: Record<string, string> = {
      instagram: 'bg-pink-500',
      facebook: 'bg-blue-500',
      twitter: 'bg-sky-500',
      linkedin: 'bg-blue-700',
      tiktok: 'bg-black',
      youtube: 'bg-red-600'
    };
    return colors[platform] || 'bg-gray-500';
  };

  const getTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      promotional: 'bg-orange-500',
      educational: 'bg-green-500',
      engagement: 'bg-purple-500',
      storytelling: 'bg-indigo-500',
      announcement: 'bg-yellow-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">📝 Templates de Posts</h1>
          <p className="text-xl text-muted-foreground">
            Crea contenido profesional usando templates predefinidos y personalízalos con IA
          </p>
        </div>

        {/* Selección de Templates */}
        {!selectedTemplate ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PREDEFINED_TEMPLATES.map((template) => (
              <Card 
                key={template.id}
                className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                onClick={() => handleTemplateSelect(template)}
              >
                <CardHeader>
                  <div className="flex gap-2 mb-2">
                    <Badge className={`${getPlatformBadgeColor(template.platform)} text-white`}>
                      {template.platform}
                    </Badge>
                    <Badge className={`${getTypeBadgeColor(template.type)} text-white`}>
                      {template.type}
                    </Badge>
                  </div>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.structure}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>Tono:</strong> {template.tone}</p>
                    <p><strong>Variables:</strong> {template.variables.length}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Panel de Configuración */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Configurar Template</CardTitle>
                    <CardDescription>Completa las variables para personalizar tu post</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedTemplate(null)}>
                    Cambiar Template
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex gap-2 mb-2">
                    <Badge className={`${getPlatformBadgeColor(selectedTemplate.platform)} text-white`}>
                      {selectedTemplate.platform}
                    </Badge>
                    <Badge className={`${getTypeBadgeColor(selectedTemplate.type)} text-white`}>
                      {selectedTemplate.type}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-2">{selectedTemplate.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{selectedTemplate.structure}</p>
                  <p className="text-sm"><strong>Ejemplo:</strong> {selectedTemplate.example}</p>
                </div>

                {selectedTemplate.variables.map((variable) => (
                  <div key={variable}>
                    <Label htmlFor={variable}>{variable.replace(/_/g, ' ')}</Label>
                    <Input
                      id={variable}
                      value={variables[variable] || ''}
                      onChange={(e) => setVariables({...variables, [variable]: e.target.value})}
                      placeholder={`Ingresa ${variable.toLowerCase()}`}
                    />
                  </div>
                ))}

                <div>
                  <Label htmlFor="context">Contexto Adicional (Opcional)</Label>
                  <Textarea
                    id="context"
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                    placeholder="Agrega cualquier información adicional que quieras incluir..."
                    className="min-h-[100px]"
                  />
                </div>

                <Button 
                  onClick={handleGeneratePost} 
                  disabled={isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generando Post...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generar Post con IA
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Panel de Resultado */}
            <Card>
              <CardHeader>
                <CardTitle>Post Generado</CardTitle>
                <CardDescription>
                  {generatedPost ? 'Tu contenido está listo' : 'El contenido aparecerá aquí'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isGenerating && (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Loader2 className="h-12 w-12 animate-spin mb-4" />
                    <p>Generando tu post personalizado...</p>
                  </div>
                )}

                {!isGenerating && !generatedPost && (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Sparkles className="h-12 w-12 mb-4 opacity-50" />
                    <p>Completa las variables y genera tu post</p>
                  </div>
                )}

                {generatedPost && (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Contenido del Post</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generatedPost.content)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={generatedPost.content}
                        readOnly
                        className="min-h-[200px]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Hashtags Sugeridos</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generatedPost.hashtags.join(' '))}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
                        {generatedPost.hashtags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Sugerencias de Optimización</Label>
                      <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                        {generatedPost.suggestions}
                      </p>
                    </div>

                    <div>
                      <Label>Mejor Momento para Publicar</Label>
                      <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                        {generatedPost.bestTimeToPost}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={downloadPost} variant="outline" className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Descargar
                      </Button>
                      <Button 
                        onClick={() => copyToClipboard(`${generatedPost.content}\n\n${generatedPost.hashtags.join(' ')}`)}
                        className="flex-1"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar Todo
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
