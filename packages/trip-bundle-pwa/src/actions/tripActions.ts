import UserPreferencesStore from '../store/userPreferences';
import BundleSuggestionsStore from '../store/bundleSuggestions';
import GPTService from '../services/gptService';
import { TripBundle } from '../types';
import SpotifyIntegration from '../integrations/spotify';
import { UserPreferencesStorage, UserPreferencesHelpers, type UserPreferences } from '../storage';
import { getSystemPrompt, getUserPrompt } from '../prompts';

export class TripActions {
  private userPreferencesStore: UserPreferencesStore;
  private bundleSuggestionsStore: BundleSuggestionsStore;
  private gptService: GPTService;
  private spotifyIntegration: SpotifyIntegration;

  constructor(
    userPreferencesStore: UserPreferencesStore,
    bundleSuggestionsStore: BundleSuggestionsStore,
    gptService: GPTService,
    spotifyIntegration: SpotifyIntegration
  ) {
    this.userPreferencesStore = userPreferencesStore;
    this.bundleSuggestionsStore = bundleSuggestionsStore;
    this.gptService = gptService;
    this.spotifyIntegration = spotifyIntegration;
  }

  // Spotify Integration Actions
  async connectSpotify(): Promise<boolean> {
    try {
      if (!this.spotifyIntegration.isConfigured()) {
        throw new Error('Spotify integration not configured');
      }

      this.userPreferencesStore.setLoading(true);
      
      // Get auth URL and redirect user
      const authUrl = this.spotifyIntegration.getAuthUrl();
      window.location.href = authUrl;
      
      return true;
    } catch (error) {
      console.error('Failed to connect Spotify:', error);
      this.userPreferencesStore.setLoading(false);
      return false;
    }
  }

  async handleSpotifyCallback(code: string): Promise<boolean> {
    try {
      this.userPreferencesStore.setLoading(true);
      
      // Exchange code for tokens
      const success = await this.spotifyIntegration.handleCallback(code);
      if (!success) {
        throw new Error('Failed to exchange Spotify authorization code');
      }

      // Get user profile and preferences
      const [profile, preferences] = await Promise.all([
        this.spotifyIntegration.getUserProfile(),
        this.spotifyIntegration.getUserPreferences()
      ]);

      // Update user preferences store with Spotify data
      this.userPreferencesStore.setSpotifyConnection(true, {
        id: profile.id,
        displayName: profile.display_name,
        topGenres: preferences.topGenres,
        topArtists: preferences.topArtists.map(artist => artist.name)
      });

      // Update music preferences
      this.userPreferencesStore.setMusicGenres(preferences.topGenres);

      // Add entertainment preferences based on music profile
      this.addMusicBasedPreferences(preferences.musicProfile);

      this.userPreferencesStore.setLoading(false);
      return true;
    } catch (error) {
      console.error('Spotify callback error:', error);
      this.userPreferencesStore.setLoading(false);
      return false;
    }
  }

  disconnectSpotify(): void {
    this.spotifyIntegration.disconnect();
    this.userPreferencesStore.setSpotifyConnection(false);
  }

  // Trip Bundle Generation Actions

  async generateTripBundles(loadMore = false): Promise<void> {
    try {
      if (loadMore) {
        this.bundleSuggestionsStore.setLoadingMore(true);
      } else {
        this.bundleSuggestionsStore.setLoading(true);
        this.bundleSuggestionsStore.clearBundles(); // Clear existing bundles for fresh load
      }

      if (!this.gptService.isConfigured()) {
        console.warn('GPT service not configured, using mock data');
      }

      // Generate user prompt from stored preferences
      const userPromptText = await getUserPrompt();
      console.log('Generated user prompt from preferences:', userPromptText);

      const systemPrompt = getSystemPrompt();
      
      // Determine page to load
      const page = loadMore ? this.bundleSuggestionsStore.nextPage : 1;
      const limit = 5; // Always load 5 bundles per page
      
      const response = await this.gptService.generateTripBundles(systemPrompt, userPromptText, { page, limit });
      
      // Save the bundles to the store
      const paginationInfo = response.pagination ? {
        page: response.pagination.page,
        total: response.pagination.total,
        hasMore: response.pagination.hasMore
      } : undefined;
      
      this.bundleSuggestionsStore.setBundles(response.bundles, paginationInfo, loadMore);
      this.bundleSuggestionsStore.saveBundlesToStorage();
      
    } catch (error) {
      console.error('Failed to generate trip bundle:', error);
      this.bundleSuggestionsStore.setError('Failed to generate trip bundle. Please try again.');
    }
  }

  async loadMoreBundles(): Promise<void> {
    if (!this.bundleSuggestionsStore.canLoadMore) {
      console.log('Cannot load more bundles - already loading or no more available');
      return;
    }
    
    return this.generateTripBundles(true);
  }

  // New Storage-based User Preference Actions
  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<boolean> {
    const success = await UserPreferencesStorage.setUserPreferences(preferences);
    if (success) {
      // Also update the old store for backward compatibility
      this.syncWithLegacyStore(preferences);
    }
    return success;
  }

  async getUserPreferences(): Promise<UserPreferences> {
    return UserPreferencesStorage.getUserPreferences();
  }

  async hasStoredPreferences(): Promise<boolean> {
    return UserPreferencesStorage.hasUserPreferences();
  }

  async getPreferencesCompletion(): Promise<number> {
    return UserPreferencesHelpers.getCompletionPercentage();
  }

  async clearStoredPreferences(): Promise<boolean> {
    const success = await UserPreferencesStorage.clearUserPreferences();
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
  }

  updateTravelDates(startDate?: Date, endDate?: Date, flexible = true): void {
    this.userPreferencesStore.setTravelDates(startDate, endDate, flexible);
  }

  updateGroupSize(size: number): void {
    this.userPreferencesStore.setGroupSize(size);
  }

  addPreferredCountry(country: string): void {
    this.userPreferencesStore.addPreferredCountry(country);
  }

  removePreferredCountry(country: string): void {
    this.userPreferencesStore.removePreferredCountry(country);
  }

  addExcludedCountry(country: string): void {
    this.userPreferencesStore.addExcludedCountry(country);
  }

  removeExcludedCountry(country: string): void {
    this.userPreferencesStore.removeExcludedCountry(country);
  }

  addMusicGenre(genre: string): void {
    this.userPreferencesStore.addMusicGenre(genre);
  }

  addSportsInterest(sport: string): void {
    this.userPreferencesStore.addSportsInterest(sport);
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
  }

  // Bundle Suggestion Actions
  selectBundle(bundle: TripBundle | null): void {
    this.bundleSuggestionsStore.selectBundle(bundle);
  }

  toggleBookmark(bundleId: string): void {
    this.bundleSuggestionsStore.toggleBookmark(bundleId);
  }

  clearBundles(): void {
    this.bundleSuggestionsStore.clearBundles();
  }

  retryGeneration(): void {
    this.generateTripBundles();
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
      this.userPreferencesStore.reset();
      preferences.preferredCountries.forEach(country => {
        this.userPreferencesStore.addPreferredCountry(country);
      });
    }

    if (preferences.musicGenres) {
      this.userPreferencesStore.setMusicGenres(preferences.musicGenres);
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

  private addMusicBasedPreferences(musicProfile: any): void {
    // Add entertainment preferences based on Spotify music profile
    if (musicProfile.energy > 0.7) {
      this.addEntertainmentPreference('music', 'High-energy concerts', 8);
      this.addEntertainmentPreference('nightlife', 'Dancing and clubs', 7);
    }

    if (musicProfile.danceability > 0.6) {
      this.addEntertainmentPreference('music', 'Dance music events', 7);
    }

    if (musicProfile.acousticness > 0.5) {
      this.addEntertainmentPreference('music', 'Acoustic performances', 6);
      this.addEntertainmentPreference('culture', 'Intimate venues', 5);
    }

    if (musicProfile.valence > 0.6) {
      this.addEntertainmentPreference('music', 'Upbeat performances', 7);
    } else {
      this.addEntertainmentPreference('music', 'Alternative music', 6);
    }
  }

  // Utility methods - User Preferences
  getPreferenceSummary() {
    return this.userPreferencesStore.preferenceSummary;
  }

  hasPreferences(): boolean {
    return this.userPreferencesStore.hasPreferences;
  }

  isSpotifyConnected(): boolean {
    return this.userPreferencesStore.spotifyConnected;
  }

  isPreferencesLoading(): boolean {
    return this.userPreferencesStore.isLoading;
  }

  // Utility methods - Bundle Suggestions
  getBundles(): TripBundle[] {
    return this.bundleSuggestionsStore.bundles;
  }

  isBundlesLoading(): boolean {
    return this.bundleSuggestionsStore.isLoading;
  }

  getBundlesError(): string | null {
    return this.bundleSuggestionsStore.error;
  }

  hasBundles(): boolean {
    return this.bundleSuggestionsStore.hasBundles;
  }

  isLoadingMore(): boolean {
    return this.bundleSuggestionsStore.pagination.isLoadingMore;
  }

  canLoadMore(): boolean {
    return this.bundleSuggestionsStore.canLoadMore;
  }

  getPaginationInfo() {
    return {
      currentPage: this.bundleSuggestionsStore.pagination.currentPage,
      total: this.bundleSuggestionsStore.pagination.total,
      hasMore: this.bundleSuggestionsStore.pagination.hasMore,
      isLoadingMore: this.bundleSuggestionsStore.pagination.isLoadingMore
    };
  }

  getSelectedBundle(): TripBundle | null {
    return this.bundleSuggestionsStore.selectedBundle;
  }

  isBookmarked(bundleId: string): boolean {
    return this.bundleSuggestionsStore.isBookmarked(bundleId);
  }

  getBundleStatistics() {
    return this.bundleSuggestionsStore.statistics;
  }
}

export default TripActions;
