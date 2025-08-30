import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { IntegrationsStorage } from '../storage';
import { SpotifyService } from '../services';
import { UserPreferencesStore } from '../store';
import { IntegrationActions } from '../actions';
import './IntegrationsTab.css';

// Integration Icons Components
const SpotifyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const AppleMusicIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043C21.003.517 20.373.285 19.7.164c-.517-.093-1.038-.135-1.564-.15-.04-.001-.08-.006-.12-.006H5.986c-.04 0-.08.005-.12.006-.525.015-1.046.057-1.563.15-.674.121-1.304.353-1.878.727-1.118.733-1.863 1.732-2.18 3.043-.175.72-.24 1.452-.24 2.19v11.371c0 .877.086 1.756.24 2.606.317 1.553 1.162 2.659 2.612 3.471.57.318 1.185.519 1.839.614.648.094 1.302.122 1.957.122h12.028c.655 0 1.31-.028 1.957-.122.654-.095 1.269-.296 1.839-.614 1.45-.812 2.295-1.918 2.612-3.471.154-.85.24-1.729.24-2.606V6.124zM8.747 18.048c-1.92 0-3.48-1.56-3.48-3.48s1.56-3.48 3.48-3.48c.48 0 .94.1 1.36.28v-4.64c0-.28.22-.5.5-.5h.01c.27 0 .49.21.5.48v8.84c0 1.92-1.56 3.48-3.48 3.48zm7.5-8.52c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-4.5c0-.28.22-.5.5-.5s.5.22.5.5v4.5z"/>
  </svg>
);

const GoogleMapsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

interface IntegrationsTabProps {
  onClose: () => void;
  onIntegrationsUpdate?: () => void;
  userPreferencesStore: UserPreferencesStore;
  integrationActions?: IntegrationActions;
}

export const IntegrationsTab: React.FC<IntegrationsTabProps> = observer(({ 
  onClose, 
  onIntegrationsUpdate,
  userPreferencesStore,
  integrationActions
}) => {
  // Note: Spotify connection state now comes from userPreferencesStore
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Spotify integration
  const spotifyService = new SpotifyService();

  useEffect(() => {
    console.log('🎵 [USEEFFECT] IntegrationsTab useEffect triggered');
    console.log('🎵 [USEEFFECT] Current URL:', window.location.href);
    console.log('🎵 [USEEFFECT] Current state:', { isLoading, error, spotifyDataConnected: userPreferencesStore.spotifyConnected });
    
    loadSpotifyData();
    // Check if we're returning from Spotify OAuth redirect
    checkForSpotifyRedirectReturn();
  }, []);

  // Note: Global auth return handling is now done in App.tsx

  const checkForSpotifyRedirectReturn = async () => {
    console.log('🎵 [REDIRECT CHECK] Starting redirect return check...');
    
    const authCode = localStorage.getItem('spotify_auth_code');
    const authInProgress = localStorage.getItem('spotify_auth_in_progress');
    const authError = localStorage.getItem('spotify_auth_error');
    
    console.log('🎵 [REDIRECT CHECK] LocalStorage state:', {
      authCode: !!authCode,
      authCodeValue: authCode?.substring(0, 20) + '...',
      authInProgress: !!authInProgress,
      authError: authError,
      currentSpotifyConnected: userPreferencesStore.spotifyConnected
    });
    
    if (authError) {
      console.log('🎵 [REDIRECT CHECK] Found auth error, clearing and showing error');
      localStorage.removeItem('spotify_auth_error');
      setError(`Spotify authentication failed: ${authError}`);
      return;
    }
    
    if (authCode && authInProgress) {
      console.log('🎵 [REDIRECT CHECK] Detected return from Spotify redirect, processing...');
      console.log('🎵 [REDIRECT CHECK] Current loading state:', isLoading);
      console.log('🎵 [REDIRECT CHECK] Current spotify connected:', userPreferencesStore.spotifyConnected);
      
      // Clear the flags to prevent loops
      localStorage.removeItem('spotify_auth_code');
      localStorage.removeItem('spotify_auth_in_progress');
      
      // Process the auth code
      console.log('🎵 [REDIRECT CHECK] Calling handleSpotifyConnect...');
      await handleSpotifyConnect();
    } else {
      console.log('🎵 [REDIRECT CHECK] No redirect processing needed');
    }
  };

  const loadSpotifyData = async () => {
    try {
      // Note: Spotify data now comes from MobX store, no need to load from storage
      console.log('🎵 [LOAD] Spotify connection state from store:', userPreferencesStore.spotifyConnected);
    } catch (error) {
      console.error('Error loading Spotify data:', error);
      setError('Failed to load Spotify integration data');
    }
  };

  const handleSpotifyToggle = async () => {
    if (userPreferencesStore.spotifyConnected) {
      // Disconnect Spotify
      await handleSpotifyDisconnect();
    } else {
      // Connect Spotify
      await handleSpotifyConnect();
    }
  };

  const handleSpotifyConnect = async () => {
    console.log('🎵 [CONNECT] ===== STARTING SPOTIFY CONNECTION =====');
    console.log('🎵 [CONNECT] Current state:', { isLoading, error, spotifyConnected: userPreferencesStore.spotifyConnected });
    
    setIsLoading(true);
    setError(null);

    try {
      // Check localStorage state
      const authCode = localStorage.getItem('spotify_auth_code');
      const authInProgress = localStorage.getItem('spotify_auth_in_progress');
      
      console.log('🎵 [CONNECT] LocalStorage check:', {
        authCode: !!authCode,
        authInProgress: !!authInProgress
      });
      
      // Only clear tokens if we're not processing a redirect return
      if (!authCode) {
        console.log('🎵 [CONNECT] No auth code found, clearing any existing tokens...');
        spotifyService.forceClearTokens();
      } else {
        console.log('🎵 [CONNECT] Auth code found, skipping token clear to process redirect...');
      }
      
      console.log('🎵 [CONNECT] Calling spotifyService.authenticate()...');
      // Start Spotify OAuth flow
      const success = await spotifyService.authenticate();
      
      console.log('🎵 [CONNECT] Authentication result:', success);
      
      if (success) {
        console.log('🎵 [CONNECT] ===== AUTHENTICATION SUCCESSFUL =====');
        console.log('🎵 [CONNECT] Fetching user data...');
        
        // Get user profile and preferences
        const [profile, preferences] = await Promise.all([
          spotifyService.getUserProfile(),
          spotifyService.getUserPreferences()
        ]);

        console.log('🎵 [CONNECT] Profile received:', profile);
        console.log('🎵 [CONNECT] Preferences received:', preferences);

        // Save to integrations storage
        console.log('🎵 [CONNECT] Saving to integrations storage...');
        await IntegrationsStorage.connectSpotify(profile, preferences);
        
        console.log('🎵 [CONNECT] Data saved to storage successfully');
        
        console.log('🎵 [CONNECT] Spotify connection completed, data now in MobX store');

        // Notify parent component
        console.log('🎵 [CONNECT] Notifying parent component...');
        onIntegrationsUpdate?.();
        
        console.log('✅ [CONNECT] ===== SPOTIFY CONNECTED SUCCESSFULLY =====');
      } else {
        console.error('🎵 [CONNECT] ===== AUTHENTICATION FAILED =====');
        setError('Failed to authenticate with Spotify');
      }
    } catch (error) {
      console.error('🎵 [CONNECT] ===== SPOTIFY CONNECTION ERROR =====');
      console.error('🎵 [CONNECT] Error details:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect to Spotify');
    } finally {
      console.log('🎵 [CONNECT] Setting loading to false, final state will be:', {
        isLoading: false,
        error,
        spotifyDataConnected: userPreferencesStore.spotifyConnected
      });
      setIsLoading(false);
    }
  };

  const handleSpotifyDisconnect = async () => {
    if (!integrationActions) {
      setError('Integration actions not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use integration actions to properly disconnect and update all stores
      await integrationActions.disconnectSpotify();
      
      console.log('🎵 [DISCONNECT] Spotify disconnected, all stores updated');

      // Notify parent component
      onIntegrationsUpdate?.();
      
      console.log('✅ Spotify disconnected successfully');
    } catch (error) {
      console.error('Spotify disconnection error:', error);
      setError('Failed to disconnect from Spotify');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshSpotifyData = async () => {
    if (!userPreferencesStore.spotifyConnected) return;

    setIsLoading(true);
    setError(null);

    try {
      // Refresh user preferences
      const preferences = await spotifyService.getUserPreferences();
      
      // Update storage
      await IntegrationsStorage.setSpotifyData({
        preferences,
        lastSyncAt: new Date().toISOString()
      });
      
      // Note: Spotify preferences now managed by MobX store
      console.log('🎵 [REFRESH] Spotify preferences refreshed in MobX store');

      console.log('✅ Spotify data refreshed successfully');
    } catch (error) {
      console.error('Spotify refresh error:', error);
      setError('Failed to refresh Spotify data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatLastSync = (lastSyncAt?: string) => {
    if (!lastSyncAt) return 'Never';
    
    const date = new Date(lastSyncAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="integrations-tab">
      <div className="integrations-header">
        <h2>🔗 Integrations</h2>
        <p>Connect your accounts to personalize your trip recommendations</p>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button 
            className="error-dismiss"
            onClick={() => setError(null)}
          >
            ✕
          </button>
        </div>
      )}

      <div className="integrations-list">
        {/* Spotify Integration */}
        <div className="integration-card">
          <div className="integration-header">
            <div className="integration-info">
              <div className="integration-icon spotify-icon">
                <SpotifyIcon />
              </div>
              <div className="integration-details">
                <h3>Spotify</h3>
                <p>Connect your Spotify account to get music-based travel recommendations</p>
              </div>
            </div>
            
            <div className="integration-toggle">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={userPreferencesStore.spotifyConnected}
                  onChange={handleSpotifyToggle}
                  disabled={isLoading}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          {userPreferencesStore.spotifyConnected && userPreferencesStore.spotifyProfile && (
            <div className="integration-status">
              <div className="status-info">
                <div className="user-info">
                  <span className="user-name">
                    Connected as: <strong>{userPreferencesStore.spotifyProfile.displayName}</strong>
                  </span>
                  <span className="last-sync">
                    Last synced: {formatLastSync(userPreferencesStore.lastUpdated?.toISOString())}
                  </span>
                </div>
                
                {userPreferencesStore.spotifyProfile && (
                  <div className="preferences-summary">
                    <div className="spotify-stats">
                      {userPreferencesStore.spotifyProfile.topGenres && userPreferencesStore.spotifyProfile.topGenres.length > 0 && (
                        <div className="stat-item">
                          <span className="stat-label">Top Genres:</span>
                          <span className="stat-value">{userPreferencesStore.spotifyProfile.topGenres.slice(0, 3).join(', ')}</span>
                        </div>
                      )}
                      {userPreferencesStore.spotifyProfile.topArtists && userPreferencesStore.spotifyProfile.topArtists.length > 0 && (
                        <div className="stat-item">
                          <span className="stat-label">Favorite Artists:</span>
                          <span className="stat-value">{userPreferencesStore.spotifyProfile.topArtists.slice(0, 2).join(', ')}</span>
                        </div>
                      )}
                      {/* Music profile display removed - not available in store */}
                      {/* Top tracks display removed - not available in store */}
                    </div>
                  </div>
                )}
              </div>

              <button
                className="refresh-button"
                onClick={handleRefreshSpotifyData}
                disabled={isLoading}
                title="Refresh Spotify data"
              >
                {isLoading ? '⏳' : '🔄'}
              </button>
            </div>
          )}

          {isLoading && (
            <div className="integration-loading">
              <div className="loader"></div>
              <span>
                {userPreferencesStore.spotifyConnected 
                  ? 'Refreshing Spotify data...' 
                  : 'Connecting to Spotify...'}
              </span>
            </div>
          )}
        </div>

        {/* Placeholder for future integrations */}
        <div className="integration-card disabled">
          <div className="integration-header">
            <div className="integration-info">
              <div className="integration-icon apple-icon">
                <AppleMusicIcon />
              </div>
              <div className="integration-details">
                <h3>Apple Music</h3>
                <p>Coming soon - Connect your Apple Music account</p>
              </div>
            </div>
            
            <div className="integration-toggle">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={false}
                  disabled={true}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="integration-card disabled">
          <div className="integration-header">
            <div className="integration-info">
              <div className="integration-icon google-icon">
                <GoogleMapsIcon />
              </div>
              <div className="integration-details">
                <h3>Google Maps</h3>
                <p>Coming soon - Connect your Google account for location preferences</p>
              </div>
            </div>
            
            <div className="integration-toggle">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={false}
                  disabled={true}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="integrations-footer">
        <button 
          className="close-button"
          onClick={onClose}
        >
          Done
        </button>
      </div>
    </div>
  );
});

export default IntegrationsTab;
