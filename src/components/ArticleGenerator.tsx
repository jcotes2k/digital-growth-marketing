import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Sparkles, Copy, Download, Linkedin, Globe, BookOpen, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Article {
  id: string;
  title: string;
  platform: string;
  length: string;
  metaDescription: string;
  keywords: string[];
  outline: { heading: string; subheadings: string[] }[];
  introduction: string;
  body: string;
  conclusion: string;
  cta: string;
  createdAt: Date;
}

export const ArticleGenerator = () => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('linkedin');
  const [length, setLength] = useState('medium');
  const [tone, setTone] = useState('professional');
  const [keywords, setKeywords] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const { toast } = useToast();

  const platforms = [
    { value: 'linkedin', label: 'LinkedIn Article', icon: Linkedin },
    { value: 'blog', label: 'Blog Post', icon: Globe },
    { value: 'medium', label: 'Medium', icon: BookOpen },
  ];

  const lengths = [
    { value: 'short', label: 'Corto (500-800 palabras)' },
    { value: 'medium', label: 'Medio (1000-1500 palabras)' },
    { value: 'long', label: 'Largo (2000+ palabras)' },
  ];

  const tones = [
    { value: 'professional', label: 'Profesional' },
    { value: 'conversational', label: 'Conversacional' },
    { value: 'academic', label: 'Académico' },
    { value: 'inspirational', label: 'Inspiracional' },
    { value: 'storytelling', label: 'Narrativo' },
  ];

  const generateArticle = async () => {
    if (!topic.trim()) {
      toast({
        title: "Tema requerido",
        description: "Por favor ingresa el tema del artículo",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('article-generator', {
        body: { 
          topic, 
          platform, 
          length, 
          tone, 
          keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
          targetAudience 
        }
      });

      if (error) throw error;

      const newArticle: Article = {
        id: crypto.randomUUID(),
        title: data.title,
        platform,
        length,
        metaDescription: data.metaDescription,
        keywords: data.keywords || [],
        outline: data.outline || [],
        introduction: data.introduction,
        body: data.body,
        conclusion: data.conclusion,
        cta: data.cta,
        createdAt: new Date()
      };

      setArticles(prev => [newArticle, ...prev]);
      setSelectedArticle(newArticle);
      toast({ title: "Artículo generado", description: "Tu artículo ha sido creado" });
      setTopic('');
    } catch (error) {
      console.error('Error generating article:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el artículo. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado", description: "Texto copiado al portapapeles" });
  };

  const copyFullArticle = (article: Article) => {
    const fullText = `${article.title}

${article.introduction}

${article.body}

${article.conclusion}

${article.cta}`;
    copyToClipboard(fullText);
  };

  const downloadArticle = (article: Article) => {
    const content = `
${article.title}
${'='.repeat(article.title.length)}

Meta Description: ${article.metaDescription}
Keywords: ${article.keywords.join(', ')}

---

${article.introduction}

${article.body}

${article.conclusion}

---
${article.cta}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `articulo-${article.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getWordCount = (text: string) => text.split(/\s+/).filter(w => w).length;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Generador de Artículos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tema del Artículo</Label>
            <Textarea
              placeholder="Ej: Cómo implementar una estrategia de marketing de contenidos efectiva..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Plataforma</Label>
            <div className="grid grid-cols-3 gap-2">
              {platforms.map(p => {
                const Icon = p.icon;
                return (
                  <Card
                    key={p.value}
                    className={`cursor-pointer transition-all p-3 ${platform === p.value ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setPlatform(p.value)}
                  >
                    <div className="text-center">
                      <Icon className="h-6 w-6 mx-auto mb-1" />
                      <p className="text-sm font-medium">{p.label}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Longitud</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {lengths.map(l => (
                    <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tono</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tones.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Keywords SEO (separadas por coma)</Label>
              <Input
                placeholder="marketing digital, contenido, estrategia"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Audiencia Objetivo</Label>
              <Input
                placeholder="Ej: Emprendedores y dueños de PYMES"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>
          </div>

          <Button 
            onClick={generateArticle} 
            disabled={isGenerating || !topic.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Generando artículo...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generar Artículo
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {selectedArticle && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-xl">{selectedArticle.title}</CardTitle>
              <div className="flex gap-2">
                <Badge>{selectedArticle.platform}</Badge>
                <Badge variant="outline">
                  {getWordCount(selectedArticle.introduction + selectedArticle.body + selectedArticle.conclusion)} palabras
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="preview">Vista Previa</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="outline">Estructura</TabsTrigger>
                <TabsTrigger value="raw">Texto Plano</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="mt-4">
                <ScrollArea className="h-[500px]">
                  <article className="prose prose-sm max-w-none">
                    <h1 className="text-2xl font-bold mb-4">{selectedArticle.title}</h1>
                    
                    <div className="text-lg leading-relaxed mb-6 text-muted-foreground italic">
                      {selectedArticle.introduction}
                    </div>

                    <div className="whitespace-pre-line mb-6">
                      {selectedArticle.body}
                    </div>

                    <div className="font-medium mb-4">
                      {selectedArticle.conclusion}
                    </div>

                    <div className="p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
                      <p className="font-semibold">{selectedArticle.cta}</p>
                    </div>
                  </article>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="seo" className="mt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Meta Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm">{selectedArticle.metaDescription}</p>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(selectedArticle.metaDescription)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2">
                      <Badge variant={selectedArticle.metaDescription.length <= 160 ? "default" : "destructive"}>
                        {selectedArticle.metaDescription.length}/160 caracteres
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.keywords.map((kw, i) => (
                        <Badge key={i} variant="secondary">{kw}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="outline" className="mt-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {selectedArticle.outline.map((section, index) => (
                        <div key={index} className="border-l-2 border-primary pl-4">
                          <h3 className="font-semibold text-lg">{section.heading}</h3>
                          {section.subheadings.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {section.subheadings.map((sub, i) => (
                                <li key={i} className="text-sm text-muted-foreground">• {sub}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="raw" className="mt-4">
                <Card>
                  <CardContent className="pt-4">
                    <ScrollArea className="h-[400px]">
                      <pre className="whitespace-pre-wrap text-sm font-mono">
{`${selectedArticle.title}

${selectedArticle.introduction}

${selectedArticle.body}

${selectedArticle.conclusion}

${selectedArticle.cta}`}
                      </pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => copyFullArticle(selectedArticle)} className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copiar Artículo
              </Button>
              <Button variant="outline" onClick={() => downloadArticle(selectedArticle)} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
