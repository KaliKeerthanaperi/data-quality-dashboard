import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import './Charts.css';

function Charts({ issues }) {
  const [nullDistData, setNullDistData] = useState([]);
  const [columnStatsData, setColumnStatsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const issueColumns = issues?.columns || [];

  useEffect(() => {
    setIsLoading(true);
    // Simulate processing delay for better UX
    const timer = setTimeout(() => {
      if (issues && issueColumns.length > 0) {
        // Prepare data for null distribution chart
        const nullData = issueColumns.map((col) => ({
          name: col.name,
          nullCount: col.null_count,
          nullPercentage: Number(col.null_percentage || 0),
        }));
        setNullDistData(nullData);

        // Prepare data for column stats chart
        const statsData = issueColumns.map((col) => ({
          name: col.name,
          errorCount: col.error_count,
          dataType: col.dtype,
        }));
        setColumnStatsData(statsData);
      } else {
        setNullDistData([]);
        setColumnStatsData([]);
      }
      setIsLoading(false);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [issues, issueColumns]);

  const getColorByDataType = (dtype) => {
    const safeDtype = String(dtype || '').toLowerCase();
    if (safeDtype.includes('int') || safeDtype.includes('float')) return '#3b82f6';
    if (safeDtype.includes('object') || safeDtype.includes('string')) return '#10b981';
    if (safeDtype.includes('bool')) return '#f59e0b';
    if (safeDtype.includes('datetime') || safeDtype.includes('date')) return '#8b5cf6';
    return '#6b7280';
  };

  const getColorByErrorCount = (errorCount) => {
    if (errorCount === 0) return '#10b981'; // Green
    if (errorCount < 5) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  return (
    <div className="charts-container">
      <h2>📊 Data Analysis Charts</h2>

      {isLoading && (
        <div className="loading-state">
          <p>Loading charts...</p>
        </div>
      )}

      {!isLoading && (!issues || issueColumns.length === 0) ? (
        <div className="empty-chart-state">
          <p>Upload a file to view data distribution and column statistics</p>
        </div>
      ) : !isLoading && (
        <div className="charts-grid">
          {/* Null Distribution Chart */}
          <div className="chart-wrapper">
            <div className="chart-header">
              <h3>📍 Null Distribution</h3>
              <p className="chart-subtitle">
                Missing values per column
              </p>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={nullDistData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                  }}
                  formatter={(value, name) => {
                    if (name === 'nullCount') return [value, 'Null Count'];
                    if (name === 'nullPercentage')
                      return [value.toFixed(2) + '%', 'Null %'];
                    return value;
                  }}
                />
                <Legend />
                <Bar dataKey="nullCount" fill="#ef4444" name="Null Count" />
                <Bar
                  dataKey="nullPercentage"
                  fill="#f59e0b"
                  name="Null %"
                  yAxisId="right"
                />
                <YAxis yAxisId="right" orientation="right" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Column Stats Chart */}
          <div className="chart-wrapper">
            <div className="chart-header">
              <h3>📈 Column Statistics</h3>
              <p className="chart-subtitle">
                Data types and error counts
              </p>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={columnStatsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                  }}
                  formatter={(value, name) => {
                    if (name === 'errorCount') return [value, 'Error Count'];
                    if (name === 'dataType') return [value, 'Data Type'];
                    return value;
                  }}
                />
                <Legend />
                <Bar dataKey="errorCount" name="Error Count">
                  {columnStatsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getColorByErrorCount(entry.errorCount)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Column Details Summary */}
          <div className="chart-wrapper full-width">
            <div className="chart-header">
              <h3>📋 Column Details Summary</h3>
            </div>
            <div className="details-table">
              <table>
                <thead>
                  <tr>
                    <th>Column Name</th>
                    <th>Data Type</th>
                    <th>Null Count</th>
                    <th>Null %</th>
                    <th>Errors</th>
                  </tr>
                </thead>
                <tbody>
                  {issueColumns.map((col, idx) => (
                    <tr key={idx} className={col.error_count > 0 ? 'error-row' : ''}>
                      <td className="col-name">{col.name}</td>
                      <td>
                        <span
                          className="dtype-badge"
                          style={{
                            backgroundColor: getColorByDataType(col.dtype),
                          }}
                        >
                          {col.dtype}
                        </span>
                      </td>
                      <td>{col.null_count}</td>
                      <td>{Number(col.null_percentage || 0).toFixed(2)}%</td>
                      <td>
                        {col.error_count > 0 ? (
                          <div className="error-details">
                            <span className="error-count">{col.error_count}</span>
                            <ul className="error-list">
                              {(col.errors || []).map((error, i) => (
                                <li key={i}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <span className="no-errors">✓</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Charts;
