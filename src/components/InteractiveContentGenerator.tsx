import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Gamepad2, Copy, Code, HelpCircle, Calculator, ClipboardList } from "lucide-react";

interface InteractiveContent {
  type: 'quiz' | 'calculator' | 'survey';
  title: string;
  embedCode: string;
  previewHtml: string;
  questions?: {
    question: string;
    options?: string[];
    correctAnswer?: number;
  }[];
  fields?: {
    label: string;
    type: string;
    formula?: string;
  }[];
}

const InteractiveContentGenerator = () => {
  const [contentType, setContentType] = useState<'quiz' | 'calculator' | 'survey'>('quiz');
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [questionCount, setQuestionCount] = useState("5");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<InteractiveContent | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un tema",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('interactive-content-generator', {
        body: { 
          type: contentType,
          topic,
          description,
          questionCount: parseInt(questionCount)
        }
      });

      if (error) throw error;

      setGeneratedContent(data.content);
      toast({
        title: "Contenido generado",
        description: `Tu ${contentType} está listo para usar`,
      });
    } catch (error) {
      console.error('Error generating interactive content:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el contenido interactivo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: `${label} copiado al portapapeles`,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz': return <HelpCircle className="h-5 w-5" />;
      case 'calculator': return <Calculator className="h-5 w-5" />;
      case 'survey': return <ClipboardList className="h-5 w-5" />;
      default: return <Gamepad2 className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-primary" />
            Generador de Contenido Interactivo
            <Badge>PRO</Badge>
          </CardTitle>
          <CardDescription>
            Crea quizzes, calculadoras y encuestas embebibles para aumentar el engagement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de Contenido</Label>
            <Tabs value={contentType} onValueChange={(v) => setContentType(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="quiz" className="flex items-center gap-1">
                  <HelpCircle className="h-4 w-4" />
                  Quiz
                </TabsTrigger>
                <TabsTrigger value="calculator" className="flex items-center gap-1">
                  <Calculator className="h-4 w-4" />
                  Calculadora
                </TabsTrigger>
                <TabsTrigger value="survey" className="flex items-center gap-1">
                  <ClipboardList className="h-4 w-4" />
                  Encuesta
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label>Tema o Título</Label>
            <Input
              placeholder={
                contentType === 'quiz' 
                  ? "Ej: ¿Cuánto sabes de marketing digital?" 
                  : contentType === 'calculator'
                  ? "Ej: Calculadora de ROI publicitario"
                  : "Ej: Encuesta de satisfacción del cliente"
              }
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Descripción (opcional)</Label>
            <Textarea
              placeholder="Describe el propósito y contexto del contenido..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {contentType !== 'calculator' && (
            <div className="space-y-2">
              <Label>Número de preguntas</Label>
              <Select value={questionCount} onValueChange={setQuestionCount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 preguntas</SelectItem>
                  <SelectItem value="5">5 preguntas</SelectItem>
                  <SelectItem value="10">10 preguntas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button 
            onClick={handleGenerate} 
            disabled={isLoading || !topic.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando {contentType}...
              </>
            ) : (
              <>
                {getTypeIcon(contentType)}
                <span className="ml-2">Generar {contentType}</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getTypeIcon(generatedContent.type)}
              {generatedContent.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="preview">
              <TabsList>
                <TabsTrigger value="preview">Vista Previa</TabsTrigger>
                <TabsTrigger value="embed">Código Embed</TabsTrigger>
                <TabsTrigger value="structure">Estructura</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="mt-4">
                <div 
                  className="border rounded-lg p-4 bg-muted"
                  dangerouslySetInnerHTML={{ __html: generatedContent.previewHtml }}
                />
              </TabsContent>

              <TabsContent value="embed" className="mt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Código para embeber</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(generatedContent.embedCode, 'Código')}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copiar
                    </Button>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                    <code>{generatedContent.embedCode}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="structure" className="mt-4">
                {generatedContent.questions && (
                  <div className="space-y-3">
                    {generatedContent.questions.map((q, index) => (
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <p className="font-medium">{index + 1}. {q.question}</p>
                          {q.options && (
                            <ul className="mt-2 space-y-1">
                              {q.options.map((opt, i) => (
                                <li key={i} className={`text-sm pl-4 ${i === q.correctAnswer ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
                                  {i === q.correctAnswer ? '✓' : '○'} {opt}
                                </li>
                              ))}
                            </ul>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                {generatedContent.fields && (
                  <div className="space-y-3">
                    {generatedContent.fields.map((field, index) => (
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <p className="font-medium">{field.label}</p>
                          <Badge variant="outline">{field.type}</Badge>
                          {field.formula && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Fórmula: {field.formula}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InteractiveContentGenerator;
