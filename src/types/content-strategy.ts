export interface ContentStrategy {
  goal: string;
  contentTopics: string;
  team: string;
  channels: {
    facebook: boolean;
    twitter: boolean;
    youtube: boolean;
    instagram: boolean;
    linkedin: boolean;
    pinterest: boolean;
    tiktok: boolean;
    snapchat: boolean;
    other: string;
  };
  contentFormat: string;
  budget: string;
  rhythm: string;
  contentTone: {
    significado: string;
    percepcion: string;
    personalidad: string;
    valoresAtributos: string;
    territorio: string;
  };
}