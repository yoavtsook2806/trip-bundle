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
          },
          {
            title: 'Camden Market Food Tour',
            interestType: 'culinary',
            date: getStartTimestamp() + (24 * 60 * 60 * 1000), // Day 2
            venue: 'Camden Market',
            bookingUrl: 'https://www.camdenmarket.com/'
          },
          {
            title: 'Thames River Evening Cruise',
            interestType: 'localCulture',
            date: getStartTimestamp() + (3 * 24 * 60 * 60 * 1000), // Day 4
            venue: 'Thames River',
            bookingUrl: 'https://www.thamesrivercruises.co.uk/'
          },
          {
            title: 'Tate Modern Gallery Visit',
            interestType: 'artDesign',
            date: getStartTimestamp() + (12 * 60 * 60 * 1000), // Day 1 afternoon
            venue: 'Tate Modern',
            bookingUrl: 'https://www.tate.org.uk/visit/tate-modern'
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
          },
          {
            title: 'City vs United Legends Match',
            interestType: 'sports',
            date: getStartTimestamp() + (12 * 60 * 60 * 1000), // Day 1 afternoon
            venue: 'Manchester Academy',
            bookingUrl: 'https://www.manchesteracademy.net/'
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
          },
          {
            title: 'Curry Mile Food Experience',
            interestType: 'culinary',
            date: getStartTimestamp() + (24 * 60 * 60 * 1000), // Day 2
            venue: 'Curry Mile, Rusholme',
            bookingUrl: 'https://www.visitmanchester.com/curry-mile'
          },
          {
            title: 'Manchester Music History Tour',
            interestType: 'localCulture',
            date: getStartTimestamp() + (36 * 60 * 60 * 1000), // Day 2 evening
            venue: 'Northern Quarter',
            bookingUrl: 'https://www.manchestermusictours.com/'
          },
          {
            title: 'John Rylands Library Visit',
            interestType: 'artDesign',
            date: getStartTimestamp() + (6 * 60 * 60 * 1000), // Day 1 morning
            venue: 'John Rylands Library',
            bookingUrl: 'https://www.library.manchester.ac.uk/rylands/'
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
            title: 'French Cabaret Show at Moulin Rouge',
            interestType: 'concerts',
            date: getStartTimestamp() + (24 * 60 * 60 * 1000), // Day 2
            venue: 'Moulin Rouge',
            bookingUrl: 'https://www.moulinrouge.fr/en'
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
          },
          {
            title: 'Versailles Palace Day Trip',
            interestType: 'artDesign',
            date: getStartTimestamp() + (12 * 60 * 60 * 1000), // Day 1 afternoon
            venue: 'Palace of Versailles',
            bookingUrl: 'https://www.chateauversailles.fr/'
          },
          {
            title: 'Latin Quarter Wine Tasting',
            interestType: 'culinary',
            date: getStartTimestamp() + (3 * 24 * 60 * 60 * 1000), // Day 4
            venue: 'Latin Quarter',
            bookingUrl: 'https://www.pariswinetasting.com/'
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
            title: 'NBA All-Star Weekend',
            interestType: 'sports',
            date: getStartTimestamp() + (24 * 60 * 60 * 1000), // Day 2
            venue: 'T-Mobile Arena',
            bookingUrl: 'https://www.nba.com/allstar'
          },
          {
            title: 'Super Bowl Halftime Show After-Party',
            interestType: 'concerts',
            date: getStartTimestamp() + (2 * 24 * 60 * 60 * 1000), // Day 3 night
            venue: 'MGM Grand',
            bookingUrl: 'https://www.mgmgrand.com/'
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
          },
          {
            title: 'High Roller Observation Wheel',
            interestType: 'localCulture',
            date: getStartTimestamp() + (12 * 60 * 60 * 1000), // Day 1 afternoon
            venue: 'The LINQ Promenade',
            bookingUrl: 'https://www.caesars.com/linq/things-to-do/attractions/high-roller'
          },
          {
            title: 'Fremont Street Experience',
            interestType: 'localCulture',
            date: getStartTimestamp() + (3 * 24 * 60 * 60 * 1000), // Day 4
            venue: 'Fremont Street',
            bookingUrl: 'https://vegasexperience.com/'
          },
          {
            title: 'Bellagio Fountain Show & Buffet',
            interestType: 'culinary',
            date: getStartTimestamp() + (36 * 60 * 60 * 1000), // Day 2 evening
            venue: 'Bellagio Hotel',
            bookingUrl: 'https://www.bellagio.com/'
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
            title: 'FC Barcelona vs Atletico Madrid',
            interestType: 'sports',
            date: getStartTimestamp() + (12 * 60 * 60 * 1000), // Day 1 afternoon
            venue: 'Camp Nou',
            bookingUrl: 'https://www.fcbarcelona.com/en/tickets'
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
          },
          {
            title: 'Park Güell Guided Tour',
            interestType: 'artDesign',
            date: getStartTimestamp() + (6 * 60 * 60 * 1000), // Day 1 morning
            venue: 'Park Güell',
            bookingUrl: 'https://www.parkguell.cat/en'
          },
          {
            title: 'Barcelona Beach & Seafood',
            interestType: 'culinary',
            date: getStartTimestamp() + (36 * 60 * 60 * 1000), // Day 2 evening
            venue: 'Barceloneta Beach',
            bookingUrl: 'https://www.barcelona.com/barceloneta'
          },
          {
            title: 'Gothic Quarter Walking Tour',
            interestType: 'localCulture',
            date: getStartTimestamp() + (48 * 60 * 60 * 1000), // Day 3 morning
            venue: 'Gothic Quarter',
            bookingUrl: 'https://www.barcelona-tourist-guide.com/en/tours/gothic-quarter.html'
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
            title: 'Alicia Keys Live at Apollo Theater',
            interestType: 'concerts',
            date: getStartTimestamp() + (2 * 24 * 60 * 60 * 1000), // Day 3
            venue: 'Apollo Theater',
            bookingUrl: 'https://www.apollotheater.org/'
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
          },
          {
            title: 'Metropolitan Museum of Art',
            interestType: 'artDesign',
            date: getStartTimestamp() + (6 * 60 * 60 * 1000), // Day 1 morning
            venue: 'Metropolitan Museum',
            bookingUrl: 'https://www.metmuseum.org/'
          },
          {
            title: 'Brooklyn Bridge & DUMBO Food Tour',
            interestType: 'culinary',
            date: getStartTimestamp() + (36 * 60 * 60 * 1000), // Day 2 evening
            venue: 'Brooklyn Bridge',
            bookingUrl: 'https://www.brooklynfoodtours.com/'
          },
          {
            title: 'Statue of Liberty & Ellis Island',
            interestType: 'localCulture',
            date: getStartTimestamp() + (12 * 60 * 60 * 1000), // Day 1 afternoon
            venue: 'Liberty Island',
            bookingUrl: 'https://www.nps.gov/stli/'
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
            title: 'Monaco Grand Prix Qualifying',
            interestType: 'sports',
            date: getStartTimestamp() + (24 * 60 * 60 * 1000), // Day 2
            venue: 'Circuit de Monaco',
            bookingUrl: 'https://www.formula1.com/en/racing/2024/Monaco.html'
          },
          {
            title: 'Monaco Historic Grand Prix',
            interestType: 'sports',
            date: getStartTimestamp() + (12 * 60 * 60 * 1000), // Day 1 afternoon
            venue: 'Circuit de Monaco',
            bookingUrl: 'https://www.acm.mc/en/evenements/grand-prix-de-monaco-historique'
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
          },
          {
            title: 'Prince\'s Palace & Changing of Guard',
            interestType: 'localCulture',
            date: getStartTimestamp() + (6 * 60 * 60 * 1000), // Day 1 morning
            venue: 'Prince\'s Palace',
            bookingUrl: 'https://www.palais.mc/en'
          },
          {
            title: 'Yacht Club de Monaco Tour',
            interestType: 'localCulture',
            date: getStartTimestamp() + (3 * 24 * 60 * 60 * 1000), // Day 4
            venue: 'Yacht Club de Monaco',
            bookingUrl: 'https://www.yacht-club-monaco.mc/'
          },
          {
            title: 'French Riviera Wine Tasting',
            interestType: 'culinary',
            date: getStartTimestamp() + (36 * 60 * 60 * 1000), // Day 2 evening
            venue: 'Côtes de Provence Vineyards',
            bookingUrl: 'https://www.provence-wine.com/'
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
            title: 'Tokyo International Anime Fair',
            interestType: 'artDesign',
            date: getStartTimestamp() + (2 * 24 * 60 * 60 * 1000), // Day 3
            venue: 'Tokyo Big Sight',
            bookingUrl: 'https://www.animejapan.jp/en/'
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
          },
          {
            title: 'Harajuku Fashion & Street Culture',
            interestType: 'localCulture',
            date: getStartTimestamp() + (6 * 60 * 60 * 1000), // Day 1 morning
            venue: 'Harajuku District',
            bookingUrl: 'https://www.gotokyo.org/en/destinations/shibuya/harajuku.html'
          },
          {
            title: 'Tsukiji Outer Market Food Tour',
            interestType: 'culinary',
            date: getStartTimestamp() + (4 * 24 * 60 * 60 * 1000), // Day 5
            venue: 'Tsukiji Outer Market',
            bookingUrl: 'https://www.tsukiji.or.jp/english/'
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
            title: 'Coachella Valley Music Festival - Weekend 1',
            interestType: 'concerts',
            date: getStartTimestamp() + (24 * 60 * 60 * 1000), // Day 2
            venue: 'Empire Polo Club',
            bookingUrl: 'https://www.coachella.com/'
          },
          {
            title: 'Coachella After-Party: Desert Oasis',
            interestType: 'concerts',
            date: getStartTimestamp() + (2 * 24 * 60 * 60 * 1000), // Day 3
            venue: 'Desert Air Hotel',
            bookingUrl: 'https://www.coachella.com/after-parties'
          },
          {
            title: 'Stagecoach Country Music Festival',
            interestType: 'concerts',
            date: getStartTimestamp() + (3 * 24 * 60 * 60 * 1000), // Day 4
            venue: 'Empire Polo Club',
            bookingUrl: 'https://www.stagecoachfestival.com/'
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
          },
          {
            title: 'Palm Springs Aerial Tramway',
            interestType: 'localCulture',
            date: getStartTimestamp() + (6 * 60 * 60 * 1000), // Day 1 morning
            venue: 'Palm Springs Aerial Tramway',
            bookingUrl: 'https://www.pstramway.com/'
          },
          {
            title: 'Desert Food & Wine Festival',
            interestType: 'culinary',
            date: getStartTimestamp() + (12 * 60 * 60 * 1000), // Day 1 afternoon
            venue: 'Indian Wells',
            bookingUrl: 'https://www.desertfoodandwine.com/'
          },
          {
            title: 'Salton Sea Art Installation Tour',
            interestType: 'artDesign',
            date: getStartTimestamp() + (36 * 60 * 60 * 1000), // Day 2 evening
            venue: 'Salton Sea',
            bookingUrl: 'https://www.saltonsea.ca.gov/'
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
            title: 'Wimbledon Ladies\' Final',
            interestType: 'sports',
            date: getStartTimestamp() + (24 * 60 * 60 * 1000), // Day 2
            venue: 'All England Lawn Tennis Club',
            bookingUrl: 'https://www.wimbledon.com/en_GB/tickets/index.html'
          },
          {
            title: 'Wimbledon Qualifying Tournament',
            interestType: 'sports',
            date: getStartTimestamp() + (12 * 60 * 60 * 1000), // Day 1 afternoon
            venue: 'All England Lawn Tennis Club',
            bookingUrl: 'https://www.wimbledon.com/en_GB/tickets/index.html'
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
          },
          {
            title: 'Hampton Court Palace Tour',
            interestType: 'localCulture',
            date: getStartTimestamp() + (6 * 60 * 60 * 1000), // Day 1 morning
            venue: 'Hampton Court Palace',
            bookingUrl: 'https://www.hrp.org.uk/hampton-court-palace/'
          },
          {
            title: 'Thames Valley Wine Tasting',
            interestType: 'culinary',
            date: getStartTimestamp() + (3 * 24 * 60 * 60 * 1000), // Day 4
            venue: 'Thames Valley Vineyards',
            bookingUrl: 'https://www.thamesvalleywinery.co.uk/'
          },
          {
            title: 'Royal Observatory Greenwich',
            interestType: 'artDesign',
            date: getStartTimestamp() + (36 * 60 * 60 * 1000), // Day 2 evening
            venue: 'Royal Observatory',
            bookingUrl: 'https://www.rmg.co.uk/royal-observatory'
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