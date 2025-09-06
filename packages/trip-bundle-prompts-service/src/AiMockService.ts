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
    }
  ];

  // Filter out existing bundles (using title for identification since no id)
  const existingTitles = new Set(existingBundles.map(b => b.title));
  const availableBundles = allMockBundles.filter(bundle => !existingTitles.has(bundle.title));

  if (availableBundles.length === 0) {
    console.log('🤖 [MOCK] No new bundles available after filtering');
    return [];
  }

  // Randomly select up to 4 bundles
  const maxBundles = Math.min(4, availableBundles.length);
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
