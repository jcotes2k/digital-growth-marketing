export interface AIImage {
  id: string;
  prompt: string;
  imageUrl: string;
  style?: string;
  createdAt: Date;
}

export type ImageStyle = 
  | 'fotografia' 
  | 'ilustracion' 
  | 'minimalista' 
  | 'abstracto' 
  | 'corporativo' 
  | 'creativo';