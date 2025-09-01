import React, { useState, useEffect } from 'react';
import { generateTripBundles } from 'trip-bundle-prompts-service';
import {
  FirstTimeExperience,
  ThinkingScreen,
  BundleFeed,
  BundlePage,
  PreferencesScreen,
  DevelopmentTab
} from './components';
import {
  AppState,
  UserPreferences,
  DateRange,
  TripBundle,
  UserData,

} from './types';
import {
  getUserPreferences,
  saveUserPreferences,
  getDateRange,
  saveDateRange,
  hasCompletedFirstTimeSetup,
  getPromptsUsage,
  incrementPromptsUsage,
  canMakePromptCall
} from './storage';
import './App.css';

const MOCK_MODE = import.meta.env.VITE_MOCK === 'true' || true; // Force mock mode for now

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    currentScreen: 'firstTime',
    isLoading: false,
    bundles: [],
    selectedBundle: null,
    userPreferences: null,
    dateRange: null,
    promptsUsage: getPromptsUsage()
  });

  // Initialize app state on mount
  useEffect(() => {
    const preferences = getUserPreferences();
    const dateRange = getDateRange();
    const hasSetup = hasCompletedFirstTimeSetup();

    setAppState(prev => ({
      ...prev,
      userPreferences: preferences,
      dateRange: dateRange,
      currentScreen: hasSetup ? 'bundles' : 'firstTime',
      promptsUsage: getPromptsUsage()
    }));
  }, []);

  const generateBundles = async (preferences: UserPreferences, dateRange: DateRange) => {
    if (!canMakePromptCall()) {
      console.warn('Daily prompt limit reached');
      return;
    }

    setAppState(prev => ({ ...prev, currentScreen: 'thinking', isLoading: true }));

    try {
      const userData: UserData = {
        userPreferences: preferences,
        dateRange: dateRange
      };

      console.log('🚀 Generating bundles with:', userData);
      console.log('🎭 Mock mode:', MOCK_MODE);
      
      const response = await generateTripBundles(userData, MOCK_MODE);
      
      // Increment usage counter
      const newUsage = incrementPromptsUsage();
      
      setAppState(prev => ({
        ...prev,
        bundles: response.bundles,
        currentScreen: 'bundles',
        isLoading: false,
        promptsUsage: newUsage
      }));

      console.log('✅ Generated bundles:', response.bundles);
    } catch (error) {
      console.error('❌ Error generating bundles:', error);
      setAppState(prev => ({
        ...prev,
        currentScreen: 'bundles',
        isLoading: false
      }));
    }
  };

  const handleFirstTimeComplete = async (preferences: UserPreferences, dateRange: DateRange) => {
    console.log('🎯 First time setup complete:', { preferences, dateRange });
    
    // Save preferences
    saveUserPreferences(preferences);
    saveDateRange(dateRange);
    
    setAppState(prev => ({
      ...prev,
      userPreferences: preferences,
      dateRange: dateRange
    }));

    // Generate bundles
    await generateBundles(preferences, dateRange);
  };

  const handleBundleSelect = (bundle: TripBundle) => {
    setAppState(prev => ({
      ...prev,
      selectedBundle: bundle,
      currentScreen: 'bundlePage'
    }));
  };

  const handleBackToBundles = () => {
    setAppState(prev => ({
      ...prev,
      selectedBundle: null,
      currentScreen: 'bundles'
    }));
  };

  const handleOpenPreferences = () => {
    setAppState(prev => ({
      ...prev,
      currentScreen: 'preferences'
    }));
  };

  const handlePreferencesSave = async (preferences: UserPreferences, dateRange: DateRange) => {
    console.log('💾 Saving preferences:', { preferences, dateRange });
    
    // Save preferences
    saveUserPreferences(preferences);
    saveDateRange(dateRange);
    
    setAppState(prev => ({
      ...prev,
      userPreferences: preferences,
      dateRange: dateRange
    }));

    // Generate new bundles
    await generateBundles(preferences, dateRange);
  };

  const handlePreferencesCancel = () => {
    setAppState(prev => ({
      ...prev,
      currentScreen: 'bundles'
    }));
  };

  const handleOpenDevelopment = () => {
    setAppState(prev => ({
      ...prev,
      currentScreen: 'development'
    }));
  };

  const handleCloseDevelopment = () => {
    setAppState(prev => ({
      ...prev,
      currentScreen: 'bundles'
    }));
  };

  const handleResetUsage = () => {
    setAppState(prev => ({
      ...prev,
      promptsUsage: getPromptsUsage()
    }));
  };

  // Render current screen
  const renderCurrentScreen = () => {
    switch (appState.currentScreen) {
      case 'firstTime':
        return (
          <FirstTimeExperience
            onComplete={handleFirstTimeComplete}
          />
        );

      case 'thinking':
        return <ThinkingScreen />;

      case 'bundles':
        return (
          <BundleFeed
            bundles={appState.bundles}
            promptsUsage={appState.promptsUsage}
            onBundleSelect={handleBundleSelect}
            onOpenPreferences={handleOpenPreferences}
            onOpenDevelopment={MOCK_MODE ? handleOpenDevelopment : undefined}
            isMockMode={MOCK_MODE}
          />
        );

      case 'bundlePage':
        return appState.selectedBundle ? (
          <BundlePage
            bundle={appState.selectedBundle}
            onBack={handleBackToBundles}
          />
        ) : null;

      case 'preferences':
        return appState.userPreferences && appState.dateRange ? (
          <PreferencesScreen
            initialPreferences={appState.userPreferences}
            initialDateRange={appState.dateRange}
            promptsUsage={appState.promptsUsage}
            onSave={handlePreferencesSave}
            onCancel={handlePreferencesCancel}
          />
        ) : null;

      case 'development':
        return MOCK_MODE ? (
          <DevelopmentTab
            promptsUsage={appState.promptsUsage}
            onClose={handleCloseDevelopment}
            onResetUsage={handleResetUsage}
          />
        ) : null;

      default:
        return <FirstTimeExperience onComplete={handleFirstTimeComplete} />;
    }
  };

  return (
    <div className="app">
      {renderCurrentScreen()}
    </div>
  );
};
