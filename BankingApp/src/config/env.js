export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://localhost:44338',
  appName: import.meta.env.VITE_APP_NAME || 'Bank Transactions',
  enableLogging: import.meta.env.VITE_ENABLE_LOGGING === 'true',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
};