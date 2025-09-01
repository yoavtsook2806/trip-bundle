import React from 'react';
import { TripBundle, PromptsUsage } from '../types';
import './BundleFeed.css';

interface BundleFeedProps {
  bundles: TripBundle[];
  promptsUsage: PromptsUsage;
  onBundleSelect: (bundle: TripBundle) => void;
  onOpenPreferences: () => void;
  onOpenDevelopment?: () => void;
  onLoadMore?: () => void;
  onGenerateNew?: () => void;
  canLoadMore?: boolean;
  hasUserData?: boolean;
  isLoading?: boolean;
  isMockMode?: boolean;
}

export const BundleFeed: React.FC<BundleFeedProps> = ({
  bundles,
  promptsUsage,
  onBundleSelect,
  onOpenPreferences,
  onOpenDevelopment,
  onLoadMore,
  onGenerateNew,
  canLoadMore = false,
  hasUserData = false,
  isLoading = false,
  isMockMode = false
}) => {
  const getKeyEvents = (bundle: TripBundle) => {
    // Get up to 3 key events
    return bundle.events.slice(0, 3);
  };

  const formatEventTime = (date: string, time: string) => {
    const eventDate = new Date(date);
    return `${eventDate.toLocaleDateString()} at ${time}`;
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

  return (
    <div className="bundle-feed">
      <div className="feed-header">
        <h1>🎯 Your Trip Bundles</h1>
        <div className="header-actions">
          <div className="usage-counter">
            <span className="usage-text">
              {promptsUsage.count}/{promptsUsage.maxDaily} calls today
            </span>
            <div className="usage-bar">
              <div 
                className="usage-fill" 
                style={{ width: `${(promptsUsage.count / promptsUsage.maxDaily) * 100}%` }}
              />
            </div>
          </div>
          <button className="preferences-button" onClick={onOpenPreferences}>
            ⚙️ Preferences
          </button>
          {isMockMode && onOpenDevelopment && (
            <button className="dev-button" onClick={onOpenDevelopment}>
              🛠️ Dev
            </button>
          )}
        </div>
      </div>

      {bundles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎭</div>
          {hasUserData ? (
            <>
              <h2>Ready to create your bundles?</h2>
              <p>Generate trip bundles based on your saved preferences!</p>
              <button className="preferences-button-large" onClick={onGenerateNew}>
                Generate New Bundles
              </button>
            </>
          ) : (
            <>
              <h2>No trip bundles yet</h2>
              <p>Set your preferences and generate your first trip bundle!</p>
              <button className="preferences-button-large" onClick={onOpenPreferences}>
                Set Preferences
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="bundles-grid">
          {bundles.map((bundle) => (
            <div 
              key={bundle.id} 
              className="bundle-card"
              onClick={() => onBundleSelect(bundle)}
            >
              <div className="bundle-image">
                <div className="city-badge">{bundle.city}</div>
              </div>
              
              <div className="bundle-content">
                <h3 className="bundle-title">{bundle.title}</h3>
                <p className="bundle-description">{bundle.description}</p>
                
                <div className="key-events">
                  <h4>Key Events:</h4>
                  {getKeyEvents(bundle).map((event: any, index: number) => (
                    <div key={index} className="event-item">
                      <span className="event-icon">
                        {getInterestIcon(event.interestType)}
                      </span>
                      <div className="event-details">
                        <span className="event-venue">{event.venue}</span>
                        <span className="event-time">
                          {formatEventTime(event.date, event.time)}
                        </span>
                      </div>
                      <span className="event-cost">
                        {event.cost > 0 ? `$${event.cost}` : 'Free'}
                      </span>
                    </div>
                  ))}
                  {bundle.events.length > 3 && (
                    <div className="more-events">
                      +{bundle.events.length - 3} more events
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bundle-footer">
                <span className="view-details">View Details →</span>
              </div>
            </div>
          ))}
          
          {canLoadMore && onLoadMore && (
            <div className="load-more-container">
              <button 
                className={`load-more-button ${isLoading ? 'loading' : ''}`}
                onClick={onLoadMore}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner">🔄</span>
                    Fetching New Bundles...
                  </>
                ) : (
                  'Load More Bundles'
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
