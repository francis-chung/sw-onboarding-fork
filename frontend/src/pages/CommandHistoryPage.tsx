import { createColumnHelper, flexRender } from "@tanstack/react-table";
import Table from "../components/Table";
import type { CommandHistory } from "../utils/types";
import { useCommands } from "../hooks/useCommands";
import { useCommandHistory } from "../hooks/useCommandHistory";
import { useEffect, useState } from "react";
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



/**
 * @brief CommandHistory component displaying the audit log table
 * @return tsx element of CommandHistory component
 */
function CommandHistoryPage() {
  const { data: commands } = useCommands();
  const [selectedId, setSelectedId] = useState<string>("");
  const { data: history } = useCommandHistory(selectedId);

  // selects the id of the first valid command on load
  // required to render the table immediately for the tests
  useEffect(() => {
    if (commands?.length && !selectedId) {
      setSelectedId(commands[0].id);
    }
  }, [commands, selectedId]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 8,
    }}>
      <select
        value={selectedId}
        onChange={e => setSelectedId(e.target.value)}
        style={{
          marginBottom: "1rem",
          width: "full",
          maxWidth: "28rem",
        }}
      >
        <option value="">Select a command</option>
        {commands?.map((cmd: any) => (
          <option key={cmd.id} value={cmd.id}>{cmd.id.slice(0,8)}... ({cmd.status})</option>
        ))}
      </select>
      {selectedId && (
        <Table
          data={history ?? []}
          columns={columns}
          containerClassName="w-full max-w-5xl"
        />
      )}
    </div>
  )
}

export default CommandHistoryPage;
