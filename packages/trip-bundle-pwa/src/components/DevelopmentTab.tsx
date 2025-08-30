import React, { useState } from 'react';
import { getSystemPrompt, getUserPrompt } from '../prompts';
import UserPreferencesStore from '../store/userPreferences';
import IntegrationsStore from '../store/integrations';
import './DevelopmentTab.css';

interface DevelopmentTabProps {
  onClose: () => void;
  userPreferencesStore: UserPreferencesStore;
  integrationsStore: IntegrationsStore;
}

export const DevelopmentTab: React.FC<DevelopmentTabProps> = ({ onClose, userPreferencesStore, integrationsStore }) => {
  const [activePrompt, setActivePrompt] = useState<'system' | 'user' | null>(null);
  const [promptContent, setPromptContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleShowSystemPrompt = () => {
    setIsLoading(true);
    setActivePrompt('system');
    try {
      const systemPrompt = getSystemPrompt();
      setPromptContent(systemPrompt);
    } catch (error) {
      setPromptContent(`Error loading system prompt: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowUserPrompt = async () => {
    setIsLoading(true);
    setActivePrompt('user');
    try {
      const userPrompt = getUserPrompt(userPreferencesStore, integrationsStore);
      setPromptContent(userPrompt);
    } catch (error) {
      setPromptContent(`Error loading user prompt: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="development-tab">
      <div className="development-header">
        <div className="header-content">
          <h2>🛠️ Development Tools</h2>
          <p>View and debug AI prompts (Mock Mode Only)</p>
        </div>
        <button className="close-tab-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="prompt-buttons">
        <button 
          className="prompt-button system-prompt-btn"
          onClick={handleShowSystemPrompt}
          disabled={isLoading}
        >
          📋 See System Prompt
        </button>
        
        <button 
          className="prompt-button user-prompt-btn"
          onClick={handleShowUserPrompt}
          disabled={isLoading}
        >
          👤 See User Prompt
        </button>
      </div>

      {isLoading && (
        <div className="prompt-loading">
          <div className="loader"></div>
          <p>Loading prompt...</p>
        </div>
      )}

      {activePrompt && promptContent && !isLoading && (
        <div className="prompt-viewer">
          <div className="prompt-header">
            <h3>
              {activePrompt === 'system' ? '📋 System Prompt' : '👤 User Prompt'}
            </h3>
            <button 
              className="close-prompt-btn"
              onClick={() => {
                setActivePrompt(null);
                setPromptContent('');
              }}
            >
              ✕
            </button>
          </div>
          
          <textarea
            className="prompt-content"
            value={promptContent}
            readOnly
            rows={20}
            placeholder="Prompt content will appear here..."
          />
          
          <div className="prompt-actions">
            <button 
              className="copy-btn"
              onClick={() => {
                navigator.clipboard.writeText(promptContent);
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
