import { BuyerPersona } from './buyer-persona';

export interface BuyerPersonaCollection {
  totalPersonas: number;
  currentPersonaIndex: number;
  personas: BuyerPersona[];
  completed: boolean[];
}