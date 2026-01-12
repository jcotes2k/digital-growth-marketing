import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAffiliate } from '@/hooks/use-affiliate';
import { Copy, DollarSign, Users, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { AffiliatePaymentForm } from './AffiliatePaymentForm';
import { AffiliateReferralsList } from './AffiliateReferralsList';
import { AffiliatePayoutRequest } from './AffiliatePayoutRequest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AffiliateDashboard() {
  const { 
    affiliate, 
    stats, 
    isLoading, 
    getAffiliateLink, 
    copyLinkToClipboard 
  } = useAffiliate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!affiliate) return null;

  const affiliateLink = getAffiliateLink();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Panel de Afiliado</h1>
          <p className="text-muted-foreground">Código: {affiliate.affiliate_code}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm ${
          affiliate.is_active 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {affiliate.is_active ? 'Activo' : 'Inactivo'}
        </div>
      </div>

      {/* Affiliate Link */}
      <Card>
        <CardHeader>
          <CardTitle>Tu Link de Referido</CardTitle>
          <CardDescription>
            Comparte este link para ganar comisiones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={affiliateLink}
              className="flex-1 px-3 py-2 bg-muted rounded-md text-sm"
            />
            <Button onClick={copyLinkToClipboard} variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Referidos</p>
                <p className="text-2xl font-bold">{stats?.totalReferrals || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold">{stats?.pendingReferrals || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aprobados</p>
                <p className="text-2xl font-bold">{stats?.approvedReferrals || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo Pendiente</p>
                <p className="text-2xl font-bold">${stats?.pendingPayout?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="referrals" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="referrals">Referidos</TabsTrigger>
          <TabsTrigger value="payment">Método de Pago</TabsTrigger>
          <TabsTrigger value="withdraw">Retirar</TabsTrigger>
        </TabsList>

        <TabsContent value="referrals">
          <AffiliateReferralsList />
        </TabsContent>

        <TabsContent value="payment">
          <AffiliatePaymentForm />
        </TabsContent>

        <TabsContent value="withdraw">
          <AffiliatePayoutRequest />
        </TabsContent>
      </Tabs>
    </div>
  );
}
