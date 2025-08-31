// =============================================================================
// PWA-SPECIFIC TYPES - Trip Bundle PWA
// =============================================================================

// Import types for local usage
import type { 
  TripBundle as TripBundleImport 
} from 'trip-bundle-prompts-service';

// Re-export commonly used types from the service
export type { 
  City, 
  Entertainment, 
  Event as TripEvent, 
  TripBundle, 
  GPTResponse, 
  EventsResponse,
  UserData,
  UserPreferences
} from 'trip-bundle-prompts-service';

// =============================================================================
// USER PREFERENCES TYPES (PWA-specific extensions)
// =============================================================================

// TripPreferences removed - use UserPreferences from prompts service instead

export interface UserPreference {
  id: string;
  type: 'country' | 'music' | 'sport' | 'entertainment';
  value: string;
  weight: number;
}

// =============================================================================
// COMPONENT PROP TYPES
// =============================================================================

// Tab Navigation
export interface Tab {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
}

// Bundle Offer Component
export interface BundleOfferProps {
  bundle: TripBundleImport;
  onBookmark?: (bundleId: string) => void;
  onSelect?: (bundleId: string) => void;
  onEventClick?: (entertainment: any, date: string, time: string, venue: string, cost: number) => void;
  isSelected?: boolean;
  isBookmarked?: boolean;
}

// Removed unused SearchFormProps and EventDetailsProps interfaces

// =============================================================================
// INTEGRATION TYPES (PWA-specific)
// =============================================================================

export interface SpotifyIntegrationState {
  connected: boolean;
  profile: any | null;
  preferences: any | null;
  lastSyncAt?: string;
}

export interface IntegrationsState {
  integrations: {
    spotify?: SpotifyIntegrationState;
  };
}

// =============================================================================
// PWA-SPECIFIC TYPES
// =============================================================================

export interface PWAInfo {
  isInstalled: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  installPrompt: any | null;
}