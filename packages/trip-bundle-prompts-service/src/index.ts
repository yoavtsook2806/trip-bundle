// =============================================================================
// TRIP BUNDLE PROMPTS SERVICE - Main Export File
// =============================================================================

// Main service class
export { TripBundlePromptService } from './TripBundlePromptService';

// Types
export type {
  UserData,
  UserPreferences,
  IntegrationSummary,
  ServiceConfig,
  GenerationOptions,
  GPTResponse,
  EventsResponse,
  TripBundle,
  Event,
  Entertainment,
  ITripBundleService
} from './types';

// Constants (if needed by consumers)
export { CITIES, ALL_ENTERTAINMENTS } from './constants';
export type { City } from './constants';

// Prompts (if needed by consumers for customization)
export { getSystemPrompt, getUserPrompt } from './prompts';

// Default export is the main service class
import { TripBundlePromptService } from './TripBundlePromptService';
export default TripBundlePromptService;
