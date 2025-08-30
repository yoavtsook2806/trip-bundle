import React, { useState, useEffect } from 'react';
import { IntegrationsStorage, SpotifyIntegrationData } from '../storage';
import { SpotifyIntegration } from '../integrations';
import './IntegrationsTab.css';

interface IntegrationsTabProps {
  onClose: () => void;
  onIntegrationsUpdate?: () => void;
}

export const IntegrationsTab: React.FC<IntegrationsTabProps> = ({ 
  onClose, 
  onIntegrationsUpdate 
}) => {
  const [spotifyData, setSpotifyData] = useState<SpotifyIntegrationData>({
    isConnected: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Spotify integration
  const spotifyIntegration = new SpotifyIntegration();

  useEffect(() => {
    loadSpotifyData();
  }, []);

  const loadSpotifyData = async () => {
    try {
      const data = await IntegrationsStorage.getSpotifyData();
      setSpotifyData(data);
    } catch (error) {
      console.error('Error loading Spotify data:', error);
      setError('Failed to load Spotify integration data');
    }
  };

  const handleSpotifyToggle = async () => {
    if (spotifyData.isConnected) {
      // Disconnect Spotify
      await handleSpotifyDisconnect();
    } else {
      // Connect Spotify
      await handleSpotifyConnect();
    }
  };

  const handleSpotifyConnect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Start Spotify OAuth flow
      const success = await spotifyIntegration.authenticate();
      
      if (success) {
        // Get user profile and preferences
        const [profile, preferences] = await Promise.all([
          spotifyIntegration.getUserProfile(),
          spotifyIntegration.getUserPreferences()
        ]);

        // Save to integrations storage
        await IntegrationsStorage.connectSpotify(profile, preferences);
        
        // Update local state
        setSpotifyData({
          isConnected: true,
          profile,
          preferences,
          connectedAt: new Date().toISOString(),
          lastSyncAt: new Date().toISOString()
        });

        // Notify parent component
        onIntegrationsUpdate?.();
        
        console.log('✅ Spotify connected successfully');
      } else {
        setError('Failed to authenticate with Spotify');
      }
    } catch (error) {
      console.error('Spotify connection error:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect to Spotify');
    } finally {
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
      
      // Update local state
      setSpotifyData({
        isConnected: false
      });

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
    if (!spotifyData.isConnected) return;

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
      
      // Update local state
      setSpotifyData(prev => ({
        ...prev,
        preferences,
        lastSyncAt: new Date().toISOString()
      }));

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
                  checked={spotifyData.isConnected}
                  onChange={handleSpotifyToggle}
                  disabled={isLoading}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          {spotifyData.isConnected && spotifyData.profile && (
            <div className="integration-status">
              <div className="status-info">
                <div className="user-info">
                  <span className="user-name">
                    Connected as: <strong>{spotifyData.profile.display_name}</strong>
                  </span>
                  <span className="last-sync">
                    Last synced: {formatLastSync(spotifyData.lastSyncAt)}
                  </span>
                </div>
                
                {spotifyData.preferences && (
                  <div className="preferences-summary">
                    <span className="top-genres">
                      Top genres: {spotifyData.preferences.topGenres.slice(0, 3).join(', ')}
                    </span>
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
                {spotifyData.isConnected 
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
};

export default IntegrationsTab;
