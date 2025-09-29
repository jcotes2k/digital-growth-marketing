import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, MessageSquare, Send } from 'lucide-react';
import type { ApprovalWorkflow } from '@/types/approval-workflow';

export default function ApprovalSystemForm() {
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<any | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      loadApprovals(user.id);
    } else {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para acceder al sistema de aprobación",
        variant: "destructive",
      });
    }
  };

  const loadApprovals = async (userId: string) => {
    // Load approvals where I'm the approver
    const { data: pending } = await supabase
      .from('approval_workflows')
      .select(`
        *,
        post:editorial_calendar(title, content, platform, scheduled_date)
      `)
      .eq('approver_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    setPendingApprovals(pending || []);

    // Load my requests
    const { data: requests } = await supabase
      .from('approval_workflows')
      .select(`
        *,
        post:editorial_calendar(title, content, platform, scheduled_date)
      `)
      .eq('requester_id', userId)
      .order('created_at', { ascending: false });

    setMyRequests(requests || []);
  };

  const handleApprove = async (approvalId: string) => {
    setIsLoading(true);
    
    const { error } = await supabase
      .from('approval_workflows')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        feedback: feedback || null,
      })
      .eq('id', approvalId);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo aprobar la solicitud",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: "¡Aprobado!",
      description: "El contenido ha sido aprobado exitosamente",
    });

    setFeedback('');
    setSelectedApproval(null);
    if (user) loadApprovals(user.id);
    setIsLoading(false);
  };

  const handleReject = async (approvalId: string) => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback requerido",
        description: "Por favor proporciona una razón para rechazar",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await supabase
      .from('approval_workflows')
      .update({
        status: 'rejected',
        feedback: feedback,
      })
      .eq('id', approvalId);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo rechazar la solicitud",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: "Rechazado",
      description: "El contenido ha sido rechazado",
    });

    setFeedback('');
    setSelectedApproval(null);
    if (user) loadApprovals(user.id);
    setIsLoading(false);
  };

  const handleRequestRevision = async (approvalId: string) => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback requerido",
        description: "Por favor proporciona comentarios para la revisión",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await supabase
      .from('approval_workflows')
      .update({
        status: 'revision_requested',
        feedback: feedback,
      })
      .eq('id', approvalId);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo solicitar revisión",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: "Revisión solicitada",
      description: "Se ha enviado la solicitud de revisión",
    });

    setFeedback('');
    setSelectedApproval(null);
    if (user) loadApprovals(user.id);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'revision_requested': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprobado';
      case 'rejected': return 'Rechazado';
      case 'revision_requested': return 'Revisión Solicitada';
      default: return 'Pendiente';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Sistema de Aprobación</h1>
          <p className="text-muted-foreground">Gestiona aprobaciones de contenido antes de publicar</p>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">
              Pendientes de Aprobar ({pendingApprovals.length})
            </TabsTrigger>
            <TabsTrigger value="requests">
              Mis Solicitudes ({myRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingApprovals.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No hay solicitudes pendientes de aprobación</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pendingApprovals.map((approval) => (
                  <Card key={approval.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle>{approval.post?.title}</CardTitle>
                          <CardDescription>
                            <Badge variant="outline" className="mr-2">{approval.post?.platform}</Badge>
                            Programado: {approval.post?.scheduled_date}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(approval.status)}>
                          {getStatusText(approval.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Contenido:</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {approval.post?.content}
                        </p>
                      </div>

                      {selectedApproval?.id === approval.id ? (
                        <div className="space-y-3 border-t pt-4">
                          <Textarea
                            placeholder="Agrega comentarios (opcional para aprobar, obligatorio para rechazar o solicitar revisión)"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleApprove(approval.id)}
                              disabled={isLoading}
                              className="flex-1"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Aprobar
                            </Button>
                            <Button
                              onClick={() => handleRequestRevision(approval.id)}
                              disabled={isLoading}
                              variant="outline"
                              className="flex-1"
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Solicitar Revisión
                            </Button>
                            <Button
                              onClick={() => handleReject(approval.id)}
                              disabled={isLoading}
                              variant="destructive"
                              className="flex-1"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Rechazar
                            </Button>
                            <Button
                              onClick={() => {
                                setSelectedApproval(null);
                                setFeedback('');
                              }}
                              variant="ghost"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setSelectedApproval(approval)}
                          className="w-full"
                        >
                          Revisar y Decidir
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            {myRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Send className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No has enviado solicitudes de aprobación</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {myRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle>{request.post?.title}</CardTitle>
                          <CardDescription>
                            <Badge variant="outline" className="mr-2">{request.post?.platform}</Badge>
                            Enviado: {new Date(request.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusText(request.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold mb-2">Contenido:</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {request.post?.content}
                          </p>
                        </div>

                        {request.feedback && (
                          <div className="bg-muted p-3 rounded-lg">
                            <h4 className="font-semibold mb-1 flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              Feedback del revisor:
                            </h4>
                            <p className="text-sm">{request.feedback}</p>
                          </div>
                        )}
                      </div>
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