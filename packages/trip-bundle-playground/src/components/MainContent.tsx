import type { TripBundlePromptService, GPTResponse, EventsResponse } from 'trip-bundle-prompts-service';

interface MainContentProps {
  service: TripBundlePromptService;
  results: {
    bundles?: GPTResponse;
    events?: EventsResponse;
    error?: string;
  };
  loading: boolean;
}

export default function MainContent({ service, results, loading }: MainContentProps) {
  const systemPrompt = service.getSystemPrompt();
  const userPrompt = service.getUserPrompt();

  return (
    <div className="main-content">
      <h2>Prompt Service Testing</h2>
      
      {/* Current Prompts */}
      <div className="section">
        <h3>Current Prompts</h3>
        
        <div className="prompt-display">
          <h4>System Prompt</h4>
          <pre>{systemPrompt}</pre>
        </div>
        
        <div className="prompt-display">
          <h4>User Prompt</h4>
          <pre>{userPrompt}</pre>
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section">
        <h3>Results</h3>
        
        {loading && (
          <div className="loading">
            Processing request...
          </div>
        )}
        
        {results.error && (
          <div className="error">
            <strong>Error:</strong> {results.error}
          </div>
        )}
        
        {results.bundles && (
          <div className="result-item">
            <h4>Generated Trip Bundles</h4>
            <div style={{ marginBottom: '12px', color: '#ccc', fontSize: '14px' }}>
              Processing Time: {results.bundles.processingTime}ms | 
              Bundles: {results.bundles.bundles.length} | 
              Reasoning: {results.bundles.reasoning}
            </div>
            <pre>{JSON.stringify(results.bundles, null, 2)}</pre>
          </div>
        )}
        
        {results.events && (
          <div className="result-item">
            <h4>Events for Paris (Next 7 Days)</h4>
            <div style={{ marginBottom: '12px', color: '#ccc', fontSize: '14px' }}>
              Processing Time: {results.events.processingTime}ms | 
              Events: {results.events.events.length} | 
              Reasoning: {results.events.reasoning}
            </div>
            <pre>{JSON.stringify(results.events, null, 2)}</pre>
          </div>
        )}
        
        {!loading && !results.bundles && !results.events && !results.error && (
          <div style={{ color: '#888', fontStyle: 'italic' }}>
            No results yet. Configure your API key and click one of the action buttons to test the service.
          </div>
        )}
      </div>

      {/* Service Info */}
      <div className="section">
        <h3>Service Information</h3>
        <div style={{ fontSize: '14px', color: '#ccc' }}>
          <div><strong>Configured:</strong> {service.isConfigured() ? 'Yes' : 'No'}</div>
          <div><strong>Cities Available:</strong> 16 sample cities</div>
          <div><strong>Model:</strong> gpt-4o-mini</div>
          <div><strong>Temperature:</strong> 0.7</div>
          <div><strong>Max Tokens:</strong> 4000</div>
        </div>
      </div>
    </div>
  );
}
