import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { SubscriptionPlan } from "@/types/user-progress";

const BUSINESS_SECTORS = [
  "Comercio y Retail",
  "Turismo y hospitalidad",
  "Educación y formación",
  "Salud y bienestar",
  "Manufactura e industria",
  "Construcción e inmobiliario",
  "Finanzas y seguros",
  "Servicios profesionales (abogados, contadores, consultores)",
  "Agroindustria",
  "Tecnología y startups",
  "Logística y transporte",
  "Arte, cultura y entretenimiento",
  "Marcas Personales, Influencers, Creadores de Contenido",
];

const formSchema = z.object({
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  whatsapp: z.string().min(10, "Número de WhatsApp inválido"),
  companyName: z.string().optional(),
  businessSector: z.string().min(1, "Selecciona un sector"),
  plan: z.enum(["free", "pro", "premium", "gold"]),
});

type FormData = z.infer<typeof formSchema>;

export function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      whatsapp: "",
      companyName: "",
      businessSector: "",
      plan: "free",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: data.fullName,
            whatsapp: data.whatsapp,
            company_name: data.companyName || null,
            business_sector: data.businessSector,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create subscription record (free by default, will be upgraded after payment)
        const { error: subError } = await supabase
          .from("user_subscriptions")
          .insert({
            user_id: authData.user.id,
            plan: data.plan === 'free' ? 'free' : 'free', // Start as free, upgrade after payment
          });

        if (subError) throw subError;

        // If paid plan, redirect to checkout
        if (data.plan !== 'free') {
          toast({
            title: "¡Cuenta creada!",
            description: "Ahora completa tu suscripción para activar el plan " + data.plan.toUpperCase(),
          });
          navigate(`/checkout?plan=${data.plan}`);
        } else {
          toast({
            title: "¡Registro exitoso!",
            description: "Tu cuenta ha sido creada correctamente.",
          });
          navigate("/");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error durante el registro",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl>
                <Input placeholder="Juan Pérez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input type="email" placeholder="correo@ejemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp</FormLabel>
              <FormControl>
                <Input placeholder="+57 300 123 4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Empresa o Marca (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Mi Empresa S.A." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessSector"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sector Empresarial</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu sector" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BUSINESS_SECTORS.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan de Suscripción</FormLabel>
              <FormControl>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <PlanCard
                    name="Gratuito"
                    price="$0"
                    features={[
                      "Fases principales (1-6)",
                      "Canvas de Negocio",
                      "Estrategia de Contenido",
                      "Soporte básico",
                    ]}
                    isSelected={field.value === "free"}
                    onClick={() => field.onChange("free")}
                  />
                  <PlanCard
                    name="PRO"
                    price="$19"
                    period="/mes"
                    features={[
                      "Todo lo de Gratuito",
                      "Herramientas hasta Competencia",
                      "Exportar PDF",
                      "Soporte vía email",
                    ]}
                    isSelected={field.value === "pro"}
                    onClick={() => field.onChange("pro")}
                    popular
                  />
                  <PlanCard
                    name="PREMIUM"
                    price="$39"
                    period="/mes"
                    features={[
                      "Todo lo de PRO",
                      "Todas las herramientas",
                      "Dashboard en tiempo real",
                      "Soporte por WhatsApp y ChatBot",
                    ]}
                    isSelected={field.value === "premium"}
                    onClick={() => field.onChange("premium")}
                  />
                  <PlanCard
                    name="GOLD"
                    price="$49"
                    period="/mes"
                    features={[
                      "Todo lo de PREMIUM",
                      "Agencia de Marketing IA",
                      "+15 agentes especializados",
                      "Workflows automatizados",
                      "Consultor Business Strategy",
                    ]}
                    isSelected={field.value === "gold"}
                    onClick={() => field.onChange("gold")}
                    gold
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registrando...
            </>
          ) : (
            "Crear Cuenta"
          )}
        </Button>
      </form>
    </Form>
  );
}

interface PlanCardProps {
  name: string;
  price: string;
  period?: string;
  features: string[];
  isSelected: boolean;
  onClick: () => void;
  popular?: boolean;
  gold?: boolean;
}

function PlanCard({ name, price, period, features, isSelected, onClick, popular, gold }: PlanCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative p-6 rounded-lg border-2 transition-all text-left ${
        isSelected
          ? gold
            ? "border-amber-500 bg-amber-500/10"
            : "border-primary bg-primary/5"
          : gold
            ? "border-amber-300/50 hover:border-amber-500"
            : "border-border hover:border-primary/50"
      }`}
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
          Popular
        </span>
      )}
      {gold && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-400 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          ⭐ GOLD
        </span>
      )}
      <div className="text-center mb-4">
        <h3 className={`text-xl font-bold mb-2 ${gold ? "text-amber-600 dark:text-amber-400" : ""}`}>{name}</h3>
        <div className={`text-3xl font-bold ${gold ? "text-amber-600 dark:text-amber-400" : ""}`}>
          {price}
          {period && <span className="text-sm text-muted-foreground">{period}</span>}
        </div>
      </div>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="text-sm flex items-start">
            <span className={`mr-2 ${gold ? "text-amber-500" : ""}`}>✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </button>
  );
}
