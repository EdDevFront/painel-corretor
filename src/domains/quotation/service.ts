import { Quotation, QuotationMode } from "./types";
import { quotationRepository } from "./repository";
import { calculateQuotationResult } from "./calculator";
import { getOperators } from "../operator/service";

const DELAY_MS = 600;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getQuotations(): Promise<Quotation[]> {
  await delay(DELAY_MS);
  return quotationRepository.getAll();
}

export async function getQuotationById(id: string): Promise<Quotation | null> {
  await delay(DELAY_MS);
  return quotationRepository.getById(id);
}

export async function createNewQuotation(
  clientName: string,
  brokerName: string,
  mode: QuotationMode
): Promise<Quotation> {
  await delay(DELAY_MS);
  const initialQuotation: Quotation = {
    id: Math.random().toString(36).substring(2, 11),
    clientName,
    brokerName,
    mode,
    status: "draft",
    lives: [],
    preferences: {
      operatorId: "",
      hospitalNetwork: "standard",
      coparticipation: false,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return quotationRepository.create(initialQuotation);
}

export async function calculateAndSaveQuotation(quotation: Quotation): Promise<Quotation> {
  await delay(DELAY_MS);
  const operators = await getOperators();
  const results = calculateQuotationResult(operators, quotation.lives, quotation.mode);
  
  const updatedQuotation: Quotation = {
    ...quotation,
    results,
    updatedAt: new Date().toISOString(),
  };

  return quotationRepository.update(updatedQuotation);
}

export async function deleteQuotation(id: string): Promise<void> {
  await delay(DELAY_MS);
  return quotationRepository.delete(id);
}
