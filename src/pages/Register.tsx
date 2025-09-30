import { RegistrationForm } from "@/components/RegistrationForm";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Únete a Nosotros</h1>
          <p className="text-muted-foreground">
            Crea tu cuenta y comienza a gestionar tu estrategia de contenido
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-xl p-8">
          <RegistrationForm />
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">¿Ya tienes una cuenta? </span>
            <Link to="/auth" className="text-primary hover:underline font-medium">
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
