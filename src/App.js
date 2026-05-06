import React, { useState } from 'react';
import Upload from './components/Upload';
import Dashboard from './components/Dashboard';
import { getDataQuality } from './services/api';
import './styles/main.css';

function App() {
  const [dataStats, setDataStats] = useState({
    rows: 0,
    columns: 0,
    duplicates: 0,
    duplicatePercentage: 0,
    columnNames: []
  });

  const handleUploadSuccess = async (uploadResult) => {
    try {
      const quality = await getDataQuality(uploadResult.filename);
      setDataStats(quality);
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
    </div>
  );
}

export default App;
