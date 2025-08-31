import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { TripBundle } from '../types';
import BundleOffer from './BundleOffer';
import { UserPreferencesStorage } from '../storage';
import './BundleFeed.css';

interface BundleFeedProps {
  bundles: TripBundle[];
  onBundleClick: (bundle: TripBundle) => void;
  onEditPreferences: () => void;
  onDevelopmentTab?: () => void;
  onDateRangeChange?: (startDate: string, endDate: string) => void;
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
  onDateRangeChange,
  onLoadMore,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  isMockMode = false
}) => {
  const [searchDateRange, setSearchDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 4 months from now
  });

  useEffect(() => {
    loadDateRange();
  }, []);

  const loadDateRange = async () => {
    try {
      const preferences = await UserPreferencesStorage.getUserPreferences();
      if (preferences.searchDateRange) {
        setSearchDateRange(preferences.searchDateRange);
      }
    } catch (error) {
      console.error('Error loading date range:', error);
    }
  };

  const handleDateRangeChange = async (startDate: string, endDate: string) => {
    setSearchDateRange({ startDate, endDate });
    
    // Save to storage
    try {
      await UserPreferencesStorage.updatePreference('searchDateRange', { startDate, endDate });
      
      // Call callback to refresh bundles with new date range
      if (onDateRangeChange) {
        console.log('🔄 [BUNDLE_FEED] Date range changed, refreshing bundles:', { startDate, endDate });
        onDateRangeChange(startDate, endDate);
      }
    } catch (error) {
      console.error('Error saving date range:', error);
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

        {/* Date Range Selector */}
        <div className="date-range-selector">
          <div className="date-inputs">
            <div className="date-input-group">
              <label>From</label>
              <input
                type="date"
                value={searchDateRange.startDate}
                onChange={(e) => handleDateRangeChange(e.target.value, searchDateRange.endDate)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="date-input-group">
              <label>To</label>
              <input
                type="date"
                value={searchDateRange.endDate}
                onChange={(e) => handleDateRangeChange(searchDateRange.startDate, e.target.value)}
                min={searchDateRange.startDate}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bundle List */}
      <div className="bundles-container">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
            <p>Finding perfect trips for you...</p>
          </div>
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
