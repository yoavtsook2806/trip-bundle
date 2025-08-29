import React from 'react';
import { observer } from 'mobx-react-lite';
import { TripBundle } from '../services/gptService';
import { CITIES, City } from '../constants/cities';
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
  const getCityData = (cityName: string): City | null => {
    return CITIES.find(city => city.name.toLowerCase() === cityName.toLowerCase()) || null;
  };

  const cityData = getCityData(bundle.city);

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
    <div className={`bundle-offer-simple ${isSelected ? 'selected' : ''}`}>
      {/* City Symbol Background */}
      {cityData?.symbolUrl && (
        <div 
          className="city-symbol-background"
          style={{ backgroundImage: `url(${cityData.symbolUrl})` }}
        />
      )}
      
      {/* Header */}
      <div className="bundle-header">
        <div className="bundle-title-section">
          <h3 className="bundle-title">{bundle.title}</h3>
          <div className="bundle-location">
            {cityData?.flagUrl && (
              <img 
                src={cityData.flagUrl} 
                alt={`${bundle.country} flag`}
                className="country-flag"
              />
            )}
            <span>{bundle.city}, {bundle.country}</span>
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

      {/* Entertainment Activities - Simplified */}
      <div className="entertainment-section">
        <h4 className="section-title">🎉 Activities</h4>
        <div className="entertainment-simple-list">
          {bundle.entertainments.map((entertainment, index) => (
            <div key={index} className="entertainment-simple-item">
              <span className="entertainment-icon">
                {getCategoryIcon(entertainment.entertainment.category)}
              </span>
              <div className="entertainment-info">
                <div className="entertainment-name">{entertainment.entertainment.name}</div>
                <div className="entertainment-details">
                  {entertainment.venue} • {formatDate(entertainment.date)} at {entertainment.time}
                </div>
              </div>
              <div className="entertainment-cost">
                {formatCurrency(entertainment.cost, bundle.totalCost.currency)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hotel Info - Simplified */}
      <div className="hotel-section">
        <h4 className="section-title">🏨 Hotel</h4>
        <div className="hotel-simple-info">
          <div className="hotel-name">{bundle.accommodation.name}</div>
          <div className="hotel-details">
            {'⭐'.repeat(Math.floor(bundle.accommodation.rating))} {bundle.accommodation.rating.toFixed(1)} • 
            {bundle.accommodation.location} • 
            {formatCurrency(bundle.accommodation.pricePerNight, bundle.totalCost.currency)}/night
          </div>
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