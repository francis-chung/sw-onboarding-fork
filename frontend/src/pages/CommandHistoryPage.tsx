import { createColumnHelper, flexRender } from "@tanstack/react-table";
import Table from "../components/Table";
import type { CommandHistory } from "../utils/types";
import { useCommandHistory } from "../hooks/useCommandHistory";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const columnHelper = createColumnHelper<CommandHistory>();

const columns = [
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('params', {
    header: 'Parameters',
    cell: info => info.getValue() ?? '',
  }),
  columnHelper.accessor('created_at', {
    header: 'Timestamp',
    cell: info => new Date(info.getValue()).toLocaleString(),
  }),
];

export function useCommands() {
  return useQuery({
    queryKey: ['commands'],
    queryFn: () => fetch('/api/commands').then(res => res.json()).then(d => d.data),
  });
}

/**
 * @brief CommandHistory component displaying the audit log table
 * @return tsx element of CommandHistory component
 */
function CommandHistoryPage() {
  // TODO: (STEP 8) Fetch the command history with useCommandHistory and pass the resulting
  // CommandHistory[] directly to the Table component.
  //
  // The page must provide a way for the user to select which command's audit log they want to view.
  // The selected command should determine which command history is fetched.
  // The table should communicate that this is an audit log.
  // The table should be centred on the page.

}

export default CommandHistoryPage;
