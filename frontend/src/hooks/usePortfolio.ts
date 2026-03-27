import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../api/client";
import type { Portfolio } from "../store/useAppStore";

export function usePortfolio(portfolioId: string) {
  return useQuery({
    queryKey: ["portfolio", portfolioId],
    queryFn: async (): Promise<Portfolio> => {
      const { data } = await apiClient.post<Portfolio>("/portfolio-analysis", {
        portfolio_id: portfolioId,
      });
      return data;
    },
    enabled: portfolioId.length > 0,
    staleTime: 120_000,
  });
}
