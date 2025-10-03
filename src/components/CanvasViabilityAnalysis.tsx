import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { BusinessCanvas } from '@/types/business-canvas';
import { CheckCircle2, AlertTriangle, AlertCircle, TrendingUp, Loader2, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CanvasViabilityAnalysisProps {
  canvas: Partial<BusinessCanvas>;
}

interface ValidationResult {
  viabilityScore: number;
  overallAssessment: string;
  strengths: Array<{ title: string; description: string }>;
  weaknesses: Array<{ title: string; description: string; suggestion: string }>;
  risks: Array<{ title: string; severity: 'low' | 'medium' | 'high'; mitigation: string }>;
  opportunities: Array<{ title: string; description: string; impact: 'low' | 'medium' | 'high' }>;
  recommendations: string[];
}

export const CanvasViabilityAnalysis: React.FC<CanvasViabilityAnalysisProps> = ({ canvas }) => {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('canvas-validator', {
        body: { canvas }
      });

      if (error) throw error;

      setValidation(data.validation);
      toast({
        title: '✅ Análisis Completado',
        description: `Score de viabilidad: ${data.validation.viabilityScore}/10`,
      });
    } catch (err) {
      console.error('Error analyzing canvas:', err);
      toast({
        title: 'Error',
        description: 'No se pudo analizar el canvas',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors] || colors.medium;
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-purple-100 text-purple-800'
    };
    return colors[impact as keyof typeof colors] || colors.medium;
  };

  if (!validation) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <CardTitle>Validación de Viabilidad con IA</CardTitle>
          </div>
          <CardDescription>
            Obtén un análisis profesional de tu Business Canvas con recomendaciones de mejora
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              La IA analizará tu canvas evaluando coherencia, realismo, impacto social, sostenibilidad financiera y más.
            </AlertDescription>
          </Alert>
          <Button onClick={handleAnalyze} disabled={loading} className="w-full mt-4">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analizando Canvas...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Analizar Viabilidad
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Score de Viabilidad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`text-6xl font-bold ${getScoreColor(validation.viabilityScore)}`}>
              {validation.viabilityScore}
              <span className="text-2xl">/10</span>
            </div>
            <div className="flex-1">
              <Progress value={validation.viabilityScore * 10} className="h-4 mb-2" />
              <p className="text-sm text-muted-foreground">{validation.overallAssessment}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg">Fortalezas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {validation.strengths.map((strength, idx) => (
                <li key={idx} className="border-l-4 border-green-500 pl-3">
                  <p className="font-semibold">{strength.title}</p>
                  <p className="text-sm text-muted-foreground">{strength.description}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <CardTitle className="text-lg">Debilidades</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {validation.weaknesses.map((weakness, idx) => (
                <li key={idx} className="border-l-4 border-yellow-500 pl-3">
                  <p className="font-semibold">{weakness.title}</p>
                  <p className="text-sm text-muted-foreground mb-1">{weakness.description}</p>
                  <p className="text-sm text-primary">💡 {weakness.suggestion}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <CardTitle className="text-lg">Riesgos</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {validation.risks.map((risk, idx) => (
                <li key={idx} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Badge className={getSeverityBadge(risk.severity)} variant="secondary">
                      {risk.severity}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-semibold">{risk.title}</p>
                      <p className="text-sm text-muted-foreground">🛡️ {risk.mitigation}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-lg">Oportunidades</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {validation.opportunities.map((opportunity, idx) => (
                <li key={idx} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Badge className={getImpactBadge(opportunity.impact)} variant="secondary">
                      {opportunity.impact}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-semibold">{opportunity.title}</p>
                      <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Recomendaciones Prioritarias</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {validation.recommendations.map((rec, idx) => (
              <li key={idx} className="flex gap-3">
                <Badge variant="secondary">{idx + 1}</Badge>
                <p className="flex-1">{rec}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Button onClick={handleAnalyze} disabled={loading} variant="outline" className="w-full">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Re-analizando...
          </>
        ) : (
          'Re-analizar Canvas'
        )}
      </Button>
    </div>
  );
};