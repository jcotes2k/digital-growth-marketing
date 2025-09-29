export interface PostTemplate {
  id: string;
  name: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube';
  type: 'promotional' | 'educational' | 'engagement' | 'storytelling' | 'announcement';
  structure: string;
  tone: string;
  cta: string;
  variables: string[];
  example: string;
  createdAt: Date;
}

export interface GeneratedPost {
  platform: string;
  content: string;
  hashtags: string[];
  suggestions: string;
  bestTimeToPost: string;
}

export interface TemplateGenerationRequest {
  templateId: string;
  variables: Record<string, string>;
  additionalContext?: string;
}

export interface TemplateGenerationResponse {
  post: GeneratedPost;
  template: PostTemplate;
}

export interface TemplateCollection {
  id: string;
  name: string;
  templates: PostTemplate[];
  createdAt: Date;
}
