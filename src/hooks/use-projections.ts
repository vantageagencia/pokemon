"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjections, upsertProjection } from "@/lib/supabase/api";

export function useProjections(year?: number) {
  return useQuery({
    queryKey: ["projections", year],
    queryFn: () => getProjections(year),
  });
}

export function useUpsertProjection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      month: string;
      projected_income: number;
      projected_expense: number;
      notes?: string;
    }) => upsertProjection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projections"] });
    },
  });
}
