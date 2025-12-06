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
import { Video, Sparkles, Clock, Copy, Download, Film, Clapperboard, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VideoScript {
  id: string;
  title: string;
  platform: string;
  duration: string;
  hook: string;
  script: string;
  scenes: { time: string; visual: string; audio: string; text: string }[];
  cta: string;
  createdAt: Date;
}

export const VideoScriptGenerator = () => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('tiktok');
  const [duration, setDuration] = useState('30');
  const [tone, setTone] = useState('entertaining');
  const [objective, setObjective] = useState('engagement');
  const [isGenerating, setIsGenerating] = useState(false);
  const [scripts, setScripts] = useState<VideoScript[]>([]);
  const [selectedScript, setSelectedScript] = useState<VideoScript | null>(null);
  const { toast } = useToast();

  const platforms = [
    { value: 'tiktok', label: 'TikTok', maxDuration: '180' },
    { value: 'instagram-reels', label: 'Instagram Reels', maxDuration: '90' },
    { value: 'youtube-shorts', label: 'YouTube Shorts', maxDuration: '60' },
    { value: 'youtube', label: 'YouTube', maxDuration: '600' },
    { value: 'facebook', label: 'Facebook', maxDuration: '120' },
    { value: 'linkedin', label: 'LinkedIn', maxDuration: '120' },
  ];

  const durations = [
    { value: '15', label: '15 segundos' },
    { value: '30', label: '30 segundos' },
    { value: '60', label: '1 minuto' },
    { value: '120', label: '2 minutos' },
    { value: '300', label: '5 minutos' },
    { value: '600', label: '10 minutos' },
  ];

  const tones = [
    { value: 'entertaining', label: 'Entretenido' },
    { value: 'educational', label: 'Educativo' },
    { value: 'inspirational', label: 'Inspiracional' },
    { value: 'professional', label: 'Profesional' },
    { value: 'casual', label: 'Casual' },
    { value: 'urgent', label: 'Urgente' },
  ];

  const objectives = [
    { value: 'engagement', label: 'Engagement' },
    { value: 'awareness', label: 'Brand Awareness' },
    { value: 'conversion', label: 'Conversión' },
    { value: 'education', label: 'Educar' },
    { value: 'entertainment', label: 'Entretener' },
  ];

  const generateScript = async () => {
    if (!topic.trim()) {
      toast({
        title: "Tema requerido",
        description: "Por favor ingresa el tema del video",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('video-script-generator', {
        body: { topic, platform, duration, tone, objective }
      });

      if (error) throw error;

      const newScript: VideoScript = {
        id: crypto.randomUUID(),
        title: data.title,
        platform,
        duration,
        hook: data.hook,
        script: data.script,
        scenes: data.scenes || [],
        cta: data.cta,
        createdAt: new Date()
      };

      setScripts(prev => [newScript, ...prev]);
      setSelectedScript(newScript);
      toast({ title: "Guión generado", description: "Tu guión de video ha sido creado" });
      setTopic('');
    } catch (error) {
      console.error('Error generating script:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el guión. Inténtalo de nuevo.",
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

  const downloadScript = (script: VideoScript) => {
    const content = `
GUIÓN DE VIDEO: ${script.title}
Plataforma: ${script.platform}
Duración: ${script.duration}s

HOOK (Primeros 3 segundos):
${script.hook}

GUIÓN COMPLETO:
${script.script}

ESCENAS:
${script.scenes.map((s, i) => `
Escena ${i + 1} (${s.time}):
- Visual: ${s.visual}
- Audio: ${s.audio}
- Texto en pantalla: ${s.text}
`).join('\n')}

CALL TO ACTION:
${script.cta}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guion-${script.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-6 w-6" />
            Generador de Guiones de Video
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tema del Video</Label>
              <Textarea
                placeholder="Ej: 5 tips para mejorar tu productividad..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Plataforma</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map(p => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Duración</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map(d => (
                        <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
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
                <div className="space-y-2">
                  <Label>Objetivo</Label>
                  <Select value={objective} onValueChange={setObjective}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {objectives.map(o => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={generateScript} 
            disabled={isGenerating || !topic.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Generando guión...
              </>
            ) : (
              <>
                <Clapperboard className="h-4 w-4 mr-2" />
                Generar Guión de Video
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {selectedScript && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Film className="h-5 w-5" />
                {selectedScript.title}
              </CardTitle>
              <div className="flex gap-2">
                <Badge>{selectedScript.platform}</Badge>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {selectedScript.duration}s
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="script">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="script">Guión</TabsTrigger>
                <TabsTrigger value="scenes">Escenas</TabsTrigger>
                <TabsTrigger value="storyboard">Storyboard</TabsTrigger>
              </TabsList>

              <TabsContent value="script" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Hook (Primeros 3 segundos)
                      </h4>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(selectedScript.hook)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-lg font-medium">{selectedScript.hook}</p>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Guión Completo</h4>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(selectedScript.script)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="whitespace-pre-line">{selectedScript.script}</p>
                  </div>

                  <div className="p-4 bg-green-500/10 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Call to Action</h4>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(selectedScript.cta)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="font-medium">{selectedScript.cta}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="scenes" className="mt-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {selectedScript.scenes.map((scene, index) => (
                      <Card key={index}>
                        <CardHeader className="py-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">Escena {index + 1}</CardTitle>
                            <Badge variant="outline">{scene.time}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2 space-y-2">
                          <div>
                            <span className="text-xs text-muted-foreground">Visual:</span>
                            <p className="text-sm">{scene.visual}</p>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">Audio/Voz:</span>
                            <p className="text-sm">{scene.audio}</p>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">Texto en pantalla:</span>
                            <p className="text-sm font-medium">{scene.text}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="storyboard" className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedScript.scenes.map((scene, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="h-24 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                        <Film className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="secondary" className="text-xs">Escena {index + 1}</Badge>
                          <span className="text-xs text-muted-foreground">{scene.time}</span>
                        </div>
                        <p className="text-xs line-clamp-2">{scene.visual}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => copyToClipboard(selectedScript.script)} className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copiar Todo
              </Button>
              <Button variant="outline" onClick={() => downloadScript(selectedScript)} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {scripts.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Guiones Generados ({scripts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scripts.map(script => (
                <Card 
                  key={script.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${selectedScript?.id === script.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedScript(script)}
                >
                  <CardContent className="p-4">
                    <h4 className="font-medium line-clamp-1">{script.title}</h4>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">{script.platform}</Badge>
                      <Badge variant="outline" className="text-xs">{script.duration}s</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
