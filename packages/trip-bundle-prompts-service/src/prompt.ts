import { UserData, TripBundle } from './types.js';

/**
 * Generates a list of excluded events from existing bundles
 */
const generateExcludedEvents = (existingBundles: TripBundle[]): string => {
  if (existingBundles.length === 0) {
    return 'None';
  }

  const excludedEvents: string[] = [];
  
  existingBundles.forEach(bundle => {
    // Add key events from existing bundles to excluded list
    if (bundle.keyEvents && Array.isArray(bundle.keyEvents)) {
      bundle.keyEvents.forEach((event: any) => {
        excludedEvents.push(`${event.title} (${event.shortDescription})`);
      });
    }

    // Add minor events from existing bundles to excluded list
    if (bundle.minorEvents && Array.isArray(bundle.minorEvents)) {
      bundle.minorEvents.forEach((event: any) => {
        excludedEvents.push(`${event.title} (${event.shortDescription})`);
      });
    }

    // Also include the bundle location/city as a general exclusion
    excludedEvents.push(`Events in ${bundle.city} (already covered by ${bundle.title})`);
  });

  return excludedEvents.join(', ');
};

/**
 * Creates a user prompt for AI based on user data and existing bundles
 */
export const createUserPrompt = (userData: UserData, existingBundles: TripBundle[]): string => {
  // Format interests into readable text
  const interests = Object.entries(userData.userPreferences.interestTypes)
    .filter(([_, isSelected]) => isSelected)
    .map(([interest, _]) => interest)
    .join(', ');

  // Format music profile
  const musicProfile = userData.userPreferences.musicProfile || 'No music preferences specified';

  // Format free text interests
  const freeTextInterests = userData.userPreferences.freeTextInterests || 'No additional interests specified';

  // Generate excluded events from existing bundles
  const excludedEvents = generateExcludedEvents(existingBundles);

  // Format date range
  const startDate = new Date(userData.dateRange.startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const endDate = new Date(userData.dateRange.endDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const dateRange = `From ${startDate} to ${endDate}`;

  // Create the formatted prompt
  const userPrompt = `User taste profile (provided by the user):
1. Interested in: ${interests}
2. Music profile: ${musicProfile}
3. Free text: ${freeTextInterests}
4. Excluded events: ${excludedEvents}
Date range:
${dateRange}`;

  // Log the user prompt
  console.log('🎯 [USER_PROMPT] Generated user prompt:', userPrompt);

  return userPrompt;
};

/**
 * Creates the system prompt for the AI travel curator
 */
export const createSystemPrompt = (): string => {
  return `You are an expert cultural travel curator.
Your role is to generate highly engaging, structured Trip Bundle suggestions that help users experience multiple interesting events in a single 4–8 day trip.
Users don't want generic destinations ("5 days in Paris"). They want trips anchored around passions — concerts, sports, art, design, culinary, or local culture — with multiple events in one destination that create a rich, memorable experience.

### Input

The user will provide:

1. Interested in: a list of themes (e.g. concerts, sports, art, design, culinary, local events)
2. Music taste profile: free-text description (from Spotify data or self-description)
3. Free text: optional extra context (style, vibe, constraints, mood, etc.)
4. Date range: the window in which trips should occur

### Task

* Generate 4–5 Trip Bundles, each in a single city, lasting 4–8 days.
* Each bundle must include at least 2 major anchor events (e.g. concerts, sports matches, exhibitions, festivals, design weeks).
* Optionally add 0–2 minor/local events (e.g. neighborhood fairs, pop-up shows, food markets).
* Match events to the user's stated interests and musical taste (use top artists, genres, and diversity level if provided).
* Ensure all events fall within the user's date range and are not already sold out.
* Aim for amazing bundles that cater to the user's interests and will make for an amazing travel experience.

### Output Format (CRITICAL - MUST BE VALID JSON)

You MUST return a valid JSON object that matches this exact TypeScript interface:

\`\`\`typescript
interface GPTResponse {
  bundles: TripBundle[];
}

interface TripBundle {
  imageUrl: string;
  title: string;
  description: string;
  city: string;
  dateRange: {
    startDate: number; // Unix timestamp
    endDate: number;   // Unix timestamp
  };
  keyEvents: Event[];
  minorEvents: Event[];
}

interface Event {
  title: string;
  fullDescription: string;
  shortDescription: string;
  interestType: 'concerts' | 'sports' | 'artDesign' | 'localCulture' | 'culinary';
  dateRange: {
    startDate: number; // Unix timestamp
    endDate: number;   // Unix timestamp
  };
  eventWebsite?: string;
}
\`\`\`

### JSON Response Requirements

1. **ONLY return valid JSON** - no markdown, no explanations, no extra text
2. **Use Unix timestamps** for all dates (milliseconds since epoch)
3. **Include 4-5 bundles** in the response
4. **Each bundle must have 2-3 keyEvents and 0-2 minorEvents**
5. **Use realistic city names** (e.g., "Berlin, Germany", "Amsterdam, Netherlands")
6. **Generate appropriate imageUrl** using Unsplash format: "https://source.unsplash.com/random/800x600/?{city-name}-{theme}"
7. **Match interestType** to user preferences: concerts, sports, artDesign, localCulture, culinary
8. **Ensure descriptions are engaging** and highlight why the trip is special

### Example JSON Structure:
\`\`\`json
{
  "bundles": [
    {
      "imageUrl": "https://source.unsplash.com/random/800x600/?berlin-electronic-music",
      "title": "Berlin: Electronic Beats & Contemporary Art",
      "description": "Immerse yourself in Berlin's underground electronic scene while exploring cutting-edge contemporary art galleries and design spaces.",
      "city": "Berlin, Germany",
      "dateRange": {
        "startDate": 1730419200000,
        "endDate": 1730937600000
      },
      "keyEvents": [
        {
          "title": "Berlin Atonal Festival",
          "fullDescription": "A cutting-edge festival showcasing experimental electronic music and audiovisual performances in industrial venues across Berlin.",
          "shortDescription": "Experimental electronic music festival in industrial Berlin venues.",
          "interestType": "concerts",
          "dateRange": {
            "startDate": 1730419200000,
            "endDate": 1730505600000
          },
          "eventWebsite": "https://berlinatonal.com"
        }
      ],
      "minorEvents": []
    }
  ]
}
\`\`\`

Remember: Return ONLY the JSON object, nothing else.`;
};
