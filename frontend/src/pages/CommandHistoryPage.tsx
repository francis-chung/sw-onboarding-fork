import { createColumnHelper } from "@tanstack/react-table";
import Table from "../components/Table";
import type { CommandHistory } from "../utils/types";
import { useCommands } from "../hooks/useCommands";
import { useCommandHistory } from "../hooks/useCommandHistory";
import { useMemo, useState } from "react";
import "./command-history-page.css";

const columnHelper = createColumnHelper<CommandHistory>();

const columns = [
  columnHelper.accessor('command_id', {
    header: 'Command ID',
    cell: info => (info.getValue() as string).slice(0,8) + '...',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('params', {
    header: 'Parameters',
    cell: info => info.getValue() ?? '',
  }),
  columnHelper.accessor('created_at', {
    header: 'Created at',
    cell: info => new Date(info.getValue()).toLocaleString(),
  }),
];



/**
 * @brief CommandHistory component displaying the audit log table
 * @return tsx element of CommandHistory component
 */
function CommandHistoryPage() {
  const { data: commands, isPending: commandsPending, isError: isCommandsError, error: commandsError } = useCommands();
  const [searchId, setSearchId] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("");
  const { data: history, isPending: historyPending, isError: isHistoryError, error: historyError } = useCommandHistory(selectedId);

  const sortedHistory = useMemo(() => {
    if (!history) return [];
    return [...history].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [history]);

  if (commandsPending) {
    return <div className='loading'>Loading commands...</div>;
  }
  if (commandsError) {
    return <div className='error'>Failed to load: {commandsError.message}</div>;
  }

  return (
    <div className='parent-container'>
      <div className='container'>
        <h1>Command History Audit Log</h1>
        <div className='search-bar-container'>
          <input
            type="text"
            className='search-bar'
            placeholder="Search by Command ID..."
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && setSelectedId(searchId)}
          />
        </div>
        {isHistoryError && (
          <div className='error'>Failed to load history: {historyError?.message}</div>
        )}
        <Table data={sortedHistory} columns={columns} containerClassName="w-full max-w-5xl"/>
      </div>
    </div>
  )
}

export default CommandHistoryPage;
