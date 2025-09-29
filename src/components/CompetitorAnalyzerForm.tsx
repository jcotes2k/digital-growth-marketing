import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, TrendingUp, Target, Shield, AlertTriangle, Lightbulb, Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CompetitorAnalysisResult {
  industryOverview: string;
  competitors: Array<{
    name: string;
    strengths: string[];
    weaknesses: string[];
    pricing?: string;
    positioning?: string;
  }>;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  marketGaps: string[];
  competitiveAdvantages: string[];
  threats: string[];
  recommendations: string[];
}

export const CompetitorAnalyzerForm = () => {
  const [formData, setFormData] = useState({
    industry: '',
    businessDescription: '',
    targetMarket: '',
    competitorUrls: '',
    analysisDepth: 'detailed' as 'basic' | 'detailed' | 'comprehensive'
  });
  const [analysis, setAnalysis] = useState<CompetitorAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateAnalysis = async () => {
    if (!formData.industry || !formData.businessDescription || !formData.targetMarket) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const competitorUrls = formData.competitorUrls 
        ? formData.competitorUrls.split('\n').filter(url => url.trim())
        : [];

      const { data, error } = await supabase.functions.invoke('competitor-analyzer', {
        body: {
          industry: formData.industry,
          businessDescription: formData.businessDescription,
          targetMarket: formData.targetMarket,
          competitorUrls,
          analysisDepth: formData.analysisDepth
        }
      });

      if (error) throw error;

      // Parse the AI response
      try {
        const parsedAnalysis = JSON.parse(data.analysis);
        setAnalysis(parsedAnalysis);
        toast({
          title: "Análisis completado",
          description: "El análisis competitivo ha sido generado exitosamente"
        });
      } catch {
        // If JSON parsing fails, create a structured response from the text
        setAnalysis({
          industryOverview: data.analysis,
          competitors: [],
          swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
          marketGaps: [],
          competitiveAdvantages: [],
          threats: [],
          recommendations: []
        });
      }
    } catch (error) {
      console.error('Error generating analysis:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el análisis. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!analysis) return;
    
    const text = `ANÁLISIS COMPETITIVO

PANORAMA DE LA INDUSTRIA:
${analysis.industryOverview}

COMPETIDORES PRINCIPALES:
${analysis.competitors.map(comp => `
• ${comp.name}
  Fortalezas: ${comp.strengths.join(', ')}
  Debilidades: ${comp.weaknesses.join(', ')}
`).join('')}

ANÁLISIS SWOT:
Fortalezas: ${analysis.swot.strengths.join(', ')}
Debilidades: ${analysis.swot.weaknesses.join(', ')}
Oportunidades: ${analysis.swot.opportunities.join(', ')}
Amenazas: ${analysis.swot.threats.join(', ')}

BRECHAS DE MERCADO:
${analysis.marketGaps.map(gap => `• ${gap}`).join('\n')}

VENTAJAS COMPETITIVAS:
${analysis.competitiveAdvantages.map(advantage => `• ${advantage}`).join('\n')}

RECOMENDACIONES:
${analysis.recommendations.map(rec => `• ${rec}`).join('\n')}`;

    await navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "Análisis copiado al portapapeles"
    });
  };

  const downloadAnalysis = () => {
    if (!analysis) return;
    
    const text = `ANÁLISIS COMPETITIVO - ${new Date().toLocaleDateString()}

INFORMACIÓN DEL NEGOCIO:
- Industria: ${formData.industry}
- Descripción: ${formData.businessDescription}
- Mercado objetivo: ${formData.targetMarket}

PANORAMA DE LA INDUSTRIA:
${analysis.industryOverview}

COMPETIDORES PRINCIPALES:
${analysis.competitors.map(comp => `
${comp.name}
- Fortalezas: ${comp.strengths.join(', ')}
- Debilidades: ${comp.weaknesses.join(', ')}
${comp.pricing ? `- Precios: ${comp.pricing}` : ''}
${comp.positioning ? `- Posicionamiento: ${comp.positioning}` : ''}
`).join('')}

ANÁLISIS SWOT:
Fortalezas: ${analysis.swot.strengths.join(', ')}
Debilidades: ${analysis.swot.weaknesses.join(', ')}
Oportunidades: ${analysis.swot.opportunities.join(', ')}
Amenazas: ${analysis.swot.threats.join(', ')}

BRECHAS DE MERCADO:
${analysis.marketGaps.map(gap => `• ${gap}`).join('\n')}

VENTAJAS COMPETITIVAS POTENCIALES:
${analysis.competitiveAdvantages.map(advantage => `• ${advantage}`).join('\n')}

AMENAZAS COMPETITIVAS:
${analysis.threats.map(threat => `• ${threat}`).join('\n')}

RECOMENDACIONES ESTRATÉGICAS:
${analysis.recommendations.map(rec => `• ${rec}`).join('\n')}

---
Análisis generado el ${new Date().toLocaleString()}`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analisis-competitivo-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-6 w-6" />
            Análisis Competitivo con IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industria *</Label>
              <Input
                id="industry"
                placeholder="ej. SaaS, E-commerce, Fintech..."
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetMarket">Mercado Objetivo *</Label>
              <Input
                id="targetMarket"
                placeholder="ej. Pequeñas empresas, millennials, profesionales..."
                value={formData.targetMarket}
                onChange={(e) => handleInputChange('targetMarket', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessDescription">Descripción del Negocio *</Label>
            <Textarea
              id="businessDescription"
              placeholder="Describe tu negocio, productos/servicios, propuesta de valor..."
              value={formData.businessDescription}
              onChange={(e) => handleInputChange('businessDescription', e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="competitorUrls">URLs de Competidores (opcional)</Label>
            <Textarea
              id="competitorUrls"
              placeholder="Una URL por línea&#10;https://competitor1.com&#10;https://competitor2.com"
              value={formData.competitorUrls}
              onChange={(e) => handleInputChange('competitorUrls', e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="analysisDepth">Profundidad del Análisis</Label>
            <Select value={formData.analysisDepth} onValueChange={(value) => handleInputChange('analysisDepth', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Básico - Vista general rápida</SelectItem>
                <SelectItem value="detailed">Detallado - Análisis completo</SelectItem>
                <SelectItem value="comprehensive">Exhaustivo - Análisis profundo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={generateAnalysis} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Analizando...' : 'Generar Análisis Competitivo'}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Resultados del Análisis
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadAnalysis}>
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-6">
                  {/* Industry Overview */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Panorama de la Industria
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{analysis.industryOverview}</p>
                  </div>

                  <Separator />

                  {/* Competitors */}
                  {analysis.competitors.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Competidores Principales</h3>
                      <div className="grid gap-4">
                        {analysis.competitors.map((competitor, index) => (
                          <Card key={index} className="border-l-4 border-l-blue-500">
                            <CardContent className="pt-4">
                              <h4 className="font-semibold mb-2">{competitor.name}</h4>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-green-600 mb-1">Fortalezas:</p>
                                  <ul className="text-sm text-muted-foreground space-y-1">
                                    {competitor.strengths.map((strength, i) => (
                                      <li key={i}>• {strength}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-red-600 mb-1">Debilidades:</p>
                                  <ul className="text-sm text-muted-foreground space-y-1">
                                    {competitor.weaknesses.map((weakness, i) => (
                                      <li key={i}>• {weakness}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* SWOT Analysis */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Análisis SWOT del Mercado
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="border-green-200 bg-green-50">
                        <CardContent className="pt-4">
                          <h4 className="font-semibold text-green-700 mb-2">Fortalezas</h4>
                          <div className="space-y-1">
                            {analysis.swot.strengths.map((item, i) => (
                              <Badge key={i} variant="secondary" className="mr-1 mb-1">{item}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-red-200 bg-red-50">
                        <CardContent className="pt-4">
                          <h4 className="font-semibold text-red-700 mb-2">Debilidades</h4>
                          <div className="space-y-1">
                            {analysis.swot.weaknesses.map((item, i) => (
                              <Badge key={i} variant="secondary" className="mr-1 mb-1">{item}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="pt-4">
                          <h4 className="font-semibold text-blue-700 mb-2">Oportunidades</h4>
                          <div className="space-y-1">
                            {analysis.swot.opportunities.map((item, i) => (
                              <Badge key={i} variant="secondary" className="mr-1 mb-1">{item}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-yellow-200 bg-yellow-50">
                        <CardContent className="pt-4">
                          <h4 className="font-semibold text-yellow-700 mb-2">Amenazas</h4>
                          <div className="space-y-1">
                            {analysis.swot.threats.map((item, i) => (
                              <Badge key={i} variant="secondary" className="mr-1 mb-1">{item}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Separator />

                  {/* Market Gaps & Opportunities */}
                  {analysis.marketGaps.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        Brechas de Mercado
                      </h3>
                      <ul className="space-y-2">
                        {analysis.marketGaps.map((gap, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span className="text-muted-foreground">{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Separator />

                  {/* Competitive Advantages */}
                  {analysis.competitiveAdvantages.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Ventajas Competitivas Potenciales
                      </h3>
                      <ul className="space-y-2">
                        {analysis.competitiveAdvantages.map((advantage, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span className="text-muted-foreground">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Separator />

                  {/* Threats */}
                  {analysis.threats.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Amenazas Competitivas
                      </h3>
                      <ul className="space-y-2">
                        {analysis.threats.map((threat, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span className="text-muted-foreground">{threat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Separator />

                  {/* Recommendations */}
                  {analysis.recommendations.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Recomendaciones Estratégicas
                      </h3>
                      <ul className="space-y-2">
                        {analysis.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            <span className="text-muted-foreground">{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};