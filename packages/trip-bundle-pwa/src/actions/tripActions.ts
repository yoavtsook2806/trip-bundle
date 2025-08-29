import UserPreferencesStore from '../store/userPreferences';
import GPTService, { GPTRequest, TripBundle } from '../services/gptService';
import SpotifyIntegration from '../integrations/spotify';

export class TripActions {
  private userPreferencesStore: UserPreferencesStore;
  private gptService: GPTService;
  private spotifyIntegration: SpotifyIntegration;

  constructor(
    userPreferencesStore: UserPreferencesStore,
    gptService: GPTService,
    spotifyIntegration: SpotifyIntegration
  ) {
    this.userPreferencesStore = userPreferencesStore;
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
  async generateTripBundles(targetCountries: string[], maxResults = 3): Promise<TripBundle[]> {
    try {
      this.userPreferencesStore.setLoading(true);

      if (!this.gptService.isConfigured()) {
        console.warn('GPT service not configured, using mock data');
      }

      const request: GPTRequest = {
        userPreferences: this.userPreferencesStore.preferences,
        targetCountries,
        maxResults
      };

      const response = await this.gptService.generateTripBundles(request);
      
      this.userPreferencesStore.setLoading(false);
      return response.bundles;
    } catch (error) {
      console.error('Failed to generate trip bundles:', error);
      this.userPreferencesStore.setLoading(false);
      throw error;
    }
  }

  // User Preference Actions
  updateBudget(min: number, max: number, currency = 'USD'): void {
    this.userPreferencesStore.setBudgetRange(min, max, currency);
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

  // Private helper methods
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

  // Utility methods
  getPreferenceSummary() {
    return this.userPreferencesStore.preferenceSummary;
  }

  hasPreferences(): boolean {
    return this.userPreferencesStore.hasPreferences;
  }

  isSpotifyConnected(): boolean {
    return this.userPreferencesStore.spotifyConnected;
  }

  isLoading(): boolean {
    return this.userPreferencesStore.isLoading;
  }
}

export default TripActions;
