import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EditorialCalendarItem } from '@/types/editorial-calendar';
import { AuthForm } from '@/components/AuthForm';
import { Plus, Edit, Trash2, LogOut } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'es': es };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: EditorialCalendarItem;
}

interface EditorialFormData {
  title: string;
  content: string;
  content_type: string;
  platform: string;
  scheduled_date: string;
  scheduled_time: string;
  tags: string;
  notes: string;
}

export const EditorialCalendarForm = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EditorialCalendarItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<EditorialFormData>({
    defaultValues: {
      title: '', content: '', content_type: '', platform: '',
      scheduled_date: '', scheduled_time: '', tags: '', notes: '',
    },
  });

  const contentTypes = [
    { value: 'social-post', label: 'Post para Redes Sociales' },
    { value: 'blog-post', label: 'Artículo de Blog' },
    { value: 'email', label: 'Email Marketing' },
    { value: 'ad-copy', label: 'Copy para Anuncios' },
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'video-script', label: 'Guion para Video' },
  ];

  const platforms = [
    { value: 'instagram', label: 'Instagram' }, { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter/X' }, { value: 'linkedin', label: 'LinkedIn' },
    { value: 'youtube', label: 'YouTube' }, { value: 'tiktok', label: 'TikTok' },
    { value: 'blog', label: 'Blog' }, { value: 'email', label: 'Email' }, { value: 'website', label: 'Sitio Web' },
  ];

  const loadCalendarItems = async () => {
    try {
      const { data, error } = await supabase.from('editorial_calendar').select('*').order('scheduled_date', { ascending: true });
      if (error) throw error;

      const calendarEvents: CalendarEvent[] = (data || []).map((item: any) => {
        const typedItem = item as EditorialCalendarItem;
        const date = new Date(typedItem.scheduled_date);
        if (typedItem.scheduled_time) {
          const [hours, minutes] = typedItem.scheduled_time.split(':');
          date.setHours(parseInt(hours), parseInt(minutes));
        }
        return {
          id: typedItem.id, title: typedItem.title, start: date,
          end: new Date(date.getTime() + 60 * 60 * 1000), resource: typedItem,
        };
      });
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error loading calendar items:', error);
      toast({ title: "Error al cargar el calendario", description: "No se pudieron cargar los elementos del calendario", variant: "destructive" });
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
      
      if (user) {
        loadCalendarItems();
        const savedContent = localStorage.getItem('generatedContent');
        if (savedContent) {
          try {
            const parsed = JSON.parse(savedContent);
            form.reset({
              title: `${parsed.topic} - ${parsed.contentType}`, content: parsed.content,
              content_type: parsed.contentType || '', platform: '',
              scheduled_date: new Date().toISOString().split('T')[0], scheduled_time: '',
              tags: parsed.tone || '', notes: 'Contenido generado automáticamente con IA',
            });
            localStorage.removeItem('generatedContent');
            setIsDialogOpen(true); setIsViewMode(false);
            toast({ title: "Contenido cargado", description: "El contenido generado está listo para programar" });
          } catch (error) {
            console.error('Error parsing generated content:', error);
          }
        }
      }
    };

    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadCalendarItems();
    });
    return () => subscription.unsubscribe();
  }, []);

  const onSubmit = async (data: EditorialFormData) => {
    if (!user) {
      toast({ title: "Error de autenticación", description: "Debes iniciar sesión para crear contenido", variant: "destructive" });
      return;
    }

    try {
      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()) : [];
      const itemData = {
        user_id: user.id, title: data.title, content: data.content, content_type: data.content_type,
        platform: data.platform, scheduled_date: data.scheduled_date, scheduled_time: data.scheduled_time || null,
        tags, notes: data.notes || null, generated_by_ai: !!localStorage.getItem('generatedContent'),
      };

      if (selectedEvent) {
        const { error } = await supabase.from('editorial_calendar').update(itemData).eq('id', selectedEvent.id);
        if (error) throw error;
        toast({ title: "Contenido actualizado", description: "El contenido ha sido actualizado exitosamente" });
      } else {
        const { error } = await supabase.from('editorial_calendar').insert([itemData]);
        if (error) throw error;
        toast({ title: "Contenido programado", description: "El contenido ha sido agregado al calendario" });
      }

      setIsDialogOpen(false); setSelectedEvent(null); form.reset(); loadCalendarItems();
    } catch (error) {
      console.error('Error saving calendar item:', error);
      toast({ title: "Error al guardar", description: "No se pudo guardar el contenido", variant: "destructive" });
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event.resource); setIsViewMode(true); setIsDialogOpen(true);
  };

  const handleEdit = () => {
    if (selectedEvent) {
      const tags = selectedEvent.tags ? selectedEvent.tags.join(', ') : '';
      form.reset({
        title: selectedEvent.title, content: selectedEvent.content, content_type: selectedEvent.content_type,
        platform: selectedEvent.platform, scheduled_date: selectedEvent.scheduled_date,
        scheduled_time: selectedEvent.scheduled_time || '', tags, notes: selectedEvent.notes || '',
      });
      setIsViewMode(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    try {
      const { error } = await supabase.from('editorial_calendar').delete().eq('id', selectedEvent.id);
      if (error) throw error;
      toast({ title: "Contenido eliminado", description: "El contenido ha sido eliminado del calendario" });
      setIsDialogOpen(false); setSelectedEvent(null); loadCalendarItems();
    } catch (error) {
      console.error('Error deleting calendar item:', error);
      toast({ title: "Error al eliminar", description: "No se pudo eliminar el contenido", variant: "destructive" });
    }
  };

  const handleStatusChange = async (status: 'planned' | 'published' | 'cancelled') => {
    if (!selectedEvent) return;
    try {
      const { error } = await supabase.from('editorial_calendar').update({ status }).eq('id', selectedEvent.id);
      if (error) throw error;
      toast({ title: "Estado actualizado", description: `El contenido ha sido marcado como ${status}` });
      loadCalendarItems(); setSelectedEvent({ ...selectedEvent, status });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({ title: "Error al actualizar estado", description: "No se pudo actualizar el estado", variant: "destructive" });
    }
  };

  const openNewEventDialog = () => {
    setSelectedEvent(null); setIsViewMode(false); form.reset(); setIsDialogOpen(true);
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const status = event.resource.status;
    let backgroundColor = status === 'published' ? '#28a745' : status === 'cancelled' ? '#dc3545' : '#007bff';
    return { style: { backgroundColor, borderRadius: '4px', opacity: 0.8, color: 'white', border: '0px', display: 'block' } };
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Sesión cerrada", description: "Has cerrado sesión exitosamente" });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="text-center"><p>Cargando...</p></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onSuccess={() => setUser} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Calendario Editorial</h1>
          <p className="text-muted-foreground">Planifica y organiza todo tu contenido en un solo lugar</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewEventDialog}><Plus className="mr-2 h-4 w-4" />Nuevo Contenido</Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {isViewMode ? 'Detalles del Contenido' : selectedEvent ? 'Editar Contenido' : 'Nuevo Contenido'}
                </DialogTitle>
                <DialogDescription>
                  {isViewMode ? 'Información del contenido programado' : 'Completa los detalles del contenido para tu calendario editorial'}
                </DialogDescription>
              </DialogHeader>

              {isViewMode && selectedEvent ? (
                <div className="space-y-4">
                  <div><h3 className="font-semibold mb-2">Título</h3><p>{selectedEvent.title}</p></div>
                  <div>
                    <h3 className="font-semibold mb-2">Contenido</h3>
                    <div className="bg-muted p-3 rounded max-h-40 overflow-y-auto">
                      <p className="whitespace-pre-wrap">{selectedEvent.content}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Tipo</h3>
                      <Badge variant="secondary">{contentTypes.find(t => t.value === selectedEvent.content_type)?.label}</Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Plataforma</h3>
                      <Badge variant="outline">{platforms.find(p => p.value === selectedEvent.platform)?.label}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><h3 className="font-semibold mb-2">Fecha</h3><p>{selectedEvent.scheduled_date}</p></div>
                    <div><h3 className="font-semibold mb-2">Hora</h3><p>{selectedEvent.scheduled_time || 'No especificada'}</p></div>
                  </div>
                  {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedEvent.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold mb-2">Estado</h3>
                    <div className="flex gap-2">
                      <Button variant={selectedEvent.status === 'planned' ? 'default' : 'outline'} size="sm" onClick={() => handleStatusChange('planned')}>Planificado</Button>
                      <Button variant={selectedEvent.status === 'published' ? 'default' : 'outline'} size="sm" onClick={() => handleStatusChange('published')}>Publicado</Button>
                      <Button variant={selectedEvent.status === 'cancelled' ? 'default' : 'outline'} size="sm" onClick={() => handleStatusChange('cancelled')}>Cancelado</Button>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleEdit} variant="outline"><Edit className="mr-2 h-4 w-4" />Editar</Button>
                    <Button onClick={handleDelete} variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Eliminar</Button>
                  </div>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                      <FormItem><FormLabel>Título</FormLabel><FormControl><Input placeholder="Título del contenido..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="content" render={({ field }) => (
                      <FormItem><FormLabel>Contenido</FormLabel><FormControl><Textarea placeholder="Escribe o pega aquí el contenido..." className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="content_type" render={({ field }) => (
                        <FormItem><FormLabel>Tipo de Contenido</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona tipo" /></SelectTrigger></FormControl><SelectContent>{contentTypes.map((type) => (<SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="platform" render={({ field }) => (
                        <FormItem><FormLabel>Plataforma</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona plataforma" /></SelectTrigger></FormControl><SelectContent>{platforms.map((platform) => (<SelectItem key={platform.value} value={platform.value}>{platform.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                      )} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="scheduled_date" render={({ field }) => (
                        <FormItem><FormLabel>Fecha</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="scheduled_time" render={({ field }) => (
                        <FormItem><FormLabel>Hora (Opcional)</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="tags" render={({ field }) => (
                      <FormItem><FormLabel>Tags (Opcional)</FormLabel><FormControl><Input placeholder="marketing, producto, promoción (separados por coma)" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="notes" render={({ field }) => (
                      <FormItem><FormLabel>Notas (Opcional)</FormLabel><FormControl><Textarea placeholder="Notas adicionales sobre este contenido..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="flex gap-2 pt-4">
                      <Button type="submit">{selectedEvent ? 'Actualizar' : 'Programar'} Contenido</Button>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                    </div>
                  </form>
                </Form>
              )}
            </DialogContent>
          </Dialog>
          
          <Button onClick={handleLogout} variant="outline"><LogOut className="mr-2 h-4 w-4" />Cerrar Sesión</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div style={{ height: '600px' }}>
            <Calendar
              localizer={localizer} events={events} startAccessor="start" endAccessor="end"
              onSelectEvent={handleEventClick} eventPropGetter={eventStyleGetter} culture="es"
              messages={{
                next: "Siguiente", previous: "Anterior", today: "Hoy", month: "Mes", week: "Semana",
                day: "Día", agenda: "Agenda", date: "Fecha", time: "Hora", event: "Evento",
                noEventsInRange: "No hay eventos en este rango", showMore: (total) => `+ Ver más (${total})`
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};