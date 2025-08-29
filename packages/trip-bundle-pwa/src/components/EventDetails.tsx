import React from 'react';
import { EventDetailsProps } from '../types';
import './EventDetails.css';

const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  onClose,
  onBook
}) => {
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

  return (
    <div className="event-details-overlay" onClick={onClose}>
      <div className="event-details-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="event-header">
          <div className="event-category" style={{ backgroundColor: getCategoryColor(event.entertainment.category) }}>
            <span className="category-icon">{getCategoryIcon(event.entertainment.category)}</span>
            <span className="category-name">{event.entertainment.category.toUpperCase()}</span>
          </div>
          {onClose && (
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          )}
        </div>

        {/* Event Info */}
        <div className="event-info">
          <h2 className="event-name">{event.entertainment.name}</h2>
          <p className="event-description">{event.entertainment.description}</p>
          
          <div className="event-details-grid">
            <div className="detail-item">
              <span className="detail-icon">📍</span>
              <div className="detail-content">
                <span className="detail-label">Venue</span>
                <span className="detail-value">{event.venue}</span>
              </div>
            </div>
            
            <div className="detail-item">
              <span className="detail-icon">📅</span>
              <div className="detail-content">
                <span className="detail-label">Date</span>
                <span className="detail-value">{formatDate(event.date)}</span>
              </div>
            </div>
            
            <div className="detail-item">
              <span className="detail-icon">⏰</span>
              <div className="detail-content">
                <span className="detail-label">Time</span>
                <span className="detail-value">{event.time}</span>
              </div>
            </div>
            
            <div className="detail-item">
              <span className="detail-icon">💰</span>
              <div className="detail-content">
                <span className="detail-label">Price</span>
                <span className="detail-value cost">{formatCurrency(event.cost, event.currency)}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {event.entertainment.tags && event.entertainment.tags.length > 0 && (
            <div className="event-tags">
              <span className="tags-label">Tags:</span>
              <div className="tags-list">
                {event.entertainment.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="event-actions">
          {event.bookingUrl && (
            <a
              href={event.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="book-btn primary"
            >
              Book Tickets
            </a>
          )}
          {onBook && (
            <button
              className="book-btn secondary"
              onClick={() => onBook(event)}
            >
              Add to Trip
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
