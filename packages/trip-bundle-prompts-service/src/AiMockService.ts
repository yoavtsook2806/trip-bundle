import { TripBundle, UserData } from './types';

/**
 * Mock AI service that simulates AI responses for trip bundle generation
 */

/**
 * Gets trip bundles from AI (mock implementation)
 * Randomly selects bundles but filters out existing ones
 */
export const getBundlesFromAi = async (
  userPrompt: string,
  existingBundles: TripBundle[] = []
): Promise<TripBundle[]> => {
  console.log('🤖 [MOCK] Getting bundles from AI...');
  console.log('📝 User prompt:', userPrompt);
  console.log('📦 Existing bundles to filter:', existingBundles.map(b => b.id));

  // Parse userData from prompt to get proper dates
  let userData: UserData | null = null;
  try {
    const promptData = JSON.parse(userPrompt);
    userData = promptData.userData;
  } catch (e) {
    console.warn('Could not parse user data from prompt, using default dates');
  }

  // All available mock bundles
  const allMockBundles: TripBundle[] = [
    {
      id: '1',
      title: 'Jazz & Gastronomy Weekend',
      description: 'Experience the best of local jazz scene combined with culinary adventures in the heart of the city.',
      city: 'New York',
      startDate: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
      endDate: userData ? new Date(userData.dateRange.endDate).toISOString().split('T')[0] : '2024-01-17',
      events: [
        {
          interestType: 'concerts',
          date: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
          time: '20:00',
          venue: 'Blue Note',
          cost: 45,
          currency: 'USD',
          bookingUrl: 'https://bluenote.net'
        },
        {
          interestType: 'culinary',
          date: userData ? new Date(userData.dateRange.startDate + 86400000).toISOString().split('T')[0] : '2024-01-16',
          time: '19:30',
          venue: 'Le Bernardin',
          cost: 180,
          currency: 'USD',
          bookingUrl: 'https://lebernardiny.com'
        }
      ],
      subEvents: [
        {
          interestType: 'localCulture',
          date: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
          time: '14:00',
          venue: 'Central Park',
          cost: 0,
          currency: 'USD'
        }
      ]
    },
    {
      id: '2',
      title: 'Art & Sports Fusion',
      description: 'Blend contemporary art exhibitions with thrilling sports events for an unforgettable experience.',
      city: 'Los Angeles',
      startDate: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
      endDate: userData ? new Date(userData.dateRange.endDate).toISOString().split('T')[0] : '2024-01-17',
      events: [
        {
          interestType: 'artDesign',
          date: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
          time: '11:00',
          venue: 'LACMA',
          cost: 25,
          currency: 'USD',
          bookingUrl: 'https://lacma.org'
        },
        {
          interestType: 'sports',
          date: userData ? new Date(userData.dateRange.startDate + 86400000).toISOString().split('T')[0] : '2024-01-16',
          time: '19:00',
          venue: 'Staples Center',
          cost: 120,
          currency: 'USD',
          bookingUrl: 'https://staplescenter.com'
        }
      ],
      subEvents: [
        {
          interestType: 'culinary',
          date: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
          time: '18:00',
          venue: 'Grand Central Market',
          cost: 30,
          currency: 'USD'
        }
      ]
    },
    {
      id: '3',
      title: 'Cultural Heritage Tour',
      description: 'Dive deep into local traditions, museums, and historical landmarks that define the city.',
      city: 'San Francisco',
      startDate: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
      endDate: userData ? new Date(userData.dateRange.endDate).toISOString().split('T')[0] : '2024-01-17',
      events: [
        {
          interestType: 'localCulture',
          date: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
          time: '10:00',
          venue: 'Alcatraz Island',
          cost: 40,
          currency: 'USD',
          bookingUrl: 'https://alcatrazcruises.com'
        },
        {
          interestType: 'localCulture',
          date: userData ? new Date(userData.dateRange.startDate + 86400000).toISOString().split('T')[0] : '2024-01-16',
          time: '13:00',
          venue: 'Chinatown',
          cost: 15,
          currency: 'USD'
        }
      ],
      subEvents: [
        {
          interestType: 'culinary',
          date: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
          time: '12:00',
          venue: 'Ferry Building Marketplace',
          cost: 25,
          currency: 'USD'
        }
      ]
    },
    {
      id: '4',
      title: 'Music & Food Festival',
      description: 'A perfect combination of live music performances and gourmet food experiences.',
      city: 'Austin',
      startDate: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
      endDate: userData ? new Date(userData.dateRange.endDate).toISOString().split('T')[0] : '2024-01-17',
      events: [
        {
          interestType: 'concerts',
          date: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
          time: '21:00',
          venue: 'The Continental Club',
          cost: 35,
          currency: 'USD',
          bookingUrl: 'https://continentalclub.com'
        },
        {
          interestType: 'culinary',
          date: userData ? new Date(userData.dateRange.startDate + 86400000).toISOString().split('T')[0] : '2024-01-16',
          time: '17:00',
          venue: 'Franklin Barbecue',
          cost: 40,
          currency: 'USD'
        }
      ],
      subEvents: [
        {
          interestType: 'localCulture',
          date: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
          time: '15:00',
          venue: 'South by Southwest',
          cost: 50,
          currency: 'USD'
        }
      ]
    },
    {
      id: '5',
      title: 'Sports & Nightlife Adventure',
      description: 'Experience the thrill of live sports followed by the vibrant nightlife scene.',
      city: 'Miami',
      startDate: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
      endDate: userData ? new Date(userData.dateRange.endDate).toISOString().split('T')[0] : '2024-01-17',
      events: [
        {
          interestType: 'sports',
          date: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
          time: '20:00',
          venue: 'American Airlines Arena',
          cost: 85,
          currency: 'USD',
          bookingUrl: 'https://aaarena.com'
        },
        {
          interestType: 'concerts',
          date: userData ? new Date(userData.dateRange.startDate + 86400000).toISOString().split('T')[0] : '2024-01-16',
          time: '23:00',
          venue: 'LIV Nightclub',
          cost: 60,
          currency: 'USD'
        }
      ],
      subEvents: [
        {
          interestType: 'culinary',
          date: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
          time: '19:00',
          venue: 'Joe\'s Stone Crab',
          cost: 95,
          currency: 'USD'
        }
      ]
    },
    {
      id: '6',
      title: 'Adventure & Wellness Retreat',
      description: 'Combine outdoor adventures with wellness activities for the perfect balance of excitement and relaxation.',
      city: 'Denver',
      startDate: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
      endDate: userData ? new Date(userData.dateRange.endDate).toISOString().split('T')[0] : '2024-01-17',
      events: [
        {
          interestType: 'sports',
          date: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
          time: '08:00',
          venue: 'Rocky Mountain National Park',
          cost: 75,
          currency: 'USD',
          bookingUrl: 'https://nps.gov'
        },
        {
          interestType: 'localCulture',
          date: userData ? new Date(userData.dateRange.startDate + 86400000).toISOString().split('T')[0] : '2024-01-16',
          time: '15:00',
          venue: 'Red Rocks Amphitheatre',
          cost: 25,
          currency: 'USD'
        }
      ],
      subEvents: [
        {
          interestType: 'culinary',
          date: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
          time: '18:00',
          venue: 'Farm to Table Restaurant',
          cost: 65,
          currency: 'USD'
        }
      ]
    },
    {
      id: '7',
      title: 'Tech & Innovation Experience',
      description: 'Explore cutting-edge technology centers and innovative cultural spaces.',
      city: 'Seattle',
      startDate: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
      endDate: userData ? new Date(userData.dateRange.endDate).toISOString().split('T')[0] : '2024-01-17',
      events: [
        {
          interestType: 'localCulture',
          date: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
          time: '10:00',
          venue: 'Museum of Flight',
          cost: 30,
          currency: 'USD',
          bookingUrl: 'https://museumofflight.org'
        },
        {
          interestType: 'artDesign',
          date: userData ? new Date(userData.dateRange.startDate + 86400000).toISOString().split('T')[0] : '2024-01-16',
          time: '14:00',
          venue: 'Chihuly Garden and Glass',
          cost: 35,
          currency: 'USD'
        }
      ],
      subEvents: [
        {
          interestType: 'culinary',
          date: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
          time: '17:00',
          venue: 'Pike Place Market',
          cost: 40,
          currency: 'USD'
        }
      ]
    },
    {
      id: '8',
      title: 'Historic & Musical Journey',
      description: 'Discover the rich history and vibrant music scene of the South.',
      city: 'Nashville',
      startDate: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
      endDate: userData ? new Date(userData.dateRange.endDate).toISOString().split('T')[0] : '2024-01-17',
      events: [
        {
          interestType: 'concerts',
          date: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
          time: '20:00',
          venue: 'Grand Ole Opry',
          cost: 55,
          currency: 'USD',
          bookingUrl: 'https://opry.com'
        },
        {
          interestType: 'localCulture',
          date: userData ? new Date(userData.dateRange.startDate + 86400000).toISOString().split('T')[0] : '2024-01-16',
          time: '11:00',
          venue: 'Country Music Hall of Fame',
          cost: 30,
          currency: 'USD'
        }
      ],
      subEvents: [
        {
          interestType: 'culinary',
          date: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
          time: '12:30',
          venue: 'Honky Tonk Central',
          cost: 25,
          currency: 'USD'
        }
      ]
    },
    {
      id: '9',
      title: 'Beach & Arts Festival',
      description: 'Enjoy beautiful beaches combined with world-class art galleries and cultural events.',
      city: 'San Diego',
      startDate: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
      endDate: userData ? new Date(userData.dateRange.endDate).toISOString().split('T')[0] : '2024-01-17',
      events: [
        {
          interestType: 'artDesign',
          date: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
          time: '10:00',
          venue: 'San Diego Museum of Art',
          cost: 20,
          currency: 'USD',
          bookingUrl: 'https://sdmart.org'
        },
        {
          interestType: 'localCulture',
          date: userData ? new Date(userData.dateRange.startDate + 86400000).toISOString().split('T')[0] : '2024-01-16',
          time: '15:00',
          venue: 'Balboa Park',
          cost: 0,
          currency: 'USD'
        }
      ],
      subEvents: [
        {
          interestType: 'culinary',
          date: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
          time: '19:00',
          venue: 'Gaslamp Quarter',
          cost: 50,
          currency: 'USD'
        }
      ]
    },
    {
      id: '10',
      title: 'Mountain Adventure & Craft Culture',
      description: 'Experience outdoor adventures paired with local craft breweries and artisan markets.',
      city: 'Portland',
      startDate: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
      endDate: userData ? new Date(userData.dateRange.endDate).toISOString().split('T')[0] : '2024-01-17',
      events: [
        {
          interestType: 'localCulture',
          date: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
          time: '09:00',
          venue: 'Mount Hood',
          cost: 45,
          currency: 'USD',
          bookingUrl: 'https://mthood.gov'
        },
        {
          interestType: 'artDesign',
          date: userData ? new Date(userData.dateRange.startDate + 86400000).toISOString().split('T')[0] : '2024-01-16',
          time: '13:00',
          venue: 'Portland Art Museum',
          cost: 25,
          currency: 'USD'
        }
      ],
      subEvents: [
        {
          interestType: 'culinary',
          date: userData ? new Date(userData.dateRange.startDate).toISOString().split('T')[0] : '2024-01-15',
          time: '16:00',
          venue: 'Food Truck Pod',
          cost: 20,
          currency: 'USD'
        }
      ]
    }
  ];

  // Filter out existing bundles
  const existingIds = existingBundles.map(b => b.id);
  const availableBundles = allMockBundles.filter(bundle => !existingIds.includes(bundle.id));

  console.log('🔍 Available bundles after filtering:', availableBundles.map(b => b.id));

  // If no available bundles, return empty array
  if (availableBundles.length === 0) {
    console.log('⚠️ No more bundles available after filtering');
    return [];
  }

  // Randomly select up to 5 bundles from available ones
  const shuffled = [...availableBundles].sort(() => Math.random() - 0.5);
  const selectedBundles = shuffled.slice(0, 5);

  console.log('✅ Selected bundles:', selectedBundles.map(b => `${b.id}: ${b.title}`));

  return selectedBundles;
};
