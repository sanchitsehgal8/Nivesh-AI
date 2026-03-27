import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../api/client";
import type { Signal } from "../store/useAppStore";

type SignalsResponse = { signals: Signal[] };

export function useSignals() {
  return useQuery({
    queryKey: ["signals", "latest"],
    queryFn: async (): Promise<Signal[]> => {
      const { data } = await apiClient.get<SignalsResponse>("/signals/latest");
      return data.signals;
    },
    refetchInterval: 60_000,
  });
}
