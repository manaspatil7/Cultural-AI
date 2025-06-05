export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'https://cultural-ai-backend.onrender.com',
};

export const API_ENDPOINTS = {
  analyze: `${API_CONFIG.baseUrl}/analyze`,
  reconstruct: `${API_CONFIG.baseUrl}/reconstruct`,
  convert: `${API_CONFIG.baseUrl}/api/convert`,
  result: `${API_CONFIG.baseUrl}/api/result`,
  climateImpact: `${API_CONFIG.baseUrl}/climate-impact`,
};