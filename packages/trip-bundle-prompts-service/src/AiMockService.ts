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

  // Helper function to generate timestamps based on user dates or defaults
  const getStartTimestamp = () => {
    if (userData) return userData.dateRange.startDate;
    return Date.now() + (7 * 24 * 60 * 60 * 1000); // 1 week from now
  };

  const getEndTimestamp = (daysLater: number = 3) => {
    const start = getStartTimestamp();
    return start + (daysLater * 24 * 60 * 60 * 1000);
  };

  // All available mock bundles with popular, specific events
  const allMockBundles: TripBundle[] = [
    {
      id: '1',
      title: 'Coldplay London Experience',
      description: 'See Coldplay live at Wembley Stadium plus explore London\'s music scene and British culture.',
      city: 'London',
      imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
      startDate: getStartTimestamp(),
      endDate: getEndTimestamp(4),
      keyEvents: {
        title: 'Main Events',
        events: [
          {
            title: 'Coldplay - Music of the Spheres World Tour',
            interestType: 'concerts',
            date: getStartTimestamp() + (24 * 60 * 60 * 1000), // Day 2
            venue: 'Wembley Stadium',
            bookingUrl: 'https://www.ticketmaster.co.uk/coldplay-tickets/artist/806'
          },
          {
            title: 'London Symphony Orchestra at Royal Albert Hall',
            interestType: 'concerts',
            date: getStartTimestamp() + (3 * 24 * 60 * 60 * 1000), // Day 4
            venue: 'Royal Albert Hall',
            bookingUrl: 'https://www.royalalberthall.com/'
          }
        ]
      },
      minorEvents: {
        title: 'Additional Experiences',
        events: [
          {
            title: 'Abbey Road Studios Tour',
            interestType: 'localCulture',
            date: getStartTimestamp(),
            venue: 'Abbey Road Studios',
            bookingUrl: 'https://www.abbeyroad.com/visit'
          },
          {
            title: 'British Museum Visit',
            interestType: 'artDesign',
            date: getStartTimestamp() + (2 * 24 * 60 * 60 * 1000), // Day 3
            venue: 'British Museum',
            bookingUrl: 'https://www.britishmuseum.org/'
          }
        ]
      }
    },
    {
      id: '2',
      title: 'Manchester Derby Weekend',
      description: 'Experience the legendary Manchester City vs Liverpool match plus explore Manchester\'s football culture.',
      city: 'Manchester',
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
      startDate: getStartTimestamp(),
      endDate: getEndTimestamp(3),
      keyEvents: {
        title: 'Main Events',
        events: [
          {
            title: 'Manchester City vs Liverpool FC',
            interestType: 'sports',
            date: getStartTimestamp() + (24 * 60 * 60 * 1000), // Day 2
            venue: 'Etihad Stadium',
            bookingUrl: 'https://www.mancity.com/tickets'
          },
          {
            title: 'Manchester United Stadium Tour',
            interestType: 'sports',
            date: getStartTimestamp() + (2 * 24 * 60 * 60 * 1000), // Day 3
            venue: 'Old Trafford',
            bookingUrl: 'https://www.manutd.com/en/visit-old-trafford'
          }
        ]
      },
      minorEvents: {
        title: 'Additional Experiences',
        events: [
          {
            title: 'National Football Museum',
            interestType: 'localCulture',
            date: getStartTimestamp(),
            venue: 'National Football Museum',
            bookingUrl: 'https://www.nationalfootballmuseum.com/'
          },
          {
            title: 'Traditional Manchester Pub Tour',
            interestType: 'culinary',
            date: getStartTimestamp() + (2 * 24 * 60 * 60 * 1000), // Day 3
            venue: 'Various Historic Pubs',
            bookingUrl: 'https://www.manchesterpubtours.com/'
          }
        ]
      }
    },
    {
      id: '3',
      title: 'Taylor Swift Eras Tour Paris',
      description: 'Experience Taylor Swift\'s Eras Tour in Paris plus explore the city\'s romantic culture and cuisine.',
      city: 'Paris',
      imageUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&q=80',
      startDate: getStartTimestamp(),
      endDate: getEndTimestamp(4),
      keyEvents: {
        title: 'Main Events',
        events: [
          {
            title: 'Taylor Swift - The Eras Tour',
            interestType: 'concerts',
            date: getStartTimestamp() + (2 * 24 * 60 * 60 * 1000), // Day 3
            venue: 'Paris La Défense Arena',
            bookingUrl: 'https://www.taylorswift.com/tour'
          },
          {
            title: 'Opéra de Paris - La Traviata',
            interestType: 'artDesign',
            date: getStartTimestamp() + (3 * 24 * 60 * 60 * 1000), // Day 4
            venue: 'Palais Garnier',
            bookingUrl: 'https://www.operadeparis.fr/'
          },
          {
            title: 'French Wine Tasting Experience',
            interestType: 'culinary',
            date: getStartTimestamp() + (24 * 60 * 60 * 1000), // Day 2
            venue: 'Les Caves du Louvre',
            bookingUrl: 'https://www.lescavesdulouvre.com/'
          }
        ]
      },
      minorEvents: {
        title: 'Additional Experiences',
        events: [
          {
            title: 'Louvre Museum Private Tour',
            interestType: 'artDesign',
            date: getStartTimestamp(),
            venue: 'Louvre Museum',
            bookingUrl: 'https://www.louvre.fr/en'
          },
          {
            title: 'Seine River Dinner Cruise',
            interestType: 'culinary',
            date: getStartTimestamp() + (24 * 60 * 60 * 1000), // Day 2
            venue: 'Seine River',
            bookingUrl: 'https://www.bateauxparisiens.com/'
          },
          {
            title: 'Montmartre Art District Walk',
            interestType: 'localCulture',
            date: getStartTimestamp() + (3 * 24 * 60 * 60 * 1000), // Day 4
            venue: 'Montmartre District',
            bookingUrl: 'https://www.paris-walks.com/'
          }
        ]
      }
    },
    {
      id: '4',
      title: 'Super Bowl Las Vegas Experience',
      description: 'Attend the Super Bowl in Las Vegas plus experience the city\'s entertainment and culinary scene.',
      city: 'Las Vegas',
      imageUrl: 'https://images.unsplash.com/photo-1605063133739-2e6b5c7e1d4b?w=800&q=80',
      startDate: getStartTimestamp(),
      endDate: getEndTimestamp(4),
      keyEvents: {
        title: 'Main Events',
        events: [
          {
            title: 'Super Bowl LVIII',
            interestType: 'sports',
            date: getStartTimestamp() + (2 * 24 * 60 * 60 * 1000), // Day 3
            venue: 'Allegiant Stadium',
            bookingUrl: 'https://www.nfl.com/super-bowl/tickets'
          },
          {
            title: 'VIP Casino Experience at Bellagio',
            interestType: 'localCulture',
            date: getStartTimestamp() + (24 * 60 * 60 * 1000), // Day 2
            venue: 'Bellagio Casino',
            bookingUrl: 'https://www.bellagio.com/'
          }
        ]
      },
      minorEvents: {
        title: 'Additional Experiences',
        events: [
          {
            title: 'Cirque du Soleil Show',
            interestType: 'artDesign',
            date: getStartTimestamp(),
            venue: 'Bellagio Theatre',
            bookingUrl: 'https://www.cirquedusoleil.com/las-vegas'
          },
          {
            title: 'Gordon Ramsay Hell\'s Kitchen Dinner',
            interestType: 'culinary',
            date: getStartTimestamp() + (24 * 60 * 60 * 1000), // Day 2
            venue: 'Hell\'s Kitchen Restaurant',
            bookingUrl: 'https://www.gordonramsayrestaurants.com/hells-kitchen-las-vegas/'
          }
        ]
      }
    },
    {
      id: '5',
      title: 'Barcelona El Clásico Weekend',
      description: 'Watch Real Madrid vs Barcelona at Camp Nou plus explore Catalonian culture and Gaudí\'s architecture.',
      city: 'Barcelona',
      imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80',
      startDate: getStartTimestamp(),
      endDate: getEndTimestamp(3),
      keyEvents: {
        title: 'Main Events',
        events: [
          {
            title: 'El Clásico: FC Barcelona vs Real Madrid',
            interestType: 'sports',
            date: getStartTimestamp() + (24 * 60 * 60 * 1000), // Day 2
            venue: 'Camp Nou',
            bookingUrl: 'https://www.fcbarcelona.com/en/tickets'
          },
          {
            title: 'Park Güell Exclusive Morning Tour',
            interestType: 'artDesign',
            date: getStartTimestamp(), // Day 1
            venue: 'Park Güell',
            bookingUrl: 'https://parkguell.barcelona/'
          }
        ]
      },
      minorEvents: {
        title: 'Additional Experiences',
        events: [
          {
            title: 'Sagrada Familia Tour',
            interestType: 'artDesign',
            date: getStartTimestamp(),
            venue: 'Sagrada Familia',
            bookingUrl: 'https://sagradafamilia.org/en/tickets'
          },
          {
            title: 'Tapas and Flamenco Evening',
            interestType: 'culinary',
            date: getStartTimestamp() + (2 * 24 * 60 * 60 * 1000), // Day 3
            venue: 'Barrio Gótico',
            bookingUrl: 'https://www.barcelona-tourist-guide.com/en/eat/tapas-tours.html'
          }
        ]
      }
    },
    {
      id: '6',
      title: 'Beyoncé Renaissance World Tour NYC',
      description: 'Experience Beyoncé\'s Renaissance World Tour at Madison Square Garden plus explore NYC\'s vibrant culture.',
      city: 'New York',
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
      startDate: getStartTimestamp(),
      endDate: getEndTimestamp(3),
      keyEvents: {
        title: 'Main Events',
        events: [
          {
            title: 'Beyoncé - Renaissance World Tour',
            interestType: 'concerts',
            date: getStartTimestamp() + (24 * 60 * 60 * 1000), // Day 2
            venue: 'Madison Square Garden',
            bookingUrl: 'https://www.msg.com/beyonce'
          },
          {
            title: 'Top of the Rock Observatory Experience',
            interestType: 'localCulture',
            date: getStartTimestamp(), // Day 1
            venue: 'Rockefeller Center',
            bookingUrl: 'https://www.topoftherocknyc.com/'
          }
        ]
      },
      minorEvents: {
        title: 'Additional Experiences',
        events: [
          {
            title: 'Broadway Show: Hamilton',
            interestType: 'artDesign',
            date: getStartTimestamp(),
            venue: 'Richard Rodgers Theatre',
            bookingUrl: 'https://hamiltonmusical.com/new-york/'
          },
          {
            title: 'Central Park Jazz Brunch',
            interestType: 'culinary',
            date: getStartTimestamp() + (2 * 24 * 60 * 60 * 1000), // Day 3
            venue: 'Central Park Conservatory Garden',
            bookingUrl: 'https://www.centralparkconservancy.org/'
          }
        ]
      }
    },
    {
      id: '7',
      title: 'Formula 1 Monaco Grand Prix',
      description: 'Experience the glamour of Monaco Grand Prix plus the luxury lifestyle of the French Riviera.',
      city: 'Monaco',
      imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80',
      startDate: getStartTimestamp(),
      endDate: getEndTimestamp(4),
      keyEvents: {
        title: 'Main Events',
        events: [
          {
            title: 'Monaco Grand Prix Race Day',
            interestType: 'sports',
            date: getStartTimestamp() + (2 * 24 * 60 * 60 * 1000), // Day 3
            venue: 'Circuit de Monaco',
            bookingUrl: 'https://www.formula1.com/en/racing/2024/Monaco.html'
          },
          {
            title: 'Prince\'s Palace of Monaco Tour',
            interestType: 'localCulture',
            date: getStartTimestamp() + (24 * 60 * 60 * 1000), // Day 2
            venue: 'Prince\'s Palace',
            bookingUrl: 'https://www.palais.mc/'
          },
          {
            title: 'Yacht Charter Experience',
            interestType: 'localCulture',
            date: getStartTimestamp() + (3 * 24 * 60 * 60 * 1000), // Day 4
            venue: 'Port Hercules',
            bookingUrl: 'https://www.monacoboatservice.com/'
          }
        ]
      },
      minorEvents: {
        title: 'Additional Experiences',
        events: [
          {
            title: 'Monte Carlo Casino Experience',
            interestType: 'localCulture',
            date: getStartTimestamp(),
            venue: 'Monte Carlo Casino',
            bookingUrl: 'https://www.montecarlocasinos.com/'
          },
          {
            title: 'Michelin Star Dining at Le Louis XV',
            interestType: 'culinary',
            date: getStartTimestamp() + (24 * 60 * 60 * 1000), // Day 2
            venue: 'Hotel Hermitage',
            bookingUrl: 'https://www.ducasse-paris.com/en/restaurant/le-louis-xv'
          }
        ]
      }
    },
    {
      id: '8',
      title: 'Tokyo Art & Anime Culture Week',
      description: 'Immerse yourself in Tokyo\'s cutting-edge art scene, anime culture, and traditional Japanese experiences.',
      city: 'Tokyo',
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
      startDate: getStartTimestamp(),
      endDate: getEndTimestamp(5),
      keyEvents: {
        title: 'Main Events',
        events: [
          {
            title: 'TeamLab Borderless Digital Art Museum',
            interestType: 'artDesign',
            date: getStartTimestamp() + (24 * 60 * 60 * 1000), // Day 2
            venue: 'TeamLab Borderless',
            bookingUrl: 'https://borderless.teamlab.art/en/'
          },
          {
            title: 'Tokyo Skytree VIP Experience',
            interestType: 'localCulture',
            date: getStartTimestamp(), // Day 1
            venue: 'Tokyo Skytree',
            bookingUrl: 'https://www.tokyo-skytree.jp/en/'
          }
        ]
      },
      minorEvents: {
        title: 'Additional Experiences',
        events: [
          {
            title: 'Anime & Manga Museum Tour',
            interestType: 'localCulture',
            date: getStartTimestamp(),
            venue: 'Tokyo Anime Center',
            bookingUrl: 'https://www.animecenter.jp/'
          },
          {
            title: 'Traditional Kaiseki Dinner',
            interestType: 'culinary',
            date: getStartTimestamp() + (2 * 24 * 60 * 60 * 1000), // Day 3
            venue: 'Kikunoi Restaurant',
            bookingUrl: 'https://kikunoi.jp/english/'
          },
          {
            title: 'Studio Ghibli Museum',
            interestType: 'artDesign',
            date: getStartTimestamp() + (3 * 24 * 60 * 60 * 1000), // Day 4
            venue: 'Ghibli Museum',
            bookingUrl: 'https://www.ghibli-museum.jp/en/'
          }
        ]
      }
    },
    {
      id: '9',
      title: 'Coachella Desert Music Festival',
      description: 'Experience the iconic Coachella music festival in the California desert with top artists and desert vibes.',
      city: 'Palm Springs',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
      startDate: getStartTimestamp(),
      endDate: getEndTimestamp(4),
      keyEvents: {
        title: 'Main Events',
        events: [
          {
            title: 'Coachella Valley Music Festival',
            interestType: 'concerts',
            date: getStartTimestamp() + (24 * 60 * 60 * 1000), // Day 2
            venue: 'Empire Polo Club',
            bookingUrl: 'https://www.coachella.com/'
          },
          {
            title: 'Palm Springs Air Museum',
            interestType: 'localCulture',
            date: getStartTimestamp() + (2 * 24 * 60 * 60 * 1000), // Day 3
            venue: 'Palm Springs Air Museum',
            bookingUrl: 'https://www.palmspringsairmuseum.org/'
          }
        ]
      },
      minorEvents: {
        title: 'Additional Experiences',
        events: [
          {
            title: 'Joshua Tree National Park Sunrise',
            interestType: 'localCulture',
            date: getStartTimestamp(),
            venue: 'Joshua Tree National Park',
            bookingUrl: 'https://www.nps.gov/jotr/'
          },
          {
            title: 'Desert Hot Springs Spa Day',
            interestType: 'localCulture',
            date: getStartTimestamp() + (2 * 24 * 60 * 60 * 1000), // Day 3
            venue: 'Two Bunch Palms Resort',
            bookingUrl: 'https://www.twobunchpalms.com/'
          }
        ]
      }
    },
    {
      id: '10',
      title: 'Wimbledon Tennis Championships',
      description: 'Experience the prestige of Wimbledon tennis plus traditional British culture and countryside.',
      city: 'London',
      imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80',
      startDate: getStartTimestamp(),
      endDate: getEndTimestamp(4),
      keyEvents: {
        title: 'Main Events',
        events: [
          {
            title: 'Wimbledon Men\'s Final',
            interestType: 'sports',
            date: getStartTimestamp() + (2 * 24 * 60 * 60 * 1000), // Day 3
            venue: 'All England Lawn Tennis Club',
            bookingUrl: 'https://www.wimbledon.com/en_GB/tickets/index.html'
          },
          {
            title: 'Wimbledon Lawn Tennis Museum',
            interestType: 'sports',
            date: getStartTimestamp() + (24 * 60 * 60 * 1000), // Day 2
            venue: 'All England Lawn Tennis Club',
            bookingUrl: 'https://www.wimbledon.com/en_GB/museum/index.html'
          },
          {
            title: 'Thames River Cruise & Tower Bridge',
            interestType: 'localCulture',
            date: getStartTimestamp() + (3 * 24 * 60 * 60 * 1000), // Day 4
            venue: 'Tower Bridge',
            bookingUrl: 'https://www.towerbridge.org.uk/'
          }
        ]
      },
      minorEvents: {
        title: 'Additional Experiences',
        events: [
          {
            title: 'Traditional Afternoon Tea at Harrods',
            interestType: 'culinary',
            date: getStartTimestamp(),
            venue: 'Harrods Tea Rooms',
            bookingUrl: 'https://www.harrods.com/en-gb/restaurants/tea-rooms'
          },
          {
            title: 'Royal Botanic Gardens Kew',
            interestType: 'localCulture',
            date: getStartTimestamp() + (24 * 60 * 60 * 1000), // Day 2
            venue: 'Kew Gardens',
            bookingUrl: 'https://www.kew.org/'
          }
        ]
      }
    }
  ];

  // Filter out existing bundles
  const existingIds = new Set(existingBundles.map(b => b.id));
  const availableBundles = allMockBundles.filter(bundle => !existingIds.has(bundle.id));

  if (availableBundles.length === 0) {
    console.log('🤖 [MOCK] No new bundles available after filtering');
    return [];
  }

  // Randomly select up to 5 bundles
  const maxBundles = Math.min(5, availableBundles.length);
  const selectedBundles: TripBundle[] = [];
  const usedIndices = new Set<number>();

  while (selectedBundles.length < maxBundles) {
    const randomIndex = Math.floor(Math.random() * availableBundles.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      selectedBundles.push(availableBundles[randomIndex]);
    }
  }

  console.log(`🤖 [MOCK] Generated ${selectedBundles.length} trip bundles:`, selectedBundles.map(b => b.title));
  return selectedBundles;
};