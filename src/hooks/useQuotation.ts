"use client";

import { useState, useEffect, useCallback } from "react";
import { Quotation, QuotationMode, Life, QuotationPreferences } from "../types/quotation";
import {
  getQuotationById,
  createNewQuotation,
  calculateAndSaveQuotation,
  deleteQuotation as deleteService,
} from "../services/quotation.service";

export function useQuotation(initialId?: string) {
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuotation = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const q = await getQuotationById(id);
      if (q) {
        setQuotation(q);
      } else {
        setError("Cotação não encontrada.");
      }
    } catch (err) {
      setError("Erro ao carregar a cotação.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startNewQuotation = async (clientName: string, brokerName: string, mode: QuotationMode) => {
    setIsLoading(true);
    setError(null);
    try {
      const newQ = await createNewQuotation(clientName, brokerName, mode);
      setQuotation(newQ);
      setCurrentStep(2); // Move to Step 2 (Profile/Overview or Lives)
    } catch (err) {
      setError("Erro ao criar a cotação.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateLives = async (lives: Life[]) => {
    if (!quotation) return;
    setIsLoading(true);
    try {
      const updated = { ...quotation, lives };
      const saved = await calculateAndSaveQuotation(updated);
      setQuotation(saved);
    } catch (err) {
      setError("Erro ao atualizar as vidas.");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (preferences: QuotationPreferences) => {
    if (!quotation) return;
    setIsLoading(true);
    try {
      const updated = { ...quotation, preferences };
      const saved = await calculateAndSaveQuotation(updated);
      setQuotation(saved);
    } catch (err) {
      setError("Erro ao salvar preferências.");
    } finally {
      setIsLoading(false);
    }
  };

  const finalizeQuotation = async () => {
    if (!quotation) return;
    setIsLoading(true);
    try {
      const updated: Quotation = { ...quotation, status: "completed" };
      const saved = await calculateAndSaveQuotation(updated);
      setQuotation(saved);
      setCurrentStep(5); // Show results page
    } catch (err) {
      setError("Erro ao finalizar cotação.");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  useEffect(() => {
    if (initialId) {
      loadQuotation(initialId);
    }
  }, [initialId, loadQuotation]);

  return {
    quotation,
    currentStep,
    isLoading,
    error,
    startNewQuotation,
    updateLives,
    updatePreferences,
    finalizeQuotation,
    nextStep,
    prevStep,
    setCurrentStep,
    loadQuotation,
  };
}
