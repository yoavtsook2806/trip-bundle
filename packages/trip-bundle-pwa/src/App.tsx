import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  ThinkingScreen,
  BundleFeed,
  BundlePage,
  PreferencesScreen,
  DevelopmentTab
} from './components';
import { appStore } from './store';
import { getDefaultUserPreferences } from './storage';
import {
  initializeApp,
  completeFirstTimeSetup,
  updatePreferences,
  navigateToScreen,
  selectBundle,
  resetLocalStorage,
  loadMoreBundles,
  generateNewBundles
} from './actions';
import './App.css';

const MOCK_MODE = import.meta.env.VITE_MOCK === 'true' || true; // Force mock mode for now

export const App: React.FC = observer(() => {
  // Initialize app state on mount
  useEffect(() => {
    initializeApp();
  }, []);

  const handleFirstTimeComplete = async (preferences: any, dateRange: any) => {
    await completeFirstTimeSetup(preferences, dateRange, MOCK_MODE);
  };

  const handleBundleSelect = (bundle: any) => {
    selectBundle(bundle);
  };

  const handleBackToBundles = () => {
    navigateToScreen('bundles');
    selectBundle(null);
  };

  const handleOpenPreferences = () => {
    navigateToScreen('preferences');
  };

  const handlePreferencesSave = async (preferences: any, dateRange: any) => {
    await updatePreferences(preferences, dateRange, MOCK_MODE);
  };

  const handlePreferencesCancel = () => {
    navigateToScreen('bundles');
  };

  const handleOpenDevelopment = () => {
    navigateToScreen('development');
  };

  const handleCloseDevelopment = () => {
    navigateToScreen('bundles');
  };

  const handleResetLocalStorage = () => {
    resetLocalStorage();
  };

  const handleLoadMore = async () => {
    await loadMoreBundles(MOCK_MODE);
  };

  const handleGenerateNew = async () => {
    await generateNewBundles(MOCK_MODE);
  };

  // Render current screen
  const renderCurrentScreen = () => {
    switch (appStore.currentScreen) {
      case 'firstTime':
        return (
          <PreferencesScreen
            initialPreferences={appStore.userPreferences || getDefaultUserPreferences()}
            initialDateRange={appStore.dateRange || {
              startDate: Date.now(),
              endDate: Date.now() + (4 * 30 * 24 * 60 * 60 * 1000) // 4 months from now
            }}
            promptsUsage={appStore.promptsUsage}
            onSave={handleFirstTimeComplete}
            onCancel={() => {}} // No cancel in FTE mode
            isFTEMode={true}
          />
        );

      case 'thinking':
        return <ThinkingScreen />;

      case 'bundles':
        return (
          <BundleFeed
            bundles={appStore.bundles}
            promptsUsage={appStore.promptsUsage}
            onBundleSelect={handleBundleSelect}
            onOpenPreferences={handleOpenPreferences}
            onOpenDevelopment={MOCK_MODE ? handleOpenDevelopment : undefined}
            onLoadMore={handleLoadMore}
            onGenerateNew={handleGenerateNew}
            canLoadMore={appStore.canLoadMore}
            hasUserData={appStore.hasCompletedSetup}
            isLoading={appStore.isLoading}
            isMockMode={MOCK_MODE}
          />
        );

      case 'bundlePage':
        return appStore.selectedBundle ? (
          <BundlePage
            bundle={appStore.selectedBundle}
            onBack={handleBackToBundles}
          />
        ) : null;

      case 'preferences':
        return appStore.userPreferences && appStore.dateRange ? (
          <PreferencesScreen
            initialPreferences={appStore.userPreferences}
            initialDateRange={appStore.dateRange}
            promptsUsage={appStore.promptsUsage}
            onSave={handlePreferencesSave}
            onCancel={handlePreferencesCancel}
          />
        ) : null;

      case 'development':
        return MOCK_MODE ? (
          <DevelopmentTab
            promptsUsage={appStore.promptsUsage}
            onClose={handleCloseDevelopment}
            onResetLocalStorage={handleResetLocalStorage}
          />
        ) : null;

      default:
        return (
          <PreferencesScreen
            initialPreferences={appStore.userPreferences || getDefaultUserPreferences()}
            initialDateRange={appStore.dateRange || {
              startDate: Date.now(),
              endDate: Date.now() + (4 * 30 * 24 * 60 * 60 * 1000) // 4 months from now
            }}
            promptsUsage={appStore.promptsUsage}
            onSave={handleFirstTimeComplete}
            onCancel={() => {}} // No cancel in FTE mode
            isFTEMode={true}
          />
        );
    }
  };

  return (
    <div className="app">
      {renderCurrentScreen()}
    </div>
  );
});
