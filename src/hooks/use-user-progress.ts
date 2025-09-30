import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { UserProgress, PhaseConfig, UserSubscription, SubscriptionPlan } from '@/types/user-progress';

// Define phase dependencies, order, and plan requirements
export const PHASE_CONFIG: PhaseConfig[] = [
  // Core phases - FREE plan
  { id: 'buyer-persona', name: 'Buyer Persona', description: 'Define tu cliente ideal', order: 1, requiredPlan: 'free' },
  { id: 'business-canvas', name: 'Business Canvas', description: 'Modelo de negocio', order: 2, requires: ['buyer-persona'], requiredPlan: 'free' },
  { id: 'product-roadmap', name: 'Product Roadmap', description: 'Planificación de producto', order: 3, requires: ['business-canvas'], requiredPlan: 'free' },
  { id: 'content-strategy', name: 'Estrategia de Contenido', description: 'Define tu estrategia', order: 4, requires: ['product-roadmap'], requiredPlan: 'free' },
  { id: 'intelligent-content-strategy', name: 'Estrategia Inteligente', description: 'Estrategia con IA', order: 5, requires: ['content-strategy'], requiredPlan: 'free' },
  { id: 'analytics-insights', name: 'Analytics & Insights', description: 'Análisis profundo', order: 6, requires: ['intelligent-content-strategy'], requiredPlan: 'free' },
  
  // Content Tools - PRO plan (until competitor-analyzer)
  { id: 'content-generator', name: 'Generador de Contenido', description: 'Crea contenido con IA', order: 7, requires: ['intelligent-content-strategy'], requiredPlan: 'pro' },
  { id: 'editorial-calendar', name: 'Calendario Editorial', description: 'Planifica tu contenido', order: 8, requires: ['intelligent-content-strategy'], requiredPlan: 'pro' },
  { id: 'competitor-analyzer', name: 'Análisis Competitivo', description: 'Analiza competencia', order: 9, requires: ['intelligent-content-strategy'], requiredPlan: 'pro' },
  
  // Advanced Tools - PREMIUM plan
  { id: 'ai-image-bank', name: 'Banco de Imágenes IA', description: 'Genera imágenes', order: 10, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'hashtag-generator', name: 'Generador de Hashtags', description: 'Hashtags relevantes', order: 11, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'post-templates', name: 'Templates de Posts', description: 'Plantillas predefinidas', order: 12, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'post-scheduler', name: 'Programación', description: 'Calendario interactivo', order: 13, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'realtime-dashboard', name: 'Dashboard', description: 'Métricas en vivo', order: 14, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'approval-system', name: 'Sistema de Aprobación', description: 'Workflow de revisión', order: 15, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'team-collaboration', name: 'Colaboración', description: 'Trabajo en equipo', order: 16, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'sentiment-analysis', name: 'Análisis de Sentimientos', description: 'Monitorea menciones', order: 17, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'reports-roi', name: 'Reportes y ROI', description: 'Exporta y calcula ROI', order: 18, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
];

const PLAN_HIERARCHY: Record<SubscriptionPlan, number> = {
  'free': 1,
  'pro': 2,
  'premium': 3,
};

export const useUserProgress = () => {
  const [progress, setProgress] = useState<Map<string, UserProgress>>(new Map());
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setIsLoading(false);
      return;
    }

    setUser(user);

    // Load user progress
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id);

    if (progressError) {
      console.error('Error loading progress:', progressError);
    }

    const progressMap = new Map<string, UserProgress>();
    progressData?.forEach(item => {
      progressMap.set(item.phase, item as UserProgress);
    });
    setProgress(progressMap);

    // Load user subscription
    const { data: subData, error: subError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (subError && subError.code !== 'PGRST116') {
      console.error('Error loading subscription:', subError);
    }

    // If no subscription exists, create a free one
    if (!subData) {
      const { data: newSub, error: insertError } = await supabase
        .from('user_subscriptions')
        .insert({ user_id: user.id, plan: 'free' })
        .select()
        .single();

      if (!insertError && newSub) {
        setSubscription(newSub as UserSubscription);
      }
    } else {
      setSubscription(subData as UserSubscription);
    }

    setIsLoading(false);
  };

  const markPhaseComplete = async (phaseId: string, progressData?: any) => {
    if (!user) {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para guardar tu progreso",
        variant: "destructive",
      });
      return false;
    }

    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        phase: phaseId,
        completed: true,
        completed_at: new Date().toISOString(),
        progress_data: progressData,
      }, {
        onConflict: 'user_id,phase'
      });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el progreso",
        variant: "destructive",
      });
      return false;
    }

    await loadProgress();
    
    toast({
      title: "¡Fase completada!",
      description: `Has completado: ${PHASE_CONFIG.find(p => p.id === phaseId)?.name}`,
    });

    return true;
  };

  const isPhaseUnlocked = (phaseId: string): boolean => {
    // Require authentication for all phases
    if (!user) return false;
    
    const phase = PHASE_CONFIG.find(p => p.id === phaseId);
    
    if (!phase) return false;

    // Check if user has required subscription plan
    const userPlanLevel = subscription ? PLAN_HIERARCHY[subscription.plan] : PLAN_HIERARCHY['free'];
    const requiredPlanLevel = PLAN_HIERARCHY[phase.requiredPlan];
    
    if (userPlanLevel < requiredPlanLevel) {
      return false; // User doesn't have required plan
    }

    // Check phase dependencies
    if (!phase.requires || phase.requires.length === 0) {
      return true; // No phase requirements, unlocked if plan is sufficient
    }

    // Check if all required phases are completed
    return phase.requires.every(requiredPhase => {
      const requiredProgress = progress.get(requiredPhase);
      return requiredProgress?.completed === true;
    });
  };

  const getRequiredPlanForPhase = (phaseId: string): SubscriptionPlan | null => {
    const phase = PHASE_CONFIG.find(p => p.id === phaseId);
    return phase ? phase.requiredPlan : null;
  };

  const hasRequiredPlan = (phaseId: string): boolean => {
    const requiredPlan = getRequiredPlanForPhase(phaseId);
    if (!requiredPlan || !subscription) return false;
    
    const userPlanLevel = PLAN_HIERARCHY[subscription.plan];
    const requiredPlanLevel = PLAN_HIERARCHY[requiredPlan];
    
    return userPlanLevel >= requiredPlanLevel;
  };

  const isPhaseCompleted = (phaseId: string): boolean => {
    return progress.get(phaseId)?.completed === true;
  };

  const getCompletionPercentage = (): number => {
    const total = PHASE_CONFIG.length;
    const completed = Array.from(progress.values()).filter(p => p.completed).length;
    return Math.round((completed / total) * 100);
  };

  const getNextPhase = (): PhaseConfig | null => {
    const sortedPhases = [...PHASE_CONFIG].sort((a, b) => a.order - b.order);
    
    for (const phase of sortedPhases) {
      if (!isPhaseCompleted(phase.id) && isPhaseUnlocked(phase.id)) {
        return phase;
      }
    }
    
    return null;
  };

  return {
    progress,
    subscription,
    isLoading,
    markPhaseComplete,
    isPhaseUnlocked,
    isPhaseCompleted,
    getCompletionPercentage,
    getNextPhase,
    getRequiredPlanForPhase,
    hasRequiredPlan,
    user,
  };
};