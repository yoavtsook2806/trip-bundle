import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import './App.css';

// Import our new structure
import { UserPreferencesStore } from './store';
import { GPTService, TripBundle } from './services';
import { SpotifyIntegration } from './integrations';
import { TripActions } from './actions';
import { BundleOffer } from './components';
import { COUNTRIES, ENTERTAINMENT_CATEGORIES } from './constants';

// Create store instances (in a real app, these would be in a context or DI container)
const userPreferencesStore = new UserPreferencesStore();
const gptService = new GPTService();
const spotifyIntegration = new SpotifyIntegration();
const tripActions = new TripActions(userPreferencesStore, gptService, spotifyIntegration);

const App: React.FC = observer(() => {
  const [bundles, setBundles] = useState<TripBundle[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    // Initialize with some sample preferences for demo
    tripActions.updateBudget(800, 2500, 'USD');
    tripActions.updateDuration(4, 7);
    tripActions.addMusicGenre('Pop');
    tripActions.addMusicGenre('Rock');
    tripActions.addSportsInterest('Football');
    tripActions.addPreferredCountry('GB');
    tripActions.addPreferredCountry('US');
  }, []);

  const handleGenerateBundles = async () => {
    try {
      const countries = selectedCountries.length > 0 ? selectedCountries : ['GB', 'US', 'FR'];
      const generatedBundles = await tripActions.generateTripBundles(countries, 2);
      setBundles(generatedBundles);
      setShowDemo(true);
    } catch (error) {
      console.error('Failed to generate bundles:', error);
    }
  };

  const handleCountryToggle = (countryCode: string) => {
    setSelectedCountries(prev => 
      prev.includes(countryCode)
        ? prev.filter(c => c !== countryCode)
        : [...prev, countryCode]
    );
  };

  const handleSpotifyConnect = () => {
    tripActions.connectSpotify();
  };

  const preferenceSummary = tripActions.getPreferenceSummary();
  const isLoading = tripActions.isLoading();
  const isSpotifyConnected = tripActions.isSpotifyConnected();

  return (
    <div className="App">
      <header className="App-header">
        <h1>🧳 Trip Bundle AI</h1>
        <p>Discover personalized travel experiences powered by AI</p>
        
        {/* Project Structure Demo */}
        <div className="structure-demo">
          <h2>🏗️ Project Structure Created</h2>
          <div className="structure-grid">
            <div className="structure-item">
              <h3>📦 Store (MobX)</h3>
              <p>✅ UserPreferences store with reactive state management</p>
            </div>
            <div className="structure-item">
              <h3>🔧 Services</h3>
              <p>✅ GPT service for AI-powered trip generation</p>
            </div>
            <div className="structure-item">
              <h3>🔌 Integrations</h3>
              <p>✅ Spotify API integration for music preferences</p>
            </div>
            <div className="structure-item">
              <h3>⚡ Actions</h3>
              <p>✅ Trip actions orchestrating services and stores</p>
            </div>
            <div className="structure-item">
              <h3>🎨 Components</h3>
              <p>✅ BundleOffer component with beautiful UI</p>
            </div>
            <div className="structure-item">
              <h3>📊 Constants</h3>
              <p>✅ Countries & entertainment data</p>
            </div>
          </div>
        </div>

        {/* User Preferences Summary */}
        <div className="preferences-summary">
          <h3>🎯 Your Current Preferences</h3>
          <div className="summary-grid">
            <div>Budget: {preferenceSummary.budgetRange}</div>
            <div>Duration: {preferenceSummary.duration}</div>
            <div>Countries: {preferenceSummary.countries} selected</div>
            <div>Music Genres: {preferenceSummary.musicGenres} genres</div>
            <div>Sports: {preferenceSummary.sportsInterests} interests</div>
            <div>Entertainment: {preferenceSummary.entertainments} preferences</div>
          </div>
        </div>

        {/* Country Selection */}
        <div className="country-selection">
          <h3>🌍 Select Countries to Explore</h3>
          <div className="country-grid">
            {COUNTRIES.slice(0, 8).map(country => (
              <button
                key={country.code}
                className={`country-btn ${selectedCountries.includes(country.code) ? 'selected' : ''}`}
                onClick={() => handleCountryToggle(country.code)}
              >
                {country.name}
              </button>
            ))}
          </div>
        </div>

        {/* Integration Demo */}
        <div className="integration-demo">
          <h3>🎵 Connect Your Music Taste</h3>
          <button
            className={`spotify-btn ${isSpotifyConnected ? 'connected' : ''}`}
            onClick={handleSpotifyConnect}
            disabled={isSpotifyConnected}
          >
            {isSpotifyConnected ? '✅ Spotify Connected' : '🎵 Connect Spotify'}
          </button>
        </div>

        {/* Generate Bundles */}
        <div className="generate-section">
          <button
            className="generate-btn"
            onClick={handleGenerateBundles}
            disabled={isLoading}
          >
            {isLoading ? '🤖 AI is thinking...' : '✨ Generate Trip Bundles'}
          </button>
        </div>

        {/* Entertainment Categories */}
        <div className="categories-demo">
          <h3>🎭 Available Entertainment Categories</h3>
          <div className="categories-grid">
            {ENTERTAINMENT_CATEGORIES.map(category => (
              <span key={category} className="category-tag">
                {category}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Bundle Results */}
      {showDemo && bundles.length > 0 && (
        <div className="bundles-section">
          <h2>🎉 Your Personalized Trip Bundles</h2>
          {bundles.map(bundle => (
            <BundleOffer
              key={bundle.id}
              bundle={bundle}
              onSelect={(bundle) => console.log('Selected bundle:', bundle.title)}
              onBookmark={(bundle) => console.log('Bookmarked bundle:', bundle.title)}
            />
          ))}
        </div>
      )}

      {/* Architecture Info */}
      <div className="architecture-info">
        <h3>🚀 Architecture Highlights</h3>
        <ul>
          <li><strong>MobX State Management:</strong> Reactive stores for user preferences</li>
          <li><strong>Service Layer:</strong> GPT integration for AI-powered recommendations</li>
          <li><strong>External Integrations:</strong> Spotify API for personalized music data</li>
          <li><strong>Component Architecture:</strong> Reusable, styled React components</li>
          <li><strong>TypeScript:</strong> Full type safety across the application</li>
          <li><strong>Modular Structure:</strong> Clean separation of concerns</li>
        </ul>
      </div>
    </div>
  );
});

export default App;