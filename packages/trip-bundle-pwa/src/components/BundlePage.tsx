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
          <h2>📅 Trip Dates</h2>
          <div className="date-range">
            <div className="date-item">
              <strong>Start:</strong> {formatTimestamp(bundle.startDate)}
            </div>
            <div className="date-item">
              <strong>End:</strong> {formatTimestamp(bundle.endDate)}
            </div>
          </div>
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
      </div>
    </div>
  );
};