
export const STORAGE_KEY = 'EDUREALM_API_CONFIG';

export interface ApiConfig {
  apiKey: string;
  model: string;
  baseUrl: string; // 适配中转地址
}

const DEFAULT_CONFIG: ApiConfig = {
  apiKey: process.env.API_KEY || 'AIzaSyAII55H9OgOFjqrwwgVgkjN9JRWoM-bVKo',
  model: 'gemini-3-flash-preview',
  baseUrl: 'https://generativelanguage.googleapis.com'
};

export const getApiConfig = (): ApiConfig => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        apiKey: parsed.apiKey || DEFAULT_CONFIG.apiKey // 如果本地没填key则尝试环境变量
      };
    }
  } catch (e) {
    console.error("Failed to load API config", e);
  }
  return DEFAULT_CONFIG;
};

export const saveApiConfig = (config: ApiConfig) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};
