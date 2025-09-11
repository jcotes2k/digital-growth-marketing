import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { DemographicsForm } from './forms/DemographicsForm';
import { PersonalityForm } from './forms/PersonalityForm';
import { MotivationsForm } from './forms/MotivationsForm';
import { ChannelsForm } from './forms/ChannelsForm';
import { BusinessForm } from './forms/BusinessForm';
import { BeliefsForm } from './forms/BeliefsForm';
import { InfluencesForm } from './forms/InfluencesForm';
import { ContentForm } from './forms/ContentForm';
import { BuyerPersonaPreview } from './BuyerPersonaPreview';
import { BuyerPersona } from '@/types/buyer-persona';

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
  const [activeTab, setActiveTab] = useState('demographics');
  const [formData, setFormData] = useState<Partial<BuyerPersona>>({});
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
    setFormData(watchedData);
  }, [watchedData]);

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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Generador de Buyer Persona</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Crea un perfil detallado de tu cliente ideal siguiendo nuestra metodología paso a paso
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
                  <BuyerPersonaPreview persona={formData as BuyerPersona} />
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