import React, { useRef, useState } from 'react';
import { uploadFile } from '../services/api';
import '../styles/main.css';

function Upload({ onUploadSuccess }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadStatus('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first');
      return;
    }

    setIsLoading(true);
    setUploadStatus(`Uploading ${selectedFile.name}...`);

    try {
      const result = await uploadFile(selectedFile);
      setUploadStatus(`✅ Successfully uploaded ${result.filename}`);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Call the callback to update dashboard
      if (onUploadSuccess) {
        await onUploadSuccess(result);
      }
    } catch (error) {
      setUploadStatus(`❌ Upload failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>📁 Upload Data File</h2>
      <div className="upload-form">
        <div className="file-input-wrapper">
          <input
            ref={fileInputRef}
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            className="file-input"
            accept=".csv,.xlsx,.xls,.json"
            disabled={isLoading}
          />
          <label htmlFor="fileInput" className="file-label">
            {selectedFile ? selectedFile.name : 'Choose a file...'}
          </label>
        </div>

        <button
          onClick={handleUpload}
          className="upload-button"
          disabled={isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      
      {uploadStatus && (
        <div className={`upload-status ${uploadStatus.includes('✅') ? 'success' : uploadStatus.includes('❌') ? 'error' : 'info'}`}>
          {uploadStatus}
        </div>
      )}
    </div>
  );
}

export default Upload;
