import { supabase } from "./client";
import type {
  Client,
  ClientFormData,
  Transaction,
  TransactionFormData,
  Projection,
} from "@/types";

// ============ CLIENTS ============

export async function getClients() {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("name");
  if (error) throw error;
  return data as Client[];
}

export async function getClient(id: string) {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Client;
}

export async function createClient(client: ClientFormData) {
  const { data, error } = await supabase
    .from("clients")
    .insert(client)
    .select()
    .single();
  if (error) throw error;
  return data as Client;
}

export async function updateClient(id: string, client: Partial<ClientFormData>) {
  const { data, error } = await supabase
    .from("clients")
    .update(client)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Client;
}

export async function deleteClient(id: string) {
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) throw error;
}

// ============ TRANSACTIONS ============

export async function getTransactions(params?: {
  startDate?: string;
  endDate?: string;
  type?: "income" | "expense";
  clientId?: string;
}) {
  let query = supabase
    .from("transactions")
    .select("*, client:clients(id, name)")
    .order("date", { ascending: false });

  if (params?.startDate) {
    query = query.gte("date", params.startDate);
  }
  if (params?.endDate) {
    query = query.lte("date", params.endDate);
  }
  if (params?.type) {
    query = query.eq("type", params.type);
  }
  if (params?.clientId) {
    query = query.eq("client_id", params.clientId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Transaction[];
}

export async function createTransaction(transaction: TransactionFormData) {
  const payload = {
    ...transaction,
    client_id: transaction.client_id || null,
    recurring_interval: transaction.recurring_interval || null,
  };

  const { data, error } = await supabase
    .from("transactions")
    .insert(payload)
    .select("*, client:clients(id, name)")
    .single();
  if (error) throw error;
  return data as Transaction;
}

export async function updateTransaction(
  id: string,
  transaction: Partial<TransactionFormData>
) {
  const { data, error } = await supabase
    .from("transactions")
    .update(transaction)
    .eq("id", id)
    .select("*, client:clients(id, name)")
    .single();
  if (error) throw error;
  return data as Transaction;
}

export async function deleteTransaction(id: string) {
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
}

// ============ PROJECTIONS ============

export async function getProjections(year?: number) {
  const currentYear = year || new Date().getFullYear();
  const { data, error } = await supabase
    .from("projections")
    .select("*")
    .gte("month", `${currentYear}-01`)
    .lte("month", `${currentYear}-12`)
    .order("month");
  if (error) throw error;
  return data as Projection[];
}

export async function upsertProjection(projection: {
  month: string;
  projected_income: number;
  projected_expense: number;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from("projections")
    .upsert(projection, { onConflict: "month" })
    .select()
    .single();
  if (error) throw error;
  return data as Projection;
}

// ============ DASHBOARD ============

export async function getDashboardData() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const startOfYear = `${currentYear}-01-01`;
  const endOfYear = `${currentYear}-12-31`;
  const startOfMonth = `${currentYear}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const endOfMonth = new Date(currentYear, now.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  const [transactionsRes, clientsRes, yearTransactionsRes] = await Promise.all([
    supabase
      .from("transactions")
      .select("*, client:clients(id, name)")
      .gte("date", startOfMonth)
      .lte("date", endOfMonth)
      .order("date", { ascending: false }),
    supabase.from("clients").select("id", { count: "exact" }),
    supabase
      .from("transactions")
      .select("type, amount, date")
      .gte("date", startOfYear)
      .lte("date", endOfYear),
  ]);

  if (transactionsRes.error) throw transactionsRes.error;
  if (clientsRes.error) throw clientsRes.error;
  if (yearTransactionsRes.error) throw yearTransactionsRes.error;

  const monthTransactions = transactionsRes.data as Transaction[];
  const yearTransactions = yearTransactionsRes.data;

  const totalIncome = monthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const annualRevenue = yearTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // Montar dados mensais
  const monthlyMap = new Map<string, { income: number; expense: number }>();
  for (let m = 0; m < 12; m++) {
    const key = `${currentYear}-${String(m + 1).padStart(2, "0")}`;
    monthlyMap.set(key, { income: 0, expense: 0 });
  }
  yearTransactions.forEach((t) => {
    const key = t.date.substring(0, 7);
    const entry = monthlyMap.get(key);
    if (entry) {
      if (t.type === "income") entry.income += Number(t.amount);
      else entry.expense += Number(t.amount);
    }
  });

  const monthlyData = Array.from(monthlyMap.entries()).map(([month, data]) => ({
    month,
    income: data.income,
    expense: data.expense,
    balance: data.income - data.expense,
  }));

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    annualRevenue,
    meiUsagePercentage: Math.min((annualRevenue / 81000) * 100, 100),
    meiRemaining: Math.max(81000 - annualRevenue, 0),
    clientCount: clientsRes.count || 0,
    transactionCount: monthTransactions.length,
    recentTransactions: monthTransactions.slice(0, 5),
    monthlyData,
  };
}
