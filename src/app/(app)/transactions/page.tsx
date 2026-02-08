"use client";

import { useState } from "react";
import {
  useTransactions,
  useCreateTransaction,
  useDeleteTransaction,
} from "@/hooks/use-transactions";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  PAYMENT_METHOD_LABELS,
  type TransactionFormData,
} from "@/types";

export default function TransactionsPage() {
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const { data: transactions, isLoading } = useTransactions(
    filter !== "all" ? { type: filter } : undefined
  );
  const createTransaction = useCreateTransaction();
  const deleteTransaction = useDeleteTransaction();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreate = (data: TransactionFormData) => {
    createTransaction.mutate(data, {
      onSuccess: () => setDialogOpen(false),
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta transação?")) {
      deleteTransaction.mutate(id);
    }
  };

  const totals = transactions?.reduce(
    (acc, t) => {
      if (t.type === "income") acc.income += Number(t.amount);
      else acc.expense += Number(t.amount);
      return acc;
    },
    { income: 0, expense: 0 }
  ) ?? { income: 0, expense: 0 };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transações</h2>
          <p className="text-muted-foreground">
            Registre e acompanhe todas as suas movimentações.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
            </DialogHeader>
            <TransactionForm
              onSubmit={handleCreate}
              onCancel={() => setDialogOpen(false)}
              isLoading={createTransaction.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Total Receitas</p>
            <p className="text-xl font-bold text-emerald-600">
              {formatCurrency(totals.income)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Total Despesas</p>
            <p className="text-xl font-bold text-red-600">
              {formatCurrency(totals.expense)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Saldo</p>
            <p
              className={`text-xl font-bold ${
                totals.income - totals.expense >= 0
                  ? "text-blue-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(totals.income - totals.expense)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="w-40"
            >
              <option value="all">Todas</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </Select>
            <Badge variant="secondary">
              {transactions?.length ?? 0} transações
            </Badge>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : transactions && transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div
                        className={`rounded-full p-1 ${
                          t.type === "income"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {t.type === "income" ? (
                          <ArrowDownLeft className="h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{t.description}</p>
                        {t.client && (
                          <p className="text-xs text-muted-foreground">
                            {(t.client as any).name}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {CATEGORY_LABELS[t.category] || t.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(t.date)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {PAYMENT_METHOD_LABELS[t.payment_method] || t.payment_method}
                    </TableCell>
                    <TableCell
                      className={`text-right font-semibold ${
                        t.type === "income"
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive h-8 w-8"
                        onClick={() => handleDelete(t.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nenhuma transação encontrada.</p>
              <p className="text-sm">
                Clique em &quot;Nova Transação&quot; para começar.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
