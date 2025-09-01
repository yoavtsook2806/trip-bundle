import React, { useState } from 'react';
import { UserPreferences, DateRange } from '../types';
import { getDefaultUserPreferences } from '../storage';
import './FirstTimeExperience.css';

interface FirstTimeExperienceProps {
  onComplete: (preferences: UserPreferences, dateRange: DateRange) => void;
}

export const FirstTimeExperience: React.FC<FirstTimeExperienceProps> = ({ onComplete }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(getDefaultUserPreferences());
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: Date.now(),
    endDate: Date.now() + (7 * 24 * 60 * 60 * 1000) // Default to 1 week from now
  });

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