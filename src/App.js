import React, { useState } from 'react';
import Upload from './components/Upload';
import Dashboard from './components/Dashboard';
import IssuesTable from './components/IssuesTable';
import { getDataQuality, getIssues } from './services/api';
import './styles/main.css';

function App() {
  const [dataStats, setDataStats] = useState({
    rows: 0,
    columns: 0,
    duplicates: 0,
    duplicatePercentage: 0,
    columnNames: []
  });
  const [issues, setIssues] = useState(null);

  const handleUploadSuccess = async (uploadResult) => {
    try {
      const [quality, issuesData] = await Promise.all([
        getDataQuality(uploadResult.filename),
        getIssues(uploadResult.filename),
      ]);
      setDataStats(quality);
      setIssues(issuesData);
    } catch (error) {
      console.error('Error fetching data quality:', error);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>📈 Data Quality Dashboard</h1>
        <p className="subtitle">Analyze and monitor your data quality</p>
      </header>
      
      <main className="app-main">
        <div className="upload-section">
          <Upload onUploadSuccess={handleUploadSuccess} />
        </div>
        
        <div className="dashboard-section">
          <Dashboard dataStats={dataStats} />
        </div>
      </main>

      <div className="issues-section">
        <IssuesTable issues={issues} />
      </div>
    </div>
  );
}

export default App;
