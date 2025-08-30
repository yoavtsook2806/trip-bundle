import React, { useEffect, useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import './App.css';

// Import our stores, services, and actions
import { UserPreferencesStore, BundleSuggestionsStore } from './store';
import { GPTService } from './services';
import { SpotifyIntegration } from './integrations';
import { TripActions } from './actions';
import { BundleOffer, TabNavigation, UserPreferencesForm, SearchForm, EventDetails, DevelopmentTab } from './components';
import { Event } from './types';
import { usePWA } from './hooks/usePWA';

// Import the TripBundle icon
import TripBundleIcon from './images/TripBundleIcon.jpeg';

// Create store instances (in a real app, these would be in a context or DI container)
const userPreferencesStore = new UserPreferencesStore();
const bundleSuggestionsStore = new BundleSuggestionsStore();
const gptService = new GPTService();
const spotifyIntegration = new SpotifyIntegration();

// Create actions instance with all dependencies
const tripActions = new TripActions(
  userPreferencesStore,
  bundleSuggestionsStore,
  gptService,
  spotifyIntegration
);

const App: React.FC = observer(() => {
  const [hasStarted, setHasStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('trips');
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const pwaInfo = usePWA();

  // Infinite scroll functionality
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) {
      return;
    }
    
    // User has scrolled to the bottom, load more bundles
    if (bundleSuggestionsStore.canLoadMore) {
      tripActions.loadMoreBundles();
    }
  }, [bundleSuggestionsStore.canLoadMore, tripActions]);

  // Generate trip bundle on component mount
  useEffect(() => {
    const initializeTripGeneration = async () => {
      if (hasStarted) return;
      
      setHasStarted(true);
      // Call the action to generate trip bundles
      await tripActions.generateTripBundles();
    };

    initializeTripGeneration();
  }, [hasStarted]);

  // Add scroll event listener for infinite scroll
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Handle bundle selection - delegate to actions
  const handleSelectBundle = (bundle: any) => {
    tripActions.selectBundle(bundle);
    console.log('Selected bundle:', bundle.title);
  };

  // Handle bundle bookmarking - delegate to actions
  const handleBookmarkBundle = (bundle: any) => {
    tripActions.toggleBookmark(bundle.id);
    console.log('Toggled bookmark for:', bundle.title);
  };

  // Handle retry - delegate to actions
  const handleRetry = () => {
    tripActions.retryGeneration();
  };

  // Get data from actions (which get from stores)
  const isLoading = tripActions.isBundlesLoading();
  const isLoadingMore = tripActions.isLoadingMore();
  const canLoadMore = tripActions.canLoadMore();
  const error = tripActions.getBundlesError();
  const bundles = tripActions.getBundles();
  const hasBundles = tripActions.hasBundles();
  const selectedBundle = tripActions.getSelectedBundle();

  // Handle event search
  const handleEventSearch = async (city: string, startDate: string, endDate: string) => {
    setIsSearching(true);
    try {
      const result = await gptService.getEvents(city, startDate, endDate);
      setSearchResults(result.events);
    } catch (error) {
      console.error('Error searching events:', error);
      // Handle error - could show an error message
    } finally {
      setIsSearching(false);
    }
  };

  // Handle event selection from BundleOffer
  const handleEventClick = (entertainment: any, date: string, time: string, venue: string, cost: number) => {
    const event: Event = {
      entertainment,
      date,
      time,
      venue,
      cost,
      currency: 'EUR' // Default currency
    };
    setSelectedEvent(event);
  };

  // Tab configuration - check if we're in mock mode to show development tab
  const isMockMode = (import.meta as any).env?.VITE_MOCK === 'true';
  
  const tabs = [
    { id: 'trips', label: 'Trip Bundles', icon: '🧳' },
    { id: 'search', label: 'Search Events', icon: '🔍' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    ...(isMockMode ? [{ id: 'development', label: 'Development', icon: '🛠️' }] : [])
  ];

  const handlePreferencesUpdate = () => {
    // When preferences are updated, regenerate trips if we're on the trips tab
    if (activeTab === 'trips') {
      tripActions.generateTripBundles();
    }
  };

  return (
    <div className={`App ${pwaInfo.isStandalone ? 'standalone' : 'browser'}`}>
      <header className="App-header">
        <img src={TripBundleIcon} alt="Trip Bundle" className="app-icon" />
        <div className="title-section">
          <h1>Trip Bundle AI</h1>
          <p>Your personalized travel companion</p>
        </div>

        {/* Tab Navigation */}
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* Tab Content */}
        {activeTab === 'preferences' ? (
          <UserPreferencesForm
            onPreferencesUpdate={handlePreferencesUpdate}
            onClose={() => setActiveTab('trips')}
          />
        ) : activeTab === 'development' && isMockMode ? (
          <DevelopmentTab
            onClose={() => setActiveTab('trips')}
          />
        ) : activeTab === 'search' ? (
          <div className="search-tab-content">
            <SearchForm 
              onSearch={handleEventSearch}
              isLoading={isSearching}
            />
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="search-results">
                <h3>🎉 Found {searchResults.length} Events</h3>
                <div className="events-grid">
                  {searchResults.map((event, index) => (
                    <div 
                      key={index} 
                      className="event-card"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="event-card-header">
                        <span className="event-category">
                          {event.entertainment.category === 'music' && '🎵'}
                          {event.entertainment.category === 'sports' && '⚽'}
                          {event.entertainment.category === 'culture' && '🎭'}
                          {event.entertainment.category === 'food' && '🍽️'}
                          {event.entertainment.category === 'nightlife' && '🌙'}
                          {event.entertainment.category === 'nature' && '🌿'}
                          {event.entertainment.category === 'adventure' && '🏔️'}
                        </span>
                        <span className="event-cost">
                          €{event.cost}
                        </span>
                      </div>
                      <h4 className="event-name">{event.entertainment.name}</h4>
                      <p className="event-description">{event.entertainment.description}</p>
                      <div className="event-details">
                        <span>📍 {event.venue}</span>
                        <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                        <span>⏰ {event.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Loading State */}
            {isLoading && (
              <div className="loading-container">
                <div className="loader"></div>
                <h2>Creating trip bundle for you</h2>
                <p>Our AI is finding the perfect entertainment and destinations</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="error-container">
                <h2>❌ Oops! Something went wrong</h2>
                <p>{error}</p>
                <button 
                  className="retry-btn"
                  onClick={handleRetry}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Bundle Results */}
            {hasBundles && !isLoading && (
              <div className="bundles-container">
                <h2>🎉 Your Perfect Trip Bundles</h2>
                <p>Choose from these AI-generated travel options</p>
                
                <div className="bundles-row">
                  {bundles.map(bundle => (
                    <BundleOffer
                      key={bundle.id}
                      bundle={bundle}
                      onSelect={handleSelectBundle}
                      onBookmark={handleBookmarkBundle}
                      onEventClick={handleEventClick}
                      isSelected={selectedBundle?.id === bundle.id}
                      isBookmarked={tripActions.isBookmarked(bundle.id)}
                    />
                  ))}
                </div>

                {/* Loading More Indicator */}
                {isLoadingMore && (
                  <div className="loading-more-container">
                    <div className="loader"></div>
                    <p>Loading more bundles...</p>
                  </div>
                )}

                {/* End of Results Indicator */}
                {!canLoadMore && hasBundles && !isLoading && (
                  <div className="end-of-results">
                    <p>🎯 You've seen all available bundles!</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </header>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onBook={(event) => {
            console.log('Booking event:', event.entertainment.name);
            // Here you could add logic to add the event to a trip or booking system
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
});

export default App;