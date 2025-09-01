import React from 'react';
import { TripBundle, Event } from '../types';
import './BundlePage.css';

interface BundlePageProps {
  bundle: TripBundle;
  onBack: () => void;
}

export const BundlePage: React.FC<BundlePageProps> = ({ bundle, onBack }) => {
  const formatEventDate = (date: string, time: string) => {
    const eventDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return `${eventDate.toLocaleDateString('en-US', options)} at ${time}`;
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

  const getInterestName = (interestType: string) => {
    switch (interestType) {
      case 'concerts': return 'Concerts';
      case 'sports': return 'Sports';
      case 'artDesign': return 'Art & Design';
      case 'localCulture': return 'Local Culture';
      case 'culinary': return 'Culinary';
      default: return 'Other';
    }
  };

  const renderEvent = (event: Event, index: number, isSubEvent = false) => (
    <div key={index} className={`event-card ${isSubEvent ? 'sub-event' : ''}`}>
      <div className="event-header">
        <div className="event-type">
          <span className="event-icon">{getInterestIcon(event.interestType)}</span>
          <span className="event-category">{getInterestName(event.interestType)}</span>
        </div>
        <div className="event-cost">
          {event.cost > 0 ? `$${event.cost} ${event.currency}` : 'Free'}
        </div>
      </div>
      
      <h3 className="event-venue">{event.venue}</h3>
      <p className="event-datetime">{formatEventDate(event.date, event.time)}</p>
      
      {event.bookingUrl && (
        <a 
          href={event.bookingUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="booking-button"
        >
          Book Now →
        </a>
      )}
    </div>
  );

  const totalCost = [...bundle.events, ...bundle.subEvents].reduce((sum, event) => sum + event.cost, 0);

  return (
    <div className="bundle-page">
      <div className="bundle-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Bundles
        </button>
        <div className="bundle-hero">
          <div className="hero-background">
            <div className="city-badge-large">{bundle.city}</div>
          </div>
          <div className="hero-content">
            <h1 className="bundle-title-large">{bundle.title}</h1>
            <p className="bundle-description-large">{bundle.description}</p>
            <div className="bundle-meta">
              <div className="date-range">
                📅 {new Date(bundle.startDate).toLocaleDateString()} - {new Date(bundle.endDate).toLocaleDateString()}
              </div>
              <div className="total-cost">
                💰 Total Cost: {totalCost > 0 ? `$${totalCost}` : 'Free'}
              </div>
              <div className="event-count">
                🎯 {bundle.events.length + bundle.subEvents.length} Events
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bundle-content">
        {bundle.events.length > 0 && (
          <section className="events-section">
            <h2>🌟 Main Events</h2>
            <div className="events-grid">
              {bundle.events.map((event, index) => renderEvent(event, index, false))}
            </div>
          </section>
        )}

        {bundle.subEvents.length > 0 && (
          <section className="events-section">
            <h2>✨ Additional Experiences</h2>
            <div className="events-grid">
              {bundle.subEvents.map((event, index) => renderEvent(event, index, true))}
            </div>
          </section>
        )}

        <section className="bundle-summary">
          <h2>📋 Trip Summary</h2>
          <div className="summary-card">
            <div className="summary-item">
              <strong>Destination:</strong> {bundle.city}
            </div>
            <div className="summary-item">
              <strong>Duration:</strong> {new Date(bundle.startDate).toLocaleDateString()} - {new Date(bundle.endDate).toLocaleDateString()}
            </div>
            <div className="summary-item">
              <strong>Total Events:</strong> {bundle.events.length + bundle.subEvents.length}
            </div>
            <div className="summary-item">
              <strong>Estimated Cost:</strong> {totalCost > 0 ? `$${totalCost}` : 'Free'}
            </div>
            <div className="summary-item">
              <strong>Experience Types:</strong> {
                [...new Set([...bundle.events, ...bundle.subEvents].map(e => getInterestName(e.interestType)))].join(', ')
              }
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
