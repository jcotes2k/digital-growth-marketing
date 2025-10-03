import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Library } from 'lucide-react';
import { CanvasTemplateLibrary } from './CanvasTemplateLibrary';
import { AICanvasGenerator } from './AICanvasGenerator';
import { useState as useReactState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BuyerPersona } from '@/types/buyer-persona';
import { CompanyInfo } from '@/types/company-info';
import { ProblemaForm } from './canvas-forms/ProblemaForm';
import { SolucionForm } from './canvas-forms/SolucionForm';
import { PropuestaValorForm } from './canvas-forms/PropuestaValorForm';
import { VentajaDiferencialForm } from './canvas-forms/VentajaDiferencialForm';
import { SegmentosClientesForm } from './canvas-forms/SegmentosClientesForm';
import { IndicadoresClaveForm } from './canvas-forms/IndicadoresClaveForm';
import { CanalesForm } from './canvas-forms/CanalesForm';
import { EstructuraCostesForm } from './canvas-forms/EstructuraCostesForm';
import { SostenibilidadFinancieraForm } from './canvas-forms/SostenibilidadFinancieraForm';
import { EquipoForm } from './canvas-forms/EquipoForm';
import { ImpactoForm } from './canvas-forms/ImpactoForm';
import { BusinessCanvasPreview } from './BusinessCanvasPreview';
import { BusinessCanvas } from '@/types/business-canvas';
import { CanvasViabilityAnalysis } from './CanvasViabilityAnalysis';
import { CanvasScenariosManager } from './CanvasScenariosManager';
import { CanvasComparison } from './CanvasComparison';

const tabs = [
  { id: 'problema', title: 'Problema', description: 'Identifica los principales problemas y soluciones alternativas' },
  { id: 'solucion', title: 'Solución', description: 'Características más importantes de tu propuesta' },
  { id: 'propuesta-valor', title: 'Propuesta Valor', description: 'Define tu propuesta de valor única' },
  { id: 'ventaja-diferencial', title: 'Ventaja Diferencial', description: 'Lo que te hace especial y diferente' },
  { id: 'segmentos-clientes', title: 'Segmentos Clientes', description: 'Identifica tus segmentos de clientes objetivo' },
  { id: 'indicadores-clave', title: 'Indicadores Clave', description: 'Actividades e indicadores para medir' },
  { id: 'canales', title: 'Canales', description: 'Cómo vas a llegar a tus clientes' },
  { id: 'estructura-costes', title: 'Estructura Costes', description: 'Elementos de costo y gastos mensuales' },
  { id: 'sostenibilidad-financiera', title: 'Sostenibilidad Financiera', description: 'Generación de ingresos y márgenes' },
  { id: 'equipo', title: 'Equipo', description: 'Miembros del equipo y roles clave' },
  { id: 'impacto', title: 'Impacto', description: 'Impacto social y medioambiental' },
  { id: 'validation', title: 'Validación', description: 'Análisis de viabilidad con IA' },
  { id: 'scenarios', title: 'Escenarios', description: 'Gestiona y compara versiones' },
  { id: 'preview', title: 'Vista Previa', description: 'Revisa tu modelo de negocio' },
];

export const BusinessCanvasForm = () => {
  const [activeTab, setActiveTab] = useState('problema');
  const [formData, setFormData] = useState<Partial<BusinessCanvas>>({});
  const [showTemplates, setShowTemplates] = useReactState(false);
  const [showAIGenerator, setShowAIGenerator] = useReactState(false);
  const [buyerPersonas, setBuyerPersonas] = useReactState<BuyerPersona[]>([]);
  const [companyInfo, setCompanyInfo] = useReactState<CompanyInfo | null>(null);
  const [loadingPersonas, setLoadingPersonas] = useReactState(false);
  const [showComparison, setShowComparison] = useReactState(false);
  const [scenariosToCompare, setScenariosToCompare] = useReactState<any[]>([]);
  const form = useForm<BusinessCanvas>({
    defaultValues: {
      mainProblems: '',
      alternativeSolutions: '',
      keyCharacteristics: '',
      valueProposition: '',
      differentialAdvantage: '',
      customerSegments: '',
      earlyAdopters: '',
      keyActivities: '',
      keyIndicators: '',
      distributionChannels: '',
      reachStrategy: '',
      costElements: '',
      monthlyExpenses: '',
      revenueGeneration: '',
      profitMargin: '',
      teamMembers: '',
      keyRoles: '',
      socialImpact: '',
      environmentalImpact: '',
      improvementMeasures: '',
    },
  });

  const watchedData = form.watch();

  React.useEffect(() => {
    setFormData(watchedData);
  }, [watchedData]);

  React.useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoadingPersonas(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load buyer personas from user_progress
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('progress_data')
        .eq('user_id', user.id)
        .eq('phase', 'buyer-persona')
        .eq('completed', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (progressData?.progress_data) {
        const data = progressData.progress_data as any;
        const personas = data.personas || [];
        setBuyerPersonas(personas as BuyerPersona[]);
      }

      // Load company info
      const { data: companyData } = await supabase
        .from('user_progress')
        .select('progress_data')
        .eq('user_id', user.id)
        .eq('phase', 'company-info')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (companyData?.progress_data) {
        setCompanyInfo(companyData.progress_data as unknown as CompanyInfo);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoadingPersonas(false);
    }
  };

  const handleTemplateSelected = (template: Partial<BusinessCanvas>) => {
    Object.entries(template).forEach(([key, value]) => {
      form.setValue(key as keyof BusinessCanvas, value);
    });
    setShowTemplates(false);
  };

  const handleAICanvasGenerated = (canvas: Partial<BusinessCanvas>) => {
    Object.entries(canvas).forEach(([key, value]) => {
      form.setValue(key as keyof BusinessCanvas, value);
    });
    setShowAIGenerator(false);
  };

  const handleCompareScenarios = (scenarios: any[]) => {
    setScenariosToCompare(scenarios);
    setShowComparison(true);
  };

  if (showComparison) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="outline"
            onClick={() => setShowComparison(false)}
            className="mb-4"
          >
            ← Volver al Canvas
          </Button>
          <CanvasComparison scenarios={scenariosToCompare} />
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl font-bold">Modelo de Negocio Canvas</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTemplates(true)}
                disabled={loadingPersonas}
              >
                <Library className="w-4 h-4 mr-2" />
                Templates
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAIGenerator(true)}
                disabled={loadingPersonas}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generar con IA
              </Button>
            </div>
          </div>
          <p className="text-xl text-muted-foreground mb-2">
            Define tu modelo de negocio paso a paso con nuestra metodología estructurada
          </p>
          {buyerPersonas.length > 0 && (
            <Badge variant="secondary" className="mt-2">
              {buyerPersonas.length} Buyer Persona(s) detectado(s) para generación IA
            </Badge>
          )}
          <div className="max-w-md mx-auto">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Paso {currentTabIndex + 1} de {tabs.length}
            </p>
          </div>
        </div>

        <Form {...form}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-12 mb-8">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="text-xs"
                >
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>

            <Card className="min-h-[600px]">
              <CardHeader>
                <CardTitle>{tabs.find(t => t.id === activeTab)?.title}</CardTitle>
                <CardDescription>{tabs.find(t => t.id === activeTab)?.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <TabsContent value="problema" className="mt-0">
                  <ProblemaForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="solucion" className="mt-0">
                  <SolucionForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="propuesta-valor" className="mt-0">
                  <PropuestaValorForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="ventaja-diferencial" className="mt-0">
                  <VentajaDiferencialForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="segmentos-clientes" className="mt-0">
                  <SegmentosClientesForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="indicadores-clave" className="mt-0">
                  <IndicadoresClaveForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="canales" className="mt-0">
                  <CanalesForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="estructura-costes" className="mt-0">
                  <EstructuraCostesForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="sostenibilidad-financiera" className="mt-0">
                  <SostenibilidadFinancieraForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="equipo" className="mt-0">
                  <EquipoForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="impacto" className="mt-0">
                  <ImpactoForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="validation" className="mt-0">
                  <CanvasViabilityAnalysis canvas={formData as BusinessCanvas} />
                </TabsContent>

                <TabsContent value="scenarios" className="mt-0">
                  <CanvasScenariosManager
                    currentCanvas={formData}
                    onLoadScenario={(canvas) => {
                      Object.entries(canvas).forEach(([key, value]) => {
                        form.setValue(key as keyof BusinessCanvas, value);
                      });
                    }}
                    onCompareScenarios={handleCompareScenarios}
                  />
                </TabsContent>
                
                <TabsContent value="preview" className="mt-0">
                  <BusinessCanvasPreview canvas={formData as BusinessCanvas} />
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

        <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <CanvasTemplateLibrary 
              onSelectTemplate={handleTemplateSelected}
              onClose={() => setShowTemplates(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={showAIGenerator} onOpenChange={setShowAIGenerator}>
          <DialogContent className="max-w-3xl">
            <AICanvasGenerator
              buyerPersonas={buyerPersonas}
              companyInfo={companyInfo}
              onCanvasGenerated={handleAICanvasGenerated}
              onClose={() => setShowAIGenerator(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};