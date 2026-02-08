import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function formatMonth(date: string | Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function getMonthRange(date: Date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
  return { start, end };
}

// Limite MEI 2024: R$ 81.000,00/ano
export const MEI_ANNUAL_LIMIT = 81000;
export const MEI_MONTHLY_LIMIT = MEI_ANNUAL_LIMIT / 12;

export function calculateMEIUsage(annualRevenue: number): {
  percentage: number;
  remaining: number;
  isOverLimit: boolean;
} {
  const percentage = (annualRevenue / MEI_ANNUAL_LIMIT) * 100;
  const remaining = MEI_ANNUAL_LIMIT - annualRevenue;
  return {
    percentage: Math.min(percentage, 100),
    remaining: Math.max(remaining, 0),
    isOverLimit: annualRevenue > MEI_ANNUAL_LIMIT,
  };
}
