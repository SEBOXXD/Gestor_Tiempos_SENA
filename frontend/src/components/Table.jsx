import "../styles/Table.css"

function Table({ columns, data, onRowClick, className = "" }) {
  return (
    <table className={`reusable-table ${className}`}>
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={i} style={col.width ? { width: col.width } : undefined}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            onClick={() => onRowClick && onRowClick(row)}
            style={{ cursor: onRowClick ? "pointer" : "default" }}
          >
            {columns.map((col, colIndex) => (
              <td key={colIndex}>
                {col.render ? col.render(row, rowIndex) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
