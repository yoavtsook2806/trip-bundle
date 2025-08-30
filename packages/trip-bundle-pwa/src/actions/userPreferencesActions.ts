import UserPreferencesStore from '../store/userPreferences';
import { UserPreferencesStorage, UserPreferencesHelpers, type UserPreferences } from '../storage/userPreferences';

export class UserPreferencesActions {
  private userPreferencesStore: UserPreferencesStore;
  private userPreferencesStorage: typeof UserPreferencesStorage;
  private userPreferencesHelpers: typeof UserPreferencesHelpers;

  constructor(
    userPreferencesStore: UserPreferencesStore,
    userPreferencesStorage: typeof UserPreferencesStorage = UserPreferencesStorage,
    userPreferencesHelpers: typeof UserPreferencesHelpers = UserPreferencesHelpers
  ) {
    this.userPreferencesStore = userPreferencesStore;
    this.userPreferencesStorage = userPreferencesStorage;
    this.userPreferencesHelpers = userPreferencesHelpers;
  }

  // Storage-based User Preference Actions
  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<boolean> {
    const success = await this.userPreferencesStorage.setUserPreferences(preferences);
    if (success) {
      // Also update the old store for backward compatibility
      this.syncWithLegacyStore(preferences);
    }
    return success;
  }

  async getUserPreferences(): Promise<UserPreferences> {
    return this.userPreferencesStorage.getUserPreferences();
  }

  async hasStoredPreferences(): Promise<boolean> {
    return this.userPreferencesStorage.hasUserPreferences();
  }

  async getPreferencesCompletion(): Promise<number> {
    return this.userPreferencesHelpers.getCompletionPercentage();
  }

  async clearStoredPreferences(): Promise<boolean> {
    const success = await this.userPreferencesStorage.clearUserPreferences();
    if (success) {
      this.userPreferencesStore.reset();
    }
    return success;
  }

  // Legacy User Preference Actions (for backward compatibility)
  updateBudget(min: number, max: number, currency = 'USD'): void {
    this.userPreferencesStore.setBudgetRange(min, max, currency);
    // Also update in new storage
    this.updateUserPreferences({
      budgetRange: { min, max, currency }
    });
  }

  updateDuration(min: number, max: number): void {
    this.userPreferencesStore.setDurationRange(min, max);
    // Also update in new storage
    this.updateUserPreferences({
      durationRange: { min, max }
    });
  }

  updateTravelDates(startDate?: Date, endDate?: Date, flexible = true): void {
    this.userPreferencesStore.setTravelDates(startDate, endDate, flexible);
    // Also update in new storage
    this.updateUserPreferences({
      travelDates: {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        flexible
      }
    });
  }

  updateGroupSize(size: number): void {
    this.userPreferencesStore.setGroupSize(size);
    // Also update in new storage
    this.updateUserPreferences({
      groupSize: size
    });
  }

  addPreferredCountry(country: string): void {
    this.userPreferencesStore.addPreferredCountry(country);
    // Sync with storage
    this.syncPreferredCountriesWithStorage();
  }

  removePreferredCountry(country: string): void {
    this.userPreferencesStore.removePreferredCountry(country);
    // Sync with storage
    this.syncPreferredCountriesWithStorage();
  }

  addExcludedCountry(country: string): void {
    this.userPreferencesStore.addExcludedCountry(country);
    // Sync with storage
    this.syncExcludedCountriesWithStorage();
  }

  removeExcludedCountry(country: string): void {
    this.userPreferencesStore.removeExcludedCountry(country);
    // Sync with storage
    this.syncExcludedCountriesWithStorage();
  }

  addMusicGenre(genre: string): void {
    this.userPreferencesStore.addMusicGenre(genre);
    // Sync with storage
    this.syncMusicGenresWithStorage();
  }

  addSportsInterest(sport: string): void {
    this.userPreferencesStore.addSportsInterest(sport);
    // Sync with storage
    this.syncSportsInterestsWithStorage();
  }

  addEntertainmentPreference(type: 'music' | 'sports' | 'culture' | 'food' | 'nature' | 'nightlife', value: string, weight: number): void {
    this.userPreferencesStore.addEntertainmentPreference({
      id: `${type}-${value}-${Date.now()}`,
      type,
      value,
      weight
    });
  }

  removeEntertainmentPreference(id: string): void {
    this.userPreferencesStore.removeEntertainmentPreference(id);
  }

  resetPreferences(): void {
    this.userPreferencesStore.reset();
    // Also clear storage
    this.clearStoredPreferences();
  }

  // Private helper methods
  private syncWithLegacyStore(preferences: Partial<UserPreferences>): void {
    // Sync new storage preferences with legacy MobX store for backward compatibility
    if (preferences.budgetRange) {
      this.userPreferencesStore.setBudgetRange(
        preferences.budgetRange.min,
        preferences.budgetRange.max,
        preferences.budgetRange.currency
      );
    }

    if (preferences.durationRange) {
      this.userPreferencesStore.setDurationRange(
        preferences.durationRange.min,
        preferences.durationRange.max
      );
    }

    if (preferences.groupSize !== undefined) {
      this.userPreferencesStore.setGroupSize(preferences.groupSize);
    }

    if (preferences.travelDates) {
      const startDate = preferences.travelDates.startDate ? new Date(preferences.travelDates.startDate) : undefined;
      const endDate = preferences.travelDates.endDate ? new Date(preferences.travelDates.endDate) : undefined;
      this.userPreferencesStore.setTravelDates(startDate, endDate, preferences.travelDates.flexible);
    }

    if (preferences.preferredCountries) {
      // Clear and re-add preferred countries
      this.userPreferencesStore.preferences.preferredCountries = [];
      preferences.preferredCountries.forEach(country => {
        this.userPreferencesStore.addPreferredCountry(country);
      });
    }

    if (preferences.excludedCountries) {
      // Clear and re-add excluded countries
      this.userPreferencesStore.preferences.excludedCountries = [];
      preferences.excludedCountries.forEach(country => {
        this.userPreferencesStore.addExcludedCountry(country);
      });
    }

    if (preferences.musicGenres) {
      this.userPreferencesStore.setMusicGenres(preferences.musicGenres);
    }

    if (preferences.sportsInterests) {
      this.userPreferencesStore.setSportsInterests(preferences.sportsInterests);
    }

    if (preferences.spotify) {
      this.userPreferencesStore.setSpotifyConnection(preferences.spotify.connected, {
        id: preferences.spotify.userId || '',
        displayName: preferences.spotify.displayName || '',
        topGenres: preferences.spotify.topGenres || [],
        topArtists: preferences.spotify.topArtists || []
      });
    }
  }

  private async syncPreferredCountriesWithStorage(): Promise<void> {
    const countries = this.userPreferencesStore.preferences.preferredCountries;
    await this.updateUserPreferences({ preferredCountries: countries });
  }

  private async syncExcludedCountriesWithStorage(): Promise<void> {
    const countries = this.userPreferencesStore.preferences.excludedCountries;
    await this.updateUserPreferences({ excludedCountries: countries });
  }

  private async syncMusicGenresWithStorage(): Promise<void> {
    const genres = this.userPreferencesStore.preferences.musicGenres;
    await this.updateUserPreferences({ musicGenres: genres });
  }

  private async syncSportsInterestsWithStorage(): Promise<void> {
    const sports = this.userPreferencesStore.preferences.sportsInterests;
    await this.updateUserPreferences({ sportsInterests: sports });
  }

  // Utility methods
  getPreferenceSummary() {
    return this.userPreferencesStore.preferenceSummary;
  }

  hasPreferences(): boolean {
    return this.userPreferencesStore.hasPreferences;
  }

  isLoading(): boolean {
    return this.userPreferencesStore.isLoading;
  }
}

/**
 * Initialize user preferences data from storage and sync with stores
 */
export async function initUserPreferencesData(
  userPreferencesStore: UserPreferencesStore,
  userPreferencesStorage: typeof UserPreferencesStorage = UserPreferencesStorage
): Promise<void> {
  try {
    console.log('⚙️ [INIT_USER_PREFS] Loading user preferences from storage...');
    
    // Check if user has stored preferences
    const hasStoredPrefs = await userPreferencesStorage.hasUserPreferences();
    
    if (hasStoredPrefs) {
      console.log('⚙️ [INIT_USER_PREFS] Found stored preferences, loading...');
      
      // Get user preferences from storage
      const preferences = await userPreferencesStorage.getUserPreferences();
      console.log('⚙️ [INIT_USER_PREFS] Loaded preferences:', {
        budgetRange: preferences.budgetRange,
        durationRange: preferences.durationRange,
        groupSize: preferences.groupSize,
        preferredCountries: preferences.preferredCountries?.length,
        musicGenres: preferences.musicGenres?.length,
        spotify: preferences.spotify?.connected
      });

      // Sync with legacy store
      if (preferences.budgetRange) {
        userPreferencesStore.setBudgetRange(
          preferences.budgetRange.min,
          preferences.budgetRange.max,
          preferences.budgetRange.currency
        );
      }

      if (preferences.durationRange) {
        userPreferencesStore.setDurationRange(
          preferences.durationRange.min,
          preferences.durationRange.max
        );
      }

      if (preferences.groupSize !== undefined) {
        userPreferencesStore.setGroupSize(preferences.groupSize);
      }

      if (preferences.travelDates) {
        const startDate = preferences.travelDates.startDate ? new Date(preferences.travelDates.startDate) : undefined;
        const endDate = preferences.travelDates.endDate ? new Date(preferences.travelDates.endDate) : undefined;
        userPreferencesStore.setTravelDates(startDate, endDate, preferences.travelDates.flexible);
      }

      if (preferences.preferredCountries) {
        preferences.preferredCountries.forEach(country => {
          userPreferencesStore.addPreferredCountry(country);
        });
      }

      if (preferences.excludedCountries) {
        preferences.excludedCountries.forEach(country => {
          userPreferencesStore.addExcludedCountry(country);
        });
      }

      if (preferences.musicGenres) {
        userPreferencesStore.setMusicGenres(preferences.musicGenres);
      }

      if (preferences.sportsInterests) {
        preferences.sportsInterests.forEach(sport => {
          userPreferencesStore.addSportsInterest(sport);
        });
      }

      // Note: Spotify preferences are handled by initIntegrationsData
      
      console.log('⚙️ [INIT_USER_PREFS] User preferences initialized successfully');
    } else {
      console.log('⚙️ [INIT_USER_PREFS] No stored preferences found, using defaults');
    }

    console.log('⚙️ [INIT_USER_PREFS] User preferences initialization completed');
  } catch (error) {
    console.error('⚙️ [INIT_USER_PREFS] Error initializing user preferences:', error);
  }
}

export default UserPreferencesActions;
