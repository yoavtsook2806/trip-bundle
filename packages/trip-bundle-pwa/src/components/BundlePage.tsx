import React, { useState, useEffect } from 'react';
import { TripBundle, Event, DateRange } from '../types';
import { getDateRange, saveDateRange, getUserPreferences, saveUserPreferences } from '../storage';
import './BundlePage.css';

interface BundlePageProps {
  bundle: TripBundle;
  onBack: () => void;
}

export const BundlePage: React.FC<BundlePageProps> = ({ bundle, onBack }) => {
  // State for editable preferences
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [freeTextInterests, setFreeTextInterests] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load current preferences
  useEffect(() => {
    const currentDateRange = getDateRange();
    const currentPreferences = getUserPreferences();
    
    setDateRange(currentDateRange);
    setFreeTextInterests(currentPreferences?.freeTextInterests || '');
  }, []);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatDateForInput = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    if (!dateRange) return;
    
    const timestamp = new Date(value).getTime();
    const newDateRange = {
      ...dateRange,
      [field]: timestamp
    };
    
    setDateRange(newDateRange);
    setHasChanges(true);
  };

  const handleFreeTextChange = (value: string) => {
    setFreeTextInterests(value);
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    if (dateRange) {
      saveDateRange(dateRange);
    }
    
    const currentPreferences = getUserPreferences();
    if (currentPreferences) {
      saveUserPreferences({
        ...currentPreferences,
        freeTextInterests
      });
    }
    
    setHasChanges(false);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    // Reset to original values
    const originalDateRange = getDateRange();
    const originalPreferences = getUserPreferences();
    
    setDateRange(originalDateRange);
    setFreeTextInterests(originalPreferences?.freeTextInterests || '');
    setHasChanges(false);
    setIsEditing(false);
  };

  const getInterestIcon = (interestType: string) => {
    switch (interestType) {
      case 'concerts': return '🎵';
      case 'sports': return '⚽';
      case 'artDesign': return '🎨';
      case 'localCulture': return '🏛️';
      case 'culinary': return '🍽️';
      default: return '✨';
    }
  };

  const renderEvent = (event: Event, index: number) => (
    <div key={index} className="event-item">
      <div className="event-header">
        <span className="event-icon">{getInterestIcon(event.interestType)}</span>
        <h3 className="event-title">{event.title}</h3>
      </div>
      <div className="event-details">
        <div className="event-venue">📍 {event.venue}</div>
        <div className="event-date">📅 {formatTimestamp(event.date)}</div>
        {event.bookingUrl && (
          <a 
            href={event.bookingUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="booking-link"
          >
            Book Now →
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="bundle-page">
      <div className="bundle-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Bundles
        </button>
      </div>

      <div className="bundle-content">
        {/* Bundle Image */}
        <div className="bundle-image-container">
          <img 
            src={bundle.imageUrl} 
            alt={bundle.title}
            className="bundle-image"
            onError={(e) => {
              // Fallback to a placeholder if image fails to load
              e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80';
            }}
          />
        </div>

        {/* Title */}
        <h1 className="bundle-title">{bundle.title}</h1>

        {/* Description */}
        <p className="bundle-description">{bundle.description}</p>

        {/* Dates */}
        <div className="bundle-dates">
          <div className="section-header">
            <h2>📅 Trip Dates</h2>
            <button 
              className="edit-button"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? '❌ Cancel' : '✏️ Edit'}
            </button>
          </div>
          
          {isEditing && dateRange ? (
            <div className="date-edit-section">
              <div className="date-inputs">
                <div className="date-input-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={formatDateForInput(dateRange.startDate)}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                  />
                </div>
                <div className="date-input-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={formatDateForInput(dateRange.endDate)}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="date-range">
              <div className="date-item">
                <strong>Start:</strong> {formatTimestamp(bundle.startDate)}
              </div>
              <div className="date-item">
                <strong>End:</strong> {formatTimestamp(bundle.endDate)}
              </div>
            </div>
          )}
        </div>

        {/* Key Events List */}
        {bundle.keyEvents && bundle.keyEvents.events.length > 0 && (
          <div className="events-section">
            <h2>🌟 {bundle.keyEvents.title}</h2>
            <div className="events-list">
              {bundle.keyEvents.events.map((event, index) => renderEvent(event, index))}
            </div>
          </div>
        )}

        {/* Minor Events List */}
        {bundle.minorEvents && bundle.minorEvents.events.length > 0 && (
          <div className="events-section">
            <h2>✨ {bundle.minorEvents.title}</h2>
            <div className="events-list">
              {bundle.minorEvents.events.map((event, index) => renderEvent(event, index))}
            </div>
          </div>
        )}

        {/* Free Text Interests */}
        <div className="free-text-section">
          <div className="section-header">
            <h2>💭 Additional Interests</h2>
          </div>
          
          {isEditing ? (
            <div className="free-text-edit">
              <textarea
                className="free-text-input"
                value={freeTextInterests}
                onChange={(e) => handleFreeTextChange(e.target.value)}
                placeholder="Tell us about any other interests, activities, or experiences you'd like to include in your trips..."
                rows={4}
              />
            </div>
          ) : (
            <div className="free-text-display">
              {freeTextInterests ? (
                <p className="free-text-content">{freeTextInterests}</p>
              ) : (
                <p className="free-text-placeholder">No additional interests specified.</p>
              )}
            </div>
          )}
        </div>

        {/* Save/Cancel buttons when editing */}
        {isEditing && (
          <div className="edit-actions">
            <button 
              className="save-button"
              onClick={handleSaveChanges}
              disabled={!hasChanges}
            >
              💾 Save Changes
            </button>
            <button 
              className="cancel-button"
              onClick={handleCancelEdit}
            >
              ❌ Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};