import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import './App.css';

// Import our stores, services, and actions
import { UserPreferencesStore, BundleSuggestionsStore, IntegrationsStore } from './store';
import { SpotifyService } from './services';
import { TripActions, IntegrationActions, initIntegrationsData, initUserPreferencesData } from './actions';
import { IntegrationsStorage, UserPreferencesStorage } from './storage';
import { BundleFeed, BundlePage, UserPreferencesForm, DevelopmentTab, FirstTimeExperience } from './components';
import type { TripBundle } from './types';
import { usePWA } from './hooks/usePWA';

// Create store instances (in a real app, these would be in a context or DI container)
const userPreferencesStore = new UserPreferencesStore();
const bundleSuggestionsStore = new BundleSuggestionsStore();
const integrationsStore = new IntegrationsStore();
// gptService removed - now using TripBundlePromptService via factory in TripActions
const spotifyService = new SpotifyService();

// Create actions instances with dependencies
const tripActions = new TripActions(
  bundleSuggestionsStore,
  userPreferencesStore,
  integrationsStore
);

const integrationActions = new IntegrationActions(
  userPreferencesStore,
  integrationsStore,
  spotifyService,
  IntegrationsStorage
);

const App: React.FC = observer(() => {
  const [hasInitialized, setHasInitialized] = useState(false);
  const [showFTE, setShowFTE] = useState(false);
  const [currentView, setCurrentView] = useState<'feed' | 'bundle' | 'preferences' | 'development'>('feed');
  const [selectedBundle, setSelectedBundle] = useState<TripBundle | null>(null);
  const [bundles, setBundles] = useState<TripBundle[]>([]);
  const [isLoadingBundles, setIsLoadingBundles] = useState(false);
  const pwaInfo = usePWA();

  // Initialize data from storage on app startup
  useEffect(() => {
    const initializeApp = async () => {
      if (hasInitialized) return;
      
      console.log('🚀 [APP] Initializing app with stored data...');
      setHasInitialized(true);
      
      // Initialize user preferences and integrations data from storage
      await Promise.all([
        initUserPreferencesData(userPreferencesStore, UserPreferencesStorage),
        initIntegrationsData(userPreferencesStore, integrationsStore, IntegrationsStorage)
      ]);
      
      // Check if FTE should be shown
      const preferences = await UserPreferencesStorage.getUserPreferences();
      if (!preferences.fteWasPresented) {
        console.log('✨ [APP] First time user, showing FTE');
        setShowFTE(true);
      } else {
        console.log('🎯 [APP] Returning user, loading bundles');
        await loadBundles();
      }
      
      console.log('🚀 [APP] App initialization completed');
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
    
    if (authCode && authInProgress) {
      console.log('🎵 [APP] Found auth code, clearing flags and processing...');
      localStorage.removeItem('spotify_auth_code');
      localStorage.removeItem('spotify_auth_in_progress');
      
      try {
        // Use integrationActions.handleSpotifyCallback to process the auth code
        console.log('🎵 [APP] Calling integrationActions.handleSpotifyCallback with code:', authCode);
        const success = await integrationActions.handleSpotifyCallback(authCode);
        console.log('🎵 [APP] Spotify callback processing result:', success);
      } catch (error) {
        console.error('🎵 [APP] Error processing Spotify auth return:', error);
      }
    } else {
      console.log('🎵 [APP] No valid auth code found for processing');
    }
  };

  const loadBundles = async () => {
    try {
      setIsLoadingBundles(true);
      console.log('🎯 [APP] Loading trip bundles...');
      
      // Use trip actions to generate bundles
      await tripActions.generateTripBundles();
      
      // Get bundles from store
      const generatedBundles = tripActions.getBundles();
      setBundles(generatedBundles);
      
      console.log('✅ [APP] Bundles loaded:', generatedBundles.length);
    } catch (error) {
      console.error('❌ [APP] Error loading bundles:', error);
    } finally {
      setIsLoadingBundles(false);
    }
  };

  const handleFTEComplete = async () => {
    console.log('✨ [APP] FTE completed, loading bundles');
    setShowFTE(false);
    await loadBundles();
  };

  const handleBundleClick = (bundle: TripBundle) => {
    console.log('🎯 [APP] Bundle selected:', bundle.id);
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

  const handlePreferencesComplete = async () => {
    console.log('⚙️ [APP] Preferences updated, reloading bundles');
    setCurrentView('feed');
    await loadBundles();
  };

  const handleDevelopmentTab = () => {
    console.log('🔧 [APP] Development tab');
    setCurrentView('development');
  };

  const handleBackFromDevelopment = () => {
    console.log('🔙 [APP] Back from development');
    setCurrentView('feed');
  };

  // Check if we're in mock mode to show development tab
  const isMockMode = (import.meta as any).env?.VITE_MOCK === 'true';

  // Show FTE if needed
  if (showFTE) {
    return (
      <div className={`App ${pwaInfo.isStandalone ? 'standalone' : 'browser'}`}>
        <FirstTimeExperience onComplete={handleFTEComplete} />
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
            onPreferencesUpdate={() => {
              console.log('🎯 [APP] Preferences updated');
            }}
            onClose={handlePreferencesComplete}
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
          bundles={bundles}
          onBundleClick={handleBundleClick}
          onEditPreferences={handleEditPreferences}
          onDevelopmentTab={isMockMode ? handleDevelopmentTab : undefined}
          isLoading={isLoadingBundles}
          isMockMode={isMockMode}
        />
      )}
    </div>
  );
});

export default App;