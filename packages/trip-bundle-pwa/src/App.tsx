import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import './App.css';

// Import our stores, services, and actions
import { UserPreferencesStore, BundleSuggestionsStore, IntegrationsStore, FirstTimeExperienceStore } from './store';

import { IntegrationActions, FirstTimeExperienceActions, initFirstTimeExperienceData } from './actions';
import { FirstTimeExperienceStorage } from './storage';
import { getTripBundleService } from './services';
import { BundleFeed, BundlePage, UserPreferencesForm, DevelopmentTab, FirstTimeExperience } from './components';
import type { TripBundle } from './types';
import { usePWA } from './hooks/usePWA';

// Create store instances (in a real app, these would be in a context or DI container)
const userPreferencesStore = new UserPreferencesStore();
const bundleSuggestionsStore = new BundleSuggestionsStore();
const integrationsStore = new IntegrationsStore();
const fteStore = new FirstTimeExperienceStore();
// gptService removed - now using TripBundlePromptService via factory in TripActions


// Create actions instances with dependencies
const integrationActions = new IntegrationActions(
  userPreferencesStore,
  integrationsStore
);

const fteActions = new FirstTimeExperienceActions(
  fteStore,
  FirstTimeExperienceStorage
);

const App: React.FC = observer(() => {
  const [hasInitialized, setHasInitialized] = useState(false);
  const [showFTE, setShowFTE] = useState(false);
  const [currentView, setCurrentView] = useState<'feed' | 'bundle' | 'preferences' | 'development'>('feed');
  const [selectedBundle, setSelectedBundle] = useState<TripBundle | null>(null);
  // Remove local bundles state - use store directly
  const [isLoadingBundles, setIsLoadingBundles] = useState(false);
  const pwaInfo = usePWA();

  // Initialize data from storage on app startup
  useEffect(() => {
    const initializeApp = async () => {
      if (hasInitialized) return;
      
      console.log('🚀 [APP] Initializing app with stored data...');
      setHasInitialized(true);
      
      // Initialize user preferences, integrations, and FTE data from storage
      await Promise.all([
        // Removed initUserPreferencesData and initIntegrationsData - no longer needed
        initFirstTimeExperienceData(fteStore, FirstTimeExperienceStorage)
      ]);
      
      // Always load existing bundles from storage first
      bundleSuggestionsStore.loadBundlesFromStorage();
      
      // Check if FTE should be shown
      const fteWasPresented = await fteActions.getFteWasPresented();
      
      if (!fteWasPresented) {
        setShowFTE(true);
      }
    };
    
    initializeApp();
  }, [hasInitialized]);

  // Global check for Spotify auth return
  useEffect(() => {
    console.log('🎵 [APP] App component mounted, checking for Spotify auth return...');
    const urlParams = new URLSearchParams(window.location.search);
    const isAuthReturn = urlParams.get('spotify_auth_return');
    
    if (isAuthReturn) {
      console.log('🎵 [APP] Detected Spotify auth return, processing...');
      
      // Clean up the URL parameter
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
      // Process the auth return
      handleSpotifyAuthReturn();
    }
  }, []);

  const handleSpotifyAuthReturn = async () => {
    console.log('🎵 [APP] Processing Spotify auth return...');
    
    const authCode = localStorage.getItem('spotify_auth_code');
    const authInProgress = localStorage.getItem('spotify_auth_in_progress');
    
    console.log('🎵 [APP] Auth state:', {
      authCode: !!authCode,
      authInProgress: !!authInProgress,
      authCodeValue: authCode
    });
    
    if (authCode) {
      console.log('🎵 [APP] Found auth code, clearing flags and processing...');
      localStorage.removeItem('spotify_auth_code');
      localStorage.removeItem('spotify_auth_in_progress');
      
      try {
        // Use integrationActions.handleSpotifyCallback to process the auth code
        console.log('🎵 [APP] Calling integrationActions.handleSpotifyCallback with code:', authCode);
        const success = await integrationActions.handleSpotifyCallback(authCode);
        console.log('🎵 [APP] Spotify callback processing result:', success);
        
        if (success) {
          console.log('🎵 [APP] Spotify integration successful!');
          // Set integration tab for when preferences form loads
          console.log('🎵 [APP] Setting integration tab for preferences form');
          localStorage.setItem('preferences_active_tab', 'integrations');
          
          // If we're in FTE mode, don't change the view - just let the FTE handle it
          if (!showFTE) {
            console.log('🎵 [APP] Navigating back to preferences view');
            setCurrentView('preferences');
          } else {
            console.log('🎵 [APP] In FTE mode - integration tab will be restored automatically');
          }
        } else {
          console.error('🎵 [APP] Spotify integration failed');
        }
      } catch (error) {
        console.error('🎵 [APP] Error processing Spotify auth return:', error);
      }
    } else {
      console.log('🎵 [APP] No auth code found for processing');
    }
  };

  const handleBundlesGenerated = (bundles: any[]) => {
    // Update the bundle suggestions store AND save to storage
    bundleSuggestionsStore.setBundles(bundles);
    bundleSuggestionsStore.saveBundlesToStorage();
    setIsLoadingBundles(false);
  };

  const handleFTEComplete = () => {
    console.log('✨ [APP] FTE completed');
    setShowFTE(false);
    // Bundles will be loaded by the UserPreferencesForm
  };

  const handleBundleClick = (bundle: TripBundle) => {
    setSelectedBundle(bundle);
    setCurrentView('bundle');
  };

  const handleBackToFeed = () => {
    console.log('🔙 [APP] Back to feed');
    setSelectedBundle(null);
    setCurrentView('feed');
  };

  const handleEditPreferences = () => {
    console.log('⚙️ [APP] Edit preferences');
    setCurrentView('preferences');
  };

  const handlePreferencesComplete = () => {
    console.log('⚙️ [APP] Preferences updated');
    setCurrentView('feed');
    // Bundles will be loaded by the UserPreferencesForm
  };

  const handlePreferencesCancel = () => {
    console.log('❌ [APP] Preferences cancelled, returning to feed without changes');
    setCurrentView('feed');
    // No bundle reloading on cancel
  };



  const handleDevelopmentTab = () => {
    console.log('🔧 [APP] Development tab');
    setCurrentView('development');
  };

  const handleBackFromDevelopment = () => {
    console.log('🔙 [APP] Back from development');
    setCurrentView('feed');
  };

  const handleLoadMoreBundles = async () => {
    if (bundleSuggestionsStore.pagination.isLoadingMore || !bundleSuggestionsStore.canLoadMore) {
      return;
    }

    bundleSuggestionsStore.setLoadingMore(true);
    
    try {
      const nextPage = bundleSuggestionsStore.nextPage;
      const userData = userPreferencesStore.userData;
      const cities = ['Paris', 'London', 'Tokyo', 'New York', 'Barcelona']; // Default cities for pagination
      
      console.log('🚀 [APP] Calling generateTripBundles service for Load More');
      console.log('👤 [APP] User data:', userData);
      
      const generateTripBundles = getTripBundleService();
      const response = await generateTripBundles(userData, cities, { 
        page: nextPage, 
        limit: 5 
      });
      
      // Append the new bundles to existing ones
      bundleSuggestionsStore.setBundles(
        response.bundles, 
        {
          page: nextPage,
          total: response.totalResults || 0,
          hasMore: response.pagination?.hasMore || false
        },
        true // append = true
      );
      
      // Save updated bundles to storage
      bundleSuggestionsStore.saveBundlesToStorage();
      
    } catch (error) {
      console.error('❌ [APP] Error loading more bundles:', error);
      bundleSuggestionsStore.setError('Failed to load more bundles');
    } finally {
      bundleSuggestionsStore.setLoadingMore(false);
    }
  };

  // Check if we're in mock mode to show development tab
  const isMockMode = (import.meta as any).env?.VITE_MOCK === 'true';

  // Show FTE if needed
  if (showFTE) {
    return (
      <div className={`App ${pwaInfo.isStandalone ? 'standalone' : 'browser'}`}>
        <FirstTimeExperience 
          onComplete={handleFTEComplete} 
          onGoPressed={(_userData, response) => {
            if (response) {
              handleBundlesGenerated(response.bundles);
            }
            
            // Complete the FTE flow and ensure we show the feed view
            setShowFTE(false);
            setCurrentView('feed');
          }}
          integrationActions={integrationActions} 
        />
      </div>
    );
  }

  // Show loading if not initialized
  if (!hasInitialized) {
    return (
      <div className={`App ${pwaInfo.isStandalone ? 'standalone' : 'browser'}`}>
        <div className="loading-container">
          <div className="loader"></div>
          <h2>Initializing app...</h2>
          <p>Loading your preferences and integrations</p>
        </div>
      </div>
    );
  }

  // Render based on current view
  return (
    <div className={`App ${pwaInfo.isStandalone ? 'standalone' : 'browser'}`}>
      {currentView === 'bundle' && selectedBundle ? (
        <BundlePage
          bundle={selectedBundle}
          onBack={handleBackToFeed}
        />
      ) : currentView === 'preferences' ? (
        <div className="preferences-view">
          <UserPreferencesForm
            onUserDataUpdate={(_userData, response) => {
              console.log('💾 [APP] Preferences saved, bundles generated');
              
              if (response) {
                // Handle the generated bundles
                handleBundlesGenerated(response.bundles);
              }
              
              handlePreferencesComplete();
            }}
            onClose={handlePreferencesComplete}
            onCancel={handlePreferencesCancel}
            integrationActions={integrationActions}
            isFirstTimeExperience={false}
          />
        </div>
      ) : currentView === 'development' && isMockMode ? (
        <DevelopmentTab
          onClose={handleBackFromDevelopment}
          userPreferencesStore={userPreferencesStore}
          integrationsStore={integrationsStore}
        />
      ) : (
        <BundleFeed
          bundles={bundleSuggestionsStore.bundles}
          onBundleClick={handleBundleClick}
          onEditPreferences={handleEditPreferences}
          onDevelopmentTab={isMockMode ? handleDevelopmentTab : undefined}
          onLoadMore={handleLoadMoreBundles}
          isLoading={isLoadingBundles}
          isLoadingMore={bundleSuggestionsStore.pagination.isLoadingMore}
          hasMore={bundleSuggestionsStore.canLoadMore}
          isMockMode={isMockMode}
        />
      )}
    </div>
  );
});

export default App;