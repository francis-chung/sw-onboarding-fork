import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import type { CommandHistory } from "../utils/types";

export function useCommandHistory(
  commandId: string,
): UseQueryResult<CommandHistory[]> {
  const REFETCH_INTERVAL = 5000;

  return useQuery({
    queryKey: ['commandHistory', commandId],
    queryFn: async () => fetch(`/api/commands/${commandId}/history`).then(res => res.json()).then(d => d.data),
    refetchInterval: REFETCH_INTERVAL,
    enabled: !!commandId,
  })
}
