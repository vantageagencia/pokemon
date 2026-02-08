"use client";

import { AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface MeiLimitCardProps {
  annualRevenue: number;
  percentage: number;
  remaining: number;
}

export function MeiLimitCard({
  annualRevenue,
  percentage,
  remaining,
}: MeiLimitCardProps) {
  const isWarning = percentage >= 80;
  const isDanger = percentage >= 95;

  return (
    <Card className={isDanger ? "border-red-300" : isWarning ? "border-amber-300" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Limite Anual MEI
        </CardTitle>
        {isDanger ? (
          <AlertTriangle className="h-5 w-5 text-red-500" />
        ) : isWarning ? (
          <AlertTriangle className="h-5 w-5 text-amber-500" />
        ) : (
          <CheckCircle className="h-5 w-5 text-emerald-500" />
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold">
              {percentage.toFixed(1)}%
            </span>
            <span className="text-sm text-muted-foreground">
              {formatCurrency(annualRevenue)} / {formatCurrency(81000)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-2 h-3 w-full rounded-full bg-secondary">
            <div
              className={`h-3 rounded-full transition-all ${
                isDanger
                  ? "bg-red-500"
                  : isWarning
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {remaining > 0
            ? `Restam ${formatCurrency(remaining)} para o limite anual`
            : "Limite anual ultrapassado! Considere migrar para ME."}
        </p>
      </CardContent>
    </Card>
  );
}
