import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAffiliate } from '@/hooks/use-affiliate';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Users } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
};

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  paid: 'Pagado',
};

export function AffiliateReferralsList() {
  const { referrals } = useAffiliate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Mis Referidos
        </CardTitle>
        <CardDescription>
          Historial de clientes que se registraron con tu link
        </CardDescription>
      </CardHeader>
      <CardContent>
        {referrals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aún no tienes referidos</p>
            <p className="text-sm">Comparte tu link para comenzar a ganar</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Monto Pagado</TableHead>
                <TableHead>Tu Comisión</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell>
                    {format(new Date(referral.created_at), 'dd MMM yyyy', { locale: es })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="uppercase">
                      {referral.referred_plan}
                    </Badge>
                  </TableCell>
                  <TableCell>${referral.payment_amount.toFixed(2)}</TableCell>
                  <TableCell className="font-semibold text-green-600 dark:text-green-400">
                    ${referral.commission_amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[referral.status]}`}>
                      {statusLabels[referral.status]}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
