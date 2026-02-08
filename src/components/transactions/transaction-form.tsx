"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useClients } from "@/hooks/use-clients";
import {
  CATEGORY_LABELS,
  PAYMENT_METHOD_LABELS,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  type TransactionFormData,
  type Transaction,
} from "@/types";

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TransactionForm({
  transaction,
  onSubmit,
  onCancel,
  isLoading,
}: TransactionFormProps) {
  const { data: clients } = useClients();

  const [form, setForm] = useState<TransactionFormData>({
    type: transaction?.type ?? "income",
    category: transaction?.category ?? "service",
    description: transaction?.description ?? "",
    amount: transaction?.amount ?? 0,
    date: transaction?.date ?? new Date().toISOString().split("T")[0],
    client_id: transaction?.client_id ?? "",
    payment_method: transaction?.payment_method ?? "pix",
    is_recurring: transaction?.is_recurring ?? false,
    recurring_interval: transaction?.recurring_interval ?? "",
    notes: transaction?.notes ?? "",
  });

  const categories =
    form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tipo */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant={form.type === "income" ? "default" : "outline"}
          className={form.type === "income" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          onClick={() =>
            setForm({ ...form, type: "income", category: "service" })
          }
        >
          Receita
        </Button>
        <Button
          type="button"
          variant={form.type === "expense" ? "default" : "outline"}
          className={form.type === "expense" ? "bg-red-600 hover:bg-red-700" : ""}
          onClick={() =>
            setForm({ ...form, type: "expense", category: "rent" })
          }
        >
          Despesa
        </Button>
      </div>

      {/* Descrição e Valor */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="description">Descrição *</Label>
          <Input
            id="description"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Ex: Serviço de consultoria"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Valor (R$) *</Label>
          <Input
            id="amount"
            type="number"
            required
            min="0.01"
            step="0.01"
            value={form.amount || ""}
            onChange={(e) =>
              setForm({ ...form, amount: parseFloat(e.target.value) || 0 })
            }
            placeholder="0,00"
          />
        </div>
      </div>

      {/* Categoria e Data */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Categoria *</Label>
          <Select
            id="category"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value as any })
            }
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Data *</Label>
          <Input
            id="date"
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
      </div>

      {/* Pagamento e Cliente */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="payment_method">Forma de Pagamento</Label>
          <Select
            id="payment_method"
            value={form.payment_method}
            onChange={(e) =>
              setForm({ ...form, payment_method: e.target.value as any })
            }
          >
            {Object.entries(PAYMENT_METHOD_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="client_id">Cliente</Label>
          <Select
            id="client_id"
            value={form.client_id}
            onChange={(e) => setForm({ ...form, client_id: e.target.value })}
          >
            <option value="">Nenhum</option>
            {clients?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Recorrência */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_recurring}
            onChange={(e) =>
              setForm({ ...form, is_recurring: e.target.checked })
            }
            className="rounded border-input"
          />
          Transação recorrente
        </label>
        {form.is_recurring && (
          <Select
            value={form.recurring_interval}
            onChange={(e) =>
              setForm({ ...form, recurring_interval: e.target.value as any })
            }
            className="w-40"
          >
            <option value="monthly">Mensal</option>
            <option value="weekly">Semanal</option>
          </Select>
        )}
      </div>

      {/* Notas */}
      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <textarea
          id="notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Observações adicionais..."
          className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Salvando..."
            : transaction
            ? "Atualizar"
            : "Registrar"}
        </Button>
      </div>
    </form>
  );
}
