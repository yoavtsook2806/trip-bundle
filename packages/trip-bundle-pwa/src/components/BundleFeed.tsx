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
  const getKeyEventTitles = (bundle: TripBundle) => {
    if (!bundle.keyEvents || !bundle.keyEvents.events) return [];
    return bundle.keyEvents.events.map(event => event.title);
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

  const renderBundle = (bundle: TripBundle) => {
    const keyEventTitles = getKeyEventTitles(bundle);

    return (
      <div 
        key={bundle.id} 
        className="bundle-card" 
        onClick={() => onBundleSelect(bundle)}
      >
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
          <div className="city-badge">{bundle.city}</div>
        </div>

        <div className="bundle-info">
          {/* Title */}
          <h3 className="bundle-title">{bundle.title}</h3>
          
          {/* Description */}
          <p className="bundle-description">{bundle.description}</p>
          
          {/* Key Events Titles */}
          {keyEventTitles.length > 0 && (
            <div className="key-events">
              <h4 className="key-events-header">🌟 Key Events</h4>
              <div className="key-events-list">
                {keyEventTitles.map((title, index) => (
                  <div key={index} className="key-event-item">
                    {bundle.keyEvents?.events[index] && (
                      <span className="event-icon">
                        {getInterestIcon(bundle.keyEvents.events[index].interestType)}
                      </span>
                    )}
                    <span className="event-title">{title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bundle-feed">
      <div className="feed-header">
        <div className="header-top">
          <h1>🎯 Your Trip Bundles</h1>
          <div className="header-actions">
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
        
        <div className="prompts-usage">
          <span className="usage-text">
            Daily Usage: {promptsUsage.count}/{promptsUsage.maxDaily}
          </span>
          <div className="usage-bar">
            <div 
              className="usage-fill" 
              style={{ width: `${(promptsUsage.count / promptsUsage.maxDaily) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bundles-container">
        {bundles.length === 0 ? (
          <div className="empty-state">
            {hasUserData ? (
              <div className="empty-content">
                <div className="empty-icon">🎒</div>
                <h2>Ready for New Adventures?</h2>
                <p>Generate fresh trip bundles based on your preferences!</p>
                {onGenerateNew && (
                  <button 
                    className="generate-new-button"
                    onClick={onGenerateNew}
                    disabled={promptsUsage.count >= promptsUsage.maxDaily}
                  >
                    {promptsUsage.count >= promptsUsage.maxDaily 
                      ? '🚫 Daily Limit Reached' 
                      : '✨ Generate New Bundles'
                    }
                  </button>
                )}
              </div>
            ) : (
              <div className="empty-content">
                <div className="empty-icon">🌟</div>
                <h2>No Trip Bundles Yet</h2>
                <p>Complete your preferences to get personalized trip recommendations!</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="bundles-grid">
              {bundles.map(renderBundle)}
            </div>
            
            {canLoadMore && (
              <div className="load-more-container">
                {isLoading ? (
                  <div className="loading-indicator">
                    <div className="loading-spinner"></div>
                    <span>Fetching New Bundles...</span>
                  </div>
                ) : (
                  <button 
                    className="load-more-button"
                    onClick={onLoadMore}
                    disabled={promptsUsage.count >= promptsUsage.maxDaily}
                  >
                    {promptsUsage.count >= promptsUsage.maxDaily 
                      ? '🚫 Daily Limit Reached' 
                      : '📦 Load More Bundles'
                    }
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};