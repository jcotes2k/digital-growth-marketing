import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { BuyerPersona } from '@/types/buyer-persona';
import { CompanyInfo } from '@/types/company-info';
import { Bot, User, Send, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIPersonaAssistantProps {
  companyInfo: CompanyInfo;
  onPersonaGenerated: (persona: Partial<BuyerPersona>) => void;
  onClose: () => void;
}

export const AIPersonaAssistant: React.FC<AIPersonaAssistantProps> = ({
  companyInfo,
  onPersonaGenerated,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola! 👋 Soy tu asistente IA para crear buyer personas. Te haré algunas preguntas para conocer mejor a tu cliente ideal. ¿En qué industria o rol se encuentra tu buyer persona objetivo?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');

    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('persona-assistant', {
        body: {
          messages: newMessages,
          companyInfo
        }
      });

      if (error) throw error;

      if (data.completed) {
        // La IA generó el persona completo
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message
        }]);
        setCompleted(true);
        
        // Esperar un momento antes de aplicar el persona
        setTimeout(() => {
          onPersonaGenerated(data.persona);
          toast({
            title: '✨ Buyer Persona Generado',
            description: 'El asistente IA ha creado tu buyer persona. Puedes editarlo ahora.',
          });
          onClose();
        }, 1500);
      } else {
        // Continuar la conversación
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message
        }]);
      }
    } catch (error) {
      console.error('Error calling persona-assistant:', error);
      toast({
        title: 'Error',
        description: 'No se pudo comunicar con el asistente. Intenta de nuevo.',
        variant: 'destructive'
      });
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Disculpa, tuve un problema. ¿Podrías repetir tu última respuesta?'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[700px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <CardTitle>Asistente IA de Buyer Persona</CardTitle>
          </div>
          {completed && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">Completado</span>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Responde las preguntas del asistente y él generará automáticamente tu buyer persona
        </p>
      </CardHeader>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div className="bg-muted rounded-lg p-4">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <CardContent className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Escribe tu respuesta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading || completed}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={loading || completed || !input.trim()}
            size="icon"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Presiona Enter para enviar • Shift+Enter para nueva línea
        </p>
      </CardContent>
    </Card>
  );
};