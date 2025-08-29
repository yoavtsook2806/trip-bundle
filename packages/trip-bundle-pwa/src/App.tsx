import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import './App.css';

// Import our stores and services
import { BundleSuggestionsStore } from './store';
import { GPTService } from './services';
import { BundleOffer } from './components';
import { COUNTRIES } from './constants/countries';
import { ALL_ENTERTAINMENTS } from './constants/entertainments';

// Create store instances
const bundleSuggestionsStore = new BundleSuggestionsStore();
const gptService = new GPTService();

const App: React.FC = observer(() => {
  const [hasStarted, setHasStarted] = useState(false);

  // Build the system prompt based on countries and entertainments
  const buildSystemPrompt = (): string => {
    const countriesList = COUNTRIES.map(country => `${country.name} (${country.code})`).join(', ');
    const entertainmentTypes = ALL_ENTERTAINMENTS.map(ent => 
      `${ent.name} (${ent.category})`
    ).join(', ');

    const nextFiveDays = new Date();
    nextFiveDays.setDate(nextFiveDays.getDate() + 5);
    const formattedDate = nextFiveDays.toISOString().split('T')[0];

    return `Based on the countries: ${countriesList}, give me a suggestion for a trip in some city for the next five days from today (until ${formattedDate}) with 2-3 attractions from the following entertainment types: ${entertainmentTypes}.

Please respond with a JSON object in the following format:
{
  "bundles": [
    {
      "id": "unique-id",
      "title": "Bundle Title",
      "description": "Brief description",
      "country": "Country Name",
      "city": "City Name", 
      "duration": 5,
      "startDate": "2024-04-15",
      "endDate": "2024-04-20",
      "totalCost": {
        "amount": 1500,
        "currency": "USD",
        "breakdown": {
          "accommodation": 600,
          "entertainment": 400,
          "food": 300,
          "transport": 200
        }
      },
      "entertainments": [
        {
          "entertainment": {
            "id": "concert-pop",
            "name": "Pop Concert",
            "category": "music",
            "subcategory": "concert",
            "description": "Live pop music performance",
            "averageDuration": 3,
            "averageCost": {"min": 50, "max": 300, "currency": "USD"},
            "seasonality": "year-round",
            "popularCountries": ["US", "GB"]
          },
          "date": "2024-04-16",
          "time": "20:00",
          "venue": "Venue Name",
          "cost": 150
        }
      ],
      "accommodation": {
        "name": "Hotel Name",
        "type": "hotel",
        "rating": 4.5,
        "pricePerNight": 120,
        "location": "City Center",
        "amenities": ["WiFi", "Gym", "Restaurant"]
      },
      "transportation": {
        "type": "flight",
        "details": "Round-trip flight",
        "cost": 400
      },
      "recommendations": {
        "restaurants": ["Restaurant 1", "Restaurant 2"],
        "localTips": ["Tip 1", "Tip 2"],
        "weatherInfo": "Mild weather expected",
        "packingList": ["Light jacket", "Comfortable shoes"]
      },
      "confidence": 85
    }
  ],
  "reasoning": "Explanation of why this bundle was chosen",
  "alternatives": ["Alternative suggestion 1", "Alternative suggestion 2"]
}

Focus on realistic pricing, actual venues, and current entertainment options.`;
  };

  // Generate trip bundle on component mount
  useEffect(() => {
    const generateTripBundle = async () => {
      if (hasStarted) return;
      
      setHasStarted(true);
      bundleSuggestionsStore.setLoading(true);

      try {
        const systemPrompt = buildSystemPrompt();
        const userPrompt = ''; // Empty for now as requested
        
        const response = await gptService.generateTripBundles(systemPrompt, userPrompt);
        
        // Save the bundles to the store
        bundleSuggestionsStore.setBundles(response.bundles);
        bundleSuggestionsStore.saveBundlesToStorage();
        
      } catch (error) {
        console.error('Failed to generate trip bundle:', error);
        bundleSuggestionsStore.setError('Failed to generate trip bundle. Please try again.');
      }
    };

    generateTripBundle();
  }, [hasStarted]);

  // Handle bundle selection
  const handleSelectBundle = (bundle: any) => {
    bundleSuggestionsStore.selectBundle(bundle);
    console.log('Selected bundle:', bundle.title);
  };

  // Handle bundle bookmarking
  const handleBookmarkBundle = (bundle: any) => {
    bundleSuggestionsStore.toggleBookmark(bundle.id);
    console.log('Toggled bookmark for:', bundle.title);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🧳 Trip Bundle AI</h1>
        <p>Your personalized travel companion</p>
        
        {/* Loading State */}
        {bundleSuggestionsStore.isLoading && (
          <div className="loading-container">
            <div className="loader"></div>
            <h2>Creating trip bundle for you...</h2>
            <p>Our AI is finding the perfect entertainment and destinations</p>
          </div>
        )}

        {/* Error State */}
        {bundleSuggestionsStore.error && (
          <div className="error-container">
            <h2>❌ Oops! Something went wrong</h2>
            <p>{bundleSuggestionsStore.error}</p>
            <button 
              className="retry-btn"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Bundle Results */}
        {bundleSuggestionsStore.hasBundles && !bundleSuggestionsStore.isLoading && (
          <div className="bundles-container">
            <h2>🎉 Your Perfect Trip Bundle</h2>
            <p>Generated just for you with the best entertainment options</p>
            
            {bundleSuggestionsStore.bundles.map(bundle => (
              <BundleOffer
                key={bundle.id}
                bundle={bundle}
                onSelect={handleSelectBundle}
                onBookmark={handleBookmarkBundle}
                isSelected={bundleSuggestionsStore.selectedBundle?.id === bundle.id}
                isBookmarked={bundleSuggestionsStore.isBookmarked(bundle.id)}
              />
            ))}
          </div>
        )}
      </header>
    </div>
  );
});

export default App;