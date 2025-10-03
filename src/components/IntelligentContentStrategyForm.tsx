import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { IntelligentContentStrategy } from "@/types/intelligent-content-strategy";
import { IntelligentContentStrategyPreview } from "./IntelligentContentStrategyPreview";
import { BrandConceptForm } from "./intelligent-forms/BrandConceptForm";
import { KpisForm } from "./intelligent-forms/KpisForm";
import { AudienceForm } from "./intelligent-forms/AudienceForm";
import { ChannelsForm } from "./intelligent-forms/ChannelsForm";
import { RhythmForm } from "./intelligent-forms/RhythmForm";
import { ContentMarketingForm } from "./intelligent-forms/ContentMarketingForm";
import { CommunicationToneForm } from "./intelligent-forms/CommunicationToneForm";
import { FormatsForm } from "./intelligent-forms/FormatsForm";
import { BudgetForm } from "./intelligent-forms/BudgetForm";
import { FaqsCrisisForm } from "./intelligent-forms/FaqsCrisisForm";
import { WorkflowForm } from "./intelligent-forms/WorkflowForm";
import { ChevronLeft, ChevronRight, Eye, Sparkles, RefreshCw, Lightbulb, Zap, Brain, Hash } from "lucide-react";
import { generateIntelligentStrategy } from "@/utils/strategy-generator";
import { ContentIdeasGenerator } from "./ContentIdeasGenerator";
import { PlatformOptimizer } from "./PlatformOptimizer";
import { SentimentAnalysisForm } from "./SentimentAnalysisForm";
import { HashtagGeneratorForm } from "./HashtagGeneratorForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const intelligentContentStrategySchema = z.object({
  brandConcept: z.object({
    valueProposition: z.string(),
    keyDifferentiators: z.string(),
    brandAttributes: z.string(),
    customerPromise: z.string(),
    creativeConceptPhrase: z.string(),
  }),
  kpis: z.object({
    priorityMetrics: z.string(),
    relevantKpis: z.array(z.string()),
    numericObjectives: z.string(),
  }),
  audience: z.object({
    primaryBuyerPersona: z.string(),
    archetypes: z.string(),
    keyPublics: z.string(),
    audienceProblemsNeeds: z.string(),
  }),
  channels: z.object({
    socialNetworks: z.string(),
    platformContentFit: z.string(),
    channelRoles: z.string(),
    resourcePrioritization: z.string(),
  }),
  rhythm: z.object({
    publicationFrequency: z.string(),
    networkDifferences: z.string(),
    storiesReelsVideos: z.string(),
    optimalTiming: z.string(),
  }),
  contentMarketing: z.object({
    mainTopics: z.string(),
    coreMessages: z.string(),
    topicsToAvoid: z.string(),
    valueContribution: z.string(),
  }),
  communicationTone: z.object({
    brandPerception: z.string(),
    languageStyle: z.string(),
    emotionsToEvoke: z.string(),
    voicePersonality: z.string(),
  }),
  formats: z.object({
    primaryFormats: z.string(),
    engagementFormats: z.string(),
    contentReuse: z.string(),
  }),
  budget: z.object({
    monthlyBudget: z.string(),
    organicVsPaid: z.string(),
    networkInvestment: z.string(),
    toolsInvestment: z.string(),
  }),
  faqsCrisis: z.object({
    frequentQuestions: z.string(),
    reputationRisks: z.string(),
    crisisProtocol: z.string(),
    responseTime: z.string(),
  }),
  workflow: z.object({
    managementTools: z.string(),
    editorialCalendar: z.string(),
    teamWorkflow: z.string(),
    analyticsTools: z.string(),
    aiUsage: z.string(),
  }),
});

const steps = [
  { title: "Marca - Concepto Rector", component: BrandConceptForm, icon: "❤️" },
  { title: "KPI's", component: KpisForm, icon: "📊" },
  { title: "Audiencia", component: AudienceForm, icon: "🎯" },
  { title: "Canales", component: ChannelsForm, icon: "📱" },
  { title: "Ritmo", component: RhythmForm, icon: "⏱️" },
  { title: "Marketing de Contenidos", component: ContentMarketingForm, icon: "🏆" },
  { title: "Tono de Comunicación", component: CommunicationToneForm, icon: "🎤" },
  { title: "Formatos", component: FormatsForm, icon: "🎬" },
  { title: "Presupuesto", component: BudgetForm, icon: "💰" },
  { title: "FAQ's y Crisis", component: FaqsCrisisForm, icon: "⚡" },
  { title: "Workflow", component: WorkflowForm, icon: "🔄" },
  { title: "Herramientas IA", component: null, icon: "✨" }, // Special step for AI tools
];

export const IntelligentContentStrategyForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const form = useForm<IntelligentContentStrategy>({
    resolver: zodResolver(intelligentContentStrategySchema),
    defaultValues: {
      brandConcept: {
        valueProposition: "",
        keyDifferentiators: "",
        brandAttributes: "",
        customerPromise: "",
        creativeConceptPhrase: "",
      },
      kpis: {
        priorityMetrics: "",
        relevantKpis: [],
        numericObjectives: "",
      },
      audience: {
        primaryBuyerPersona: "",
        archetypes: "",
        keyPublics: "",
        audienceProblemsNeeds: "",
      },
      channels: {
        socialNetworks: "",
        platformContentFit: "",
        channelRoles: "",
        resourcePrioritization: "",
      },
      rhythm: {
        publicationFrequency: "",
        networkDifferences: "",
        storiesReelsVideos: "",
        optimalTiming: "",
      },
      contentMarketing: {
        mainTopics: "",
        coreMessages: "",
        topicsToAvoid: "",
        valueContribution: "",
      },
      communicationTone: {
        brandPerception: "",
        languageStyle: "",
        emotionsToEvoke: "",
        voicePersonality: "",
      },
      formats: {
        primaryFormats: "",
        engagementFormats: "",
        contentReuse: "",
      },
      budget: {
        monthlyBudget: "",
        organicVsPaid: "",
        networkInvestment: "",
        toolsInvestment: "",
      },
      faqsCrisis: {
        frequentQuestions: "",
        reputationRisks: "",
        crisisProtocol: "",
        responseTime: "",
      },
      workflow: {
        managementTools: "",
        editorialCalendar: "",
        teamWorkflow: "",
        analyticsTools: "",
        aiUsage: "",
      },
    },
  });

  useEffect(() => {
    generateInitialStrategy();
  }, []);

  const generateInitialStrategy = async () => {
    setIsGenerating(true);
    try {
      const generatedStrategy = await generateIntelligentStrategy();
      form.reset(generatedStrategy);
    } catch (error) {
      console.error("Error generating strategy:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateStrategy = async () => {
    setIsGenerating(true);
    try {
      const generatedStrategy = await generateIntelligentStrategy();
      form.reset(generatedStrategy);
    } catch (error) {
      console.error("Error regenerating strategy:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: IntelligentContentStrategy) => {
    setShowPreview(true);
  };

  if (showPreview) {
    return <IntelligentContentStrategyPreview data={form.getValues()} />;
  }

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isAIToolsStep = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Estrategia de Contenido Inteligente</h1>
              <p className="text-muted-foreground">
                Generada automáticamente basada en tus datos anteriores
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <p className="text-muted-foreground">
              Paso {currentStep + 1} de {steps.length}: {steps[currentStep].icon} {steps[currentStep].title}
            </p>
            
            <Button
              type="button"
              variant="outline"
              onClick={regenerateStrategy}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerar
            </Button>
          </div>
          
          <Progress value={progress} className="w-full" />
        </div>

        {isGenerating ? (
          <Card>
            <CardContent className="flex items-center justify-center p-8">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                <p className="text-lg">Generando estrategia inteligente...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{steps[currentStep].icon}</span>
                    {steps[currentStep].title}
                  </CardTitle>
                  <CardDescription>
                    Revisa y ajusta las respuestas generadas automáticamente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isAIToolsStep ? (
                    <Tabs defaultValue="ideas" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="ideas">
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Ideas
                        </TabsTrigger>
                        <TabsTrigger value="optimizer">
                          <Zap className="w-4 h-4 mr-2" />
                          Optimizar
                        </TabsTrigger>
                        <TabsTrigger value="sentiment">
                          <Brain className="w-4 h-4 mr-2" />
                          Sentimiento
                        </TabsTrigger>
                        <TabsTrigger value="hashtags">
                          <Hash className="w-4 h-4 mr-2" />
                          Hashtags
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="ideas">
                        <ContentIdeasGenerator contentStrategy={form.getValues()} />
                      </TabsContent>
                      <TabsContent value="optimizer">
                        <PlatformOptimizer contentStrategy={form.getValues()} />
                      </TabsContent>
                      <TabsContent value="sentiment">
                        <SentimentAnalysisForm />
                      </TabsContent>
                      <TabsContent value="hashtags">
                        <HashtagGeneratorForm />
                      </TabsContent>
                    </Tabs>
                  ) : (
                    CurrentStepComponent && <CurrentStepComponent control={form.control} />
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPreview(true)}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Vista Previa
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex items-center gap-2"
                  >
                    Finalizar Estrategia
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};