// Mobile storage for user preferences
export interface UserPreferences {
  // Personal Info
  name?: string;
  age?: number;
  email?: string;
  
  // Travel Preferences
  budgetRange: {
    min: number;
    max: number;
    currency: string;
  };
  
  durationRange: {
    min: number; // days
    max: number; // days
  };
  
  groupSize: number;
  
  travelDates?: {
    startDate?: string; // ISO string
    endDate?: string; // ISO string
    flexible: boolean;
  };
  
  // Location Preferences
  preferredCountries: string[];
  excludedCountries: string[];
  preferredCities: string[];
  
  // Entertainment Preferences
  musicGenres: string[];
  sportsInterests: string[];
  cultureInterests: string[];
  foodPreferences: string[];
  nightlifePreferences: string[];
  naturePreferences: string[];
  
  // Entertainment weights (1-10 scale)
  entertainmentWeights: {
    music: number;
    sports: number;
    culture: number;
    food: number;
    nightlife: number;
    nature: number;
  };
  
  // Accommodation Preferences
  accommodationType: 'hotel' | 'hostel' | 'apartment' | 'resort' | 'any';
  accommodationRating: number; // 1-5 stars
  
  // Transport Preferences
  transportPreference: 'flight' | 'train' | 'bus' | 'car' | 'any';
  
  // Special Requirements
  accessibility?: string[];
  dietaryRestrictions?: string[];
  languagePreference?: string;
  
  // Spotify Integration (if connected)
  spotify?: {
    connected: boolean;
    userId?: string;
    displayName?: string;
    topGenres?: string[];
    topArtists?: string[];
  };
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  version: string;
}

// Default user preferences
export const defaultUserPreferences: UserPreferences = {
  budgetRange: {
    min: 500,
    max: 2000,
    currency: 'USD'
  },
  durationRange: {
    min: 3,
    max: 7
  },
  groupSize: 1,
  travelDates: {
    flexible: true
  },
  preferredCountries: [],
  excludedCountries: [],
  preferredCities: [],
  musicGenres: [],
  sportsInterests: [],
  cultureInterests: [],
  foodPreferences: [],
  nightlifePreferences: [],
  naturePreferences: [],
  entertainmentWeights: {
    music: 5,
    sports: 5,
    culture: 5,
    food: 5,
    nightlife: 5,
    nature: 5
  },
  accommodationType: 'any',
  accommodationRating: 3,
  transportPreference: 'any',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  version: '1.0.0'
};

// Storage key for mobile localStorage
const STORAGE_KEY = 'tripbundle_user_preferences';

// Mobile storage functions
export class UserPreferencesStorage {
  
  /**
   * Get user preferences from mobile storage
   */
  static async getUserPreferences(): Promise<UserPreferences> {
    try {
      // Try to get from localStorage (works in PWA/mobile)
      const stored = localStorage.getItem(STORAGE_KEY);
      
      if (stored) {
        const parsed = JSON.parse(stored) as UserPreferences;
        
        // Merge with defaults to ensure all fields exist
        return {
          ...defaultUserPreferences,
          ...parsed,
          updatedAt: parsed.updatedAt || new Date().toISOString()
        };
      }
      
      // Return default preferences if nothing stored
      return { ...defaultUserPreferences };
      
    } catch (error) {
      console.error('Error getting user preferences from storage:', error);
      return { ...defaultUserPreferences };
    }
  }
  
  /**
   * Set user preferences in mobile storage
   */
  static async setUserPreferences(preferences: Partial<UserPreferences>): Promise<boolean> {
    try {
      // Get current preferences
      const current = await this.getUserPreferences();
      
      // Merge with new preferences
      const updated: UserPreferences = {
        ...current,
        ...preferences,
        updatedAt: new Date().toISOString()
      };
      
      // Store in localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      
      // Dispatch custom event for reactive updates
      window.dispatchEvent(new CustomEvent('userPreferencesUpdated', {
        detail: updated
      }));
      
      return true;
      
    } catch (error) {
      console.error('Error setting user preferences in storage:', error);
      return false;
    }
  }
  
  /**
   * Update specific preference field
   */
  static async updatePreference<K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ): Promise<boolean> {
    const updates = { [key]: value } as Partial<UserPreferences>;
    return this.setUserPreferences(updates);
  }
  
  /**
   * Clear all user preferences
   */
  static async clearUserPreferences(): Promise<boolean> {
    try {
      localStorage.removeItem(STORAGE_KEY);
      
      // Dispatch clear event
      window.dispatchEvent(new CustomEvent('userPreferencesCleared'));
      
      return true;
    } catch (error) {
      console.error('Error clearing user preferences:', error);
      return false;
    }
  }
  
  /**
   * Check if user has set preferences (not just defaults)
   */
  static async hasUserPreferences(): Promise<boolean> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored !== null;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Export preferences as JSON (for backup/sharing)
   */
  static async exportPreferences(): Promise<string | null> {
    try {
      const preferences = await this.getUserPreferences();
      return JSON.stringify(preferences, null, 2);
    } catch (error) {
      console.error('Error exporting preferences:', error);
      return null;
    }
  }
  
  /**
   * Import preferences from JSON
   */
  static async importPreferences(jsonData: string): Promise<boolean> {
    try {
      const preferences = JSON.parse(jsonData) as UserPreferences;
      return this.setUserPreferences(preferences);
    } catch (error) {
      console.error('Error importing preferences:', error);
      return false;
    }
  }
}

// Helper functions for specific preference types
export class UserPreferencesHelpers {
  

  
  /**
   * Get preference completion percentage
   */
  static async getCompletionPercentage(): Promise<number> {
    const prefs = await UserPreferencesStorage.getUserPreferences();
    
    let completed = 0;
    let total = 0;
    
    // Required fields
    total += 3; // budget, duration, group size (always have defaults)
    completed += 3;
    
    // Optional but important fields
    const optionalFields = [
      prefs.preferredCountries.length > 0,
      prefs.musicGenres.length > 0 || prefs.sportsInterests.length > 0 || prefs.cultureInterests.length > 0,
      prefs.accommodationType !== 'any',
      prefs.transportPreference !== 'any',
      prefs.name !== undefined,
      prefs.travelDates?.startDate !== undefined
    ];
    
    total += optionalFields.length;
    completed += optionalFields.filter(Boolean).length;
    
    return Math.round((completed / total) * 100);
  }
}

export default UserPreferencesStorage;
