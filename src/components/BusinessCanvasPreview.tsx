import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { BusinessCanvas } from '@/types/business-canvas';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface BusinessCanvasPreviewProps {
  canvas: BusinessCanvas;
}

export const BusinessCanvasPreview = ({ canvas }: BusinessCanvasPreviewProps) => {
  const generatePDF = async () => {
    const element = document.getElementById('canvas-preview');
    if (!element) return;

    const canvas_html = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas_html.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas_html.height * imgWidth) / canvas_html.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('modelo-negocio-canvas.pdf');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Vista Previa del Modelo de Negocio</h3>
        <Button onClick={generatePDF} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Descargar PDF
        </Button>
      </div>

      <div id="canvas-preview" className="bg-white p-8 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Problema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm text-muted-foreground">Problemas Principales:</p>
                  <p className="text-sm">{canvas.mainProblems || 'No especificado'}</p>
                </div>
                <div>
                  <p className="font-medium text-sm text-muted-foreground">Soluciones Alternativas:</p>
                  <p className="text-sm">{canvas.alternativeSolutions || 'No especificado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Solución</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{canvas.keyCharacteristics || 'No especificado'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Propuesta de Valor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{canvas.valueProposition || 'No especificado'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ventaja Diferencial</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{canvas.differentialAdvantage || 'No especificado'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Segmentos de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm text-muted-foreground">Segmentos:</p>
                  <p className="text-sm">{canvas.customerSegments || 'No especificado'}</p>
                </div>
                <div>
                  <p className="font-medium text-sm text-muted-foreground">Early Adopters:</p>
                  <p className="text-sm">{canvas.earlyAdopters || 'No especificado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Indicadores Clave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm text-muted-foreground">Actividades:</p>
                  <p className="text-sm">{canvas.keyActivities || 'No especificado'}</p>
                </div>
                <div>
                  <p className="font-medium text-sm text-muted-foreground">Indicadores:</p>
                  <p className="text-sm">{canvas.keyIndicators || 'No especificado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Canales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm text-muted-foreground">Distribución:</p>
                  <p className="text-sm">{canvas.distributionChannels || 'No especificado'}</p>
                </div>
                <div>
                  <p className="font-medium text-sm text-muted-foreground">Estrategia:</p>
                  <p className="text-sm">{canvas.reachStrategy || 'No especificado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estructura de Costes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm text-muted-foreground">Elementos de Costo:</p>
                  <p className="text-sm">{canvas.costElements || 'No especificado'}</p>
                </div>
                <div>
                  <p className="font-medium text-sm text-muted-foreground">Gastos Mensuales:</p>
                  <p className="text-sm">{canvas.monthlyExpenses || 'No especificado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sostenibilidad Financiera</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm text-muted-foreground">Ingresos:</p>
                  <p className="text-sm">{canvas.revenueGeneration || 'No especificado'}</p>
                </div>
                <div>
                  <p className="font-medium text-sm text-muted-foreground">Margen:</p>
                  <p className="text-sm">{canvas.profitMargin || 'No especificado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Equipo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm text-muted-foreground">Miembros:</p>
                  <p className="text-sm">{canvas.teamMembers || 'No especificado'}</p>
                </div>
                <div>
                  <p className="font-medium text-sm text-muted-foreground">Roles Clave:</p>
                  <p className="text-sm">{canvas.keyRoles || 'No especificado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Impacto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm text-muted-foreground">Social:</p>
                  <p className="text-sm">{canvas.socialImpact || 'No especificado'}</p>
                </div>
                <div>
                  <p className="font-medium text-sm text-muted-foreground">Medioambiental:</p>
                  <p className="text-sm">{canvas.environmentalImpact || 'No especificado'}</p>
                </div>
                <div>
                  <p className="font-medium text-sm text-muted-foreground">Mejoras:</p>
                  <p className="text-sm">{canvas.improvementMeasures || 'No especificado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};