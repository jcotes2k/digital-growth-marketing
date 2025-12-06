import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { TargetAudienceForm } from './roadmap-forms/TargetAudienceForm';
import { MustHaveForm } from './roadmap-forms/MustHaveForm';
import { ShouldHaveForm } from './roadmap-forms/ShouldHaveForm';
import { CouldHaveForm } from './roadmap-forms/CouldHaveForm';
import { BacklogForm } from './roadmap-forms/BacklogForm';
import { AlternativesForm } from './roadmap-forms/AlternativesForm';
import { ProductRoadmapPreview } from './ProductRoadmapPreview';
import { RoadmapFeatureGenerator } from './RoadmapFeatureGenerator';
import { RoadmapPrioritizer } from './RoadmapPrioritizer';
import { RoadmapTimeline } from './RoadmapTimeline';
import { RoadmapMetricsIntegration } from './RoadmapMetricsIntegration';
import { ProductRoadmap } from '@/types/product-roadmap';
import { 
  Users, 
  CheckSquare, 
  ClipboardList, 
  Lightbulb, 
  Archive, 
  GitBranch, 
  Eye,
  Sparkles,
  ListOrdered,
  GanttChart,
  BarChart3
} from 'lucide-react';

const tabs = [
  { id: 'target-audience', title: '¿Para quién?', description: 'Perfil de usuario objetivo basado en tu buyer persona', icon: Users },
  { id: 'generate-ai', title: 'Generar IA', description: 'Genera funcionalidades automáticamente con inteligencia artificial', icon: Sparkles },
  { id: 'prioritize', title: 'Priorizar', description: 'Clasifica automáticamente usando el método MoSCoW', icon: ListOrdered },
  { id: 'timeline', title: 'Timeline', description: 'Vista visual interactiva del roadmap con drag & drop', icon: GanttChart },
  { id: 'metrics', title: 'Métricas', description: 'Integración con métricas de engagement y rendimiento', icon: BarChart3 },
  { id: 'must-have', title: 'Debe tener', description: 'Funcionalidades esenciales y historias de usuario validadas', icon: CheckSquare },
  { id: 'should-have', title: 'Debería tener', description: 'Características importantes para el crecimiento a corto plazo', icon: ClipboardList },
  { id: 'could-have', title: 'Podría tener', description: 'Funcionalidades deseables para el desarrollo futuro', icon: Lightbulb },
  { id: 'backlog', title: 'Backlog', description: 'Ideas y funcionalidades pendientes de clasificar', icon: Archive },
  { id: 'alternatives', title: 'Alternativas', description: 'Análisis del mercado y competencia existente', icon: GitBranch },
  { id: 'preview', title: 'Vista Previa', description: 'Revisa tu roadmap de producto completo', icon: Eye },
];

export const ProductRoadmapForm = () => {
  const [activeTab, setActiveTab] = useState('target-audience');
  const [formData, setFormData] = useState<Partial<ProductRoadmap>>({});
  const [refreshKey, setRefreshKey] = useState(0);
  
  const form = useForm<ProductRoadmap>({
    defaultValues: {
      targetAudience: '',
      mustHaveFeatures: '',
      userStories: '',
      shouldHaveFeatures: '',
      shortTermGoals: '',
      couldHaveFeatures: '',
      futureVision: '',
      backlogFeatures: '',
      unclassifiedIdeas: '',
      marketAlternatives: '',
      competitorAnalysis: '',
    },
  });

  const watchedData = form.watch();

  React.useEffect(() => {
    setFormData(watchedData);
  }, [watchedData]);

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const progress = ((currentTabIndex + 1) / tabs.length) * 100;

  const onNext = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const onPrev = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const currentTab = tabs.find(t => t.id === activeTab);
  const IconComponent = currentTab?.icon;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Product Roadmap Canvas</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Planifica tu producto con IA, priorización MoSCoW y timeline visual interactivo
          </p>
          <div className="max-w-md mx-auto">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Paso {currentTabIndex + 1} de {tabs.length}
            </p>
          </div>
        </div>

        <Form {...form}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex flex-wrap justify-center gap-1 mb-8 h-auto p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="text-xs flex items-center gap-1 px-3 py-2"
                  >
                    <Icon className="h-3 w-3" />
                    <span className="hidden sm:inline">{tab.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <Card className="min-h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                  {currentTab?.title}
                </CardTitle>
                <CardDescription>{currentTab?.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <TabsContent value="target-audience" className="mt-0">
                  <TargetAudienceForm control={form.control} />
                </TabsContent>

                <TabsContent value="generate-ai" className="mt-0">
                  <RoadmapFeatureGenerator 
                    key={`generator-${refreshKey}`}
                    targetAudience={form.watch('targetAudience')} 
                    onFeaturesGenerated={handleRefresh}
                  />
                </TabsContent>

                <TabsContent value="prioritize" className="mt-0">
                  <RoadmapPrioritizer 
                    key={`prioritizer-${refreshKey}`}
                    onPrioritizationComplete={handleRefresh}
                  />
                </TabsContent>

                <TabsContent value="timeline" className="mt-0">
                  <RoadmapTimeline key={`timeline-${refreshKey}`} />
                </TabsContent>

                <TabsContent value="metrics" className="mt-0">
                  <RoadmapMetricsIntegration key={`metrics-${refreshKey}`} />
                </TabsContent>
                
                <TabsContent value="must-have" className="mt-0">
                  <MustHaveForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="should-have" className="mt-0">
                  <ShouldHaveForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="could-have" className="mt-0">
                  <CouldHaveForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="backlog" className="mt-0">
                  <BacklogForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="alternatives" className="mt-0">
                  <AlternativesForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="preview" className="mt-0">
                  <ProductRoadmapPreview roadmap={formData as ProductRoadmap} />
                </TabsContent>

                <div className="flex justify-between mt-8">
                  <Button 
                    variant="outline" 
                    onClick={onPrev}
                    disabled={currentTabIndex === 0}
                  >
                    Anterior
                  </Button>
                  
                  <Button 
                    onClick={onNext}
                    disabled={currentTabIndex === tabs.length - 1}
                  >
                    Siguiente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Tabs>
        </Form>
      </div>
    </div>
  );
};
