// =============================================================================
// TRIP BUNDLE PROMPTS SERVICE - Main Export File
// =============================================================================

// Main service class
export { TripBundlePromptService } from './TripBundlePromptService';

// Types
export type {
  UserData,
  UserPreferences,
  DateRange,
  InterestType,
  ServiceConfig,
  GenerationOptions,
  GPTResponse,
  TripBundle,
  Event,
  Entertainment,
  ITripBundleService,
  City
} from './types';

// Constants (if needed by consumers)
export { ALL_ENTERTAINMENTS } from './constants';

// Prompts (if needed by consumers for customization)
export { getSystemPrompt, getUserPrompt } from './prompts';

// Default export is the main service class
import { TripBundlePromptService } from './TripBundlePromptService';
export default TripBundlePromptService;
