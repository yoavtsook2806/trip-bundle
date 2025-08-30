import { useState, useMemo } from 'react';
import { TripBundlePromptService } from 'trip-bundle-prompts-service';
import type { UserData, GPTResponse, EventsResponse, UserPreferences } from 'trip-bundle-prompts-service';
import SettingsPanel from './components/SettingsPanel';
import MainContent from './components/MainContent';

const SAMPLE_CITIES = [
  'New York', 'London', 'Paris', 'Tokyo', 'Sydney', 'Barcelona', 'Amsterdam', 'Berlin',
  'Rome', 'Prague', 'Vienna', 'Budapest', 'Lisbon', 'Madrid', 'Dublin', 'Copenhagen'
];

function App() {
  const [apiKey, setApiKey] = useState('');
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    budget: { min: 1000, max: 5000, currency: 'USD' },
    duration: { min: 3, max: 7 },
    preferredCategories: ['culture', 'food'],
    travelStyle: 'mid-range',
    groupSize: 2,
    accessibility: false,
    languages: ['English'],
  });
  
  const [integrations, setIntegrations] = useState<Record<string, { summary: string }>>({
    spotify: { summary: 'User likes indie rock, electronic music, and jazz' },
    calendar: { summary: 'Available for travel in March and June 2024' }
  });

  const [results, setResults] = useState<{
    bundles?: GPTResponse;
    events?: EventsResponse;
    error?: string;
  }>({});
  
  const [loading, setLoading] = useState(false);

  const userData: UserData = useMemo(() => ({
    userPreferences,
    integrations
  }), [userPreferences, integrations]);

  const service = useMemo(() => {
    const svc = new TripBundlePromptService(userData, SAMPLE_CITIES, {
      apiKey: apiKey || undefined,
      model: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 4000
    });
    return svc;
  }, [userData, apiKey]);

  const handleGenerateBundles = async () => {
    if (!apiKey.trim()) {
      setResults({ error: 'Please enter an OpenAI API key' });
      return;
    }

    setLoading(true);
    setResults({});
    
    try {
      const response = await service.generateTripBundles({ page: 1, limit: 3 });
      setResults({ bundles: response });
    } catch (error) {
      setResults({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleGetEvents = async () => {
    if (!apiKey.trim()) {
      setResults({ error: 'Please enter an OpenAI API key' });
      return;
    }

    setLoading(true);
    setResults({});
    
    try {
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const response = await service.getEvents('Paris', startDate, endDate);
      setResults({ events: response });
    } catch (error) {
      setResults({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="playground-container">
      <SettingsPanel
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        userPreferences={userPreferences}
        onUserPreferencesChange={setUserPreferences}
        integrations={integrations}
        onIntegrationsChange={setIntegrations}
        service={service}
        onGenerateBundles={handleGenerateBundles}
        onGetEvents={handleGetEvents}
        loading={loading}
      />
      <MainContent
        service={service}
        results={results}
        loading={loading}
      />
    </div>
  );
}

export default App;
