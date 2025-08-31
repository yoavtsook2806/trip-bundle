export { default as SpotifyService } from './spotifyService';
export type { SpotifyTrack, SpotifyArtist, SpotifyUserProfile, SpotifyUserPreferences } from './spotifyService';

// Trip bundle services
export { MockTripBundleService } from './mockTripBundleService';
export { LoggingTripBundleService } from './loggingTripBundleService';
export { createTripBundleService, convertStoreDataToUserData } from './tripBundleServiceFactory';
export type { ITripBundleService } from 'trip-bundle-prompts-service';

// Helper function to get service instance
export async function getTripBundleService() {
  // This will be used by components to get the current service instance
  // For now, we'll create a new instance each time
  // In a real app, this might be managed by a context or DI container
  
  // Try to get user data from localStorage or use defaults
  let userData;
  try {
    const storedPrefs = localStorage.getItem('trip_bundle_user_preferences');
    const storedIntegrations = localStorage.getItem('trip_bundle_integrations');
    
    if (storedPrefs) {
      const prefs = JSON.parse(storedPrefs);
      const integrations = storedIntegrations ? JSON.parse(storedIntegrations) : {};
      
      userData = {
        userPreferences: prefs,
        integrations: integrations
      };
    } else {
      userData = { userPreferences: {}, integrations: {} };
    }
  } catch (error) {
    console.warn('Error loading user data from storage:', error);
    userData = { userPreferences: {}, integrations: {} };
  }
  
  const cities = ['London', 'Paris', 'Berlin']; // Default cities
  
  // Import the function dynamically to avoid circular dependency
  const { createTripBundleService: createService } = await import('./tripBundleServiceFactory');
  return createService(userData, cities);
}
