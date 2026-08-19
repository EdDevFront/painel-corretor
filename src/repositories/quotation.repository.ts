import { Quotation } from "../types/quotation";

export interface QuotationRepository {
  getAll(): Promise<Quotation[]>;
  getById(id: string): Promise<Quotation | null>;
  create(quotation: Quotation): Promise<Quotation>;
  update(quotation: Quotation): Promise<Quotation>;
  delete(id: string): Promise<void>;
}

const STORAGE_KEY = "painel_corretor_quotations";

export class LocalQuotationRepository implements QuotationRepository {
  private isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  private getItems(): Quotation[] {
    if (!this.isBrowser()) return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveItems(items: Quotation[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  async getAll(): Promise<Quotation[]> {
    return this.getItems();
  }

  async getById(id: string): Promise<Quotation | null> {
    const items = this.getItems();
    const item = items.find((q) => q.id === id);
    return item || null;
  }

  async create(quotation: Quotation): Promise<Quotation> {
    const items = this.getItems();
    const newItem = {
      ...quotation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.push(newItem);
    this.saveItems(items);
    return newItem;
  }

  async update(quotation: Quotation): Promise<Quotation> {
    const items = this.getItems();
    const index = items.findIndex((q) => q.id === quotation.id);
    
    if (index === -1) {
      throw new Error(`Quotation with id ${quotation.id} not found.`);
    }

    const updatedItem = {
      ...quotation,
      updatedAt: new Date().toISOString(),
    };
    items[index] = updatedItem;
    this.saveItems(items);
    return updatedItem;
  }

  async delete(id: string): Promise<void> {
    const items = this.getItems();
    const filtered = items.filter((q) => q.id !== id);
    this.saveItems(filtered);
  }
}

// Export a singleton instance
export const quotationRepository: QuotationRepository = new LocalQuotationRepository();
