import React, { useState, useEffect, useMemo } from 'react';
import { UserPreferences, DateRange, PromptsUsage } from '../types';
import { canMakePromptCall, saveUserPreferences, saveDateRange } from '../storage';
import { spotifyService } from '../services';
import { getConfig } from '../config/production';
import './PreferencesScreen.css';

interface PreferencesScreenProps {
  initialPreferences: UserPreferences;
  initialDateRange: DateRange;
  promptsUsage: PromptsUsage;
  onSave: (preferences: UserPreferences, dateRange: DateRange) => void;
  onCancel: () => void;
  isFTEMode?: boolean; // New prop to indicate if this is First Time Experience mode
}

export const PreferencesScreen: React.FC<PreferencesScreenProps> = ({
  initialPreferences,
  initialDateRange,
  promptsUsage,
  onSave,
  onCancel,
  isFTEMode = false
}) => {

  const [preferences, setPreferences] = useState<UserPreferences>(initialPreferences);
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);
  const [hasChanges, setHasChanges] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isConnectingSpotify, setIsConnectingSpotify] = useState(false);

  // Check if Spotify is available in current configuration
  const config = getConfig();
  const isSpotifyAvailable = !!config.SPOTIFY_CLIENT_ID;
  

  // Check if we're returning from Spotify authentication
  useEffect(() => {
    const checkSpotifyReturn = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const spotifyAuthReturn = urlParams.get('spotify_auth_return');
      const authCode = localStorage.getItem('spotify_auth_code');


      if (spotifyAuthReturn && authCode && !isSpotifyConnected) {
        console.log('🎵 [PREFERENCES_SPOTIFY_RETURN] Processing Spotify return with auth code');
        setIsConnectingSpotify(true);

        try {
          console.log('🎵 [PREFERENCES_SPOTIFY_RETURN] Calling spotifyService.handleCallback...');
          const success = await spotifyService.handleCallback(authCode);
          console.log('🎵 [PREFERENCES_SPOTIFY_RETURN] Callback handling result:', success);

          if (success) {
            console.log('🎵 [PREFERENCES_SPOTIFY_RETURN] ✅ Authentication successful, fetching user preferences...');
            const userPrefs = await spotifyService.getUserPreferences();
            console.log('🎵 [PREFERENCES_SPOTIFY_RETURN] User preferences fetched:', {
              topGenres: userPrefs.topGenres?.length || 0,
              topArtists: userPrefs.topArtists?.length || 0,
              topTracks: userPrefs.topTracks?.length || 0
            });

            // Generate textual music profile for AI understanding
            const textualMusicProfile = spotifyService.generateTextualMusicProfile(userPrefs);
            console.log('🎵 [PREFERENCES_SPOTIFY_RETURN] Generated textual profile:', textualMusicProfile);

            console.log('🎵 [PREFERENCES_SPOTIFY_RETURN] ✅ Music profile created, updating state...');
            handleMusicProfileChange(textualMusicProfile);
            console.log('🎵 [PREFERENCES_SPOTIFY_RETURN] ✅ Spotify connection completed successfully!');

            // Clean up localStorage and URL
            localStorage.removeItem('spotify_auth_code');
            localStorage.removeItem('spotify_auth_state');
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            console.error('🎵 [PREFERENCES_SPOTIFY_RETURN] ❌ Callback handling failed');
            localStorage.removeItem('spotify_auth_code');
            localStorage.removeItem('spotify_auth_state');
          }
        } catch (error) {
          console.error('🎵 [PREFERENCES_SPOTIFY_RETURN] ❌ Error processing Spotify return:', error);
          localStorage.removeItem('spotify_auth_code');
          localStorage.removeItem('spotify_auth_state');
        } finally {
          setIsConnectingSpotify(false);
        }
      }
    };

    checkSpotifyReturn();
  }, []);


  const isSpotifyConnected = useMemo(() => {
    if (!preferences.musicProfile) {
  return false;
    }
    
    // Check if the music profile contains Spotify-specific indicators
    const hasArtists = preferences.musicProfile.includes('Favorite artists include');
    const hasGenres = preferences.musicProfile.includes('Primary music genres are');
    const hasTracks = preferences.musicProfile.includes('Recent favorite songs include');
    
    return hasArtists || hasGenres || hasTracks;
  }, [preferences.musicProfile]);

  // Check for changes (in FTE mode, always allow saving if basic data is present)
  useEffect(() => {
    if (isFTEMode) {
      // In FTE mode, enable save button if user has selected at least one interest
      const hasInterests = Object.values(preferences.interestTypes).some(interest => interest.isEnabled);
      setHasChanges(hasInterests);
    } else {
      // In preferences mode, check for actual changes
      const prefsChanged = JSON.stringify(preferences) !== JSON.stringify(initialPreferences);
      const datesChanged = JSON.stringify(dateRange) !== JSON.stringify(initialDateRange);
      setHasChanges(prefsChanged || datesChanged);
    }
  }, [preferences, dateRange, initialPreferences, initialDateRange, isFTEMode]);

  const handleInterestChange = (interestKey: keyof typeof preferences.interestTypes, isEnabled: boolean) => {
    setPreferences(prev => {
      const updated = {
        ...prev,
        interestTypes: {
          ...prev.interestTypes,
          [interestKey]: { isEnabled }
        }
      };
      
      // Save to storage immediately to persist through app reinitializations
      saveUserPreferences(updated);
      
      return updated;
    });
  };

  const handleMusicProfileChange = (value: string) => {
    setPreferences(prev => {
      const updated = {
        ...prev,
        musicProfile: value
      };
      
      // Save to storage immediately to persist through app reinitializations
      saveUserPreferences(updated);
      
      return updated;
    });
  };

  const handleSpotifyConnect = async () => {
    console.log('🎵 [PREFERENCES_SPOTIFY] Starting Spotify connection...');
    console.log('🎵 [PREFERENCES_SPOTIFY] Current state:', {
      isConnectingSpotify,
      isSpotifyAvailable,
      isSpotifyConnected: isSpotifyConnected,
      currentMusicProfile: preferences.musicProfile?.substring(0, 100) + '...'
    });
    
    if (isConnectingSpotify) {
      console.log('🎵 [PREFERENCES_SPOTIFY] Already connecting, ignoring duplicate request');
      return;
    }
    
    if (!isSpotifyAvailable) {
      console.error('🎵 [PREFERENCES_SPOTIFY] Spotify not available in this configuration');
      alert('Spotify integration is not available in this deployment. Please use the text field to describe your music preferences instead.');
      return;
    }
    
    setIsConnectingSpotify(true);
    console.log('🎵 [PREFERENCES_SPOTIFY] Set connecting state to true');
    
    try {
      console.log('🎵 [PREFERENCES_SPOTIFY] Calling spotifyService.authenticate()...');
      const success = await spotifyService.authenticate();
      console.log('🎵 [PREFERENCES_SPOTIFY] Authentication result:', success);
      
      if (success) {
        console.log('🎵 [PREFERENCES_SPOTIFY] ✅ Authentication successful, fetching user preferences...');
        const userPrefs = await spotifyService.getUserPreferences();
        console.log('🎵 [PREFERENCES_SPOTIFY] User preferences fetched:', {
          topGenres: userPrefs.topGenres?.length || 0,
          topArtists: userPrefs.topArtists?.length || 0,
          topTracks: userPrefs.topTracks?.length || 0
        });
        
        // Generate textual music profile for AI understanding
        const textualMusicProfile = spotifyService.generateTextualMusicProfile(userPrefs);
        console.log('🎵 [PREFERENCES_SPOTIFY] Generated textual profile:', textualMusicProfile);
        
        console.log('🎵 [PREFERENCES_SPOTIFY] ✅ Music profile created, updating state...');
        handleMusicProfileChange(textualMusicProfile);
        console.log('🎵 [PREFERENCES_SPOTIFY] ✅ Spotify connection completed successfully!');
      } else {
        console.error('🎵 [PREFERENCES_SPOTIFY] ❌ Spotify authentication failed');
        alert('Failed to connect to Spotify. Please try again or use the text field instead.');
      }
    } catch (error) {
      console.error('🎵 [PREFERENCES_SPOTIFY] ❌ Error connecting to Spotify:', error);
      
      // Check if it's a configuration issue
      if (error instanceof Error && error.message.includes('Client ID not configured')) {
        console.log('🎵 [PREFERENCES_SPOTIFY] Configuration issue detected - showing user-friendly message');
        alert('Spotify integration is not available in this deployment. Please use the text field to describe your music preferences instead.');
      } else {
        alert('Error connecting to Spotify. Please try again or use the text field instead.');
      }
    } finally {
      console.log('🎵 [PREFERENCES_SPOTIFY] Setting connecting state to false');
      setIsConnectingSpotify(false);
    }
  };

  const handleFreeTextChange = (value: string) => {
    setPreferences(prev => {
      const updated = {
        ...prev,
        freeTextInterests: value
      };
      
      // Save to storage immediately to persist through app reinitializations
      saveUserPreferences(updated);
      
      return updated;
    });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = new Date(e.target.value).getTime();
    setDateRange(prev => {
      const updated = {
        ...prev,
        startDate: newStartDate,
        endDate: Math.max(prev.endDate, newStartDate + (24 * 60 * 60 * 1000))
      };
      
      // Save to storage immediately to persist through app reinitializations
      saveDateRange(updated);
      
      return updated;
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = new Date(e.target.value).getTime();
    setDateRange(prev => {
      const updated = {
        ...prev,
        endDate: newEndDate
      };
      
      // Save to storage immediately to persist through app reinitializations
      saveDateRange(updated);
      
      return updated;
    });
  };

  const isFormValid = () => {
    const hasInterests = Object.values(preferences.interestTypes).some(interest => interest.isEnabled);
    const validDateRange = dateRange.endDate > dateRange.startDate;
    return hasInterests && validDateRange;
  };

  const handleSave = () => {
    if (isFormValid() && canMakePromptCall()) {
      onSave(preferences, dateRange);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowExitConfirm(true);
    } else {
      onCancel();
    }
  };

  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    onCancel();
  };

  const formatDateForInput = (timestamp: number) => {
    return new Date(timestamp).toISOString().split('T')[0];
  };

  const canSave = isFormValid() && hasChanges && canMakePromptCall();
  const isLimitReached = !canMakePromptCall();

  return (
    <div className="preferences-screen">
      <div className="preferences-container">
        <div className="preferences-header">
          {!isFTEMode && (
            <button className="close-button" onClick={handleCancel}>
              ✕
            </button>
          )}
          <h1>{isFTEMode ? '✈️ Plan Your Perfect Trip' : '⚙️ Preferences'}</h1>
          {!isFTEMode && (
            <div className="usage-indicator">
              <span className={`usage-count ${isLimitReached ? 'limit-reached' : ''}`}>
                {promptsUsage.count}/{promptsUsage.maxDaily} calls today
              </span>
            </div>
          )}
        </div>

        {isLimitReached && (
          <div className="limit-warning">
            ⚠️ You've reached your daily limit of {promptsUsage.maxDaily} calls. Try again tomorrow!
          </div>
        )}

        <div className="preferences-content">
          <div className="pref-section">
            <h2>What interests you?</h2>
            <div className="interests-grid">
              {Object.entries(preferences.interestTypes).map(([key, interest]) => (
                <label key={key} className="interest-checkbox">
                  <input
                    type="checkbox"
                    checked={interest.isEnabled}
                    onChange={(e) => handleInterestChange(key as keyof typeof preferences.interestTypes, e.target.checked)}
                  />
                  <span className="interest-label">
                    {key === 'artDesign' ? 'Art & Design' : 
                     key === 'localCulture' ? 'Local Culture' : 
                     key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="pref-section">
            <h2>Music Taste</h2>
            <div className="music-options">
              <button 
                className={`music-option ${isSpotifyConnected ? 'active' : ''} ${!isSpotifyAvailable ? 'disabled' : ''}`}
                onClick={handleSpotifyConnect}
                disabled={isConnectingSpotify || !isSpotifyAvailable}
                title={!isSpotifyAvailable ? 'Spotify integration not available in this deployment' : ''}
              >
                {!isSpotifyAvailable ? '🚫 Spotify Not Available' : 
                 isConnectingSpotify ? '🔄 Connecting...' : 
                 (isSpotifyConnected ? '✅ Spotify Connected' : '🎵 Connect Spotify')}
              </button>
              <div className="music-text-option">
                <label>Or describe your music taste:</label>
                <textarea
                  value={isSpotifyConnected ? '🎵 Spotify Connected! Your music preferences have been imported.' : preferences.musicProfile}
                  onChange={(e) => handleMusicProfileChange(e.target.value)}
                  placeholder="e.g., I love indie rock, jazz, and electronic music..."
                  rows={3}
                  readOnly={isSpotifyConnected}
                />
              </div>
            </div>
          </div>

          <div className="pref-section">
            <h2>When would you like to travel?</h2>
            <div className="date-range">
              <div className="date-input">
                <label>Start Date:</label>
                <input
                  type="date"
                  value={formatDateForInput(dateRange.startDate)}
                  onChange={handleStartDateChange}
                  min={formatDateForInput(Date.now())}
                />
              </div>
              <div className="date-input">
                <label>End Date:</label>
                <input
                  type="date"
                  value={formatDateForInput(dateRange.endDate)}
                  onChange={handleEndDateChange}
                  min={formatDateForInput(dateRange.startDate + (24 * 60 * 60 * 1000))}
                />
              </div>
            </div>
          </div>

          <div className="pref-section">
            <h2>Additional Interests</h2>
            <textarea
              value={preferences.freeTextInterests}
              onChange={(e) => handleFreeTextChange(e.target.value)}
              placeholder="Tell us about any specific interests, activities, or experiences you're looking for..."
              rows={4}
            />
          </div>
        </div>

        <div className="preferences-footer">
          <button 
            className={`save-button ${canSave ? 'enabled' : 'disabled'}`}
            onClick={handleSave}
            disabled={!canSave}
          >
            {isLimitReached ? 'Daily Limit Reached' : (isFTEMode ? 'GO!' : 'Save & Generate New Bundles')}
          </button>
        </div>
      </div>

      {showExitConfirm && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Unsaved Changes</h3>
            <p>You have unsaved changes. Are you sure you want to exit without saving?</p>
            <div className="modal-buttons">
              <button className="cancel-modal" onClick={() => setShowExitConfirm(false)}>
                Cancel
              </button>
              <button className="confirm-modal-btn" onClick={handleConfirmExit}>
                Exit Without Saving
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
