import React from 'react';
import { observer } from 'mobx-react-lite';
import { TripBundle } from '../services/gptService';
import './BundleOffer.css';

interface BundleOfferProps {
  bundle: TripBundle;
  onSelect?: (bundle: TripBundle) => void;
  onBookmark?: (bundle: TripBundle) => void;
  isSelected?: boolean;
  isBookmarked?: boolean;
}

const BundleOffer: React.FC<BundleOfferProps> = observer(({
  bundle,
  onSelect,
  onBookmark,
  isSelected = false,
  isBookmarked = false
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#4CAF50'; // Green
    if (confidence >= 60) return '#FF9800'; // Orange
    return '#f44336'; // Red
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

  return (
    <div className={`bundle-offer ${isSelected ? 'selected' : ''}`}>
      {/* Header */}
      <div className="bundle-header">
        <div className="bundle-title-section">
          <h3 className="bundle-title">{bundle.title}</h3>
          <div className="bundle-location">
            📍 {bundle.city}, {bundle.country}
          </div>
        </div>
        <div className="bundle-actions">
          <button
            className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={() => onBookmark?.(bundle)}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this bundle'}
          >
            {isBookmarked ? '❤️' : '🤍'}
          </button>
          <div className="confidence-badge" style={{ backgroundColor: getConfidenceColor(bundle.confidence) }}>
            {bundle.confidence}% match
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="bundle-description">{bundle.description}</p>

      {/* Key Info */}
      <div className="bundle-key-info">
        <div className="info-item">
          <span className="info-label">📅 Duration:</span>
          <span className="info-value">{bundle.duration} days</span>
        </div>
        <div className="info-item">
          <span className="info-label">🗓️ Dates:</span>
          <span className="info-value">
            {formatDate(bundle.startDate)} - {formatDate(bundle.endDate)}
          </span>
        </div>
        <div className="info-item">
          <span className="info-label">💰 Total Cost:</span>
          <span className="info-value total-cost">
            {formatCurrency(bundle.totalCost.amount, bundle.totalCost.currency)}
          </span>
        </div>
      </div>

      {/* Entertainment Activities */}
      <div className="entertainment-section">
        <h4 className="section-title">🎉 Entertainment Activities</h4>
        <div className="entertainment-list">
          {bundle.entertainments.map((entertainment, index) => (
            <div key={index} className="entertainment-item">
              <div className="entertainment-header">
                <span className="entertainment-icon">
                  {getCategoryIcon(entertainment.entertainment.category)}
                </span>
                <div className="entertainment-details">
                  <div className="entertainment-name">{entertainment.entertainment.name}</div>
                  <div className="entertainment-venue">{entertainment.venue}</div>
                </div>
                <div className="entertainment-meta">
                  <div className="entertainment-date">
                    {formatDate(entertainment.date)} at {entertainment.time}
                  </div>
                  <div className="entertainment-cost">
                    {formatCurrency(entertainment.cost, bundle.totalCost.currency)}
                  </div>
                </div>
              </div>
              <div className="entertainment-description">
                {entertainment.entertainment.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="cost-breakdown">
        <h4 className="section-title">💳 Cost Breakdown</h4>
        <div className="cost-items">
          <div className="cost-item">
            <span>🏨 Accommodation</span>
            <span>{formatCurrency(bundle.totalCost.breakdown.accommodation, bundle.totalCost.currency)}</span>
          </div>
          <div className="cost-item">
            <span>🎭 Entertainment</span>
            <span>{formatCurrency(bundle.totalCost.breakdown.entertainment, bundle.totalCost.currency)}</span>
          </div>
          <div className="cost-item">
            <span>🍽️ Food</span>
            <span>{formatCurrency(bundle.totalCost.breakdown.food, bundle.totalCost.currency)}</span>
          </div>
          <div className="cost-item">
            <span>✈️ Transport</span>
            <span>{formatCurrency(bundle.totalCost.breakdown.transport, bundle.totalCost.currency)}</span>
          </div>
        </div>
      </div>

      {/* Accommodation */}
      <div className="accommodation-section">
        <h4 className="section-title">🏨 Accommodation</h4>
        <div className="accommodation-info">
          <div className="accommodation-header">
            <span className="accommodation-name">{bundle.accommodation.name}</span>
            <div className="accommodation-rating">
              {'⭐'.repeat(Math.floor(bundle.accommodation.rating))} 
              {bundle.accommodation.rating.toFixed(1)}
            </div>
          </div>
          <div className="accommodation-details">
            <span className="accommodation-type">{bundle.accommodation.type}</span>
            <span className="accommodation-location">📍 {bundle.accommodation.location}</span>
            <span className="accommodation-price">
              {formatCurrency(bundle.accommodation.pricePerNight, bundle.totalCost.currency)}/night
            </span>
          </div>
          <div className="accommodation-amenities">
            {bundle.accommodation.amenities.map((amenity, index) => (
              <span key={index} className="amenity-tag">{amenity}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="recommendations-section">
        <h4 className="section-title">💡 Local Recommendations</h4>
        <div className="recommendations-grid">
          <div className="recommendation-category">
            <h5>🍽️ Restaurants</h5>
            <ul>
              {bundle.recommendations.restaurants.slice(0, 3).map((restaurant, index) => (
                <li key={index}>{restaurant}</li>
              ))}
            </ul>
          </div>
          <div className="recommendation-category">
            <h5>💡 Local Tips</h5>
            <ul>
              {bundle.recommendations.localTips.slice(0, 2).map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="weather-info">
          <strong>🌤️ Weather:</strong> {bundle.recommendations.weatherInfo}
        </div>
      </div>

      {/* Action Button */}
      <div className="bundle-footer">
        <button
          className="select-bundle-btn"
          onClick={() => onSelect?.(bundle)}
        >
          Select This Bundle
        </button>
      </div>
    </div>
  );
});

export default BundleOffer;
