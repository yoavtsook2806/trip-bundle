// Production configuration for GitHub Pages deployment
// Since GitHub Pages doesn't support server-side environment variables,
// we need to configure these values for production builds

interface AppConfig {
  SPOTIFY_CLIENT_ID: string | null;
  SPOTIFY_REDIRECT_URI: string;
}

export const PRODUCTION_CONFIG: AppConfig = {
  // Spotify configuration for GitHub Pages
  SPOTIFY_CLIENT_ID: 'bc5f89044c854343a3408f12a4f4a0be', // Your actual Spotify Client ID
  // For dual deployment, both /mock/ and /real/ use the same callback at the root level
  SPOTIFY_REDIRECT_URI: 'https://yoavtsook2806.github.io/trip-bundle/spotify-callback.html'
};

// Helper to get configuration based on environment
export const getConfig = (): AppConfig => {
  const isProduction = import.meta.env.PROD;
  const isGitHubPages = window.location.hostname === 'yoavtsook2806.github.io';
  const isGitHubPagesPath = window.location.pathname.startsWith('/trip-bundle');
  const isAnyGitHubPages = window.location.hostname.includes('github.io');
  
  // Multiple ways to detect GitHub Pages deployment
  const forceProduction = isGitHubPages || isAnyGitHubPages || (isProduction && isGitHubPagesPath);
  
  
  // ALWAYS use production config for GitHub Pages, regardless of other conditions
  if (forceProduction) {
    return PRODUCTION_CONFIG;
  }
  
  // Development configuration from environment variables
  const devConfig: AppConfig = {
    SPOTIFY_CLIENT_ID: import.meta.env.VITE_SPOTIFY_CLIENT_ID || null,
    SPOTIFY_REDIRECT_URI: import.meta.env.VITE_SPOTIFY_REDIRECT_URI || `${window.location.origin}/spotify-callback.html`
  };
  return devConfig;
};
