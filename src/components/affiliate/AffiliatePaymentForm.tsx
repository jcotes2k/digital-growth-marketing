import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAffiliate } from '@/hooks/use-affiliate';
import { Loader2, Building2, Smartphone } from 'lucide-react';
import type { PaymentMethod } from '@/types/affiliate';

export function AffiliatePaymentForm() {
  const { affiliate, updatePaymentInfo } = useAffiliate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    affiliate?.payment_method || 'nequi'
  );

  // Bank fields
  const [bankName, setBankName] = useState(affiliate?.bank_name || '');
  const [accountNumber, setAccountNumber] = useState(affiliate?.account_number || '');
  const [accountHolder, setAccountHolder] = useState(affiliate?.account_holder || '');

  // Mobile wallet fields
  const [nequiPhone, setNequiPhone] = useState(affiliate?.nequi_phone || '');
  const [daviplataPhone, setDaviplataPhone] = useState(affiliate?.daviplata_phone || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const details: Record<string, string> = {};
    
    if (paymentMethod === 'bank') {
      details.bank_name = bankName;
      details.account_number = accountNumber;
      details.account_holder = accountHolder;
    } else if (paymentMethod === 'nequi') {
      details.nequi_phone = nequiPhone;
    } else if (paymentMethod === 'daviplata') {
      details.daviplata_phone = daviplataPhone;
    }

    await updatePaymentInfo(paymentMethod, details);
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurar Método de Pago</CardTitle>
        <CardDescription>
          Elige cómo quieres recibir tus comisiones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <RadioGroup
            value={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className={`relative rounded-lg border-2 p-4 cursor-pointer transition-colors ${
              paymentMethod === 'bank' ? 'border-primary bg-primary/5' : 'border-border'
            }`}>
              <RadioGroupItem value="bank" id="bank" className="absolute top-4 right-4" />
              <Label htmlFor="bank" className="cursor-pointer">
                <Building2 className="h-8 w-8 mb-2 text-primary" />
                <div className="font-semibold">Banco</div>
                <div className="text-sm text-muted-foreground">Transferencia bancaria</div>
              </Label>
            </div>

            <div className={`relative rounded-lg border-2 p-4 cursor-pointer transition-colors ${
              paymentMethod === 'nequi' ? 'border-primary bg-primary/5' : 'border-border'
            }`}>
              <RadioGroupItem value="nequi" id="nequi" className="absolute top-4 right-4" />
              <Label htmlFor="nequi" className="cursor-pointer">
                <Smartphone className="h-8 w-8 mb-2 text-[#E6007E]" />
                <div className="font-semibold">Nequi</div>
                <div className="text-sm text-muted-foreground">Billetera digital</div>
              </Label>
            </div>

            <div className={`relative rounded-lg border-2 p-4 cursor-pointer transition-colors ${
              paymentMethod === 'daviplata' ? 'border-primary bg-primary/5' : 'border-border'
            }`}>
              <RadioGroupItem value="daviplata" id="daviplata" className="absolute top-4 right-4" />
              <Label htmlFor="daviplata" className="cursor-pointer">
                <Smartphone className="h-8 w-8 mb-2 text-[#ED1C24]" />
                <div className="font-semibold">Daviplata</div>
                <div className="text-sm text-muted-foreground">Billetera digital</div>
              </Label>
            </div>
          </RadioGroup>

          {paymentMethod === 'bank' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Nombre del Banco</Label>
                <Input
                  id="bankName"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Ej: Bancolombia"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Número de Cuenta</Label>
                <Input
                  id="accountNumber"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Ej: 1234567890"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountHolder">Titular de la Cuenta</Label>
                <Input
                  id="accountHolder"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="Nombre completo del titular"
                  required
                />
              </div>
            </div>
          )}

          {paymentMethod === 'nequi' && (
            <div className="space-y-2">
              <Label htmlFor="nequiPhone">Número de Celular Nequi</Label>
              <Input
                id="nequiPhone"
                value={nequiPhone}
                onChange={(e) => setNequiPhone(e.target.value)}
                placeholder="Ej: 300 123 4567"
                required
              />
            </div>
          )}

          {paymentMethod === 'daviplata' && (
            <div className="space-y-2">
              <Label htmlFor="daviplataPhone">Número de Celular Daviplata</Label>
              <Input
                id="daviplataPhone"
                value={daviplataPhone}
                onChange={(e) => setDaviplataPhone(e.target.value)}
                placeholder="Ej: 300 123 4567"
                required
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Método de Pago'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
