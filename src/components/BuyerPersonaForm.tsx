import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DemographicsForm } from './forms/DemographicsForm';
import { PersonalityForm } from './forms/PersonalityForm';
import { MotivationsForm } from './forms/MotivationsForm';
import { ChannelsForm } from './forms/ChannelsForm';
import { BusinessForm } from './forms/BusinessForm';
import { BeliefsForm } from './forms/BeliefsForm';
import { InfluencesForm } from './forms/InfluencesForm';
import { ContentForm } from './forms/ContentForm';
import { BuyerPersonaPreview } from './BuyerPersonaPreview';
import { PersonaCountSelector } from './buyer-persona/PersonaCountSelector';
import { BuyerPersona } from '@/types/buyer-persona';
import { BuyerPersonaCollection } from '@/types/buyer-persona-collection';
import { CompanyInfo } from '@/types/company-info';
import { CompanyInfoForm } from './CompanyInfoForm';
import { ChevronLeft, ChevronRight, Users, Eye, Sparkles, Library } from 'lucide-react';
import { ArchetypeLibrary } from './ArchetypeLibrary';
import { AIPersonaAssistant } from './AIPersonaAssistant';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const tabs = [
  { id: 'demographics', title: 'Demografía', description: 'Información básica del persona' },
  { id: 'personality', title: 'Personalidad', description: 'Rasgos de personalidad' },
  { id: 'motivations', title: 'Motivaciones', description: 'Qué lo motiva y qué lo frena' },
  { id: 'channels', title: 'Canales', description: 'Canales de comunicación preferidos' },
  { id: 'business', title: 'Objetivos', description: 'Objetivos profesionales y de negocio' },
  { id: 'beliefs', title: 'Creencias', description: 'Creencias y comportamientos' },
  { id: 'influences', title: 'Influencias', description: 'Participantes en el proceso de compra' },
  { id: 'content', title: 'Contenido', description: 'Información y contenido preferido' },
  { id: 'preview', title: 'Vista Previa', description: 'Revisa tu buyer persona' },
];

export const BuyerPersonaForm = () => {
  const [step, setStep] = useState<'company-info' | 'select-count' | 'create-personas' | 'preview-all'>('company-info');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [activeTab, setActiveTab] = useState('demographics');
  const [showArchetypes, setShowArchetypes] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [collection, setCollection] = useState<BuyerPersonaCollection>({
    totalPersonas: 0,
    currentPersonaIndex: 0,
    personas: [],
    completed: []
  });
  
  const form = useForm<BuyerPersona>({
    defaultValues: {
      personaName: '',
      title: '',
      functionalArea: '',
      age: '',
      location: '',
      bio: '',
      personality: {
        extrovert: 5,
        thinking: 5,
        control: 5,
        practical: 5,
        conservative: 5,
      },
      preferredChannels: {
        traditionalMedia: false,
        onlineSocialMobile: false,
        emailPhone: false,
        referrals: false,
        faceToFacePhysical: false,
      },
      motivations: {
        incentive: '',
        fear: '',
        achievement: '',
        growth: '',
        power: '',
        social: '',
      },
      interests: '',
      goals: '',
      pains: '',
      quote: '',
      keyReasonToBuy: '',
      dealMaker: '',
      dealBreaker: '',
      businessObjectives: '',
      personalObjectives: '',
      workObjectives: '',
      buyingProcess: '',
      typicalBuyingProcess: '',
      productAcquisitionInfluence: '',
      interests_responsibilities: '',
      perceptions_beliefs: '',
      beliefs_influence_behavior: '',
      client_beliefs_affect_choices: '',
      decision_factors: '',
      value_consequences: '',
      unconscious_drivers: '',
      channels_used: '',
      social_networks: '',
      external_sources: '',
      main_participants: '',
      internal_external_influencers: '',
      decision_participant: '',
      participant_roles: '',
      approval_participant: '',
      trusted_info_sources: '',
      content_usage: '',
      content_affects_decision: '',
      content_types_sought: '',
      content_search_timing: '',
      info_acquisition_methods: '',
    },
  });

  const watchedData = form.watch();

  React.useEffect(() => {
    if (step === 'create-personas') {
      const updatedPersonas = [...collection.personas];
      updatedPersonas[collection.currentPersonaIndex] = watchedData as BuyerPersona;
      setCollection(prev => ({
        ...prev,
        personas: updatedPersonas
      }));
    }
  }, [watchedData, collection.currentPersonaIndex, step]);

  const handleCompanyInfoSubmit = (data: CompanyInfo) => {
    setCompanyInfo(data);
    setStep('select-count');
  };

  const handleCountSelected = (count: number) => {
    const initialPersonas = Array.from({ length: count }, () => ({
      personaName: '',
      title: '',
      functionalArea: '',
      age: '',
      location: '',
      bio: '',
      personality: {
        extrovert: 5,
        thinking: 5,
        control: 5,
        practical: 5,
        conservative: 5,
      },
      preferredChannels: {
        traditionalMedia: false,
        onlineSocialMobile: false,
        emailPhone: false,
        referrals: false,
        faceToFacePhysical: false,
      },
      motivations: {
        incentive: '',
        fear: '',
        achievement: '',
        growth: '',
        power: '',
        social: '',
      },
      interests: '',
      goals: '',
      pains: '',
      quote: '',
      keyReasonToBuy: '',
      dealMaker: '',
      dealBreaker: '',
      businessObjectives: '',
      personalObjectives: '',
      workObjectives: '',
      buyingProcess: '',
      typicalBuyingProcess: '',
      productAcquisitionInfluence: '',
      interests_responsibilities: '',
      perceptions_beliefs: '',
      beliefs_influence_behavior: '',
      client_beliefs_affect_choices: '',
      decision_factors: '',
      value_consequences: '',
      unconscious_drivers: '',
      channels_used: '',
      social_networks: '',
      external_sources: '',
      main_participants: '',
      internal_external_influencers: '',
      decision_participant: '',
      participant_roles: '',
      approval_participant: '',
      trusted_info_sources: '',
      content_usage: '',
      content_affects_decision: '',
      content_types_sought: '',
      content_search_timing: '',
      info_acquisition_methods: '',
    } as BuyerPersona));

    setCollection({
      totalPersonas: count,
      currentPersonaIndex: 0,
      personas: initialPersonas,
      completed: new Array(count).fill(false)
    });

    form.reset(initialPersonas[0]);
    setStep('create-personas');
  };

  const handlePersonaNavigation = (direction: 'next' | 'prev') => {
    const newIndex = direction === 'next' 
      ? Math.min(collection.currentPersonaIndex + 1, collection.totalPersonas - 1)
      : Math.max(collection.currentPersonaIndex - 1, 0);
    
    setCollection(prev => ({
      ...prev,
      currentPersonaIndex: newIndex
    }));
    
    form.reset(collection.personas[newIndex]);
    setActiveTab('demographics');
  };

  const markPersonaComplete = () => {
    const updatedCompleted = [...collection.completed];
    updatedCompleted[collection.currentPersonaIndex] = true;
    
    setCollection(prev => ({
      ...prev,
      completed: updatedCompleted
    }));

    // Si hay más personas, ir a la siguiente
    if (collection.currentPersonaIndex < collection.totalPersonas - 1) {
      handlePersonaNavigation('next');
    } else {
      // Si es la última persona, ir a vista previa
      setStep('preview-all');
    }
  };

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const progress = ((currentTabIndex + 1) / tabs.length) * 100;

  const onNext = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const onPrev = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  if (step === 'company-info') {
    return <CompanyInfoForm onNext={handleCompanyInfoSubmit} />;
  }

  const handleArchetypeSelected = (archetype: Partial<BuyerPersona>) => {
    // Crear una persona con el arquetipo seleccionado
    const personaWithArchetype = {
      ...form.getValues(),
      ...archetype
    };
    
    // Inicializar colección con 1 persona basada en arquetipo
    setCollection({
      totalPersonas: 1,
      currentPersonaIndex: 0,
      personas: [personaWithArchetype as BuyerPersona],
      completed: [false]
    });
    
    form.reset(personaWithArchetype);
    setStep('create-personas');
    setShowArchetypes(false);
  };

  const handleAIPersonaGenerated = (persona: Partial<BuyerPersona>) => {
    // Crear una persona con los datos generados por IA
    const personaFromAI = {
      ...form.getValues(),
      ...persona
    };
    
    // Inicializar colección con 1 persona generada por IA
    setCollection({
      totalPersonas: 1,
      currentPersonaIndex: 0,
      personas: [personaFromAI as BuyerPersona],
      completed: [false]
    });
    
    form.reset(personaFromAI);
    setStep('create-personas');
    setShowAIAssistant(false);
  };

  if (step === 'select-count') {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <PersonaCountSelector onCountSelected={handleCountSelected} />
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/50" onClick={() => setShowArchetypes(true)}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Library className="w-6 h-6 text-primary" />
                  <CardTitle>Biblioteca de Arquetipos</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Elige entre 14 arquetipos predefinidos por industria y personalízalos a tu medida.
                </p>
                <Badge variant="secondary">Rápido y eficiente</Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/50" onClick={() => setShowAIAssistant(true)}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <CardTitle>Asistente IA Interactivo</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  El asistente IA te hará preguntas y generará automáticamente tu buyer persona.
                </p>
                <Badge variant="secondary">Personalizado y guiado</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={showArchetypes} onOpenChange={setShowArchetypes}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <ArchetypeLibrary 
              onSelectArchetype={handleArchetypeSelected}
              onClose={() => setShowArchetypes(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={showAIAssistant} onOpenChange={setShowAIAssistant}>
          <DialogContent className="max-w-3xl">
            {companyInfo && (
              <AIPersonaAssistant
                companyInfo={companyInfo}
                onPersonaGenerated={handleAIPersonaGenerated}
                onClose={() => setShowAIAssistant(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (step === 'preview-all') {
    return <BuyerPersonaPreview personas={collection.personas} />;
  }

  const currentPersona = collection.personas[collection.currentPersonaIndex];
  const isCurrentPersonaComplete = collection.completed[collection.currentPersonaIndex];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold">Generador de Buyer Persona</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">
                  <Users className="w-4 h-4 mr-1" />
                  Persona {collection.currentPersonaIndex + 1} de {collection.totalPersonas}
                </Badge>
                {isCurrentPersonaComplete && (
                  <Badge variant="default">Completado</Badge>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handlePersonaNavigation('prev')}
                disabled={collection.currentPersonaIndex === 0}
                size="sm"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Persona Anterior
              </Button>
              
              {collection.currentPersonaIndex < collection.totalPersonas - 1 && (
                <Button
                  variant="outline"
                  onClick={() => handlePersonaNavigation('next')}
                  size="sm"
                >
                  Persona Siguiente
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={() => setStep('preview-all')}
                size="sm"
              >
                <Eye className="w-4 h-4 mr-1" />
                Ver Todas
              </Button>
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground mb-6">
            {currentPersona?.personaName || `Buyer Persona ${collection.currentPersonaIndex + 1}`}
          </p>
          
          <div className="max-w-md mx-auto">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Paso {currentTabIndex + 1} de {tabs.length}
            </p>
          </div>
        </div>

        <Form {...form}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-9 mb-8">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="text-xs"
                >
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>

            <Card className="min-h-[600px]">
              <CardHeader>
                <CardTitle>{tabs.find(t => t.id === activeTab)?.title}</CardTitle>
                <CardDescription>{tabs.find(t => t.id === activeTab)?.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <TabsContent value="demographics" className="mt-0">
                  <DemographicsForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="personality" className="mt-0">
                  <PersonalityForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="motivations" className="mt-0">
                  <MotivationsForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="channels" className="mt-0">
                  <ChannelsForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="business" className="mt-0">
                  <BusinessForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="beliefs" className="mt-0">
                  <BeliefsForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="influences" className="mt-0">
                  <InfluencesForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="content" className="mt-0">
                  <ContentForm control={form.control} />
                </TabsContent>
                
                <TabsContent value="preview" className="mt-0">
                  <div className="space-y-6">
                    <BuyerPersonaPreview personas={[collection.personas[collection.currentPersonaIndex]]} />
                    
                    <div className="flex justify-center">
                      <Button 
                        onClick={markPersonaComplete}
                        size="lg"
                        disabled={isCurrentPersonaComplete}
                      >
                        {isCurrentPersonaComplete 
                          ? '✓ Persona Completada' 
                          : collection.currentPersonaIndex < collection.totalPersonas - 1
                            ? 'Completar y Siguiente Persona'
                            : 'Completar Todas las Personas'
                        }
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <div className="flex justify-between mt-8">
                  <Button 
                    variant="outline" 
                    onClick={onPrev}
                    disabled={currentTabIndex === 0}
                  >
                    Anterior
                  </Button>
                  
                  <Button 
                    onClick={onNext}
                    disabled={currentTabIndex === tabs.length - 1}
                  >
                    Siguiente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Tabs>
        </Form>
      </div>
    </div>
  );
};