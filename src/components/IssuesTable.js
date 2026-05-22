import React, { useState } from 'react';
import '../styles/main.css';

function IssuesTable({ issues }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'nulls' | 'errors'
  const [sortConfig, setSortConfig] = useState({ key: 'null_count', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');

  const columns = (issues?.columns || []).filter(col => 
    col.name && col.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalNulls = issues?.total_nulls ?? 0;
  const totalErrors = issues?.total_errors ?? 0;

  // Apply filter
  const filteredColumns = columns.filter((col) => {
    if (filter === 'nulls') return col.null_count > 0;
    if (filter === 'errors') return col.error_count > 0;
    return true;
  });

  // Apply sort
  const sortedColumns = [...filteredColumns].sort((a, b) => {
    const valA = a[sortConfig.key] ?? 0;
    const valB = b[sortConfig.key] ?? 0;
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'desc' }
    );
  };

  const sortIcon = (key) => {
    if (sortConfig.key !== key) return ' ⇅';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  const nullSeverity = (pct) => {
    if (pct === 0) return '';
    if (pct < 10) return 'severity-low';
    if (pct < 50) return 'severity-medium';
    return 'severity-high';
  };

  if (!issues) {
    return (
      <div className="issues-table-container">
        <h2>Issues Table</h2>
        <div className="empty-state">
          <p>Upload a file to view data issues</p>
        </div>
      </div>
    );
  }

  return (
    <div className="issues-table-container">
      <h2>Data Issues</h2>

      {/* Summary badges */}
      <div className="issues-summary">
        <span className={`issues-badge ${totalNulls > 0 ? 'badge-warning' : 'badge-ok'}`}>
          Null Values: {totalNulls}
        </span>
        <span className={`issues-badge ${totalErrors > 0 ? 'badge-error' : 'badge-ok'}`}>
          Errors: {totalErrors}
        </span>
        <span className="issues-badge badge-info">
          Columns: {columns.length}
        </span>
      </div>

      {/* Search input */}
      <div className="issues-search">
        <input
          type="text"
          placeholder="🔍 Search columns by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Filter tabs */}
      <div className="issues-filter-tabs">
        {['all', 'nulls', 'errors'].map((tab) => (
          <button
            key={tab}
            className={`filter-tab ${filter === tab ? 'active' : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab === 'all' ? 'All Columns' : tab === 'nulls' ? 'Has Nulls' : 'Has Errors'}
          </button>
        ))}
      </div>

      {sortedColumns.length === 0 ? (
        <div className="empty-state">
          <p>
            {filter === 'nulls'
              ? 'No columns with null values'
              : filter === 'errors'
              ? 'No columns with errors'
              : 'No columns found'}
          </p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="issues-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable">
                  Column Name{sortIcon('name')}
                </th>
                <th onClick={() => handleSort('dtype')} className="sortable">
                  Data Type{sortIcon('dtype')}
                </th>
                <th onClick={() => handleSort('null_count')} className="sortable">
                  Null Count{sortIcon('null_count')}
                </th>
                <th onClick={() => handleSort('null_percentage')} className="sortable">
                  Null %{sortIcon('null_percentage')}
                </th>
                <th onClick={() => handleSort('error_count')} className="sortable">
                  Error Count{sortIcon('error_count')}
                </th>
                <th>Error Details</th>
              </tr>
            </thead>
            <tbody>
              {sortedColumns.map((col) => (
                <tr
                  key={col.name}
                  className={`
                    ${col.error_count > 0 ? 'row-has-error' : ''}
                    ${col.null_count > 0 && col.error_count === 0 ? 'row-has-null' : ''}
                  `.trim()}
                >
                  <td className="col-name">{col.name}</td>
                  <td>
                    <span className="dtype-badge">{col.dtype}</span>
                  </td>
                  <td>
                    {col.null_count > 0 ? (
                      <span className="null-indicator">{col.null_count}</span>
                    ) : (
                      <span className="ok-indicator">0</span>
                    )}
                  </td>
                  <td>
                    <div className="null-pct-cell">
                      <span className={`null-pct ${nullSeverity(col.null_percentage)}`}>
                        {col.null_percentage != null
                          ? col.null_percentage.toFixed(1) + '%'
                          : '—'}
                      </span>
                      {col.null_percentage > 0 && (
                        <div className="null-bar-track">
                          <div
                            className={`null-bar-fill ${nullSeverity(col.null_percentage)}`}
                            style={{ width: `${Math.min(col.null_percentage, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    {col.error_count > 0 ? (
                      <span className="error-indicator">{col.error_count}</span>
                    ) : (
                      <span className="ok-indicator">0</span>
                    )}
                  </td>
                  <td className="error-details-cell">
                    {col.errors && col.errors.length > 0 ? (
                      <ul className="error-list">
                        {col.errors.map((err, i) => (
                          <li key={i} className="error-item">{err}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="no-errors">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default IssuesTable;
