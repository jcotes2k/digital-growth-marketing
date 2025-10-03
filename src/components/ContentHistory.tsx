import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Trash2, Copy, Download, Calendar, Hash, Star, Loader2, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ContentVariant } from '@/types/content-variant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HistoryItem {
  id: string;
  content: string;
  style: string;
  platform: string | null;
  hashtags: string[];
  score_data: any;
  topic: string | null;
  created_at: string;
}

interface ContentHistoryProps {
  onReuseContent?: (content: string, hashtags: string[]) => void;
}

export const ContentHistory = ({ onReuseContent }: ContentHistoryProps) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [styleFilter, setStyleFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    filterHistory();
  }, [searchQuery, platformFilter, styleFilter, history]);

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "No autenticado",
          description: "Debes iniciar sesión para ver el historial",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('generated_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setHistory(data || []);
      setFilteredHistory(data || []);
    } catch (error: any) {
      console.error('Error fetching history:', error);
      toast({
        title: "Error al cargar historial",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterHistory = () => {
    let filtered = [...history];

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.style.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrar por plataforma
    if (platformFilter !== 'all') {
      filtered = filtered.filter(item => item.platform === platformFilter);
    }

    // Filtrar por estilo
    if (styleFilter !== 'all') {
      filtered = filtered.filter(item => item.style === styleFilter);
    }

    setFilteredHistory(filtered);
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('generated_content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHistory(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Eliminado",
        description: "El contenido ha sido eliminado del historial",
      });
    } catch (error: any) {
      toast({
        title: "Error al eliminar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copiado",
        description: "Contenido copiado al portapapeles",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo copiar el contenido",
        variant: "destructive",
      });
    }
  };

  const downloadAsText = (item: HistoryItem) => {
    const blob = new Blob([item.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contenido-${item.style.toLowerCase()}-${format(new Date(item.created_at), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Descargado",
      description: "Archivo guardado exitosamente",
    });
  };

  const exportAllAsCSV = () => {
    const headers = ['Fecha', 'Estilo', 'Plataforma', 'Tema', 'Contenido', 'Hashtags'];
    const rows = filteredHistory.map(item => [
      format(new Date(item.created_at), 'yyyy-MM-dd HH:mm'),
      item.style,
      item.platform || 'N/A',
      item.topic || 'N/A',
      `"${item.content.replace(/"/g, '""')}"`,
      item.hashtags.join(' '),
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historial-contenido-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Exportado",
      description: `${filteredHistory.length} elementos exportados a CSV`,
    });
  };

  const uniquePlatforms = Array.from(new Set(history.map(h => h.platform).filter(Boolean)));
  const uniqueStyles = Array.from(new Set(history.map(h => h.style)));

  if (isLoading) {
    return (
      <Card>
        <CardContent className="min-h-[400px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historial de Contenido</CardTitle>
              <CardDescription>
                {history.length} contenidos generados guardados
              </CardDescription>
            </div>
            {filteredHistory.length > 0 && (
              <Button onClick={exportAllAsCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros y búsqueda */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar en historial..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las plataformas</SelectItem>
                {uniquePlatforms.map(platform => (
                  <SelectItem key={platform} value={platform!}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={styleFilter} onValueChange={setStyleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Estilo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estilos</SelectItem>
                {uniqueStyles.map(style => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lista de historial */}
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No se encontraron resultados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary">{item.style}</Badge>
                            {item.platform && (
                              <Badge variant="outline">{item.platform}</Badge>
                            )}
                            {item.score_data?.overall && (
                              <Badge variant="default">
                                Score: {item.score_data.overall}
                              </Badge>
                            )}
                          </div>
                          {item.topic && (
                            <p className="text-sm text-muted-foreground">
                              Tema: {item.topic}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(item.created_at), 'PPp', { locale: es })}
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          {onReuseContent && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onReuseContent(item.content, item.hashtags)}
                              title="Reutilizar contenido"
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(item.content)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => downloadAsText(item)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteHistoryItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>

                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm whitespace-pre-wrap line-clamp-3">
                          {item.content}
                        </p>
                      </div>

                      {item.hashtags && item.hashtags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Hash className="h-3 w-3 text-muted-foreground" />
                          {item.hashtags.slice(0, 5).map((tag, idx) => (
                            <span key={idx} className="text-xs text-muted-foreground">
                              {tag}
                            </span>
                          ))}
                          {item.hashtags.length > 5 && (
                            <span className="text-xs text-muted-foreground">
                              +{item.hashtags.length - 5} más
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
