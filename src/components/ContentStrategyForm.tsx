import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { ContentStrategy } from "@/types/content-strategy";
import { ContentStrategyPreview } from "./ContentStrategyPreview";
import { GoalForm } from "./content-forms/GoalForm";
import { ContentTopicsForm } from "./content-forms/ContentTopicsForm";
import { TeamForm } from "./content-forms/TeamForm";
import { ChannelsForm } from "./content-forms/ChannelsForm";
import { ContentFormatForm } from "./content-forms/ContentFormatForm";
import { BudgetForm } from "./content-forms/BudgetForm";
import { RhythmForm } from "./content-forms/RhythmForm";
import { ContentToneForm } from "./content-forms/ContentToneForm";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";

const contentStrategySchema = z.object({
  goal: z.string().min(1, "El objetivo es requerido"),
  contentTopics: z.string().min(1, "Los temas de contenido son requeridos"),
  team: z.string().min(1, "El equipo es requerido"),
  channels: z.object({
    facebook: z.boolean().default(false),
    twitter: z.boolean().default(false),
    youtube: z.boolean().default(false),
    instagram: z.boolean().default(false),
    linkedin: z.boolean().default(false),
    pinterest: z.boolean().default(false),
    tiktok: z.boolean().default(false),
    snapchat: z.boolean().default(false),
    other: z.string().default(""),
  }),
  contentFormat: z.string().min(1, "El formato de contenido es requerido"),
  budget: z.string().min(1, "El presupuesto es requerido"),
  rhythm: z.string().min(1, "El ritmo es requerido"),
  contentTone: z.object({
    significado: z.string().min(1, "El significado es requerido"),
    percepcion: z.string().min(1, "La percepción es requerida"),
    personalidad: z.string().min(1, "La personalidad es requerida"),
    valoresAtributos: z.string().min(1, "Los valores y atributos son requeridos"),
    territorio: z.string().min(1, "El territorio es requerido"),
  }),
});

const steps = [
  { title: "Objetivo", component: GoalForm },
  { title: "Temas de Contenido", component: ContentTopicsForm },
  { title: "Equipo", component: TeamForm },
  { title: "Canales", component: ChannelsForm },
  { title: "Formato de Contenido", component: ContentFormatForm },
  { title: "Presupuesto", component: BudgetForm },
  { title: "Ritmo", component: RhythmForm },
  { title: "Tono de Contenido", component: ContentToneForm },
];

export const ContentStrategyForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  
  const form = useForm<ContentStrategy>({
    resolver: zodResolver(contentStrategySchema),
    defaultValues: {
      goal: "",
      contentTopics: "",
      team: "",
      channels: {
        facebook: false,
        twitter: false,
        youtube: false,
        instagram: false,
        linkedin: false,
        pinterest: false,
        tiktok: false,
        snapchat: false,
        other: "",
      },
      contentFormat: "",
      budget: "",
      rhythm: "",
      contentTone: {
        significado: "",
        percepcion: "",
        personalidad: "",
        valoresAtributos: "",
        territorio: "",
      },
    },
  });

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: ContentStrategy) => {
    setShowPreview(true);
  };

  if (showPreview) {
    return <ContentStrategyPreview data={form.getValues()} />;
  }

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Canvas de Estrategia de Contenido</h1>
          <p className="text-muted-foreground mb-4">
            Paso {currentStep + 1} de {steps.length}: {steps[currentStep].title}
          </p>
          <Progress value={progress} className="w-full" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>{steps[currentStep].title}</CardTitle>
                <CardDescription>
                  Completa la información para esta sección del canvas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CurrentStepComponent control={form.control} />
              </CardContent>
            </Card>

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Vista Previa
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex items-center gap-2"
                >
                  Finalizar Canvas
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};