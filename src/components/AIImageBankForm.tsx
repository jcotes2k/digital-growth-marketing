import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Image, Download, Copy, Trash2, Sparkles, Camera, Palette, Lightbulb, Pencil,
  Instagram, Facebook, Linkedin, Twitter, Youtube, Plus, Minus, BarChart3, Layers
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  AIImage, 
  ImageStyle, 
  SocialMediaPlatform, 
  SocialMediaFormat,
  InfographicStyle,
  InfographicOrientation,
  PLATFORM_FORMATS, 
  PLATFORM_LABELS,
  INFOGRAPHIC_STYLES
} from '@/types/ai-image';

export const AIImageBankForm = () => {
  // Basic generation state
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<ImageStyle>('fotografia');
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<AIImage[]>([]);
  
  // Edit state
  const [editingImage, setEditingImage] = useState<AIImage | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Platform-specific state
  const [selectedPlatform, setSelectedPlatform] = useState<SocialMediaPlatform>('instagram');
  const [selectedFormat, setSelectedFormat] = useState<SocialMediaFormat>(PLATFORM_FORMATS.instagram[0]);
  const [platformPrompt, setPlatformPrompt] = useState('');
  
  // Multi-platform state
  const [multiPlatforms, setMultiPlatforms] = useState<SocialMediaPlatform[]>(['instagram', 'facebook', 'linkedin']);
  const [multiPrompt, setMultiPrompt] = useState('');
  const [isGeneratingMulti, setIsGeneratingMulti] = useState(false);
  const [multiProgress, setMultiProgress] = useState({ current: 0, total: 0 });
  
  // Infographic state
  const [infographicTitle, setInfographicTitle] = useState('');
  const [infographicPoints, setInfographicPoints] = useState<string[]>(['', '', '']);
  const [infographicStyle, setInfographicStyle] = useState<InfographicStyle>('modern');
  const [infographicOrientation, setInfographicOrientation] = useState<InfographicOrientation>('vertical');
  const [isGeneratingInfographic, setIsGeneratingInfographic] = useState(false);
  
  const { toast } = useToast();

  const styleOptions = [
    { value: 'fotografia', label: 'Fotografía', icon: Camera, desc: 'Imágenes realistas' },
    { value: 'ilustracion', label: 'Ilustración', icon: Palette, desc: 'Arte digital' },
    { value: 'minimalista', label: 'Minimalista', icon: Lightbulb, desc: 'Diseño limpio' },
    { value: 'abstracto', label: 'Abstracto', icon: Sparkles, desc: 'Arte creativo' },
    { value: 'corporativo', label: 'Corporativo', icon: Image, desc: 'Profesional' },
    { value: 'creativo', label: 'Creativo', icon: Palette, desc: 'Innovador' }
  ];

  const platformIcons: Record<SocialMediaPlatform, React.ReactNode> = {
    instagram: <Instagram className="h-4 w-4" />,
    facebook: <Facebook className="h-4 w-4" />,
    linkedin: <Linkedin className="h-4 w-4" />,
    twitter: <Twitter className="h-4 w-4" />,
    tiktok: <span className="text-xs font-bold">TT</span>,
    youtube: <Youtube className="h-4 w-4" />,
    pinterest: <span className="text-xs font-bold">P</span>,
  };

  // Basic image generation
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
        body: { prompt: prompt.trim(), style }
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
      toast({ title: "Imagen generada", description: "Tu imagen ha sido creada exitosamente" });
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

  // Platform-specific generation
  const generatePlatformImage = async () => {
    if (!platformPrompt.trim()) {
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
          prompt: platformPrompt.trim(), 
          style,
          platform: selectedPlatform,
          formatType: selectedFormat.formatType,
          width: selectedFormat.width,
          height: selectedFormat.height,
          aspectRatio: selectedFormat.aspectRatio
        }
      });

      if (error) throw error;

      const newImage: AIImage = {
        id: crypto.randomUUID(),
        prompt: data.prompt,
        imageUrl: data.imageUrl,
        style,
        platform: selectedPlatform,
        formatType: selectedFormat.formatType,
        width: selectedFormat.width,
        height: selectedFormat.height,
        createdAt: new Date()
      };

      setImages(prev => [newImage, ...prev]);
      toast({ 
        title: "Imagen generada", 
        description: `Imagen para ${PLATFORM_LABELS[selectedPlatform]} creada exitosamente` 
      });
      setPlatformPrompt('');
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

  // Multi-platform generation
  const generateMultiPlatformImages = async () => {
    if (!multiPrompt.trim()) {
      toast({
        title: "Prompt requerido",
        description: "Por favor describe la imagen que deseas generar",
        variant: "destructive"
      });
      return;
    }

    if (multiPlatforms.length === 0) {
      toast({
        title: "Selecciona redes",
        description: "Por favor selecciona al menos una red social",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingMulti(true);
    setMultiProgress({ current: 0, total: multiPlatforms.length });

    const newImages: AIImage[] = [];

    for (let i = 0; i < multiPlatforms.length; i++) {
      const platform = multiPlatforms[i];
      const format = PLATFORM_FORMATS[platform][0]; // Use default format for each platform
      
      setMultiProgress({ current: i + 1, total: multiPlatforms.length });

      try {
        const { data, error } = await supabase.functions.invoke('image-generator', {
          body: { 
            prompt: multiPrompt.trim(), 
            style,
            platform,
            formatType: format.formatType,
            width: format.width,
            height: format.height,
            aspectRatio: format.aspectRatio
          }
        });

        if (error) throw error;

        newImages.push({
          id: crypto.randomUUID(),
          prompt: data.prompt,
          imageUrl: data.imageUrl,
          style,
          platform,
          formatType: format.formatType,
          width: format.width,
          height: format.height,
          createdAt: new Date()
        });
      } catch (error) {
        console.error(`Error generating image for ${platform}:`, error);
      }
    }

    setImages(prev => [...newImages, ...prev]);
    toast({ 
      title: "Imágenes generadas", 
      description: `${newImages.length} imágenes creadas para tus redes sociales` 
    });
    setMultiPrompt('');
    setIsGeneratingMulti(false);
  };

  // Infographic generation
  const generateInfographic = async () => {
    if (!infographicTitle.trim()) {
      toast({
        title: "Título requerido",
        description: "Por favor ingresa un título para la infografía",
        variant: "destructive"
      });
      return;
    }

    const validPoints = infographicPoints.filter(p => p.trim());
    if (validPoints.length < 2) {
      toast({
        title: "Puntos requeridos",
        description: "Por favor ingresa al menos 2 puntos clave",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingInfographic(true);
    try {
      const { data, error } = await supabase.functions.invoke('infographic-generator', {
        body: { 
          title: infographicTitle.trim(),
          points: validPoints,
          style: infographicStyle,
          orientation: infographicOrientation
        }
      });

      if (error) throw error;

      const newImage: AIImage = {
        id: crypto.randomUUID(),
        prompt: `Infografía: ${infographicTitle}`,
        imageUrl: data.imageUrl,
        isInfographic: true,
        createdAt: new Date()
      };

      setImages(prev => [newImage, ...prev]);
      toast({ title: "Infografía generada", description: "Tu infografía ha sido creada exitosamente" });
      setInfographicTitle('');
      setInfographicPoints(['', '', '']);
    } catch (error) {
      console.error('Error generating infographic:', error);
      toast({
        title: "Error",
        description: "No se pudo generar la infografía. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingInfographic(false);
    }
  };

  // Edit image
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
        body: { imageUrl: editingImage.imageUrl, editPrompt: editPrompt.trim() }
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
      toast({ title: "Imagen editada", description: "Tu imagen ha sido modificada exitosamente" });
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

  // Utility functions
  const downloadImage = async (image: AIImage) => {
    try {
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const suffix = image.platform ? `-${image.platform}` : '';
      a.download = `ai-image${suffix}-${image.id.slice(0, 8)}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast({ title: "Descargada", description: "Imagen descargada exitosamente" });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({ title: "Error", description: "No se pudo descargar la imagen", variant: "destructive" });
    }
  };

  const copyImageUrl = async (imageUrl: string) => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      toast({ title: "URL copiada", description: "URL de la imagen copiada al portapapeles" });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo copiar la URL", variant: "destructive" });
    }
  };

  const deleteImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    toast({ title: "Eliminada", description: "Imagen eliminada del banco" });
  };

  const toggleMultiPlatform = (platform: SocialMediaPlatform) => {
    setMultiPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const addInfographicPoint = () => {
    if (infographicPoints.length < 6) {
      setInfographicPoints([...infographicPoints, '']);
    }
  };

  const removeInfographicPoint = (index: number) => {
    if (infographicPoints.length > 2) {
      setInfographicPoints(infographicPoints.filter((_, i) => i !== index));
    }
  };

  const updateInfographicPoint = (index: number, value: string) => {
    const updated = [...infographicPoints];
    updated[index] = value;
    setInfographicPoints(updated);
  };

  const promptExamples = [
    "Un paisaje de montañas al atardecer con colores cálidos",
    "Oficina moderna y minimalista con luz natural",
    "Equipo de trabajo diverso colaborando en una reunión"
  ];

  const editExamples = [
    "Hazlo más colorido",
    "Añade un atardecer",
    "Cambia el fondo",
    "Más minimalista"
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Main Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            Banco de Imágenes con IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="simple" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="simple" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                <span className="hidden sm:inline">Simple</span>
              </TabsTrigger>
              <TabsTrigger value="platform" className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                <span className="hidden sm:inline">Por Red</span>
              </TabsTrigger>
              <TabsTrigger value="multi" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Multi-Red</span>
              </TabsTrigger>
              <TabsTrigger value="infographic" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Infografía</span>
              </TabsTrigger>
            </TabsList>

            {/* Simple Generation Tab */}
            <TabsContent value="simple" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Describe la imagen</Label>
                <Textarea
                  id="prompt"
                  placeholder="Ej: Un diseño moderno de redes sociales con colores vibrantes..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Ejemplos:</span>
                  {promptExamples.map((example, i) => (
                    <Badge 
                      key={i} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-secondary"
                      onClick={() => setPrompt(example)}
                    >
                      {example.slice(0, 30)}...
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Estilo de Imagen</Label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {styleOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <Card
                        key={option.value}
                        className={`cursor-pointer transition-all hover:shadow-md p-2 ${
                          style === option.value ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setStyle(option.value as ImageStyle)}
                      >
                        <div className="text-center">
                          <Icon className="h-6 w-6 mx-auto mb-1" />
                          <p className="text-xs font-medium">{option.label}</p>
                        </div>
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
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generar Imagen
                  </>
                )}
              </Button>
            </TabsContent>

            {/* Platform-Specific Tab */}
            <TabsContent value="platform" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Plataforma</Label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(PLATFORM_FORMATS) as SocialMediaPlatform[]).map((platform) => (
                    <Button
                      key={platform}
                      variant={selectedPlatform === platform ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedPlatform(platform);
                        setSelectedFormat(PLATFORM_FORMATS[platform][0]);
                      }}
                      className="flex items-center gap-2"
                    >
                      {platformIcons[platform]}
                      {PLATFORM_LABELS[platform]}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Formato</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {PLATFORM_FORMATS[selectedPlatform].map((format) => (
                    <Card
                      key={`${format.platform}-${format.formatType}`}
                      className={`cursor-pointer transition-all p-3 ${
                        selectedFormat.formatType === format.formatType ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedFormat(format)}
                    >
                      <div className="text-center">
                        <p className="font-medium text-sm">{format.label}</p>
                        <p className="text-xs text-muted-foreground">{format.width}×{format.height}</p>
                        <p className="text-xs text-muted-foreground">{format.aspectRatio}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platformPrompt">Describe la imagen</Label>
                <Textarea
                  id="platformPrompt"
                  placeholder={`Describe la imagen para ${PLATFORM_LABELS[selectedPlatform]}...`}
                  value={platformPrompt}
                  onChange={(e) => setPlatformPrompt(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Estilo</Label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {styleOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <Card
                        key={option.value}
                        className={`cursor-pointer transition-all p-2 ${
                          style === option.value ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setStyle(option.value as ImageStyle)}
                      >
                        <div className="text-center">
                          <Icon className="h-5 w-5 mx-auto mb-1" />
                          <p className="text-xs">{option.label}</p>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <Button 
                onClick={generatePlatformImage} 
                disabled={isGenerating || !platformPrompt.trim()}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Generando para {PLATFORM_LABELS[selectedPlatform]}...
                  </>
                ) : (
                  <>
                    {platformIcons[selectedPlatform]}
                    <span className="ml-2">Generar para {PLATFORM_LABELS[selectedPlatform]}</span>
                  </>
                )}
              </Button>
            </TabsContent>

            {/* Multi-Platform Tab */}
            <TabsContent value="multi" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Selecciona las redes sociales</Label>
                <div className="flex flex-wrap gap-3">
                  {(Object.keys(PLATFORM_FORMATS) as SocialMediaPlatform[]).map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <Checkbox
                        id={`multi-${platform}`}
                        checked={multiPlatforms.includes(platform)}
                        onCheckedChange={() => toggleMultiPlatform(platform)}
                      />
                      <label 
                        htmlFor={`multi-${platform}`}
                        className="flex items-center gap-1 text-sm cursor-pointer"
                      >
                        {platformIcons[platform]}
                        {PLATFORM_LABELS[platform]}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Se generará una imagen optimizada para cada red seleccionada ({multiPlatforms.length} redes)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="multiPrompt">Describe la imagen (se adaptará a cada red)</Label>
                <Textarea
                  id="multiPrompt"
                  placeholder="Ej: Promoción de nuevo producto con fondo colorido..."
                  value={multiPrompt}
                  onChange={(e) => setMultiPrompt(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Estilo</Label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {styleOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <Card
                        key={option.value}
                        className={`cursor-pointer transition-all p-2 ${
                          style === option.value ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setStyle(option.value as ImageStyle)}
                      >
                        <div className="text-center">
                          <Icon className="h-5 w-5 mx-auto mb-1" />
                          <p className="text-xs">{option.label}</p>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <Button 
                onClick={generateMultiPlatformImages} 
                disabled={isGeneratingMulti || !multiPrompt.trim() || multiPlatforms.length === 0}
                className="w-full"
                size="lg"
              >
                {isGeneratingMulti ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Generando {multiProgress.current}/{multiProgress.total}...
                  </>
                ) : (
                  <>
                    <Layers className="h-4 w-4 mr-2" />
                    Generar {multiPlatforms.length} Imágenes
                  </>
                )}
              </Button>
            </TabsContent>

            {/* Infographic Tab */}
            <TabsContent value="infographic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="infographicTitle">Título de la Infografía</Label>
                <Input
                  id="infographicTitle"
                  placeholder="Ej: 5 Beneficios del Marketing Digital"
                  value={infographicTitle}
                  onChange={(e) => setInfographicTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Puntos Clave (2-6)</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addInfographicPoint}
                    disabled={infographicPoints.length >= 6}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </div>
                <div className="space-y-2">
                  {infographicPoints.map((point, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex items-center justify-center w-6 h-10 bg-muted rounded text-sm font-medium">
                        {index + 1}
                      </div>
                      <Input
                        placeholder={`Punto ${index + 1}...`}
                        value={point}
                        onChange={(e) => updateInfographicPoint(index, e.target.value)}
                      />
                      {infographicPoints.length > 2 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeInfographicPoint(index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Estilo Visual</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {INFOGRAPHIC_STYLES.map((s) => (
                      <Card
                        key={s.value}
                        className={`cursor-pointer transition-all p-2 ${
                          infographicStyle === s.value ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setInfographicStyle(s.value)}
                      >
                        <p className="font-medium text-sm">{s.label}</p>
                        <p className="text-xs text-muted-foreground">{s.desc}</p>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Orientación</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Card
                      className={`cursor-pointer transition-all p-3 ${
                        infographicOrientation === 'vertical' ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setInfographicOrientation('vertical')}
                    >
                      <div className="text-center">
                        <div className="w-6 h-10 bg-muted mx-auto mb-1 rounded" />
                        <p className="text-sm">Vertical</p>
                        <p className="text-xs text-muted-foreground">Stories/Pins</p>
                      </div>
                    </Card>
                    <Card
                      className={`cursor-pointer transition-all p-3 ${
                        infographicOrientation === 'horizontal' ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setInfographicOrientation('horizontal')}
                    >
                      <div className="text-center">
                        <div className="w-10 h-6 bg-muted mx-auto mb-1 rounded" />
                        <p className="text-sm">Horizontal</p>
                        <p className="text-xs text-muted-foreground">Posts</p>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>

              <Button 
                onClick={generateInfographic} 
                disabled={isGeneratingInfographic || !infographicTitle.trim() || infographicPoints.filter(p => p.trim()).length < 2}
                className="w-full"
                size="lg"
              >
                {isGeneratingInfographic ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Generando infografía...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generar Infografía
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Image Gallery */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Galería ({images.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <div className="relative group">
                      <img
                        src={image.imageUrl}
                        alt={image.prompt}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => {
                            setEditingImage(image);
                            setEditPrompt('');
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="secondary" size="icon" onClick={() => downloadImage(image)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="secondary" size="icon" onClick={() => copyImageUrl(image.imageUrl)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => deleteImage(image.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <div className="flex flex-wrap items-center gap-1 mb-2">
                        {image.platform && (
                          <Badge variant="default" className="text-xs">
                            {platformIcons[image.platform]} {PLATFORM_LABELS[image.platform]}
                          </Badge>
                        )}
                        {image.style && <Badge variant="secondary" className="text-xs">{image.style}</Badge>}
                        {image.isInfographic && <Badge variant="outline" className="text-xs">Infografía</Badge>}
                        {image.width && image.height && (
                          <Badge variant="outline" className="text-xs">{image.width}×{image.height}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{image.prompt}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {images.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Image className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No hay imágenes generadas</h3>
            <p className="text-muted-foreground">
              Crea tu primera imagen usando las opciones de arriba
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingImage} onOpenChange={(open) => !open && setEditingImage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Editar Imagen
            </DialogTitle>
          </DialogHeader>
          
          {editingImage && (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border">
                <img
                  src={editingImage.imageUrl}
                  alt={editingImage.prompt}
                  className="w-full h-48 object-contain bg-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label>¿Cómo quieres modificar esta imagen?</Label>
                <Textarea
                  placeholder="Ej: Hazlo más colorido, añade un atardecer..."
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  className="min-h-[60px]"
                />
                <div className="flex flex-wrap gap-2">
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
                  Aplicar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
