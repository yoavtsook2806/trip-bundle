import React, { useState } from 'react';
import UserPreferencesForm from './UserPreferencesForm';
import { UserPreferencesStorage } from '../storage';
import './FirstTimeExperience.css';

interface FirstTimeExperienceProps {
  onComplete: () => void;
}

const FirstTimeExperience: React.FC<FirstTimeExperienceProps> = ({ onComplete }) => {
  const [isSkipped] = useState(false);

  const handleComplete = async () => {
    try {
      // Mark FTE as completed
      await UserPreferencesStorage.updatePreference('fteWasPresented', true);
      console.log('✨ [FTE] First Time Experience completed');
      onComplete();
    } catch (error) {
      console.error('Error completing FTE:', error);
      // Still complete the FTE even if storage fails
      onComplete();
    }
  };

  const handleSkip = async () => {
    try {
      // Mark FTE as completed even when skipped
      await UserPreferencesStorage.updatePreference('fteWasPresented', true);
      console.log('⏭️ [FTE] First Time Experience skipped');
      onComplete();
    } catch (error) {
      console.error('Error skipping FTE:', error);
      // Still complete the FTE even if storage fails
      onComplete();
    }
  };

  if (isSkipped) {
    return (
      <div className="fte-container">
        <div className="fte-skipped">
          <div className="fte-skipped-content">
            <h2>🎯 Welcome to Trip Bundle!</h2>
            <p>You can always set up your preferences later from the main screen.</p>
            <button className="fte-continue-btn" onClick={handleComplete}>
              Continue to App
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fte-container">
      <div className="fte-header">
        <div className="fte-welcome">
          <h1>🎉 Welcome to Trip Bundle!</h1>
          <p>Let's personalize your travel experience by setting up your preferences.</p>
          <p className="fte-subtitle">This will help us find the perfect trips for you.</p>
        </div>
        <div className="fte-actions">
          <button className="fte-skip-btn" onClick={handleSkip}>
            Skip for now
          </button>
        </div>
      </div>

      <div className="fte-form-container">
        <UserPreferencesForm 
          onPreferencesUpdate={() => {
            console.log('🎯 [FTE] Preferences updated during FTE');
          }}
          onClose={handleComplete}
        />
      </div>
    </div>
  );
};

export default FirstTimeExperience;
