import { Operator } from "../operator/types";

export type QuotationMode = "PF" | "PME" | "ADESAO";

export type QuotationStatus = "draft" | "in_progress" | "completed" | "archived";

export interface Life {
  id: string;
  name: string;
  birthDate: string; // Format: YYYY-MM-DD
  age: number;
  price: number;
}

export interface QuotationPreferences {
  operatorId: string;
  hospitalNetwork: string;
  coparticipation: boolean;
}

export interface LifePriceDetail {
  lifeId: string;
  price: number;
}

export interface OperatorResult {
  operatorId: string;
  operatorName: string;
  totalPrice: number;
  livesPrices: LifePriceDetail[];
}

export interface QuotationResult {
  totalPrice: number;
  totalLives: number;
  operatorResults: OperatorResult[];
  baseFees: number;
}

export interface Quotation {
  id: string;
  clientName: string;
  brokerName: string;
  mode: QuotationMode;
  status: QuotationStatus;
  lives: Life[];
  preferences: QuotationPreferences;
  results?: QuotationResult;
  createdAt: string;
  updatedAt: string;
}
