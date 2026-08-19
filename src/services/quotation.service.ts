import { Quotation, QuotationMode } from "../types/quotation";
import { quotationRepository } from "../repositories/quotation.repository";
import { calculateQuotationResult } from "./quotation.calculator";
import { getOperators } from "./operator.service";

export async function getQuotations(): Promise<Quotation[]> {
  return quotationRepository.getAll();
}

export async function getQuotationById(id: string): Promise<Quotation | null> {
  return quotationRepository.getById(id);
}

export async function createNewQuotation(
  clientName: string,
  brokerName: string,
  mode: QuotationMode
): Promise<Quotation> {
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
  return quotationRepository.delete(id);
}
