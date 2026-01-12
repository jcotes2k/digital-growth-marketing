import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Crown, Zap, Star, Timer, Building, Activity } from "lucide-react";
import type { UserWithDetails } from "@/types/admin";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AdminUsersProps {
  users: UserWithDetails[];
}

const getPlanBadge = (plan: string, isTrial: boolean) => {
  const baseClasses = "text-xs";
  switch (plan) {
    case 'gold':
      return (
        <div className="flex items-center gap-1">
          <Badge className={`bg-gradient-to-r from-amber-500 to-yellow-500 ${baseClasses}`}>
            <Star className="h-3 w-3 mr-1" />GOLD
          </Badge>
          {isTrial && <Badge variant="outline" className="text-xs"><Timer className="h-3 w-3 mr-1" />Trial</Badge>}
        </div>
      );
    case 'premium':
      return (
        <div className="flex items-center gap-1">
          <Badge className={`bg-purple-500 ${baseClasses}`}>
            <Crown className="h-3 w-3 mr-1" />PREMIUM
          </Badge>
          {isTrial && <Badge variant="outline" className="text-xs"><Timer className="h-3 w-3 mr-1" />Trial</Badge>}
        </div>
      );
    case 'pro':
      return (
        <div className="flex items-center gap-1">
          <Badge className={`bg-blue-500 ${baseClasses}`}>
            <Zap className="h-3 w-3 mr-1" />PRO
          </Badge>
          {isTrial && <Badge variant="outline" className="text-xs"><Timer className="h-3 w-3 mr-1" />Trial</Badge>}
        </div>
      );
    default:
      return <Badge variant="outline" className={baseClasses}>FREE</Badge>;
  }
};

export const AdminUsers = ({ users }: AdminUsersProps) => {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [sectorFilter, setSectorFilter] = useState<string>("all");

  // Get unique sectors
  const sectors = [...new Set(users.map(u => u.business_sector))].filter(Boolean);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.company_name?.toLowerCase().includes(search.toLowerCase());
    
    const matchesPlan = planFilter === 'all' || user.plan === planFilter;
    const matchesSector = sectorFilter === 'all' || user.business_sector === sectorFilter;

    return matchesSearch && matchesPlan && matchesSector;
  });

  const exportToCSV = () => {
    const headers = ['Email', 'Nombre', 'Empresa', 'Sector', 'Plan', 'Trial', 'Uso', 'Registro'];
    const rows = filteredUsers.map(u => [
      u.email,
      u.full_name,
      u.company_name || '',
      u.business_sector,
      u.plan,
      u.is_trial ? 'Sí' : 'No',
      u.tool_usage_count,
      format(new Date(u.created_at), 'yyyy-MM-dd'),
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usuarios_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold">Panel de Usuarios ({users.length})</h2>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email o empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los planes</SelectItem>
            <SelectItem value="gold">Gold</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="free">Free</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sectorFilter} onValueChange={setSectorFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los sectores</SelectItem>
            {sectors.map(sector => (
              <SelectItem key={sector} value={sector}>{sector}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-center">Uso</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.full_name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.company_name ? (
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span>{user.company_name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.business_sector}</Badge>
                      </TableCell>
                      <TableCell>
                        {getPlanBadge(user.plan, user.is_trial)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span className={`font-medium ${user.tool_usage_count > 10 ? 'text-green-600' : user.tool_usage_count > 0 ? 'text-blue-600' : 'text-muted-foreground'}`}>
                            {user.tool_usage_count}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{user.whatsapp}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(user.created_at), "dd MMM yyyy", { locale: es })}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
