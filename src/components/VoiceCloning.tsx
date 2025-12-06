import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mic, Play, Pause, Download, Volume2 } from "lucide-react";

interface VoiceSettings {
  stability: number;
  similarityBoost: number;
  style: number;
}

const PRESET_VOICES = [
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah - Profesional femenina" },
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "George - Profesional masculino" },
  { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam - Joven dinámico" },
  { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte - Cálida y cercana" },
  { id: "onwK4e9ZLuTAKqWW03F9", name: "Daniel - Narrador" },
];

const VoiceCloning = () => {
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleGenerateAudio = async () => {
    if (!text.trim() || !selectedVoice) {
      toast({
        title: "Error",
        description: "Por favor ingresa texto y selecciona una voz",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('voice-cloning', {
        body: { 
          text,
          voiceId: selectedVoice
        }
      });

      if (error) throw error;

      if (data.audioUrl) {
        setAudioUrl(data.audioUrl);
        const audio = new Audio(data.audioUrl);
        setAudioElement(audio);
        
        audio.onended = () => setIsPlaying(false);
        
        toast({
          title: "Audio generado",
          description: "Tu audio está listo para reproducir",
        });
      }
    } catch (error) {
      console.error('Error generating audio:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el audio. Verifica tu API key de ElevenLabs.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'audio-generado.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            Voice Cloning para Podcasts/Videos
            <Badge variant="secondary">ElevenLabs</Badge>
          </CardTitle>
          <CardDescription>
            Genera audio profesional con voces de IA para tus podcasts, videos y contenido multimedia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Selecciona una Voz</Label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger>
                <SelectValue placeholder="Elige una voz" />
              </SelectTrigger>
              <SelectContent>
                {PRESET_VOICES.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      {voice.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Texto a Convertir en Audio</Label>
            <Textarea
              placeholder="Escribe o pega el texto que quieres convertir en audio..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
            />
            <p className="text-sm text-muted-foreground">
              {text.length} caracteres | ~{Math.ceil(text.split(' ').length / 150)} min de audio
            </p>
          </div>

          <Button 
            onClick={handleGenerateAudio} 
            disabled={isLoading || !text.trim() || !selectedVoice}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando audio...
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Generar Audio
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {audioUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Audio Generado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-4 p-6 bg-muted rounded-lg">
              <Button
                variant="outline"
                size="lg"
                onClick={togglePlayPause}
                className="h-16 w-16 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8" />
                )}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={handleDownload}
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Descargar MP3
              </Button>
            </div>

            <div className="p-3 bg-primary/10 rounded-lg text-sm">
              <p className="font-medium">💡 Tip:</p>
              <p className="text-muted-foreground">
                Usa este audio en tus videos, podcasts o como intro/outro para tu contenido.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <Mic className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="font-medium">¿Quieres clonar tu propia voz?</h3>
            <p className="text-sm text-muted-foreground">
              Para clonar tu voz personalizada, necesitas una cuenta de ElevenLabs Pro.
              Contacta soporte para más información.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceCloning;
