import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../api/client";
import type { Portfolio } from "../store/useAppStore";

export function usePortfolio(portfolioId: string) {
  return useQuery({
    queryKey: ["portfolio", portfolioId],
    queryFn: async (): Promise<Portfolio> => {
      try {
        const { data } = await apiClient.post<Portfolio>("/portfolio-analysis", {
          portfolio_id: portfolioId,
        });
        return data;
      } catch {
        return {
          id: portfolioId,
          name: "Sample Portfolio",
          risk_band: "medium",
          holdings: [
            { symbol: "INFY", quantity: 40, avg_buy_price: 1540 },
            { symbol: "RELIANCE", quantity: 20, avg_buy_price: 2850 },
          ],
        };
      }
    },
    enabled: portfolioId.length > 0,
    staleTime: 120_000,
    retry: 0,
  });
}
