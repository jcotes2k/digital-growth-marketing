import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAffiliate } from '@/hooks/use-affiliate';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Loader2, DollarSign, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  processing: 'Procesando',
  completed: 'Completado',
  failed: 'Fallido',
};

export function AffiliatePayoutRequest() {
  const { affiliate, stats, payouts, requestPayout } = useAffiliate();
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await requestPayout(parseFloat(amount));
    if (success) {
      setAmount('');
    }
    setIsSubmitting(false);
  };

  const pendingBalance = stats?.pendingPayout || 0;
  const hasPaymentMethod = !!affiliate?.payment_method;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Solicitar Retiro
          </CardTitle>
          <CardDescription>
            Retira tus comisiones ganadas a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Saldo Disponible</p>
            <p className="text-3xl font-bold">${pendingBalance.toFixed(2)} USD</p>
          </div>

          {!hasPaymentMethod && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Debes configurar un método de pago antes de solicitar un retiro
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRequestPayout} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Monto a Retirar (USD)</Label>
              <Input
                id="amount"
                type="number"
                min="10"
                max={pendingBalance}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Mínimo $10"
                required
              />
              <p className="text-xs text-muted-foreground">
                Mínimo: $10 USD | Máximo: ${pendingBalance.toFixed(2)} USD
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || !hasPaymentMethod || pendingBalance < 10}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Solicitar Retiro'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Retiros</CardTitle>
        </CardHeader>
        <CardContent>
          {payouts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No has realizado retiros aún</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>
                      {format(new Date(payout.requested_at), 'dd MMM yyyy', { locale: es })}
                    </TableCell>
                    <TableCell className="font-semibold">
                      ${payout.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="capitalize">
                      {payout.payment_method}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${statusColors[payout.status]}`}>
                        {statusLabels[payout.status]}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
