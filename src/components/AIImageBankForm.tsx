import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Image, Download, Copy, Trash2, Sparkles, Camera, Palette, Lightbulb, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AIImage, ImageStyle } from '@/types/ai-image';

export const AIImageBankForm = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<ImageStyle>('fotografia');
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<AIImage[]>([]);
  const [editingImage, setEditingImage] = useState<AIImage | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const styleOptions = [
    { value: 'fotografia', label: 'Fotografía', icon: Camera, desc: 'Imágenes realistas de alta calidad' },
    { value: 'ilustracion', label: 'Ilustración', icon: Palette, desc: 'Arte digital moderno' },
    { value: 'minimalista', label: 'Minimalista', icon: Lightbulb, desc: 'Diseño limpio y simple' },
    { value: 'abstracto', label: 'Abstracto', icon: Sparkles, desc: 'Formas y colores artísticos' },
    { value: 'corporativo', label: 'Corporativo', icon: Image, desc: 'Profesional y sobrio' },
    { value: 'creativo', label: 'Creativo', icon: Palette, desc: 'Único e innovador' }
  ];

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt requerido",
        description: "Por favor describe la imagen que deseas generar",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('image-generator', {
        body: {
          prompt: prompt.trim(),
          style
        }
      });

      if (error) throw error;

      const newImage: AIImage = {
        id: crypto.randomUUID(),
        prompt: data.prompt,
        imageUrl: data.imageUrl,
        style,
        createdAt: new Date()
      };

      setImages(prev => [newImage, ...prev]);
      
      toast({
        title: "Imagen generada",
        description: "Tu imagen ha sido creada exitosamente"
      });

      setPrompt('');
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Error",
        description: "No se pudo generar la imagen. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const editImage = async () => {
    if (!editingImage || !editPrompt.trim()) {
      toast({
        title: "Instrucción requerida",
        description: "Por favor describe cómo quieres editar la imagen",
        variant: "destructive"
      });
      return;
    }

    setIsEditing(true);
    try {
      const { data, error } = await supabase.functions.invoke('image-editor', {
        body: {
          imageUrl: editingImage.imageUrl,
          editPrompt: editPrompt.trim()
        }
      });

      if (error) throw error;

      const editedImage: AIImage = {
        id: crypto.randomUUID(),
        prompt: `[Editado] ${editPrompt}`,
        imageUrl: data.imageUrl,
        style: editingImage.style,
        createdAt: new Date()
      };

      setImages(prev => [editedImage, ...prev]);
      
      toast({
        title: "Imagen editada",
        description: "Tu imagen ha sido modificada exitosamente"
      });

      setEditingImage(null);
      setEditPrompt('');
    } catch (error) {
      console.error('Error editing image:', error);
      toast({
        title: "Error",
        description: "No se pudo editar la imagen. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsEditing(false);
    }
  };

  const downloadImage = async (image: AIImage) => {
    try {
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-image-${image.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Descargada",
        description: "Imagen descargada exitosamente"
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Error",
        description: "No se pudo descargar la imagen",
        variant: "destructive"
      });
    }
  };

  const copyImageUrl = async (imageUrl: string) => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      toast({
        title: "URL copiada",
        description: "URL de la imagen copiada al portapapeles"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo copiar la URL",
        variant: "destructive"
      });
    }
  };

  const deleteImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    toast({
      title: "Eliminada",
      description: "Imagen eliminada del banco"
    });
  };

  const promptExamples = [
    "Un paisaje de montañas al atardecer con colores cálidos",
    "Oficina moderna y minimalista con luz natural",
    "Equipo de trabajo diverso colaborando en una reunión",
    "Producto tecnológico sobre fondo blanco limpio",
    "Concepto abstracto de innovación y creatividad"
  ];

  const editExamples = [
    "Hazlo más colorido y vibrante",
    "Añade un efecto de atardecer",
    "Cambia el fondo a un color sólido",
    "Hazlo más minimalista",
    "Añade elementos decorativos"
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Generator Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            Banco de Imágenes con IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt">Describe la imagen que quieres crear</Label>
            <Textarea
              id="prompt"
              placeholder="Ej: Un diseño moderno de redes sociales con colores vibrantes..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-sm text-muted-foreground">Ejemplos:</span>
              {promptExamples.slice(0, 3).map((example, i) => (
                <Badge 
                  key={i} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-secondary"
                  onClick={() => setPrompt(example)}
                >
                  {example.slice(0, 40)}...
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Estilo de Imagen</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {styleOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Card
                    key={option.value}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      style === option.value ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setStyle(option.value as ImageStyle)}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className="h-8 w-8 mx-auto mb-2" />
                      <h4 className="font-semibold text-sm">{option.label}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{option.desc}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Button 
            onClick={generateImage} 
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Generando imagen...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generar Imagen con IA
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Image Gallery */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Galería de Imágenes ({images.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <div className="relative group">
                      <img
                        src={image.imageUrl}
                        alt={image.prompt}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => {
                            setEditingImage(image);
                            setEditPrompt('');
                          }}
                          title="Editar imagen"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => downloadImage(image)}
                          title="Descargar"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => copyImageUrl(image.imageUrl)}
                          title="Copiar URL"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => deleteImage(image.id)}
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{image.style}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(image.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {image.prompt}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {images.length === 0 && !isGenerating && (
        <Card>
          <CardContent className="py-12 text-center">
            <Image className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No hay imágenes generadas</h3>
            <p className="text-muted-foreground">
              Crea tu primera imagen con IA usando el generador de arriba
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Image Dialog */}
      <Dialog open={!!editingImage} onOpenChange={(open) => !open && setEditingImage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Editar Imagen con IA
            </DialogTitle>
          </DialogHeader>
          
          {editingImage && (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border">
                <img
                  src={editingImage.imageUrl}
                  alt={editingImage.prompt}
                  className="w-full h-64 object-contain bg-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editPrompt">¿Cómo quieres modificar esta imagen?</Label>
                <Textarea
                  id="editPrompt"
                  placeholder="Ej: Hazlo más colorido, añade un atardecer, cambia el fondo..."
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Sugerencias:</span>
                  {editExamples.map((example, i) => (
                    <Badge 
                      key={i} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-secondary"
                      onClick={() => setEditPrompt(example)}
                    >
                      {example}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingImage(null)} disabled={isEditing}>
              Cancelar
            </Button>
            <Button onClick={editImage} disabled={isEditing || !editPrompt.trim()}>
              {isEditing ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Editando...
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Aplicar Edición
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
