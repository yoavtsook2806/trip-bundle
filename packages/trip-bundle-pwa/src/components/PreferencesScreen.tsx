import React, { useState, useEffect } from 'react';
import { UserPreferences, DateRange, PromptsUsage } from '../types';
import { canMakePromptCall } from '../storage';
import './PreferencesScreen.css';

interface PreferencesScreenProps {
  initialPreferences: UserPreferences;
  initialDateRange: DateRange;
  promptsUsage: PromptsUsage;
  onSave: (preferences: UserPreferences, dateRange: DateRange) => void;
  onCancel: () => void;
}

export const PreferencesScreen: React.FC<PreferencesScreenProps> = ({
  initialPreferences,
  initialDateRange,
  promptsUsage,
  onSave,
  onCancel
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>(initialPreferences);
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);
  const [hasChanges, setHasChanges] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Check for changes
  useEffect(() => {
    const prefsChanged = JSON.stringify(preferences) !== JSON.stringify(initialPreferences);
    const datesChanged = JSON.stringify(dateRange) !== JSON.stringify(initialDateRange);
    setHasChanges(prefsChanged || datesChanged);
  }, [preferences, dateRange, initialPreferences, initialDateRange]);

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
          <button className="close-button" onClick={handleCancel}>
            ✕
          </button>
          <h1>⚙️ Preferences</h1>
          <div className="usage-indicator">
            <span className={`usage-count ${isLimitReached ? 'limit-reached' : ''}`}>
              {promptsUsage.count}/{promptsUsage.maxDaily} calls today
            </span>
          </div>
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
                className={`music-option ${preferences.musicProfile === 'spotify' ? 'active' : ''}`}
                onClick={() => handleMusicProfileChange('spotify')}
              >
                🎵 Connect Spotify
              </button>
              <div className="music-text-option">
                <label>Or describe your music taste:</label>
                <textarea
                  value={preferences.musicProfile === 'spotify' ? '' : preferences.musicProfile}
                  onChange={(e) => handleMusicProfileChange(e.target.value)}
                  placeholder="e.g., I love indie rock, jazz, and electronic music..."
                  rows={3}
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
            {isLimitReached ? 'Daily Limit Reached' : 'Save & Generate New Bundles'}
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
