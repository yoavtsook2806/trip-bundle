import React, { useState, useEffect } from 'react';
import { TripBundle, Event } from '../types';
import { getTripBundleService } from '../services';
import './BundlePage.css';

interface BundlePageProps {
  bundle: TripBundle;
  onBack: () => void;
}

const BundlePage: React.FC<BundlePageProps> = ({ bundle, onBack }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, [bundle]);

  const loadEvents = async () => {
    try {
      setEventsLoading(true);
      setEventsError(null);
      
      console.log('🎪 [BUNDLE_PAGE] Loading events for bundle:', bundle.id, 'in city:', bundle.city.name);
      
      const service = getTripBundleService();
      const eventsResponse = await service.getEvents(
        bundle.city.name,
        bundle.startDate,
        bundle.endDate
      );
      
      console.log('🎪 [BUNDLE_PAGE] Events loaded:', eventsResponse.events.length, 'events');
      setEvents(eventsResponse.events);
    } catch (error) {
      console.error('Error loading events:', error);
      setEventsError('Failed to load events. Please try again.');
    } finally {
      setEventsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      music: '🎵',
      sports: '⚽',
      culture: '🎭',
      food: '🍽️',
      nightlife: '🌙',
      nature: '🌿',
      adventure: '🏔️'
    };
    return icons[category] || '🎉';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      music: '#9C27B0',
      sports: '#FF5722',
      culture: '#3F51B5',
      food: '#FF9800',
      nightlife: '#673AB7',
      nature: '#4CAF50',
      adventure: '#795548'
    };
    return colors[category] || '#667eea';
  };

  const calculateTotalCost = () => {
    const accommodationCost = bundle.accommodation.pricePerNight * bundle.duration;
    const transportCost = bundle.transport.cost;
    const entertainmentCost = bundle.entertainments.reduce((sum, ent) => sum + ent.estimatedCost, 0);
    return accommodationCost + transportCost + entertainmentCost;
  };

  return (
    <div className="bundle-page">
      {/* Header */}
      <div className="bundle-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Feed
        </button>
        <div className="bundle-title">
          <h1>{bundle.city.name}, {bundle.city.country}</h1>
          <p className="bundle-dates">
            {formatDate(bundle.startDate)} - {formatDate(bundle.endDate)}
          </p>
        </div>
      </div>

      <div className="bundle-content">
        {/* Bundle Overview */}
        <div className="bundle-overview">
          <div className="overview-card">
            <h2>🎯 Trip Overview</h2>
            <div className="overview-grid">
              <div className="overview-item">
                <span className="overview-icon">📅</span>
                <div>
                  <h4>Duration</h4>
                  <p>{bundle.duration} days</p>
                </div>
              </div>
              <div className="overview-item">
                <span className="overview-icon">💰</span>
                <div>
                  <h4>Total Cost</h4>
                  <p>{formatCurrency(calculateTotalCost(), bundle.currency)}</p>
                </div>
              </div>
              <div className="overview-item">
                <span className="overview-icon">🎭</span>
                <div>
                  <h4>Activities</h4>
                  <p>{bundle.entertainments.length} included</p>
                </div>
              </div>
              <div className="overview-item">
                <span className="overview-icon">⭐</span>
                <div>
                  <h4>Match Score</h4>
                  <p>{Math.round(bundle.matchScore * 100)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accommodation */}
        <div className="bundle-section">
          <h2>🏨 Accommodation</h2>
          <div className="accommodation-card">
            <div className="accommodation-info">
              <h3>{bundle.accommodation.name}</h3>
              <p className="accommodation-type">{bundle.accommodation.type}</p>
              <div className="accommodation-rating">
                {'⭐'.repeat(bundle.accommodation.rating)}
                <span>({bundle.accommodation.rating}/5)</span>
              </div>
              <p className="accommodation-description">{bundle.accommodation.description}</p>
            </div>
            <div className="accommodation-price">
              <span className="price-per-night">
                {formatCurrency(bundle.accommodation.pricePerNight, bundle.currency)}/night
              </span>
              <span className="total-price">
                Total: {formatCurrency(bundle.accommodation.pricePerNight * bundle.duration, bundle.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Transport */}
        <div className="bundle-section">
          <h2>🚗 Transport</h2>
          <div className="transport-card">
            <div className="transport-info">
              <h3>{bundle.transport.type}</h3>
              <p>{bundle.transport.description}</p>
              <div className="transport-details">
                <span>Duration: {bundle.transport.duration}</span>
              </div>
            </div>
            <div className="transport-price">
              {formatCurrency(bundle.transport.cost, bundle.currency)}
            </div>
          </div>
        </div>

        {/* Included Activities */}
        <div className="bundle-section">
          <h2>🎭 Included Activities</h2>
          <div className="activities-grid">
            {bundle.entertainments.map((entertainment: any, index: number) => (
              <div key={index} className="activity-card">
                <div className="activity-header">
                  <span 
                    className="activity-icon"
                    style={{ backgroundColor: getCategoryColor(entertainment.category) }}
                  >
                    {getCategoryIcon(entertainment.category)}
                  </span>
                  <div className="activity-info">
                    <h4>{entertainment.name}</h4>
                    <span className="activity-category">{entertainment.category}</span>
                  </div>
                </div>
                <p className="activity-description">{entertainment.description}</p>
                <div className="activity-footer">
                  <span className="activity-cost">
                    {formatCurrency(entertainment.estimatedCost, 'EUR')}
                  </span>
                  {entertainment.tags && entertainment.tags.length > 0 && (
                    <div className="activity-tags">
                      {entertainment.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                        <span key={tagIndex} className="activity-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* More Events */}
        <div className="bundle-section">
          <h2>🎪 More Events in {typeof bundle.city === 'string' ? bundle.city : bundle.city.name}</h2>
          {eventsLoading ? (
            <div className="events-loading">
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
              <p>Loading more events...</p>
            </div>
          ) : eventsError ? (
            <div className="events-error">
              <p>{eventsError}</p>
              <button onClick={loadEvents} className="retry-btn">
                Try Again
              </button>
            </div>
          ) : events.length === 0 ? (
            <div className="no-events">
              <p>No additional events found for these dates.</p>
            </div>
          ) : (
            <div className="events-grid">
              {events.map((event, index) => (
                <div key={index} className="event-card">
                  <div className="event-header">
                    <span 
                      className="event-category"
                      style={{ backgroundColor: getCategoryColor(event.entertainment.category) }}
                    >
                      {getCategoryIcon(event.entertainment.category)}
                      {event.entertainment.category.toUpperCase()}
                    </span>
                  </div>
                  <div className="event-info">
                    <h4>{event.entertainment.name}</h4>
                    <p className="event-description">{event.entertainment.description}</p>
                    <div className="event-details">
                      <div className="event-detail">
                        <span className="detail-icon">📍</span>
                        <span>{event.venue}</span>
                      </div>
                      <div className="event-detail">
                        <span className="detail-icon">📅</span>
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="event-detail">
                        <span className="detail-icon">⏰</span>
                        <span>{event.time}</span>
                      </div>
                      <div className="event-detail">
                        <span className="detail-icon">💰</span>
                        <span>{formatCurrency(event.cost, event.currency)}</span>
                      </div>
                    </div>
                    {event.entertainment.tags && event.entertainment.tags.length > 0 && (
                      <div className="event-tags">
                        {event.entertainment.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                          <span key={tagIndex} className="event-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {event.bookingUrl && (
                    <div className="event-actions">
                      <a
                        href={event.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="book-event-btn"
                      >
                        Book Tickets
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BundlePage;
