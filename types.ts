// FIX: Import `ReactNode` to resolve the 'Cannot find namespace React' error.
import type { ReactNode } from 'react';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  source?: string; // ej: 'BBVA', 'Santander', el origen de los datos de la transacción
}

export interface BankAccount {
    id: string;
    bankName: string; // e.g., 'Cajamar', 'BBVA'
    accountName: string; // e.g., 'Cuenta Nómina', 'Ahorros'
    accountNumber: string; // e.g., IBAN
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  netMargin: number;
}

export interface AnnualComparisonData {
    year: number;
    income: number;
    expenses: number;
    netMargin: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface KpiCardProps {
    title: string;
    value: string;
    // FIX: Use the imported `ReactNode` type directly.
    icon: ReactNode;
    color: string;
}

// Types for Smart Import
export interface AnalyzedTransaction {
  fecha: string; // YYYY-MM-DD
  descripcion: string;
  importe: number;
  tipo: 'ingreso' | 'gasto';
  categoriaSugerida: string;
}

export interface AIError {
  linea: string;
  error: string;
}

export interface AIResponse {
  transacciones: AnalyzedTransaction[];
  errores: AIError[];
}

export interface ReviewTransaction extends AnalyzedTransaction {
  id: string; // For React keys during review
}

// Type for Backup
export interface BackupData {
    transactions: Transaction[];
    categories: string[];
    bankAccounts: BankAccount[];
    backupDate: string;
}