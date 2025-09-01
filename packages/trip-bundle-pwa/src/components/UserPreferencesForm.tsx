import React, { useState, useEffect } from 'react';
import { UserDataStorage, UserData } from '../storage';
import type { IntegrationActions } from '../actions/integrationActions';
import './UserPreferencesForm.css';

interface UserPreferencesFormProps {
  onUserDataUpdate?: (userData: UserData) => void;
  onClose?: () => void;
  onCancel?: () => void; // Separate callback for cancel (no save/reload)
  onGoPressed?: (userData: UserData) => void; // New prop for GO button
  integrationActions?: IntegrationActions;
  isFirstTimeExperience?: boolean;
  showGoButton?: boolean; // Whether to show GO button instead of save
  hasChanges?: boolean; // Whether there are unsaved changes
  onChangesDetected?: (hasChanges: boolean) => void; // Callback when changes are detected
}

export const UserPreferencesForm: React.FC<UserPreferencesFormProps> = ({
  onUserDataUpdate,
  onClose,
  onCancel,
  onGoPressed,
  integrationActions,
  isFirstTimeExperience = false,
  showGoButton = false,
  hasChanges: _hasChangesProp = false,
  onChangesDetected
}) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [originalUserData, setOriginalUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    // Check for changes whenever userData updates
    if (userData && originalUserData) {
      const hasChangesValue = JSON.stringify(userData) !== JSON.stringify(originalUserData);
      setHasChanges(hasChangesValue);
      
      // Also call the callback if provided
      if (onChangesDetected) {
        onChangesDetected(hasChangesValue);
      }
    }
  }, [userData, originalUserData, onChangesDetected]);

  const loadUserData = async () => {
    try {
      const data = await UserDataStorage.getUserData();
      setUserData(data);
      setOriginalUserData(JSON.parse(JSON.stringify(data))); // Deep copy for comparison
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = async (updates: Partial<UserData>) => {
    if (!userData) return;
    
    const updatedData = {
      ...userData,
      ...updates,
      userPreferences: {
        ...userData.userPreferences,
        ...updates.userPreferences
      },
      dateRange: {
        ...userData.dateRange,
        ...updates.dateRange
      }
    };
    
    setUserData(updatedData);
    
    // Auto-save only in FTE or when not showing save button
    if (isFirstTimeExperience || !showGoButton) {
      try {
        await UserDataStorage.setUserData(updates);
        onUserDataUpdate?.(updatedData);
      } catch (error) {
        console.error('Error auto-saving user data:', error);
      }
    }
  };

  const handleSave = async () => {
    if (!userData) return;
    
    try {
      await UserDataStorage.setUserData(userData);
      setOriginalUserData(JSON.parse(JSON.stringify(userData))); // Update baseline
      onUserDataUpdate?.(userData);
      onClose?.();
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleGo = async () => {
    console.log('🚀 [USER_PREFS_FORM] GO button pressed');
    
    if (userData) {
      try {
        // Save user data before proceeding
        await UserDataStorage.setUserData(userData);
        console.log('💾 [USER_PREFS_FORM] User data saved before GO');
        
        if (onGoPressed) {
          onGoPressed(userData);
        }
      } catch (error) {
        console.error('Error saving user data before GO:', error);
        // Still proceed even if save fails
        if (onGoPressed) {
          onGoPressed(userData);
        }
      }
    } else {
      console.warn('No user data available for GO button');
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmCancel = window.confirm('You have unsaved changes. Are you sure you want to discard them?');
      if (!confirmCancel) return;
    }
    // Use onCancel if available (preferences screen), otherwise onClose (FTE)
    if (onCancel) {
      onCancel();
    } else {
      onClose?.();
    }
  };

  if (loading) {
    return (
      <div className="preferences-form">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading preferences...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="preferences-form">
        <div className="error-message">
          Failed to load preferences. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="preferences-form">
      <div className="form-header">
        <h2>🎯 Trip Preferences</h2>
        <p>Tell us what you're interested in</p>
      </div>

      <div className="form-content">
        {/* Interest Types */}
        <div className="form-section">
          <h3>🎭 What interests you?</h3>
          <div className="interest-checkboxes">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={userData.userPreferences.interestTypes.concerts.isEnabled}
                onChange={(e) => updateUserData({
                  userPreferences: {
                    ...userData.userPreferences,
                    interestTypes: {
                      ...userData.userPreferences.interestTypes,
                      concerts: { isEnabled: e.target.checked }
                    }
                  }
                })}
              />
              <span className="checkmark"></span>
              <div className="checkbox-content">
                <span className="checkbox-icon">🎵</span>
                <span className="checkbox-label">Concerts</span>
              </div>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={userData.userPreferences.interestTypes.sports.isEnabled}
                onChange={(e) => updateUserData({
                  userPreferences: {
                    ...userData.userPreferences,
                    interestTypes: {
                      ...userData.userPreferences.interestTypes,
                      sports: { isEnabled: e.target.checked }
                    }
                  }
                })}
              />
              <span className="checkmark"></span>
              <div className="checkbox-content">
                <span className="checkbox-icon">⚽</span>
                <span className="checkbox-label">Sports</span>
              </div>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={userData.userPreferences.interestTypes.artDesign.isEnabled}
                onChange={(e) => updateUserData({
                  userPreferences: {
                    ...userData.userPreferences,
                    interestTypes: {
                      ...userData.userPreferences.interestTypes,
                      artDesign: { isEnabled: e.target.checked }
                    }
                  }
                })}
              />
              <span className="checkmark"></span>
              <div className="checkbox-content">
                <span className="checkbox-icon">🎨</span>
                <span className="checkbox-label">Art & Design</span>
              </div>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={userData.userPreferences.interestTypes.localCulture.isEnabled}
                onChange={(e) => updateUserData({
                  userPreferences: {
                    ...userData.userPreferences,
                    interestTypes: {
                      ...userData.userPreferences.interestTypes,
                      localCulture: { isEnabled: e.target.checked }
                    }
                  }
                })}
              />
              <span className="checkmark"></span>
              <div className="checkbox-content">
                <span className="checkbox-icon">🏛️</span>
                <span className="checkbox-label">Local Culture</span>
              </div>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={userData.userPreferences.interestTypes.culinary.isEnabled}
                onChange={(e) => updateUserData({
                  userPreferences: {
                    ...userData.userPreferences,
                    interestTypes: {
                      ...userData.userPreferences.interestTypes,
                      culinary: { isEnabled: e.target.checked }
                    }
                  }
                })}
              />
              <span className="checkmark"></span>
              <div className="checkbox-content">
                <span className="checkbox-icon">🍽️</span>
                <span className="checkbox-label">Culinary</span>
              </div>
            </label>
          </div>
        </div>

        {/* Music Profile */}
        <div className="form-section">
          <h3>🎵 Music Taste</h3>
          <div className="music-section">
            {/* Spotify Integration */}
            <div className="integration-item">
              <div className="integration-info">
                <span className="integration-icon">🎵</span>
                <div>
                  <h4>Connect Spotify</h4>
                  <p>Get personalized music recommendations</p>
                </div>
              </div>
              <button 
                className={`integration-btn ${userData.spotify?.connected ? 'connected' : ''}`}
                onClick={async () => {
                  if (integrationActions) {
                    console.log('🎵 [USER_PREFS_FORM] Connecting to Spotify...');
                    await integrationActions.connectSpotify();
                  }
                }}
                disabled={!integrationActions}
              >
                {userData.spotify?.connected ? 'Connected' : 'Connect'}
              </button>
            </div>

            <div className="or-divider">
              <span>OR</span>
            </div>

            {/* Free Text Music Profile */}
            <div className="form-group">
              <label>Describe your music taste</label>
              <textarea
                value={userData.userPreferences.musicProfile}
                onChange={(e) => updateUserData({
                  userPreferences: {
                    ...userData.userPreferences,
                    musicProfile: e.target.value
                  }
                })}
                placeholder="e.g., I love indie rock, electronic music, and jazz..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="form-section">
          <h3>📅 Travel Dates</h3>
          <div className="date-range-inputs">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={new Date(userData.dateRange.startDate).toISOString().split('T')[0]}
                onChange={(e) => updateUserData({
                  dateRange: {
                    ...userData.dateRange,
                    startDate: new Date(e.target.value).getTime()
                  }
                })}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={new Date(userData.dateRange.endDate).toISOString().split('T')[0]}
                onChange={(e) => updateUserData({
                  dateRange: {
                    ...userData.dateRange,
                    endDate: new Date(e.target.value).getTime()
                  }
                })}
              />
            </div>
          </div>
        </div>

        {/* Free Text Interests */}
        <div className="form-section">
          <h3>✨ Additional Interests</h3>
          <div className="form-group">
            <label>Tell us more about what you like</label>
            <textarea
              value={userData.userPreferences.freeTextInterests}
              onChange={(e) => updateUserData({
                userPreferences: {
                  ...userData.userPreferences,
                  freeTextInterests: e.target.value
                }
              })}
              placeholder="e.g., photography, hiking, nightlife, museums, local markets..."
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        {isFirstTimeExperience ? (
          // FTE: Show GO button
          <button 
            className="go-btn"
            onClick={handleGo}
            disabled={!onGoPressed}
          >
            🚀 GO!
          </button>
        ) : (
          // Regular preferences: Show save/cancel
          <div className="preferences-actions">
            <button className="cancel-btn" onClick={handleCancel}>
              ✕ Cancel
            </button>
            <button 
              className={`save-btn ${hasChanges ? 'enabled' : 'disabled'}`}
              onClick={handleSave}
              disabled={!hasChanges}
            >
              💾 Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPreferencesForm;