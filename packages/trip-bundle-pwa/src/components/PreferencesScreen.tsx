import React, { useState, useEffect } from 'react';
import { UserPreferences, DateRange, PromptsUsage } from '../types';
import { canMakePromptCall } from '../storage';
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

  const isSpotifyConnected = () => {
    if (!preferences.musicProfile) return false;
    
    // Check if the music profile contains Spotify-specific indicators
    return preferences.musicProfile.includes('Favorite artists include') || 
           preferences.musicProfile.includes('Primary music genres are') ||
           preferences.musicProfile.includes('Recent favorite songs include');
  };

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
    setPreferences(prev => ({
      ...prev,
      interestTypes: {
        ...prev.interestTypes,
        [interestKey]: { isEnabled }
      }
    }));
  };

  const handleMusicProfileChange = (value: string) => {
    setPreferences(prev => ({
      ...prev,
      musicProfile: value
    }));
  };

  const handleSpotifyConnect = async () => {
    if (isConnectingSpotify) return;
    
    setIsConnectingSpotify(true);
    try {
      console.log('🎵 Attempting to connect to Spotify...');
      const success = await spotifyService.authenticate();
      
      if (success) {
        console.log('🎵 Spotify connection successful');
        const userPrefs = await spotifyService.getUserPreferences();
        // Generate textual music profile for AI understanding
        const textualMusicProfile = spotifyService.generateTextualMusicProfile(userPrefs);
        console.log('🎵 [PREFERENCES_SPOTIFY] Generated textual profile:', textualMusicProfile);
        handleMusicProfileChange(textualMusicProfile);
      } else {
        console.warn('🎵 Spotify connection failed');
        alert('Failed to connect to Spotify. Please try again or use the text field instead.');
      }
    } catch (error) {
      console.error('🎵 Spotify connection error:', error);
      alert('Error connecting to Spotify. Please try again or use the text field instead.');
    } finally {
      setIsConnectingSpotify(false);
    }
  };

  const handleFreeTextChange = (value: string) => {
    setPreferences(prev => ({
      ...prev,
      freeTextInterests: value
    }));
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = new Date(e.target.value).getTime();
    setDateRange(prev => ({
      ...prev,
      startDate: newStartDate,
      endDate: Math.max(prev.endDate, newStartDate + (24 * 60 * 60 * 1000))
    }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = new Date(e.target.value).getTime();
    setDateRange(prev => ({
      ...prev,
      endDate: newEndDate
    }));
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
                className={`music-option ${isSpotifyConnected() ? 'active' : ''} ${!isSpotifyAvailable ? 'disabled' : ''}`}
                onClick={handleSpotifyConnect}
                disabled={isConnectingSpotify || !isSpotifyAvailable}
                title={!isSpotifyAvailable ? 'Spotify integration not available in this deployment' : ''}
              >
                {!isSpotifyAvailable ? '🚫 Spotify Not Available' : 
                 isConnectingSpotify ? '🔄 Connecting...' : 
                 (isSpotifyConnected() ? '✅ Spotify Connected' : '🎵 Connect Spotify')}
              </button>
              <div className="music-text-option">
                <label>Or describe your music taste:</label>
                <textarea
                  value={isSpotifyConnected() ? '🎵 Spotify Connected! Your music preferences have been imported.' : preferences.musicProfile}
                  onChange={(e) => handleMusicProfileChange(e.target.value)}
                  placeholder="e.g., I love indie rock, jazz, and electronic music..."
                  rows={3}
                  readOnly={isSpotifyConnected()}
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
