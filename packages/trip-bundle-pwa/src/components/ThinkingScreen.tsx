import React from 'react';
import './ThinkingScreen.css';

interface ThinkingScreenProps {
  message?: string;
}

const ThinkingScreen: React.FC<ThinkingScreenProps> = ({ 
  message = "Finding the perfect trips for you..." 
}) => {
  return (
    <div className="thinking-screen">
      <div className="thinking-content">
        <div className="thinking-animation">
          <div className="thinking-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
        
        <h2 className="thinking-title">🤔 Thinking...</h2>
        <p className="thinking-message">{message}</p>
        
        <div className="thinking-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <span className="progress-text">Analyzing your preferences</span>
        </div>
      </div>
    </div>
  );
};

export default ThinkingScreen;
