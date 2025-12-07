import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { EPaycoCheckout } from "@/components/EPaycoCheckout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<{
    userId: string;
    email: string;
    name: string;
  } | null>(null);

  const plan = searchParams.get("plan") as 'pro' | 'premium' | 'gold' | null;

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

  if (!plan || !['pro', 'premium', 'gold'].includes(plan)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Plan no válido</h1>
          <p className="text-muted-foreground">El plan seleccionado no existe.</p>
          <Button asChild>
            <Link to="/register">Volver al registro</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

        <Button variant="ghost" asChild className="mb-4">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>
        </Button>

        {userData && (
          <EPaycoCheckout
            userId={userData.userId}
            userEmail={userData.email}
            userName={userData.name}
            plan={plan}
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
      </div>
    </div>
  );
}