export interface ContentVariant {
  id: string;
  content: string;
  style: string;
  characterCount: number;
  hashtags: string[];
  isFavorite?: boolean;
  bestFor?: string; // Mejor para qué plataforma/uso
}

export interface ContentGenerationResponse {
  variants: ContentVariant[];
}
