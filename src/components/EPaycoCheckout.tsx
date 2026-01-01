import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard, Shield, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    ePayco?: {
      checkout: {
        configure: (config: Record<string, string>) => {
          open: (data: Record<string, string>) => void;
        };
      };
    };
  }
}

interface EPaycoCheckoutProps {
  userId: string;
  userEmail: string;
  userName: string;
  plan: 'pro' | 'premium' | 'gold';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const PLAN_DETAILS = {
  pro: { name: 'PRO', price: 19, color: 'text-primary', promo: false },
  premium: { name: 'PREMIUM', price: 39, color: 'text-primary', promo: false },
  gold: { name: 'GOLD', price: 49, color: 'text-amber-500', promo: false },
};

export function EPaycoCheckout({ userId, userEmail, userName, plan, onSuccess, onError }: EPaycoCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const planDetails = PLAN_DETAILS[plan];

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      // Create ePayco session
      const { data, error } = await supabase.functions.invoke('epayco-create-session', {
        body: { userId, plan, userEmail, userName }
      });

      if (error || !data?.success) {
        throw new Error(error?.message || data?.error || 'Error creating payment session');
      }

      const { checkoutData } = data;

      // Check if ePayco script is loaded
      if (!window.ePayco) {
        throw new Error('Payment system not loaded. Please refresh the page.');
      }

      // Configure and open ePayco checkout
      const handler = window.ePayco.checkout.configure({
        key: checkoutData.publicKey,
        test: String(checkoutData.test === 'true'),
      });

      handler.open({
        name: checkoutData.name,
        description: checkoutData.description,
        invoice: checkoutData.invoice,
        currency: checkoutData.currency,
        amount: checkoutData.amount,
        tax_base: checkoutData.taxBase,
        tax: checkoutData.tax,
        country: checkoutData.country,
        lang: checkoutData.lang,
        external: checkoutData.external,
        confirmation: checkoutData.confirmation,
        response: checkoutData.response,
        name_billing: checkoutData.nameClient,
        email_billing: checkoutData.email,
        extra1: checkoutData.extra1,
        extra2: checkoutData.extra2,
        extra3: checkoutData.extra3,
      });

      onSuccess?.();
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment error occurred';
      toast({
        title: "Error de pago",
        description: errorMessage,
        variant: "destructive",
      });
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className={`text-2xl ${planDetails.color}`}>
          Plan {planDetails.name}
        </CardTitle>
        <CardDescription>
          Completa tu suscripción de forma segura
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <span className={`text-4xl font-bold ${planDetails.color}`}>
            ${planDetails.price}
          </span>
          <span className="text-muted-foreground">/mes</span>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Acceso inmediato después del pago</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Cancela cuando quieras</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Soporte prioritario</span>
          </div>
        </div>

        <Button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pagar ${planDetails.price} USD
            </>
          )}
        </Button>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Pago seguro procesado por ePayco</span>
        </div>

        <div className="flex justify-center gap-4 opacity-50">
          <img src="https://369969691f476073508a-60bf0867add971908d4f26a64519c2aa.ssl.cf5.rackcdn.com/btns/epayco/pagos-icon.png" alt="Métodos de pago" className="h-8" />
        </div>
      </CardContent>
    </Card>
  );
}