// Import and re-export types from prompts service package
import type {
  Event,
  TripBundle,
  GPTResponse,
  InterestType,
  InterestTypes,
  UserPreferences,
  DateRange,
  UserData,
  GenerateTripBundlesFunction
} from 'trip-bundle-prompts-service';

export type {
  Event,
  TripBundle,
  GPTResponse,
  InterestType,
  InterestTypes,
  UserPreferences,
  DateRange,
  UserData,
  GenerateTripBundlesFunction
};

// PWA-specific types
export interface AppState {
  currentScreen: 'firstTime' | 'thinking' | 'bundles' | 'preferences' | 'bundlePage' | 'development';
  isLoading: boolean;
  bundles: TripBundle[];
  selectedBundle: TripBundle | null;
  userPreferences: UserPreferences | null;
  dateRange: DateRange | null;
  promptsUsage: PromptsUsage;
}

export interface PromptsUsage {
  count: number;
  date: string; // YYYY-MM-DD format
  maxDaily: number;
}
