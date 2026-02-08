"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "@/lib/supabase/api";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
  });
}
