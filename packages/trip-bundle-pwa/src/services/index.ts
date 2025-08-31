export { default as SpotifyService } from './spotifyService';
export type { SpotifyTrack, SpotifyArtist, SpotifyUserProfile, SpotifyUserPreferences } from './spotifyService';

// Trip bundle services
export { MockTripBundleService } from './mockTripBundleService';
export { LoggingTripBundleService } from './loggingTripBundleService';
export { createTripBundleService, convertStoreDataToUserData } from './tripBundleServiceFactory';
export type { ITripBundleService } from 'trip-bundle-prompts-service';

// Helper function to get service instance
export function getTripBundleService() {
  // Import here to avoid circular dependency
  const { createTripBundleService: createService } = require('./tripBundleServiceFactory');
  
  // This will be used by components to get the current service instance
  // For now, we'll create a new instance each time
  // In a real app, this might be managed by a context or DI container
  const userData = { userPreferences: {}, integrations: {} } as any;
  const cities = ['London', 'Paris', 'Berlin']; // Default cities
  return createService(userData, cities);
}
