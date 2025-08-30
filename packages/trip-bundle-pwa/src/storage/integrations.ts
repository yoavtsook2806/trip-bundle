import { SpotifyUserProfile, SpotifyUserPreferences } from '../services/spotifyService';

export interface SpotifyIntegrationData {
  isConnected: boolean;
  profile?: SpotifyUserProfile;
  preferences?: SpotifyUserPreferences;
  connectedAt?: string;
  lastSyncAt?: string;
}

export interface IntegrationsData {
  spotify: SpotifyIntegrationData;
  // Future integrations can be added here
  // google?: GoogleIntegrationData;
  // apple?: AppleIntegrationData;
}

const INTEGRATIONS_STORAGE_KEY = 'trip-bundle-integrations';

export class IntegrationsStorage {
  /**
   * Get all integrations data
   */
  static async getIntegrationsData(): Promise<IntegrationsData> {
    try {
      const stored = localStorage.getItem(INTEGRATIONS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          spotify: {
            isConnected: false,
            ...parsed.spotify
          }
        };
      }
    } catch (error) {
      console.error('Error loading integrations data:', error);
    }

    // Return default integrations data
    return {
      spotify: {
        isConnected: false
      }
    };
  }

  /**
   * Set integrations data
   */
  static async setIntegrationsData(data: Partial<IntegrationsData>): Promise<boolean> {
    try {
      const current = await this.getIntegrationsData();
      const updated = {
        ...current,
        ...data
      };
      
      localStorage.setItem(INTEGRATIONS_STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Error saving integrations data:', error);
      return false;
    }
  }

  /**
   * Get Spotify integration data
   */
  static async getSpotifyData(): Promise<SpotifyIntegrationData> {
    const integrations = await this.getIntegrationsData();
    return integrations.spotify;
  }

  /**
   * Set Spotify integration data
   */
  static async setSpotifyData(spotifyData: Partial<SpotifyIntegrationData>): Promise<boolean> {
    const current = await this.getIntegrationsData();
    const updated = {
      ...current,
      spotify: {
        ...current.spotify,
        ...spotifyData,
        lastSyncAt: new Date().toISOString()
      }
    };
    
    return this.setIntegrationsData(updated);
  }

  /**
   * Connect Spotify integration
   */
  static async connectSpotify(profile: SpotifyUserProfile, preferences: SpotifyUserPreferences): Promise<boolean> {
    return this.setSpotifyData({
      isConnected: true,
      profile,
      preferences,
      connectedAt: new Date().toISOString()
    });
  }

  /**
   * Disconnect Spotify integration
   */
  static async disconnectSpotify(): Promise<boolean> {
    return this.setSpotifyData({
      isConnected: false,
      profile: undefined,
      preferences: undefined,
      connectedAt: undefined
    });
  }

  /**
   * Clear all integrations data
   */
  static async clearAllIntegrations(): Promise<boolean> {
    try {
      localStorage.removeItem(INTEGRATIONS_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing integrations data:', error);
      return false;
    }
  }
}

/**
 * Helper functions for integrations
 */
export class IntegrationsHelpers {
  /**
   * Check if any integrations are connected
   */
  static async hasAnyIntegrations(): Promise<boolean> {
    const integrations = await IntegrationsStorage.getIntegrationsData();
    return integrations.spotify.isConnected;
  }

  /**
   * Get connected integrations summary
   */
  static async getConnectedIntegrationsSummary(): Promise<string[]> {
    const integrations = await IntegrationsStorage.getIntegrationsData();
    const connected: string[] = [];

    if (integrations.spotify.isConnected) {
      connected.push('Spotify');
    }

    return connected;
  }


}
