import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BuyerPersona } from '@/types/buyer-persona';
import { Download, User, Target, Heart, MessageSquare } from 'lucide-react';

interface BuyerPersonaPreviewProps {
  persona: BuyerPersona;
}

export const BuyerPersonaPreview: React.FC<BuyerPersonaPreviewProps> = ({ persona }) => {
  const generatePDF = async () => {
    const element = document.getElementById('buyer-persona-preview');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
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
      
      pdf.save(`buyer-persona-${persona.personaName || 'sin-nombre'}.pdf`);
    } catch (error) {
      console.error('Error generando PDF:', error);
    }
  };

  const getSelectedChannels = () => {
    if (!persona.preferredChannels) return [];
    return Object.entries(persona.preferredChannels)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => {
        const channelNames = {
          traditionalMedia: 'Medios Tradicionales',
          onlineSocialMobile: 'Online & Social',
          emailPhone: 'Email & Teléfono',
          referrals: 'Referencias',
          faceToFacePhysical: 'Presencial'
        };
        return channelNames[key as keyof typeof channelNames];
      });
  };

  const getPersonalityScore = (trait: keyof BuyerPersona['personality']) => {
    return persona.personality?.[trait] || 5;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Vista Previa del Buyer Persona</h2>
        <Button onClick={generatePDF} className="gap-2">
          <Download className="h-4 w-4" />
          Descargar PDF
        </Button>
      </div>

      <div id="buyer-persona-preview" className="bg-white p-8 rounded-lg shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/60 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {persona.personaName || 'Nombre del Persona'}
          </h1>
          <p className="text-xl text-gray-600">
            {persona.title || 'Título/Cargo'}
          </p>
        </div>

        {/* Demographics */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Demografía
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Área Funcional:</strong> {persona.functionalArea || 'No especificado'}</p>
                <p><strong>Edad:</strong> {persona.age || 'No especificado'}</p>
                <p><strong>Ubicación:</strong> {persona.location || 'No especificado'}</p>
              </div>
              <div>
                <p><strong>Biografía:</strong></p>
                <p className="text-sm text-gray-600 mt-1">
                  {persona.bio || 'No especificado'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personality */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Personalidad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Introvertido</span>
                <Progress value={getPersonalityScore('extrovert') * 10} className="w-32" />
                <span>Extrovertido</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Pensamiento</span>
                <Progress value={getPersonalityScore('thinking') * 10} className="w-32" />
                <span>Sentimiento</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Control</span>
                <Progress value={getPersonalityScore('control') * 10} className="w-32" />
                <span>Emprendedor</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Práctico</span>
                <Progress value={getPersonalityScore('practical') * 10} className="w-32" />
                <span>Visionario</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Conservador</span>
                <Progress value={getPersonalityScore('conservative') * 10} className="w-32" />
                <span>Innovador</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motivations */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Motivaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {persona.motivations && Object.entries(persona.motivations).map(([key, value]) => (
                value && (
                  <div key={key} className="space-y-1">
                    <p className="font-medium capitalize">{key}:</p>
                    <p className="text-sm text-gray-600">{value}</p>
                  </div>
                )
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Channels */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Canales Preferidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {getSelectedChannels().map((channel) => (
                <Badge key={channel} variant="secondary">
                  {channel}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Goals, Pains, Quote */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Objetivos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{persona.goals || 'No especificado'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dolores</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{persona.pains || 'No especificado'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Frase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm italic">"{persona.quote || 'No especificado'}"</p>
            </CardContent>
          </Card>
        </div>

        {/* Key Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información Clave de Compra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="font-medium text-green-700">Razón Clave de Compra:</p>
                <p className="text-sm">{persona.keyReasonToBuy || 'No especificado'}</p>
              </div>
              <div>
                <p className="font-medium text-blue-700">Deal-Maker:</p>
                <p className="text-sm">{persona.dealMaker || 'No especificado'}</p>
              </div>
              <div>
                <p className="font-medium text-red-700">Deal-Breaker:</p>
                <p className="text-sm">{persona.dealBreaker || 'No especificado'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};