import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BuyerPersonaForm } from "@/components/BuyerPersonaForm";
import { BusinessCanvasForm } from "@/components/BusinessCanvasForm";
import { ProductRoadmapForm } from "@/components/ProductRoadmapForm";
import { ContentStrategyForm } from "@/components/ContentStrategyForm";
import { IntelligentContentStrategyForm } from "@/components/IntelligentContentStrategyForm";
import { AnalyticsInsightsForm } from "@/components/AnalyticsInsightsForm";
import { ContentGeneratorForm } from "@/components/ContentGeneratorForm";
import { EditorialCalendarForm } from "@/components/EditorialCalendarForm";
import { CompetitorAnalyzerForm } from "@/components/CompetitorAnalyzerForm";
import { AIImageBankForm } from "@/components/AIImageBankForm";
import { HashtagGeneratorForm } from "@/components/HashtagGeneratorForm";
import { PostTemplateForm } from "@/components/PostTemplateForm";
import PostSchedulerForm from "@/components/PostSchedulerForm";
import RealtimeDashboard from "@/components/RealtimeDashboard";
import ApprovalSystemForm from "@/components/ApprovalSystemForm";
import TeamCollaborationForm from "@/components/TeamCollaborationForm";
import { SentimentAnalysisForm } from "@/components/SentimentAnalysisForm";
import ReportsAndROIForm from "@/components/ReportsAndROIForm";
import { VideoScriptGenerator } from "@/components/VideoScriptGenerator";
import { PodcastGenerator } from "@/components/PodcastGenerator";
import { ArticleGenerator } from "@/components/ArticleGenerator";
import { SEOAnalyzer } from "@/components/SEOAnalyzer";
import { AEOAnalyzer } from "@/components/AEOAnalyzer";
import ContentAtomizer from "@/components/ContentAtomizer";
import ViralityPredictor from "@/components/ViralityPredictor";
import VoiceCloning from "@/components/VoiceCloning";
import ContentFatigueDetector from "@/components/ContentFatigueDetector";
import InteractiveContentGenerator from "@/components/InteractiveContentGenerator";
import EvergreenRecycler from "@/components/EvergreenRecycler";
import PreViralTrendsMonitor from "@/components/PreViralTrendsMonitor";
import RevenueAttribution from "@/components/RevenueAttribution";
import AgencyDashboard from "@/components/agents/AgencyDashboard";
import { AI_AGENTS, AGENT_TEAMS } from "@/types/ai-agents";
import * as Icons from "lucide-react";
import { PlatformDocumentationPDF } from "@/components/PlatformDocumentationPDF";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useUserProgress } from "@/hooks/use-user-progress";
import { useTrial } from "@/hooks/use-trial";
import { Lock, CheckCircle2, Award, Crown, Zap, Star, LogOut, User, Clock, Gift, Timer, Shield, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { SubscriptionPlan } from "@/types/user-progress";

type Phase = 'menu' | 'buyer-persona' | 'business-canvas' | 'product-roadmap' | 'content-strategy' | 'intelligent-content-strategy' | 'analytics-insights' | 'content-generator' | 'editorial-calendar' | 'competitor-analyzer' | 'ai-image-bank' | 'hashtag-generator' | 'post-templates' | 'post-scheduler' | 'realtime-dashboard' | 'approval-system' | 'team-collaboration' | 'sentiment-analysis' | 'reports-roi' | 'video-script-generator' | 'podcast-generator' | 'article-generator' | 'seo-analyzer' | 'aeo-analyzer' | 'content-atomizer-basic' | 'content-atomizer-advanced' | 'virality-predictor' | 'voice-cloning' | 'content-fatigue' | 'interactive-content' | 'evergreen-recycler' | 'pre-viral-trends' | 'revenue-attribution' | 'ai-agency';

interface PhaseCardProps {
  phaseId: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  onClick: () => void;
  className?: string;
  requiredPlan?: SubscriptionPlan;
  hasRequiredPlan?: boolean;
  isIncludedInPlan?: boolean;
}

const getPlanBadge = (plan: SubscriptionPlan) => {
  switch (plan) {
    case 'pro':
      return <Badge className="bg-blue-500 text-white text-xs shrink-0"><Zap className="h-3 w-3 mr-1" />PRO</Badge>;
    case 'premium':
      return <Badge className="bg-purple-500 text-white text-xs shrink-0"><Crown className="h-3 w-3 mr-1" />PREMIUM</Badge>;
    case 'gold':
      return <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs shrink-0"><Star className="h-3 w-3 mr-1" />GOLD</Badge>;
    default:
      return null;
  }
};

const getPlanName = (plan: SubscriptionPlan) => {
  switch (plan) {
    case 'free': return 'Gratis';
    case 'pro': return 'Pro';
    case 'premium': return 'Premium';
    case 'gold': return 'Gold';
  }
};

const PhaseCard = ({ phaseId, title, description, isUnlocked, isCompleted, onClick, className = "", requiredPlan, hasRequiredPlan, isIncludedInPlan }: PhaseCardProps) => {
  const showPlanBadge = requiredPlan && requiredPlan !== 'free';
  const isLockedByPlan = !hasRequiredPlan && requiredPlan && requiredPlan !== 'free';
  const isLockedByProgress = hasRequiredPlan && !isUnlocked && !isCompleted;
  
  // Visual states:
  // 1. Completed: green border, checkmark
  // 2. Unlocked: normal, clickable
  // 3. Included in plan but locked by progress: dashed border, clock icon, "Próximamente"
  // 4. Not in plan: grayed out, lock icon, "Upgrade"
  
  return (
    <Card 
      className={`transition-all ${
        isCompleted 
          ? 'border-green-500 border-2 bg-green-50/50 dark:bg-green-950/20' 
          : isUnlocked 
            ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]' 
            : isLockedByProgress
              ? 'border-dashed border-2 border-primary/50 opacity-80 bg-primary/5'
              : 'opacity-40 cursor-not-allowed border-muted'
      } ${className}`}
      onClick={isUnlocked ? onClick : undefined}
    >
      <CardHeader className="p-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            {isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
            ) : isUnlocked ? (
              <div className="h-5 w-5 rounded-full border-2 border-primary flex-shrink-0" />
            ) : isLockedByProgress ? (
              <Clock className="h-5 w-5 text-primary flex-shrink-0" />
            ) : (
              <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            )}
            <span className="line-clamp-1">{title}</span>
          </CardTitle>
          <div className="flex gap-1 flex-wrap justify-end">
            {isCompleted && (
              <Badge className="bg-green-500 text-xs shrink-0">✓</Badge>
            )}
            {isLockedByProgress && (
              <Badge variant="outline" className="text-xs shrink-0 border-primary text-primary">Próximamente</Badge>
            )}
            {isLockedByPlan && (
              <Badge variant="destructive" className="text-xs shrink-0">Upgrade</Badge>
            )}
            {showPlanBadge && requiredPlan && getPlanBadge(requiredPlan)}
          </div>
        </div>
        <CardDescription className="text-sm line-clamp-2">
          {isLockedByProgress 
            ? "Completa las fases anteriores para desbloquear"
            : description
          }
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

const Index = () => {
  const [currentPhase, setCurrentPhase] = useState<Phase>('menu');
  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>(undefined);
  const [trialCode, setTrialCode] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const {
    isPhaseUnlocked,
    isPhaseCompleted,
    markPhaseComplete,
    getCompletionPercentage,
    getRequiredPlanForPhase,
    hasRequiredPlan,
    isPhaseIncludedInPlan,
    subscription,
    user,
    isAdmin,
    loadProgress,
    trackToolUsage,
  } = useUserProgress();

  const { activateTrial, isActivating, getRemainingDays } = useTrial();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
    navigate('/auth');
  };

  const handleActivateTrial = async () => {
    const result = await activateTrial(trialCode || undefined);
    if (result.success) {
      setTrialCode('');
      await loadProgress();
    } else {
      toast({
        title: "Error",
        description: result.error || "No se pudo activar la prueba",
        variant: "destructive",
      });
    }
  };

  const remainingDays = subscription?.is_trial && subscription?.expires_at 
    ? getRemainingDays(subscription.expires_at) 
    : null;

  const handlePhaseClick = (phaseId: string) => {
    if (!isPhaseUnlocked(phaseId)) {
      const requiredPlan = getRequiredPlanForPhase(phaseId);
      const hasPlan = hasRequiredPlan(phaseId);
      
      if (requiredPlan && !hasPlan) {
        toast({
          title: "Actualiza tu plan",
          description: `Esta función requiere el plan ${getPlanName(requiredPlan)}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fase bloqueada",
          description: "Completa las fases anteriores para desbloquear esta",
          variant: "destructive",
        });
      }
      return;
    }
    // Track tool usage
    trackToolUsage(phaseId);
    setCurrentPhase(phaseId as Phase);
  };

  const handleCompletePhase = async () => {
    if (currentPhase !== 'menu') {
      await markPhaseComplete(currentPhase);
    }
  };

  const renderPhase = () => {
    switch (currentPhase) {
      case 'buyer-persona':
        return <BuyerPersonaForm />;
      case 'business-canvas':
        return <BusinessCanvasForm />;
      case 'product-roadmap':
        return <ProductRoadmapForm />;
      case 'content-strategy':
        return <ContentStrategyForm />;
      case 'intelligent-content-strategy':
        return <IntelligentContentStrategyForm />;
      case 'analytics-insights':
        return <AnalyticsInsightsForm />;
      case 'content-generator':
        return <ContentGeneratorForm />;
      case 'editorial-calendar':
        return <EditorialCalendarForm />;
      case 'competitor-analyzer':
        return <CompetitorAnalyzerForm />;
      case 'ai-image-bank':
        return <AIImageBankForm />;
      case 'hashtag-generator':
        return <HashtagGeneratorForm />;
      case 'post-templates':
        return <PostTemplateForm />;
      case 'post-scheduler':
        return <PostSchedulerForm />;
      case 'realtime-dashboard':
        return <RealtimeDashboard />;
      case 'approval-system':
        return <ApprovalSystemForm />;
      case 'team-collaboration':
        return <TeamCollaborationForm />;
      case 'sentiment-analysis':
        return <SentimentAnalysisForm />;
      case 'reports-roi':
        return <ReportsAndROIForm />;
      case 'video-script-generator':
        return <VideoScriptGenerator />;
      case 'podcast-generator':
        return <PodcastGenerator />;
      case 'article-generator':
        return <ArticleGenerator />;
      case 'seo-analyzer':
        return <SEOAnalyzer />;
      case 'aeo-analyzer':
        return <AEOAnalyzer />;
      case 'content-atomizer-basic':
        return <ContentAtomizer mode="basic" />;
      case 'content-atomizer-advanced':
        return <ContentAtomizer mode="advanced" />;
      case 'virality-predictor':
        return <ViralityPredictor />;
      case 'voice-cloning':
        return <VoiceCloning />;
      case 'content-fatigue':
        return <ContentFatigueDetector />;
      case 'interactive-content':
        return <InteractiveContentGenerator />;
      case 'evergreen-recycler':
        return <EvergreenRecycler />;
      case 'pre-viral-trends':
        return <PreViralTrendsMonitor />;
      case 'revenue-attribution':
        return <RevenueAttribution />;
      case 'ai-agency':
        return <AgencyDashboard isUnlocked={isPhaseUnlocked('ai-agency')} initialAgentId={selectedAgentId} onBack={() => { setCurrentPhase('menu'); setSelectedAgentId(undefined); }} />;
      default:
        const completionPercentage = getCompletionPercentage();

        return (
          <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
              {/* Progress Header */}
              {user && (
                <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border-2 border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Award className="h-6 w-6 text-primary" />
                        Tu Progreso
                      </h2>
                      <p className="text-muted-foreground mt-1">
                        {completionPercentage}% completado
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                      {/* User info */}
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{user.email}</span>
                      </div>
                      
                      {subscription && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Plan:</span>
                          {subscription.plan === 'free' ? (
                            <Badge variant="outline">Gratis</Badge>
                          ) : subscription.plan === 'pro' ? (
                            <Badge className="bg-blue-500"><Zap className="h-3 w-3 mr-1" />Pro</Badge>
                          ) : subscription.plan === 'premium' ? (
                            <Badge className="bg-purple-500"><Crown className="h-3 w-3 mr-1" />Premium</Badge>
                          ) : (
                            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500"><Star className="h-3 w-3 mr-1" />Gold</Badge>
                          )}
                          {/* Trial badge with remaining days */}
                          {subscription.is_trial && remainingDays !== null && (
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                              <Timer className="h-3 w-3 mr-1" />
                              Trial: {remainingDays} {remainingDays === 1 ? 'día' : 'días'}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {subscription && subscription.plan !== 'gold' && !subscription.is_trial && (
                        <Button asChild size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                          <Link to="/checkout?plan=gold">
                            <Crown className="h-4 w-4 mr-1" />
                            Cambiar Plan
                          </Link>
                        </Button>
                      )}

                      {/* Admin link */}
                      {isAdmin && (
                        <>
                          <Button asChild size="sm" variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white">
                            <Link to="/admin">
                              <Shield className="h-4 w-4 mr-1" />
                              Admin
                            </Link>
                          </Button>
                        </>
                      )}
                      
                      {/* Logout button */}
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={handleLogout}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="h-4 w-4 mr-1" />
                        Salir
                      </Button>
                    </div>
                  </div>
                  <Progress value={completionPercentage} className="h-3" />
                </div>
              )}

              {/* Trial Banner for FREE users without trial */}
              {user && subscription && subscription.plan === 'free' && !subscription.trial_code && (
                <Card className="mb-6 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/30 border-2">
                  <CardContent className="py-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Gift className="h-8 w-8 text-amber-500 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-bold text-lg flex items-center gap-2">
                            ⭐ Prueba GOLD por 7 días GRATIS
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Accede a TODAS las herramientas sin pagar. Sin tarjeta de crédito.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                        <Input 
                          placeholder="Código (opcional)" 
                          className="w-full sm:w-32"
                          value={trialCode}
                          onChange={(e) => setTrialCode(e.target.value)}
                        />
                        <Button 
                          onClick={handleActivateTrial}
                          disabled={isActivating}
                          className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
                        >
                          <Star className="h-4 w-4 mr-1" />
                          {isActivating ? 'Activando...' : 'Activar Prueba'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold mb-4">Plataforma de Marketing de Contenido</h1>
                <p className="text-xl text-muted-foreground mb-4">
                  {user ? "Completa las fases en orden para desbloquear nuevas herramientas" : "Inicia sesión o crea una cuenta para guardar tu progreso"}
                </p>
                {!user && (
                  <div className="flex justify-center gap-4">
                    <Button asChild size="lg" variant="default">
                      <Link to="/auth">Iniciar Sesión</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <Link to="/register">Crear Cuenta</Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* Legend for visual states */}
              {user && subscription && (
                <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Completada</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-primary" />
                      <span>Lista para usar</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-primary font-medium">Incluida en tu plan (completa fases previas)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Requiere upgrade</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Core Phases */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Fases Principales <Badge variant="outline" className="ml-2">Gratis</Badge></h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <PhaseCard phaseId="business-canvas" title="Business Canvas" description="Modelo de negocio" isUnlocked={isPhaseUnlocked('business-canvas')} isCompleted={isPhaseCompleted('business-canvas')} onClick={() => handlePhaseClick('business-canvas')} isIncludedInPlan={isPhaseIncludedInPlan('business-canvas')} hasRequiredPlan={hasRequiredPlan('business-canvas')} />
                    <PhaseCard phaseId="buyer-persona" title="Buyer Persona" description="Define tu cliente ideal" isUnlocked={isPhaseUnlocked('buyer-persona')} isCompleted={isPhaseCompleted('buyer-persona')} onClick={() => handlePhaseClick('buyer-persona')} isIncludedInPlan={isPhaseIncludedInPlan('buyer-persona')} hasRequiredPlan={hasRequiredPlan('buyer-persona')} />
                    <PhaseCard phaseId="product-roadmap" title="Product Roadmap" description="Planificación de producto" isUnlocked={isPhaseUnlocked('product-roadmap')} isCompleted={isPhaseCompleted('product-roadmap')} onClick={() => handlePhaseClick('product-roadmap')} isIncludedInPlan={isPhaseIncludedInPlan('product-roadmap')} hasRequiredPlan={hasRequiredPlan('product-roadmap')} />
                    <PhaseCard phaseId="content-strategy" title="Estrategia de Contenido" description="Define tu estrategia" isUnlocked={isPhaseUnlocked('content-strategy')} isCompleted={isPhaseCompleted('content-strategy')} onClick={() => handlePhaseClick('content-strategy')} isIncludedInPlan={isPhaseIncludedInPlan('content-strategy')} hasRequiredPlan={hasRequiredPlan('content-strategy')} />
                    <PhaseCard phaseId="intelligent-content-strategy" title="Estrategia Inteligente" description="Estrategia con IA" isUnlocked={isPhaseUnlocked('intelligent-content-strategy')} isCompleted={isPhaseCompleted('intelligent-content-strategy')} onClick={() => handlePhaseClick('intelligent-content-strategy')} isIncludedInPlan={isPhaseIncludedInPlan('intelligent-content-strategy')} hasRequiredPlan={hasRequiredPlan('intelligent-content-strategy')} />
                    <PhaseCard phaseId="analytics-insights" title="Analytics & Insights" description="Análisis profundo" isUnlocked={isPhaseUnlocked('analytics-insights')} isCompleted={isPhaseCompleted('analytics-insights')} onClick={() => handlePhaseClick('analytics-insights')} isIncludedInPlan={isPhaseIncludedInPlan('analytics-insights')} hasRequiredPlan={hasRequiredPlan('analytics-insights')} />
                  </div>
                </div>

                {/* Content Tools - PRO */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    Herramientas de Contenido
                    <Badge className="bg-blue-500 text-white"><Zap className="h-3 w-3 mr-1" />PRO</Badge>
                  </h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <PhaseCard phaseId="content-generator" title="Generador" description="Crea contenido con IA" isUnlocked={isPhaseUnlocked('content-generator')} isCompleted={isPhaseCompleted('content-generator')} onClick={() => handlePhaseClick('content-generator')} className="border-blue-200" requiredPlan={getRequiredPlanForPhase('content-generator') || 'free'} hasRequiredPlan={hasRequiredPlan('content-generator')} isIncludedInPlan={isPhaseIncludedInPlan('content-generator')} />
                    <PhaseCard phaseId="editorial-calendar" title="Calendario" description="Planifica contenido" isUnlocked={isPhaseUnlocked('editorial-calendar')} isCompleted={isPhaseCompleted('editorial-calendar')} onClick={() => handlePhaseClick('editorial-calendar')} className="border-blue-200" requiredPlan={getRequiredPlanForPhase('editorial-calendar') || 'free'} hasRequiredPlan={hasRequiredPlan('editorial-calendar')} isIncludedInPlan={isPhaseIncludedInPlan('editorial-calendar')} />
                    <PhaseCard phaseId="competitor-analyzer" title="Competencia" description="Análisis competitivo" isUnlocked={isPhaseUnlocked('competitor-analyzer')} isCompleted={isPhaseCompleted('competitor-analyzer')} onClick={() => handlePhaseClick('competitor-analyzer')} className="border-blue-200" requiredPlan={getRequiredPlanForPhase('competitor-analyzer') || 'free'} hasRequiredPlan={hasRequiredPlan('competitor-analyzer')} isIncludedInPlan={isPhaseIncludedInPlan('competitor-analyzer')} />
                    <PhaseCard phaseId="content-atomizer-basic" title="Atomización (5)" description="Convierte en 5 formatos" isUnlocked={isPhaseUnlocked('content-atomizer-basic')} isCompleted={isPhaseCompleted('content-atomizer-basic')} onClick={() => handlePhaseClick('content-atomizer-basic')} className="border-blue-200" requiredPlan={getRequiredPlanForPhase('content-atomizer-basic') || 'free'} hasRequiredPlan={hasRequiredPlan('content-atomizer-basic')} isIncludedInPlan={isPhaseIncludedInPlan('content-atomizer-basic')} />
                    <PhaseCard phaseId="virality-predictor" title="Predictor Viral" description="Predice engagement" isUnlocked={isPhaseUnlocked('virality-predictor')} isCompleted={isPhaseCompleted('virality-predictor')} onClick={() => handlePhaseClick('virality-predictor')} className="border-blue-200" requiredPlan={getRequiredPlanForPhase('virality-predictor') || 'free'} hasRequiredPlan={hasRequiredPlan('virality-predictor')} isIncludedInPlan={isPhaseIncludedInPlan('virality-predictor')} />
                    <PhaseCard phaseId="interactive-content" title="Interactivo" description="Quiz, calculadoras" isUnlocked={isPhaseUnlocked('interactive-content')} isCompleted={isPhaseCompleted('interactive-content')} onClick={() => handlePhaseClick('interactive-content')} className="border-blue-200" requiredPlan={getRequiredPlanForPhase('interactive-content') || 'free'} hasRequiredPlan={hasRequiredPlan('interactive-content')} isIncludedInPlan={isPhaseIncludedInPlan('interactive-content')} />
                    <PhaseCard phaseId="evergreen-recycler" title="Reciclador" description="Recicla contenido" isUnlocked={isPhaseUnlocked('evergreen-recycler')} isCompleted={isPhaseCompleted('evergreen-recycler')} onClick={() => handlePhaseClick('evergreen-recycler')} className="border-blue-200" requiredPlan={getRequiredPlanForPhase('evergreen-recycler') || 'free'} hasRequiredPlan={hasRequiredPlan('evergreen-recycler')} isIncludedInPlan={isPhaseIncludedInPlan('evergreen-recycler')} />
                  </div>
                </div>

                {/* Advanced Tools - PREMIUM */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    Herramientas Avanzadas
                    <Badge className="bg-purple-500 text-white"><Crown className="h-3 w-3 mr-1" />PREMIUM</Badge>
                  </h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <PhaseCard phaseId="realtime-dashboard" title="Dashboard" description="Métricas en vivo" isUnlocked={isPhaseUnlocked('realtime-dashboard')} isCompleted={isPhaseCompleted('realtime-dashboard')} onClick={() => handlePhaseClick('realtime-dashboard')} className="border-purple-200" requiredPlan={getRequiredPlanForPhase('realtime-dashboard') || 'free'} hasRequiredPlan={hasRequiredPlan('realtime-dashboard')} isIncludedInPlan={isPhaseIncludedInPlan('realtime-dashboard')} />
                    <PhaseCard phaseId="revenue-attribution" title="Revenue" description="ROI por contenido" isUnlocked={isPhaseUnlocked('revenue-attribution')} isCompleted={isPhaseCompleted('revenue-attribution')} onClick={() => handlePhaseClick('revenue-attribution')} className="border-purple-200" requiredPlan={getRequiredPlanForPhase('revenue-attribution') || 'free'} hasRequiredPlan={hasRequiredPlan('revenue-attribution')} isIncludedInPlan={isPhaseIncludedInPlan('revenue-attribution')} />
                    <PhaseCard phaseId="approval-system" title="Aprobaciones" description="Workflow de revisión" isUnlocked={isPhaseUnlocked('approval-system')} isCompleted={isPhaseCompleted('approval-system')} onClick={() => handlePhaseClick('approval-system')} className="border-purple-200" requiredPlan={getRequiredPlanForPhase('approval-system') || 'free'} hasRequiredPlan={hasRequiredPlan('approval-system')} isIncludedInPlan={isPhaseIncludedInPlan('approval-system')} />
                    <PhaseCard phaseId="team-collaboration" title="Colaboración" description="Trabajo en equipo" isUnlocked={isPhaseUnlocked('team-collaboration')} isCompleted={isPhaseCompleted('team-collaboration')} onClick={() => handlePhaseClick('team-collaboration')} className="border-purple-200" requiredPlan={getRequiredPlanForPhase('team-collaboration') || 'free'} hasRequiredPlan={hasRequiredPlan('team-collaboration')} isIncludedInPlan={isPhaseIncludedInPlan('team-collaboration')} />
                    <PhaseCard phaseId="sentiment-analysis" title="Sentimientos" description="Análisis con IA" isUnlocked={isPhaseUnlocked('sentiment-analysis')} isCompleted={isPhaseCompleted('sentiment-analysis')} onClick={() => handlePhaseClick('sentiment-analysis')} className="border-purple-200" requiredPlan={getRequiredPlanForPhase('sentiment-analysis') || 'free'} hasRequiredPlan={hasRequiredPlan('sentiment-analysis')} isIncludedInPlan={isPhaseIncludedInPlan('sentiment-analysis')} />
                    <PhaseCard phaseId="content-fatigue" title="Fatiga" description="Detecta saturación" isUnlocked={isPhaseUnlocked('content-fatigue')} isCompleted={isPhaseCompleted('content-fatigue')} onClick={() => handlePhaseClick('content-fatigue')} className="border-purple-200" requiredPlan={getRequiredPlanForPhase('content-fatigue') || 'free'} hasRequiredPlan={hasRequiredPlan('content-fatigue')} isIncludedInPlan={isPhaseIncludedInPlan('content-fatigue')} />
                    <PhaseCard phaseId="ai-image-bank" title="Imágenes IA" description="Genera imágenes" isUnlocked={isPhaseUnlocked('ai-image-bank')} isCompleted={isPhaseCompleted('ai-image-bank')} onClick={() => handlePhaseClick('ai-image-bank')} className="border-purple-200" requiredPlan={getRequiredPlanForPhase('ai-image-bank') || 'free'} hasRequiredPlan={hasRequiredPlan('ai-image-bank')} isIncludedInPlan={isPhaseIncludedInPlan('ai-image-bank')} />
                    <PhaseCard phaseId="hashtag-generator" title="Hashtags" description="Genera hashtags" isUnlocked={isPhaseUnlocked('hashtag-generator')} isCompleted={isPhaseCompleted('hashtag-generator')} onClick={() => handlePhaseClick('hashtag-generator')} className="border-purple-200" requiredPlan={getRequiredPlanForPhase('hashtag-generator') || 'free'} hasRequiredPlan={hasRequiredPlan('hashtag-generator')} isIncludedInPlan={isPhaseIncludedInPlan('hashtag-generator')} />
                    <PhaseCard phaseId="post-templates" title="Templates" description="Plantillas de posts" isUnlocked={isPhaseUnlocked('post-templates')} isCompleted={isPhaseCompleted('post-templates')} onClick={() => handlePhaseClick('post-templates')} className="border-purple-200" requiredPlan={getRequiredPlanForPhase('post-templates') || 'free'} hasRequiredPlan={hasRequiredPlan('post-templates')} isIncludedInPlan={isPhaseIncludedInPlan('post-templates')} />
                    <PhaseCard phaseId="post-scheduler" title="Programación" description="Programa posts" isUnlocked={isPhaseUnlocked('post-scheduler')} isCompleted={isPhaseCompleted('post-scheduler')} onClick={() => handlePhaseClick('post-scheduler')} className="border-purple-200" requiredPlan={getRequiredPlanForPhase('post-scheduler') || 'free'} hasRequiredPlan={hasRequiredPlan('post-scheduler')} isIncludedInPlan={isPhaseIncludedInPlan('post-scheduler')} />
                    <PhaseCard phaseId="reports-roi" title="Reportes" description="Exporta y calcula" isUnlocked={isPhaseUnlocked('reports-roi')} isCompleted={isPhaseCompleted('reports-roi')} onClick={() => handlePhaseClick('reports-roi')} className="border-purple-200" requiredPlan={getRequiredPlanForPhase('reports-roi') || 'free'} hasRequiredPlan={hasRequiredPlan('reports-roi')} isIncludedInPlan={isPhaseIncludedInPlan('reports-roi')} />
                    <PhaseCard phaseId="video-script-generator" title="Videos" description="Scripts y storyboards" isUnlocked={isPhaseUnlocked('video-script-generator')} isCompleted={isPhaseCompleted('video-script-generator')} onClick={() => handlePhaseClick('video-script-generator')} className="border-purple-200" requiredPlan={getRequiredPlanForPhase('video-script-generator') || 'free'} hasRequiredPlan={hasRequiredPlan('video-script-generator')} isIncludedInPlan={isPhaseIncludedInPlan('video-script-generator')} />
                    <PhaseCard phaseId="podcast-generator" title="Podcasts" description="Guiones y estructura" isUnlocked={isPhaseUnlocked('podcast-generator')} isCompleted={isPhaseCompleted('podcast-generator')} onClick={() => handlePhaseClick('podcast-generator')} className="border-purple-200" requiredPlan={getRequiredPlanForPhase('podcast-generator') || 'free'} hasRequiredPlan={hasRequiredPlan('podcast-generator')} isIncludedInPlan={isPhaseIncludedInPlan('podcast-generator')} />
                    <PhaseCard phaseId="voice-cloning" title="Voice Cloning" description="Audio con ElevenLabs" isUnlocked={isPhaseUnlocked('voice-cloning')} isCompleted={isPhaseCompleted('voice-cloning')} onClick={() => handlePhaseClick('voice-cloning')} className="border-purple-200" requiredPlan={getRequiredPlanForPhase('voice-cloning') || 'free'} hasRequiredPlan={hasRequiredPlan('voice-cloning')} isIncludedInPlan={isPhaseIncludedInPlan('voice-cloning')} />
                    <PhaseCard phaseId="article-generator" title="Artículos" description="Blog y LinkedIn" isUnlocked={isPhaseUnlocked('article-generator')} isCompleted={isPhaseCompleted('article-generator')} onClick={() => handlePhaseClick('article-generator')} className="border-purple-200" requiredPlan={getRequiredPlanForPhase('article-generator') || 'free'} hasRequiredPlan={hasRequiredPlan('article-generator')} isIncludedInPlan={isPhaseIncludedInPlan('article-generator')} />
                    <PhaseCard phaseId="seo-analyzer" title="SEO" description="Optimización buscadores" isUnlocked={isPhaseUnlocked('seo-analyzer')} isCompleted={isPhaseCompleted('seo-analyzer')} onClick={() => handlePhaseClick('seo-analyzer')} className="border-purple-200" requiredPlan={getRequiredPlanForPhase('seo-analyzer') || 'free'} hasRequiredPlan={hasRequiredPlan('seo-analyzer')} isIncludedInPlan={isPhaseIncludedInPlan('seo-analyzer')} />
                    <PhaseCard phaseId="aeo-analyzer" title="AEO" description="Optimización para IA" isUnlocked={isPhaseUnlocked('aeo-analyzer')} isCompleted={isPhaseCompleted('aeo-analyzer')} onClick={() => handlePhaseClick('aeo-analyzer')} className="border-purple-200" requiredPlan={getRequiredPlanForPhase('aeo-analyzer') || 'free'} hasRequiredPlan={hasRequiredPlan('aeo-analyzer')} isIncludedInPlan={isPhaseIncludedInPlan('aeo-analyzer')} />
                    <PhaseCard phaseId="content-atomizer-advanced" title="Atomización (15)" description="Convierte en 15 formatos" isUnlocked={isPhaseUnlocked('content-atomizer-advanced')} isCompleted={isPhaseCompleted('content-atomizer-advanced')} onClick={() => handlePhaseClick('content-atomizer-advanced')} className="border-purple-200" requiredPlan={getRequiredPlanForPhase('content-atomizer-advanced') || 'free'} hasRequiredPlan={hasRequiredPlan('content-atomizer-advanced')} isIncludedInPlan={isPhaseIncludedInPlan('content-atomizer-advanced')} />
                    <PhaseCard phaseId="pre-viral-trends" title="Tendencias" description="Pre-viral 24-48h" isUnlocked={isPhaseUnlocked('pre-viral-trends')} isCompleted={isPhaseCompleted('pre-viral-trends')} onClick={() => handlePhaseClick('pre-viral-trends')} className="border-purple-200" requiredPlan={getRequiredPlanForPhase('pre-viral-trends') || 'free'} hasRequiredPlan={hasRequiredPlan('pre-viral-trends')} isIncludedInPlan={isPhaseIncludedInPlan('pre-viral-trends')} />
                  </div>
                </div>

                {/* AI Agents - GOLD */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    Agentes IA Especializados
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white"><Star className="h-3 w-3 mr-1" />GOLD</Badge>
                    <Badge variant="outline" className="border-amber-500/50 text-amber-600">17+ Especialistas 24/7</Badge>
                  </h3>
                  {AGENT_TEAMS.map((team) => {
                    const teamAgents = AI_AGENTS.filter(a => a.team === team.id);
                    const agencyUnlocked = isPhaseUnlocked('ai-agency');
                    const agencyIncluded = isPhaseIncludedInPlan('ai-agency');
                    const agencyCompleted = isPhaseCompleted('ai-agency');
                    const lockedByProgress = agencyIncluded && !agencyUnlocked && !agencyCompleted;
                    const lockedByPlan = !agencyIncluded;

                    return (
                      <div key={team.id} className="mb-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">{team.name}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {teamAgents.map((agent) => {
                            const IconComp = (Icons as any)[agent.icon] || Icons.Bot;
                            const colorMap: Record<string, { bg: string; text: string; border: string }> = {
                              amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30' },
                              blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30' },
                              purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/30' },
                              pink: { bg: 'bg-pink-500/10', text: 'text-pink-500', border: 'border-pink-500/30' },
                              green: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/30' },
                              orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/30' },
                              emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30' },
                              cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-500/30' },
                              yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/30' },
                              violet: { bg: 'bg-violet-500/10', text: 'text-violet-500', border: 'border-violet-500/30' },
                              indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', border: 'border-indigo-500/30' },
                              teal: { bg: 'bg-teal-500/10', text: 'text-teal-500', border: 'border-teal-500/30' },
                              rose: { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/30' },
                              fuchsia: { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-500', border: 'border-fuchsia-500/30' },
                              red: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30' },
                              slate: { bg: 'bg-slate-500/10', text: 'text-slate-500', border: 'border-slate-500/30' },
                              sky: { bg: 'bg-sky-500/10', text: 'text-sky-500', border: 'border-sky-500/30' },
                            };
                            const colors = colorMap[agent.color] || colorMap.amber;
                            const canClick = agencyUnlocked && (!agent.isAnnualOnly);

                            return (
                              <Card
                                key={agent.id}
                                className={`transition-all ${colors.border} border ${
                                  canClick
                                    ? 'cursor-pointer hover:shadow-md hover:scale-[1.02]'
                                    : lockedByProgress
                                      ? 'border-dashed opacity-80'
                                      : lockedByPlan
                                        ? 'opacity-40 cursor-not-allowed'
                                        : 'opacity-60'
                                }`}
                                onClick={canClick ? () => { setSelectedAgentId(agent.id); handlePhaseClick('ai-agency'); } : undefined}
                              >
                                <CardContent className="p-3 flex items-start gap-3">
                                  <div className={`p-2 rounded-lg ${colors.bg} shrink-0`}>
                                    <IconComp className={`h-5 w-5 ${colors.text}`} />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-sm truncate">{agent.name}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{agent.title}</p>
                                  </div>
                                  <div className="flex flex-col gap-1 shrink-0">
                                    {agent.isAnnualOnly && (
                                      <Badge className="text-[10px] px-1.5 py-0 bg-gradient-to-r from-amber-500 to-yellow-500 text-white">Anual</Badge>
                                    )}
                                    {lockedByPlan && (
                                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Upgrade</Badge>
                                    )}
                                    {lockedByProgress && !lockedByPlan && (
                                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-500 text-amber-600">Pronto</Badge>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      {currentPhase !== 'menu' && (
        <div className="fixed top-4 left-4 right-4 z-50 flex justify-between items-center gap-4">
          <Button variant="outline" onClick={() => setCurrentPhase('menu')}>
            ← Volver al Menú
          </Button>
          {!isPhaseCompleted(currentPhase) && user && (
            <Button onClick={handleCompletePhase} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Marcar como Completado
            </Button>
          )}
        </div>
      )}
      {renderPhase()}
    </div>
  );
};

export default Index;
