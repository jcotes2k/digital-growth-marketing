import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FileText, Download, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function ReportsAndROIForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // ROI Calculator State
  const [investment, setInvestment] = useState('');
  const [revenue, setRevenue] = useState('');
  const [roi, setROI] = useState<number | null>(null);

  const calculateROI = () => {
    const inv = parseFloat(investment);
    const rev = parseFloat(revenue);

    if (isNaN(inv) || isNaN(rev) || inv === 0) {
      toast({
        title: "Error",
        description: "Por favor ingresa valores válidos",
        variant: "destructive",
      });
      return;
    }

    const calculatedROI = ((rev - inv) / inv) * 100;
    setROI(calculatedROI);
  };

  const generatePDFReport = () => {
    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(22);
      doc.text('Reporte de Marketing Digital', 20, 20);
      
      // Date
      doc.setFontSize(12);
      doc.text(`Generado: ${new Date().toLocaleDateString()}`, 20, 30);
      
      // Section: Resumen Ejecutivo
      doc.setFontSize(16);
      doc.text('Resumen Ejecutivo', 20, 45);
      doc.setFontSize(11);
      doc.text('Este reporte contiene un análisis completo de las métricas', 20, 55);
      doc.text('de marketing digital del período seleccionado.', 20, 62);
      
      // Section: Métricas Clave
      doc.setFontSize(16);
      doc.text('Métricas Clave', 20, 80);
      doc.setFontSize(11);
      doc.text('• Total Posts: 134', 20, 90);
      doc.text('• Alcance Total: 260,149 personas', 20, 97);
      doc.text('• Engagement Total: 47,582 interacciones', 20, 104);
      doc.text('• Tasa de Engagement Promedio: 4.2%', 20, 111);
      
      // Section: Plataformas
      doc.setFontSize(16);
      doc.text('Rendimiento por Plataforma', 20, 130);
      doc.setFontSize(11);
      doc.text('Facebook: 8,547 interacciones | 45,230 alcance', 20, 140);
      doc.text('Instagram: 12,350 interacciones | 67,890 alcance', 20, 147);
      doc.text('Twitter: 6,234 interacciones | 34,567 alcance', 20, 154);
      doc.text('LinkedIn: 4,567 interacciones | 23,450 alcance', 20, 161);
      doc.text('TikTok: 15,678 interacciones | 89,012 alcance', 20, 168);
      
      // Section: ROI
      if (roi !== null) {
        doc.setFontSize(16);
        doc.text('Cálculo de ROI', 20, 185);
        doc.setFontSize(11);
        doc.text(`Inversión: $${investment}`, 20, 195);
        doc.text(`Retorno: $${revenue}`, 20, 202);
        doc.text(`ROI: ${roi.toFixed(2)}%`, 20, 209);
      }
      
      // Section: Recomendaciones
      doc.setFontSize(16);
      doc.text('Recomendaciones', 20, 230);
      doc.setFontSize(11);
      doc.text('1. Aumentar frecuencia de publicación en TikTok', 20, 240);
      doc.text('2. Mejorar engagement en Twitter con contenido interactivo', 20, 247);
      doc.text('3. Optimizar horarios de publicación en Instagram', 20, 254);
      
      // Footer
      doc.setFontSize(9);
      doc.text('Reporte generado automáticamente por el sistema', 20, 280);
      
      doc.save('reporte-marketing-digital.pdf');
      
      toast({
        title: "¡Reporte generado!",
        description: "El PDF se ha descargado exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el reporte",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Reportes y Análisis ROI</h1>
          <p className="text-muted-foreground">Genera reportes PDF y calcula el retorno de inversión</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* PDF Report Generator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generador de Reportes PDF
              </CardTitle>
              <CardDescription>
                Exporta estrategias y análisis completos en formato PDF
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h4 className="font-semibold">El reporte incluye:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Resumen ejecutivo de métricas</li>
                  <li>Rendimiento por plataforma</li>
                  <li>Análisis de engagement y alcance</li>
                  <li>Comparativas de posts</li>
                  <li>Cálculo de ROI (si está disponible)</li>
                  <li>Recomendaciones estratégicas</li>
                </ul>
              </div>

              <Button
                onClick={generatePDFReport}
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                <Download className="mr-2 h-5 w-5" />
                {isGenerating ? 'Generando...' : 'Generar Reporte PDF'}
              </Button>
            </CardContent>
          </Card>

          {/* ROI Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Calculadora de ROI
              </CardTitle>
              <CardDescription>
                Calcula el retorno de inversión de tus campañas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="investment">Inversión Total ($)</Label>
                  <Input
                    id="investment"
                    type="number"
                    value={investment}
                    onChange={(e) => setInvestment(e.target.value)}
                    placeholder="5000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revenue">Retorno Generado ($)</Label>
                  <Input
                    id="revenue"
                    type="number"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    placeholder="15000"
                  />
                </div>

                <Button onClick={calculateROI} className="w-full">
                  Calcular ROI
                </Button>
              </div>

              {roi !== null && (
                <div className={`p-6 rounded-lg text-center ${roi >= 0 ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
                  <div className="flex justify-center mb-2">
                    {roi >= 0 ? (
                      <TrendingUp className="h-12 w-12 text-green-600" />
                    ) : (
                      <TrendingDown className="h-12 w-12 text-red-600" />
                    )}
                  </div>
                  <h3 className="text-4xl font-bold mb-2">
                    {roi.toFixed(2)}%
                  </h3>
                  <p className={roi >= 0 ? 'text-green-700' : 'text-red-700'}>
                    {roi >= 0 ? 'Retorno positivo' : 'Retorno negativo'}
                  </p>
                  <div className="mt-4 text-sm">
                    <p className={roi >= 0 ? 'text-green-600' : 'text-red-600'}>
                      Ganancia/Pérdida: ${(parseFloat(revenue) - parseFloat(investment)).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-sm">¿Cómo interpretar el ROI?</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• ROI positivo: La campaña generó más ingresos que inversión</li>
                  <li>• ROI de 100%: Duplicaste tu inversión</li>
                  <li>• ROI negativo: La campaña no recuperó la inversión</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Métricas para el Reporte</CardTitle>
            <CardDescription>Datos que se incluirán en el próximo reporte PDF</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Total Posts</p>
                <p className="text-2xl font-bold">134</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Alcance Total</p>
                <p className="text-2xl font-bold">260K</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Engagement</p>
                <p className="text-2xl font-bold">47.5K</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Tasa Promedio</p>
                <p className="text-2xl font-bold">4.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}