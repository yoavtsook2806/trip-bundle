import React, { useEffect, useState } from 'react';
import './ThinkingScreen.css';

interface ThinkingScreenProps {
  message?: string;
}

export const ThinkingScreen: React.FC<ThinkingScreenProps> = ({ 
  message = "Creating your perfect trip bundles..." 
}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const thinkingMessages = [
    "🔍 Analyzing your preferences",
    "🎯 Finding perfect events",
    "🗺️ Planning your itinerary", 
    "✨ Crafting unique experiences",
    "🎉 Almost ready!"
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % thinkingMessages.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [thinkingMessages.length]);

  return (
    <div className="thinking-screen">
      <div className="thinking-container">
        <div className="thinking-animation">
          <div className="brain-icon">🧠</div>
          <div className="pulse-ring"></div>
          <div className="pulse-ring delay-1"></div>
          <div className="pulse-ring delay-2"></div>
        </div>
        
        <h1 className="thinking-title">
          {message}{dots}
        </h1>
        
        <p className="thinking-subtitle">
          {thinkingMessages[currentMessage]}
        </p>
        
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
        
        <div className="thinking-tips">
          <p>💡 We're curating experiences based on your unique interests</p>
          <p>🎵 Your music taste helps us find the perfect concerts</p>
          <p>📅 Events are matched to your travel dates</p>
        </div>
      </div>
    </div>
  );
};
