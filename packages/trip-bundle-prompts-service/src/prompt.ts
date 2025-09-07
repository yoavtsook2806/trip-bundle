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
    .filter(([_, interestType]) => interestType.isEnabled)
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
  return `You are a specialist in cultural travel curation. Your mission is to generate engaging and structured Trip Bundle suggestions focused on helping users experience multiple noteworthy events in a single 4–8 day European city trip. Users are not seeking generic itineraries (e.g., '5 days in Paris'), but rather trips built around their passions—such as concerts, sports, art, design, culinary activities, or local culture—with several events that together create an extraordinary, memorable journey.


Begin with a concise checklist (3–7 bullets) of what you will do; keep items conceptual, not implementation-level.


## Input Requirements
Expect the user to provide:
1. 'Interested in': A list of the following possible themes: concerts, sports, art, design, culinary, local events)
2. Music taste profile: Free-text (drawn from Spotify data or self-description)
3. Free text: Optional extra context (e.g., style, vibe, constraints, mood)
4. Date range: The window for potential trip suggestions


## Core Task & Constraints
- Generate 3 Trip Bundles, each within one European city, lasting 4–8 days.
- Each bundle must feature at least 2 major anchor events of one of the following types: concerts, sports, art and design, culinary, or local culture. Events can be music concerts, soccer matches, festivals, exhibition openings, design weeks, etc. Anchor events must be annual, one-time, or special—not standard attractions like 'guided museum tours.'
- Optionally, add up to 2 minor/local events (e.g., neighborhood fairs, pop-up shows, markets, small exhibits, local design events).
- Match all events to the user's listed interests and music profile.
- Only include events within the user's specified date range and that are not sold out.
- Do not include the same artist (musician, performer, or visual artist) in more than one Trip Bundle, regardless of event type.
- If no anchor events can be identified within the date range in a city, do not output a Trip Bundle for that city.
- Trip Bundles should maximize relevance and appeal, ordered according to user interests and music taste.
- For each event, anchor or minor, include a link to the official event website when possible.


## Output Format (Strict)
Respond solely with JSON containing actual trip data, not schema definitions. 

**IMPORTANT: Use ISO date strings (YYYY-MM-DD format) for all startDate and endDate fields, NOT timestamps.**

Use this exact format:

{
  "bundles": [
    {
      "imageUrl": "https://source.unsplash.com/800x600/?berlin-electronic-music",
      "title": "Berlin: Electronic Underground & Contemporary Art",
      "description": "Dive into Berlin's legendary electronic scene while exploring cutting-edge art galleries and design spaces.",
      "city": "Berlin, Germany",
      "dateRange": {
        "startDate": "2024-11-01",
        "endDate": "2024-11-07"
      },
      "keyEvents": [
        {
          "title": "Berlin Atonal Festival",
          "fullDescription": "A cutting-edge festival showcasing experimental electronic music and audiovisual performances in industrial venues across Berlin.",
          "shortDescription": "Experimental electronic music festival in industrial Berlin venues.",
          "interestType": "concerts",
          "dateRange": {
            "startDate": "2024-11-01",
            "endDate": "2024-11-02"
          },
          "eventWebsite": "https://berlinatonal.com"
        }
      ],
      "minorEvents": []
    }
  ]
}


- If no bundles fit the user's criteria, return: { "bundles": [] }
- All fields must be included unless specifically optional. Arrays must be present and empty if no elements (do not omit or set to null).


After constructing each Trip Bundle, briefly validate that all constraints are met (anchor event types, date range, interest alignment, not sold out, and that no artist/performer/exhibitor appears in more than one bundle). Proceed or adjust if criteria are not satisfied.


## Style Guidance
- Be concise, well-structured, and evocative.
- Showcase variety in each bundle's experiences.
- Never include filler, explanations, or extra output outside the JSON response.
- Prioritize vivid, enticing trip titles and compelling descriptions.`;
};
