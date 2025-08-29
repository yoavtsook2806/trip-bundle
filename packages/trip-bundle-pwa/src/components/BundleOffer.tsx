import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { BundleOfferProps, City } from '../types';
import { CITIES } from '../constants/cities';
import './BundleOffer.css';

const BundleOffer: React.FC<BundleOfferProps> = observer(({
  bundle,
  onSelect,
  onBookmark,
  onEventClick,
  isSelected = false,
  isBookmarked = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
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
    <div 
      className={`bundle-offer ${isExpanded ? 'expanded' : 'compact'} ${isSelected ? 'selected' : ''}`}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
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
            onClick={(e) => {
              e.stopPropagation();
              onBookmark?.(bundle);
            }}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this bundle'}
          >
            {isBookmarked ? '❤️' : '🤍'}
          </button>
          <div className="confidence-badge" style={{ backgroundColor: getConfidenceColor(bundle.confidence) }}>
            {bundle.confidence}% match
          </div>
        </div>
      </div>

      {/* Compact View - Only most important info */}
      {!isExpanded && (
        <div className="compact-content">
          <div className="compact-summary">
            <div className="compact-info">
              <span className="compact-duration">📅 {bundle.duration} days</span>
              <span className="compact-cost">💰 {formatCurrency(bundle.totalCost.amount, bundle.totalCost.currency)}</span>
            </div>
            <div className="compact-activities">
              🎉 {bundle.events.length} activities
            </div>
          </div>
          <div className="expand-hint">
            <span>👆 Tap to see details</span>
          </div>
        </div>
      )}

      {/* Expanded View - Full details */}
      {isExpanded && (
        <div className="expanded-content">
          {/* Collapse Button */}
          <button 
            className="collapse-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
          >
            ▲ Show Less
          </button>

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

          {/* Entertainment Activities - Full Details */}
          <div className="entertainment-section">
            <h4 className="section-title">🎉 Activities</h4>
            <div className="entertainment-list">
              {bundle.events.map((event, index) => (
                <div 
                  key={index} 
                  className="entertainment-item clickable"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick?.(
                      event.entertainment,
                      event.date,
                      event.time,
                      event.venue,
                      event.cost
                    );
                  }}
                  title="Click to view event details"
                >
                  <span className="entertainment-icon">
                    {getCategoryIcon(event.entertainment.category)}
                  </span>
                  <div className="entertainment-info">
                    <div className="entertainment-name">{event.entertainment.name}</div>
                    <div className="entertainment-details">
                      {event.venue} • {formatDate(event.date)} at {event.time}
                    </div>
                  </div>
                  <div className="entertainment-cost">
                    {formatCurrency(event.cost, bundle.totalCost.currency)}
                  </div>
                </div>
              ))}
            </div>
          </div>



          {/* Action Button */}
          <div className="bundle-footer">
            <button
              className="select-bundle-btn"
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.(bundle);
              }}
            >
              Select This Bundle
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default BundleOffer;