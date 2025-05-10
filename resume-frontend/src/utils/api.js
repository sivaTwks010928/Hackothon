// API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

/**
 * Constructs a proper API endpoint URL, preventing duplicate /api paths
 * @param {string} path - The API endpoint path (without leading slash)
 * @returns {string} - The properly constructed API URL
 */
export const getApiEndpoint = (path) => {
  // Remove any leading slash from the path
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Handle different API_URL formats
  if (API_URL.endsWith('/api')) {
    return `${API_URL}/${cleanPath}`;
  } else if (API_URL.includes('/api/')) {
    return `${API_URL.split('/api/')[0]}/api/${cleanPath}`;
  } else {
    return `${API_URL}/api/${cleanPath}`;
  }
};

export default {
  getApiEndpoint
}; 