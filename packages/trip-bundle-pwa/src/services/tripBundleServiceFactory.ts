// =============================================================================
// TRIP BUNDLE SERVICE FACTORY - PWA Service Provider
// =============================================================================

import { 
  TripBundlePromptService,
  type UserData,
  type ITripBundleService
} from 'trip-bundle-prompts-service';
import { MockTripBundleService } from './mockTripBundleService';
import { LoggingTripBundleService } from './loggingTripBundleService';
// import { CITIES } from '../constants/cities'; // Unused import

// ITripBundleService interface is now imported from trip-bundle-prompts-service

/**
 * Factory function that creates the appropriate service based on environment
 */
export function createTripBundleService(userData: UserData, cities: string[]): ITripBundleService {
  // Check if we're in mock mode
  const isMockMode = (import.meta as any).env?.VITE_MOCK === 'true';
  
  let baseService: ITripBundleService;
  
  if (isMockMode) {
    console.log('🎭 Creating mock trip bundle service (VITE_MOCK=true)');
    baseService = new MockTripBundleService(userData);
  } else {
    console.log('🤖 Creating real trip bundle service');
    const apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || null;
    
    baseService = new TripBundlePromptService(userData, cities, {
      apiKey,
      model: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 4000
    });
  }
  
  // Wrap with logging service
  return new LoggingTripBundleService(baseService);
}

/**
 * Helper function to convert PWA UserData to service UserData format
 */
export function convertToServiceUserData(userData: any): UserData {
  return {
    userPreferences: {
      interestTypes: userData.userPreferences?.interestTypes || {
        concerts: { isEnabled: false },
        sports: { isEnabled: false },
        artDesign: { isEnabled: false },
        localCulture: { isEnabled: false },
        culinary: { isEnabled: false }
      },
      musicProfile: userData.userPreferences?.musicProfile || '',
      freeTextInterests: userData.userPreferences?.freeTextInterests || ''
    },
    dateRange: userData.dateRange || {
      startDate: Date.now(),
      endDate: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days from now
    }
  };
}
