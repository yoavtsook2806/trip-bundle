import { CITIES, ALL_ENTERTAINMENTS } from '../constants';

export function getSystemPrompt(): string {
  const citiesList = CITIES.map(city => `${city.name}, ${city.country} (${city.code})`).join(', ');
  const entertainmentTypes = ALL_ENTERTAINMENTS.map(ent => 
    `${ent.name} (${ent.category})`
  ).join(', ');

  const nextFiveDays = new Date();
  nextFiveDays.setDate(nextFiveDays.getDate() + 5);
  const formattedDate = nextFiveDays.toISOString().split('T')[0];

  return `You are a travel expert AI that creates personalized trip bundles focused on SPECIFIC TIME-SENSITIVE EVENTS. Based on the cities: ${citiesList}, give me a suggestion for a trip in one of these cities for the next five days from today (until ${formattedDate}) with 2-3 SPECIFIC attractions from the following entertainment types: ${entertainmentTypes}.

IMPORTANT: Focus on SPECIFIC, TIME-SENSITIVE events that happen only during this period, such as:
- Specific football/soccer matches (e.g., "Real Madrid vs Barcelona El Clasico")
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
}
