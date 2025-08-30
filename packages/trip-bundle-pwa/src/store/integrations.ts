import { makeObservable, observable, action, computed } from 'mobx';
import { SpotifyUserProfile, SpotifyUserPreferences } from '../services/spotifyService';

export interface SpotifyIntegrationState {
  isConnected: boolean;
  profile?: SpotifyUserProfile;
  preferences?: SpotifyUserPreferences;
  connectedAt?: string;
  lastSyncAt?: string;
}

export interface IntegrationsState {
  spotify: SpotifyIntegrationState;
}

class IntegrationsStore {
  integrations: IntegrationsState = {
    spotify: {
      isConnected: false
    }
  };

  constructor() {
    makeObservable(this, {
      integrations: observable,
      setSpotifyIntegration: action,
      disconnectSpotify: action,
      reset: action,
      isSpotifyConnected: computed,
      spotifyProfile: computed,
      spotifyPreferences: computed
    });
  }

  // Actions
  setSpotifyIntegration(
    isConnected: boolean,
    profile?: SpotifyUserProfile,
    preferences?: SpotifyUserPreferences,
    connectedAt?: string
  ) {
    this.integrations.spotify = {
      isConnected,
      profile,
      preferences,
      connectedAt: connectedAt || new Date().toISOString(),
      lastSyncAt: new Date().toISOString()
    };
  }

  disconnectSpotify() {
    this.integrations.spotify = {
      isConnected: false,
      profile: undefined,
      preferences: undefined,
      connectedAt: undefined,
      lastSyncAt: undefined
    };
  }

  reset() {
    this.integrations = {
      spotify: {
        isConnected: false
      }
    };
  }

  // Computed values
  get isSpotifyConnected(): boolean {
    return this.integrations.spotify.isConnected;
  }

  get spotifyProfile(): SpotifyUserProfile | undefined {
    return this.integrations.spotify.profile;
  }

  get spotifyPreferences(): SpotifyUserPreferences | undefined {
    return this.integrations.spotify.preferences;
  }

  // Generate integration context for prompts
   the 
export default IntegrationsStore;
