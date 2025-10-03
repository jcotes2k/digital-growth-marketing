import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUserProgress } from "@/hooks/use-user-progress";
import { Lock, CheckCircle2, Award, Crown, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SubscriptionPlan } from "@/types/user-progress";

type Phase = 'menu' | 'buyer-persona' | 'business-canvas' | 'product-roadmap' | 'content-strategy' | 'intelligent-content-strategy' | 'analytics-insights' | 'content-generator' | 'editorial-calendar' | 'competitor-analyzer' | 'ai-image-bank' | 'hashtag-generator' | 'post-templates' | 'post-scheduler' | 'realtime-dashboard' | 'approval-system' | 'team-collaboration' | 'sentiment-analysis' | 'reports-roi';

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
}

const getPlanBadge = (plan: SubscriptionPlan) => {
  switch (plan) {
    case 'pro':
      return <Badge className="bg-blue-500 text-white text-xs shrink-0"><Zap className="h-3 w-3 mr-1" />PRO</Badge>;
    case 'premium':
      return <Badge className="bg-purple-500 text-white text-xs shrink-0"><Crown className="h-3 w-3 mr-1" />PREMIUM</Badge>;
    default:
      return null;
  }
};

const getPlanName = (plan: SubscriptionPlan) => {
  switch (plan) {
    case 'free': return 'Gratis';
    case 'pro': return 'Pro';
    case 'premium': return 'Premium';
  }
};

const PhaseCard = ({ phaseId, title, description, isUnlocked, isCompleted, onClick, className = "", requiredPlan, hasRequiredPlan }: PhaseCardProps) => {
  const showPlanBadge = requiredPlan && requiredPlan !== 'free';
  const isLockedByPlan = !hasRequiredPlan && requiredPlan && requiredPlan !== 'free';
  
  return (
    <Card 
      className={`transition-all ${
        isUnlocked 
          ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]' 
          : 'opacity-50 cursor-not-allowed'
      } ${isCompleted ? 'border-green-500 border-2' : ''} ${isLockedByPlan ? 'border-dashed' : ''} ${className}`}
      onClick={isUnlocked ? onClick : undefined}
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            {isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
            ) : isUnlocked ? (
              <div className="h-5 w-5 rounded-full border-2 flex-shrink-0" />
            ) : (
              <Lock className="h-5 w-5 flex-shrink-0" />
            )}
            <span className="line-clamp-1">{title}</span>
          </CardTitle>
          <div className="flex gap-1">
            {isCompleted && (
              <Badge className="bg-green-500 text-xs shrink-0">✓</Badge>
            )}
            {showPlanBadge && requiredPlan && getPlanBadge(requiredPlan)}
          </div>
        </div>
        <CardDescription className="text-sm line-clamp-2">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

const Index = () => {
  const [currentPhase, setCurrentPhase] = useState<Phase>('menu');
  const { toast } = useToast();
  
  const {
    isPhaseUnlocked,
    isPhaseCompleted,
    markPhaseComplete,
    getCompletionPercentage,
    getRequiredPlanForPhase,
    hasRequiredPlan,
    subscription,
    user,
  } = useUserProgress();

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
                    {subscription && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Plan actual:</span>
                        {subscription.plan === 'free' ? (
                          <Badge variant="outline">Gratis</Badge>
                        ) : subscription.plan === 'pro' ? (
                          <Badge className="bg-blue-500"><Zap className="h-3 w-3 mr-1" />Pro</Badge>
                        ) : (
                          <Badge className="bg-purple-500"><Crown className="h-3 w-3 mr-1" />Premium</Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <Progress value={completionPercentage} className="h-3" />
                </div>
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

              <div className="space-y-6">
                {/* Core Phases */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Fases Principales</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <PhaseCard
                      phaseId="buyer-persona"
                      title="Buyer Persona"
                      description="Define tu cliente ideal"
                      isUnlocked={isPhaseUnlocked('buyer-persona')}
                      isCompleted={isPhaseCompleted('buyer-persona')}
                      onClick={() => handlePhaseClick('buyer-persona')}
                    />
                    <PhaseCard
                      phaseId="business-canvas"
                      title="Business Canvas"
                      description="Modelo de negocio"
                      isUnlocked={isPhaseUnlocked('business-canvas')}
                      isCompleted={isPhaseCompleted('business-canvas')}
                      onClick={() => handlePhaseClick('business-canvas')}
                    />
                    <PhaseCard
                      phaseId="product-roadmap"
                      title="Product Roadmap"
                      description="Planificación de producto"
                      isUnlocked={isPhaseUnlocked('product-roadmap')}
                      isCompleted={isPhaseCompleted('product-roadmap')}
                      onClick={() => handlePhaseClick('product-roadmap')}
                    />
                    <PhaseCard
                      phaseId="content-strategy"
                      title="Estrategia de Contenido"
                      description="Define tu estrategia"
                      isUnlocked={isPhaseUnlocked('content-strategy')}
                      isCompleted={isPhaseCompleted('content-strategy')}
                      onClick={() => handlePhaseClick('content-strategy')}
                    />
                    <PhaseCard
                      phaseId="intelligent-content-strategy"
                      title="Estrategia Inteligente"
                      description="Estrategia con IA"
                      isUnlocked={isPhaseUnlocked('intelligent-content-strategy')}
                      isCompleted={isPhaseCompleted('intelligent-content-strategy')}
                      onClick={() => handlePhaseClick('intelligent-content-strategy')}
                    />
                    <PhaseCard
                      phaseId="analytics-insights"
                      title="Analytics & Insights"
                      description="Análisis profundo"
                      isUnlocked={isPhaseUnlocked('analytics-insights')}
                      isCompleted={isPhaseCompleted('analytics-insights')}
                      onClick={() => handlePhaseClick('analytics-insights')}
                    />
                  </div>
                </div>

                {/* Tool Phases */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Herramientas de Contenido</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <PhaseCard
                      phaseId="content-generator"
                      title="Generador"
                      description="Crea contenido con IA"
                      isUnlocked={isPhaseUnlocked('content-generator')}
                      isCompleted={isPhaseCompleted('content-generator')}
                      onClick={() => handlePhaseClick('content-generator')}
                      className="border-blue-200"
                      requiredPlan={getRequiredPlanForPhase('content-generator') || 'free'}
                      hasRequiredPlan={hasRequiredPlan('content-generator')}
                    />
                    <PhaseCard
                      phaseId="editorial-calendar"
                      title="Calendario"
                      description="Planifica contenido"
                      isUnlocked={isPhaseUnlocked('editorial-calendar')}
                      isCompleted={isPhaseCompleted('editorial-calendar')}
                      onClick={() => handlePhaseClick('editorial-calendar')}
                      className="border-blue-200"
                      requiredPlan={getRequiredPlanForPhase('editorial-calendar') || 'free'}
                      hasRequiredPlan={hasRequiredPlan('editorial-calendar')}
                    />
                    <PhaseCard
                      phaseId="competitor-analyzer"
                      title="Competencia"
                      description="Análisis competitivo"
                      isUnlocked={isPhaseUnlocked('competitor-analyzer')}
                      isCompleted={isPhaseCompleted('competitor-analyzer')}
                      onClick={() => handlePhaseClick('competitor-analyzer')}
                      className="border-orange-200"
                      requiredPlan={getRequiredPlanForPhase('competitor-analyzer') || 'free'}
                      hasRequiredPlan={hasRequiredPlan('competitor-analyzer')}
                    />
                    <PhaseCard
                      phaseId="ai-image-bank"
                      title="Imágenes IA"
                      description="Genera imágenes"
                      isUnlocked={isPhaseUnlocked('ai-image-bank')}
                      isCompleted={isPhaseCompleted('ai-image-bank')}
                      onClick={() => handlePhaseClick('ai-image-bank')}
                      className="border-purple-200"
                      requiredPlan={getRequiredPlanForPhase('ai-image-bank') || 'free'}
                      hasRequiredPlan={hasRequiredPlan('ai-image-bank')}
                    />
                    <PhaseCard
                      phaseId="hashtag-generator"
                      title="Hashtags"
                      description="Genera hashtags"
                      isUnlocked={isPhaseUnlocked('hashtag-generator')}
                      isCompleted={isPhaseCompleted('hashtag-generator')}
                      onClick={() => handlePhaseClick('hashtag-generator')}
                      className="border-green-200"
                      requiredPlan={getRequiredPlanForPhase('hashtag-generator') || 'free'}
                      hasRequiredPlan={hasRequiredPlan('hashtag-generator')}
                    />
                    <PhaseCard
                      phaseId="post-templates"
                      title="Templates"
                      description="Plantillas de posts"
                      isUnlocked={isPhaseUnlocked('post-templates')}
                      isCompleted={isPhaseCompleted('post-templates')}
                      onClick={() => handlePhaseClick('post-templates')}
                      className="border-blue-200"
                      requiredPlan={getRequiredPlanForPhase('post-templates') || 'free'}
                      hasRequiredPlan={hasRequiredPlan('post-templates')}
                    />
                    <PhaseCard
                      phaseId="post-scheduler"
                      title="Programación"
                      description="Programa posts"
                      isUnlocked={isPhaseUnlocked('post-scheduler')}
                      isCompleted={isPhaseCompleted('post-scheduler')}
                      onClick={() => handlePhaseClick('post-scheduler')}
                      className="border-indigo-200"
                      requiredPlan={getRequiredPlanForPhase('post-scheduler') || 'free'}
                      hasRequiredPlan={hasRequiredPlan('post-scheduler')}
                    />
                  </div>
                </div>

                {/* Advanced Tools */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Herramientas Avanzadas</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <PhaseCard
                      phaseId="realtime-dashboard"
                      title="Dashboard"
                      description="Métricas en vivo"
                      isUnlocked={isPhaseUnlocked('realtime-dashboard')}
                      isCompleted={isPhaseCompleted('realtime-dashboard')}
                      onClick={() => handlePhaseClick('realtime-dashboard')}
                      className="border-emerald-200"
                      requiredPlan={getRequiredPlanForPhase('realtime-dashboard') || 'free'}
                      hasRequiredPlan={hasRequiredPlan('realtime-dashboard')}
                    />
                    <PhaseCard
                      phaseId="approval-system"
                      title="Aprobaciones"
                      description="Workflow de revisión"
                      isUnlocked={isPhaseUnlocked('approval-system')}
                      isCompleted={isPhaseCompleted('approval-system')}
                      onClick={() => handlePhaseClick('approval-system')}
                      className="border-amber-200"
                      requiredPlan={getRequiredPlanForPhase('approval-system') || 'free'}
                      hasRequiredPlan={hasRequiredPlan('approval-system')}
                    />
                    <PhaseCard
                      phaseId="team-collaboration"
                      title="Colaboración"
                      description="Trabajo en equipo"
                      isUnlocked={isPhaseUnlocked('team-collaboration')}
                      isCompleted={isPhaseCompleted('team-collaboration')}
                      onClick={() => handlePhaseClick('team-collaboration')}
                      className="border-cyan-200"
                      requiredPlan={getRequiredPlanForPhase('team-collaboration') || 'free'}
                      hasRequiredPlan={hasRequiredPlan('team-collaboration')}
                    />
                    <PhaseCard
                      phaseId="sentiment-analysis"
                      title="Sentimientos"
                      description="Análisis con IA"
                      isUnlocked={isPhaseUnlocked('sentiment-analysis')}
                      isCompleted={isPhaseCompleted('sentiment-analysis')}
                      onClick={() => handlePhaseClick('sentiment-analysis')}
                      className="border-rose-200"
                      requiredPlan={getRequiredPlanForPhase('sentiment-analysis') || 'free'}
                      hasRequiredPlan={hasRequiredPlan('sentiment-analysis')}
                    />
                    <PhaseCard
                      phaseId="reports-roi"
                      title="Reportes y ROI"
                      description="Exporta y calcula"
                      isUnlocked={isPhaseUnlocked('reports-roi')}
                      isCompleted={isPhaseCompleted('reports-roi')}
                      onClick={() => handlePhaseClick('reports-roi')}
                      className="border-violet-200"
                      requiredPlan={getRequiredPlanForPhase('reports-roi') || 'free'}
                      hasRequiredPlan={hasRequiredPlan('reports-roi')}
                    />
                  </div>
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