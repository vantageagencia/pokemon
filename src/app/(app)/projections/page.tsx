"use client";

import { useState } from "react";
import { useProjections, useUpsertProjection } from "@/hooks/use-projections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Plus, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function ProjectionsPage() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const { data: projections, isLoading } = useProjections(year);
  const upsertProjection = useUpsertProjection();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMonth, setEditMonth] = useState("");
  const [formIncome, setFormIncome] = useState(0);
  const [formExpense, setFormExpense] = useState(0);

  const openEdit = (month: string, income = 0, expense = 0) => {
    setEditMonth(month);
    setFormIncome(income);
    setFormExpense(expense);
    setDialogOpen(true);
  };

  const handleSave = () => {
    upsertProjection.mutate(
      {
        month: editMonth,
        projected_income: formIncome,
        projected_expense: formExpense,
      },
      { onSuccess: () => setDialogOpen(false) }
    );
  };

  // Build all 12 months
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = `${year}-${String(i + 1).padStart(2, "0")}`;
    const proj = projections?.find((p) => p.month === month);
    return {
      month,
      name: MONTH_NAMES[i],
      projected_income: proj?.projected_income ?? 0,
      projected_expense: proj?.projected_expense ?? 0,
      actual_income: proj?.actual_income ?? 0,
      actual_expense: proj?.actual_expense ?? 0,
    };
  });

  const totalProjectedIncome = months.reduce(
    (s, m) => s + Number(m.projected_income),
    0
  );
  const totalProjectedExpense = months.reduce(
    (s, m) => s + Number(m.projected_expense),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projeções</h2>
          <p className="text-muted-foreground">
            Planeje suas receitas e despesas mensais.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setYear(year - 1)}
          >
            &larr;
          </Button>
          <Badge variant="secondary" className="text-base px-4 py-1">
            {year}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setYear(year + 1)}
          >
            &rarr;
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <p className="text-xs text-muted-foreground">
                Receitas Projetadas ({year})
              </p>
            </div>
            <p className="text-xl font-bold text-emerald-600">
              {formatCurrency(totalProjectedIncome)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <p className="text-xs text-muted-foreground">
                Despesas Projetadas ({year})
              </p>
            </div>
            <p className="text-xl font-bold text-red-600">
              {formatCurrency(totalProjectedExpense)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">
              Saldo Projetado ({year})
            </p>
            <p
              className={`text-xl font-bold ${
                totalProjectedIncome - totalProjectedExpense >= 0
                  ? "text-blue-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(totalProjectedIncome - totalProjectedExpense)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projeção Mensal - {year}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mês</TableHead>
                  <TableHead className="text-right">
                    Receita Projetada
                  </TableHead>
                  <TableHead className="text-right">
                    Despesa Projetada
                  </TableHead>
                  <TableHead className="text-right">Saldo Projetado</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {months.map((m) => {
                  const balance =
                    Number(m.projected_income) - Number(m.projected_expense);
                  return (
                    <TableRow key={m.month}>
                      <TableCell className="font-medium">{m.name}</TableCell>
                      <TableCell className="text-right text-emerald-600">
                        {formatCurrency(Number(m.projected_income))}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(Number(m.projected_expense))}
                      </TableCell>
                      <TableCell
                        className={`text-right font-semibold ${
                          balance >= 0 ? "text-blue-600" : "text-red-600"
                        }`}
                      >
                        {formatCurrency(balance)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            openEdit(
                              m.month,
                              Number(m.projected_income),
                              Number(m.projected_expense)
                            )
                          }
                        >
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Editar Projeção -{" "}
              {editMonth &&
                MONTH_NAMES[parseInt(editMonth.split("-")[1]) - 1]}{" "}
              {year}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Receita Projetada (R$)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formIncome || ""}
                onChange={(e) => setFormIncome(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Despesa Projetada (R$)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formExpense || ""}
                onChange={(e) =>
                  setFormExpense(parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={upsertProjection.isPending}
              >
                {upsertProjection.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
