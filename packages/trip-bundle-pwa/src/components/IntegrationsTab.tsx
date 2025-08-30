import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { IntegrationsStorage } from '../storage';
import { SpotifyIntegration } from '../integrations';
import { UserPreferencesStore } from '../store';
import './IntegrationsTab.css';

interface IntegrationsTabProps {
  onClose: () => void;
  onIntegrationsUpdate?: () => void;
  userPreferencesStore: UserPreferencesStore;
  integrationActions?: any; // Will be properly typed later
}

export const IntegrationsTab: React.FC<IntegrationsTabProps> = observer(({ 
  onClose, 
  onIntegrationsUpdate,
  userPreferencesStore
}) => {
  // Note: Spotify connection state now comes from userPreferencesStore
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Spotify integration
  const spotifyIntegration = new SpotifyIntegration();

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
        spotifyIntegration.forceClearTokens();
      } else {
        console.log('🎵 [CONNECT] Auth code found, skipping token clear to process redirect...');
      }
      
      console.log('🎵 [CONNECT] Calling spotifyIntegration.authenticate()...');
      // Start Spotify OAuth flow
      const success = await spotifyIntegration.authenticate();
      
      console.log('🎵 [CONNECT] Authentication result:', success);
      
      if (success) {
        console.log('🎵 [CONNECT] ===== AUTHENTICATION SUCCESSFUL =====');
        console.log('🎵 [CONNECT] Fetching user data...');
        
        // Get user profile and preferences
        const [profile, preferences] = await Promise.all([
          spotifyIntegration.getUserProfile(),
          spotifyIntegration.getUserPreferences()
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
    setIsLoading(true);
    setError(null);

    try {
      // Disconnect from Spotify
      spotifyIntegration.disconnect();
      
      // Clear storage
      await IntegrationsStorage.disconnectSpotify();
      
      // Note: Spotify disconnection state now managed by MobX store
      console.log('🎵 [DISCONNECT] Spotify disconnected, state updated in MobX store');

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
      const preferences = await spotifyIntegration.getUserPreferences();
      
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
              <div className="integration-icon">🎵</div>
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
              <div className="integration-icon">🍎</div>
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
              <div className="integration-icon">📍</div>
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
