import React from 'react';
import { TripBundle, Event } from '../types';
import './BundlePage.css';

interface BundlePageProps {
  bundle: TripBundle;
  onBack: () => void;
}

export const BundlePage: React.FC<BundlePageProps> = ({ bundle, onBack }) => {
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
        <div className="event-description">📝 {event.shortDescription}</div>
        <div className="event-date">📅 {formatTimestamp(event.dateRange.startDate)}</div>
        <div className="event-full-description">{event.fullDescription}</div>
        {event.eventWebsite && (
          <a 
            href={event.eventWebsite} 
            target="_blank" 
            rel="noopener noreferrer"
            className="booking-link"
          >
            Visit Website →
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
          <h2>📅 Trip Dates</h2>
          <div className="date-range">
            <div className="date-item">
              <strong>Start:</strong> {formatTimestamp(bundle.dateRange.startDate)}
            </div>
            <div className="date-item">
              <strong>End:</strong> {formatTimestamp(bundle.dateRange.endDate)}
            </div>
          </div>
        </div>

        {/* Key Events List */}
        {bundle.keyEvents && Array.isArray(bundle.keyEvents) && bundle.keyEvents.length > 0 && (
          <div className="events-section">
            <h2>🌟 Key Events</h2>
            <div className="events-list">
              {bundle.keyEvents.map((event: any, index: any) => renderEvent(event, index))}
            </div>
          </div>
        )}

        {/* Minor Events List */}
        {bundle.minorEvents && Array.isArray(bundle.minorEvents) && bundle.minorEvents.length > 0 && (
          <div className="events-section">
            <h2>✨ Additional Experiences</h2>
            <div className="events-list">
              {bundle.minorEvents.map((event: any, index: any) => renderEvent(event, index))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};