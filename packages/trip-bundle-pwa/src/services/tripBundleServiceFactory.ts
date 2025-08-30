// =============================================================================
// TRIP BUNDLE SERVICE FACTORY - PWA Service Provider
// =============================================================================

import { 
  TripBundlePromptService,
  type UserData,
  type ITripBundleService
} from 'trip-bundle-prompts-service';
import { MockTripBundleService } from './mockTripBundleService';
// import { CITIES } from '../constants/cities'; // Unused import

// ITripBundleService interface is now imported from trip-bundle-prompts-service

/**
 * Factory function that creates the appropriate service based on environment
 */
export function createTripBundleService(userData: UserData, cities: string[]): ITripBundleService {
  // Check if we're in mock mode
  const isMockMode = (import.meta as any).env?.VITE_MOCK === 'true';
  
  if (isMockMode) {
    console.log('🎭 Creating mock trip bundle service (VITE_MOCK=true)');
    return new MockTripBundleService(userData);
  } else {
    console.log('🤖 Creating real trip bundle service');
    const apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || null;
    
    return new TripBundlePromptService(userData, cities, {
      apiKey,
      model: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 4000
    });
  }
}

/**
 * Helper function to convert PWA store data to UserData format
 */
export function convertStoreDataToUserData(
  userPreferencesStore: any,
  integrationsStore: any
): UserData {
  const prefs = userPreferencesStore.preferences;
  
  return {
    userPreferences: {
      budget: prefs.budget,
      duration: prefs.duration,
      preferredCountries: prefs.preferredCountries,
      musicGenres: prefs.musicGenres,
      sportsInterests: prefs.sportsInterests,
      entertainmentPreferences: prefs.entertainmentPreferences,
      groupSize: prefs.groupSize,
      travelDates: prefs.travelDates
    },
    integrations: generateIntegrationsData(integrationsStore)
  };
}

/**
 * Helper function to generate integrations data from store
 */
function generateIntegrationsData(integrationsStore: any): { [key: string]: { summary: string } } {
  const integrations: { [key: string]: { summary: string } } = {};

  if (integrationsStore.isSpotifyConnected && integrationsStore.spotifyPreferences) {
    const prefs = integrationsStore.spotifyPreferences;
    
    const summary = `Top genres: ${prefs.topGenres.join(', ')}. ` +
      `Top artists: ${prefs.topArtists.slice(0, 5).map((a: any) => a.name).join(', ')}. ` +
      `Music profile: ${prefs.musicProfile.energy > 0.7 ? 'High Energy' : prefs.musicProfile.energy > 0.4 ? 'Moderate Energy' : 'Low Energy'}, ` +
      `${prefs.musicProfile.danceability > 0.7 ? 'Danceable' : 'Non-Danceable'}, ` +
      `${prefs.musicProfile.valence > 0.7 ? 'Positive/Happy' : prefs.musicProfile.valence > 0.4 ? 'Neutral' : 'Melancholic'}. ` +
      `Preferred music events: Concerts and festivals featuring ${prefs.topGenres.slice(0, 3).join(', ')} music.`;
    
    integrations.spotify = { summary };
  }

  return integrations;
}
