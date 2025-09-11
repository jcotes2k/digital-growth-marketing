import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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
  { id: 'preview', title: 'Vista Previa', description: 'Revisa tu modelo de negocio' },
];

export const BusinessCanvasForm = () => {
  const [activeTab, setActiveTab] = useState('problema');
  const [formData, setFormData] = useState<Partial<BusinessCanvas>>({});
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
          <h1 className="text-4xl font-bold mb-4">Modelo de Negocio Canvas</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Define tu modelo de negocio paso a paso con nuestra metodología estructurada
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
      </div>
    </div>
  );
};