import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { UserProgress, PhaseConfig } from '@/types/user-progress';

// Define phase dependencies and order
export const PHASE_CONFIG: PhaseConfig[] = [
  { id: 'buyer-persona', name: 'Buyer Persona', description: 'Define tu cliente ideal', order: 1 },
  { id: 'business-canvas', name: 'Business Canvas', description: 'Modelo de negocio', order: 2, requires: ['buyer-persona'] },
  { id: 'product-roadmap', name: 'Product Roadmap', description: 'Planificación de producto', order: 3, requires: ['business-canvas'] },
  { id: 'content-strategy', name: 'Estrategia de Contenido', description: 'Define tu estrategia', order: 4, requires: ['product-roadmap'] },
  { id: 'intelligent-content-strategy', name: 'Estrategia Inteligente', description: 'Estrategia con IA', order: 5, requires: ['content-strategy'] },
  { id: 'analytics-insights', name: 'Analytics & Insights', description: 'Análisis profundo', order: 6, requires: ['intelligent-content-strategy'] },
  
  // Tool phases - available after completing core phases (all unlock after phase 5)
  { id: 'content-generator', name: 'Generador de Contenido', description: 'Crea contenido con IA', order: 7, requires: ['intelligent-content-strategy'] },
  { id: 'editorial-calendar', name: 'Calendario Editorial', description: 'Planifica tu contenido', order: 8, requires: ['intelligent-content-strategy'] },
  { id: 'competitor-analyzer', name: 'Análisis Competitivo', description: 'Analiza competencia', order: 9, requires: ['intelligent-content-strategy'] },
  { id: 'ai-image-bank', name: 'Banco de Imágenes IA', description: 'Genera imágenes', order: 10, requires: ['intelligent-content-strategy'] },
  { id: 'hashtag-generator', name: 'Generador de Hashtags', description: 'Hashtags relevantes', order: 11, requires: ['intelligent-content-strategy'] },
  { id: 'post-templates', name: 'Templates de Posts', description: 'Plantillas predefinidas', order: 12, requires: ['intelligent-content-strategy'] },
  { id: 'post-scheduler', name: 'Programación', description: 'Calendario interactivo', order: 13, requires: ['intelligent-content-strategy'] },
  { id: 'realtime-dashboard', name: 'Dashboard', description: 'Métricas en vivo', order: 14, requires: ['intelligent-content-strategy'] },
  { id: 'approval-system', name: 'Sistema de Aprobación', description: 'Workflow de revisión', order: 15, requires: ['intelligent-content-strategy'] },
  { id: 'team-collaboration', name: 'Colaboración', description: 'Trabajo en equipo', order: 16, requires: ['intelligent-content-strategy'] },
  { id: 'sentiment-analysis', name: 'Análisis de Sentimientos', description: 'Monitorea menciones', order: 17, requires: ['intelligent-content-strategy'] },
  { id: 'reports-roi', name: 'Reportes y ROI', description: 'Exporta y calcula ROI', order: 18, requires: ['intelligent-content-strategy'] },
];

export const useUserProgress = () => {
  const [progress, setProgress] = useState<Map<string, UserProgress>>(new Map());
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

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error loading progress:', error);
      setIsLoading(false);
      return;
    }

    const progressMap = new Map<string, UserProgress>();
    data?.forEach(item => {
      progressMap.set(item.phase, item as UserProgress);
    });

    setProgress(progressMap);
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
    const phase = PHASE_CONFIG.find(p => p.id === phaseId);
    
    if (!phase || !phase.requires || phase.requires.length === 0) {
      return true; // No requirements, always unlocked
    }

    // Check if all required phases are completed
    return phase.requires.every(requiredPhase => {
      const requiredProgress = progress.get(requiredPhase);
      return requiredProgress?.completed === true;
    });
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
    isLoading,
    markPhaseComplete,
    isPhaseUnlocked,
    isPhaseCompleted,
    getCompletionPercentage,
    getNextPhase,
    user,
  };
};