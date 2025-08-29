import React, { useState, useEffect } from 'react';
import { UserPreferences, UserPreferencesStorage } from '../storage';
import './UserPreferencesForm.css';

interface UserPreferencesFormProps {
  onPreferencesUpdate?: (preferences: UserPreferences) => void;
  onClose?: () => void;
}

export const UserPreferencesForm: React.FC<UserPreferencesFormProps> = ({
  onPreferencesUpdate,
  onClose
}) => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    { id: 'personal', title: '', icon: '👤' },
    { id: 'travel', title: '', icon: '✈️' },
    { id: 'entertainment', title: '', icon: '🎭' },
    { id: 'accommodation', title: '', icon: '🏨' }
  ];

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const userPrefs = await UserPreferencesStorage.getUserPreferences();
      setPreferences(userPrefs);
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    if (!preferences) return;
    
    const updatedPreferences = {
      ...preferences,
      [key]: value
    };
    
    setPreferences(updatedPreferences);
    
    // Auto-save the changes
    try {
      await UserPreferencesStorage.setUserPreferences({ [key]: value });
      onPreferencesUpdate?.(updatedPreferences);
    } catch (error) {
      console.error('Error auto-saving preference:', error);
    }
  };



  const addToArray = async <K extends keyof UserPreferences>(
    key: K,
    value: string
  ) => {
    if (!preferences) return;
    
    const currentArray = preferences[key] as string[];
    if (!currentArray.includes(value)) {
      await updatePreference(key, [...currentArray, value] as UserPreferences[K]);
    }
  };

  const removeFromArray = async <K extends keyof UserPreferences>(
    key: K,
    value: string
  ) => {
    if (!preferences) return;
    
    const currentArray = preferences[key] as string[];
    await updatePreference(key, currentArray.filter(item => item !== value) as UserPreferences[K]);
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

  if (!preferences) {
    return (
      <div className="preferences-form">
        <div className="error-message">
          Failed to load preferences. Please try again.
        </div>
      </div>
    );
  }

  const renderPersonalSection = () => (
    <div className="form-section">
      <h3>👤 Personal Information</h3>
      
      <div className="form-group">
        <label>Name (Optional)</label>
        <input
          type="text"
          value={preferences.name || ''}
          onChange={(e) => updatePreference('name', e.target.value)}
          placeholder="Your name"
        />
      </div>

      <div className="form-group">
        <label>Age (Optional)</label>
        <input
          type="number"
          value={preferences.age || ''}
          onChange={(e) => updatePreference('age', parseInt(e.target.value) || undefined)}
          placeholder="Your age"
          min="1"
          max="120"
        />
      </div>

      <div className="form-group">
        <label>Email (Optional)</label>
        <input
          type="email"
          value={preferences.email || ''}
          onChange={(e) => updatePreference('email', e.target.value)}
          placeholder="your@email.com"
        />
      </div>
    </div>
  );

  const renderTravelSection = () => (
    <div className="form-section">
      <h3>✈️ Travel Preferences</h3>
      
      <div className="form-group">
        <label>Budget Range ({preferences.budgetRange.currency})</label>
        <div className="range-inputs">
          <input
            type="number"
            value={preferences.budgetRange.min}
            onChange={(e) => updatePreference('budgetRange', {
              ...preferences.budgetRange,
              min: parseInt(e.target.value) || 0
            })}
            placeholder="Min budget"
          />
          <span>to</span>
          <input
            type="number"
            value={preferences.budgetRange.max}
            onChange={(e) => updatePreference('budgetRange', {
              ...preferences.budgetRange,
              max: parseInt(e.target.value) || 0
            })}
            placeholder="Max budget"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Trip Duration (days)</label>
        <div className="range-inputs">
          <input
            type="number"
            value={preferences.durationRange.min}
            onChange={(e) => updatePreference('durationRange', {
              ...preferences.durationRange,
              min: parseInt(e.target.value) || 1
            })}
            min="1"
            placeholder="Min days"
          />
          <span>to</span>
          <input
            type="number"
            value={preferences.durationRange.max}
            onChange={(e) => updatePreference('durationRange', {
              ...preferences.durationRange,
              max: parseInt(e.target.value) || 1
            })}
            min="1"
            placeholder="Max days"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Group Size</label>
        <input
          type="number"
          value={preferences.groupSize}
          onChange={(e) => updatePreference('groupSize', parseInt(e.target.value) || 1)}
          min="1"
          max="20"
        />
      </div>

      <div className="form-group">
        <label>Preferred Countries</label>
        <div className="tags-input">
          {preferences.preferredCountries.map((country, index) => (
            <span key={index} className="tag">
              {country}
              <button onClick={() => removeFromArray('preferredCountries', country)}>×</button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Add country..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                addToArray('preferredCountries', e.currentTarget.value.trim());
                e.currentTarget.value = '';
              }
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderEntertainmentSection = () => (
    <div className="form-section">
      <h3>🎭 Entertainment Preferences</h3>
      
      <div className="form-group">
        <label>Entertainment Priorities</label>
        <div className="priority-sliders">
          {Object.entries(preferences.entertainmentWeights).map(([type, weight]) => (
            <div key={type} className="priority-item">
              <label>{type.charAt(0).toUpperCase() + type.slice(1)}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={weight}
                onChange={(e) => updatePreference('entertainmentWeights', {
                  ...preferences.entertainmentWeights,
                  [type]: parseInt(e.target.value)
                })}
              />
              <span>{weight}/10</span>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Music Genres</label>
        <div className="tags-input">
          {preferences.musicGenres.map((genre, index) => (
            <span key={index} className="tag">
              {genre}
              <button onClick={() => removeFromArray('musicGenres', genre)}>×</button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Add music genre..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                addToArray('musicGenres', e.currentTarget.value.trim());
                e.currentTarget.value = '';
              }
            }}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Sports Interests</label>
        <div className="tags-input">
          {preferences.sportsInterests.map((sport, index) => (
            <span key={index} className="tag">
              {sport}
              <button onClick={() => removeFromArray('sportsInterests', sport)}>×</button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Add sport..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                addToArray('sportsInterests', e.currentTarget.value.trim());
                e.currentTarget.value = '';
              }
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderAccommodationSection = () => (
    <div className="form-section">
      <h3>🏨 Accommodation & Transport</h3>
      
      <div className="form-group">
        <label>Accommodation Type</label>
        <select
          value={preferences.accommodationType}
          onChange={(e) => updatePreference('accommodationType', e.target.value as any)}
        >
          <option value="any">Any</option>
          <option value="hotel">Hotel</option>
          <option value="hostel">Hostel</option>
          <option value="apartment">Apartment</option>
          <option value="resort">Resort</option>
        </select>
      </div>

      <div className="form-group">
        <label>Minimum Rating</label>
        <input
          type="range"
          min="1"
          max="5"
          value={preferences.accommodationRating}
          onChange={(e) => updatePreference('accommodationRating', parseInt(e.target.value))}
        />
        <span>{preferences.accommodationRating} stars</span>
      </div>

      <div className="form-group">
        <label>Transport Preference</label>
        <select
          value={preferences.transportPreference}
          onChange={(e) => updatePreference('transportPreference', e.target.value as any)}
        >
          <option value="any">Any</option>
          <option value="flight">Flight</option>
          <option value="train">Train</option>
          <option value="bus">Bus</option>
          <option value="car">Car</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="preferences-form">
      <div className="form-header">
        <h2>🎯 Trip Preferences</h2>
        <p>Customize your travel experience</p>
      </div>

      <div className="section-navigation">
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`section-btn ${currentSection === index ? 'active' : ''}`}
            onClick={() => setCurrentSection(index)}
          >
            <span className="section-icon">{section.icon}</span>
            <span className="section-title">{section.title}</span>
          </button>
        ))}
      </div>

      <div className="form-content">
        {currentSection === 0 && renderPersonalSection()}
        {currentSection === 1 && renderTravelSection()}
        {currentSection === 2 && renderEntertainmentSection()}
        {currentSection === 3 && renderAccommodationSection()}
      </div>

      <div className="form-actions">
        <div className="navigation-buttons">
          {currentSection > 0 && (
            <button
              className="nav-button prev"
              onClick={() => setCurrentSection(currentSection - 1)}
            >
              ← Previous
            </button>
          )}
          {currentSection < sections.length - 1 && (
            <button
              className="nav-button next"
              onClick={() => setCurrentSection(currentSection + 1)}
            >
              Next →
            </button>
          )}
        </div>
        
        <div className="auto-save-info">
          <span>✨ Changes saved automatically</span>
        </div>
      </div>
    </div>
  );
};

export default UserPreferencesForm;
