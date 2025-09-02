// Production configuration for GitHub Pages deployment
// Since GitHub Pages doesn't support server-side environment variables,
// we need to configure these values for production builds

export const PRODUCTION_CONFIG = {
  // Spotify configuration for GitHub Pages
  SPOTIFY_CLIENT_ID: 'bc5f89044c854343a3408f12a4f4a0be', // Your actual Spotify Client ID
  SPOTIFY_REDIRECT_URI: 'https://yoavtsook2806.github.io/trip-bundle/spotify-callback.html',
  
  // GitHub Pages specific settings
  BASE_URL: 'https://yoavtsook2806.github.io/trip-bundle/',
  
  // Feature flags for production
  ENABLE_SPOTIFY: true,
  MOCK_MODE: true // Set to false when you want to use real Spotify API
};

// Helper to get configuration based on environment
export const getConfig = () => {
  const isProduction = import.meta.env.PROD;
  const isGitHubPages = window.location.hostname === 'yoavtsook2806.github.io';
  
  console.log('🔧 [CONFIG] Environment detection:', {
    isProduction,
    isGitHubPages,
    hostname: window.location.hostname,
    origin: window.location.origin,
    mode: import.meta.env.MODE
  });
  
  if (isProduction && isGitHubPages) {
    console.log('🔧 [CONFIG] Using production configuration for GitHub Pages');
    return PRODUCTION_CONFIG;
  }
  
  // Development configuration from environment variables
  console.log('🔧 [CONFIG] Using development configuration from env vars');
  return {
    SPOTIFY_CLIENT_ID: import.meta.env.VITE_SPOTIFY_CLIENT_ID || null,
    SPOTIFY_REDIRECT_URI: import.meta.env.VITE_SPOTIFY_REDIRECT_URI || `${window.location.origin}/spotify-callback.html`,
    BASE_URL: window.location.origin,
    ENABLE_SPOTIFY: true,
    MOCK_MODE: import.meta.env.VITE_MOCK === 'true'
  };
};
