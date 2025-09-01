export { default as SpotifyService } from './spotifyService';
export type { SpotifyTrack, SpotifyArtist, SpotifyUserProfile, SpotifyUserPreferences } from './spotifyService';

// Trip bundle services
export { MockTripBundleService } from './mockTripBundleService';
export { LoggingTripBundleService } from './loggingTripBundleService';
export { createTripBundleService, convertToServiceUserData } from './tripBundleServiceFactory';
export type { ITripBundleService } from 'trip-bundle-prompts-service';

// Helper function to get service instance
export async function getTripBundleService() {
  // This will be used by components to get the current service instance
  // For now, we'll create a new instance each time
  // In a real app, this might be managed by a context or DI container
  
  // Try to get user data from localStorage or use defaults
  let userData;
  try {
    const storedData = localStorage.getItem('tripbundle_user_data');
    
    if (storedData) {
      userData = JSON.parse(storedData);
    } else {
      userData = {
        userPreferences: {
          interestTypes: {
            concerts: { isEnabled: false },
            sports: { isEnabled: false },
            artDesign: { isEnabled: false },
            localCulture: { isEnabled: false },
            culinary: { isEnabled: false }
          },
          musicProfile: '',
          freeTextInterests: ''
        },
        dateRange: {
          startDate: Date.now(),
          endDate: Date.now() + (7 * 24 * 60 * 60 * 1000)
        }
      };
    }
  } catch (error) {
    console.warn('Error loading user data from storage:', error);
    userData = {
      userPreferences: {
        interestTypes: {
          concerts: { isEnabled: false },
          sports: { isEnabled: false },
          artDesign: { isEnabled: false },
          localCulture: { isEnabled: false },
          culinary: { isEnabled: false }
        },
        musicProfile: '',
        freeTextInterests: ''
      },
      dateRange: {
        startDate: Date.now(),
        endDate: Date.now() + (4 * 30 * 24 * 60 * 60 * 1000) // 4 months from now
      }
    };
  }
  
  const cities = ['London', 'Paris', 'Berlin']; // Default cities
  
  // Import the function dynamically to avoid circular dependency
  const { createTripBundleService: createService } = await import('./tripBundleServiceFactory');
  return createService(userData, cities);
}
