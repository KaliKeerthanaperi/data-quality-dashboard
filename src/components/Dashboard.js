import React, { useState, useEffect } from 'react';
import '../styles/main.css';

function Dashboard({ dataStats }) {
  const [stats, setStats] = useState({
    rows: 0,
    columns: 0,
    duplicates: 0,
    duplicatePercentage: 0,
    columnNames: []
  });

  useEffect(() => {
    if (dataStats) {
      setStats(dataStats);
    }
  }, [dataStats]);

  return (
    <div className="dashboard-container">
      <h2>Data Quality Metrics</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Rows</h3>
            <p className="stat-value">{stats.rows}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔢</div>
          <div className="stat-content">
            <h3>Total Columns</h3>
            <p className="stat-value">{stats.columns}</p>
            {stats.columnNames && stats.columnNames.length > 0 && (
              <p className="column-names">{stats.columnNames.join(', ')}</p>
            )}
          </div>
        </div>

        <div className="stat-card duplicate-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Duplicate Rows</h3>
            <p className="stat-value">{stats.duplicates}</p>
            {stats.duplicatePercentage && (
              <p className="duplicate-percentage">{stats.duplicatePercentage.toFixed(2)}% duplicates</p>
            )}
          </div>
        </div>
      </div>

      {stats.rows === 0 && (
        <div className="empty-state">
          <p>Upload a file to view data quality metrics</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
