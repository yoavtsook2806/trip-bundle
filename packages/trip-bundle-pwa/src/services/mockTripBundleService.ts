// =============================================================================
// MOCK TRIP BUNDLE SERVICE - Simple Function for Development
// =============================================================================

import { 
  type UserData,
  type GPTResponse,
  type GenerationOptions,
  type GenerateTripBundlesFunction
} from 'trip-bundle-prompts-service';
import { PromptsTokenStorage } from '../storage/userPreferences';

/**
 * Mock function that provides sample data for development
 * Implements the same interface as the real generateTripBundles function
 */
export const mockGenerateTripBundles: GenerateTripBundlesFunction = async (
  userData: UserData,
  _cities: string[],
  options: GenerationOptions = {}
): Promise<GPTResponse> => {
  const { page = 1, limit = 5 } = options;

  console.log(`🎭 Using mock data (VITE_MOCK=true) - Page ${page}, Limit ${limit}`);
  console.log(`👤 User preferences:`, userData.userPreferences);
  console.log(`📅 Date range:`, userData.dateRange);
  
  // Increment API call counter (only for page 1 - new searches)
  if (page === 1) {
    const { allowed, remaining } = await PromptsTokenStorage.incrementCall();
    console.log(`📊 API call incremented: ${10 - remaining}/10 calls used`);
    
    if (!allowed) {
      throw new Error('Daily API limit reached (10/10 calls). Please try again tomorrow.');
    }
  }
  
  // Simulate API delay (5 seconds for thinking screen)
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Return simple mock data
  const mockBundles = [
    {
      id: 'paris-jazz-2024',
      title: 'Paris Jazz Festival Weekend',
      description: 'Experience world-class jazz in the City of Light with premium venue access.',
      city: 'Paris',
      country: 'France',
      startDate: '2024-10-15',
      endDate: '2024-10-17',
      duration: 3,
      totalCost: 850,
      currency: 'EUR',
      imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=600&fit=crop',
      events: [
        {
          id: 'paris-jazz-main',
          title: 'Paris Jazz Festival - Main Stage',
          description: 'Opening night featuring international jazz legends',
          date: '2024-10-15',
          time: '20:00',
          venue: 'Le Duc des Lombards',
          cost: 85,
          currency: 'EUR'
        }
      ],
      subEvents: [
        {
          id: 'paris-food-tour',
          title: 'Paris Food Tour',
          description: 'Discover French culinary delights',
          date: '2024-10-16',
          time: '10:00',
          venue: 'Paris Food District',
          cost: 45,
          currency: 'EUR'
        },
        {
          id: 'louvre-visit',
          title: 'Louvre Museum Visit',
          description: 'Explore world-famous art collections',
          date: '2024-10-17',
          time: '14:00',
          venue: 'Louvre Museum',
          cost: 20,
          currency: 'EUR'
        }
      ],
      accommodation: {
        name: 'Hotel des Grands Boulevards',
        type: 'hotel',
        rating: 4.5,
        pricePerNight: 180,
        location: 'Grands Boulevards',
        amenities: ['Free WiFi', 'Breakfast', 'Jazz Bar']
      },
      transportation: {
        type: 'flight',
        cost: 200,
        currency: 'EUR',
        details: 'Round-trip flight to Paris'
      },
      recommendations: [
        'Book jazz venues in advance',
        'Try local French cuisine',
        'Visit during evening for best atmosphere'
      ],
      confidence: 0.9
    },
    {
      id: 'tokyo-culture-2024',
      title: 'Tokyo Cultural Immersion',
      description: 'Experience authentic Japanese culture and traditions.',
      city: 'Tokyo',
      country: 'Japan',
      startDate: '2024-10-10',
      endDate: '2024-10-14',
      duration: 5,
      totalCost: 1200,
      currency: 'EUR',
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
      events: [
        {
          id: 'sumo-tournament',
          title: 'Grand Sumo Tournament',
          description: 'Witness the ancient sport of sumo wrestling',
          date: '2024-10-12',
          time: '16:00',
          venue: 'Ryogoku Kokugikan',
          cost: 120,
          currency: 'EUR'
        }
      ],
      subEvents: [
        {
          id: 'tokyo-food-tour',
          title: 'Tokyo Food Tour',
          description: 'Discover authentic Japanese cuisine',
          date: '2024-10-11',
          time: '10:00',
          venue: 'Tokyo Food District',
          cost: 45,
          currency: 'EUR'
        },
        {
          id: 'temple-visit',
          title: 'Traditional Temple Visit',
          description: 'Experience spiritual Japanese culture',
          date: '2024-10-13',
          time: '14:00',
          venue: 'Senso-ji Temple',
          cost: 0,
          currency: 'EUR'
        }
      ],
      accommodation: {
        name: 'Tokyo Grand Hotel',
        type: 'hotel',
        rating: 4.3,
        pricePerNight: 120,
        location: 'Shibuya',
        amenities: ['Free WiFi', 'Traditional Bath', 'City View']
      },
      transportation: {
        type: 'flight',
        cost: 800,
        currency: 'EUR',
        details: 'Round-trip flight to Tokyo'
      },
      recommendations: [
        'Learn basic Japanese phrases',
        'Respect local customs',
        'Try authentic sushi and ramen'
      ],
      confidence: 0.85
    }
  ];

  // Simple pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const bundles = mockBundles.slice(startIndex, endIndex);

  // Transform mock bundles to match TripBundle interface
  const transformedBundles = bundles.map(bundle => ({
    ...bundle,
    accommodation: {
      ...bundle.accommodation,
      type: bundle.accommodation.type as 'hotel' | 'hostel' | 'apartment' | 'resort'
    },
    transportation: {
      ...bundle.transportation,
      type: bundle.transportation.type as 'flight' | 'train' | 'bus' | 'car'
    },
    totalCost: {
      amount: bundle.totalCost as number,
      currency: bundle.currency as string,
      breakdown: {
        accommodation: Math.round((bundle.totalCost as number) * 0.4),
        entertainment: Math.round((bundle.totalCost as number) * 0.3),
        food: Math.round((bundle.totalCost as number) * 0.2),
        transport: Math.round((bundle.totalCost as number) * 0.1)
      }
    },
    events: bundle.events.map((event: any) => ({
      entertainment: {
        id: event.id,
        name: event.title,
        category: 'music' as const,
        subcategory: 'concert',
        description: event.description,
        averageDuration: 3,
        averageCost: { min: event.cost * 0.8, max: event.cost * 1.2, currency: event.currency },
        seasonality: 'year-round' as const,
        popularCountries: ['FR']
      },
      date: event.date,
      time: event.time,
      venue: event.venue,
      cost: event.cost,
      currency: event.currency
    })),
    subEvents: bundle.subEvents?.map((event: any) => ({
      entertainment: {
        id: event.id,
        name: event.title,
        category: 'culture' as const,
        subcategory: 'activity',
        description: event.description,
        averageDuration: 2,
        averageCost: { min: event.cost * 0.8, max: event.cost * 1.2, currency: event.currency },
        seasonality: 'year-round' as const,
        popularCountries: ['FR']
      },
      date: event.date,
      time: event.time,
      venue: event.venue,
      cost: event.cost,
      currency: event.currency
    })) || [],
    recommendations: {
      restaurants: ['Le Comptoir du Relais', 'L\'Ami Jean'],
      localTips: Array.isArray(bundle.recommendations) ? bundle.recommendations : ['Book in advance', 'Try local specialties'],
      weatherInfo: 'Mild autumn weather expected',
      packingList: ['Light jacket', 'Comfortable walking shoes', 'Camera']
    },
    confidence: Math.round((bundle.confidence as number) * 100), // Convert 0.9 to 90
    // Remove the old currency field
    currency: undefined
  }));

  return {
    bundles: transformedBundles,
    reasoning: `Based on your preferences, I found ${transformedBundles.length} amazing trip bundles tailored to your interests.`,
    alternatives: ['Consider extending your stay', 'Look into similar destinations'],
    totalResults: mockBundles.length,
    pagination: {
      page,
      limit,
      total: mockBundles.length,
      hasMore: endIndex < mockBundles.length
    }
  };
};

export default mockGenerateTripBundles;
