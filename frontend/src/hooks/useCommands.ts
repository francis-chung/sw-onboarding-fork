import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Command } from "../utils/types";

export function useCommands(): UseQueryResult<Command[]> {
  return useQuery({
    queryKey: ['commands'],
    queryFn: () => fetch('/api/commands').then(res => res.json()).then(d => d.data),
  });
}
