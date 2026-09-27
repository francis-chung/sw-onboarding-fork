import { createColumnHelper, flexRender } from "@tanstack/react-table";
import Table from "../components/Table";
import type { Command } from "../utils/types";
import { useCommands } from "../hooks/useCommands";
import { useCommandHistory } from "../hooks/useCommandHistory";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "./command-history-page.css";

const columnHelper = createColumnHelper<Command>();

const columns = [
  columnHelper.accessor('id', {
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
    header: 'Timestamp',
    cell: info => new Date(info.getValue()).toLocaleString(),
  }),
];



/**
 * @brief CommandHistory component displaying the audit log table
 * @return tsx element of CommandHistory component
 */
function CommandHistoryPage() {
  const { data: commands, isPending, isError, error } = useCommands();
  const [selectedId, setSelectedId] = useState<string>("");
  const [searchId, setSearchId] = useState<string>("");

  // filters by command id and memoizes result
  const filteredCommands = useMemo(() => {
    if (!commands) return [];
    if (!selectedId.trim()) return commands;
    const lower = selectedId.toLowerCase();
    return commands.filter(cmd => cmd.id.toLowerCase().includes(lower))
  }, [commands, selectedId]);

  const sortedCommands = useMemo(() =>
    [...filteredCommands].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ), [filteredCommands]);

  if (isPending) {
    return <div className='loading'>Loading commands...</div>;
  }
  if (isError) {
    return <div className='error'>Failed to load: {error.message}</div>;
  }

  return (
    <div className='parent-container'>
      <div className='container'>
        <div className='search-bar-container'>
          <input
            type="text"
            className='search-bar'
            placeholder="Search by Command ID..."
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && setSelectedId(searchId)}
          />
          <button
            className='search-button'
            onClick={_ => setSelectedId(searchId)}
          >
            Search
          </button>
        </div>
        <Table data={sortedCommands} columns={columns} containerClassName="w-full max-w-5xl"/>
      </div>
    </div>
  )
}

export default CommandHistoryPage;
