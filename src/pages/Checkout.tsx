import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { EPaycoCheckout } from "@/components/EPaycoCheckout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Zap, Crown, Star, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PLANS = [
  {
    id: 'pro' as const,
    name: 'Pro',
    price: 19,
    icon: Zap,
    color: 'bg-blue-500',
    features: [
      'Herramientas de Contenido',
      'Generador de contenido IA',
      'Calendario editorial',
      'Análisis de competencia',
      'Soporte por email',
    ],
  },
  {
    id: 'premium' as const,
    name: 'Premium',
    price: 39,
    icon: Crown,
    color: 'bg-purple-500',
    popular: true,
    features: [
      'Todo lo del Plan Pro',
      'Herramientas Avanzadas',
      'Generador de videos/podcasts',
      'SEO y AEO Analyzer',
      'Soporte WhatsApp',
    ],
  },
  {
    id: 'gold' as const,
    name: 'Gold',
    price: 49,
    icon: Star,
    color: 'bg-gradient-to-r from-amber-500 to-yellow-500',
    features: [
      'Todo lo del Plan Premium',
      '16 Agentes IA Especializados',
      'Agencia de Marketing Virtual',
      'Automatización de workflows',
      'Soporte prioritario 24/7',
    ],
  },
];

export default function Checkout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<{
    userId: string;
    email: string;
    name: string;
  } | null>(null);

  const selectedPlan = searchParams.get("plan") as 'pro' | 'premium' | 'gold' | null;

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Sesión requerida",
          description: "Debes iniciar sesión para continuar con el pago",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      setUserData({
        userId: user.id,
        email: user.email || '',
        name: user.user_metadata?.full_name || user.email || 'Cliente',
      });
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate, toast]);

  const handleSelectPlan = (planId: 'pro' | 'premium' | 'gold') => {
    setSearchParams({ plan: planId });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If no plan selected, show plan selector
  if (!selectedPlan || !['pro', 'premium', 'gold'].includes(selectedPlan)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>

          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Elige tu Plan</h1>
            <p className="text-muted-foreground">
              Selecciona el plan que mejor se adapte a tus necesidades
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card 
                  key={plan.id}
                  className={`relative cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
                    plan.popular ? 'border-primary border-2' : ''
                  }`}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                        Más Popular
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <div className={`mx-auto w-12 h-12 rounded-full ${plan.color} flex items-center justify-center mb-2`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                      <span className="text-muted-foreground">/mes</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                      Seleccionar {plan.name}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>🔒 Pago seguro con ePayco • Cancela cuando quieras</p>
            <p className="mt-2 text-xs">
              <strong>Modo de prueba:</strong> Usa tarjeta 4575 6234 5678 9012, CVV 123, cualquier fecha futura
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Finalizar Suscripción</h1>
          <p className="text-muted-foreground">
            Estás a un paso de desbloquear todo el potencial
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
          <Button variant="outline" onClick={() => setSearchParams({})}>
            Cambiar plan
          </Button>
        </div>

        {userData && (
          <EPaycoCheckout
            userId={userData.userId}
            userEmail={userData.email}
            userName={userData.name}
            plan={selectedPlan}
            onSuccess={() => {
              toast({
                title: "Procesando pago",
                description: "Serás redirigido a la pasarela de pago segura",
              });
            }}
            onError={(error) => {
              toast({
                title: "Error",
                description: error,
                variant: "destructive",
              });
            }}
          />
        )}

        <div className="text-center text-xs text-muted-foreground border-t pt-4">
          <p><strong>🧪 Modo de prueba ePayco:</strong></p>
          <p>Tarjeta: 4575 6234 5678 9012</p>
          <p>CVV: 123 • Fecha: Cualquier fecha futura</p>
        </div>
      </div>
    </div>
  );
}
