# Trip Bundle Prompts Service

A Node.js service for generating personalized trip bundles using OpenAI's GPT API. This package handles prompt generation and GPT communication for the Trip Bundle application.

## Features

- 🎯 **Personalized Prompts**: Converts user preferences and integration data into optimized GPT prompts
- 🤖 **GPT Integration**: Direct communication with OpenAI's API for trip bundle generation
- 🎭 **Mock Mode**: Built-in mock data for development and testing
- 📦 **TypeScript**: Full TypeScript support with comprehensive type definitions
- 🔧 **Configurable**: Flexible configuration options for different environments

## Installation

```bash
npm install trip-bundle-prompts-service
# or
yarn add trip-bundle-prompts-service
```

## Quick Start

```typescript
import { TripBundlePromptService, UserData } from 'trip-bundle-prompts-service';

// Define user data
const userData: UserData = {
  userPreferences: {
    budget: { min: 500, max: 2000, currency: 'EUR' },
    duration: { min: 3, max: 7 },
    preferredCountries: ['FR', 'IT', 'ES'],
    musicGenres: ['rock', 'pop'],
    groupSize: 2
  },
  integrations: {
    spotify: {
      summary: "Love rock music and specifically Led Zeppelin"
    }
  }
};

// Create service instance
const service = new TripBundlePromptService(userData, {
  apiKey: 'your-openai-api-key',
  mockMode: false // Set to true for development
});

// Generate trip bundles
const response = await service.generateTripBundles({ page: 1, limit: 5 });
console.log(response.bundles);

// Get events for a specific city
const events = await service.getEvents('Paris', '2024-12-01', '2024-12-07');
console.log(events.events);
```

## API Reference

### TripBundlePromptService

The main service class for generating trip bundles.

#### Constructor

```typescript
new TripBundlePromptService(userData: UserData, config?: ServiceConfig)
```

**Parameters:**
- `userData`: User preferences and integration data
- `config`: Optional service configuration

#### Methods

##### `generateTripBundles(options?: GenerationOptions): Promise<GPTResponse>`

Generates personalized trip bundles based on user data.

**Parameters:**
- `options.page`: Page number for pagination (default: 1)
- `options.limit`: Number of bundles per page (default: 5)

**Returns:** Promise resolving to GPTResponse with trip bundles

##### `getEvents(city: string, startDate: string, endDate: string): Promise<EventsResponse>`

Gets entertainment events for a specific city and date range.

**Parameters:**
- `city`: City name
- `startDate`: Start date (YYYY-MM-DD format)
- `endDate`: End date (YYYY-MM-DD format)

**Returns:** Promise resolving to EventsResponse with events

##### `setApiKey(key: string): void`

Sets the OpenAI API key.

##### `updateUserData(userData: UserData): void`

Updates the user data for the service.

##### `isConfigured(): boolean`

Checks if the service is properly configured.

## Types

### UserData

```typescript
interface UserData {
  userPreferences: UserPreferences;
  integrations: {
    [integrationName: string]: IntegrationSummary;
  };
}
```

### UserPreferences

```typescript
interface UserPreferences {
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  duration?: {
    min: number;
    max: number;
  };
  preferredCountries?: string[];
  musicGenres?: string[];
  sportsInterests?: string[];
  groupSize?: number;
  // ... other preferences
}
```

### IntegrationSummary

```typescript
interface IntegrationSummary {
  summary: string;
}
```

### ServiceConfig

```typescript
interface ServiceConfig {
  apiKey?: string;
  mockMode?: boolean;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}
```

## Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key
- `MOCK_MODE`: Set to 'true' to enable mock mode

### Mock Mode

For development and testing, you can enable mock mode:

```typescript
const service = new TripBundlePromptService(userData, {
  mockMode: true
});
```

Mock mode provides realistic sample data without making API calls.

## Integration Examples

### Spotify Integration

```typescript
const userData: UserData = {
  userPreferences: {
    budget: { min: 800, max: 1500, currency: 'EUR' },
    duration: { min: 4, max: 6 }
  },
  integrations: {
    spotify: {
      summary: "Top genres: Rock, Alternative, Indie. Favorite artists: Arctic Monkeys, The Strokes, Radiohead. High energy, danceable music preferred."
    }
  }
};
```

### Multiple Integrations

```typescript
const userData: UserData = {
  userPreferences: {
    budget: { min: 1000, max: 2500, currency: 'EUR' },
    duration: { min: 5, max: 8 }
  },
  integrations: {
    spotify: {
      summary: "Love electronic music, especially techno and house"
    },
    strava: {
      summary: "Active runner, enjoys marathons and cycling events"
    },
    instagram: {
      summary: "Photography enthusiast, loves scenic locations and cultural sites"
    }
  }
};
```

## Error Handling

The service throws descriptive errors for common issues:

```typescript
try {
  const response = await service.generateTripBundles();
} catch (error) {
  if (error.message.includes('API key not configured')) {
    console.error('Please set your OpenAI API key');
  } else if (error.message.includes('OpenAI API error')) {
    console.error('API request failed:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## Support

For issues and questions, please open an issue on our GitHub repository.
