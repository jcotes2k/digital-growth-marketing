export interface AIImage {
  id: string;
  prompt: string;
  imageUrl: string;
  style?: string;
  platform?: SocialMediaPlatform;
  formatType?: FormatType;
  width?: number;
  height?: number;
  isInfographic?: boolean;
  createdAt: Date;
}

export type ImageStyle = 
  | 'fotografia' 
  | 'ilustracion' 
  | 'minimalista' 
  | 'abstracto' 
  | 'corporativo' 
  | 'creativo';

export type SocialMediaPlatform = 
  | 'instagram' 
  | 'facebook' 
  | 'linkedin' 
  | 'twitter' 
  | 'tiktok' 
  | 'youtube' 
  | 'pinterest';

export type FormatType = 
  | 'post' 
  | 'story' 
  | 'cover' 
  | 'carousel' 
  | 'reel' 
  | 'thumbnail' 
  | 'header' 
  | 'banner' 
  | 'pin' 
  | 'event';

export type InfographicStyle = 'corporate' | 'modern' | 'colorful' | 'minimal';
export type InfographicOrientation = 'vertical' | 'horizontal';

export interface SocialMediaFormat {
  platform: SocialMediaPlatform;
  formatType: FormatType;
  width: number;
  height: number;
  label: string;
  aspectRatio: string;
}

export interface InfographicData {
  title: string;
  points: string[];
  style: InfographicStyle;
  orientation: InfographicOrientation;
}

// Format configurations per platform
export const PLATFORM_FORMATS: Record<SocialMediaPlatform, SocialMediaFormat[]> = {
  instagram: [
    { platform: 'instagram', formatType: 'post', width: 1080, height: 1080, label: 'Post Cuadrado', aspectRatio: '1:1' },
    { platform: 'instagram', formatType: 'story', width: 1080, height: 1920, label: 'Story/Reel', aspectRatio: '9:16' },
    { platform: 'instagram', formatType: 'carousel', width: 1080, height: 1350, label: 'Carrusel Vertical', aspectRatio: '4:5' },
    { platform: 'instagram', formatType: 'reel', width: 1080, height: 1920, label: 'Reel Cover', aspectRatio: '9:16' },
  ],
  facebook: [
    { platform: 'facebook', formatType: 'post', width: 1200, height: 630, label: 'Post', aspectRatio: '1.91:1' },
    { platform: 'facebook', formatType: 'cover', width: 820, height: 312, label: 'Portada', aspectRatio: '2.63:1' },
    { platform: 'facebook', formatType: 'story', width: 1080, height: 1920, label: 'Historia', aspectRatio: '9:16' },
    { platform: 'facebook', formatType: 'event', width: 1920, height: 1080, label: 'Evento', aspectRatio: '16:9' },
  ],
  linkedin: [
    { platform: 'linkedin', formatType: 'post', width: 1200, height: 627, label: 'Post', aspectRatio: '1.91:1' },
    { platform: 'linkedin', formatType: 'cover', width: 1584, height: 396, label: 'Portada Empresa', aspectRatio: '4:1' },
    { platform: 'linkedin', formatType: 'story', width: 1080, height: 1920, label: 'Historia', aspectRatio: '9:16' },
  ],
  twitter: [
    { platform: 'twitter', formatType: 'post', width: 1600, height: 900, label: 'Post/Tweet', aspectRatio: '16:9' },
    { platform: 'twitter', formatType: 'header', width: 1500, height: 500, label: 'Header Perfil', aspectRatio: '3:1' },
  ],
  tiktok: [
    { platform: 'tiktok', formatType: 'cover', width: 1080, height: 1920, label: 'Portada Video', aspectRatio: '9:16' },
    { platform: 'tiktok', formatType: 'thumbnail', width: 1280, height: 720, label: 'Miniatura', aspectRatio: '16:9' },
  ],
  youtube: [
    { platform: 'youtube', formatType: 'thumbnail', width: 1280, height: 720, label: 'Miniatura', aspectRatio: '16:9' },
    { platform: 'youtube', formatType: 'banner', width: 2560, height: 1440, label: 'Banner Canal', aspectRatio: '16:9' },
  ],
  pinterest: [
    { platform: 'pinterest', formatType: 'pin', width: 1000, height: 1500, label: 'Pin Vertical', aspectRatio: '2:3' },
    { platform: 'pinterest', formatType: 'story', width: 1080, height: 1920, label: 'Story Pin', aspectRatio: '9:16' },
  ],
};

export const PLATFORM_LABELS: Record<SocialMediaPlatform, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  twitter: 'Twitter/X',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  pinterest: 'Pinterest',
};

export const INFOGRAPHIC_STYLES: { value: InfographicStyle; label: string; desc: string }[] = [
  { value: 'corporate', label: 'Corporativo', desc: 'Profesional y formal' },
  { value: 'modern', label: 'Moderno', desc: 'Limpio y contemporáneo' },
  { value: 'colorful', label: 'Colorido', desc: 'Vibrante y llamativo' },
  { value: 'minimal', label: 'Minimalista', desc: 'Simple y elegante' },
];
