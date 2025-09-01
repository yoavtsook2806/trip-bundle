import React from 'react';
import UserPreferencesForm from './UserPreferencesForm';
import { FirstTimeExperienceStorage } from '../storage';
import type { IntegrationActions } from '../actions/integrationActions';
import type { UserData } from '../storage/userPreferences';
import './FirstTimeExperience.css';

interface FirstTimeExperienceProps {
  onComplete: () => void;
  onGoPressed: (userData: UserData) => void; // New prop for GO button press
  integrationActions?: IntegrationActions;
}

const FirstTimeExperience: React.FC<FirstTimeExperienceProps> = ({ 
  onGoPressed,
  integrationActions 
}) => {


  const handleGoPressed = async (userData: UserData) => {
    try {
      // Mark FTE as completed when GO is pressed
      await FirstTimeExperienceStorage.setFteWasPresented(true);
      console.log('🚀 [FTE] GO button pressed, completing FTE');
      onGoPressed(userData);
    } catch (error) {
      console.error('Error completing FTE:', error);
      // Still proceed even if storage fails
      onGoPressed(userData);
    }
  };

  return (
    <div className="fte-container">
      <div className="fte-header">
        <div className="fte-welcome">
          <h1>🎉 Welcome to Trip Bundle!</h1>
          <p>Let's personalize your travel experience by setting up your preferences.</p>
          <p className="fte-subtitle">This will help us find the perfect trips for you.</p>
        </div>
      </div>

      <div className="fte-form-container">
        <UserPreferencesForm 
          onUserDataUpdate={() => {
            console.log('🎯 [FTE] User data updated during FTE');
          }}
          onGoPressed={handleGoPressed}
          integrationActions={integrationActions}
          isFirstTimeExperience={true}
        />
      </div>
    </div>
  );
};

export default FirstTimeExperience;
