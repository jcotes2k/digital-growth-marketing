export interface BuyerPersona {
  // Demografía
  personaName?: string;
  title?: string;
  functionalArea?: string;
  age?: string;
  location?: string;
  bio?: string;
  
  // Personalidad (escala 1-10)
  personality?: {
    extrovert: number;
    thinking: number;
    control: number;
    practical: number;
    conservative: number;
  };
  
  // Motivaciones
  motivations?: {
    incentive: string;
    fear: string;
    achievement: string;
    growth: string;
    power: string;
    social: string;
  };
  
  // Canales preferidos
  preferredChannels?: {
    traditionalMedia: boolean;
    onlineSocialMobile: boolean;
    emailPhone: boolean;
    referrals: boolean;
    faceToFacePhysical: boolean;
  };
  
  // Otros campos
  interests?: string;
  goals?: string;
  pains?: string;
  quote?: string;
  keyReasonToBuy?: string;
  dealMaker?: string;
  dealBreaker?: string;
  
  // Objetivos de negocio y proceso de compra
  businessObjectives?: string;
  personalObjectives?: string;
  workObjectives?: string;
  buyingProcess?: string;
  typicalBuyingProcess?: string;
  productAcquisitionInfluence?: string;
  
  // Creencias y comportamientos
  interests_responsibilities?: string;
  perceptions_beliefs?: string;
  beliefs_influence_behavior?: string;
  client_beliefs_affect_choices?: string;
  decision_factors?: string;
  value_consequences?: string;
  unconscious_drivers?: string;
  
  // Canales y comunicación  
  channels_used?: string;
  social_networks?: string;
  external_sources?: string;
  
  // Influencias
  main_participants?: string;
  internal_external_influencers?: string;
  decision_participant?: string;
  participant_roles?: string;
  approval_participant?: string;
  
  // Contenido e información
  trusted_info_sources?: string;
  content_usage?: string;
  content_affects_decision?: string;
  content_types_sought?: string;
  content_search_timing?: string;
  info_acquisition_methods?: string;
}