const API_BASE_URL = 'http://localhost:8000'; // Adjust if your backend runs on a different port

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const getDataQuality = async (filename) => {
  try {
    const response = await fetch(`${API_BASE_URL}/data-quality/${filename}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch data quality: ${response.statusText}`);
    }

    const quality = await response.json();
    return quality;
  } catch (error) {
    console.error('Data quality fetch error:', error);
    throw error;
  }
};