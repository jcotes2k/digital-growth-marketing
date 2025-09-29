export interface Hashtag {
  hashtag: string;
  reach: 'alto' | 'medio' | 'bajo';
  competition: 'alta' | 'media' | 'baja';
  reason: string;
}

export interface HashtagRecommendations {
  bestTime: string;
  strategy: string;
  tips: string[];
}

export interface HashtagResponse {
  trending: Hashtag[];
  niche: Hashtag[];
  branded: Hashtag[];
  recommendations: HashtagRecommendations;
}

export interface HashtagCollection {
  id: string;
  topic: string;
  platform: string;
  hashtags: HashtagResponse;
  createdAt: Date;
}