import UserPreferencesStore from '../store/userPreferences';
import SpotifyService from '../services/spotifyService';
import { IntegrationsStorage } from '../storage/integrations';

export class IntegrationActions {
  private userPreferencesStore: UserPreferencesStore;
  private spotifyService: SpotifyService;
  private integrationsStorage: typeof IntegrationsStorage;

  constructor(
    userPreferencesStore: UserPreferencesStore,
    spotifyService: SpotifyService,
    integrationsStorage: typeof IntegrationsStorage = IntegrationsStorage
  ) {
    this.userPreferencesStore = userPreferencesStore;
    this.spotifyService = spotifyService;
    this.integrationsStorage = integrationsStorage;
  }

  // Spotify Integration Actions
  async connectSpotify(): Promise<boolean> {
    try {
      if (!this.spotifyService.isConfigured()) {
        throw new Error('Spotify integration not configured');
      }

      this.userPreferencesStore.setLoading(true);
      
      // Get auth URL and redirect user
      const authUrl = await this.spotifyService.getAuthUrl();
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
      const success = await this.spotifyService.handleCallback(code);
      if (!success) {
        throw new Error('Failed to exchange Spotify authorization code');
      }

      // Get user profile and preferences
      console.log('🎵 [INTEGRATION_ACTIONS] Fetching user profile and preferences...');
      const [profile, preferences] = await Promise.all([
        this.spotifyService.getUserProfile(),
        this.spotifyService.getUserPreferences()
      ]);

      console.log('🎵 [INTEGRATION_ACTIONS] Profile:', { id: profile.id, displayName: profile.display_name });
      console.log('🎵 [INTEGRATION_ACTIONS] Preferences:', { topGenres: preferences.topGenres, topArtists: preferences.topArtists?.length });

      // Save to storage first
      console.log('🎵 [INTEGRATION_ACTIONS] Saving Spotify data to storage...');
      const storageSuccess = await this.integrationsStorage.connectSpotify(profile, preferences);
      if (!storageSuccess) {
        console.error('Failed to save Spotify data to storage');
      }

      // Update user preferences store with Spotify data
      console.log('🎵 [INTEGRATION_ACTIONS] Setting Spotify connection in store...');
      this.userPreferencesStore.setSpotifyConnection(true, {
        id: profile.id,
        displayName: profile.display_name,
        topGenres: preferences.topGenres,
        topArtists: preferences.topArtists.map(artist => artist.name)
      });
      console.log('🎵 [INTEGRATION_ACTIONS] Spotify connection set successfully');

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

  async disconnectSpotify(): Promise<void> {
    // Disconnect from integration service
    this.spotifyService.disconnect();
    
    // Clear from storage
    await this.integrationsStorage.disconnectSpotify();
    
    // Update store
    this.userPreferencesStore.setSpotifyConnection(false);
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

  private addEntertainmentPreference(type: 'music' | 'sports' | 'culture' | 'food' | 'nature' | 'nightlife', value: string, weight: number): void {
    this.userPreferencesStore.addEntertainmentPreference({
      id: `${type}-${value}-${Date.now()}`,
      type,
      value,
      weight
    });
  }

  // Utility methods
  isSpotifyConnected(): boolean {
    return this.userPreferencesStore.spotifyConnected;
  }

  isLoading(): boolean {
    return this.userPreferencesStore.isLoading;
  }
}

/**
 * Initialize integrations data from storage and sync with stores
 */
export async function initIntegrationsData(
  userPreferencesStore: UserPreferencesStore,
  integrationsStorage: typeof IntegrationsStorage = IntegrationsStorage
): Promise<void> {
  try {
    console.log('🔗 [INIT_INTEGRATIONS] Loading integrations data from storage...');
    
    // Get integrations data from storage
    const integrationsData = await integrationsStorage.getIntegrationsData();
    console.log('🔗 [INIT_INTEGRATIONS] Loaded integrations data:', integrationsData);

    // Initialize Spotify integration if connected
    if (integrationsData.spotify.isConnected && integrationsData.spotify.profile) {
      console.log('🎵 [INIT_INTEGRATIONS] Spotify is connected, initializing...');
      
      const spotifyData = integrationsData.spotify;
      const profile = spotifyData.profile;
      
      if (profile) {
        // Update user preferences store with Spotify data
        userPreferencesStore.setSpotifyConnection(true, {
          id: profile.id,
          displayName: profile.display_name,
          topGenres: spotifyData.preferences?.topGenres || [],
          topArtists: spotifyData.preferences?.topArtists?.map(artist => artist.name) || []
        });
      }

      // Update music preferences if available
      if (spotifyData.preferences?.topGenres) {
        userPreferencesStore.setMusicGenres(spotifyData.preferences.topGenres);
      }

      console.log('🎵 [INIT_INTEGRATIONS] Spotify integration initialized successfully');
    } else {
      console.log('🎵 [INIT_INTEGRATIONS] Spotify not connected, skipping initialization');
    }

    console.log('🔗 [INIT_INTEGRATIONS] Integrations initialization completed');
  } catch (error) {
    console.error('🔗 [INIT_INTEGRATIONS] Error initializing integrations data:', error);
  }
}

export default IntegrationActions;
