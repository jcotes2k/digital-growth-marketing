import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Users, TrendingUp } from "lucide-react";
import type { ToolUsageStat } from "@/types/admin";
import { PHASE_CONFIG } from "@/hooks/use-user-progress";

interface AdminUsageStatsProps {
  toolUsage: ToolUsageStat[];
}

const getToolName = (toolId: string): string => {
  const phase = PHASE_CONFIG.find(p => p.id === toolId);
  return phase?.name || toolId;
};

export const AdminUsageStats = ({ toolUsage }: AdminUsageStatsProps) => {
  const totalUsage = toolUsage.reduce((sum, t) => sum + t.usage_count, 0);
  const maxUsage = Math.max(...toolUsage.map(t => t.usage_count), 1);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Estadísticas de Uso</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Total de Usos
              <BarChart3 className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalUsage.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Herramientas Usadas
              <TrendingUp className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{toolUsage.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Usuarios Únicos
              <Users className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {new Set(toolUsage.flatMap(t => t.unique_users)).size || toolUsage[0]?.unique_users || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Ranking de Herramientas Más Usadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {toolUsage.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay datos de uso registrados aún
            </div>
          ) : (
            <div className="space-y-4">
              {toolUsage.slice(0, 15).map((tool, index) => {
                const percentage = (tool.usage_count / maxUsage) * 100;
                return (
                  <div key={tool.tool_name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={index < 3 ? "default" : "outline"} 
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-amber-500' : 
                            index === 1 ? 'bg-gray-400' : 
                            index === 2 ? 'bg-amber-700' : ''
                          }`}
                        >
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{getToolName(tool.tool_name)}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {tool.unique_users} usuarios
                        </div>
                        <Badge variant="secondary" className="min-w-[60px] justify-center">
                          {tool.usage_count} usos
                        </Badge>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Herramientas FREE Más Usadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {toolUsage
                .filter(t => {
                  const phase = PHASE_CONFIG.find(p => p.id === t.tool_name);
                  return phase?.requiredPlan === 'free';
                })
                .slice(0, 5)
                .map((tool) => (
                  <div key={tool.tool_name} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span>{getToolName(tool.tool_name)}</span>
                    <Badge>{tool.usage_count}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Herramientas PREMIUM Más Usadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {toolUsage
                .filter(t => {
                  const phase = PHASE_CONFIG.find(p => p.id === t.tool_name);
                  return phase?.requiredPlan === 'premium' || phase?.requiredPlan === 'gold';
                })
                .slice(0, 5)
                .map((tool) => (
                  <div key={tool.tool_name} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span>{getToolName(tool.tool_name)}</span>
                    <Badge className="bg-purple-500">{tool.usage_count}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
