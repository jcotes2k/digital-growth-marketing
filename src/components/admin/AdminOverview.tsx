import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Crown, Zap, Star, DollarSign, UserCheck, Clock, TrendingUp } from "lucide-react";
import type { AdminStats } from "@/types/admin";

interface AdminOverviewProps {
  stats: AdminStats | null;
}

export const AdminOverview = ({ stats }: AdminOverviewProps) => {
  if (!stats) {
    return <div className="text-center py-8">Cargando estadísticas...</div>;
  }

  const statCards = [
    {
      title: "Total Usuarios",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Plan Gold",
      value: stats.usersByPlan.gold || 0,
      icon: Star,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Plan Premium",
      value: stats.usersByPlan.premium || 0,
      icon: Crown,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Plan Pro",
      value: stats.usersByPlan.pro || 0,
      icon: Zap,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Plan Free",
      value: stats.usersByPlan.free || 0,
      icon: Users,
      color: "text-muted-foreground",
      bgColor: "bg-muted/50",
    },
    {
      title: "Trials Activos",
      value: stats.activeTrials,
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Afiliados Activos",
      value: stats.totalAffiliates,
      icon: UserCheck,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Comisiones Totales",
      value: `$${stats.totalCommissions.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Pagos Pendientes",
      value: `$${stats.pendingPayouts.toLocaleString()}`,
      icon: DollarSign,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Resumen General</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((card) => (
            <Card key={card.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  {card.title}
                  <div className={`p-2 rounded-full ${card.bgColor}`}>
                    <card.icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${card.color}`}>
                  {card.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribución de Planes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.usersByPlan).map(([plan, count]) => {
                const percentage = stats.totalUsers > 0 
                  ? Math.round((count / stats.totalUsers) * 100) 
                  : 0;
                const colors: Record<string, string> = {
                  gold: "bg-amber-500",
                  premium: "bg-purple-500",
                  pro: "bg-blue-500",
                  free: "bg-gray-400",
                };
                return (
                  <div key={plan} className="flex items-center gap-4">
                    <Badge className={`${colors[plan]} text-white w-20 justify-center`}>
                      {plan.toUpperCase()}
                    </Badge>
                    <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${colors[plan]} transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">
                      {count} ({percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estado del Programa de Afiliados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span>Afiliados Activos</span>
                <span className="font-bold text-green-600">{stats.totalAffiliates}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span>Comisiones Generadas</span>
                <span className="font-bold text-emerald-600">${stats.totalCommissions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span>Comisiones Pendientes</span>
                <span className="font-bold text-orange-600">${stats.totalPendingCommissions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                <span>Pagos por Aprobar</span>
                <span className="font-bold text-red-600">${stats.pendingPayouts.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
