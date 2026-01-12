import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, LayoutDashboard, Users, UserCheck, DollarSign, BarChart3, ArrowLeft, RefreshCw } from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminAffiliates } from "@/components/admin/AdminAffiliates";
import { AdminPayouts } from "@/components/admin/AdminPayouts";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminUsageStats } from "@/components/admin/AdminUsageStats";

const Admin = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {
    isAdmin,
    isLoading,
    stats,
    users,
    affiliates,
    payouts,
    toolUsage,
    loadAdminData,
    updatePayoutStatus,
    toggleAffiliateStatus,
  } = useAdmin();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/');
    }
  }, [isLoading, isAdmin, navigate]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAdminData();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Shield className="h-12 w-12 animate-pulse text-primary mx-auto" />
          <p>Verificando permisos de administrador...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <Shield className="h-16 w-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold">Acceso Denegado</h1>
            <p className="text-muted-foreground">
              No tienes permisos para acceder a esta página.
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Panel de Administración</h1>
                <p className="text-sm text-muted-foreground">Gestión de usuarios, afiliados y estadísticas</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Resumen</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 py-3">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Usuarios</span>
            </TabsTrigger>
            <TabsTrigger value="affiliates" className="flex items-center gap-2 py-3">
              <UserCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Afiliados</span>
            </TabsTrigger>
            <TabsTrigger value="payouts" className="flex items-center gap-2 py-3">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Pagos</span>
            </TabsTrigger>
            <TabsTrigger value="usage" className="flex items-center gap-2 py-3">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Uso</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminOverview stats={stats} />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsers users={users} />
          </TabsContent>

          <TabsContent value="affiliates">
            <AdminAffiliates 
              affiliates={affiliates} 
              onToggleStatus={toggleAffiliateStatus}
            />
          </TabsContent>

          <TabsContent value="payouts">
            <AdminPayouts 
              payouts={payouts} 
              onUpdateStatus={updatePayoutStatus}
            />
          </TabsContent>

          <TabsContent value="usage">
            <AdminUsageStats toolUsage={toolUsage} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
