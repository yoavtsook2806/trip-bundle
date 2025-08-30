
import type { UserPreferences, TripBundlePromptService } from 'trip-bundle-prompts-service';

interface SettingsPanelProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  userPreferences: UserPreferences;
  onUserPreferencesChange: (prefs: UserPreferences) => void;
  integrations: Record<string, { summary: string }>;
  onIntegrationsChange: (integrations: Record<string, { summary: string }>) => void;
  service: TripBundlePromptService;
  onGenerateBundles: () => void;
  onGetEvents: () => void;
  loading: boolean;
}

const CATEGORIES = ['music', 'sports', 'culture', 'food', 'nature', 'nightlife', 'adventure'] as const;
const TRAVEL_STYLES = ['budget', 'mid-range', 'luxury'] as const;

export default function SettingsPanel({
  apiKey,
  onApiKeyChange,
  userPreferences,
  onUserPreferencesChange,
  integrations,
  onIntegrationsChange,
  service,
  onGenerateBundles,
  onGetEvents,
  loading
}: SettingsPanelProps) {
  
  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    onUserPreferencesChange({ ...userPreferences, [key]: value });
  };

  const updateIntegration = (name: string, summary: string) => {
    onIntegrationsChange({
      ...integrations,
      [name]: { summary }
    });
  };

  return (
    <div className="settings-panel">
      <h2>Trip Bundle Playground</h2>
      
      {/* API Configuration */}
      <div className="section">
        <h3>API Configuration</h3>
        <div className="form-group">
          <label>OpenAI API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="sk-..."
          />
        </div>
        <div className="form-group">
          <label>Service Status</label>
          <div style={{ color: service.isConfigured() ? '#4ade80' : '#f87171' }}>
            {service.isConfigured() ? '✓ Configured' : '✗ Not Configured'}
          </div>
        </div>
      </div>

      {/* Budget Settings */}
      <div className="section">
        <h3>Budget</h3>
        <div className="form-group">
          <label>Min Budget</label>
          <input
            type="number"
            value={userPreferences.budget?.min || 0}
            onChange={(e) => updatePreference('budget', {
              ...userPreferences.budget,
              min: parseInt(e.target.value) || 0,
              max: userPreferences.budget?.max || 5000,
              currency: userPreferences.budget?.currency || 'USD'
            })}
          />
        </div>
        <div className="form-group">
          <label>Max Budget</label>
          <input
            type="number"
            value={userPreferences.budget?.max || 5000}
            onChange={(e) => updatePreference('budget', {
              ...userPreferences.budget,
              min: userPreferences.budget?.min || 0,
              max: parseInt(e.target.value) || 5000,
              currency: userPreferences.budget?.currency || 'USD'
            })}
          />
        </div>
        <div className="form-group">
          <label>Currency</label>
          <select
            value={userPreferences.budget?.currency || 'USD'}
            onChange={(e) => updatePreference('budget', {
              ...userPreferences.budget,
              min: userPreferences.budget?.min || 0,
              max: userPreferences.budget?.max || 5000,
              currency: e.target.value
            })}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
          </select>
        </div>
      </div>

      {/* Duration Settings */}
      <div className="section">
        <h3>Duration</h3>
        <div className="form-group">
          <label>Min Days</label>
          <input
            type="number"
            value={userPreferences.duration?.min || 1}
            onChange={(e) => updatePreference('duration', {
              min: parseInt(e.target.value) || 1,
              max: userPreferences.duration?.max || 7
            })}
          />
        </div>
        <div className="form-group">
          <label>Max Days</label>
          <input
            type="number"
            value={userPreferences.duration?.max || 7}
            onChange={(e) => updatePreference('duration', {
              min: userPreferences.duration?.min || 1,
              max: parseInt(e.target.value) || 7
            })}
          />
        </div>
      </div>

      {/* Travel Preferences */}
      <div className="section">
        <h3>Travel Preferences</h3>
        <div className="form-group">
          <label>Travel Style</label>
          <select
            value={userPreferences.travelStyle || 'mid-range'}
            onChange={(e) => updatePreference('travelStyle', e.target.value as any)}
          >
            {TRAVEL_STYLES.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Group Size</label>
          <input
            type="number"
            value={userPreferences.groupSize || 1}
            onChange={(e) => updatePreference('groupSize', parseInt(e.target.value) || 1)}
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={userPreferences.accessibility || false}
              onChange={(e) => updatePreference('accessibility', e.target.checked)}
            />
            Accessibility Requirements
          </label>
        </div>
      </div>

      {/* Categories */}
      <div className="section">
        <h3>Preferred Categories</h3>
        <div className="checkbox-group">
          {CATEGORIES.map(category => (
            <div key={category} className="checkbox-item">
              <input
                type="checkbox"
                id={category}
                checked={userPreferences.preferredCategories?.includes(category) || false}
                onChange={(e) => {
                  const current = userPreferences.preferredCategories || [];
                  const updated = e.target.checked
                    ? [...current, category]
                    : current.filter(c => c !== category);
                  updatePreference('preferredCategories', updated);
                }}
              />
              <label htmlFor={category}>{category}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <div className="section">
        <h3>Integrations</h3>
        <div className="form-group">
          <label>Spotify Summary</label>
          <textarea
            value={integrations.spotify?.summary || ''}
            onChange={(e) => updateIntegration('spotify', e.target.value)}
            rows={3}
            placeholder="User music preferences..."
          />
        </div>
        <div className="form-group">
          <label>Calendar Summary</label>
          <textarea
            value={integrations.calendar?.summary || ''}
            onChange={(e) => updateIntegration('calendar', e.target.value)}
            rows={3}
            placeholder="User availability..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="section">
        <h3>Actions</h3>
        <button
          className="button"
          onClick={onGenerateBundles}
          disabled={loading || !service.isConfigured()}
        >
          {loading ? 'Generating...' : 'Generate Trip Bundles'}
        </button>
        <button
          className="button secondary"
          onClick={onGetEvents}
          disabled={loading || !service.isConfigured()}
        >
          {loading ? 'Loading...' : 'Get Events (Paris)'}
        </button>
      </div>
    </div>
  );
}
