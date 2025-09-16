import { useState } from "react";
import { ContentStrategy } from "@/types/content-strategy";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Target, Users, DollarSign, Calendar, MessageSquare, Palette, Share2, FileText } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ContentStrategyPreviewProps {
  data: ContentStrategy;
}

export const ContentStrategyPreview = ({ data }: ContentStrategyPreviewProps) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const element = document.getElementById('content-strategy-preview');
      if (element) {
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('l', 'mm', 'a4');
        const imgWidth = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('canvas-estrategia-contenido.pdf');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const selectedChannels = Object.entries(data.channels)
    .filter(([key, value]) => key !== 'other' && value)
    .map(([key]) => key);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Canvas de Estrategia de Contenido</h1>
            <p className="text-muted-foreground">Vista previa de tu estrategia de contenido completa</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button onClick={generatePDF} disabled={isGeneratingPDF}>
              <Download className="w-4 h-4 mr-2" />
              {isGeneratingPDF ? 'Generando...' : 'Descargar PDF'}
            </Button>
          </div>
        </div>

        <div id="content-strategy-preview" className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8 bg-white rounded-lg border-2 border-gray-200">
          {/* Row 1 */}
          <Card className="border-2 border-gray-800">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5" />
                Objetivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{data.goal}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-800">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="w-5 h-5" />
                Temas de Contenido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{data.contentTopics}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-800">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5" />
                Equipo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{data.team}</p>
            </CardContent>
          </Card>

          {/* Row 2 */}
          <Card className="border-2 border-gray-800">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Share2 className="w-5 h-5" />
                Canales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {selectedChannels.map((channel) => (
                    <Badge key={channel} variant="secondary" className="capitalize">
                      {channel}
                    </Badge>
                  ))}
                </div>
                {data.channels.other && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Otros: {data.channels.other}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-800">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5" />
                Formato de Contenido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{data.contentFormat}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-800">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="w-5 h-5" />
                Presupuesto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{data.budget}</p>
            </CardContent>
          </Card>

          {/* Row 3 */}
          <Card className="border-2 border-gray-800">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5" />
                Ritmo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{data.rhythm}</p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-2 border-gray-800">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Palette className="w-5 h-5" />
                Tono de Contenido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm mb-1 text-blue-600">SIGNIFICADO:</h4>
                  <p className="text-xs">{data.contentTone.significado}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1 text-blue-600">TERRITORIO:</h4>
                  <p className="text-xs">{data.contentTone.territorio}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1 text-blue-600">PERCEPCIÓN:</h4>
                  <p className="text-xs">{data.contentTone.percepcion}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1 text-blue-600">PERSONALIDAD:</h4>
                  <p className="text-xs">{data.contentTone.personalidad}</p>
                </div>
                <div className="col-span-2">
                  <h4 className="font-semibold text-sm mb-1 text-blue-600">VALORES y ATRIBUTOS:</h4>
                  <p className="text-xs">{data.contentTone.valoresAtributos}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};