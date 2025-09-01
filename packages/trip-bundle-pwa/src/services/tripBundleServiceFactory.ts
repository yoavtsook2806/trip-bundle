// =============================================================================
// TRIP BUNDLE SERVICE FACTORY - Simple Function Provider
// =============================================================================

import { generateTripBundles } from 'trip-bundle-prompts-service';
import { mockGenerateTripBundles } from './mockTripBundleService';
import type { GenerateTripBundlesFunction } from 'trip-bundle-prompts-service';

/**
 * Factory function that returns the appropriate generateTripBundles function
 * based on environment (mock vs real)
 */
export function getTripBundleService(): GenerateTripBundlesFunction {
  // Check if we're in mock mode
  const isMockMode = (import.meta as any).env?.VITE_MOCK === 'true';
  
  if (isMockMode) {
    console.log('🎭 Using mock trip bundle service (VITE_MOCK=true)');
    return mockGenerateTripBundles;
  } else {
    console.log('🤖 Using real trip bundle service');
    return generateTripBundles;
  }
}

export default getTripBundleService;