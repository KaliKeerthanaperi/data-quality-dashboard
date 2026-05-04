import React, { useState } from 'react';
import { uploadFile } from '../services/api';
import '../styles/main.css';

function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadStatus('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first');
      return;
    }

    setUploadStatus(`Uploading ${selectedFile.name}...`);

    try {
      const result = await uploadFile(selectedFile);
      setUploadStatus(`Successfully uploaded ${result.filename}`);
      setSelectedFile(null);
      document.getElementById('fileInput').value = '';
    } catch (error) {
      setUploadStatus(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Data File</h2>
      <div className="upload-form">
        <div className="file-input-wrapper">
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            className="file-input"
            accept=".csv,.xlsx,.xls,.json"
          />
          <label htmlFor="fileInput" className="file-label">
            {selectedFile ? selectedFile.name : 'Choose a file...'}
          </label>
        </div>

        <button
          onClick={handleUpload}
          className="upload-button"
          disabled={!selectedFile}
        >
          Upload
        </button>
      </div>

      {uploadStatus && (
        <div className={`upload-status ${uploadStatus.includes('Successfully') ? 'success' : 'info'}`}>
          {uploadStatus}
        </div>
      )}
    </div>
  );
}

export default Upload;
