// =============================================================================
// TRIP BUNDLE PROMPTS SERVICE - Main Export File
// =============================================================================

// Main service function
export { generateTripBundles } from './TripBundlePromptService';
export { default as generateTripBundlesDefault } from './TripBundlePromptService';

// Types
export type {
  UserData,
  UserPreferences,
  DateRange,
  InterestType,
  ServiceConfig,
  GenerationOptions,
  GenerateTripBundlesFunction,
  GPTResponse,
  TripBundle,
  Event,
  Entertainment,
  City
} from './types';

// Constants (if needed by consumers)
export { ALL_ENTERTAINMENTS } from './constants';

// Prompts (if needed by consumers for customization)
export { getSystemPrompt, getUserPrompt } from './prompts';

// Default export is the main service function
export { default } from './TripBundlePromptService';
