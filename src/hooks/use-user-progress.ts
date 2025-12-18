import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { UserProgress, PhaseConfig, UserSubscription, SubscriptionPlan } from '@/types/user-progress';
import type { UserRole } from '@/types/user-roles';

// Define phase dependencies, order, and plan requirements
export const PHASE_CONFIG: PhaseConfig[] = [
  // Core phases - FREE plan
  { id: 'buyer-persona', name: 'Buyer Persona', description: 'Define tu cliente ideal', order: 1, requiredPlan: 'free' },
  { id: 'business-canvas', name: 'Business Canvas', description: 'Modelo de negocio', order: 2, requires: ['buyer-persona'], requiredPlan: 'free' },
  { id: 'product-roadmap', name: 'Product Roadmap', description: 'Planificación de producto', order: 3, requires: ['business-canvas'], requiredPlan: 'free' },
  { id: 'content-strategy', name: 'Estrategia de Contenido', description: 'Define tu estrategia', order: 4, requires: ['product-roadmap'], requiredPlan: 'free' },
  { id: 'intelligent-content-strategy', name: 'Estrategia Inteligente', description: 'Estrategia con IA', order: 5, requires: ['content-strategy'], requiredPlan: 'free' },
  { id: 'analytics-insights', name: 'Analytics & Insights', description: 'Análisis profundo', order: 6, requires: ['intelligent-content-strategy'], requiredPlan: 'free' },
  
  // Content Tools - PRO plan
  { id: 'content-generator', name: 'Generador de Contenido', description: 'Crea contenido con IA', order: 7, requires: ['intelligent-content-strategy'], requiredPlan: 'pro' },
  { id: 'editorial-calendar', name: 'Calendario Editorial', description: 'Planifica tu contenido', order: 8, requires: ['intelligent-content-strategy'], requiredPlan: 'pro' },
  { id: 'competitor-analyzer', name: 'Análisis Competitivo', description: 'Analiza competencia', order: 9, requires: ['intelligent-content-strategy'], requiredPlan: 'pro' },
  { id: 'content-atomizer-basic', name: 'Atomización (5 formatos)', description: 'Convierte contenido en 5 formatos', order: 10, requires: ['intelligent-content-strategy'], requiredPlan: 'pro' },
  { id: 'virality-predictor', name: 'Predictor de Viralidad', description: 'Predice engagement antes de publicar', order: 11, requires: ['intelligent-content-strategy'], requiredPlan: 'pro' },
  { id: 'interactive-content', name: 'Contenido Interactivo', description: 'Quizzes, calculadoras, encuestas', order: 12, requires: ['intelligent-content-strategy'], requiredPlan: 'pro' },
  { id: 'evergreen-recycler', name: 'Reciclador Evergreen', description: 'Recicla tu mejor contenido', order: 13, requires: ['intelligent-content-strategy'], requiredPlan: 'pro' },
  
  // Advanced Tools - PREMIUM plan
  { id: 'ai-image-bank', name: 'Banco de Imágenes IA', description: 'Genera imágenes', order: 14, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'hashtag-generator', name: 'Generador de Hashtags', description: 'Hashtags relevantes', order: 15, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'post-templates', name: 'Templates de Posts', description: 'Plantillas predefinidas', order: 16, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'post-scheduler', name: 'Programación', description: 'Calendario interactivo', order: 17, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'realtime-dashboard', name: 'Dashboard', description: 'Métricas en vivo', order: 18, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'revenue-attribution', name: 'Atribución de Revenue', description: 'ROI por contenido', order: 19, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'approval-system', name: 'Sistema de Aprobación', description: 'Workflow de revisión', order: 20, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'team-collaboration', name: 'Colaboración', description: 'Trabajo en equipo', order: 21, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'sentiment-analysis', name: 'Análisis de Sentimientos', description: 'Monitorea menciones', order: 22, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'content-fatigue', name: 'Detector de Fatiga', description: 'Detecta saturación de temas', order: 23, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'reports-roi', name: 'Reportes y ROI', description: 'Exporta y calcula ROI', order: 24, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'video-script-generator', name: 'Generador de Videos', description: 'Scripts y storyboards', order: 25, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'podcast-generator', name: 'Generador de Podcasts', description: 'Guiones y estructura', order: 26, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'voice-cloning', name: 'Voice Cloning', description: 'Audio con IA (ElevenLabs)', order: 27, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'article-generator', name: 'Generador de Artículos', description: 'Artículos SEO optimizados', order: 28, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'seo-analyzer', name: 'Analizador SEO', description: 'Optimización buscadores', order: 29, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'aeo-analyzer', name: 'Analizador AEO', description: 'Optimización para IA', order: 30, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'content-atomizer-advanced', name: 'Atomización (15 formatos)', description: 'Convierte contenido en 15 formatos', order: 31, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  { id: 'pre-viral-trends', name: 'Tendencias Pre-Virales', description: 'Detecta tendencias 24-48h antes', order: 32, requires: ['intelligent-content-strategy'], requiredPlan: 'premium' },
  
  // AI Agents - GOLD plan
  { id: 'ai-agency', name: 'Agencia de Marketing IA', description: 'Tu equipo de 16+ especialistas virtuales', order: 33, requires: ['intelligent-content-strategy'], requiredPlan: 'gold' },
];

const PLAN_HIERARCHY: Record<SubscriptionPlan, number> = {
  'free': 1,
  'pro': 2,
  'premium': 3,
  'gold': 4,
};

export const useUserProgress = () => {
  const [progress, setProgress] = useState<Map<string, UserProgress>>(new Map());
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
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

    // Check if user is admin
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    setIsAdmin(!!roleData);

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
    
    // Admins have access to everything
    if (isAdmin) return true;
    
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
    // Admins bypass plan requirements
    if (isAdmin) return true;
    
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

  // Check if phase is included in user's plan (even if locked by progress)
  const isPhaseIncludedInPlan = (phaseId: string): boolean => {
    if (isAdmin) return true;
    
    const phase = PHASE_CONFIG.find(p => p.id === phaseId);
    if (!phase) return false;
    
    const userPlanLevel = subscription ? PLAN_HIERARCHY[subscription.plan] : PLAN_HIERARCHY['free'];
    const requiredPlanLevel = PLAN_HIERARCHY[phase.requiredPlan];
    
    return userPlanLevel >= requiredPlanLevel;
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
    isPhaseIncludedInPlan,
    user,
    isAdmin,
  };
};
