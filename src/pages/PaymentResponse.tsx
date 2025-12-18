import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, Home, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type PaymentStatus = 'success' | 'pending' | 'error' | 'loading';

export default function PaymentResponse() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<PaymentStatus>('loading');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const refPayco = searchParams.get("ref_payco");
      const codResponse = searchParams.get("x_cod_response");
      const response = searchParams.get("x_response");

      // First check URL parameters if available
      if (codResponse === '1' || response === 'Aceptada') {
        setStatus('success');
        return;
      }
      if (codResponse === '3' || response === 'Pendiente') {
        setStatus('pending');
        return;
      }
      if (codResponse === '2' || codResponse === '4' || response === 'Rechazada') {
        setStatus('error');
        return;
      }

      // If only ref_payco is available, query the database
      if (refPayco) {
        const { data } = await supabase
          .from('payment_transactions')
          .select('status')
          .eq('epayco_ref', refPayco)
          .maybeSingle();

        if (data?.status === 'approved') {
          setStatus('success');
        } else if (data?.status === 'pending') {
          setStatus('pending');
        } else {
          setStatus('error');
        }
      } else {
        setStatus('error');
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  const statusConfig = {
    loading: {
      icon: Clock,
      iconColor: 'text-muted-foreground',
      title: 'Verificando pago...',
      description: 'Por favor espera mientras verificamos tu transacción.',
      bgColor: 'bg-muted/20',
    },
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      title: '¡Pago exitoso!',
      description: 'Tu suscripción ha sido activada correctamente. Ya puedes acceder a todas las funciones de tu plan.',
      bgColor: 'bg-green-500/10',
    },
    pending: {
      icon: Clock,
      iconColor: 'text-amber-500',
      title: 'Pago pendiente',
      description: 'Tu pago está siendo procesado. Te notificaremos cuando se confirme. Esto puede tomar unos minutos.',
      bgColor: 'bg-amber-500/10',
    },
    error: {
      icon: XCircle,
      iconColor: 'text-destructive',
      title: 'Pago no completado',
      description: 'Hubo un problema con tu pago. Por favor intenta nuevamente o contacta a soporte.',
      bgColor: 'bg-destructive/10',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className={`mx-auto w-20 h-20 rounded-full ${config.bgColor} flex items-center justify-center mb-4`}>
            <Icon className={`h-10 w-10 ${config.iconColor}`} />
          </div>
          <CardTitle className="text-2xl">{config.title}</CardTitle>
          <CardDescription className="text-base">
            {config.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'success' && (
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Referencia de pago:
              </p>
              <p className="font-mono font-semibold">
                {searchParams.get("ref_payco") || 'N/A'}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link to="/">
                {status === 'success' ? (
                  <>
                    Ir al Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    <Home className="mr-2 h-4 w-4" />
                    Volver al inicio
                  </>
                )}
              </Link>
            </Button>

            {status === 'error' && (
              <Button variant="outline" asChild className="w-full">
                <Link to="/register">
                  Intentar de nuevo
                </Link>
              </Button>
            )}

            {status === 'pending' && (
              <p className="text-xs text-center text-muted-foreground">
                Recibirás un correo electrónico cuando se confirme tu pago.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}