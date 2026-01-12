import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Search, Users, DollarSign, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AffiliateWithDetails } from "@/types/admin";

interface AdminAffiliatesProps {
  affiliates: AffiliateWithDetails[];
  onToggleStatus: (affiliateId: string, isActive: boolean) => Promise<boolean>;
}

export const AdminAffiliates = ({ affiliates, onToggleStatus }: AdminAffiliatesProps) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const { toast } = useToast();

  const filteredAffiliates = affiliates.filter(aff => {
    const matchesSearch = 
      aff.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      aff.email?.toLowerCase().includes(search.toLowerCase()) ||
      aff.affiliate_code.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'active' && aff.is_active) ||
      (filter === 'inactive' && !aff.is_active);

    return matchesSearch && matchesFilter;
  });

  const handleToggle = async (aff: AffiliateWithDetails) => {
    const success = await onToggleStatus(aff.id, !aff.is_active);
    if (success) {
      toast({
        title: aff.is_active ? "Afiliado desactivado" : "Afiliado activado",
        description: `${aff.full_name || aff.email} ha sido ${aff.is_active ? 'desactivado' : 'activado'}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold">Gestión de Afiliados</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="cursor-pointer" onClick={() => setFilter('all')}>
            Todos ({affiliates.length})
          </Badge>
          <Badge 
            variant={filter === 'active' ? 'default' : 'outline'} 
            className="cursor-pointer bg-green-500 hover:bg-green-600"
            onClick={() => setFilter('active')}
          >
            Activos ({affiliates.filter(a => a.is_active).length})
          </Badge>
          <Badge 
            variant={filter === 'inactive' ? 'default' : 'outline'} 
            className="cursor-pointer"
            onClick={() => setFilter('inactive')}
          >
            Inactivos ({affiliates.filter(a => !a.is_active).length})
          </Badge>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, email o código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Afiliado</TableHead>
                <TableHead>Código</TableHead>
                <TableHead className="text-center">Referidos</TableHead>
                <TableHead className="text-right">Total Ganado</TableHead>
                <TableHead className="text-right">Pendiente</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAffiliates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No se encontraron afiliados
                  </TableCell>
                </TableRow>
              ) : (
                filteredAffiliates.map((aff) => (
                  <TableRow key={aff.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{aff.full_name || "Sin nombre"}</div>
                        <div className="text-sm text-muted-foreground">{aff.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        <Link className="h-3 w-3 mr-1" />
                        {aff.affiliate_code}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{aff.referral_count || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium text-green-600">
                        ${aff.total_earned.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-medium ${aff.pending_payout > 0 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                        ${aff.pending_payout.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={aff.is_active ? 'bg-green-500' : 'bg-gray-400'}>
                        {aff.is_active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={aff.is_active}
                        onCheckedChange={() => handleToggle(aff)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
