import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Library, Download, ShieldCheck, GitCompare, Pencil } from 'lucide-react';
import { CanvasTemplateLibrary } from './CanvasTemplateLibrary';
import { AICanvasGenerator } from './AICanvasGenerator';
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
import { BusinessCanvas } from '@/types/business-canvas';
import { CanvasViabilityAnalysis } from './CanvasViabilityAnalysis';
import { CanvasScenariosManager } from './CanvasScenariosManager';
import { CanvasComparison } from './CanvasComparison';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CanvasBlock {
  id: string;
  title: string;
  fields: { key: keyof BusinessCanvas; label: string }[];
  component: 'problema' | 'solucion' | 'propuesta-valor' | 'ventaja-diferencial' | 'segmentos-clientes' | 'indicadores-clave' | 'canales' | 'estructura-costes' | 'sostenibilidad-financiera' | 'equipo' | 'impacto';
}

const canvasBlocks: CanvasBlock[] = [
  { id: 'problema', title: 'Problema', component: 'problema', fields: [{ key: 'mainProblems', label: 'Problemas Principales' }, { key: 'alternativeSolutions', label: 'Soluciones Alternativas' }] },
  { id: 'solucion', title: 'Solución', component: 'solucion', fields: [{ key: 'keyCharacteristics', label: 'Características Clave' }] },
  { id: 'propuesta-valor', title: 'Propuesta de Valor', component: 'propuesta-valor', fields: [{ key: 'valueProposition', label: 'Propuesta de Valor' }] },
  { id: 'ventaja-diferencial', title: 'Ventaja Diferencial', component: 'ventaja-diferencial', fields: [{ key: 'differentialAdvantage', label: 'Ventaja Diferencial' }] },
  { id: 'segmentos-clientes', title: 'Segmentos de Clientes', component: 'segmentos-clientes', fields: [{ key: 'customerSegments', label: 'Segmentos' }, { key: 'earlyAdopters', label: 'Early Adopters' }] },
  { id: 'indicadores-clave', title: 'Indicadores Clave', component: 'indicadores-clave', fields: [{ key: 'keyActivities', label: 'Actividades' }, { key: 'keyIndicators', label: 'Indicadores' }] },
  { id: 'canales', title: 'Canales', component: 'canales', fields: [{ key: 'distributionChannels', label: 'Distribución' }, { key: 'reachStrategy', label: 'Estrategia' }] },
  { id: 'estructura-costes', title: 'Estructura de Costes', component: 'estructura-costes', fields: [{ key: 'costElements', label: 'Elementos de Costo' }, { key: 'monthlyExpenses', label: 'Gastos Mensuales' }] },
  { id: 'sostenibilidad-financiera', title: 'Sostenibilidad Financiera', component: 'sostenibilidad-financiera', fields: [{ key: 'revenueGeneration', label: 'Ingresos' }, { key: 'profitMargin', label: 'Margen' }] },
  { id: 'equipo', title: 'Equipo', component: 'equipo', fields: [{ key: 'teamMembers', label: 'Miembros' }, { key: 'keyRoles', label: 'Roles Clave' }] },
  { id: 'impacto', title: 'Impacto', component: 'impacto', fields: [{ key: 'socialImpact', label: 'Social' }, { key: 'environmentalImpact', label: 'Medioambiental' }, { key: 'improvementMeasures', label: 'Mejoras' }] },
];

export const BusinessCanvasForm = () => {
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BusinessCanvas>>({});
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showScenarios, setShowScenarios] = useState(false);
  const [buyerPersonas, setBuyerPersonas] = useState<BuyerPersona[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loadingPersonas, setLoadingPersonas] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [scenariosToCompare, setScenariosToCompare] = useState<any[]>([]);

  const form = useForm<BusinessCanvas>({
    defaultValues: {
      mainProblems: '', alternativeSolutions: '', keyCharacteristics: '',
      valueProposition: '', differentialAdvantage: '', customerSegments: '',
      earlyAdopters: '', keyActivities: '', keyIndicators: '',
      distributionChannels: '', reachStrategy: '', costElements: '',
      monthlyExpenses: '', revenueGeneration: '', profitMargin: '',
      teamMembers: '', keyRoles: '', socialImpact: '',
      environmentalImpact: '', improvementMeasures: '',
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
        setBuyerPersonas((data.personas || []) as BuyerPersona[]);
      }

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

  const generatePDF = async () => {
    const element = document.getElementById('canvas-grid');
    if (!element) return;
    const canvas_html = await html2canvas(element, { scale: 2, useCORS: true, allowTaint: true });
    const imgData = canvas_html.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');
    const imgWidth = 297;
    const imgHeight = (canvas_html.height * imgWidth) / canvas_html.width;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('modelo-negocio-canvas.pdf');
  };

  const renderBlockForm = (blockId: string) => {
    const control = form.control;
    switch (blockId) {
      case 'problema': return <ProblemaForm control={control} />;
      case 'solucion': return <SolucionForm control={control} />;
      case 'propuesta-valor': return <PropuestaValorForm control={control} />;
      case 'ventaja-diferencial': return <VentajaDiferencialForm control={control} />;
      case 'segmentos-clientes': return <SegmentosClientesForm control={control} />;
      case 'indicadores-clave': return <IndicadoresClaveForm control={control} />;
      case 'canales': return <CanalesForm control={control} />;
      case 'estructura-costes': return <EstructuraCostesForm control={control} />;
      case 'sostenibilidad-financiera': return <SostenibilidadFinancieraForm control={control} />;
      case 'equipo': return <EquipoForm control={control} />;
      case 'impacto': return <ImpactoForm control={control} />;
      default: return null;
    }
  };

  const getBlockPreview = (block: CanvasBlock) => {
    return block.fields.map((field) => {
      const value = watchedData[field.key];
      return (
        <div key={field.key} className="mb-1.5">
          <p className="text-xs font-medium text-muted-foreground">{field.label}:</p>
          <p className="text-sm line-clamp-2">{value || 'No especificado'}</p>
        </div>
      );
    });
  };

  const editingBlockData = canvasBlocks.find(b => b.id === editingBlock);

  if (showComparison) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="outline" onClick={() => setShowComparison(false)} className="mb-4">
            ← Volver al Canvas
          </Button>
          <CanvasComparison scenarios={scenariosToCompare} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
            <div>
              <h1 className="text-3xl font-bold">Modelo de Negocio Canvas</h1>
              <p className="text-muted-foreground mt-1">Haz clic en cualquier bloque para editarlo</p>
              {buyerPersonas.length > 0 && (
                <Badge variant="secondary" className="mt-2">
                  {buyerPersonas.length} Buyer Persona(s) detectado(s)
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowTemplates(true)} disabled={loadingPersonas}>
                <Library className="w-4 h-4 mr-2" />Templates
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowAIGenerator(true)} disabled={loadingPersonas}>
                <Sparkles className="w-4 h-4 mr-2" />Generar con IA
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowValidation(true)}>
                <ShieldCheck className="w-4 h-4 mr-2" />Validación
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowScenarios(true)}>
                <GitCompare className="w-4 h-4 mr-2" />Escenarios
              </Button>
              <Button size="sm" onClick={generatePDF}>
                <Download className="w-4 h-4 mr-2" />Descargar PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas Grid */}
        <Form {...form}>
          <div id="canvas-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {canvasBlocks.map((block) => {
              const hasContent = block.fields.some(f => !!watchedData[f.key]);
              return (
                <Card
                  key={block.id}
                  className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/50 group ${hasContent ? 'border-primary/30 bg-primary/5' : ''}`}
                  onClick={() => setEditingBlock(block.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{block.title}</CardTitle>
                      <Pencil className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {getBlockPreview(block)}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Edit Modal */}
          <Dialog open={!!editingBlock} onOpenChange={(open) => !open && setEditingBlock(null)}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingBlockData?.title}</DialogTitle>
                <DialogDescription>Completa o edita la información de esta sección</DialogDescription>
              </DialogHeader>
              {editingBlock && renderBlockForm(editingBlock)}
            </DialogContent>
          </Dialog>
        </Form>

        {/* Templates Dialog */}
        <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <CanvasTemplateLibrary onSelectTemplate={handleTemplateSelected} onClose={() => setShowTemplates(false)} />
          </DialogContent>
        </Dialog>

        {/* AI Generator Dialog */}
        <Dialog open={showAIGenerator} onOpenChange={setShowAIGenerator}>
          <DialogContent className="max-w-3xl">
            <AICanvasGenerator buyerPersonas={buyerPersonas} companyInfo={companyInfo} onCanvasGenerated={handleAICanvasGenerated} onClose={() => setShowAIGenerator(false)} />
          </DialogContent>
        </Dialog>

        {/* Validation Dialog */}
        <Dialog open={showValidation} onOpenChange={setShowValidation}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Análisis de Viabilidad</DialogTitle>
              <DialogDescription>Validación de tu modelo de negocio con IA</DialogDescription>
            </DialogHeader>
            <CanvasViabilityAnalysis canvas={formData as BusinessCanvas} />
          </DialogContent>
        </Dialog>

        {/* Scenarios Dialog */}
        <Dialog open={showScenarios} onOpenChange={setShowScenarios}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Gestión de Escenarios</DialogTitle>
              <DialogDescription>Guarda y compara diferentes versiones de tu canvas</DialogDescription>
            </DialogHeader>
            <CanvasScenariosManager
              currentCanvas={formData}
              onLoadScenario={(canvas) => {
                Object.entries(canvas).forEach(([key, value]) => {
                  form.setValue(key as keyof BusinessCanvas, value);
                });
              }}
              onCompareScenarios={handleCompareScenarios}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
