import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, CheckCircle } from "lucide-react";

interface ForgotPasswordDialogProps {
  trigger?: React.ReactNode;
}

export function ForgotPasswordDialog({ trigger }: ForgotPasswordDialogProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email requerido",
        description: "Por favor ingresa tu correo electrónico",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "¡Enlace enviado!",
        description: "Revisa tu correo para restablecer tu contraseña",
      });
    } catch (error: any) {
      toast({
        title: "Error al enviar enlace",
        description: error.message || "No se pudo enviar el enlace de recuperación",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state when dialog closes
      setEmail("");
      setIsSuccess(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <button
            type="button"
            className="text-sm text-primary hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {isSuccess ? (
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <DialogHeader>
              <DialogTitle className="text-center">¡Enlace Enviado!</DialogTitle>
              <DialogDescription className="text-center">
                Hemos enviado un enlace de recuperación a <strong>{email}</strong>.
                Revisa tu bandeja de entrada y sigue las instrucciones.
              </DialogDescription>
            </DialogHeader>
            <Button
              className="mt-6"
              onClick={() => handleOpenChange(false)}
            >
              Cerrar
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Recuperar Contraseña
              </DialogTitle>
              <DialogDescription>
                Ingresa tu correo electrónico y te enviaremos un enlace para
                restablecer tu contraseña.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleForgotPassword} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Correo Electrónico</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Enlace"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
