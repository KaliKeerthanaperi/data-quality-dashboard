import React, { useEffect, useState } from 'react';
import Upload from './components/Upload';
import Dashboard from './components/Dashboard';
import Charts from './components/Charts';
import IssuesTable from './components/IssuesTable';
import { getApiHealth, getDataQuality, getIssues } from './services/api';
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
  const [currentFilename, setCurrentFilename] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const checkApi = async () => {
      try {
        const health = await getApiHealth();
        setApiStatus(health?.status === 'healthy' ? 'online' : 'offline');
      } catch (error) {
        setApiStatus('offline');
      }
    };

    checkApi();
  }, []);

  const handleUploadSuccess = async (uploadResult) => {
    if (!uploadResult?.filename) {
      setFetchError('Upload succeeded, but filename was missing in the response.');
      return;
    }

    setFetchError('');
    setIsFetching(true);
    setCurrentFilename(uploadResult.filename);

    try {
      const [quality, issuesData] = await Promise.all([
        getDataQuality(uploadResult.filename),
        getIssues(uploadResult.filename),
      ]);

      setDataStats(quality);
      setIssues(issuesData);
      setApiStatus('online');
    } catch (error) {
      setFetchError(error.message || 'Failed to fetch dashboard data.');
      setApiStatus('offline');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>📈 Data Quality Dashboard</h1>
        <p className="subtitle">Analyze and monitor your data quality</p>
        <p className={`api-status api-${apiStatus}`}>
          API: {apiStatus === 'checking' ? 'Checking...' : apiStatus === 'online' ? 'Online' : 'Offline'}
        </p>
      </header>

      {isFetching && (
        <div className="app-alert app-alert-info">
          Fetching quality metrics and issues for {currentFilename}...
        </div>
      )}

      {fetchError && (
        <div className="app-alert app-alert-error">
          {fetchError}
        </div>
      )}
      
      <main className="app-main">
        <div className="upload-section">
          <Upload onUploadSuccess={handleUploadSuccess} />
        </div>
        
        <div className="dashboard-section">
          <Dashboard dataStats={dataStats} />
        </div>

        <div className="charts-section">
          <Charts issues={issues} />
        </div>
      </main>

      <div className="issues-section">
        <IssuesTable issues={issues} />
      </div>
    </div>
  );
}

export default App;
