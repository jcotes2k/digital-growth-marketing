import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Users, ListTodo, Trash2, CheckCircle, Clock } from 'lucide-react';
import type { TeamMember, TaskAssignment } from '@/types/team-collaboration';

export default function TeamCollaborationForm() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [myTasks, setMyTasks] = useState<any[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'viewer' as 'admin' | 'editor' | 'viewer',
  });

  const [taskForm, setTaskForm] = useState({
    post_id: '',
    assigned_to: '',
    due_date: '',
    notes: '',
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      loadData(user.id);
    } else {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para acceder a la colaboración",
        variant: "destructive",
      });
    }
  };

  const loadData = async (userId: string) => {
    // Load team members
    const { data: members } = await supabase
      .from('team_members')
      .select('*')
      .eq('workspace_owner', userId)
      .order('invited_at', { ascending: false });

    setTeamMembers((members || []) as TeamMember[]);

    // Load posts for task assignment
    const { data: postsData } = await supabase
      .from('editorial_calendar')
      .select('id, title, platform, scheduled_date')
      .eq('user_id', userId)
      .eq('status', 'planned')
      .order('scheduled_date', { ascending: true });

    setPosts(postsData || []);

    // Load my tasks (assigned to me)
    const { data: tasks } = await supabase
      .from('task_assignments')
      .select(`
        *,
        post:editorial_calendar(title, content, platform, scheduled_date)
      `)
      .eq('assigned_to', userId)
      .order('created_at', { ascending: false });

    setMyTasks(tasks || []);

    // Load tasks I assigned
    const { data: assigned } = await supabase
      .from('task_assignments')
      .select(`
        *,
        post:editorial_calendar(title, content, platform, scheduled_date)
      `)
      .eq('assigned_by', userId)
      .order('created_at', { ascending: false});

    setAssignedTasks(assigned || []);
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    const { error } = await supabase
      .from('team_members')
      .insert({
        workspace_owner: user.id,
        member_email: inviteForm.email,
        role: inviteForm.role,
        status: 'pending',
      });

    if (error) {
      toast({
        title: "Error",
        description: error.message.includes('duplicate') ? 
          "Este miembro ya ha sido invitado" : 
          "No se pudo enviar la invitación",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: "¡Invitación enviada!",
      description: `Se ha enviado una invitación a ${inviteForm.email}`,
    });

    setInviteForm({ email: '', role: 'viewer' });
    setIsInviteDialogOpen(false);
    loadData(user.id);
    setIsLoading(false);
  };

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    const { error } = await supabase
      .from('task_assignments')
      .insert({
        post_id: taskForm.post_id,
        assigned_to: taskForm.assigned_to,
        assigned_by: user.id,
        due_date: taskForm.due_date || null,
        notes: taskForm.notes || null,
        status: 'pending',
      });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo asignar la tarea",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: "¡Tarea asignada!",
      description: "La tarea ha sido asignada exitosamente",
    });

    setTaskForm({ post_id: '', assigned_to: '', due_date: '', notes: '' });
    setIsTaskDialogOpen(false);
    loadData(user.id);
    setIsLoading(false);
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: 'pending' | 'in_progress' | 'completed') => {
    const { error } = await supabase
      .from('task_assignments')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la tarea",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Estado actualizado",
      description: "El estado de la tarea ha sido actualizado",
    });

    if (user) loadData(user.id);
  };

  const handleRemoveMember = async (memberId: string) => {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el miembro",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Miembro eliminado",
      description: "El miembro ha sido eliminado del equipo",
    });

    if (user) loadData(user.id);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500';
      case 'editor': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completada';
      case 'in_progress': return 'En Progreso';
      default: return 'Pendiente';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Colaboración en Equipo</h1>
            <p className="text-muted-foreground">Invita miembros y asigna tareas para trabajar en equipo</p>
          </div>
          
          <div className="flex gap-3">
            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invitar Miembro
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invitar Miembro al Equipo</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleInviteMember} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                      required
                      placeholder="email@ejemplo.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Rol</Label>
                    <Select
                      value={inviteForm.role}
                      onValueChange={(value: any) => setInviteForm({ ...inviteForm, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador (acceso total)</SelectItem>
                        <SelectItem value="editor">Editor (crear y editar)</SelectItem>
                        <SelectItem value="viewer">Visualizador (solo lectura)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Enviando...' : 'Enviar Invitación'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <ListTodo className="mr-2 h-4 w-4" />
                  Asignar Tarea
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Asignar Tarea</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAssignTask} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="post">Post</Label>
                    <Select
                      value={taskForm.post_id}
                      onValueChange={(value) => setTaskForm({ ...taskForm, post_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un post" />
                      </SelectTrigger>
                      <SelectContent>
                        {posts.map((post) => (
                          <SelectItem key={post.id} value={post.id}>
                            {post.title} - {post.platform}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assigned_to">Asignar a</Label>
                    <Select
                      value={taskForm.assigned_to}
                      onValueChange={(value) => setTaskForm({ ...taskForm, assigned_to: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un miembro" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers.filter(m => m.status === 'active').map((member) => (
                          <SelectItem key={member.id} value={member.member_id || member.member_email}>
                            {member.member_email} ({member.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="due_date">Fecha límite</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={taskForm.due_date}
                      onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas</Label>
                    <Textarea
                      id="notes"
                      value={taskForm.notes}
                      onChange={(e) => setTaskForm({ ...taskForm, notes: e.target.value })}
                      rows={3}
                      placeholder="Instrucciones adicionales..."
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Asignando...' : 'Asignar Tarea'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="team" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="team">
              <Users className="mr-2 h-4 w-4" />
              Equipo ({teamMembers.length})
            </TabsTrigger>
            <TabsTrigger value="my-tasks">
              <ListTodo className="mr-2 h-4 w-4" />
              Mis Tareas ({myTasks.length})
            </TabsTrigger>
            <TabsTrigger value="assigned">
              Tareas Asignadas ({assignedTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="space-y-4">
            {teamMembers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No has invitado a ningún miembro todavía</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {teamMembers.map((member) => (
                  <Card key={member.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{member.member_email}</CardTitle>
                          <CardDescription>
                            Invitado: {new Date(member.invited_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Badge className={getRoleColor(member.role)}>
                            {member.role}
                          </Badge>
                          <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                            {member.status === 'active' ? 'Activo' : member.status === 'pending' ? 'Pendiente' : 'Inactivo'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-tasks" className="space-y-4">
            {myTasks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ListTodo className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No tienes tareas asignadas</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {myTasks.map((task) => (
                  <Card key={task.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle>{task.post?.title}</CardTitle>
                          <CardDescription>
                            <Badge variant="outline" className="mr-2">{task.post?.platform}</Badge>
                            {task.due_date && `Vence: ${task.due_date}`}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(task.status)}>
                          {getStatusText(task.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {task.notes && (
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm">{task.notes}</p>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        {task.status !== 'in_progress' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateTaskStatus(task.id, 'in_progress')}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            En Progreso
                          </Button>
                        )}
                        {task.status !== 'completed' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Completar
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="assigned" className="space-y-4">
            {assignedTasks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ListTodo className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No has asignado tareas todavía</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {assignedTasks.map((task) => (
                  <Card key={task.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle>{task.post?.title}</CardTitle>
                          <CardDescription>
                            <Badge variant="outline" className="mr-2">{task.post?.platform}</Badge>
                            {task.due_date && `Vence: ${task.due_date}`}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(task.status)}>
                          {getStatusText(task.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {task.notes && (
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm">{task.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}