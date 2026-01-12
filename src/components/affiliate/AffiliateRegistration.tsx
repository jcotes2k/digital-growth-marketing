import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAffiliate } from '@/hooks/use-affiliate';
import { Loader2, Users, DollarSign, TrendingUp } from 'lucide-react';

export function AffiliateRegistration() {
  const { registerAsAffiliate, isLoading } = useAffiliate();
  const [customCode, setCustomCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    setIsSubmitting(true);
    await registerAsAffiliate(customCode || undefined);
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Programa de Afiliados</h1>
        <p className="text-xl text-muted-foreground">
          Gana 10% de comisión por cada cliente que refieras
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="text-center">
            <Users className="h-12 w-12 mx-auto text-primary mb-2" />
            <CardTitle>Refiere Clientes</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            Comparte tu link único con tu audiencia y redes sociales
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <DollarSign className="h-12 w-12 mx-auto text-green-500 mb-2" />
            <CardTitle>Gana Comisiones</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            Recibe 10% de cada suscripción pagada por tus referidos
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <TrendingUp className="h-12 w-12 mx-auto text-blue-500 mb-2" />
            <CardTitle>Cobra tu Dinero</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            Retira a tu banco, Nequi o Daviplata cuando quieras
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle>Únete Ahora</CardTitle>
          <CardDescription>
            Crea tu código de afiliado personalizado o deja que generemos uno para ti
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customCode">Código Personalizado (Opcional)</Label>
            <Input
              id="customCode"
              placeholder="Ej: JUANMARKETING"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              maxLength={15}
            />
            <p className="text-sm text-muted-foreground">
              Solo letras y números, máximo 15 caracteres
            </p>
          </div>

          <Button 
            onClick={handleRegister} 
            className="w-full" 
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrando...
              </>
            ) : (
              'Convertirme en Afiliado'
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Al registrarte aceptas los términos del programa de afiliados
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
