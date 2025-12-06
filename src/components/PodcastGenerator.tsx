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
import { Mic, Sparkles, Clock, Copy, Download, Users, MessageCircle, ListChecks } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PodcastEpisode {
  id: string;
  title: string;
  format: string;
  duration: string;
  intro: string;
  segments: { title: string; duration: string; content: string; talkingPoints: string[] }[];
  interviewQuestions?: string[];
  outro: string;
  showNotes: string;
  createdAt: Date;
}

export const PodcastGenerator = () => {
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('solo');
  const [duration, setDuration] = useState('30');
  const [style, setStyle] = useState('conversational');
  const [guestName, setGuestName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);
  const { toast } = useToast();

  const formats = [
    { value: 'solo', label: 'Solo (Monólogo)', icon: Mic },
    { value: 'interview', label: 'Entrevista', icon: Users },
    { value: 'panel', label: 'Panel/Debate', icon: MessageCircle },
    { value: 'storytelling', label: 'Narrativo', icon: ListChecks },
  ];

  const durations = [
    { value: '15', label: '15 minutos' },
    { value: '30', label: '30 minutos' },
    { value: '45', label: '45 minutos' },
    { value: '60', label: '1 hora' },
    { value: '90', label: '1.5 horas' },
  ];

  const styles = [
    { value: 'conversational', label: 'Conversacional' },
    { value: 'educational', label: 'Educativo' },
    { value: 'storytelling', label: 'Narrativo' },
    { value: 'debate', label: 'Debate' },
    { value: 'news', label: 'Noticioso' },
  ];

  const generateEpisode = async () => {
    if (!topic.trim()) {
      toast({
        title: "Tema requerido",
        description: "Por favor ingresa el tema del episodio",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('podcast-generator', {
        body: { topic, format, duration, style, guestName: format === 'interview' ? guestName : undefined }
      });

      if (error) throw error;

      const newEpisode: PodcastEpisode = {
        id: crypto.randomUUID(),
        title: data.title,
        format,
        duration,
        intro: data.intro,
        segments: data.segments || [],
        interviewQuestions: data.interviewQuestions,
        outro: data.outro,
        showNotes: data.showNotes,
        createdAt: new Date()
      };

      setEpisodes(prev => [newEpisode, ...prev]);
      setSelectedEpisode(newEpisode);
      toast({ title: "Episodio generado", description: "Tu guión de podcast ha sido creado" });
      setTopic('');
    } catch (error) {
      console.error('Error generating episode:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el episodio. Inténtalo de nuevo.",
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

  const downloadEpisode = (episode: PodcastEpisode) => {
    let content = `
EPISODIO DE PODCAST: ${episode.title}
Formato: ${episode.format}
Duración: ${episode.duration} minutos

═══════════════════════════════════════
INTRO
═══════════════════════════════════════
${episode.intro}

═══════════════════════════════════════
SEGMENTOS
═══════════════════════════════════════
${episode.segments.map((s, i) => `
--- Segmento ${i + 1}: ${s.title} (${s.duration}) ---
${s.content}

Puntos de conversación:
${s.talkingPoints.map(tp => `• ${tp}`).join('\n')}
`).join('\n')}
`;

    if (episode.interviewQuestions && episode.interviewQuestions.length > 0) {
      content += `
═══════════════════════════════════════
PREGUNTAS DE ENTREVISTA
═══════════════════════════════════════
${episode.interviewQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
`;
    }

    content += `
═══════════════════════════════════════
OUTRO
═══════════════════════════════════════
${episode.outro}

═══════════════════════════════════════
SHOW NOTES
═══════════════════════════════════════
${episode.showNotes}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `podcast-${episode.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-6 w-6" />
            Generador de Podcasts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tema del Episodio</Label>
            <Textarea
              placeholder="Ej: Tendencias de marketing digital para 2025..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Formato del Podcast</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {formats.map(f => {
                const Icon = f.icon;
                return (
                  <Card
                    key={f.value}
                    className={`cursor-pointer transition-all p-3 ${format === f.value ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setFormat(f.value)}
                  >
                    <div className="text-center">
                      <Icon className="h-6 w-6 mx-auto mb-1" />
                      <p className="text-sm font-medium">{f.label}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {format === 'interview' && (
            <div className="space-y-2">
              <Label>Nombre del Invitado</Label>
              <Input
                placeholder="Ej: María García, experta en marketing"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label>Estilo</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {styles.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={generateEpisode} 
            disabled={isGenerating || !topic.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Generando episodio...
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Generar Guión de Podcast
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {selectedEpisode && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                {selectedEpisode.title}
              </CardTitle>
              <div className="flex gap-2">
                <Badge>{selectedEpisode.format}</Badge>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {selectedEpisode.duration} min
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="structure">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="structure">Estructura</TabsTrigger>
                <TabsTrigger value="segments">Segmentos</TabsTrigger>
                {selectedEpisode.interviewQuestions && (
                  <TabsTrigger value="questions">Preguntas</TabsTrigger>
                )}
                <TabsTrigger value="notes">Show Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="structure" className="space-y-4 mt-4">
                <div className="p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Intro</h4>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(selectedEpisode.intro)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="whitespace-pre-line">{selectedEpisode.intro}</p>
                </div>

                <div className="space-y-2">
                  {selectedEpisode.segments.map((segment, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{index + 1}</Badge>
                          <span className="font-medium">{segment.title}</span>
                        </div>
                        <Badge variant="outline">{segment.duration}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="p-4 bg-green-500/10 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Outro</h4>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(selectedEpisode.outro)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="whitespace-pre-line">{selectedEpisode.outro}</p>
                </div>
              </TabsContent>

              <TabsContent value="segments" className="mt-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {selectedEpisode.segments.map((segment, index) => (
                      <Card key={index}>
                        <CardHeader className="py-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{segment.title}</CardTitle>
                            <Badge variant="outline">{segment.duration}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2 space-y-3">
                          <div>
                            <p className="whitespace-pre-line text-sm">{segment.content}</p>
                          </div>
                          <div className="bg-muted p-3 rounded-lg">
                            <h5 className="text-xs font-semibold text-muted-foreground mb-2">PUNTOS DE CONVERSACIÓN</h5>
                            <ul className="space-y-1">
                              {segment.talkingPoints.map((point, i) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                  <span className="text-primary">•</span>
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              {selectedEpisode.interviewQuestions && (
                <TabsContent value="questions" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Preguntas para la Entrevista
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-3">
                        {selectedEpisode.interviewQuestions.map((question, index) => (
                          <li key={index} className="flex gap-3 p-3 bg-muted rounded-lg">
                            <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium shrink-0">
                              {index + 1}
                            </span>
                            <p>{question}</p>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              <TabsContent value="notes" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Show Notes</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(selectedEpisode.showNotes)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-line">{selectedEpisode.showNotes}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => downloadEpisode(selectedEpisode)} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Descargar Guión Completo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
