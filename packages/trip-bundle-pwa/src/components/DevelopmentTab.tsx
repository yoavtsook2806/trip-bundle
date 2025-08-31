import React, { useState } from 'react';
import { convertStoreDataToUserData } from '../services/tripBundleServiceFactory';
import type { UserData } from 'trip-bundle-prompts-service';
import UserPreferencesStore from '../store/userPreferences';
import IntegrationsStore from '../store/integrations';
import './DevelopmentTab.css';

interface DevelopmentTabProps {
  onClose: () => void;
  userPreferencesStore: UserPreferencesStore;
  integrationsStore: IntegrationsStore;
}

export const DevelopmentTab: React.FC<DevelopmentTabProps> = ({ onClose, userPreferencesStore, integrationsStore }) => {
  const [activeView, setActiveView] = useState<'userData' | 'stores' | null>(null);
  const [viewContent, setViewContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleShowUserData = () => {
    setIsLoading(true);
    setActiveView('userData');
    try {
      const userData: UserData = convertStoreDataToUserData(userPreferencesStore, integrationsStore);
      setViewContent(JSON.stringify(userData, null, 2));
    } catch (error) {
      setViewContent(`Error loading user data: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowStores = () => {
    setIsLoading(true);
    setActiveView('stores');
    try {
      const storesData = {
        userPreferences: {
          preferences: userPreferencesStore.preferences,
          spotifyConnected: userPreferencesStore.spotifyConnected,
          spotifyProfile: userPreferencesStore.spotifyProfile
        },
        integrations: {
          integrations: integrationsStore.integrations
        }
      };
      setViewContent(JSON.stringify(storesData, null, 2));
    } catch (error) {
      setViewContent(`Error loading stores data: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('⚠️ This will reset all your preferences and data. Are you sure?')) {
      return;
    }

    setIsResetting(true);
    try {
      console.log('🔄 [DEV] Resetting all storage...');
      
      // Import storage classes
      const { UserPreferencesStorage } = await import('../storage');
      const { IntegrationsStorage } = await import('../storage');
      
      // Clear specific storage keys first
      await UserPreferencesStorage.clearUserPreferences();
      await IntegrationsStorage.clearAllIntegrations();
      
      // Clear localStorage completely (in case there are other keys)
      localStorage.clear();
      
      // Reset stores to default values
      userPreferencesStore.reset();
      integrationsStore.reset();
      
      console.log('✅ [DEV] Storage reset completed, refreshing page...');
      
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('❌ [DEV] Error resetting storage:', error);
      alert('Error resetting storage. Check console for details.');
      setIsResetting(false);
    }
  };

  return (
    <div className="development-tab">
      <div className="development-header">
        <div className="header-content">
          <h2>🛠️ Development Tools</h2>
          <p>View and debug user data sent to the service</p>
        </div>
        <button className="close-tab-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="prompt-buttons">
        <button 
          className="prompt-button system-prompt-btn"
          onClick={handleShowUserData}
          disabled={isLoading}
        >
          📊 See User Data (Service Input)
        </button>
        
        <button 
          className="prompt-button user-prompt-btn"
          onClick={handleShowStores}
          disabled={isLoading}
        >
          🗄️ See Raw Store Data
        </button>
        
        <button 
          className="prompt-button reset-btn"
          onClick={handleReset}
          disabled={isLoading || isResetting}
        >
          {isResetting ? '🔄 Resetting...' : '🗑️ Reset All Data'}
        </button>
      </div>

      {isLoading && (
        <div className="prompt-loading">
          <div className="loader"></div>
          <p>Loading data...</p>
        </div>
      )}

      {activeView && viewContent && !isLoading && (
        <div className="prompt-viewer">
          <div className="prompt-header">
            <h3>
              {activeView === 'userData' ? '📊 User Data (Service Input)' : '🗄️ Raw Store Data'}
            </h3>
            <button 
              className="close-prompt-btn"
              onClick={() => {
                setActiveView(null);
                setViewContent('');
              }}
            >
              ✕
            </button>
          </div>
          
          <textarea
            className="prompt-content"
            value={viewContent}
            readOnly
            rows={20}
            placeholder="Data will appear here..."
          />
          
          <div className="prompt-actions">
            <button 
              className="copy-btn"
              onClick={() => {
                navigator.clipboard.writeText(viewContent);
                // Could add a toast notification here
              }}
            >
              📋 Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevelopmentTab;
