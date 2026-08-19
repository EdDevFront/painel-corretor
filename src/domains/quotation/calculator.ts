import { QuotationMode, Life, OperatorResult, QuotationResult } from "./types";
import { Operator } from "../operator/types";

export const SENIOR_AGE = 59;

export function calculateAge(birthDate: string): number {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age < 0 ? 0 : age;
}

export function getAgeMultiplier(age: number): number {
  if (age <= 18) return 1.0;
  if (age <= 23) return 1.2;
  if (age <= 28) return 1.4;
  if (age <= 33) return 1.6;
  if (age <= 38) return 1.8;
  if (age <= 43) return 2.1;
  if (age <= 48) return 2.5;
  if (age <= 53) return 3.0;
  if (age <= 58) return 3.7;
  return 5.0; // Senior range (59+)
}

export function getBasePriceForMode(operator: Operator, mode: QuotationMode): number {
  if (mode === "PF") return operator.basePricePF;
  if (mode === "PME") return operator.basePricePME;
  return operator.basePriceAdesao;
}

export function calculateLifePrice(age: number, basePrice: number): number {
  const multiplier = getAgeMultiplier(age);
  return Number((basePrice * multiplier).toFixed(2));
}

export function calculateFees(subtotal: number): number {
  const FEE_RATE = 0.02; // 2% broker administrative fee
  return Number((subtotal * FEE_RATE).toFixed(2));
}

export function calculateOperatorResult(operator: Operator, lives: Life[], mode: QuotationMode): OperatorResult {
  const basePrice = getBasePriceForMode(operator, mode);
  
  const livesPrices = lives.map((life) => {
    const age = calculateAge(life.birthDate);
    const price = calculateLifePrice(age, basePrice);
    return { lifeId: life.id, price };
  });

  const totalPrice = livesPrices.reduce((sum, item) => sum + item.price, 0);

  return {
    operatorId: operator.id,
    operatorName: operator.name,
    totalPrice: Number(totalPrice.toFixed(2)),
    livesPrices,
  };
}

export function calculateQuotationResult(
  operators: Operator[],
  lives: Life[],
  mode: QuotationMode
): QuotationResult {
  const operatorResults = operators.map((op) => calculateOperatorResult(op, lives, mode));
  
  // Find the selected or cheapest operator total as reference
  const basePrice = operatorResults.length > 0 ? operatorResults[0].totalPrice : 0;
  const baseFees = calculateFees(basePrice);
  const totalPrice = Number((basePrice + baseFees).toFixed(2));

  return {
    totalPrice,
    totalLives: lives.length,
    operatorResults,
    baseFees,
  };
}
