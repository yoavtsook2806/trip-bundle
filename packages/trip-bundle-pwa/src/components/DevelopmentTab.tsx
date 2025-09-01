import React from 'react';
import { PromptsUsage } from '../types';
import './DevelopmentTab.css';

interface DevelopmentTabProps {
  promptsUsage: PromptsUsage;
  onClose: () => void;
  onResetLocalStorage: () => void;
}

export const DevelopmentTab: React.FC<DevelopmentTabProps> = ({
  promptsUsage,
  onClose,
  onResetLocalStorage
}) => {
  const handleResetLocalStorage = () => {
    onResetLocalStorage();
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
            <h2>API Usage</h2>
            <div className="usage-info">
              <div className="usage-item">
                <strong>Calls Today:</strong> {promptsUsage.count}
              </div>
              <div className="usage-item">
                <strong>Daily Limit:</strong> {promptsUsage.maxDaily}
              </div>
              <div className="usage-item">
                <strong>Date:</strong> {promptsUsage.date}
              </div>
            </div>
            <button className="reset-button" onClick={handleResetLocalStorage}>
              Reset Local Storage
            </button>
          </div>

          <div className="dev-section">
            <h2>Environment</h2>
            <div className="env-info">
              <div className="env-item">
                <strong>Mode:</strong> Mock Mode (Development)
              </div>
              <div className="env-item">
                <strong>Mock Delay:</strong> 5 seconds
              </div>
              <div className="env-item">
                <strong>Bundles Generated:</strong> 5 per call
              </div>
            </div>
          </div>

          <div className="dev-section">
            <h2>Storage</h2>
            <div className="storage-info">
              <div className="storage-item">
                <strong>User Preferences:</strong> localStorage
              </div>
              <div className="storage-item">
                <strong>Date Range:</strong> localStorage
              </div>
              <div className="storage-item">
                <strong>Usage Tracking:</strong> localStorage
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
