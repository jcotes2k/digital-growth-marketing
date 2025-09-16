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
  personas: BuyerPersona[];
}

export const BuyerPersonaPreview: React.FC<BuyerPersonaPreviewProps> = ({ personas }) => {
  const generatePDF = async () => {
    const element = document.getElementById('buyer-personas-preview');
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
      
      pdf.save(`buyer-personas-${personas.length}-personas.pdf`);
    } catch (error) {
      console.error('Error generando PDF:', error);
    }
  };

  const getSelectedChannels = (persona: BuyerPersona) => {
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

  const getPersonalityScore = (persona: BuyerPersona, trait: keyof BuyerPersona['personality']) => {
    return persona.personality?.[trait] || 5;
  };

  const renderPersonaCard = (persona: BuyerPersona, index: number) => (
    <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full mx-auto mb-3 flex items-center justify-center">
          <User className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          {persona.personaName || `Buyer Persona ${index + 1}`}
        </h2>
        <p className="text-lg text-gray-600">
          {persona.title || 'Título/Cargo'}
        </p>
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="text-center">
          <CardContent className="pt-4">
            <p className="text-sm font-medium text-gray-500">Área</p>
            <p className="text-lg font-bold">{persona.functionalArea || 'N/A'}</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-4">
            <p className="text-sm font-medium text-gray-500">Edad</p>
            <p className="text-lg font-bold">{persona.age || 'N/A'}</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-4">
            <p className="text-sm font-medium text-gray-500">Ubicación</p>
            <p className="text-lg font-bold">{persona.location || 'N/A'}</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-4">
            <p className="text-sm font-medium text-gray-500">Canales</p>
            <p className="text-lg font-bold">{getSelectedChannels(persona).length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Key Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-700">Objetivos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{persona.goals || 'No especificado'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-red-700">Dolores</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{persona.pains || 'No especificado'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              Frase Clave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm italic">"{persona.quote || 'No especificado'}"</p>
          </CardContent>
        </Card>
      </div>

      {/* Channels */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Canales Preferidos:</h4>
        <div className="flex flex-wrap gap-2">
          {getSelectedChannels(persona).map((channel) => (
            <Badge key={channel} variant="secondary" className="text-xs">
              {channel}
            </Badge>
          ))}
        </div>
      </div>

      {/* Deal Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="font-medium text-green-700">Razón de Compra:</p>
          <p className="text-xs">{persona.keyReasonToBuy || 'No especificado'}</p>
        </div>
        <div>
          <p className="font-medium text-blue-700">Deal-Maker:</p>
          <p className="text-xs">{persona.dealMaker || 'No especificado'}</p>
        </div>
        <div>
          <p className="font-medium text-red-700">Deal-Breaker:</p>
          <p className="text-xs">{persona.dealBreaker || 'No especificado'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Buyer Personas Completados</h1>
            <p className="text-muted-foreground">
              {personas.length} persona{personas.length !== 1 ? 's' : ''} creado{personas.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={generatePDF} className="gap-2">
            <Download className="h-4 w-4" />
            Descargar Todos (PDF)
          </Button>
        </div>

        <div id="buyer-personas-preview" className="space-y-8">
          {personas.map((persona, index) => renderPersonaCard(persona, index))}
        </div>
      </div>
    </div>
  );
};