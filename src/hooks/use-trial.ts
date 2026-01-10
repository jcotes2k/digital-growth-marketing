import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TrialResult {
  success: boolean;
  error?: string;
  plan?: string;
  expiresAt?: Date;
}

export const useTrial = () => {
  const [isActivating, setIsActivating] = useState(false);

  const activateTrial = async (code?: string): Promise<TrialResult> => {
    setIsActivating(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'No autenticado' };
      }

      // Verificar si ya usó un trial
      const { data: currentSub, error: subError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (subError) {
        console.error('Error checking subscription:', subError);
        return { success: false, error: 'Error al verificar suscripción' };
      }

      if (currentSub?.trial_code) {
        return { success: false, error: 'Ya has usado tu prueba gratuita' };
      }

      // Valores por defecto
      let trialPlan: 'free' | 'pro' | 'premium' | 'gold' = 'gold';
      let durationDays = 7;
      let trialCode = 'TRIAL_STANDARD';

      // Si hay código, verificarlo
      if (code && code.trim()) {
        const { data: codeData, error: codeError } = await supabase
          .from('trial_codes')
          .select('*')
          .eq('code', code.toUpperCase().trim())
          .eq('is_active', true)
          .maybeSingle();

        if (codeError) {
          console.error('Error checking trial code:', codeError);
          return { success: false, error: 'Error al verificar código' };
        }

        if (!codeData) {
          return { success: false, error: 'Código inválido o expirado' };
        }

        if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
          return { success: false, error: 'Este código ha expirado' };
        }

        if (codeData.max_uses !== null && codeData.current_uses >= codeData.max_uses) {
          return { success: false, error: 'Este código ya alcanzó el límite de usos' };
        }

        trialPlan = codeData.plan as typeof trialPlan;
        durationDays = codeData.duration_days;
        trialCode = codeData.code;

        // Incrementar uso del código
        await supabase
          .from('trial_codes')
          .update({ current_uses: codeData.current_uses + 1 })
          .eq('id', codeData.id);
      }

      // Calcular fecha de expiración
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + durationDays);

      // Actualizar suscripción
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({
          plan: trialPlan,
          is_trial: true,
          trial_code: trialCode,
          expires_at: expiresAt.toISOString(),
          started_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error activating trial:', updateError);
        return { success: false, error: 'Error al activar la prueba' };
      }

      toast.success(`¡Prueba ${trialPlan.toUpperCase()} activada por ${durationDays} días!`);
      
      return { 
        success: true, 
        plan: trialPlan, 
        expiresAt: expiresAt 
      };
    } catch (error) {
      console.error('Error in activateTrial:', error);
      return { success: false, error: 'Error inesperado' };
    } finally {
      setIsActivating(false);
    }
  };

  const getRemainingDays = (expiresAt: string | null | undefined): number | null => {
    if (!expiresAt) return null;
    const expires = new Date(expiresAt);
    const now = new Date();
    const diffTime = expires.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return { activateTrial, isActivating, getRemainingDays };
};
