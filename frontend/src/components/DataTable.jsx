import LoadingState from './LoadingState.jsx';
import { displayValue, toList } from '../utils/format.js';

/*
 * columns: [{ key, label, render?(row), className?, align?: 'left' | 'right' | 'center', nowrap?: boolean }]
 * rows may be an array or a wrapped API payload ({ content: [...] }).
 */
export default function DataTable({ columns, rows = [], loading = false, error = '', emptyMessage = 'No records found.' }) {
  if (loading) return <LoadingState label="Loading records…" />;
  if (error) return <div className="table-feedback" role="alert">{error}</div>;
  const list = toList(rows);
  const cellClass = (column) => [column.className, column.align && `cell-${column.align}`, column.nowrap && 'cell-nowrap'].filter(Boolean).join(' ') || undefined;
  return <div className="table-scroll">
    <table className="data-table">
      <thead><tr>{columns.map((column) => <th key={column.key} className={cellClass(column)} scope="col">{column.label}</th>)}</tr></thead>
      <tbody>
        {list.map((row, index) => <tr key={row.id ?? row.employeeId ?? index}>
          {columns.map((column) => <td key={column.key} data-label={column.label} className={cellClass(column)}>{column.render ? column.render(row) : displayValue(row[column.key])}</td>)}
        </tr>)}
      </tbody>
    </table>
    {list.length === 0 && <div className="empty-state"><span>—</span><p>{emptyMessage}</p></div>}
  </div>;
}
