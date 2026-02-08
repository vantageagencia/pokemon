export interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  document: string | null; // CPF ou CNPJ
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  type: "income" | "expense";
  category: TransactionCategory;
  description: string;
  amount: number;
  date: string;
  client_id: string | null;
  client?: Client;
  payment_method: PaymentMethod;
  is_recurring: boolean;
  recurring_interval: "monthly" | "weekly" | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Projection {
  id: string;
  month: string; // YYYY-MM
  projected_income: number;
  projected_expense: number;
  actual_income: number;
  actual_expense: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  annualRevenue: number;
  meiUsagePercentage: number;
  meiRemaining: number;
  clientCount: number;
  transactionCount: number;
  recentTransactions: Transaction[];
  monthlyData: MonthlyData[];
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export type TransactionCategory =
  | "service"         // Prestação de serviço
  | "product"         // Venda de produto
  | "rent"            // Aluguel
  | "utilities"       // Água, luz, internet
  | "supplies"        // Material de escritório/trabalho
  | "transport"       // Transporte
  | "food"            // Alimentação
  | "marketing"       // Marketing/Publicidade
  | "taxes"           // Impostos (DAS-MEI)
  | "software"        // Softwares e assinaturas
  | "equipment"       // Equipamentos
  | "other_income"    // Outras receitas
  | "other_expense";  // Outras despesas

export type PaymentMethod =
  | "pix"
  | "cash"
  | "credit_card"
  | "debit_card"
  | "bank_transfer"
  | "boleto"
  | "other";

export const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  service: "Prestação de Serviço",
  product: "Venda de Produto",
  rent: "Aluguel",
  utilities: "Água / Luz / Internet",
  supplies: "Material",
  transport: "Transporte",
  food: "Alimentação",
  marketing: "Marketing",
  taxes: "Impostos (DAS-MEI)",
  software: "Softwares / Assinaturas",
  equipment: "Equipamentos",
  other_income: "Outras Receitas",
  other_expense: "Outras Despesas",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  pix: "PIX",
  cash: "Dinheiro",
  credit_card: "Cartão de Crédito",
  debit_card: "Cartão de Débito",
  bank_transfer: "Transferência Bancária",
  boleto: "Boleto",
  other: "Outro",
};

export const INCOME_CATEGORIES: TransactionCategory[] = [
  "service",
  "product",
  "other_income",
];

export const EXPENSE_CATEGORIES: TransactionCategory[] = [
  "rent",
  "utilities",
  "supplies",
  "transport",
  "food",
  "marketing",
  "taxes",
  "software",
  "equipment",
  "other_expense",
];

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  document: string;
  address: string;
  notes: string;
}

export interface TransactionFormData {
  type: "income" | "expense";
  category: TransactionCategory;
  description: string;
  amount: number;
  date: string;
  client_id: string;
  payment_method: PaymentMethod;
  is_recurring: boolean;
  recurring_interval: "monthly" | "weekly" | "";
  notes: string;
}
