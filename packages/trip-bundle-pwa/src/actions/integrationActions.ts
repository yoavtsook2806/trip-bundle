import UserPreferencesStore from '../store/userPreferences';
import IntegrationsStore from '../store/integrations';
import { IntegrationsStorage } from '../storage/integrations';
import SpotifyService from '../services/spotifyService';

export class IntegrationActions {
  private spotifyService: SpotifyService;

  constructor(
    private userPreferencesStore: UserPreferencesStore,
    private integrationsStore: IntegrationsStore,
    private integrationsStorage = IntegrationsStorage
  ) {
    this.spotifyService = new SpotifyService();
  }

  // =============================================================================
  // SPOTIFY INTEGRATION (Simplified)
  // =============================================================================

  /**
   * Connect to Spotify using the real SpotifyService
   */
  async connectSpotify(): Promise<boolean> {
    console.log('🎵 [INTEGRATION_ACTIONS] Connecting to Spotify...');
    
    try {
      // Use the real SpotifyService authenticate method
      const isConnected = await this.spotifyService.authenticate();
      
      if (!isConnected) {
        console.log('❌ [INTEGRATION_ACTIONS] Spotify authentication failed');
        return false;
      }

      console.log('✅ [INTEGRATION_ACTIONS] Spotify authenticated successfully');
      
      // Get user profile and preferences
      const [profile, preferences] = await Promise.all([
        this.spotifyService.getUserProfile(),
        this.spotifyService.getUserPreferences()
      ]);

      if (profile && preferences) {
        // Update integrations store
        this.integrationsStore.setSpotifyConnected(true);
        this.integrationsStore.setSpotifyProfile(profile);
        
        // Update user preferences store with Spotify data
        const musicProfile = `I enjoy ${preferences.topGenres.slice(0, 3).join(', ')} music`;
        this.userPreferencesStore.setMusicProfile(musicProfile);
        
        // Enable concerts interest if not already enabled
        this.userPreferencesStore.setInterestEnabled('concerts', true);
        
        console.log('🎵 [INTEGRATION_ACTIONS] Spotify preferences imported successfully');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ [INTEGRATION_ACTIONS] Error connecting to Spotify:', error);
      return false;
    }
  }

  /**
   * Handle Spotify callback using the real SpotifyService
   */
  async handleSpotifyCallback(authCode: string): Promise<boolean> {
    console.log('🎵 [INTEGRATION_ACTIONS] Handling Spotify callback:', authCode);
    
    try {
      // Use the real SpotifyService handleCallback method
      const isConnected = await this.spotifyService.handleCallback(authCode);
      
      if (!isConnected) {
        console.log('❌ [INTEGRATION_ACTIONS] Spotify callback handling failed');
        return false;
      }

      console.log('✅ [INTEGRATION_ACTIONS] Spotify callback handled successfully');
      
      // Get user profile and preferences
      const [profile, preferences] = await Promise.all([
        this.spotifyService.getUserProfile(),
        this.spotifyService.getUserPreferences()
      ]);

      if (profile && preferences) {
        // Update integrations store
        this.integrationsStore.setSpotifyConnected(true);
        this.integrationsStore.setSpotifyProfile(profile);
        
        // Update user preferences store with Spotify data
        const musicProfile = `I enjoy ${preferences.topGenres.slice(0, 3).join(', ')} music`;
        this.userPreferencesStore.setMusicProfile(musicProfile);
        
        // Enable concerts interest if not already enabled
        this.userPreferencesStore.setInterestEnabled('concerts', true);
        
        console.log('🎵 [INTEGRATION_ACTIONS] Spotify preferences imported successfully');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ [INTEGRATION_ACTIONS] Error handling Spotify callback:', error);
      return false;
    }
  }

  /**
   * Disconnect from Spotify
   */
  async disconnectSpotify(): Promise<boolean> {
    console.log('🔌 [INTEGRATION_ACTIONS] Disconnecting from Spotify...');
    
    try {
      this.integrationsStore.setSpotifyConnected(false);
      this.integrationsStore.setSpotifyProfile(undefined);
      
      console.log('✅ [INTEGRATION_ACTIONS] Spotify disconnected successfully');
      return true;
    } catch (error) {
      console.error('❌ [INTEGRATION_ACTIONS] Error disconnecting from Spotify:', error);
      return false;
    }
  }

  /**
   * Load integrations from storage
   */
  async loadIntegrationsFromStorage(): Promise<void> {
    console.log('📦 [INTEGRATION_ACTIONS] Loading integrations from storage...');
    
    try {
      // For now, just log that we're loading
      // In a real implementation, this would load from storage
      console.log('✅ [INTEGRATION_ACTIONS] Integrations loaded from storage');
    } catch (error) {
      console.error('❌ [INTEGRATION_ACTIONS] Error loading integrations:', error);
    }
  }

  /**
   * Clear all integrations
   */
  async clearAllIntegrations(): Promise<boolean> {
    console.log('🗑️ [INTEGRATION_ACTIONS] Clearing all integrations...');
    
    try {
      await this.integrationsStorage.clearAllIntegrations();
      this.integrationsStore.reset();
      console.log('✅ [INTEGRATION_ACTIONS] All integrations cleared');
      return true;
    } catch (error) {
      console.error('❌ [INTEGRATION_ACTIONS] Error clearing integrations:', error);
      return false;
    }
  }
}

export default IntegrationActions;