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

// Helper function to create default date range in ISO format
const getDefaultDateRange = () => {
  const now = new Date();
  const future = new Date();
  future.setMonth(future.getMonth() + 4); // 4 months from now
  return {
    startDate: now.toISOString().split('T')[0],
    endDate: future.toISOString().split('T')[0]
  };
};
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

const MOCK_MODE = import.meta.env.VITE_MOCK === 'true'; // Use environment variable to determine mock mode

console.log('🎯 [APP] AI Mode:', MOCK_MODE ? 'MOCK (Free)' : 'REAL (Costs Money)');
console.log('🎯 [APP] VITE_MOCK env var:', import.meta.env.VITE_MOCK);

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
            initialDateRange={appStore.dateRange || getDefaultDateRange()}
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
            onOpenDevelopment={handleOpenDevelopment}
            onLoadMore={handleLoadMore}
            onGenerateNew={handleGenerateNew}
            canLoadMore={appStore.canLoadMore}
            hasUserData={appStore.hasCompletedSetup}
            isLoading={appStore.isLoading}
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
        return (
          <DevelopmentTab
            promptsUsage={appStore.promptsUsage}
            onClose={handleCloseDevelopment}
            onResetLocalStorage={handleResetLocalStorage}
          />
        );

      default:
        return (
          <PreferencesScreen
            initialPreferences={appStore.userPreferences || getDefaultUserPreferences()}
            initialDateRange={appStore.dateRange || getDefaultDateRange()}
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
