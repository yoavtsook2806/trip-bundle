// Mobile storage for user preferences
import type { UserData as BaseUserData } from 'trip-bundle-prompts-service';

// PWA-specific extensions to the base UserData
export interface UserData extends BaseUserData {
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

// Default user data
export const defaultUserData: UserData = {
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
    endDate: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days from now
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  version: '2.0.0'
};

// Storage key for mobile localStorage
const STORAGE_KEY = 'tripbundle_user_data';

// Mobile storage functions
export class UserDataStorage {
  
  /**
   * Get user data from mobile storage
   */
  static async getUserData(): Promise<UserData> {
    try {
      // Try to get from localStorage (works in PWA/mobile)
      const stored = localStorage.getItem(STORAGE_KEY);
      
      if (stored) {
        const parsed = JSON.parse(stored) as UserData;
        
        // Merge with defaults to ensure all fields exist
        return {
          ...defaultUserData,
          ...parsed,
          userPreferences: {
            ...defaultUserData.userPreferences,
            ...parsed.userPreferences,
            interestTypes: {
              ...defaultUserData.userPreferences.interestTypes,
              ...parsed.userPreferences?.interestTypes
            }
          },
          updatedAt: parsed.updatedAt || new Date().toISOString()
        };
      }
      
      // Return default data if nothing stored
      return { ...defaultUserData };
      
    } catch (error) {
      console.error('Error getting user data from storage:', error);
      return { ...defaultUserData };
    }
  }
  
  /**
   * Set user data in mobile storage
   */
  static async setUserData(userData: Partial<UserData>): Promise<boolean> {
    try {
      // Get current data
      const current = await this.getUserData();
      
      // Merge with new data
      const updated: UserData = {
        ...current,
        ...userData,
        userPreferences: {
          ...current.userPreferences,
          ...userData.userPreferences,
          interestTypes: {
            ...current.userPreferences.interestTypes,
            ...userData.userPreferences?.interestTypes
          }
        },
        updatedAt: new Date().toISOString()
      };
      
      // Store in localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      
      // Dispatch custom event for reactive updates
      window.dispatchEvent(new CustomEvent('userDataUpdated', {
        detail: updated
      }));
      
      return true;
      
    } catch (error) {
      console.error('Error setting user data in storage:', error);
      return false;
    }
  }
  
  /**
   * Clear all user data
   */
  static async clearUserData(): Promise<boolean> {
    try {
      localStorage.removeItem(STORAGE_KEY);
      
      // Dispatch clear event
      window.dispatchEvent(new CustomEvent('userDataCleared'));
      
      return true;
    } catch (error) {
      console.error('Error clearing user data:', error);
      return false;
    }
  }
  
  /**
   * Check if user has set data (not just defaults)
   */
  static async hasUserData(): Promise<boolean> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored !== null;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Export data as JSON (for backup/sharing)
   */
  static async exportUserData(): Promise<string | null> {
    try {
      const userData = await this.getUserData();
      return JSON.stringify(userData, null, 2);
    } catch (error) {
      console.error('Error exporting user data:', error);
      return null;
    }
  }
  
  /**
   * Import data from JSON
   */
  static async importUserData(jsonData: string): Promise<boolean> {
    try {
      const userData = JSON.parse(jsonData) as UserData;
      return this.setUserData(userData);
    } catch (error) {
      console.error('Error importing user data:', error);
      return false;
    }
  }
}

// Backward compatibility alias
export const UserPreferencesStorage = UserDataStorage;

// Helper functions for user data
export class UserDataHelpers {
  
  /**
   * Get data completion percentage
   */
  static async getCompletionPercentage(): Promise<number> {
    const userData = await UserDataStorage.getUserData();
    
    let completed = 0;
    let total = 0;
    
    // Interest types (5 total)
    total += 5;
    const enabledInterests = Object.values(userData.userPreferences.interestTypes).filter(interest => interest.isEnabled);
    completed += enabledInterests.length;
    
    // Music profile
    total += 1;
    if (userData.userPreferences.musicProfile.trim()) completed += 1;
    
    // Free text interests
    total += 1;
    if (userData.userPreferences.freeTextInterests.trim()) completed += 1;
    
    // Date range (always has defaults)
    total += 1;
    completed += 1;
    
    return Math.round((completed / total) * 100);
  }
  
  /**
   * Check if user has meaningful preferences set
   */
  static async hasPreferences(): Promise<boolean> {
    const userData = await UserDataStorage.getUserData();
    
    // Check if any interests are enabled
    const hasInterests = Object.values(userData.userPreferences.interestTypes).some(interest => interest.isEnabled);
    
    // Check if music profile or free text interests are set
    const hasTextPreferences = Boolean(userData.userPreferences.musicProfile.trim() || userData.userPreferences.freeTextInterests.trim());
    
    return hasInterests || hasTextPreferences;
  }
}

// Backward compatibility alias
export const UserPreferencesHelpers = UserDataHelpers;

// Prompts token storage for API call limiting
export class PromptsTokenStorage {
  private static readonly STORAGE_KEY = 'tripbundle_prompts_token';
  private static readonly MAX_CALLS_PER_DAY = 10;

  /**
   * Get current prompts token data
   */
  static async getPromptsToken(): Promise<{ calls: number; lastReset: string; remaining: number }> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        const today = new Date().toDateString();
        
        // Reset if it's a new day
        if (parsed.lastReset !== today) {
          const resetData = {
            calls: 0,
            lastReset: today,
            remaining: this.MAX_CALLS_PER_DAY
          };
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(resetData));
          return resetData;
        }
        
        return {
          calls: parsed.calls || 0,
          lastReset: parsed.lastReset,
          remaining: Math.max(0, this.MAX_CALLS_PER_DAY - (parsed.calls || 0))
        };
      }
      
      // Initialize for first time
      const initData = {
        calls: 0,
        lastReset: new Date().toDateString(),
        remaining: this.MAX_CALLS_PER_DAY
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initData));
      return initData;
      
    } catch (error) {
      console.error('Error getting prompts token:', error);
      return {
        calls: 0,
        lastReset: new Date().toDateString(),
        remaining: this.MAX_CALLS_PER_DAY
      };
    }
  }

  /**
   * Increment call count and return if call is allowed
   */
  static async incrementCall(): Promise<{ allowed: boolean; remaining: number }> {
    try {
      const current = await this.getPromptsToken();
      
      if (current.remaining <= 0) {
        return { allowed: false, remaining: 0 };
      }
      
      const updated = {
        calls: current.calls + 1,
        lastReset: current.lastReset,
        remaining: current.remaining - 1
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
      
      return { allowed: true, remaining: updated.remaining };
      
    } catch (error) {
      console.error('Error incrementing prompts call:', error);
      return { allowed: false, remaining: 0 };
    }
  }

  /**
   * Check if calls are available without incrementing
   */
  static async canMakeCall(): Promise<boolean> {
    const token = await this.getPromptsToken();
    return token.remaining > 0;
  }

  /**
   * Reset call count (for testing purposes)
   */
  static async resetCalls(): Promise<void> {
    const resetData = {
      calls: 0,
      lastReset: new Date().toDateString(),
      remaining: this.MAX_CALLS_PER_DAY
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(resetData));
  }
}

export default UserPreferencesStorage;
