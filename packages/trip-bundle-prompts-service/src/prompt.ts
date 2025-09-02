import { UserData, TripBundle } from './types';

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
    if (bundle.keyEvents && bundle.keyEvents.events) {
      bundle.keyEvents.events.forEach(event => {
        excludedEvents.push(`${event.title} (${event.venue})`);
      });
    }
    
    // Add minor events from existing bundles to excluded list
    if (bundle.minorEvents && bundle.minorEvents.events) {
      bundle.minorEvents.events.forEach(event => {
        excludedEvents.push(`${event.title} (${event.venue})`);
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

### Output Format (strict)

For each bundle, output in the following structure (no extra commentary, no additional text outside this format):

### Drop <number>: <Drop Title>

Short Description
<1–2 sentences, max 250 characters, highlighting why this trip is special>

Dates
<4–7 day window around anchor events>

Key Events (2–3)
1. <Event Title> — <1–2 sentence description>
Official link: <URL>
2. <Event Title> — <1–2 sentence description>
Official link: <URL>

Minor Events (optional)
- <Event Title> — <short description>
Official link: <URL>

### Style Guidance

* Be concise, structured, and inspiring.
* Focus on cultural richness and variety of experiences.
* Do not include filler text, explanations, or extra commentary outside the required output format.
* Ensure readability and engaging trip titles.`;
};
