// =============================================================================
// PROMPTS MODULE FOR TRIP BUNDLE SERVICE
// =============================================================================

import { ALL_ENTERTAINMENTS } from './constants';
import { UserData } from './types';

/**
 * Generates the system prompt for GPT
 * This is constant and doesn't depend on user data
 */
export function getSystemPrompt(cities: string[]): string {
  const citiesList = cities.join(', ');
  const entertainmentTypes = ALL_ENTERTAINMENTS.map(ent => 
    `${ent.name} (${ent.category})`
  ).join(', ');

  const nextFiveDays = new Date();
  nextFiveDays.setDate(nextFiveDays.getDate() + 5);
  const formattedDate = nextFiveDays.toISOString().split('T')[0];

  return `You are a travel expert AI that creates personalized trip bundles focused on SPECIFIC TIME-SENSITIVE EVENTS. Based on the cities: ${citiesList}, give me a suggestion for a trip in one of these cities for the next five days from today (until ${formattedDate}) with 2-3 SPECIFIC attractions from the following entertainment types: ${entertainmentTypes}.

IMPORTANT: Focus on SPECIFIC, TIME-SENSITIVE events that happen only during this period, such as:
- Specific footballadd/soccer matches (e.g., "Real Madrid vs Barcelona El Clasico")
- Specific concerts by named artists (e.g., "Coldplay World Tour 2024")
- Limited-time exhibitions (e.g., "Van Gogh Immersive Experience - Final Week")
- Special festivals or events (e.g., "Oktoberfest 2024", "Edinburgh Fringe Festival")
- Theater premieres or limited runs
- Seasonal events or markets

AVOID generic attractions like "visit the Louvre" or "city walking tour" - focus on unique, dated events that create urgency.

You MUST respond with a valid JSON object only, no additional text. Use this exact format:
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
      "events": [
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
          "cost": 150,
          "currency": "USD"
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
        "cost": 400,
        "currency": "USD"
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
}

/**
 * Generates the user prompt based on user data
 * Converts UserData format to a prompt string
 */
export function getUserPrompt(userData: UserData, cities: string[]): string {
  const userPreferencesPrompt = generateUserPreferencesPrompt(userData.userPreferences, cities);
  const dateRangePrompt = generateDateRangePrompt(userData.dateRange);

  return userPreferencesPrompt + dateRangePrompt;
}

/**
 * Generates user preferences section of the prompt
 */
function generateUserPreferencesPrompt(prefs: UserData['userPreferences'], cities: string[]): string {
  const promptParts: string[] = [];
  
  // Interest types
  const enabledInterests = [];
  if (prefs.interestTypes.concerts.isEnabled) enabledInterests.push('concerts');
  if (prefs.interestTypes.sports.isEnabled) enabledInterests.push('sports');
  if (prefs.interestTypes.artDesign.isEnabled) enabledInterests.push('art & design');
  if (prefs.interestTypes.localCulture.isEnabled) enabledInterests.push('local culture');
  if (prefs.interestTypes.culinary.isEnabled) enabledInterests.push('culinary experiences');
  
  if (enabledInterests.length > 0) {
    promptParts.push(`Interested in: ${enabledInterests.join(', ')}`);
  }
  
  // Music profile
  if (prefs.musicProfile && prefs.musicProfile.trim()) {
    promptParts.push(`Music taste: ${prefs.musicProfile}`);
  }
  
  // Free text interests
  if (prefs.freeTextInterests && prefs.freeTextInterests.trim()) {
    promptParts.push(`Additional interests: ${prefs.freeTextInterests}`);
  }
  
  return promptParts.length > 0 
    ? `User preferences: ${promptParts.join('. ')}.`
    : '';
}

/**
 * Generates date range section of the prompt
 */
function generateDateRangePrompt(dateRange: UserData['dateRange']): string {
  if (dateRange.startDate && dateRange.endDate) {
    const startDate = new Date(dateRange.startDate).toISOString().split('T')[0];
    const endDate = new Date(dateRange.endDate).toISOString().split('T')[0];
    return `\n\nTravel dates: ${startDate} to ${endDate}`;
  }
  return '';
}
