import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, Trash2, Send } from 'lucide-react';
import type { EditorialCalendarItem } from '@/types/editorial-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function PostSchedulerForm() {
  const [events, setEvents] = useState<EditorialCalendarItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EditorialCalendarItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    content_type: 'post',
    platform: 'facebook',
    scheduled_date: '',
    scheduled_time: '',
    notes: '',
    tags: '',
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      loadScheduledPosts(user.id);
    } else {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para programar posts",
        variant: "destructive",
      });
    }
  };

  const loadScheduledPosts = async (userId: string) => {
    const { data, error } = await supabase
      .from('editorial_calendar')
      .select('*')
      .eq('user_id', userId)
      .order('scheduled_date', { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los posts programados",
        variant: "destructive",
      });
      return;
    }

    setEvents((data || []) as EditorialCalendarItem[]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    const { error } = await supabase
      .from('editorial_calendar')
      .insert({
        user_id: user.id,
        title: formData.title,
        content: formData.content,
        content_type: formData.content_type,
        platform: formData.platform,
        scheduled_date: formData.scheduled_date,
        scheduled_time: formData.scheduled_time || null,
        notes: formData.notes || null,
        tags: tagsArray,
        status: 'planned',
      });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo programar el post",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "¡Post programado!",
      description: "El post ha sido agregado al calendario",
    });

    setFormData({
      title: '',
      content: '',
      content_type: 'post',
      platform: 'facebook',
      scheduled_date: '',
      scheduled_time: '',
      notes: '',
      tags: '',
    });
    setIsDialogOpen(false);
    loadScheduledPosts(user.id);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('editorial_calendar')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el post",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Post eliminado",
      description: "El post ha sido eliminado del calendario",
    });

    if (user) loadScheduledPosts(user.id);
  };

  const handlePublishNow = async (event: EditorialCalendarItem) => {
    toast({
      title: "Funcionalidad en desarrollo",
      description: "La publicación automática estará disponible próximamente",
    });
  };

  const calendarEvents = events.map(event => ({
    ...event,
    start: new Date(`${event.scheduled_date}T${event.scheduled_time || '09:00:00'}`),
    end: new Date(`${event.scheduled_date}T${event.scheduled_time || '09:00:00'}`),
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Calendario Editorial</h1>
            <p className="text-muted-foreground">Programa y gestiona tus publicaciones en redes sociales</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Programar Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Programar Nueva Publicación</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="platform">Plataforma</Label>
                    <Select
                      value={formData.platform}
                      onValueChange={(value) => setFormData({ ...formData, platform: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="twitter">Twitter/X</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Contenido</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduled_date">Fecha</Label>
                    <Input
                      id="scheduled_date"
                      type="date"
                      value={formData.scheduled_date}
                      onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="scheduled_time">Hora</Label>
                    <Input
                      id="scheduled_time"
                      type="time"
                      value={formData.scheduled_time}
                      onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (separados por coma)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="marketing, producto, oferta"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Programando...' : 'Programar Publicación'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-lg" style={{ height: '600px' }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            culture="es"
            onSelectEvent={(event) => {
              setSelectedEvent(event as EditorialCalendarItem);
            }}
            eventPropGetter={(event: any) => ({
              style: {
                backgroundColor: event.status === 'published' ? '#22c55e' : 
                               event.status === 'cancelled' ? '#ef4444' : '#3b82f6',
              }
            })}
          />
        </div>

        {selectedEvent && (
          <div className="bg-card rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-2">{selectedEvent.title}</h3>
                <div className="flex gap-2 mb-2">
                  <Badge className={getStatusColor(selectedEvent.status)}>
                    {selectedEvent.status}
                  </Badge>
                  <Badge variant="outline">{selectedEvent.platform}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                {selectedEvent.status === 'planned' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePublishNow(selectedEvent)}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Publicar Ahora
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(selectedEvent.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold">Contenido:</Label>
                <p className="mt-1 whitespace-pre-wrap">{selectedEvent.content}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">Fecha programada:</Label>
                  <p className="mt-1 flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {selectedEvent.scheduled_date}
                  </p>
                </div>
                {selectedEvent.scheduled_time && (
                  <div>
                    <Label className="text-sm font-semibold">Hora programada:</Label>
                    <p className="mt-1 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {selectedEvent.scheduled_time}
                    </p>
                  </div>
                )}
              </div>

              {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                <div>
                  <Label className="text-sm font-semibold">Tags:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedEvent.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedEvent.notes && (
                <div>
                  <Label className="text-sm font-semibold">Notas:</Label>
                  <p className="mt-1 text-muted-foreground">{selectedEvent.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}