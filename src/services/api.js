const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const parseJsonResponse = async (response, defaultMessage) => {
  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  if (!response.ok) {
    const backendMessage = payload?.detail || payload?.message;
    throw new Error(backendMessage || `${defaultMessage}: ${response.statusText}`);
  }

  return payload;
};

export const getApiHealth = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return parseJsonResponse(response, 'Failed to reach API');
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    return await parseJsonResponse(response, 'Upload failed');
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const getDataQuality = async (filename) => {
  try {
    const response = await fetch(`${API_BASE_URL}/data-quality/${filename}`);
    return await parseJsonResponse(response, 'Failed to fetch data quality');
  } catch (error) {
    console.error('Data quality fetch error:', error);
    throw error;
  }
};

export const getIssues = async (filename) => {
  try {
    const response = await fetch(`${API_BASE_URL}/issues/${encodeURIComponent(filename)}`);
    return await parseJsonResponse(response, 'Failed to fetch issues');
  } catch (error) {
    console.error('Issues fetch error:', error);
    throw error;
  }
};