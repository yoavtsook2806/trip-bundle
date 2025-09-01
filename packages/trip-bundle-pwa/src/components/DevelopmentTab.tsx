import React, { useState } from 'react';
import { PromptsUsage } from '../types';
import { getUserPreferences, getDateRange } from '../storage';
import './DevelopmentTab.css';

interface DevelopmentTabProps {
  promptsUsage: PromptsUsage;
  onClose: () => void;
  onResetLocalStorage: () => void;
}

export const DevelopmentTab: React.FC<DevelopmentTabProps> = ({
  promptsUsage: _promptsUsage,
  onClose,
  onResetLocalStorage
}) => {
  const [showUserData, setShowUserData] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const handleResetLocalStorage = () => {
    onResetLocalStorage();
  };

  const handleShowUserData = () => {
    const preferences = getUserPreferences();
    const dateRange = getDateRange();
    
    // Get all localStorage data
    const allLocalStorage: { [key: string]: any } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          const value = localStorage.getItem(key);
          allLocalStorage[key] = value ? JSON.parse(value) : value;
        } catch {
          allLocalStorage[key] = localStorage.getItem(key);
        }
      }
    }

    const data = {
      userPreferences: preferences,
      dateRange: dateRange,
      localStorage: allLocalStorage,
      spotifyIntegration: preferences.musicProfile ? (() => {
        try {
          const parsed = JSON.parse(preferences.musicProfile);
          return parsed.type === 'spotify' ? parsed : { type: 'text', data: preferences.musicProfile };
        } catch {
          return { type: 'text', data: preferences.musicProfile };
        }
      })() : null
    };
    
    setUserData(data);
    setShowUserData(true);
    console.log('🛠️ [DEV] User Data:', data);
  };

  return (
    <div className="development-tab">
      <div className="dev-container">
        <div className="dev-header">
          <h1>🛠️ Development Tools</h1>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="dev-content">
          <div className="dev-section">
            <h2>Actions</h2>
            <div className="dev-actions">
              <button className="dev-button reset-button" onClick={handleResetLocalStorage}>
                🗑️ Reset Local Storage
              </button>
              <button className="dev-button show-data-button" onClick={handleShowUserData}>
                📊 Show User Data
              </button>
            </div>
          </div>

          {showUserData && userData && (
            <div className="dev-section">
              <h2>User Data</h2>
              <div className="user-data-display">
                <button 
                  className="close-data-button" 
                  onClick={() => setShowUserData(false)}
                  style={{ float: 'right', marginBottom: '10px' }}
                >
                  ✕ Close
                </button>
                <pre className="user-data-json">
                  {JSON.stringify(userData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
