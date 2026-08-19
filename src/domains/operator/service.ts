import { Operator } from "./types";

const MOCK_OPERATORS: Operator[] = [
  {
    id: "op_sulamerica",
    name: "SulAmérica Saúde",
    basePricePF: 250.0,
    basePricePME: 190.0,
    basePriceAdesao: 220.0,
  },
  {
    id: "op_bradesco",
    name: "Bradesco Saúde",
    basePricePF: 280.0,
    basePricePME: 210.0,
    basePriceAdesao: 240.0,
  },
  {
    id: "op_amil",
    name: "Amil Fácil",
    basePricePF: 180.0,
    basePricePME: 140.0,
    basePriceAdesao: 160.0,
  },
  {
    id: "op_unimed",
    name: "Unimed Nacional",
    basePricePF: 210.0,
    basePricePME: 160.0,
    basePriceAdesao: 185.0,
  },
];

export async function getOperators(): Promise<Operator[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_OPERATORS);
    }, 100);
  });
}

export async function getOperatorById(id: string): Promise<Operator | null> {
  const operators = await getOperators();
  return operators.find((op) => op.id === id) || null;
}
