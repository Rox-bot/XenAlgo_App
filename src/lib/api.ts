// API Configuration for Railway deployment
export const API_BASE_URL = 'https://xenalgopythonapi-production.up.railway.app';

// API endpoints
export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/health`,
  analyzeBehavior: `${API_BASE_URL}/analyze-behavior`,
  predictBehavior: `${API_BASE_URL}/predict-behavior`,
  modelInfo: `${API_BASE_URL}/model-info`,
};

// API client configuration
export const apiClient = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper function to make API calls
export const makeApiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Trading Psychology API functions
export const tradingPsychologyApi = {
  // Health check
  health: () => makeApiCall(API_ENDPOINTS.health),

  // Analyze trading behavior
  analyzeBehavior: (data: any) => makeApiCall(API_ENDPOINTS.analyzeBehavior, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Predict future behavior
  predictBehavior: (data: any) => makeApiCall(API_ENDPOINTS.predictBehavior, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Get model information
  modelInfo: () => makeApiCall(API_ENDPOINTS.modelInfo),
}; 