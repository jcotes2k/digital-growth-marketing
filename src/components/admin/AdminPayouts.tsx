import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Clock, CreditCard, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { PayoutWithDetails } from "@/types/admin";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AdminPayoutsProps {
  payouts: PayoutWithDetails[];
  onUpdateStatus: (payoutId: string, status: 'completed' | 'failed', notes?: string) => Promise<boolean>;
}

const getPaymentMethodIcon = (method: string) => {
  switch (method) {
    case 'bank': return <CreditCard className="h-4 w-4" />;
    case 'nequi': return <Smartphone className="h-4 w-4 text-purple-500" />;
    case 'daviplata': return <Smartphone className="h-4 w-4 text-red-500" />;
    default: return null;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge className="bg-yellow-500"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
    case 'processing':
      return <Badge className="bg-blue-500">Procesando</Badge>;
    case 'completed':
      return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Completado</Badge>;
    case 'failed':
      return <Badge className="bg-red-500"><XCircle className="h-3 w-3 mr-1" />Fallido</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const AdminPayouts = ({ payouts, onUpdateStatus }: AdminPayoutsProps) => {
  const [selectedPayout, setSelectedPayout] = useState<PayoutWithDetails | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const pendingPayouts = payouts.filter(p => p.status === 'pending');
  const processedPayouts = payouts.filter(p => p.status !== 'pending');

  const handleAction = (payout: PayoutWithDetails, action: 'approve' | 'reject') => {
    setSelectedPayout(payout);
    setActionType(action);
    setNotes("");
  };

  const confirmAction = async () => {
    if (!selectedPayout || !actionType) return;
    
    setIsProcessing(true);
    const status = actionType === 'approve' ? 'completed' : 'failed';
    const success = await onUpdateStatus(selectedPayout.id, status, notes || undefined);
    
    if (success) {
      toast({
        title: actionType === 'approve' ? "Pago aprobado" : "Pago rechazado",
        description: `El pago de $${selectedPayout.amount} ha sido ${actionType === 'approve' ? 'aprobado' : 'rechazado'}`,
      });
    }
    
    setIsProcessing(false);
    setSelectedPayout(null);
    setActionType(null);
  };

  const formatPaymentDetails = (payout: PayoutWithDetails) => {
    const details = payout.payment_details;
    if (!details) return "Sin detalles";
    
    switch (payout.payment_method) {
      case 'bank':
        return `${details.bank_name} - ${details.account_number} (${details.account_holder})`;
      case 'nequi':
        return `Nequi: ${details.nequi_phone}`;
      case 'daviplata':
        return `Daviplata: ${details.daviplata_phone}`;
      default:
        return JSON.stringify(details);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestión de Pagos</h2>

      {/* Pending Payouts */}
      <Card>
        <CardHeader className="bg-yellow-50 dark:bg-yellow-950/30">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-yellow-600" />
            Pagos Pendientes ({pendingPayouts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Afiliado</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Detalles de Pago</TableHead>
                <TableHead>Solicitado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingPayouts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No hay pagos pendientes
                  </TableCell>
                </TableRow>
              ) : (
                pendingPayouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payout.affiliate_name || "Sin nombre"}</div>
                        <div className="text-sm text-muted-foreground">{payout.affiliate_email}</div>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {payout.affiliate_code}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-xl font-bold text-green-600">
                        ${payout.amount.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(payout.payment_method)}
                        <span className="capitalize">{payout.payment_method}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{formatPaymentDetails(payout)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(payout.requested_at), "dd MMM yyyy HH:mm", { locale: es })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => handleAction(payout, 'approve')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAction(payout, 'reject')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Rechazar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Processed Payouts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historial de Pagos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Afiliado</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Procesado</TableHead>
                <TableHead>Notas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedPayouts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No hay pagos procesados
                  </TableCell>
                </TableRow>
              ) : (
                processedPayouts.slice(0, 20).map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>
                      <div className="font-medium">{payout.affiliate_name || payout.affiliate_email}</div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${payout.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(payout.status)}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {payout.processed_at 
                          ? format(new Date(payout.processed_at), "dd MMM yyyy", { locale: es })
                          : "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {payout.admin_notes || "-"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedPayout} onOpenChange={() => setSelectedPayout(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Aprobar Pago' : 'Rechazar Pago'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between">
                <span>Afiliado:</span>
                <span className="font-medium">{selectedPayout?.affiliate_name}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Monto:</span>
                <span className="font-bold text-green-600">${selectedPayout?.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Método:</span>
                <span className="capitalize">{selectedPayout?.payment_method}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Notas (opcional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Agregar notas sobre esta transacción..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPayout(null)}>
              Cancelar
            </Button>
            <Button
              onClick={confirmAction}
              disabled={isProcessing}
              className={actionType === 'approve' ? 'bg-green-500 hover:bg-green-600' : ''}
              variant={actionType === 'reject' ? 'destructive' : 'default'}
            >
              {isProcessing ? 'Procesando...' : actionType === 'approve' ? 'Confirmar Aprobación' : 'Confirmar Rechazo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
