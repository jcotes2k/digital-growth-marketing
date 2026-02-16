import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ContentStrategy } from "@/types/content-strategy";
import { GoalForm } from "./content-forms/GoalForm";
import { ContentTopicsForm } from "./content-forms/ContentTopicsForm";
import { TeamForm } from "./content-forms/TeamForm";
import { ChannelsForm as ContentChannelsForm } from "./content-forms/ChannelsForm";
import { ContentFormatForm } from "./content-forms/ContentFormatForm";
import { BudgetForm } from "./content-forms/BudgetForm";
import { RhythmForm } from "./content-forms/RhythmForm";
import { ContentToneForm } from "./content-forms/ContentToneForm";
import { Target, BookOpen, Users, Share2, FileText, DollarSign, Clock, Palette, Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const contentStrategySchema = z.object({
  goal: z.string().default(""),
  contentTopics: z.string().default(""),
  team: z.string().default(""),
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
  contentFormat: z.string().default(""),
  budget: z.string().default(""),
  rhythm: z.string().default(""),
  contentTone: z.object({
    significado: z.string().default(""),
    percepcion: z.string().default(""),
    personalidad: z.string().default(""),
    valoresAtributos: z.string().default(""),
    territorio: z.string().default(""),
  }),
});

const contentBlocks = [
  { id: "goal", title: "Objetivo", icon: Target, component: GoalForm, colSpan: 1 },
  { id: "contentTopics", title: "Temas de Contenido", icon: BookOpen, component: ContentTopicsForm, colSpan: 1 },
  { id: "team", title: "Equipo", icon: Users, component: TeamForm, colSpan: 1 },
  { id: "channels", title: "Canales", icon: Share2, component: ContentChannelsForm, colSpan: 1 },
  { id: "contentFormat", title: "Formato de Contenido", icon: FileText, component: ContentFormatForm, colSpan: 1 },
  { id: "budget", title: "Presupuesto", icon: DollarSign, component: BudgetForm, colSpan: 1 },
  { id: "rhythm", title: "Ritmo", icon: Clock, component: RhythmForm, colSpan: 1 },
  { id: "contentTone", title: "Tono de Contenido", icon: Palette, component: ContentToneForm, colSpan: 2 },
];

export const ContentStrategyForm = () => {
  const [editingBlock, setEditingBlock] = useState<string | null>(null);

  const form = useForm<ContentStrategy>({
    resolver: zodResolver(contentStrategySchema),
    defaultValues: {
      goal: "",
      contentTopics: "",
      team: "",
      channels: {
        facebook: false, twitter: false, youtube: false, instagram: false,
        linkedin: false, pinterest: false, tiktok: false, snapchat: false, other: "",
      },
      contentFormat: "",
      budget: "",
      rhythm: "",
      contentTone: {
        significado: "", percepcion: "", personalidad: "", valoresAtributos: "", territorio: "",
      },
    },
  });

  const watchedValues = form.watch();

  const handleDownloadPDF = async () => {
    const element = document.getElementById("content-strategy-grid");
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("estrategia-contenido.pdf");
  };

  const getBlockPreview = (blockId: string) => {
    switch (blockId) {
      case "goal":
        return watchedValues.goal || null;
      case "contentTopics":
        return watchedValues.contentTopics || null;
      case "team":
        return watchedValues.team || null;
      case "channels": {
        const ch = watchedValues.channels;
        const selected = Object.entries(ch)
          .filter(([key, val]) => key !== "other" && val === true)
          .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));
        if (ch.other) selected.push(ch.other);
        return selected.length > 0 ? selected : null;
      }
      case "contentFormat":
        return watchedValues.contentFormat || null;
      case "budget":
        return watchedValues.budget || null;
      case "rhythm":
        return watchedValues.rhythm || null;
      case "contentTone": {
        const tone = watchedValues.contentTone;
        const filled = Object.entries(tone).filter(([, v]) => v);
        return filled.length > 0 ? filled : null;
      }
      default:
        return null;
    }
  };

  const renderBlockContent = (blockId: string) => {
    const preview = getBlockPreview(blockId);
    if (!preview) {
      return <p className="text-sm text-muted-foreground italic">No especificado</p>;
    }

    if (blockId === "channels" && Array.isArray(preview)) {
      return (
        <div className="flex flex-wrap gap-1">
          {(preview as string[]).map((ch) => (
            <Badge key={ch} variant="secondary" className="text-xs">{ch}</Badge>
          ))}
        </div>
      );
    }

    if (blockId === "contentTone" && Array.isArray(preview)) {
      const labels: Record<string, string> = {
        significado: "Significado", percepcion: "Percepción",
        personalidad: "Personalidad", valoresAtributos: "Valores", territorio: "Territorio",
      };
      return (
        <div className="grid grid-cols-2 gap-2">
          {(preview as [string, string][]).map(([key, val]) => (
            <div key={key}>
              <p className="text-xs font-medium text-muted-foreground">{labels[key] || key}</p>
              <p className="text-sm line-clamp-2">{val}</p>
            </div>
          ))}
        </div>
      );
    }

    return <p className="text-sm line-clamp-4 whitespace-pre-wrap">{preview as string}</p>;
  };

  const currentBlock = contentBlocks.find((b) => b.id === editingBlock);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Canvas de Estrategia de Contenido</h1>
            <p className="text-muted-foreground mt-1">Haz clic en cualquier bloque para editar</p>
          </div>
          <Button onClick={handleDownloadPDF} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Descargar PDF
          </Button>
        </div>

        {/* Grid */}
        <Form {...form}>
          <form>
            <div id="content-strategy-grid" className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contentBlocks.map((block) => {
                const Icon = block.icon;
                return (
                  <Card
                    key={block.id}
                    className={`cursor-pointer hover:border-primary/50 hover:shadow-md transition-all ${
                      block.colSpan === 2 ? "md:col-span-2" : ""
                    }`}
                    onClick={() => setEditingBlock(block.id)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Icon className="w-4 h-4 text-primary" />
                        {block.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>{renderBlockContent(block.id)}</CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Edit Modal */}
            <Dialog open={!!editingBlock} onOpenChange={(open) => !open && setEditingBlock(null)}>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {currentBlock && <currentBlock.icon className="w-5 h-5 text-primary" />}
                    {currentBlock?.title}
                  </DialogTitle>
                </DialogHeader>
                {currentBlock && <currentBlock.component control={form.control} />}
              </DialogContent>
            </Dialog>
          </form>
        </Form>
      </div>
    </div>
  );
};
