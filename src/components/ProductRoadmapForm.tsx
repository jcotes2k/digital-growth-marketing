import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TargetAudienceForm } from './roadmap-forms/TargetAudienceForm';
import { MustHaveForm } from './roadmap-forms/MustHaveForm';
import { ShouldHaveForm } from './roadmap-forms/ShouldHaveForm';
import { CouldHaveForm } from './roadmap-forms/CouldHaveForm';
import { BacklogForm } from './roadmap-forms/BacklogForm';
import { AlternativesForm } from './roadmap-forms/AlternativesForm';
import { RoadmapFeatureGenerator } from './RoadmapFeatureGenerator';
import { RoadmapPrioritizer } from './RoadmapPrioritizer';
import { RoadmapTimeline } from './RoadmapTimeline';
import { RoadmapMetricsIntegration } from './RoadmapMetricsIntegration';
import { ProductRoadmap } from '@/types/product-roadmap';
import { 
  Users, CheckSquare, ClipboardList, Lightbulb, Archive, GitBranch,
  Sparkles, ListOrdered, GanttChart, BarChart3, Download, Edit3
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

const roadmapBlocks = [
  {
    id: 'target-audience',
    title: '¿Para quién?',
    icon: Users,
    fields: [{ key: 'targetAudience' as const, label: 'Perfil de usuario objetivo' }],
    FormComponent: TargetAudienceForm,
  },
  {
    id: 'must-have',
    title: 'Debe tener',
    icon: CheckSquare,
    fields: [
      { key: 'mustHaveFeatures' as const, label: 'Funcionalidades esenciales' },
      { key: 'userStories' as const, label: 'Historias de usuario' },
    ],
    FormComponent: MustHaveForm,
  },
  {
    id: 'should-have',
    title: 'Debería tener',
    icon: ClipboardList,
    fields: [
      { key: 'shouldHaveFeatures' as const, label: 'Funcionalidades importantes' },
      { key: 'shortTermGoals' as const, label: 'Objetivos a corto plazo' },
    ],
    FormComponent: ShouldHaveForm,
  },
  {
    id: 'could-have',
    title: 'Podría tener',
    icon: Lightbulb,
    fields: [
      { key: 'couldHaveFeatures' as const, label: 'Funcionalidades futuras' },
      { key: 'futureVision' as const, label: 'Visión de futuro' },
    ],
    FormComponent: CouldHaveForm,
  },
  {
    id: 'backlog',
    title: 'Backlog',
    icon: Archive,
    fields: [
      { key: 'backlogFeatures' as const, label: 'Ideas sin clasificar' },
      { key: 'unclassifiedIdeas' as const, label: 'Pendientes de evaluar' },
    ],
    FormComponent: BacklogForm,
  },
  {
    id: 'alternatives',
    title: 'Alternativas',
    icon: GitBranch,
    fields: [
      { key: 'marketAlternatives' as const, label: 'Alternativas del mercado' },
      { key: 'competitorAnalysis' as const, label: 'Análisis de competidores' },
    ],
    FormComponent: AlternativesForm,
  },
];

type ToolId = 'generate-ai' | 'prioritize' | 'timeline' | 'metrics';

const tools: { id: ToolId; title: string; icon: React.ElementType }[] = [
  { id: 'generate-ai', title: 'Generar IA', icon: Sparkles },
  { id: 'prioritize', title: 'Priorizar', icon: ListOrdered },
  { id: 'timeline', title: 'Timeline', icon: GanttChart },
  { id: 'metrics', title: 'Métricas', icon: BarChart3 },
];

export const ProductRoadmapForm = () => {
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
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

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const handleDownloadPDF = async () => {
    const element = document.getElementById('roadmap-grid');
    if (!element) return;
    try {
      toast.info('Generando PDF...');
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('product-roadmap.pdf');
      toast.success('PDF descargado correctamente');
    } catch {
      toast.error('Error al generar el PDF');
    }
  };

  const currentBlock = roadmapBlocks.find(b => b.id === editingBlock);

  const renderToolContent = () => {
    switch (activeTool) {
      case 'generate-ai':
        return <RoadmapFeatureGenerator key={`gen-${refreshKey}`} targetAudience={form.watch('targetAudience')} onFeaturesGenerated={handleRefresh} />;
      case 'prioritize':
        return <RoadmapPrioritizer key={`pri-${refreshKey}`} onPrioritizationComplete={handleRefresh} />;
      case 'timeline':
        return <RoadmapTimeline key={`tl-${refreshKey}`} />;
      case 'metrics':
        return <RoadmapMetricsIntegration key={`met-${refreshKey}`} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-center">Product Roadmap Canvas</h1>
          <p className="text-muted-foreground text-center mb-6">
            Haz clic en cualquier bloque para editar. Usa las herramientas de IA desde la barra superior.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {tools.map(tool => {
              const Icon = tool.icon;
              return (
                <Button key={tool.id} variant="outline" size="sm" onClick={() => setActiveTool(tool.id)}>
                  <Icon className="h-4 w-4 mr-1" /> {tool.title}
                </Button>
              );
            })}
            <Button size="sm" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-1" /> Descargar PDF
            </Button>
          </div>
        </div>

        {/* Grid */}
        <Form {...form}>
          <div id="roadmap-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roadmapBlocks.map(block => {
              const Icon = block.icon;
              const hasContent = block.fields.some(f => watchedData[f.key]?.trim());
              return (
                <Card
                  key={block.id}
                  className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${hasContent ? 'border-primary/30' : ''}`}
                  onClick={() => setEditingBlock(block.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        {block.title}
                      </span>
                      <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {block.fields.map(field => {
                      const val = watchedData[field.key];
                      return (
                        <div key={field.key} className="mb-2">
                          <p className="text-xs font-medium text-muted-foreground">{field.label}</p>
                          <p className="text-sm line-clamp-3 whitespace-pre-wrap">
                            {val?.trim() || <span className="italic text-muted-foreground/60">No especificado</span>}
                          </p>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Edit modal */}
          <Dialog open={!!editingBlock} onOpenChange={open => !open && setEditingBlock(null)}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {currentBlock && <currentBlock.icon className="h-5 w-5 text-primary" />}
                  {currentBlock?.title}
                </DialogTitle>
              </DialogHeader>
              {currentBlock && <currentBlock.FormComponent control={form.control} />}
            </DialogContent>
          </Dialog>
        </Form>

        {/* Tool modal */}
        <Dialog open={!!activeTool} onOpenChange={open => !open && setActiveTool(null)}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{tools.find(t => t.id === activeTool)?.title}</DialogTitle>
            </DialogHeader>
            {renderToolContent()}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
