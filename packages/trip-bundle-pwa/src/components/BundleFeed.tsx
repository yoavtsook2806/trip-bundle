import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { TripBundle } from '../types';
import BundleOffer from './BundleOffer';
import { PromptsTokenStorage } from '../storage';
import ThinkingScreen from './ThinkingScreen';
import './BundleFeed.css';

interface BundleFeedProps {
  bundles: TripBundle[];
  onBundleClick: (bundle: TripBundle) => void;
  onEditPreferences: () => void;
  onDevelopmentTab?: () => void;
  onLoadMore?: () => void;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  isMockMode?: boolean;
}

const BundleFeed: React.FC<BundleFeedProps> = observer(({
  bundles,
  onBundleClick,
  onEditPreferences,
  onDevelopmentTab,
  onLoadMore,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  isMockMode = false
}) => {
  const [promptsToken, setPromptsToken] = useState({ calls: 0, remaining: 10 });

  useEffect(() => {
    loadPromptsToken();
  }, []);

  const loadPromptsToken = async () => {
    try {
      const token = await PromptsTokenStorage.getPromptsToken();
      setPromptsToken({ calls: token.calls, remaining: token.remaining });
    } catch (error) {
      console.error('Error loading prompts token:', error);
    }
  };



  return (
    <div className="bundle-feed">
      {/* Compact Header */}
      <div className="feed-header">
        <div className="header-top">
          <div className="app-logo">
            <img src="/TripBundleIcon.jpeg" alt="TripBundle" className="logo-icon" />
          </div>
          <div className="header-actions">
            <button 
              className="icon-btn edit-preferences-btn"
              onClick={onEditPreferences}
              title="Edit Preferences"
            >
              ⚙️
            </button>
            {isMockMode && onDevelopmentTab && (
              <button 
                className="icon-btn dev-tab-btn"
                onClick={onDevelopmentTab}
                title="Development"
              >
                🔧
              </button>
            )}
          </div>
        </div>

        {/* Title and Description */}
        <div className="page-title">
          <h1>Trip Bundle</h1>
          <p>Your Journey, Personalized</p>
        </div>

        {/* API Usage Indicator */}
        <div className="api-usage-indicator">
          <div className="usage-info">
            <span className="usage-text">
              Daily searches: {promptsToken.calls}/10
            </span>
            <div className="usage-bar">
              <div 
                className="usage-fill" 
                style={{ width: `${(promptsToken.calls / 10) * 100}%` }}
              ></div>
            </div>
          </div>
          {promptsToken.remaining === 0 && (
            <div className="usage-warning">
              ⚠️ Daily limit reached. Resets tomorrow.
            </div>
          )}
        </div>
      </div>

      {/* Bundle List */}
      <div className="bundles-container">
        {isLoading ? (
          <ThinkingScreen message="Finding perfect trips for you..." />
        ) : bundles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎒</div>
            <h3>No trips found</h3>
            <p>Try adjusting your preferences or date range to find more options.</p>
            <button className="edit-preferences-btn" onClick={onEditPreferences}>
              Update Preferences
            </button>
          </div>
        ) : (
          <>
            <div className="bundles-grid">
              {bundles.map((bundle) => (
                <div key={bundle.id} className="bundle-item" onClick={() => onBundleClick(bundle)}>
                  <BundleOffer
                    bundle={bundle}
                    onSelect={() => onBundleClick(bundle)}
                    onEventClick={() => {}} // Events will be handled in BundlePage
                  />
                </div>
              ))}
            </div>
            
            {/* Load More Bundles Button */}
            {hasMore && onLoadMore && (
              <div className="load-more-bundles">
                {isLoadingMore ? (
                  <div className="loading-more-container">
                    <div className="loader"></div>
                    <p>Loading more trip bundles...</p>
                  </div>
                ) : (
                  <button 
                    className="load-more-btn" 
                    onClick={onLoadMore}
                  >
                    🎯 Load More Trip Bundles
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default BundleFeed;
