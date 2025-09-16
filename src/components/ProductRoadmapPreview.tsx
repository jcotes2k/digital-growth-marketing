import { ProductRoadmap } from '@/types/product-roadmap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';

interface ProductRoadmapPreviewProps {
  roadmap: ProductRoadmap;
}

export const ProductRoadmapPreview = ({ roadmap }: ProductRoadmapPreviewProps) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Product Roadmap Canvas', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Helper function to add section
    const addSection = (title: string, content: string) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = margin;
      }
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(title, margin, yPosition);
      yPosition += 10;
      
      if (content.trim()) {
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const splitContent = doc.splitTextToSize(content, pageWidth - 2 * margin);
        doc.text(splitContent, margin, yPosition);
        yPosition += splitContent.length * 5 + 10;
      } else {
        yPosition += 15;
      }
    };

    // Add all sections
    addSection('¿Para quién?', roadmap.targetAudience);
    addSection('Debe tener - Funcionalidades', roadmap.mustHaveFeatures);
    addSection('Debe tener - Historias de Usuario', roadmap.userStories);
    addSection('Debería tener - Funcionalidades', roadmap.shouldHaveFeatures);
    addSection('Debería tener - Objetivos', roadmap.shortTermGoals);
    addSection('Podría tener - Funcionalidades', roadmap.couldHaveFeatures);
    addSection('Podría tener - Visión', roadmap.futureVision);
    addSection('Backlog - Ideas', roadmap.backlogFeatures);
    addSection('Backlog - Pendientes', roadmap.unclassifiedIdeas);
    addSection('Alternativas - Mercado', roadmap.marketAlternatives);
    addSection('Alternativas - Competidores', roadmap.competitorAnalysis);

    doc.save('product-roadmap.pdf');
  };

  const sections = [
    {
      title: '¿Para quién?',
      items: [
        { label: 'Perfil de Usuario Objetivo', value: roadmap.targetAudience }
      ]
    },
    {
      title: 'Debe tener',
      items: [
        { label: 'Funcionalidades Esenciales', value: roadmap.mustHaveFeatures },
        { label: 'Historias de Usuario', value: roadmap.userStories }
      ]
    },
    {
      title: 'Debería tener',
      items: [
        { label: 'Funcionalidades Importantes', value: roadmap.shouldHaveFeatures },
        { label: 'Objetivos a Corto Plazo', value: roadmap.shortTermGoals }
      ]
    },
    {
      title: 'Podría tener',
      items: [
        { label: 'Funcionalidades Futuras', value: roadmap.couldHaveFeatures },
        { label: 'Visión de Futuro', value: roadmap.futureVision }
      ]
    },
    {
      title: 'Backlog',
      items: [
        { label: 'Ideas Sin Clasificar', value: roadmap.backlogFeatures },
        { label: 'Ideas Pendientes', value: roadmap.unclassifiedIdeas }
      ]
    },
    {
      title: 'Alternativas',
      items: [
        { label: 'Alternativas del Mercado', value: roadmap.marketAlternatives },
        { label: 'Análisis de Competidores', value: roadmap.competitorAnalysis }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Vista Previa - Product Roadmap</h2>
          <p className="text-muted-foreground">Revisa tu roadmap de producto antes de generar el PDF</p>
        </div>
        <Button onClick={generatePDF} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Generar PDF
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items.map((item) => (
                <div key={item.label}>
                  <h4 className="font-semibold text-sm mb-2">{item.label}</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {item.value || 'Sin información proporcionada'}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};