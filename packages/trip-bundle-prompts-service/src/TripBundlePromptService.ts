import { UserData, GPTResponse, TripBundle, Event, GenerateTripBundlesFunction } from './types';

/**
 * Generates trip bundles - either mock data or real API call
 */
export const generateTripBundles: GenerateTripBundlesFunction = async (
  userData: UserData,
  isMock: boolean = true
): Promise<GPTResponse> => {
  console.log('🎯 Generating trip bundles for:', userData);
  console.log('📍 Mode:', isMock ? 'Mock' : 'Real API');
  
  if (isMock) {
    // Simulate API delay for mock mode
    await new Promise(resolve => setTimeout(resolve, 5000));
    return generateMockBundles(userData);
  } else {
    // Real API implementation will go here
    return generateRealBundles(userData);
  }
};

/**
 * Generates mock trip bundles with realistic data
 */
const generateMockBundles = async (userData: UserData): Promise<GPTResponse> => {
  
  // Generate 5 mock bundles
  const mockBundles: TripBundle[] = [
    {
      id: '1',
      title: 'Jazz & Gastronomy Weekend',
      description: 'Experience the best of local jazz scene combined with culinary adventures in the heart of the city.',
      city: 'New York',
      startDate: new Date(userData.dateRange.startDate).toISOString().split('T')[0],
      endDate: new Date(userData.dateRange.endDate).toISOString().split('T')[0],
      events: [
        {
          interestType: 'concerts',
          date: new Date(userData.dateRange.startDate).toISOString().split('T')[0],
          time: '20:00',
          venue: 'Blue Note',
          cost: 45,
          currency: 'USD',
          bookingUrl: 'https://bluenote.net'
        },
        {
          interestType: 'culinary',
          date: new Date(userData.dateRange.startDate + 86400000).toISOString().split('T')[0],
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
          date: new Date(userData.dateRange.startDate + 43200000).toISOString().split('T')[0],
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
      startDate: new Date(userData.dateRange.startDate).toISOString().split('T')[0],
      endDate: new Date(userData.dateRange.endDate).toISOString().split('T')[0],
      events: [
        {
          interestType: 'artDesign',
          date: new Date(userData.dateRange.startDate).toISOString().split('T')[0],
          time: '11:00',
          venue: 'LACMA',
          cost: 25,
          currency: 'USD',
          bookingUrl: 'https://lacma.org'
        },
        {
          interestType: 'sports',
          date: new Date(userData.dateRange.startDate + 86400000).toISOString().split('T')[0],
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
          date: new Date(userData.dateRange.startDate + 43200000).toISOString().split('T')[0],
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
      startDate: new Date(userData.dateRange.startDate).toISOString().split('T')[0],
      endDate: new Date(userData.dateRange.endDate).toISOString().split('T')[0],
      events: [
        {
          interestType: 'localCulture',
          date: new Date(userData.dateRange.startDate).toISOString().split('T')[0],
          time: '10:00',
          venue: 'Alcatraz Island',
          cost: 40,
          currency: 'USD',
          bookingUrl: 'https://alcatrazcruises.com'
        },
        {
          interestType: 'localCulture',
          date: new Date(userData.dateRange.startDate + 86400000).toISOString().split('T')[0],
          time: '13:00',
          venue: 'Chinatown',
          cost: 15,
          currency: 'USD'
        }
      ],
      subEvents: [
        {
          interestType: 'culinary',
          date: new Date(userData.dateRange.startDate + 43200000).toISOString().split('T')[0],
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
      startDate: new Date(userData.dateRange.startDate).toISOString().split('T')[0],
      endDate: new Date(userData.dateRange.endDate).toISOString().split('T')[0],
      events: [
        {
          interestType: 'concerts',
          date: new Date(userData.dateRange.startDate).toISOString().split('T')[0],
          time: '21:00',
          venue: 'The Continental Club',
          cost: 35,
          currency: 'USD',
          bookingUrl: 'https://continentalclub.com'
        },
        {
          interestType: 'culinary',
          date: new Date(userData.dateRange.startDate + 86400000).toISOString().split('T')[0],
          time: '17:00',
          venue: 'Franklin Barbecue',
          cost: 40,
          currency: 'USD'
        }
      ],
      subEvents: [
        {
          interestType: 'localCulture',
          date: new Date(userData.dateRange.startDate + 43200000).toISOString().split('T')[0],
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
      startDate: new Date(userData.dateRange.startDate).toISOString().split('T')[0],
      endDate: new Date(userData.dateRange.endDate).toISOString().split('T')[0],
      events: [
        {
          interestType: 'sports',
          date: new Date(userData.dateRange.startDate).toISOString().split('T')[0],
          time: '20:00',
          venue: 'American Airlines Arena',
          cost: 85,
          currency: 'USD',
          bookingUrl: 'https://aaarena.com'
        },
        {
          interestType: 'concerts',
          date: new Date(userData.dateRange.startDate + 86400000).toISOString().split('T')[0],
          time: '23:00',
          venue: 'LIV Nightclub',
          cost: 60,
          currency: 'USD'
        }
      ],
      subEvents: [
        {
          interestType: 'culinary',
          date: new Date(userData.dateRange.startDate + 43200000).toISOString().split('T')[0],
          time: '19:00',
          venue: 'Joe\'s Stone Crab',
          cost: 95,
          currency: 'USD'
        }
      ]
    }
  ];

  console.log(`✅ Generated ${mockBundles.length} mock trip bundles`);
  
  return {
    bundles: mockBundles
  };
};

/**
 * Generates real trip bundles using OpenAI API
 */
const generateRealBundles = async (userData: UserData): Promise<GPTResponse> => {
  const apiKey = (globalThis as any).VITE_OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  console.log('🤖 Calling OpenAI API for real trip bundles...');
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a travel expert. Generate trip bundles based on user preferences in JSON format.'
          },
          {
            role: 'user',
            content: `Generate 5 trip bundles for these preferences: ${JSON.stringify(userData)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const result: any = await response.json();
    
    if (!result.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI API');
    }

    let parsedContent: any;
    try {
      parsedContent = JSON.parse(result.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse GPT response as JSON:', result.choices[0].message.content);
      throw new Error('Invalid JSON response from GPT');
    }

    const gptResponse: GPTResponse = {
      bundles: parsedContent.bundles || []
    };

    console.log(`✅ Successfully generated ${gptResponse.bundles.length} real trip bundles`);
    return gptResponse;

  } catch (error) {
    console.error('❌ Error generating real trip bundles:', error);
    throw error;
  }
};

// For backward compatibility, also export as default
export default generateTripBundles;
