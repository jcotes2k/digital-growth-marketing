import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Lock, Loader2, Check, Shield } from 'lucide-react';

interface EPaycoSubscriptionFormProps {
  userId: string;
  userEmail: string;
  userName: string;
  plan: 'pro' | 'premium' | 'gold';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const PLAN_DETAILS = {
  pro: { name: 'Plan Pro', price: 39, features: ['Todas las herramientas básicas', 'Soporte por email'] },
  premium: { name: 'Plan Premium', price: 69, features: ['Todo de Pro', 'Herramientas avanzadas', 'Soporte prioritario'] },
  gold: { name: 'Plan Gold', price: 89, features: ['Todo de Premium', 'Acceso ilimitado', 'Soporte 24/7'] },
};

const DOC_TYPES = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'NIT', label: 'NIT' },
  { value: 'PP', label: 'Pasaporte' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
];

export function EPaycoSubscriptionForm({
  userId,
  userEmail,
  userName,
  plan,
  onSuccess,
  onError,
}: EPaycoSubscriptionFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardExpMonth: '',
    cardExpYear: '',
    cardCvc: '',
    docType: 'CC',
    docNumber: '',
    phone: '',
  });

  const planDetails = PLAN_DETAILS[plan];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ').substr(0, 19) : cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      const { cardNumber, cardExpMonth, cardExpYear, cardCvc, docType, docNumber, phone } = formData;
      
      if (!cardNumber || !cardExpMonth || !cardExpYear || !cardCvc || !docNumber || !phone) {
        throw new Error('Por favor completa todos los campos');
      }

      // Clean card number
      const cleanCardNumber = cardNumber.replace(/\s/g, '');

      // Call edge function to create subscription
      const { data, error } = await supabase.functions.invoke('epayco-create-subscription', {
        body: {
          userId,
          userEmail,
          userName,
          plan,
          cardNumber: cleanCardNumber,
          cardExpYear,
          cardExpMonth,
          cardCvc,
          docType,
          docNumber,
          phone,
        },
      });

      if (error) {
        throw new Error(error.message || 'Error al procesar el pago');
      }

      if (!data.success) {
        throw new Error(data.error || 'Error al crear la suscripción');
      }

      toast({
        title: '¡Suscripción Activada!',
        description: `Tu suscripción ${planDetails.name} está activa. Se renovará automáticamente cada mes.`,
      });

      onSuccess?.();
      navigate('/');
    } catch (error: any) {
      console.error('Subscription error:', error);
      const errorMessage = error.message || 'Error al procesar el pago';
      toast({
        title: 'Error en el Pago',
        description: errorMessage,
        variant: 'destructive',
      });
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Plan Summary */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            {planDetails.name}
          </CardTitle>
          <CardDescription>Suscripción mensual recurrente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-4xl font-bold">
            ${planDetails.price}
            <span className="text-lg font-normal text-muted-foreground">/mes</span>
          </div>
          <ul className="space-y-2">
            {planDetails.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Se cobra automáticamente cada mes. Puedes cancelar en cualquier momento.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Datos de Pago
          </CardTitle>
          <CardDescription>Ingresa los datos de tu tarjeta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Card Number */}
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Número de Tarjeta</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formatCardNumber(formData.cardNumber)}
                onChange={(e) => handleInputChange('cardNumber', e.target.value.replace(/\s/g, ''))}
                maxLength={19}
                disabled={isLoading}
              />
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="cardExpMonth">Mes</Label>
                <Select
                  value={formData.cardExpMonth}
                  onValueChange={(value) => handleInputChange('cardExpMonth', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                        {month.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardExpYear">Año</Label>
                <Select
                  value={formData.cardExpYear}
                  onValueChange={(value) => handleInputChange('cardExpYear', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="AA" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                      <SelectItem key={year} value={year.toString().slice(-2)}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardCvc">CVV</Label>
                <Input
                  id="cardCvc"
                  placeholder="123"
                  value={formData.cardCvc}
                  onChange={(e) => handleInputChange('cardCvc', e.target.value.replace(/\D/g, ''))}
                  maxLength={4}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Document Type and Number */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="docType">Tipo de Documento</Label>
                <Select
                  value={formData.docType}
                  onValueChange={(value) => handleInputChange('docType', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOC_TYPES.map((doc) => (
                      <SelectItem key={doc.value} value={doc.value}>
                        {doc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="docNumber">Número de Documento</Label>
                <Input
                  id="docNumber"
                  placeholder="123456789"
                  value={formData.docNumber}
                  onChange={(e) => handleInputChange('docNumber', e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                placeholder="3001234567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Suscribirse por ${planDetails.price}/mes
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              Pago seguro procesado por ePayco
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
