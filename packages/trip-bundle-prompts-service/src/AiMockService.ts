import { TripBundle } from './types';

/**
 * Mock AI service that simulates AI responses for trip bundle generation
 */

// Helper function to generate timestamps
const getStartTimestamp = () => Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days from now
const getEndTimestamp = (daysFromStart: number = 3) => getStartTimestamp() + (daysFromStart * 24 * 60 * 60 * 1000);

/**
 * Gets trip bundles from AI (mock implementation)
 * Returns TripBundle[] - the service layer wraps it in GPTResponse
 */
export const getBundlesFromAi = async (
  userPrompt: string,
  existingBundles: TripBundle[] = []
): Promise<TripBundle[]> => {
  console.log('🤖 [MOCK] Getting bundles from AI...');
  console.log('📝 User prompt:', userPrompt);
  console.log('📦 Existing bundles to filter:', existingBundles.map(b => b.title));

  // All available mock bundles using new simplified structure
  const allMockBundles: TripBundle[] = [
    {
      imageUrl: "https://source.unsplash.com/random/800x600/?amsterdam-concert,electronic-music",
      title: "Amsterdam: ADE Weekender — Electronic Peaks & Local Flavours",
      description: "Five days in Amsterdam timed to Amsterdam Dance Event + AMF: immersive electronic and house showcases, late-night club culture, and fresh market food runs.",
      city: "Amsterdam, Netherlands",
      dateRange: {
        startDate: getStartTimestamp(),
        endDate: getEndTimestamp(5)
      },
      keyEvents: [
        {
          title: "Amsterdam Dance Event (ADE) Festival",
          fullDescription: "ADE is Europe's biggest electronic-music conference and club festival, staging hundreds of club shows, panels and label showcases across Amsterdam from October 22–26, 2025. Expect world-class DJs, label nights, and daytime showcases that map directly to your electronic/house tastes.",
          shortDescription: "Europe's biggest electronic-week: 22–26 Oct 2025, citywide club and festival programme.",
          interestType: "concerts",
          dateRange: {
            startDate: getStartTimestamp() + (24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (5 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.amsterdam-dance-event.nl/en/"
        },
        {
          title: "AMF (Amsterdam Music Festival) at Johan Cruijff ArenA",
          fullDescription: "AMF is ADE's stadium-scale electronica night that transforms Johan Cruijff ArenA into a one-night mega-club with headline DJs and production on a grand scale. If you like festival energy and arena-level electronic shows, AMF is a must.",
          shortDescription: "Arena-scale electronic spectacle at Johan Cruijff ArenA.",
          interestType: "concerts",
          dateRange: {
            startDate: getStartTimestamp() + (4 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (4 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.amsterdam-dance-event.nl/en/program/2025/amf-2025/2682387/"
        }
      ],
      minorEvents: [
        {
          title: "Paradiso — Historic club & live-music programme",
          fullDescription: "Paradiso (a converted church) is Amsterdam's iconic live-music venue with club nights and intimate concerts covering hip hop, electronic, jazz-adjacent acts and crossover sets.",
          shortDescription: "Legendary Amsterdam club hosting ADE-related shows, late nights and eclectic gigs.",
          interestType: "concerts",
          dateRange: {
            startDate: getStartTimestamp(),
            endDate: getStartTimestamp() + (5 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.paradiso.nl/en"
        },
        {
          title: "Albert Cuyp Market — De Pijp daytime food & street culture",
          fullDescription: "A stroll-and-sample stop: Albert Cuyp is Amsterdam's largest daytime market (open Mon–Sat). Taste stroopwafels, herring, poffertjes and international street food stalls.",
          shortDescription: "Historic De Pijp market for local snacks, cheeses and street-food discovery.",
          interestType: "culinary",
          dateRange: {
            startDate: getStartTimestamp() + (24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (24 * 60 * 60 * 1000)
          }
          // No eventWebsite for this one (testing optional field)
        }
      ]
    },
    {
      imageUrl: "https://source.unsplash.com/random/800x600/?berlin-art,gallery-exhibition",
      title: "Berlin: Autumn Art Surge — Biennale + Art Week",
      description: "Five days in Berlin centered on Berlin Art Week and the 13th Berlin Biennale — gallery openings, contemporary performance, and literary & local culture side-programmes.",
      city: "Berlin, Germany",
      dateRange: {
        startDate: getStartTimestamp() + (10 * 24 * 60 * 60 * 1000),
        endDate: getEndTimestamp(15)
      },
      keyEvents: [
        {
          title: "Berlin Art Week",
          fullDescription: "Berlin Art Week is the city's fall contemporary-art moment: museum exhibitions, gallery openings, talks, and late-night project-space programs concentrate over five days.",
          shortDescription: "Citywide contemporary-art festival and gallery program.",
          interestType: "artDesign",
          dateRange: {
            startDate: getStartTimestamp() + (10 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (15 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://berlinartweek.de/en/"
        },
        {
          title: "13th Berlin Biennale for Contemporary Art",
          fullDescription: "The 13th Berlin Biennale presents a cross-venue program of site-specific works, installations and performances by international artists.",
          shortDescription: "Berlin Biennale — major contemporary-art exhibition.",
          interestType: "artDesign",
          dateRange: {
            startDate: getStartTimestamp() + (10 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (15 * 24 * 60 * 60 * 1000)
          }
          // No eventWebsite for this one (testing optional field)
        }
      ],
      minorEvents: [
        {
          title: "International Literature Festival Berlin",
          fullDescription: "The International Literature Festival Berlin runs with readings, panels and multilingual talks across city venues.",
          shortDescription: "Citywide festival of readings, panels and author events.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (11 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (14 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://literaturfestival.com/en/"
        },
        {
          title: "Open Monument Day",
          fullDescription: "Open Monument Day offers special access to historic buildings, restoration workshops and curated tours.",
          shortDescription: "Special-access heritage weekend with tours and behind-the-scenes visits.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (13 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (14 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.tag-des-offenen-denkmals.de/"
        }
      ]
    },
    {
      imageUrl: "https://source.unsplash.com/random/800x600/?paris-art-basel,grand-palais",
      title: "Paris: Art-Week Immersion — Art Basel Paris + Paris Internationale",
      description: "Five-day Paris pick during Paris Art Week: Art Basel Paris and Paris Internationale lock the city into an intense art-and-design beat with museum highlights and culinary side-stops.",
      city: "Paris, France",
      dateRange: {
        startDate: getStartTimestamp() + (20 * 24 * 60 * 60 * 1000),
        endDate: getEndTimestamp(25)
      },
      keyEvents: [
        {
          title: "Art Basel Paris (Paris+ par Art Basel) — Grand Palais",
          fullDescription: "Art Basel Paris gathers leading international galleries at the Grand Palais and runs a wide public program in the city: talks, outdoor sculpture projects and museum tie-ins.",
          shortDescription: "Major contemporary-art fair at the Grand Palais, citywide public program.",
          interestType: "artDesign",
          dateRange: {
            startDate: getStartTimestamp() + (20 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (25 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.artbasel.com/paris?lang=en"
        },
        {
          title: "Paris Internationale",
          fullDescription: "Paris Internationale is a curated, discovery-focused fair showcasing emerging galleries and experimental projects.",
          shortDescription: "Nomadic contemporary fair for emerging galleries and experimental projects.",
          interestType: "artDesign",
          dateRange: {
            startDate: getStartTimestamp() + (20 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (25 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://parisinternationale.com/"
        }
      ],
      minorEvents: [
        {
          title: "Gerhard Richter retrospective — Fondation Louis Vuitton",
          fullDescription: "A major Gerhard Richter retrospective at Fondation Louis Vuitton — timed perfectly to coincide with Art Week.",
          shortDescription: "Gerhard Richter retrospective at Fondation Louis Vuitton.",
          interestType: "artDesign",
          dateRange: {
            startDate: getStartTimestamp() + (17 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (90 * 24 * 60 * 60 * 1000)
          }
          // No eventWebsite for this one (testing optional field)
        },
        {
          title: "Paris museum & culinary route",
          fullDescription: "During Art Week many Paris museums open special late nights and the Tuileries/Jardin public programs run pop-up installations.",
          shortDescription: "Late-night museum programs and Tuileries pop-ups with bistro/wine pairings during Art Week.",
          interestType: "culinary",
          dateRange: {
            startDate: getStartTimestamp() + (20 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (25 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.parismusees.paris.fr/"
        }
      ]
    },
    {
      imageUrl: "https://source.unsplash.com/random/800x600/?barcelona-festival,la-merce",
      title: "Barcelona: La Mercè — City Festival, Street Spectacle & Taste",
      description: "Six days in Barcelona for La Mercè: citywide free concerts, BAM showcases, human-tower tradition, and Terra i Gust sustainable food programming.",
      city: "Barcelona, Spain",
      dateRange: {
        startDate: getStartTimestamp() + (30 * 24 * 60 * 60 * 1000),
        endDate: getEndTimestamp(36)
      },
      keyEvents: [
        {
          title: "La Mercè (Festes de la Mercè) — Barcelona's city festival",
          fullDescription: "La Mercè is Barcelona's biggest annual festival — a packed programme of free concerts, castellers (human towers), parades, fireworks (Piromusical) and public art across the city.",
          shortDescription: "Barcelona's citywide festival of music, street-art and tradition.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (30 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (36 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.barcelona.cat/lamerce/en/"
        },
        {
          title: "BAM (Barcelona Acció Musical) — La Mercè's music strand",
          fullDescription: "BAM runs inside La Mercè and highlights experimental, indie and electronic sounds on multiple stages throughout the city.",
          shortDescription: "BAM — the festival's edgy musical programme across multiple stages during La Mercè.",
          interestType: "concerts",
          dateRange: {
            startDate: getStartTimestamp() + (30 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (36 * 24 * 60 * 60 * 1000)
          }
          // No eventWebsite for this one (testing optional field)
        }
      ],
      minorEvents: [
        {
          title: "Terra i Gust — Mercè's sustainable gastronomy programme",
          fullDescription: "Terra i Gust (part of La Mercè) is Barcelona's sustainable-food hub offering tastings, debates and local-produce showcases in Parc de la Ciutadella.",
          shortDescription: "Sustainable-food fair within La Mercè (Parc de la Ciutadella).",
          interestType: "culinary",
          dateRange: {
            startDate: getStartTimestamp() + (33 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (36 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://ajuntament.barcelona.cat/"
        },
        {
          title: "BAM & Mercè free-stage highlights",
          fullDescription: "La Mercè's open-air stages (Bogatell beach, Ciutadella, Plaça Catalunya) host headline and local acts — often free — spanning electronic DJ sets, hip hop showcases and neo-soul.",
          shortDescription: "Free concerts across city stages (Bogatell, Ciutadella, Plaça Catalunya) during La Mercè.",
          interestType: "concerts",
          dateRange: {
            startDate: getStartTimestamp() + (30 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (36 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.barcelona.cat/lamerce/en/"
        }
      ]
    },
    {
      imageUrl: "https://source.unsplash.com/random/800x600/?tokyo-cherry-blossom,temple",
      title: "Tokyo: Cherry Blossom Season & Traditional Arts",
      description: "Experience Tokyo during the magical cherry blossom season with traditional tea ceremonies, temple visits, and modern art galleries.",
      city: "Tokyo, Japan",
      dateRange: {
        startDate: getStartTimestamp() + (40 * 24 * 60 * 60 * 1000),
        endDate: getEndTimestamp(46)
      },
      keyEvents: [
        {
          title: "Hanami Cherry Blossom Festival",
          fullDescription: "Join locals for hanami (flower viewing) in Ueno Park and Shinjuku Gyoen during peak cherry blossom season.",
          shortDescription: "Traditional cherry blossom viewing in Tokyo's most beautiful parks.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (40 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (46 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.japan-guide.com/e/e3951.html"
        },
        {
          title: "TeamLab Borderless Digital Art Museum",
          fullDescription: "Immerse yourself in interactive digital art installations at this groundbreaking museum in Odaiba.",
          shortDescription: "Interactive digital art experience at TeamLab Borderless.",
          interestType: "artDesign",
          dateRange: {
            startDate: getStartTimestamp() + (41 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (41 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.teamlab.art/e/borderless/"
        }
      ],
      minorEvents: [
        {
          title: "Traditional Tea Ceremony Experience",
          fullDescription: "Learn the ancient art of Japanese tea ceremony in a traditional tea house in the historic Asakusa district.",
          shortDescription: "Authentic tea ceremony experience in historic Asakusa.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (42 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (42 * 24 * 60 * 60 * 1000)
          }
        },
        {
          title: "Tsukiji Outer Market Food Tour",
          fullDescription: "Explore the famous Tsukiji Outer Market with a local guide, sampling fresh sushi, street food, and traditional Japanese snacks.",
          shortDescription: "Guided food tour through Tokyo's famous Tsukiji market.",
          interestType: "culinary",
          dateRange: {
            startDate: getStartTimestamp() + (43 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (43 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.tsukiji.or.jp/english/"
        }
      ]
    },
    {
      imageUrl: "https://source.unsplash.com/random/800x600/?new-york-broadway,jazz",
      title: "New York: Broadway & Jazz Heritage",
      description: "Dive into New York's performing arts scene with Broadway shows, jazz clubs, and cultural landmarks.",
      city: "New York City, USA",
      dateRange: {
        startDate: getStartTimestamp() + (50 * 24 * 60 * 60 * 1000),
        endDate: getEndTimestamp(55)
      },
      keyEvents: [
        {
          title: "Broadway Show: Hamilton",
          fullDescription: "Experience Lin-Manuel Miranda's revolutionary musical that tells the story of Alexander Hamilton through hip-hop, jazz, and R&B.",
          shortDescription: "See the acclaimed Hamilton musical on Broadway.",
          interestType: "concerts",
          dateRange: {
            startDate: getStartTimestamp() + (51 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (51 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://hamiltonmusical.com/"
        },
        {
          title: "Blue Note Jazz Club Performance",
          fullDescription: "Enjoy an intimate jazz performance at the legendary Blue Note, featuring both established and emerging jazz artists.",
          shortDescription: "Live jazz at the iconic Blue Note club in Greenwich Village.",
          interestType: "concerts",
          dateRange: {
            startDate: getStartTimestamp() + (52 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (52 * 24 * 60 * 60 * 1000)
          }
        }
      ],
      minorEvents: [
        {
          title: "Metropolitan Museum of Art",
          fullDescription: "Explore one of the world's largest and most comprehensive art museums, featuring collections spanning 5,000 years.",
          shortDescription: "World-class art collections at the Metropolitan Museum.",
          interestType: "artDesign",
          dateRange: {
            startDate: getStartTimestamp() + (53 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (53 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.metmuseum.org/"
        },
        {
          title: "Central Park & Bethesda Fountain",
          fullDescription: "Stroll through Central Park and visit the iconic Bethesda Fountain, a perfect spot for people-watching and relaxation.",
          shortDescription: "Peaceful walk through Central Park and Bethesda Fountain.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (54 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (54 * 24 * 60 * 60 * 1000)
          }
        }
      ]
    },
    {
      imageUrl: "https://source.unsplash.com/random/800x600/?rome-colosseum,italian-food",
      title: "Rome: Ancient Wonders & Culinary Traditions",
      description: "Discover Rome's ancient history and vibrant food culture with guided tours, cooking classes, and historic sites.",
      city: "Rome, Italy",
      dateRange: {
        startDate: getStartTimestamp() + (60 * 24 * 60 * 60 * 1000),
        endDate: getEndTimestamp(65)
      },
      keyEvents: [
        {
          title: "Colosseum Underground Tour",
          fullDescription: "Explore the underground chambers and arena floor of the Colosseum with exclusive access to areas usually closed to the public.",
          shortDescription: "Exclusive underground tour of the iconic Colosseum.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (61 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (61 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.coopculture.it/"
        },
        {
          title: "Vatican Museums & Sistine Chapel",
          fullDescription: "Marvel at Michelangelo's masterpieces in the Sistine Chapel and explore the vast collections of the Vatican Museums.",
          shortDescription: "Art treasures at the Vatican Museums and Sistine Chapel.",
          interestType: "artDesign",
          dateRange: {
            startDate: getStartTimestamp() + (62 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (62 * 24 * 60 * 60 * 1000)
          }
        }
      ],
      minorEvents: [
        {
          title: "Traditional Roman Cooking Class",
          fullDescription: "Learn to make authentic Roman dishes like carbonara, cacio e pepe, and supplì with a local chef in Trastevere.",
          shortDescription: "Hands-on cooking class for traditional Roman cuisine.",
          interestType: "culinary",
          dateRange: {
            startDate: getStartTimestamp() + (63 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (63 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.cookingclassesrome.com/"
        },
        {
          title: "Trastevere Evening Food Walk",
          fullDescription: "Explore the charming Trastevere neighborhood with a local guide, sampling street food, gelato, and local wines.",
          shortDescription: "Evening food tour through the picturesque Trastevere district.",
          interestType: "culinary",
          dateRange: {
            startDate: getStartTimestamp() + (64 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (64 * 24 * 60 * 60 * 1000)
          }
        }
      ]
    },
    {
      imageUrl: "https://source.unsplash.com/random/800x600/?london-punk-music,street-art",
      title: "London: Punk Heritage & Street Art Scene",
      description: "Explore London's rebellious side with punk music history, street art tours, and underground culture.",
      city: "London, UK",
      dateRange: {
        startDate: getStartTimestamp() + (70 * 24 * 60 * 60 * 1000),
        endDate: getEndTimestamp(75)
      },
      keyEvents: [
        {
          title: "Punk London Walking Tour",
          fullDescription: "Follow the footsteps of the Sex Pistols, The Clash, and other punk legends through Camden, King's Road, and Soho.",
          shortDescription: "Guided tour of London's punk rock history and landmarks.",
          interestType: "concerts",
          dateRange: {
            startDate: getStartTimestamp() + (71 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (71 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.punkwalkingtour.com/"
        },
        {
          title: "Banksy & Street Art Tour in Shoreditch",
          fullDescription: "Discover works by Banksy and other renowned street artists in the vibrant East London neighborhood of Shoreditch.",
          shortDescription: "Street art tour featuring Banksy and local artists in Shoreditch.",
          interestType: "artDesign",
          dateRange: {
            startDate: getStartTimestamp() + (72 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (72 * 24 * 60 * 60 * 1000)
          }
        }
      ],
      minorEvents: [
        {
          title: "Camden Market Vintage Shopping",
          fullDescription: "Browse vintage clothing, records, and punk memorabilia at the famous Camden Market, a hub of alternative culture.",
          shortDescription: "Vintage shopping and punk culture at Camden Market.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (73 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (73 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.camdenmarket.com/"
        },
        {
          title: "Traditional British Pub Experience",
          fullDescription: "Experience authentic British pub culture with local ales, traditional pub food, and live music in historic pubs.",
          shortDescription: "Authentic British pub crawl with local ales and traditional food.",
          interestType: "culinary",
          dateRange: {
            startDate: getStartTimestamp() + (74 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (74 * 24 * 60 * 60 * 1000)
          }
        }
      ]
    },
    {
      imageUrl: "https://source.unsplash.com/random/800x600/?melbourne-coffee-culture,street-art",
      title: "Melbourne: Coffee Culture & Lane Art",
      description: "Discover Melbourne's famous coffee scene and vibrant street art culture in hidden laneways and local neighborhoods.",
      city: "Melbourne, Australia",
      dateRange: {
        startDate: getStartTimestamp() + (80 * 24 * 60 * 60 * 1000),
        endDate: getEndTimestamp(85)
      },
      keyEvents: [
        {
          title: "Melbourne Coffee Culture Tour",
          fullDescription: "Explore Melbourne's renowned coffee culture with visits to specialty roasters, hidden cafes, and learn about the city's coffee history.",
          shortDescription: "Guided tour of Melbourne's world-famous coffee culture.",
          interestType: "culinary",
          dateRange: {
            startDate: getStartTimestamp() + (81 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (81 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.melbournecoffeetour.com/"
        },
        {
          title: "Street Art & Laneways Walking Tour",
          fullDescription: "Discover Melbourne's famous street art scene in hidden laneways like Hosier Lane and AC/DC Lane with a local street art guide.",
          shortDescription: "Explore Melbourne's iconic street art in hidden laneways.",
          interestType: "artDesign",
          dateRange: {
            startDate: getStartTimestamp() + (82 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (82 * 24 * 60 * 60 * 1000)
          }
        }
      ],
      minorEvents: [
        {
          title: "Queen Victoria Market Food Tour",
          fullDescription: "Sample local produce, artisanal foods, and multicultural cuisine at Melbourne's historic Queen Victoria Market.",
          shortDescription: "Food tour through Melbourne's historic Queen Victoria Market.",
          interestType: "culinary",
          dateRange: {
            startDate: getStartTimestamp() + (83 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (83 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://qvm.com.au/"
        },
        {
          title: "Royal Botanic Gardens Melbourne",
          fullDescription: "Stroll through one of the world's finest botanic gardens, featuring diverse plant collections and peaceful walking paths.",
          shortDescription: "Peaceful walk through Melbourne's beautiful Royal Botanic Gardens.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (84 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (84 * 24 * 60 * 60 * 1000)
          }
        }
      ]
    },
    {
      imageUrl: "https://source.unsplash.com/random/800x600/?istanbul-bazaar,turkish-music",
      title: "Istanbul: Ottoman Heritage & Turkish Delights",
      description: "Experience Istanbul's rich Ottoman history, traditional Turkish music, and authentic cuisine in this cultural crossroads.",
      city: "Istanbul, Turkey",
      dateRange: {
        startDate: getStartTimestamp() + (90 * 24 * 60 * 60 * 1000),
        endDate: getEndTimestamp(95)
      },
      keyEvents: [
        {
          title: "Hagia Sophia & Blue Mosque Tour",
          fullDescription: "Explore two of Istanbul's most iconic landmarks with a guided tour covering their Byzantine and Ottoman history.",
          shortDescription: "Guided tour of Hagia Sophia and the Blue Mosque.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (91 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (91 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.istanbul.gov.tr/"
        },
        {
          title: "Traditional Turkish Music Performance",
          fullDescription: "Experience authentic Turkish classical music and folk performances at a traditional venue in the historic Sultanahmet district.",
          shortDescription: "Traditional Turkish music performance in historic Sultanahmet.",
          interestType: "concerts",
          dateRange: {
            startDate: getStartTimestamp() + (92 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (92 * 24 * 60 * 60 * 1000)
          }
        }
      ],
      minorEvents: [
        {
          title: "Grand Bazaar Shopping Experience",
          fullDescription: "Navigate the historic Grand Bazaar, one of the world's oldest covered markets, shopping for carpets, spices, and Turkish crafts.",
          shortDescription: "Shopping adventure in the historic Grand Bazaar.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (93 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (93 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://grandbazaaristanbul.org/"
        },
        {
          title: "Turkish Cooking Class & Bosphorus Dinner",
          fullDescription: "Learn to cook traditional Turkish dishes and enjoy dinner with views of the Bosphorus strait.",
          shortDescription: "Turkish cooking class with Bosphorus dinner experience.",
          interestType: "culinary",
          dateRange: {
            startDate: getStartTimestamp() + (94 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (94 * 24 * 60 * 60 * 1000)
          }
        }
      ]
    },
    {
      imageUrl: "https://source.unsplash.com/random/800x600/?rio-carnival,samba",
      title: "Rio de Janeiro: Carnival Spirit & Beach Culture",
      description: "Immerse yourself in Rio's vibrant carnival culture, samba music, and iconic beach lifestyle.",
      city: "Rio de Janeiro, Brazil",
      dateRange: {
        startDate: getStartTimestamp() + (100 * 24 * 60 * 60 * 1000),
        endDate: getEndTimestamp(105)
      },
      keyEvents: [
        {
          title: "Samba School Rehearsal Experience",
          fullDescription: "Join a samba school rehearsal and learn about carnival preparations, costumes, and traditional Brazilian music.",
          shortDescription: "Authentic samba school rehearsal and carnival preparation experience.",
          interestType: "concerts",
          dateRange: {
            startDate: getStartTimestamp() + (101 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (101 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.rio.rj.gov.br/"
        },
        {
          title: "Christ the Redeemer & Sugarloaf Mountain",
          fullDescription: "Visit Rio's most iconic landmarks with panoramic views of the city, beaches, and surrounding mountains.",
          shortDescription: "Iconic Rio landmarks: Christ the Redeemer and Sugarloaf Mountain.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (102 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (102 * 24 * 60 * 60 * 1000)
          }
        }
      ],
      minorEvents: [
        {
          title: "Copacabana Beach & Caipirinha Making",
          fullDescription: "Relax on the famous Copacabana beach and learn to make Brazil's national cocktail, the caipirinha.",
          shortDescription: "Beach day at Copacabana with caipirinha making class.",
          interestType: "culinary",
          dateRange: {
            startDate: getStartTimestamp() + (103 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (103 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.copacabana.com/"
        },
        {
          title: "Santa Teresa Neighborhood Art Walk",
          fullDescription: "Explore the bohemian Santa Teresa neighborhood, known for its colonial architecture, art studios, and cultural venues.",
          shortDescription: "Art walk through the bohemian Santa Teresa neighborhood.",
          interestType: "artDesign",
          dateRange: {
            startDate: getStartTimestamp() + (104 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (104 * 24 * 60 * 60 * 1000)
          }
        }
      ]
    },
    {
      imageUrl: "https://source.unsplash.com/random/800x600/?marrakech-souks,moroccan-music",
      title: "Marrakech: Medina Magic & Moroccan Rhythms",
      description: "Discover the enchanting medina of Marrakech with traditional music, vibrant souks, and authentic Moroccan cuisine.",
      city: "Marrakech, Morocco",
      dateRange: {
        startDate: getStartTimestamp() + (110 * 24 * 60 * 60 * 1000),
        endDate: getEndTimestamp(115)
      },
      keyEvents: [
        {
          title: "Jemaa el-Fnaa Square Evening Experience",
          fullDescription: "Experience the magic of Marrakech's main square with storytellers, musicians, snake charmers, and food stalls as the sun sets.",
          shortDescription: "Evening cultural experience at the famous Jemaa el-Fnaa square.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (111 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (111 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.visitmorocco.com/"
        },
        {
          title: "Traditional Gnawa Music Performance",
          fullDescription: "Listen to authentic Gnawa music, a spiritual musical tradition combining African, Berber, and Arabic influences.",
          shortDescription: "Traditional Gnawa music performance with spiritual and cultural significance.",
          interestType: "concerts",
          dateRange: {
            startDate: getStartTimestamp() + (112 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (112 * 24 * 60 * 60 * 1000)
          }
        }
      ],
      minorEvents: [
        {
          title: "Medina Souks Shopping Tour",
          fullDescription: "Navigate the labyrinthine souks of the medina with a local guide, shopping for spices, textiles, and traditional crafts.",
          shortDescription: "Guided shopping tour through the traditional medina souks.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (113 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (113 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.marrakech.ma/"
        },
        {
          title: "Moroccan Cooking Class & Tagine Workshop",
          fullDescription: "Learn to prepare traditional Moroccan dishes including tagines, couscous, and mint tea in a local riad.",
          shortDescription: "Hands-on Moroccan cooking class in a traditional riad setting.",
          interestType: "culinary",
          dateRange: {
            startDate: getStartTimestamp() + (114 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (114 * 24 * 60 * 60 * 1000)
          }
        }
      ]
    },
    {
      imageUrl: "https://source.unsplash.com/random/800x600/?dublin-traditional-music,irish-pub",
      title: "Dublin: Traditional Irish Music & Literary Heritage",
      description: "Explore Dublin's rich musical and literary traditions with pub sessions, literary tours, and Irish cultural experiences.",
      city: "Dublin, Ireland",
      dateRange: {
        startDate: getStartTimestamp() + (120 * 24 * 60 * 60 * 1000),
        endDate: getEndTimestamp(125)
      },
      keyEvents: [
        {
          title: "Traditional Irish Music Pub Session",
          fullDescription: "Experience authentic Irish traditional music in historic pubs with local musicians playing fiddle, bodhrán, and tin whistle.",
          shortDescription: "Authentic traditional Irish music session in historic Dublin pubs.",
          interestType: "concerts",
          dateRange: {
            startDate: getStartTimestamp() + (121 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (121 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.dublintraditionalmusictrail.com/"
        },
        {
          title: "Literary Dublin Walking Tour",
          fullDescription: "Follow in the footsteps of James Joyce, Oscar Wilde, and other Irish literary giants through Dublin's historic streets and literary landmarks.",
          shortDescription: "Literary walking tour exploring Dublin's famous writers and their haunts.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (122 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (122 * 24 * 60 * 60 * 1000)
          }
        }
      ],
      minorEvents: [
        {
          title: "Guinness Storehouse Experience",
          fullDescription: "Learn about Ireland's most famous beer at the Guinness Storehouse, including a pint-pouring lesson and panoramic city views.",
          shortDescription: "Interactive Guinness experience with brewing history and city views.",
          interestType: "culinary",
          dateRange: {
            startDate: getStartTimestamp() + (123 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (123 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.guinness-storehouse.com/"
        },
        {
          title: "Trinity College & Book of Kells",
          fullDescription: "Visit Ireland's oldest university and see the famous Book of Kells, a beautifully illuminated medieval manuscript.",
          shortDescription: "Historic Trinity College visit with the famous Book of Kells exhibition.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (124 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (124 * 24 * 60 * 60 * 1000)
          }
        }
      ]
    },
    {
      imageUrl: "https://source.unsplash.com/random/800x600/?vienna-classical-music,coffee-house",
      title: "Vienna: Classical Music & Coffeehouse Culture",
      description: "Experience Vienna's imperial grandeur through classical concerts, traditional coffeehouses, and Habsburg architecture.",
      city: "Vienna, Austria",
      dateRange: {
        startDate: getStartTimestamp() + (130 * 24 * 60 * 60 * 1000),
        endDate: getEndTimestamp(135)
      },
      keyEvents: [
        {
          title: "Vienna State Opera Performance",
          fullDescription: "Attend a world-class opera or ballet performance at the prestigious Vienna State Opera, one of the world's leading opera houses.",
          shortDescription: "Classical opera or ballet performance at the renowned Vienna State Opera.",
          interestType: "concerts",
          dateRange: {
            startDate: getStartTimestamp() + (131 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (131 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.wiener-staatsoper.at/"
        },
        {
          title: "Schönbrunn Palace & Gardens Tour",
          fullDescription: "Explore the magnificent Schönbrunn Palace, former imperial summer residence, with its opulent rooms and beautiful baroque gardens.",
          shortDescription: "Imperial palace tour at the magnificent Schönbrunn Palace.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (132 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (132 * 24 * 60 * 60 * 1000)
          }
        }
      ],
      minorEvents: [
        {
          title: "Traditional Viennese Coffeehouse Experience",
          fullDescription: "Experience Vienna's famous coffeehouse culture at historic establishments like Café Central or Café Sacher, with traditional pastries and coffee.",
          shortDescription: "Traditional coffeehouse experience with Viennese pastries and coffee culture.",
          interestType: "culinary",
          dateRange: {
            startDate: getStartTimestamp() + (133 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (133 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.cafecentral.wien/"
        },
        {
          title: "Belvedere Palace & Klimt Collection",
          fullDescription: "Visit the Belvedere Palace to see Gustav Klimt's famous paintings including 'The Kiss' and other Austrian art masterpieces.",
          shortDescription: "Art museum visit featuring Klimt's masterpieces at Belvedere Palace.",
          interestType: "artDesign",
          dateRange: {
            startDate: getStartTimestamp() + (134 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (134 * 24 * 60 * 60 * 1000)
          }
        }
      ]
    },
    {
      imageUrl: "https://source.unsplash.com/random/800x600/?cape-town-jazz,wine-tasting",
      title: "Cape Town: Jazz Heritage & Wine Country",
      description: "Discover Cape Town's vibrant jazz scene and world-renowned wine regions with cultural tours and tastings.",
      city: "Cape Town, South Africa",
      dateRange: {
        startDate: getStartTimestamp() + (140 * 24 * 60 * 60 * 1000),
        endDate: getEndTimestamp(145)
      },
      keyEvents: [
        {
          title: "Cape Town International Jazz Festival",
          fullDescription: "Experience Africa's grandest gathering of jazz musicians with local and international artists performing across multiple stages.",
          shortDescription: "Major jazz festival featuring local and international artists.",
          interestType: "concerts",
          dateRange: {
            startDate: getStartTimestamp() + (141 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (142 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.capetownjazzfest.com/"
        },
        {
          title: "Stellenbosch Wine Region Tour",
          fullDescription: "Explore the historic Stellenbosch wine region with tastings at award-winning wineries and scenic vineyard tours.",
          shortDescription: "Wine tasting tour in the prestigious Stellenbosch wine region.",
          interestType: "culinary",
          dateRange: {
            startDate: getStartTimestamp() + (143 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (143 * 24 * 60 * 60 * 1000)
          }
        }
      ],
      minorEvents: [
        {
          title: "Table Mountain Cable Car & Sunset",
          fullDescription: "Take the cable car up Table Mountain for panoramic views of Cape Town and watch the sunset over the Atlantic Ocean.",
          shortDescription: "Table Mountain cable car ride with spectacular sunset views.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (144 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (144 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.tablemountain.net/"
        },
        {
          title: "Bo-Kaap Cultural Walking Tour",
          fullDescription: "Explore the colorful Bo-Kaap neighborhood, learning about Cape Malay culture, history, and traditional cooking.",
          shortDescription: "Cultural walking tour through the vibrant Bo-Kaap neighborhood.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (145 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (145 * 24 * 60 * 60 * 1000)
          }
        }
      ]
    },
    {
      imageUrl: "https://source.unsplash.com/random/800x600/?montreal-jazz-festival,poutine",
      title: "Montreal: Jazz Festival & French-Canadian Culture",
      description: "Experience Montreal's world-famous jazz festival and unique French-Canadian culture with music, food, and historic neighborhoods.",
      city: "Montreal, Canada",
      dateRange: {
        startDate: getStartTimestamp() + (150 * 24 * 60 * 60 * 1000),
        endDate: getEndTimestamp(155)
      },
      keyEvents: [
        {
          title: "Montreal International Jazz Festival",
          fullDescription: "Attend the world's largest jazz festival with over 500 concerts featuring international jazz legends and emerging artists.",
          shortDescription: "World's largest jazz festival with 500+ concerts and international artists.",
          interestType: "concerts",
          dateRange: {
            startDate: getStartTimestamp() + (151 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (155 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.montrealjazzfest.com/"
        },
        {
          title: "Old Montreal Historic Walking Tour",
          fullDescription: "Explore the cobblestone streets of Old Montreal, visiting historic sites, churches, and learning about French colonial history.",
          shortDescription: "Historic walking tour through charming Old Montreal's cobblestone streets.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (152 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (152 * 24 * 60 * 60 * 1000)
          }
        }
      ],
      minorEvents: [
        {
          title: "Quebec Cuisine & Poutine Tasting Tour",
          fullDescription: "Sample authentic Quebec cuisine including poutine, tourtière, and maple syrup treats on a guided food tour.",
          shortDescription: "Quebec cuisine tour featuring poutine and traditional French-Canadian dishes.",
          interestType: "culinary",
          dateRange: {
            startDate: getStartTimestamp() + (153 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (153 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.foodtourscanada.com/"
        },
        {
          title: "Mount Royal Park & City Views",
          fullDescription: "Hike or take the bus up Mount Royal for panoramic views of Montreal and explore the park designed by Frederick Law Olmsted.",
          shortDescription: "Mount Royal park visit with panoramic city views and nature walks.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (154 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (154 * 24 * 60 * 60 * 1000)
          }
        }
      ]
    },
    {
      imageUrl: "https://source.unsplash.com/random/800x600/?edinburgh-festival,scottish-whisky",
      title: "Edinburgh: Festival Fringe & Scottish Traditions",
      description: "Experience Edinburgh's world-famous Festival Fringe and Scottish cultural traditions with whisky tastings and historic tours.",
      city: "Edinburgh, Scotland",
      dateRange: {
        startDate: getStartTimestamp() + (160 * 24 * 60 * 60 * 1000),
        endDate: getEndTimestamp(165)
      },
      keyEvents: [
        {
          title: "Edinburgh Festival Fringe",
          fullDescription: "Attend the world's largest arts festival with thousands of performances including comedy, theater, music, and dance.",
          shortDescription: "World's largest arts festival with comedy, theater, and music performances.",
          interestType: "concerts",
          dateRange: {
            startDate: getStartTimestamp() + (161 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (165 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.edfringe.com/"
        },
        {
          title: "Edinburgh Castle & Royal Mile Tour",
          fullDescription: "Explore the iconic Edinburgh Castle perched on an extinct volcano and walk down the historic Royal Mile.",
          shortDescription: "Historic tour of Edinburgh Castle and the famous Royal Mile.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (162 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (162 * 24 * 60 * 60 * 1000)
          }
        }
      ],
      minorEvents: [
        {
          title: "Scottish Whisky Tasting Experience",
          fullDescription: "Learn about Scottish whisky production and taste different regional varieties at a traditional whisky bar.",
          shortDescription: "Scottish whisky tasting with regional varieties and production insights.",
          interestType: "culinary",
          dateRange: {
            startDate: getStartTimestamp() + (163 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (163 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.scotchwhiskyexperience.co.uk/"
        },
        {
          title: "Arthur's Seat Hike & City Views",
          fullDescription: "Hike up Arthur's Seat, Edinburgh's highest peak, for spectacular views of the city and surrounding Scottish countryside.",
          shortDescription: "Hike up Arthur's Seat for panoramic views of Edinburgh and Scotland.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (164 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (164 * 24 * 60 * 60 * 1000)
          }
        }
      ]
    },
    {
      imageUrl: "https://source.unsplash.com/random/800x600/?prague-classical-music,czech-beer",
      title: "Prague: Classical Concerts & Czech Beer Culture",
      description: "Discover Prague's musical heritage and famous beer culture with classical concerts in historic venues and traditional breweries.",
      city: "Prague, Czech Republic",
      dateRange: {
        startDate: getStartTimestamp() + (170 * 24 * 60 * 60 * 1000),
        endDate: getEndTimestamp(175)
      },
      keyEvents: [
        {
          title: "Classical Concert in St. Vitus Cathedral",
          fullDescription: "Attend a classical music concert in the stunning Gothic St. Vitus Cathedral, featuring works by Czech composers like Dvořák.",
          shortDescription: "Classical concert in the magnificent Gothic St. Vitus Cathedral.",
          interestType: "concerts",
          dateRange: {
            startDate: getStartTimestamp() + (171 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (171 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.praguecastle.cz/"
        },
        {
          title: "Prague Castle & Charles Bridge Tour",
          fullDescription: "Explore the largest ancient castle complex in the world and walk across the historic Charles Bridge with its baroque statues.",
          shortDescription: "Historic tour of Prague Castle and the iconic Charles Bridge.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (172 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (172 * 24 * 60 * 60 * 1000)
          }
        }
      ],
      minorEvents: [
        {
          title: "Czech Beer Tasting & Brewery Tour",
          fullDescription: "Visit traditional Czech breweries and taste famous Czech beers including Pilsner Urquell and Budweiser Budvar.",
          shortDescription: "Czech beer tasting tour featuring famous local breweries.",
          interestType: "culinary",
          dateRange: {
            startDate: getStartTimestamp() + (173 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (173 * 24 * 60 * 60 * 1000)
          },
          eventWebsite: "https://www.pilsner-urquell.com/"
        },
        {
          title: "Old Town Square & Astronomical Clock",
          fullDescription: "Visit Prague's beautiful Old Town Square and watch the famous Astronomical Clock's hourly show with moving apostles.",
          shortDescription: "Old Town Square visit with the famous medieval Astronomical Clock.",
          interestType: "localCulture",
          dateRange: {
            startDate: getStartTimestamp() + (174 * 24 * 60 * 60 * 1000),
            endDate: getStartTimestamp() + (174 * 24 * 60 * 60 * 1000)
          }
        }
      ]
    }
  ];

  console.log('📊 Total available bundles:', allMockBundles.length);

  // Filter out existing bundles (using title for identification since no id)
  const existingTitles = new Set(existingBundles.map(b => b.title));
  const availableBundles = allMockBundles.filter(bundle => !existingTitles.has(bundle.title));

  if (availableBundles.length === 0) {
    console.log('🤖 [MOCK] No new bundles available after filtering - all bundles already shown');
    return [];
  }

  // For pagination: return exactly 3 bundles per call
  const maxBundlesPerCall = Math.min(3, availableBundles.length);
  const selectedBundles: TripBundle[] = [];
  const usedIndices = new Set<number>();

  while (selectedBundles.length < maxBundlesPerCall) {
    const randomIndex = Math.floor(Math.random() * availableBundles.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      selectedBundles.push(availableBundles[randomIndex]);
    }
  }

  console.log(`🤖 [MOCK] Generated ${selectedBundles.length} trip bundles:`, selectedBundles.map(b => b.title));
  console.log(`📈 Pagination: ${availableBundles.length} available, returning ${selectedBundles.length}`);
  return selectedBundles;
};
