"use client";

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Users,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { DashboardSummary } from "@/types";

interface SummaryCardsProps {
  data: DashboardSummary;
}

export function SummaryCards({ data }: SummaryCardsProps) {
  const cards = [
    {
      title: "Receitas do Mês",
      value: formatCurrency(data.totalIncome),
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Despesas do Mês",
      value: formatCurrency(data.totalExpense),
      icon: TrendingDown,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Saldo do Mês",
      value: formatCurrency(data.balance),
      icon: Wallet,
      color: data.balance >= 0 ? "text-blue-600" : "text-red-600",
      bg: data.balance >= 0 ? "bg-blue-50" : "bg-red-50",
    },
    {
      title: "Clientes",
      value: String(data.clientCount),
      icon: Users,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`rounded-lg p-2 ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
