"use client";

import { useDashboard } from "@/hooks/use-dashboard";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { MeiLimitCard } from "@/components/dashboard/mei-limit-card";
import { MonthlyChart } from "@/components/dashboard/monthly-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
        <p className="text-destructive font-medium">Erro ao carregar dashboard</p>
        <p className="text-sm text-muted-foreground mt-1">
          Verifique a conexão com o Supabase e tente novamente.
        </p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral das suas finanças como MEI.
        </p>
      </div>

      <SummaryCards data={data} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MonthlyChart data={data.monthlyData} />
        </div>
        <MeiLimitCard
          annualRevenue={data.annualRevenue}
          percentage={data.meiUsagePercentage}
          remaining={data.meiRemaining}
        />
      </div>

      <RecentTransactions transactions={data.recentTransactions} />
    </div>
  );
}
