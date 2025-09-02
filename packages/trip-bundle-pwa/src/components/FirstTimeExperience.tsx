import React, { useState, useEffect } from 'react';
import { UserPreferences, DateRange } from '../types';
import { getDefaultUserPreferences } from '../storage';
import { spotifyService } from '../services';
import { getConfig } from '../config/production';
import './FirstTimeExperience.css';

interface FirstTimeExperienceProps {
  onComplete: (preferences: UserPreferences, dateRange: DateRange) => void;
}

export const FirstTimeExperience: React.FC<FirstTimeExperienceProps> = ({ onComplete }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(getDefaultUserPreferences());
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: Date.now(),
    endDate: Date.now() + (4 * 30 * 24 * 60 * 60 * 1000) // Default to 4 months from now
  });
  const [isConnectingSpotify, setIsConnectingSpotify] = useState(false);
  
  // Check if Spotify is available in current configuration
  const config = getConfig();
  const isSpotifyAvailable = !!config.SPOTIFY_CLIENT_ID;
  
  console.log('🎵 [FTE_INIT] Spotify availability:', {
    isSpotifyAvailable,
    clientId: config.SPOTIFY_CLIENT_ID,
    redirectUri: config.SPOTIFY_REDIRECT_URI
  });

  // Check if we're returning from Spotify authentication
  useEffect(() => {
    const checkSpotifyReturn = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const spotifyAuthReturn = urlParams.get('spotify_auth_return');
      const authCode = localStorage.getItem('spotify_auth_code');
      
      console.log('🎵 [FTE_SPOTIFY_RETURN] Checking for Spotify return:', {
        spotifyAuthReturn: !!spotifyAuthReturn,
        hasAuthCode: !!authCode,
        currentUrl: window.location.href
      });

      if (spotifyAuthReturn && authCode && !isSpotifyConnected()) {
        console.log('🎵 [FTE_SPOTIFY_RETURN] Processing Spotify return with auth code');
        setIsConnectingSpotify(true);
        
        try {
          // Handle the callback with the stored auth code
          const success = await spotifyService.handleCallback(authCode);
          console.log('🎵 [FTE_SPOTIFY_RETURN] Callback handling result:', success);
          
          if (success) {
            console.log('🎵 [FTE_SPOTIFY_RETURN] ✅ Authentication successful, fetching user preferences...');
            const userPrefs = await spotifyService.getUserPreferences();
            console.log('🎵 [FTE_SPOTIFY_RETURN] User preferences fetched:', {
              topGenres: userPrefs.topGenres?.length || 0,
              topArtists: userPrefs.topArtists?.length || 0,
              topTracks: userPrefs.topTracks?.length || 0
            });
            
            // Generate textual music profile for AI understanding
            const textualMusicProfile = spotifyService.generateTextualMusicProfile(userPrefs);
            console.log('🎵 [FTE_SPOTIFY_RETURN] Generated textual profile:', textualMusicProfile);
            
            console.log('🎵 [FTE_SPOTIFY_RETURN] ✅ Music profile created, updating state...');
            handleMusicProfileChange(textualMusicProfile);
            console.log('🎵 [FTE_SPOTIFY_RETURN] ✅ Spotify connection completed successfully!');
            
            // Visual success indication only (no popup)
            
            // Clean up localStorage and URL
            localStorage.removeItem('spotify_auth_code');
            localStorage.removeItem('spotify_auth_state');
            window.history.replaceState({}, document.title, window.location.pathname);
            
          } else {
            console.error('🎵 [FTE_SPOTIFY_RETURN] ❌ Callback handling failed');
            alert('Failed to complete Spotify authentication. Please try again.');
            localStorage.removeItem('spotify_auth_code');
            localStorage.removeItem('spotify_auth_state');
          }
        } catch (error) {
          console.error('🎵 [FTE_SPOTIFY_RETURN] ❌ Error processing Spotify return:', error);
          alert('Error completing Spotify authentication. Please try again.');
          localStorage.removeItem('spotify_auth_code');
          localStorage.removeItem('spotify_auth_state');
        } finally {
          setIsConnectingSpotify(false);
        }
      }
    };

    checkSpotifyReturn();
  }, []);

  const isSpotifyConnected = () => {
    if (!preferences.musicProfile) {
      console.log('🎵 [FTE_SPOTIFY_STATE] No music profile set');
      return false;
    }
    
    // Check if the music profile contains Spotify-specific indicators
    const isConnected = preferences.musicProfile.includes('Favorite artists include') || 
                       preferences.musicProfile.includes('Primary music genres are') ||
                       preferences.musicProfile.includes('Recent favorite songs include');
    
    console.log('🎵 [FTE_SPOTIFY_STATE] Connection status:', isConnected, 'Profile length:', preferences.musicProfile.length);
    return isConnected;
  };

  const handleInterestChange = (interestKey: keyof typeof preferences.interestTypes, isEnabled: boolean) => {
    setPreferences((prev: UserPreferences) => ({
      ...prev,
      interestTypes: {
        ...prev.interestTypes,
        [interestKey]: { isEnabled }
      }
    }));
  };

  const handleMusicProfileChange = (value: string) => {
    setPreferences((prev: UserPreferences) => ({
      ...prev,
      musicProfile: value
    }));
  };

  const handleSpotifyConnect = async () => {
    console.log('🎵 [FTE_SPOTIFY] Starting Spotify connection...');
    if (isConnectingSpotify) {
      console.log('🎵 [FTE_SPOTIFY] Already connecting, ignoring duplicate request');
      return;
    }
    
    setIsConnectingSpotify(true);
    try {
      console.log('🎵 [FTE_SPOTIFY] Calling spotifyService.authenticate()...');
      const success = await spotifyService.authenticate();
      console.log('🎵 [FTE_SPOTIFY] Authentication result:', success);
      
      if (success) {
        console.log('🎵 [FTE_SPOTIFY] ✅ Authentication successful, fetching user preferences...');
        const userPrefs = await spotifyService.getUserPreferences();
        console.log('🎵 [FTE_SPOTIFY] User preferences fetched:', {
          topGenres: userPrefs.topGenres?.length || 0,
          topArtists: userPrefs.topArtists?.length || 0,
          topTracks: userPrefs.topTracks?.length || 0
        });
        
        // Generate textual music profile for AI understanding
        const textualMusicProfile = spotifyService.generateTextualMusicProfile(userPrefs);
        console.log('🎵 [FTE_SPOTIFY] Generated textual profile:', textualMusicProfile);
        
        console.log('🎵 [FTE_SPOTIFY] ✅ Music profile created, updating state...');
        handleMusicProfileChange(textualMusicProfile);
        console.log('🎵 [FTE_SPOTIFY] ✅ Spotify connection completed successfully!');
      } else {
        console.error('🎵 [FTE_SPOTIFY] ❌ Spotify authentication failed');
        alert('Failed to connect to Spotify. Please try again or use the text field instead.');
      }
    } catch (error) {
      console.error('🎵 [FTE_SPOTIFY] ❌ Error connecting to Spotify:', error);
      
      // Check if it's a configuration error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('Client ID not configured')) {
        console.log('🎵 [FTE_SPOTIFY] Configuration issue detected - showing user-friendly message');
        alert('Spotify integration is not available in this deployment. Please use the text field to describe your music preferences instead.');
      } else {
        alert('Error connecting to Spotify. Please try again or use the text field instead.');
      }
    } finally {
      console.log('🎵 [FTE_SPOTIFY] Setting connecting state to false');
      setIsConnectingSpotify(false);
    }
  };

  const handleFreeTextChange = (value: string) => {
    setPreferences((prev: UserPreferences) => ({
      ...prev,
      freeTextInterests: value
    }));
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = new Date(e.target.value).getTime();
    setDateRange((prev: DateRange) => ({
      ...prev,
      startDate: newStartDate,
      // Ensure end date is after start date
      endDate: Math.max(prev.endDate, newStartDate + (24 * 60 * 60 * 1000))
    }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = new Date(e.target.value).getTime();
    setDateRange((prev: DateRange) => ({
      ...prev,
      endDate: newEndDate
    }));
  };

  const isFormValid = () => {
    // At least one interest must be selected
    const hasInterests = Object.values(preferences.interestTypes).some((interest: any) => interest.isEnabled);
    // Date range must be valid
    const validDateRange = dateRange.endDate > dateRange.startDate;
    
    return hasInterests && validDateRange;
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      onComplete(preferences, dateRange);
    }
  };

  const formatDateForInput = (timestamp: number) => {
    return new Date(timestamp).toISOString().split('T')[0];
  };

  return (
    <div className="first-time-experience">
      <div className="fte-container">
        <h1>🎯 Plan Your Perfect Trip</h1>
        <p>Tell us what you're interested in and when you'd like to travel</p>

        <div className="fte-section">
          <h2>What interests you?</h2>
          <div className="interests-grid">
            {Object.entries(preferences.interestTypes).map(([key, interest]: [string, any]) => (
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

        <div className="fte-section">
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
                style={isSpotifyConnected() ? { backgroundColor: '#e8f5e8', color: '#2d5a2d', fontWeight: 'bold' } : {}}
              />
            </div>
          </div>
        </div>

        <div className="fte-section">
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

        <div className="fte-section">
          <h2>Additional Interests</h2>
          <textarea
            value={preferences.freeTextInterests}
            onChange={(e) => handleFreeTextChange(e.target.value)}
            placeholder="Tell us about any specific interests, activities, or experiences you're looking for..."
            rows={4}
          />
        </div>

        <button 
          className={`go-button ${isFormValid() ? 'enabled' : 'disabled'}`}
          onClick={handleSubmit}
          disabled={!isFormValid()}
        >
          GO! 🚀
        </button>
      </div>
    </div>
  );
};