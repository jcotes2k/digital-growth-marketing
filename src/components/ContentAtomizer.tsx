import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Zap, Copy, Instagram, Linkedin, Twitter, Youtube, MessageSquare } from "lucide-react";

interface AtomizedContent {
  format: string;
  platform: string;
  content: string;
  hashtags?: string[];
  characterCount: number;
}

interface ContentAtomizerProps {
  mode: 'basic' | 'advanced';
}

const ContentAtomizer = ({ mode }: ContentAtomizerProps) => {
  const [originalContent, setOriginalContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [atomizedContent, setAtomizedContent] = useState<AtomizedContent[]>([]);
  const { toast } = useToast();

  const formatCount = mode === 'basic' ? 5 : 15;

  const handleAtomize = async () => {
    if (!originalContent.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa contenido para atomizar",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('content-atomizer', {
        body: { 
          content: originalContent,
          formatCount,
          mode
        }
      });

      if (error) throw error;

      setAtomizedContent(data.atomizedContent || []);
      toast({
        title: "Contenido atomizado",
        description: `Se generaron ${data.atomizedContent?.length || 0} formatos`,
      });
    } catch (error) {
      console.error('Error atomizing content:', error);
      toast({
        title: "Error",
        description: "No se pudo atomizar el contenido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "Contenido copiado al portapapeles",
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram className="h-4 w-4" />;
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'youtube': return <Youtube className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Motor de Atomización de Contenido
            <Badge variant={mode === 'advanced' ? 'default' : 'secondary'}>
              {formatCount} formatos
            </Badge>
          </CardTitle>
          <CardDescription>
            Transforma un contenido en múltiples formatos optimizados para diferentes plataformas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Contenido Original</Label>
            <Textarea
              placeholder="Pega aquí tu artículo, post o cualquier contenido que quieras atomizar..."
              value={originalContent}
              onChange={(e) => setOriginalContent(e.target.value)}
              rows={6}
            />
            <p className="text-sm text-muted-foreground">
              {originalContent.length} caracteres
            </p>
          </div>

          <Button 
            onClick={handleAtomize} 
            disabled={isLoading || !originalContent.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atomizando contenido...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Atomizar en {formatCount} formatos
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {atomizedContent.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Contenido Atomizado ({atomizedContent.length} formatos)</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={atomizedContent[0]?.format || ''}>
              <TabsList className="flex flex-wrap h-auto gap-1">
                {atomizedContent.map((item, index) => (
                  <TabsTrigger key={index} value={item.format} className="text-xs">
                    {getPlatformIcon(item.platform)}
                    <span className="ml-1">{item.format}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              {atomizedContent.map((item, index) => (
                <TabsContent key={index} value={item.format} className="mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(item.platform)}
                          <span className="font-medium">{item.platform}</span>
                          <Badge variant="outline">{item.characterCount} chars</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(item.content)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap text-sm">{item.content}</p>
                      {item.hashtags && item.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {item.hashtags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentAtomizer;
